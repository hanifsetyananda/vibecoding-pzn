# Panduan AI Agent (Gemini Flash & Claude)

File ini berisi instruksi khusus, panduan arsitektur, dan referensi *commands* untuk membantu model AI (terutama Gemini Flash dan Claude) dalam memahami struktur, menavigasi codebase, dan mengimplementasikan fitur baru pada proyek ini.

## Teknologi Utama
- **Runtime**: Bun (`bun`)
- **Web Framework**: ElysiaJS
- **ORM**: Drizzle ORM
- **Database**: MySQL

## Aturan Arsitektur & Struktur Folder

Aplikasi ini menggunakan pola arsitektur **Controller-Service** yang dimodifikasi sesuai konvensi ElysiaJS. Pisahkan tanggung jawab secara tegas:

1. **`src/routes/` (Layer Presentasi / Controller)**
   - **Tanggung Jawab**: Mendefinisikan endpoint API, menangani HTTP request/response, dan melakukan validasi input menggunakan TypeBox (`t` dari Elysia).
   - **Format File**: Harus berakhiran `-route.ts` (Contoh: `users-route.ts`).
   - **Aturan Tambahan**: Dilarang meletakkan logika bisnis atau interaksi langsung dengan database di folder ini.

2. **`src/services/` (Layer Bisnis)**
   - **Tanggung Jawab**: Menangani logika bisnis (business logic) utama aplikasi dan mengeksekusi query database menggunakan Drizzle ORM.
   - **Format File**: Harus berakhiran `-service.ts` (Contoh: `users-service.ts`).
   - **Aturan Tambahan**: Semua pengecekan aturan bisnis (seperti pengecekan duplikasi email, hashing password, dsb) harus dilakukan di layer ini. Layer ini akan dipanggil oleh file di dalam `src/routes/`.

3. **`src/db/` (Layer Database)**
   - `schema.ts`: Menyimpan seluruh definisi tabel Drizzle ORM. Pastikan tipe data yang didefinisikan sinkron dengan tabel MySQL.
   - `index.ts`: Inisialisasi pool database dan instance Drizzle ORM.

## Instruksi untuk AI Agent saat Mengimplementasikan Fitur

1. **Gunakan alat/perintah yang paling spesifik**:
   - Untuk mengedit file, manfaatkan *tool* bawaan agen Anda (misalnya `replace_file_content` atau `write_to_file`).
   - Hindari mengeksekusi `cat`, `sed`, atau `grep` secara manual di terminal bash jika agen Anda telah dilengkapi dengan *semantic search* atau *file viewer* native.

2. **Perubahan Database (Drizzle ORM)**:
   - Apabila Anda menambahkan/memodifikasi tabel di `src/db/schema.ts`, selalu ingatkan pengguna atau jalankan `bun run db:push` untuk menyinkronkan struktur ke MySQL lokal.

3. **Pengelolaan Error (Error Handling)**:
   - Gunakan blok `try...catch`. Di bagian service, *throw* error dengan pesan yang eksplisit (misal: `throw new Error("Pesan Error")`). Di bagian routes, tangkap (*catch*) error tersebut dan kembalikan JSON standar dengan format:
     ```json
     { "data": "pesan error dari service" }
     ```

## Perintah (Commands) Proyek

Berikut adalah kumpulan perintah Bun yang sering digunakan:

- **Instalasi Paket Baru**: `bun add <nama_paket>` (gunakan argumen `-d` untuk dev dependencies)
- **Menjalankan Server (Dev)**: `bun run dev` (otomatis menggunakan *hot-reload*)
- **Generate Migrasi Drizzle**: `bun run db:generate`
- **Push Skema ke Database**: `bun run db:push`

## Gaya Penulisan Kode (Code Style)
- Terapkan tipe data TypeScript secara ketat (*Strict TypeScript*).
- Gunakan `camelCase` untuk penamaan variabel dan fungsi, serta nama tabel/kolom pada Drizzle ORM yang dipetakan ke MySQL (contoh: `createdAt` yang dipetakan ke kolom `created_at`).
- Biasakan memberikan komentar yang ringkas namun informatif sebelum mendefinisikan blok fungsi/route yang penting.
