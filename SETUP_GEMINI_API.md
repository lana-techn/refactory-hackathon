# Setup Gemini API Key

Untuk menggunakan fitur Spec & Ship, Anda perlu API key dari Google Gemini.

## Langkah 1: Dapatkan API Key

1. Buka https://makersuite.google.com/app/apikey
2. Login dengan akun Google Anda
3. Klik "Create API Key"
4. Copy API key yang dihasilkan

## Langkah 2: Konfigurasi API Key

### Opsi A: Menggunakan Environment Variable (Recommended)

```bash
export GEMINI_API_KEY='your-api-key-here'
yarn start
```

### Opsi B: Menggunakan app-config.local.yaml

Edit file `app-config.local.yaml`:

```yaml
gemini:
  apiKey: 'your-api-key-here'
```

Kemudian restart server:

```bash
yarn start
```

## Langkah 3: Test

1. Buka http://localhost:3000/
2. Klik "Spec & Ship" di sidebar
3. Masukkan deskripsi API Anda
4. Klik "Generate Specification"

## Troubleshooting

Jika masih error 403:
- Pastikan API key sudah benar
- Pastikan API key sudah aktif di Google Cloud Console
- Restart development server setelah set API key
