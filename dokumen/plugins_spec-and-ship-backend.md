# Dokumentasi Teknis Folder `plugins/spec-and-ship-backend`

Folder `plugins/spec-and-ship-backend` adalah plugin backend custom yang menyediakan logika bisnis untuk fitur Spec & Ship.

## Detail Teknis

### Identitas Plugin
- **ID**: `spec-and-ship`
- **Role**: `backend-plugin`
- **Package Name**: `@internal/backstage-plugin-spec-and-ship-backend`

### Dependensi (`package.json`)
- **Backstage Backend API**:
  - `@backstage/backend-plugin-api`: API sistem plugin backend baru.
  - `@backstage/backend-defaults`: Default services (logger, config, dll).
  - `@backstage/plugin-catalog-node`: Interaksi dengan katalog dari backend.
- **AI Integration**:
  - `@google/generative-ai`: SDK untuk mengakses Google Gemini API.
- **Web Server**:
  - `express`: Framework web server.
  - `express-promise-router`: Router wrapper untuk async handler.
- **Validation**:
  - `zod`: Schema validation library (digunakan untuk memvalidasi request body atau input AI).

### Fungsionalitas Utama
- **Router**: Mengekspos endpoint HTTP (kemungkinan via `express`).
- **AI Service**: Menggunakan `@google/generative-ai` untuk memproses prompt dan menghasilkan spesifikasi software.
- **Catalog Integration**: Mungkin membaca atau menulis data ke Backstage Catalog.
