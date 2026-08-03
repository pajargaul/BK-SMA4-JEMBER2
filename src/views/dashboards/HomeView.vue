<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '../../stores/auth'
import { useDataStore } from '../../stores/data'
import { getRekomendasiSanksi } from '../../data/mockData'
import SimpleChart from '../../components/SimpleChart.vue'
import LineChart from '../../components/LineChart.vue'
import AnimatedCounter from '../../components/AnimatedCounter.vue'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const data = useDataStore()
const router = useRouter()

const role = computed(() => auth.role)

const siswaBermasalah = computed(() =>
  [...data.siswa].filter(s => s.poinAktif >= 10).sort((a, b) => b.poinAktif - a.poinAktif).slice(0, 5)
)

const siswaBerprestasi = computed(() =>
  [...data.prestasi].slice(0, 5)
)

const konselingTerbaru = computed(() =>
  [...data.konseling].sort((a, b) => b.tanggal.localeCompare(a.tanggal)).slice(0, 4)
)

const pengumumanTerbaru = computed(() =>
  [...data.pengumuman].sort((a, b) => b.tanggal.localeCompare(a.tanggal)).slice(0, 3)
)

const statusColor: Record<string, string> = {
  Aktif: 'bg-brand-100 text-brand-700 dark:bg-brand-500/20 dark:text-brand-300',
  Pembinaan: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300',
  'SP-1': 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300',
  'SP-2': 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300',
  'SP-3': 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300',
  Dikeluarkan: 'bg-red-900 text-red-200 dark:bg-red-900/40 dark:text-red-200',
}

const statusKonselingColor: Record<string, string> = {
  Terjadwal: 'bg-navy-100 text-navy-700 dark:bg-navy-500/20 dark:text-navy-300',
  Selesai: 'bg-brand-100 text-brand-700 dark:bg-brand-500/20 dark:text-brand-300',
  'Dalam Proses': 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300',
  Dibatalkan: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
}

const catColor: Record<string, string> = {
  Karir: 'bg-brand-100 text-brand-700 dark:bg-brand-500/20 dark:text-brand-300',
  Universitas: 'bg-navy-100 text-navy-700 dark:bg-navy-500/20 dark:text-navy-300',
  Lomba: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300',
  Umum: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
}

const stats = computed(() => {
  if (role.value === 'siswa') {
    const s = data.siswa.find(x => x.id === 's1') || data.siswa[0]
    const rek = getRekomendasiSanksi(s.poinAktif)
    return [
      { label: 'Poin Pelanggaran Aktif', value: s.poinAktif, icon: 'warning', color: 'from-red-500 to-red-700' },
      { label: 'Poin Prestasi Positif', value: s.poinPrestasi, icon: 'star', color: 'from-amber-400 to-amber-600' },
      { label: 'Sesi Konseling Saya', value: data.konseling.filter(k => k.siswaId === s.id).length, icon: 'chat', color: 'from-navy-500 to-navy-700' },
      { label: 'Rekomendasi Saat Ini', value: rek.nama, icon: 'shield', color: 'from-brand-500 to-brand-700', isText: true },
    ]
  }
  return [
    { label: 'Total Siswa Aktif', value: data.totalSiswaAktif, icon: 'users', color: 'from-brand-500 to-brand-700' },
    { label: 'Kasus Konseling Selesai', value: data.totalKasusSelesai, icon: 'check', color: 'from-navy-500 to-navy-700' },
    { label: 'Poin Prestasi Terkumpul', value: data.totalPoinPrestasi, icon: 'star', color: 'from-amber-400 to-amber-600' },
    { label: 'Pelanggaran Tercatat', value: data.pelanggaran.length, icon: 'warning', color: 'from-teal-500 to-teal-700' },
  ]
})

const demografiJurusan = computed(() => {
  const map: Record<string, number> = { MIPA: 0, IPS: 0, Bahasa: 0 }
  data.kelas.forEach(k => { map[k.jurusan] += k.jumlahSiswa })
  return [
    { label: 'MIPA', value: map.MIPA, color: '#10b981' },
    { label: 'IPS', value: map.IPS, color: '#2f639e' },
    { label: 'Bahasa', value: map.Bahasa, color: '#f59e0b' },
  ]
})

const trendPelanggaran = computed(() => [
  { label: 'Feb', value: 8 }, { label: 'Mar', value: 12 }, { label: 'Apr', value: 6 },
  { label: 'Mei', value: 15 }, { label: 'Jun', value: 9 }, { label: 'Jul', value: 8 },
])

