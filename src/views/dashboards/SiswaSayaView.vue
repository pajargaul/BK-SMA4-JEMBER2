<script setup lang="ts">
import { computed } from 'vue'
import { useDataStore } from '../../stores/data'
import { getRekomendasiSanksi } from '../../data/mockData'
import { useRouter } from 'vue-router'

const data = useDataStore()
const router = useRouter()

const siswa = computed(() => data.siswa[0])
const rek = computed(() => getRekomendasiSanksi(siswa.value?.poinAktif || 0))
const myKonseling = computed(() => data.konseling.filter(k => k.siswaId === 's1'))
const myPrestasi = computed(() => data.prestasi.filter(p => p.siswaId === 's1'))
const myPelanggaran = computed(() => data.pelanggaran.filter(p => p.siswaId === 's1'))

const statusKonselingColor: Record<string, string> = {
  Terjadwal: 'bg-navy-100 text-navy-700 dark:bg-navy-500/20 dark:text-navy-300',
  Selesai: 'bg-brand-100 text-brand-700 dark:bg-brand-500/20 dark:text-brand-300',
  'Dalam Proses': 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300',
  Dibatalkan: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
}
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="font-display text-2xl font-bold text-slate-800 dark:text-slate-100">Poin & Bimbingan Saya</h1>
      <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Pantau perkembangan poin pelanggaran, prestasi, dan jadwal konseling pribadi Anda.</p>
    </div>

    <!-- Status card -->
    <div class="card overflow-hidden">
      <div class="bg-gradient-to-br from-navy-700 to-brand-700 p-6 text-white">
        <div class="flex items-center gap-4">
          <img :src="siswa?.avatar" :alt="siswa?.nama" class="h-16 w-16 rounded-2xl object-cover ring-4 ring-white/20" />
          <div>
            <h2 class="font-display text-xl font-bold">{{ siswa?.nama }}</h2>
            <p class="text-sm text-slate-200">{{ data.getKelasById(siswa?.kelasId || '')?.nama }} · NIS: {{ siswa?.nis }}</p>
            <span class="mt-2 inline-flex badge bg-white/20 text-white">Status: {{ siswa?.status }}</span>
          </div>
        </div>
      </div>
      <div class="grid grid-cols-3 divide-x divide-slate-200 dark:divide-slate-700">
        <div class="p-5 text-center">
          <p class="text-xs font-medium text-slate-500 dark:text-slate-400">Poin Pelanggaran</p>
          <p class="mt-1 font-display text-3xl font-bold text-red-600 dark:text-red-400">{{ siswa?.poinPelanggaran }}</p>
        </div>
        <div class="p-5 text-center">
          <p class="text-xs font-medium text-slate-500 dark:text-slate-400">Poin Prestasi</p>
          <p class="mt-1 font-display text-3xl font-bold text-brand-600 dark:text-brand-400">{{ siswa?.poinPrestasi }}</p>
        </div>
        <div class="p-5 text-center">
          <p class="text-xs font-medium text-slate-500 dark:text-slate-400">Poin Aktif (Net)</p>
          <p class="mt-1 font-display text-3xl font-bold text-slate-800 dark:text-slate-100">{{ siswa?.poinAktif }}</p>
        </div>
      </div>
    </div>

    <!-- Recommendation -->
    <div class="card flex items-center gap-4 bg-gradient-to-r from-brand-50 to-teal-50 p-5 dark:from-brand-500/10 dark:to-teal-500/10">
      <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600 text-white">
        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>
      </div>
      <div class="flex-1">
        <p class="font-semibold text-brand-800 dark:text-brand-200">Rekomendasi Tindak Lanjut Otomatis</p>
        <p class="text-sm text-brand-700 dark:text-brand-300">{{ rek.nama }}: {{ rek.tindakan }}</p>
      </div>
      <button @click="router.push({ name: 'konseling' })" class="btn-primary text-sm">Hubungi Guru BK</button>
    </div>

    <!-- Two columns -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <!-- Konseling -->
      <div class="card overflow-hidden">
        <div class="border-b border-slate-200 p-5 dark:border-slate-700">
          <h3 class="section-title">Sesi Konseling Saya</h3>
        </div>
        <div class="divide-y divide-slate-100 dark:divide-slate-700/50">
          <div v-for="k in myKonseling" :key="k.id" class="p-4">
            <div class="flex items-center justify-between mb-1">
              <span class="badge" :class="statusKonselingColor[k.status]">{{ k.status }}</span>
              <span class="text-xs text-slate-400">{{ k.tanggal }} · {{ k.waktu }}</span>
            </div>
            <p class="text-sm font-semibold text-slate-800 dark:text-slate-100">{{ k.topik }}</p>
            <p class="text-xs text-slate-500 dark:text-slate-400">Jenis: {{ k.jenis }} · Konselor: {{ k.konselor }}</p>
          </div>
          <div v-if="myKonseling.length === 0" class="p-8 text-center text-sm text-slate-400">Belum ada sesi konseling terjadwal.</div>
        </div>
      </div>

      <!-- Prestasi -->
      <div class="card overflow-hidden">
        <div class="border-b border-slate-200 p-5 dark:border-slate-700">
          <h3 class="section-title">Prestasi Saya</h3>
        </div>
        <div class="divide-y divide-slate-100 dark:divide-slate-700/50">
          <div v-for="p in myPrestasi" :key="p.id" class="flex items-center justify-between p-4">
            <div>
              <p class="text-sm font-semibold text-slate-800 dark:text-slate-100">{{ p.namaLomba }}</p>
              <p class="text-xs text-slate-500 dark:text-slate-400">{{ p.tingkat }} · {{ p.hasil }}</p>
            </div>
            <span class="font-display text-lg font-bold text-brand-600 dark:text-brand-400">+{{ p.poin }}</span>
          </div>
          <div v-if="myPrestasi.length === 0" class="p-8 text-center text-sm text-slate-400">Belum ada prestasi tercatat.</div>
        </div>
      </div>
    </div>

    <!-- Pelanggaran history -->
    <div class="card overflow-hidden">
      <div class="border-b border-slate-200 p-5 dark:border-slate-700">
        <h3 class="section-title">Riwayat Pelanggaran Saya</h3>
      </div>
      <div class="divide-y divide-slate-100 dark:divide-slate-700/50">
        <div v-for="p in myPelanggaran" :key="p.id" class="flex items-start justify-between p-4">
          <div>
            <p class="text-sm font-semibold text-slate-800 dark:text-slate-100">{{ p.aturanNama }}</p>
            <p class="text-xs text-slate-500 dark:text-slate-400">{{ p.tanggal }} · {{ p.catatan }}</p>
          </div>
          <span class="font-display text-lg font-bold text-red-600 dark:text-red-400">+{{ p.poin }}</span>
        </div>
        <div v-if="myPelanggaran.length === 0" class="p-8 text-center text-sm text-slate-400">Tidak ada riwayat pelanggaran. Pertahankan!</div>
      </div>
    </div>
  </div>
</template>
