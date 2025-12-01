# Dokumentasi Teknis Folder `kubernetes`

Folder `kubernetes` berisi manifest YAML standar untuk deployment aplikasi ke cluster Kubernetes.

## Detail Teknis

### 1. `deployment.yaml`
Resource `Deployment` untuk mengelola Pods aplikasi.
- **API Version**: `apps/v1`
- **Metadata**:
  - `name`: `spec-and-ship`
  - `namespace`: `default`
- **Spec**:
  - `replicas`: 1 (Single instance).
  - `selector`: `app: spec-and-ship`.
  - **Container**:
    - `image`: `spec-and-ship-backend:latest`
    - `imagePullPolicy`: `IfNotPresent` (Gunakan image lokal jika ada).
    - `ports`: 7007 (Backend port).
    - **Environment Variables**:
      - `NODE_ENV`: `production`
      - `GEMINI_API_KEY`: Diambil dari Secret `spec-and-ship-secrets`.
    - **Resources**:
      - Requests: CPU 250m, Memory 512Mi.
      - Limits: CPU 1000m, Memory 1Gi.

### 2. `service.yaml`
Resource `Service` untuk mengekspos aplikasi.
- **Fungsi**: Load balancing dan service discovery.
- **Selector**: Mencocokkan label `app: spec-and-ship` dari deployment.
- **Ports**: Mapping port eksternal ke port container (kemungkinan port 80/443 ke 7007).