const iconPaths: Record<string, string> = {
  users: 'M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.144 6.144 0 01-1.455-4.057c0-1.333.428-2.566 1.157-3.56C3.854 9.5 5.5 8 8.5 8c1.5 0 3 .5 4 1.5',
  check: 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  star: 'M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.482 20.4a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z',
  warning: 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z',
  chat: 'M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.176 48.176 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z',
  shield: 'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z',
}
</script>

<template>
  <div class="space-y-6">
    <!-- Greeting -->
    <div>
      <h1 class="font-display text-2xl font-bold text-slate-800 dark:text-slate-100">
        {{ role === 'siswa' ? 'Dashboard Siswa' : role === 'kepala_sekolah' ? 'Dashboard Kepala Sekolah' : role === 'admin' ? 'Dashboard Administrator' : 'Dashboard Guru BK' }}
      </h1>
      <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
        {{ role === 'siswa' ? 'Pantau poin pribadi dan jadwal bimbingan Anda.' : 'Ringkasan aktivitas bimbingan konseling dan pembinaan siswa.' }}
      </p>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div v-for="s in stats" :key="s.label" class="stat-card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-slate-500 dark:text-slate-400">{{ s.label }}</p>
            <p class="mt-2 font-display text-3xl font-bold text-slate-800 dark:text-slate-100">
              <template v-if="s.isText">{{ s.value }}</template>
              <AnimatedCounter v-else :target="s.value as number" />
            </p>
          </div>
          <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br text-white" :class="s.color">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" :d="iconPaths[s.icon]" /></svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts row -->
    <div v-if="role !== 'siswa'" class="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div class="card p-6 lg:col-span-2">
        <h3 class="section-title mb-1">Tren Pencatatan Pelanggaran</h3>
        <p class="mb-4 text-sm text-slate-500 dark:text-slate-400">Jumlah pelanggaran tercatat per bulan (6 bulan terakhir)</p>
        <LineChart :data="trendPelanggaran" color="#ef4444" :height="220" />
      </div>
      <div class="card p-6">
        <h3 class="section-title mb-1">Demografi Jurusan</h3>
        <p class="mb-4 text-sm text-slate-500 dark:text-slate-400">Distribusi siswa per jurusan</p>
        <SimpleChart :data="demografiJurusan" type="donut" :height="200" />
      </div>
    </div>

    <!-- Siswa bermasalah + konseling -->
    <div v-if="role !== 'siswa'" class="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div class="card overflow-hidden">
        <div class="flex items-center justify-between border-b border-slate-200 p-5 dark:border-slate-700">
          <h3 class="section-title">Siswa Perlu Perhatian Khusus</h3>
          <button @click="router.push({ name: 'pelanggaran' })" class="text-sm font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400">Lihat Semua</button>
        </div>
        <div class="divide-y divide-slate-100 dark:divide-slate-700/50">
          <div v-for="s in siswaBermasalah" :key="s.id" class="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-700/30">
            <div class="flex items-center gap-3">
              <img :src="s.avatar" :alt="s.nama" class="h-10 w-10 rounded-full object-cover" />
              <div>
                <p class="text-sm font-semibold text-slate-800 dark:text-slate-100">{{ s.nama }}</p>
                <p class="text-xs text-slate-500 dark:text-slate-400">{{ data.getKelasById(s.kelasId)?.nama }}</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <span class="font-display text-lg font-bold text-red-600 dark:text-red-400">{{ s.poinAktif }}</span>
              <span class="badge" :class="statusColor[s.status]">{{ s.status }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="card overflow-hidden">
        <div class="flex items-center justify-between border-b border-slate-200 p-5 dark:border-slate-700">
          <h3 class="section-title">Sesi Konseling Terbaru</h3>
          <button @click="router.push({ name: 'konseling' })" class="text-sm font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400">Lihat Semua</button>
        </div>
        <div class="divide-y divide-slate-100 dark:divide-slate-700/50">
          <div v-for="k in konselingTerbaru" :key="k.id" class="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-700/30">
            <div class="min-w-0 flex-1">
              <p class="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">{{ k.siswaNama }}</p>
              <p class="truncate text-xs text-slate-500 dark:text-slate-400">{{ k.topik }}</p>
            </div>
            <div class="ml-3 flex flex-col items-end gap-1">
              <span class="badge" :class="statusKonselingColor[k.status]">{{ k.status }}</span>
              <span class="text-xs text-slate-400">{{ k.tanggal }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Prestasi + Pengumuman -->
    <div v-if="role !== 'siswa'" class="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div class="card overflow-hidden">
        <div class="flex items-center justify-between border-b border-slate-200 p-5 dark:border-slate-700">
          <h3 class="section-title">Prestasi Siswa Terbaru</h3>
          <button @click="router.push({ name: 'prestasi' })" class="text-sm font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400">Lihat Semua</button>
        </div>
        <div class="divide-y divide-slate-100 dark:divide-slate-700/50">
          <div v-for="p in siswaBerprestasi" :key="p.id" class="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-700/30">
            <div class="min-w-0 flex-1">
              <p class="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">{{ p.siswaNama }}</p>
              <p class="truncate text-xs text-slate-500 dark:text-slate-400">{{ p.namaLomba }} · {{ p.tingkat }}</p>
            </div>
            <div class="ml-3 flex items-center gap-2">
              <span class="badge bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">{{ p.hasil }}</span>
              <span class="font-semibold text-brand-600 dark:text-brand-400">+{{ p.poin }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="card overflow-hidden">
        <div class="flex items-center justify-between border-b border-slate-200 p-5 dark:border-slate-700">
          <h3 class="section-title">Pengumuman Terbaru</h3>
          <button @click="router.push({ name: 'pengumuman' })" class="text-sm font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400">Lihat Semua</button>
        </div>
        <div class="divide-y divide-slate-100 dark:divide-slate-700/50">
          <div v-for="p in pengumumanTerbaru" :key="p.id" class="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/30">
            <div class="flex items-center justify-between mb-1">
              <span class="badge" :class="catColor[p.kategori]">{{ p.kategori }}</span>
              <span class="text-xs text-slate-400">{{ p.tanggal }}</span>
            </div>
            <p class="text-sm font-semibold text-slate-800 dark:text-slate-100">{{ p.judul }}</p>
            <p class="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{{ p.isi }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Siswa view -->
    <div v-if="role === 'siswa'" class="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div class="card p-6">
        <h3 class="section-title mb-4">Status Pembinaan Saya</h3>
        <div class="space-y-4">
          <div class="flex items-center justify-between rounded-xl bg-slate-50 p-4 dark:bg-slate-700/40">
            <span class="text-sm font-medium text-slate-600 dark:text-slate-300">Poin Pelanggaran</span>
            <span class="font-display text-2xl font-bold text-red-600 dark:text-red-400">{{ data.siswa[0]?.poinPelanggaran }}</span>
          </div>
          <div class="flex items-center justify-between rounded-xl bg-slate-50 p-4 dark:bg-slate-700/40">
            <span class="text-sm font-medium text-slate-600 dark:text-slate-300">Poin Prestasi (Pengurang)</span>
            <span class="font-display text-2xl font-bold text-brand-600 dark:text-brand-400">{{ data.siswa[0]?.poinPrestasi }}</span>
          </div>
          <div class="flex items-center justify-between rounded-xl bg-brand-50 p-4 dark:bg-brand-500/10">
            <span class="text-sm font-semibold text-brand-700 dark:text-brand-300">Poin Aktif (Net)</span>
            <span class="font-display text-2xl font-bold text-brand-700 dark:text-brand-300">{{ data.siswa[0]?.poinAktif }}</span>
          </div>
        </div>
      </div>
      <div class="card p-6">
        <h3 class="section-title mb-4">Sesi Konseling Saya</h3>
        <div class="space-y-3">
          <div v-for="k in data.konseling.filter(x => x.siswaId === 's1').slice(0, 3)" :key="k.id" class="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
            <div class="flex items-center justify-between mb-1">
              <span class="badge" :class="statusKonselingColor[k.status]">{{ k.status }}</span>
              <span class="text-xs text-slate-400">{{ k.tanggal }} · {{ k.waktu }}</span>
            </div>
            <p class="text-sm font-semibold text-slate-800 dark:text-slate-100">{{ k.topik }}</p>
            <p class="text-xs text-slate-500 dark:text-slate-400">Jenis: {{ k.jenis }}</p>
          </div>
          <button @click="router.push({ name: 'konseling' })" class="btn-outline w-full">Lihat Semua Sesi</button>
        </div>
      </div>
    </div>
  </div>
</template>
