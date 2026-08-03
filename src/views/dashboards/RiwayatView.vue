<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDataStore } from '../../stores/data'
import { useAuthStore } from '../../stores/auth'
import { getRekomendasiSanksi } from '../../data/mockData'
import SimpleChart from '../../components/SimpleChart.vue'
import type { Siswa } from '../../types'

const data = useDataStore()
const auth = useAuthStore()

const isSiswa = computed(() => auth.role === 'siswa')
const searchQuery = ref('')
const filterKelas = ref('')
const selectedSiswaId = ref<string | null>(null)

// For siswa role, auto-select their own data
const mySiswaId = 's1'

const siswaOptions = computed(() => {
  if (isSiswa.value) return data.siswa.filter(s => s.id === mySiswaId)
  return data.siswa.filter(s => {
    const matchSearch = s.nama.toLowerCase().includes(searchQuery.value.toLowerCase()) || s.nis.includes(searchQuery.value)
    const matchKelas = !filterKelas.value || s.kelasId === filterKelas.value
    return matchSearch && matchKelas
  })
})

const selectedSiswa = computed<Siswa | null>(() => {
  if (isSiswa.value) return data.siswa.find(s => s.id === mySiswaId) || null
  if (!selectedSiswaId.value) return null
  return data.siswa.find(s => s.id === selectedSiswaId.value) || null
})

const myPelanggaran = computed(() => {
  if (!selectedSiswa.value) return []
  return data.pelanggaran.filter(p => p.siswaId === selectedSiswa.value!.id)
})

const myPrestasi = computed(() => {
  if (!selectedSiswa.value) return []
  return data.prestasi.filter(p => p.siswaId === selectedSiswa.value!.id)
})

const myTindakLanjut = computed(() => {
  if (!selectedSiswa.value) return []
  return data.tindakLanjut.filter(t => t.siswaId === selectedSiswa.value!.id)
})

const myKonseling = computed(() => {
  if (!selectedSiswa.value) return []
  return data.konseling.filter(k => k.siswaId === selectedSiswa.value!.id)
})

const rek = computed(() => {
  if (!selectedSiswa.value) return null
  return getRekomendasiSanksi(selectedSiswa.value.poinAktif)
})

// Timeline: merge all events sorted by date
interface TimelineEvent {
  tanggal: string
  jenis: 'Pelanggaran' | 'Prestasi' | 'Tindak Lanjut' | 'Konseling'
  judul: string
  detail: string
  poin?: number
  badge?: string
}

const timeline = computed<TimelineEvent[]>(() => {
  if (!selectedSiswa.value) return []
  const events: TimelineEvent[] = []

  myPelanggaran.value.forEach(p => {
    events.push({
      tanggal: p.tanggal,
      jenis: 'Pelanggaran',
      judul: p.aturanNama,
      detail: p.catatan,
      poin: p.poin,
      badge: `+${p.poin}`,
    })
  })

  myPrestasi.value.forEach(p => {
    events.push({
      tanggal: p.tanggal,
      jenis: 'Prestasi',
      judul: p.namaLomba,
      detail: `${p.tingkat} - ${p.hasil}`,
      poin: p.poin,
      badge: `+${p.poin}`,
    })
  })

  myTindakLanjut.value.forEach(t => {
    events.push({
      tanggal: t.tanggalRekomendasi,
      jenis: 'Tindak Lanjut',
      judul: `${t.kodeRule} - ${t.rekomendasiSanksi}`,
      detail: t.catatanPembinaan || t.pelanggaranNama,
      badge: t.status,
    })
  })

  myKonseling.value.forEach(k => {
    events.push({
      tanggal: k.tanggal,
      jenis: 'Konseling',
      judul: k.topik,
      detail: `Jenis: ${k.jenis} - ${k.status}`,
      badge: k.status,
    })
  })

  return events.sort((a, b) => b.tanggal.localeCompare(a.tanggal))
})

const statusColor: Record<string, string> = {
  Aktif: 'bg-brand-100 text-brand-700 dark:bg-brand-500/20 dark:text-brand-300',
  Pembinaan: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300',
  'SP-1': 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300',
  'SP-2': 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300',
  'SP-3': 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300',
  Dikeluarkan: 'bg-red-900 text-red-200 dark:bg-red-900/40 dark:text-red-200',
}

const tlStatusColor: Record<string, string> = {
  Direkomendasikan: 'bg-navy-100 text-navy-700 dark:bg-navy-500/20 dark:text-navy-300',
  'Dalam Proses': 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300',
  Selesai: 'bg-brand-100 text-brand-700 dark:bg-brand-500/20 dark:text-brand-300',
  Dibatalkan: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
}

