# Dokumentasi Detail Riwayat Pembangunan Aplikasi Spec & Ship

Dokumen ini merupakan catatan teknis mendalam mengenai proses pembangunan aplikasi **Spec & Ship** dari awal hingga kondisi saat ini. Aplikasi ini adalah portal pengembang berbasis **Backstage** yang mengintegrasikan **Google Gemini AI** untuk membantu pembuatan spesifikasi perangkat lunak.

## 1. Arsitektur & Teknologi

Aplikasi ini menggunakan arsitektur monorepo standar Backstage dengan teknologi berikut:

*   **Core Framework**: [Backstage](https://backstage.io) (v1.24.0+)
*   **Package Manager**: Yarn (v3/v4) dengan Workspaces.
*   **Frontend**: React, Material UI v5.
*   **Backend**: Node.js, Express, `better-sqlite3` (dev), `pg` (prod).
*   **AI Integration**: `@google/generative-ai` SDK.
*   **Containerization**: Docker (Multi-stage build).
*   **Orchestration**: Kubernetes.

---

## 2. Langkah-Langkah Pembangunan Detail

### Tahap 1: Inisialisasi Proyek (Scaffolding)

Proyek dimulai dengan men-generate kerangka aplikasi Backstage. Ini memberikan struktur dasar monorepo yang memisahkan frontend (`app`) dan backend.

**Perintah Eksekusi:**
```bash
npx @backstage/create-app@latest
# App Name: spec-and-ship-app
# Database: SQLite (default)
```

**Struktur yang Dihasilkan:**
*   `packages/app`: Berisi kode React untuk frontend. Entry point di `src/App.tsx`.
*   `packages/backend`: Berisi kode Node.js untuk backend. Entry point di `src/index.ts`.
*   `yarn.lock`: Mengunci versi dependensi untuk konsistensi.

### Tahap 2: Pembuatan Backend Plugin (`spec-and-ship-backend`)

Plugin ini bertindak sebagai jembatan antara frontend Backstage dan Google Gemini API.

**1. Pembuatan Plugin:**
```bash
yarn new --select backend-plugin
# Name: spec-and-ship
```

**2. Implementasi Service (`plugins/spec-and-ship-backend/src/service/router.ts`):**
Kami membuat router Express yang menangani request POST ke `/generate`.

```typescript
// Cuplikan kode implementasi router
import { GoogleGenerativeAI } from '@google/generative-ai';

// ... setup router ...

router.post('/generate', async (req, res) => {
  const { prompt } = req.body;
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  res.json({ text });
});
```

**3. Registrasi di Backend Utama (`packages/backend/src/index.ts`):**
Agar plugin aktif, ia harus didaftarkan ke backend system.

```typescript
// packages/backend/src/index.ts
import specAndShip from './plugins/spec-and-ship';
// ...
const specAndShipEnv = useHotMemoize(module, () => createEnv('spec-and-ship'));
apiRouter.use('/spec-and-ship', await specAndShip(specAndShipEnv));
```

### Tahap 3: Pembuatan Frontend Plugin (`spec-and-ship`)

Plugin ini menyediakan antarmuka bagi pengguna untuk berinteraksi dengan fitur AI.

**1. Pembuatan Plugin:**
```bash
yarn new --select plugin
# Name: spec-and-ship
```

**2. Pembuatan Komponen UI:**
Kami membuat komponen React yang memiliki form input untuk prompt dan area untuk menampilkan hasil markdown.

*   `src/components/ExampleComponent/ExampleComponent.tsx`: Komponen utama.
*   Menggunakan `useApi` dan `fetchApiRef` dari `@backstage/core-plugin-api` untuk memanggil backend.

**3. Integrasi ke App (`packages/app/src/App.tsx`):**
Menambahkan rute agar halaman bisa diakses.

```tsx
// packages/app/src/App.tsx
import { SpecAndShipPage } from '@internal/backstage-plugin-spec-and-ship';

// ... di dalam FlatRoutes ...
<Route path="/spec-and-ship" element={<SpecAndShipPage />} />
```

### Tahap 4: Konfigurasi & Integrasi

**1. `app-config.yaml`:**
Menambahkan konfigurasi proxy (jika diperlukan) dan memastikan backend mendengarkan pada port yang benar (7007).

**2. Sidebar (`packages/app/src/components/Root/Root.tsx`):**
Menambahkan item menu navigasi.

```tsx
<SidebarItem icon={LibraryBooks} to="spec-and-ship" text="Spec & Ship" />
```

### Tahap 5: Persiapan Deployment (Docker)

Kami menggunakan Dockerfile multi-stage untuk membuat image yang ringan dan aman.

**Analisis `packages/backend/Dockerfile`:**

*   **Stage 1 (skeleton)**: Mengisolasi `package.json` untuk caching layer yarn install.
*   **Stage 2 (build)**: Menjalankan `yarn install` dan `yarn build`. Hasil build frontend (`packages/app/dist`) akan disalin ke backend.
*   **Stage 3 (runner)**: Image final berbasis `node:18-bookworm-slim`. Hanya menyertakan hasil build dan dependensi produksi.

**Perintah Build:**
```bash
yarn build-image
```

### Tahap 6: Orkestrasi (Kubernetes)

Deployment ke Kubernetes melibatkan dua komponen utama: Deployment dan Service.

**1. Deployment (`kubernetes/deployment.yaml`):**
File ini mengatur Pod. Poin penting:
*   `image: spec-and-ship-backend:latest`: Menggunakan image yang kita build.
*   `env`: Mengambil `GEMINI_API_KEY` dari Secret Kubernetes untuk keamanan. Jangan pernah hardcode API Key di sini!

```yaml
env:
  - name: GEMINI_API_KEY
    valueFrom:
      secretKeyRef:
        name: spec-and-ship-secrets
        key: GEMINI_API_KEY
```

**2. Service (`kubernetes/service.yaml`):**
File ini mengatur akses jaringan.
*   `type: LoadBalancer`: Meminta Cloud Provider (atau Minikube tunnel) untuk memberikan IP eksternal.
*   `port: 80`: Port yang dibuka ke publik.
*   `targetPort: 7007`: Port aplikasi backend Backstage.

---

## 3. Panduan Operasional

### Menjalankan Secara Lokal (Dev Mode)
Gunakan mode ini untuk pengembangan aktif. Hot-reload aktif.
```bash
yarn dev
```

### Menjalankan dengan Docker
Gunakan mode ini untuk menguji hasil build final.
```bash
# 1. Build Image
yarn build-image

# 2. Run Container (pastikan API Key tersedia)
docker run -e GEMINI_API_KEY=xxx -p 7007:7007 spec-and-ship-backend
```

### Deployment ke Kubernetes
Gunakan mode ini untuk produksi.

1.  **Buat Secret**:
    ```bash
    kubectl create secret generic spec-and-ship-secrets --from-literal=GEMINI_API_KEY=your_actual_api_key
    ```

2.  **Deploy**:
    ```bash
    kubectl apply -f kubernetes/deployment.yaml
    kubectl apply -f kubernetes/service.yaml
    ```

3.  **Verifikasi**:
    ```bash
    kubectl get pods
    # Tunggu hingga status Running
    ```

---

**Versi Dokumen**: 2.0 (Detail Teknis)
**Tanggal Update**: 3 Desember 2025
