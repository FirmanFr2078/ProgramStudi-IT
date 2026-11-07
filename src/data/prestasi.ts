import type { Prestasi } from "@/types"

const dummy: Prestasi[] = [
  {
    id: "1",
    mahasiswa: ["Firlian Firman Syah", "Dimas Aji Pratama"],
    judul: "Lomba Inovasi Teknologi Mahasiswa Nasional (LITMN)",
    penyelenggara: "Kemendikbudristek",
    tingkat: "Nasional",
    peringkat: "Juara 2",
    tahun: 2026,
    pembimbing: "Dr. Bambang Setiawan, M.Kom.",
  },
  {
    id: "2",
    mahasiswa: ["Nabila Putri Ramadhani"],
    judul: "ASEAN Student IT Competition",
    penyelenggara: "ASEAN Student IT Alliance",
    tingkat: "Internasional",
    peringkat: "Juara 3",
    tahun: 2026,
    pembimbing: "Agus Prasetyo, M.Kom.",
  },
  {
    id: "3",
    mahasiswa: ["Rangga Saputra", "Yoga Pradana"],
    judul: "Hackathon Garuda Innovation Camp",
    penyelenggara: "PT Teknologi Nusantara",
    tingkat: "Nasional",
    peringkat: "Juara Harapan 1",
    tahun: 2025,
  },
  {
    id: "4",
    mahasiswa: ["Dewi Kartika Sari"],
    judul: "PKM Karsa Cipta (PKM-KC) Pendanaan Belmawa",
    penyelenggara: "Belmawa Kemendikbudristek",
    tingkat: "Nasional",
    peringkat: "Pendanaan Nasional",
    tahun: 2025,
    pembimbing: "Dewi Lestari, M.Kom.",
  },
  {
    id: "5",
    mahasiswa: ["Bayu Firmansyah"],
    judul: "Lomba Desain UI/UX Tingkat Jawa Timur",
    penyelenggara: "Himpunan Mahasiswa Informatika Jawa Timur",
    tingkat: "Provinsi",
    peringkat: "Juara 1",
    tahun: 2025,
  },
  {
    id: "6",
    mahasiswa: ["Tim Esports TI"],
    judul: "Turnamen Mobile Legends Antar Kampus se-Blitar Raya",
    penyelenggara: "Pemerintah Kabupaten Blitar",
    tingkat: "Provinsi",
    peringkat: "Juara 1",
    tahun: 2026,
  },
  {
    id: "7",
    mahasiswa: ["Alfi Nur Hidayah"],
    judul: "English Debate Competition",
    penyelenggara: "English Club Universitas Islam Balitar",
    tingkat: "Kampus",
    peringkat: "Juara 1",
    tahun: 2026,
  },
  {
    id: "8",
    mahasiswa: ["Rizal Maulana"],
    judul: "Capture The Flag (CTF) Keamanan Siber Nasional",
    penyelenggara: "ID-CERT",
    tingkat: "Nasional",
    peringkat: "Top 10",
    tahun: 2024,
    pembimbing: "Siti Nurhaliza, M.T.",
  },
]

export async function getPrestasi(): Promise<Prestasi[]> {
  return dummy
}