const konselingStatusColor: Record<string, string> = {
  Terjadwal: 'bg-navy-100 text-navy-700 dark:bg-navy-500/20 dark:text-navy-300',
  Selesai: 'bg-brand-100 text-brand-700 dark:bg-brand-500/20 dark:text-brand-300',
  'Dalam Proses': 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300',
  Dibatalkan: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
}

const timelineColor: Record<string, string> = {
  'Pelanggaran': 'bg-red-500',
  'Prestasi': 'bg-brand-500',
  'Tindak Lanjut': 'bg-navy-500',
  'Konseling': 'bg-teal-500',
}

const timelineBadgeColor: Record<string, string> = {
  'Pelanggaran': 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300',
  'Prestasi': 'bg-brand-100 text-brand-700 dark:bg-brand-500/20 dark:text-brand-300',
  'Tindak Lanjut': 'bg-navy-100 text-navy-700 dark:bg-navy-500/20 dark:text-navy-300',
  'Konseling': 'bg-teal-100 text-teal-700 dark:bg-teal-500/20 dark:text-teal-300',
}

const poinChart = computed(() => {
  if (!selectedSiswa.value) return []
  return [
    { label: 'Pelanggaran', value: selectedSiswa.value.poinPelanggaran, color: '#ef4444' },
    { label: 'Prestasi', value: selectedSiswa.value.poinPrestasi, color: '#10b981' },
    { label: 'Aktif (Net)', value: selectedSiswa.value.poinAktif, color: '#f59e0b' },
  ]
})

function selectSiswa(id: string) {
  selectedSiswaId.value = id
}

