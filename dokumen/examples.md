# Dokumentasi Teknis Folder `examples`

Folder `examples` berisi manifest YAML yang mendefinisikan entitas Backstage dan template Scaffolder. File-file ini menggunakan format deskriptor standar Backstage.

## Detail Teknis

### 1. `entities.yaml`
Mendefinisikan entitas statis untuk katalog.
- **API Version**: `backstage.io/v1alpha1`
- **Kinds**:
  - `System`: Mengelompokkan komponen terkait (contoh: `examples`).
  - `Component`: Unit perangkat lunak (contoh: `example-website`).
    - `type`: `website`
    - `lifecycle`: `experimental`
    - `providesApis`: `['example-grpc-api']`
  - `API`: Definisi antarmuka (contoh: `example-grpc-api`).
    - `type`: `grpc`
    - `definition`: Menggunakan syntax `proto3`.

### 2. `spec-and-ship-template.yaml`
Template Scaffolder untuk fitur "Spec & Ship".
- **API Version**: `scaffolder.backstage.io/v1beta3`
- **Kind**: `Template`
- **Parameters**:
  - `name`: String (Nama komponen).
  - `content`: String (Isi spesifikasi, widget textarea).
- **Steps**:
  - `spec-and-ship:write-file`: Custom action untuk menulis file spesifikasi.
  - `debug:log`: Logging standar.
- **Output**:
  - Menyediakan link ke file spesifikasi yang dibuat.

### 3. `org.yaml`
(Diasumsikan berdasarkan standar)
- **API Version**: `backstage.io/v1alpha1`
- **Kinds**: `User`, `Group`.
- **Fungsi**: Memetakan struktur organisasi untuk kepemilikan entitas (`owner`).
