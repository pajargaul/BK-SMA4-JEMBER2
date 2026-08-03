<script setup lang="ts">
import { computed } from 'vue'
import { useDataStore } from '../../stores/data'
import SimpleChart from '../../components/SimpleChart.vue'
import LineChart from '../../components/LineChart.vue'

const data = useDataStore()

const demografiJurusan = computed(() => {
  const map: Record<string, number> = { MIPA: 0, IPS: 0, Bahasa: 0 }
  data.kelas.forEach(k => { map[k.jurusan] += k.jumlahSiswa })
  return [
    { label: 'MIPA', value: map.MIPA, color: '#10b981' },
    { label: 'IPS', value: map.IPS, color: '#2f639e' },
    { label: 'Bahasa', value: map.Bahasa, color: '#f59e0b' },
  ]
})

const demografiTingkat = computed(() => {
  const map: Record<string, number> = { X: 0, XI: 0, XII: 0 }
  data.kelas.forEach(k => { map[k.tingkat] += k.jumlahSiswa })
  return [
    { label: 'Kelas X', value: map.X, color: '#14b8a6' },
    { label: 'Kelas XI', value: map.XI, color: '#2f639e' },
    { label: 'Kelas XII', value: map.XII, color: '#f59e0b' },
  ]
})

const demografiJK = computed(() => {
  const l = data.siswa.filter(s => s.jenisKelamin === 'L').length
  const p = data.siswa.filter(s => s.jenisKelamin === 'P').length
  return [
    { label: 'Laki-laki', value: l, color: '#2f639e' },
    { label: 'Perempuan', value: p, color: '#ec4899' },
  ]
})

const absensiPerKelas = computed(() => {
  const map: Record<string, { sakit: number; izin: number; alpha: number }> = {}
  data.absensi.forEach(a => {
    if (!map[a.kelasNama]) map[a.kelasNama] = { sakit: 0, izin: 0, alpha: 0 }
    map[a.kelasNama].sakit += a.sakit
    map[a.kelasNama].izin += a.izin
    map[a.kelasNama].alpha += a.alpha
  })
  return Object.entries(map).map(([label, v]) => ({ label, ...v }))
})

const totalAbsensi = computed(() => {
  const sakit = data.absensi.reduce((s, a) => s + a.sakit, 0)
  const izin = data.absensi.reduce((s, a) => s + a.izin, 0)
  const alpha = data.absensi.reduce((s, a) => s + a.alpha, 0)
  return [
    { label: 'Sakit', value: sakit, color: '#f59e0b' },
    { label: 'Izin', value: izin, color: '#14b8a6' },
    { label: 'Alpha', value: alpha, color: '#ef4444' },
  ]
})

const nilaiTrend = computed(() => {
  const sorted = [...data.nilaiAkademik].sort((a, b) => b.rataRata - a.rataRata).slice(0, 8)
  return sorted.map(n => ({ label: n.siswaNama.split(' ')[0], value: n.rataRata }))
})

const nilaiDistribusi = computed(() => {
  const tinggi = data.nilaiAkademik.filter(n => n.rataRata >= 85).length
  const sedang = data.nilaiAkademik.filter(n => n.rataRata >= 70 && n.rataRata < 85).length
  const rendah = data.nilaiAkademik.filter(n => n.rataRata < 70).length
  return [
    { label: 'Tinggi (≥85)', value: tinggi, color: '#10b981' },
    { label: 'Sedang (70-84)', value: sedang, color: '#2f639e' },
    { label: 'Rendah (<70)', value: rendah, color: '#ef4444' },
  ]
})

