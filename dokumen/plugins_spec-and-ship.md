# Dokumentasi Teknis Folder `plugins/spec-and-ship`

Folder `plugins/spec-and-ship` adalah plugin frontend custom yang terisolasi.

## Detail Teknis

### Identitas Plugin
- **ID**: `spec-and-ship`
- **Role**: `frontend-plugin`
- **Package Name**: `@internal/backstage-plugin-spec-and-ship`

### Dependensi (`package.json`)
- **Backstage UI**:
  - `@backstage/core-components`: Komponen standar (Page, Header, Content, dll).
  - `@backstage/core-plugin-api`: API untuk interaksi plugin (useApi, createApiRef).
  - `@backstage/theme`: Variabel tema.
- **Material UI**: Versi 4 (`@material-ui/core`, `@material-ui/icons`, `@material-ui/lab`).
- **Utilities**:
  - `jspdf`: Kemungkinan digunakan untuk generate PDF dari spesifikasi.
  - `react-use`: Koleksi hooks React.

### Struktur Pengembangan
- **`src/plugin.ts`**:
  - Mengekspor instance plugin yang dibuat dengan `createPlugin`.
  - Mengekspor komponen routable (misalnya `SpecAndShipPage`).
- **`dev/`**:
  - Menyediakan lingkungan dev terisolasi untuk merender plugin tanpa menjalankan seluruh app utama.