function formatDate(t: string) {
  if (!t) return '-'
  return new Date(t).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="font-display text-2xl font-bold text-slate-800 dark:text-slate-100">Riwayat Poin, Pelanggaran & Tindak Lanjut</h1>
      <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
        {{ isSiswa ? 'Riwayat lengkap poin, pelanggaran, prestasi, dan tindak lanjut Anda.' : 'Cari dan tinjau riwayat poin, pelanggaran, dan tindak lanjut seluruh siswa.' }}
      </p>
    </div>

    <!-- Search / Student selector -->
    <div v-if="!isSiswa" class="card p-4">
      <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <input v-model="searchQuery" type="text" class="input" placeholder="Cari nama siswa atau NIS..." />
        <select v-model="filterKelas" class="input">
          <option value="">Semua Kelas</option>
          <option v-for="k in data.kelas" :key="k.id" :value="k.id">{{ k.nama }}</option>
        </select>
      </div>
      <div v-if="siswaOptions.length > 0 && !selectedSiswa" class="mt-4 space-y-1 max-h-64 overflow-y-auto">
        <p class="text-xs font-semibold text-slate-400 mb-2">Pilih siswa untuk melihat riwayat:</p>
        <button
          v-for="s in siswaOptions.slice(0, 20)"
          :key="s.id"
          @click="selectSiswa(s.id)"
          class="flex w-full items-center gap-3 rounded-xl p-3 text-left transition hover:bg-slate-50 dark:hover:bg-slate-700/30"
        >
          <img :src="s.avatar" :alt="s.nama" class="h-9 w-9 rounded-full object-cover" />
          <div class="flex-1">
            <p class="text-sm font-medium text-slate-800 dark:text-slate-100">{{ s.nama }}</p>
            <p class="text-xs text-slate-400">{{ data.getKelasById(s.kelasId)?.nama }} · {{ s.nis }}</p>
          </div>
          <span class="badge" :class="statusColor[s.status]">{{ s.status }}</span>
          <span class="font-display text-sm font-bold text-slate-700 dark:text-slate-200">{{ s.poinAktif }} poin</span>
        </button>
      </div>
    </div>

    <!-- Student detail -->
    <div v-if="selectedSiswa" class="space-y-6">
      <!-- Back button (non-siswa) -->
      <button v-if="!isSiswa" @click="selectedSiswaId = null" class="flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400">
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
        Kembali ke daftar siswa
      </button>

      <!-- Student header card -->
      <div class="card overflow-hidden">
        <div class="bg-gradient-to-br from-navy-700 to-brand-700 p-6 text-white">
          <div class="flex items-center gap-4">
            <img :src="selectedSiswa.avatar" :alt="selectedSiswa.nama" class="h-16 w-16 rounded-2xl object-cover ring-4 ring-white/20" />
            <div class="flex-1">
              <h2 class="font-display text-xl font-bold">{{ selectedSiswa.nama }}</h2>
              <p class="text-sm text-slate-200">{{ data.getKelasById(selectedSiswa.kelasId)?.nama }} · NIS: {{ selectedSiswa.nis }}</p>
              <div class="mt-2 flex items-center gap-2">
                <span class="badge bg-white/20 text-white">Status: {{ selectedSiswa.status }}</span>
                <span class="badge bg-white/20 text-white">{{ rek?.nama }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="grid grid-cols-3 divide-x divide-slate-200 dark:divide-slate-700">
          <div class="p-5 text-center">
            <p class="text-xs font-medium text-slate-500 dark:text-slate-400">Poin Pelanggaran</p>
            <p class="mt-1 font-display text-3xl font-bold text-red-600 dark:text-red-400">{{ selectedSiswa.poinPelanggaran }}</p>
          </div>
          <div class="p-5 text-center">
            <p class="text-xs font-medium text-slate-500 dark:text-slate-400">Poin Prestasi</p>
            <p class="mt-1 font-display text-3xl font-bold text-brand-600 dark:text-brand-400">{{ selectedSiswa.poinPrestasi }}</p>
          </div>
          <div class="p-5 text-center">
            <p class="text-xs font-medium text-slate-500 dark:text-slate-400">Poin Aktif (Net)</p>
            <p class="mt-1 font-display text-3xl font-bold text-slate-800 dark:text-slate-100">{{ selectedSiswa.poinAktif }}</p>
          </div>
        </div>
      </div>

      <!-- Two columns: charts + recommendation -->
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div class="card p-6 lg:col-span-2">
          <h3 class="section-title mb-1">Ringkasan Poin</h3>
          <p class="mb-4 text-sm text-slate-500 dark:text-slate-400">Distribusi poin pelanggaran, prestasi, dan poin aktif bersih</p>
          <SimpleChart :data="poinChart" type="bar" :height="200" />
        </div>
        <div class="card p-6">
          <h3 class="section-title mb-3">Rekomendasi Saat Ini</h3>
          <div v-if="rek" class="rounded-xl bg-brand-50 p-4 dark:bg-brand-500/10">
            <p class="font-display text-base font-bold text-brand-700 dark:text-brand-300">{{ rek.nama }}</p>
            <p class="mt-1 text-sm text-brand-600 dark:text-brand-400">{{ rek.tindakan }}</p>
            <p class="mt-2 text-xs text-brand-500 dark:text-brand-400/70">{{ rek.deskripsi }}</p>
            <p class="mt-2 text-xs font-mono text-slate-400">Rule: {{ rek.kodeRule }}</p>
          </div>
        </div>
      </div>

      <!-- Timeline -->
      <div class="card p-6">
        <h3 class="section-title mb-4">Linimasa Riwayat Lengkap</h3>
        <div v-if="timeline.length === 0" class="py-8 text-center text-sm text-slate-400">Belum ada riwayat tercatat.</div>
        <div v-else class="relative space-y-4">
          <div class="absolute left-[15px] top-2 bottom-2 w-0.5 bg-slate-200 dark:bg-slate-700"></div>
          <div v-for="(e, i) in timeline" :key="i" class="relative flex gap-4">
            <div class="z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ring-4 ring-white dark:ring-slate-800" :class="timelineColor[e.jenis]">
              <svg v-if="e.jenis === 'Pelanggaran'" class="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z" /></svg>
              <svg v-else-if="e.jenis === 'Prestasi'" class="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.482 20.4a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>
              <svg v-else-if="e.jenis === 'Tindak Lanjut'" class="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <svg v-else class="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.176 48.176 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" /></svg>
            </div>
            <div class="flex-1 pb-2">
              <div class="flex items-center justify-between gap-2">
                <div class="flex items-center gap-2">
                  <span class="badge" :class="timelineBadgeColor[e.jenis]">{{ e.jenis }}</span>
                  <span v-if="e.badge" class="badge bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300">{{ e.badge }}</span>
                </div>
                <span class="text-xs text-slate-400">{{ formatDate(e.tanggal) }}</span>
              </div>
              <p class="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-100">{{ e.judul }}</p>
              <p v-if="e.detail" class="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{{ e.detail }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Detailed tables -->
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <!-- Pelanggaran -->
        <div class="card overflow-hidden">
          <div class="border-b border-slate-200 p-5 dark:border-slate-700">
            <h3 class="section-title">Riwayat Pelanggaran ({{ myPelanggaran.length }})</h3>
          </div>
          <div class="divide-y divide-slate-100 dark:divide-slate-700/50 max-h-80 overflow-y-auto">
            <div v-for="p in myPelanggaran" :key="p.id" class="flex items-start justify-between p-4">
              <div class="min-w-0 flex-1">
                <p class="text-sm font-semibold text-slate-800 dark:text-slate-100">{{ p.aturanNama }}</p>
                <p class="text-xs text-slate-400">{{ formatDate(p.tanggal) }} · {{ p.dicatatOleh }}</p>
                <p v-if="p.catatan" class="mt-1 text-xs text-slate-500 dark:text-slate-400">{{ p.catatan }}</p>
              </div>
              <span class="ml-3 font-display text-lg font-bold text-red-600 dark:text-red-400">+{{ p.poin }}</span>
            </div>
            <div v-if="myPelanggaran.length === 0" class="p-6 text-center text-sm text-slate-400">Tidak ada riwayat pelanggaran.</div>
          </div>
        </div>

        <!-- Prestasi -->
        <div class="card overflow-hidden">
          <div class="border-b border-slate-200 p-5 dark:border-slate-700">
            <h3 class="section-title">Riwayat Prestasi ({{ myPrestasi.length }})</h3>
          </div>
          <div class="divide-y divide-slate-100 dark:divide-slate-700/50 max-h-80 overflow-y-auto">
            <div v-for="p in myPrestasi" :key="p.id" class="flex items-start justify-between p-4">
              <div class="min-w-0 flex-1">
                <p class="text-sm font-semibold text-slate-800 dark:text-slate-100">{{ p.namaLomba }}</p>
                <p class="text-xs text-slate-400">{{ formatDate(p.tanggal) }} · {{ p.tingkat }}</p>
                <p class="text-xs text-brand-600 dark:text-brand-400">{{ p.hasil }}</p>
              </div>
              <span class="ml-3 font-display text-lg font-bold text-brand-600 dark:text-brand-400">+{{ p.poin }}</span>
            </div>
            <div v-if="myPrestasi.length === 0" class="p-6 text-center text-sm text-slate-400">Tidak ada riwayat prestasi.</div>
          </div>
        </div>

        <!-- Tindak Lanjut -->
        <div class="card overflow-hidden">
          <div class="border-b border-slate-200 p-5 dark:border-slate-700">
            <h3 class="section-title">Riwayat Tindak Lanjut ({{ myTindakLanjut.length }})</h3>
          </div>
          <div class="divide-y divide-slate-100 dark:divide-slate-700/50 max-h-80 overflow-y-auto">
            <div v-for="t in myTindakLanjut" :key="t.id" class="p-4">
              <div class="flex items-center justify-between mb-1">
                <span class="font-mono text-xs font-semibold text-navy-700 dark:text-navy-300">{{ t.kodeRule }}</span>
                <span class="badge" :class="tlStatusColor[t.status]">{{ t.status }}</span>
              </div>
              <p class="text-sm font-semibold text-slate-800 dark:text-slate-100">{{ t.rekomendasiSanksi }}</p>
              <p class="text-xs text-slate-400">Rekomendasi: {{ formatDate(t.tanggalRekomendasi) }}<span v-if="t.tanggalPelaksanaan"> · Pelaksanaan: {{ formatDate(t.tanggalPelaksanaan) }}</span></p>
              <p v-if="t.catatanPembinaan" class="mt-1 text-xs text-slate-500 dark:text-slate-400">{{ t.catatanPembinaan }}</p>
            </div>
            <div v-if="myTindakLanjut.length === 0" class="p-6 text-center text-sm text-slate-400">Tidak ada riwayat tindak lanjut.</div>
          </div>
        </div>

        <!-- Konseling -->
        <div class="card overflow-hidden">
          <div class="border-b border-slate-200 p-5 dark:border-slate-700">
            <h3 class="section-title">Riwayat Konseling ({{ myKonseling.length }})</h3>
          </div>
          <div class="divide-y divide-slate-100 dark:divide-slate-700/50 max-h-80 overflow-y-auto">
            <div v-for="k in myKonseling" :key="k.id" class="p-4">
              <div class="flex items-center justify-between mb-1">
                <span class="badge bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300">{{ k.jenis }}</span>
                <span class="badge" :class="konselingStatusColor[k.status]">{{ k.status }}</span>
              </div>
              <p class="text-sm font-semibold text-slate-800 dark:text-slate-100">{{ k.topik }}</p>
              <p class="text-xs text-slate-400">{{ formatDate(k.tanggal) }} · {{ k.waktu }} WIB</p>
            </div>
            <div v-if="myKonseling.length === 0" class="p-6 text-center text-sm text-slate-400">Tidak ada riwayat konseling.</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
