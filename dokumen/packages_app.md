# Dokumentasi Teknis Folder `packages/app`

Folder `packages/app` adalah paket Frontend React yang dibangun di atas framework Backstage.

## Detail Teknis

### Dependensi Utama (`package.json`)
- **Core**:
  - `@backstage/core-app-api`: API inti aplikasi.
  - `@backstage/core-components`: Komponen UI dasar.
  - `@backstage/theme`: Tema dan styling.
- **Plugins (Built-in)**:
  - `@backstage/plugin-catalog`: Fitur katalog software.
  - `@backstage/plugin-scaffolder`: Fitur template dan scaffolding.
  - `@backstage/plugin-techdocs`: Dokumentasi teknis.
  - `@backstage/plugin-kubernetes`: Integrasi Kubernetes.
- **Plugins (Custom)**:
  - `@internal/backstage-plugin-spec-and-ship`: Plugin frontend custom untuk fitur Spec & Ship (workspace dependency).
- **React**: Versi 18.x (`react`, `react-dom`).
- **Router**: `react-router` v6.

### Konfigurasi Build
- **Scripts**: Menggunakan `backstage-cli` untuk start, build, test, dan lint.
- **Browserslist**:
  - Production: `>0.2%`, `not dead`, `not op_mini all`.
  - Development: Versi terakhir Chrome, Firefox, Safari.

### Struktur Kode (`src/`)
- **`App.tsx`**:
  - Mengonfigurasi `AppRouter`.
  - Mendaftarkan plugin ke dalam `FlatRoutes`.
  - Mengatur `Root` layout (Sidebar, Header).
- **`apis.ts`**:
  - Mendaftarkan implementasi API utility (misalnya `scmAuthApiRef`).
