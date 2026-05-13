# Vibecoding PZN Backend

Proyek backend berbasis **Bun**, **ElysiaJS**, **Drizzle ORM**, dan **MySQL**.

## Struktur Proyek
- `src/index.ts` - Entry point utama aplikasi.
- `src/routes/` - Router modular untuk endpoint API.
- `src/db/` - Konfigurasi koneksi database dan skema ORM.

## Cara Menjalankan

### Persiapan
Pastikan Anda telah menginstal [Bun](https://bun.sh).

```bash
# Instalasi dependensi
bun install
```

### Menjalankan Server Development
```bash
bun run dev
```

Server akan berjalan pada `http://localhost:3000`.
