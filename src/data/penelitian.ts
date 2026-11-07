import type { RisetItem } from "@/types"

const dummy: RisetItem[] = [
  { id: "1", judul: "Sistem Prediksi Penyakit Domba Berbasis Fuzzy Mamdani pada Peternakan Garum", ketua: "Dr. Ahmad Rifai, M.Kom", anggota: ["Siti Nurhaliza, M.Kom"], tahun: 2026, sumberDana: "Internal Kampus" },
  { id: "2", judul: "Implementasi IoT untuk Monitoring Kualitas Air Kolam Ikan", ketua: "Budi Santoso, M.T", anggota: ["Rina Wulandari, M.Kom", "Fajar Nugroho, M.T"], tahun: 2026, sumberDana: "Hibah Kemendikbud" },
  { id: "3", judul: "Analisis Sentimen Ulasan Produk UMKM Menggunakan Naive Bayes", ketua: "Dewi Lestari, M.Kom", tahun: 2025, sumberDana: "Internal Kampus" },
  { id: "4", judul: "Rancang Bangun Sistem Informasi Akademik Berbasis Microservice", ketua: "Agus Prasetyo, M.T", anggota: ["Budi Santoso, M.T"], tahun: 2025, sumberDana: "Hibah Kemendikbud" },
  { id: "5", judul: "Deteksi Dini Hama Tanaman Padi Menggunakan Convolutional Neural Network", ketua: "Siti Nurhaliza, M.Kom", anggota: ["Dewi Lestari, M.Kom"], tahun: 2024, sumberDana: "Mandiri" },
  { id: "6", judul: "Optimasi Rute Distribusi Logistik dengan Algoritma Genetika", ketua: "Fajar Nugroho, M.T", tahun: 2024, sumberDana: "Internal Kampus" },
  { id: "7", judul: "Keamanan Jaringan Nirkabel Kampus Menggunakan Intrusion Detection System", ketua: "Rina Wulandari, M.Kom", anggota: ["Agus Prasetyo, M.T"], tahun: 2023, sumberDana: "Hibah Kemendikbud" },
]

export async function getPenelitian(): Promise<RisetItem[]> {
  return dummy
}