# Dokumentasi Teknis Folder `packages/backend`

Folder `packages/backend` adalah paket Backend Node.js yang menjalankan server Backstage.

## Detail Teknis

### Dependensi Utama (`package.json`)
- **Core**:
  - `@backstage/backend-defaults`: Konfigurasi default backend.
  - `@backstage/config`: Manajemen konfigurasi (`app-config.yaml`).
- **Plugins (Backend)**:
  - `@backstage/plugin-auth-backend`: Autentikasi (termasuk module `github` dan `guest`).
  - `@backstage/plugin-catalog-backend`: Backend katalog (termasuk module `scaffolder-entity-model`).
  - `@backstage/plugin-scaffolder-backend`: Backend scaffolder.
  - `@backstage/plugin-techdocs-backend`: Backend TechDocs.
  - `@backstage/plugin-kubernetes-backend`: Backend Kubernetes.
  - `@backstage/plugin-search-backend`: Backend pencarian (Postgres & TechDocs modules).
- **Plugins (Custom)**:
  - `@internal/backstage-plugin-spec-and-ship-backend`: Plugin backend custom (workspace dependency).
- **Database**:
  - `pg`: Driver PostgreSQL.
  - `better-sqlite3`: Database SQLite untuk development/testing.

### Konfigurasi Runtime
- **Main Entry**: `dist/index.cjs.js` (setelah build).
- **Types**: `src/index.ts`.
- **Role**: `backend` (didefinisikan di properti `backstage`).

### Docker Support
- **Dockerfile**:
  - Multi-stage build.
  - Menggunakan `node:18` (atau versi LTS yang sesuai) sebagai base image.
  - Menyalin `yarn.lock` dan `package.json` untuk install dependensi.
  - Menyalin hasil build paket (`packages/backend/dist/bundle.tar.gz`).