const statusDistribusi = computed(() => {
  const map: Record<string, number> = {}
  data.siswa.forEach(s => { map[s.status] = (map[s.status] || 0) + 1 })
  const colors: Record<string, string> = {
    Aktif: '#10b981', Pembinaan: '#f59e0b', 'SP-1': '#f97316', 'SP-2': '#ef4444', 'SP-3': '#dc2626', Dikeluarkan: '#7f1d1d',
  }
  return Object.entries(map).map(([label, value]) => ({ label, value, color: colors[label] || '#94a3b8' }))
})
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="font-display text-2xl font-bold text-slate-800 dark:text-slate-100">Rekap Statistik & Akademik</h1>
      <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Visualisasi demografi siswa, rekapitulasi kehadiran, dan integrasi nilai akademik untuk mendeteksi penurunan performa.</p>
    </div>

    <!-- Demografi -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div class="card p-6">
        <h3 class="section-title mb-1">Demografi Jurusan</h3>
        <p class="mb-4 text-sm text-slate-500 dark:text-slate-400">Distribusi siswa per jurusan</p>
        <SimpleChart :data="demografiJurusan" type="donut" :height="180" />
      </div>
      <div class="card p-6">
        <h3 class="section-title mb-1">Demografi Tingkat</h3>
        <p class="mb-4 text-sm text-slate-500 dark:text-slate-400">Distribusi siswa per tingkat kelas</p>
        <SimpleChart :data="demografiTingkat" type="donut" :height="180" />
      </div>
      <div class="card p-6">
        <h3 class="section-title mb-1">Demografi Gender</h3>
        <p class="mb-4 text-sm text-slate-500 dark:text-slate-400">Distribusi siswa per jenis kelamin</p>
        <SimpleChart :data="demografiJK" type="donut" :height="180" />
      </div>
    </div>

    <!-- Status pembinaan -->
    <div class="card p-6">
      <h3 class="section-title mb-1">Distribusi Status Pembinaan Siswa</h3>
      <p class="mb-4 text-sm text-slate-500 dark:text-slate-400">Jumlah siswa per kategori status pembinaan</p>
      <SimpleChart :data="statusDistribusi" type="bar" :height="200" />
    </div>

    <!-- Absensi -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div class="card p-6 lg:col-span-1">
        <h3 class="section-title mb-1">Total Kehadiran</h3>
        <p class="mb-4 text-sm text-slate-500 dark:text-slate-400">Rekapitulasi bulan ini</p>
        <SimpleChart :data="totalAbsensi" type="donut" :height="180" />
      </div>
      <div class="card p-6 lg:col-span-2">
        <h3 class="section-title mb-1">Rekap Kehadiran per Kelas</h3>
        <p class="mb-4 text-sm text-slate-500 dark:text-slate-400">Sakit, Izin, Alpha per kelas</p>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th class="table-th">Kelas</th>
                <th class="table-th">Sakit</th>
                <th class="table-th">Izin</th>
                <th class="table-th">Alpha</th>
                <th class="table-th">Total</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-700/50">
              <tr v-for="a in absensiPerKelas" :key="a.label" class="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                <td class="table-td font-medium">{{ a.label }}</td>
                <td class="table-td"><span class="text-amber-600 dark:text-amber-400">{{ a.sakit }}</span></td>
                <td class="table-td"><span class="text-teal-600 dark:text-teal-400">{{ a.izin }}</span></td>
                <td class="table-td"><span class="text-red-600 dark:text-red-400">{{ a.alpha }}</span></td>
                <td class="table-td font-semibold">{{ a.sakit + a.izin + a.alpha }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Akademik -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div class="card p-6">
        <h3 class="section-title mb-1">Nilai Akademik - 8 Siswa Teratas</h3>
        <p class="mb-4 text-sm text-slate-500 dark:text-slate-400">Rata-rata UTS, UAS & Ulangan Harian (Semester Ganjil 2025/2026)</p>
        <LineChart :data="nilaiTrend" color="#2f639e" :height="220" />
      </div>
      <div class="card p-6">
        <h3 class="section-title mb-1">Distribusi Kategori Nilai</h3>
        <p class="mb-4 text-sm text-slate-500 dark:text-slate-400">Pengelompokan rata-rata nilai siswa</p>
        <SimpleChart :data="nilaiDistribusi" type="bar" :height="200" />
      </div>
    </div>

    <!-- Tabel nilai detail -->
    <div class="card overflow-hidden">
      <div class="border-b border-slate-200 p-5 dark:border-slate-700">
        <h3 class="section-title">Integrasi Nilai Akademik Siswa</h3>
        <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Membantu BK mengkorelasi penurunan perilaku dengan penurunan akademik</p>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-700/40">
            <tr>
              <th class="table-th">Siswa</th>
              <th class="table-th">Kelas</th>
              <th class="table-th">UTS</th>
              <th class="table-th">UAS</th>
              <th class="table-th">Ulangan Harian</th>
              <th class="table-th">Rata-rata</th>
              <th class="table-th">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-700/50">
            <tr v-for="n in data.nilaiAkademik.slice(0, 12)" :key="n.siswaId" class="hover:bg-slate-50 dark:hover:bg-slate-700/30">
              <td class="table-td font-medium">{{ n.siswaNama }}</td>
              <td class="table-td">{{ n.kelasNama }}</td>
              <td class="table-td">{{ n.uts }}</td>
              <td class="table-td">{{ n.uas }}</td>
              <td class="table-td">{{ n.ulanganHarian }}</td>
              <td class="table-td"><span class="font-display font-bold" :class="n.rataRata >= 85 ? 'text-brand-600 dark:text-brand-400' : n.rataRata >= 70 ? 'text-navy-700 dark:text-navy-300' : 'text-red-600 dark:text-red-400'">{{ n.rataRata }}</span></td>
              <td class="table-td">
                <span class="badge" :class="n.rataRata >= 85 ? 'bg-brand-100 text-brand-700 dark:bg-brand-500/20 dark:text-brand-300' : n.rataRata >= 70 ? 'bg-navy-100 text-navy-700 dark:bg-navy-500/20 dark:text-navy-300' : 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300'">
                  {{ n.rataRata >= 85 ? 'Sangat Baik' : n.rataRata >= 70 ? 'Baik' : 'Perlu Perhatian' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
