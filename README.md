# Spec & Ship App

Spec & Ship adalah platform developer portal yang dibangun di atas [Backstage](https://backstage.io). Aplikasi ini dirancang untuk membantu tim pengembang dalam menspesifikasikan dan mengirimkan perangkat lunak dengan lebih efisien.

## Daftar Isi

- [Prasyarat](#prasyarat)
- [Instalasi](#instalasi)
- [Menjalankan Aplikasi](#menjalankan-aplikasi)
- [Struktur Proyek](#struktur-proyek)
- [Konfigurasi](#konfigurasi)
- [Fitur](#fitur)
- [Pengembangan](#pengembangan)

## Prasyarat

Sebelum memulai, pastikan Anda telah menginstal perangkat lunak berikut:

- **Node.js**: Versi 20 atau 22 (sesuai `package.json`).
- **Yarn**: Versi 1.x atau 4.x (disarankan menggunakan `yarn` yang disertakan dalam proyek).
- **Docker**: Diperlukan untuk beberapa fitur backend dan TechDocs.
- **Git**: Untuk manajemen versi.

## Instalasi

1.  Clone repositori ini:
    ```bash
    git clone <repository-url>
    cd spec-and-ship-app
    ```

2.  Instal dependensi menggunakan Yarn:
    ```bash
    yarn install
    ```
    Perintah ini akan menginstal semua dependensi untuk frontend, backend, dan semua plugin yang ada di dalam monorepo.

## Menjalankan Aplikasi

Untuk menjalankan aplikasi dalam mode pengembangan (development):

```bash
yarn start
```

Perintah ini akan menjalankan:
- **Frontend** (App): Biasanya berjalan di `http://localhost:3000`
- **Backend**: Biasanya berjalan di `http://localhost:7007`

Setelah aplikasi berjalan, buka browser dan akses `http://localhost:3000`.

## Struktur Proyek

Proyek ini adalah monorepo yang dikelola menggunakan Yarn Workspaces. Berikut adalah struktur utamanya:

- **`packages/`**: Berisi paket inti aplikasi.
    - **`app/`**: Kode sumber frontend aplikasi Backstage.
    - **`backend/`**: Kode sumber backend aplikasi Backstage.
- **`plugins/`**: Berisi plugin kustom yang dikembangkan khusus untuk proyek ini.
    - **`spec-and-ship/`**: Plugin frontend untuk fitur "Spec & Ship".
    - **`spec-and-ship-backend/`**: Plugin backend untuk fitur "Spec & Ship".
- **`app-config.yaml`**: File konfigurasi utama untuk aplikasi.

## Konfigurasi

Konfigurasi aplikasi terdapat di file `app-config.yaml`. Beberapa konfigurasi penting meliputi:

- **`app.baseUrl`**: URL dasar frontend.
- **`backend.baseUrl`**: URL dasar backend.
- **`backend.database`**: Konfigurasi database (default menggunakan `better-sqlite3` in-memory untuk pengembangan).
- **`integrations`**: Konfigurasi integrasi dengan layanan pihak ketiga seperti GitHub.

### Token GitHub

Untuk fitur integrasi GitHub (seperti membaca katalog dari GitHub), Anda perlu menyediakan Personal Access Token (PAT) di environment variable `GITHUB_TOKEN`.

```bash
export GITHUB_TOKEN=ghp_your_token_here
yarn dev
```

## Penjelasan Fitur

Berikut adalah penjelasan mendalam mengenai fitur-fitur utama yang tersedia dalam aplikasi ini:

### 1. Software Catalog (Katalog Perangkat Lunak)
**Lokasi:** `/catalog`

Software Catalog adalah pusat dari Backstage. Fitur ini memungkinkan Anda untuk:
- **Melacak Kepemilikan:** Mengetahui siapa pemilik dari setiap layanan, website, atau library.
- **Metadata Terpusat:** Menyimpan informasi penting seperti link ke source code, dokumentasi, dan status lifecycle (misalnya: production, experimental).
- **Visualisasi Ketergantungan:** Melihat hubungan antar komponen sistem.

### 2. Software Templates (Scaffolder)
**Lokasi:** `/create`

Fitur ini mempercepat pembuatan proyek baru dengan standar yang telah ditentukan.
- **Standarisasi:** Memastikan setiap proyek baru mengikuti best practices perusahaan.
- **Otomatisasi:** Secara otomatis membuat repositori, mengatur CI/CD, dan mendaftarkan proyek ke katalog.
- **Template:** Anda dapat memilih dari berbagai template yang tersedia (misalnya: React App, Spring Boot Service, dll).

### 3. TechDocs (Dokumentasi Teknis)
**Lokasi:** `/docs`

Pendekatan "Docs-like-code" untuk dokumentasi teknis.
- **Terintegrasi:** Dokumentasi ditulis dalam Markdown di samping kode sumber (di repositori yang sama).
- **Mudah Dibaca:** Backstage merender file Markdown tersebut menjadi situs dokumentasi yang rapi dan mudah dinavigasi.
- **Pencarian:** Dokumentasi dapat dicari melalui fitur pencarian global.

### 4. Spec & Ship Plugin
**Lokasi:** `/spec-and-ship`

Ini adalah plugin kustom yang sedang dikembangkan khusus untuk proyek ini.
- **Saat ini:** Menampilkan halaman contoh (boilerplate) yang berisi kartu informasi dan tabel pengguna dummy.
- **Tujuan:** Akan menjadi tempat utama untuk fitur spesifikasi dan pengiriman perangkat lunak (The Architect, The Validator, The Builder) di masa depan.

### 5. Search (Pencarian)
**Lokasi:** `/search`

Mesin pencari global yang memungkinkan Anda menemukan apa saja di dalam platform, termasuk:
- Komponen Katalog
- Dokumentasi TechDocs
- Pengguna dan Grup

## Pengembangan

### Menambahkan Plugin Baru

Untuk membuat plugin baru, jalankan perintah:

```bash
yarn new
```

Pilih "plugin" dan ikuti petunjuk di layar.

### Membangun Aplikasi (Build)

Untuk membangun aplikasi untuk produksi:

```bash
yarn build:all
```

Ini akan membangun paket frontend dan backend.

### Pengujian (Testing)

Untuk menjalankan unit test:

```bash
yarn test
```

Untuk menjalankan semua test termasuk coverage:

```bash
yarn test:all
```
