<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDataStore } from '../../stores/data'
import BaseModal from '../../components/BaseModal.vue'
import type { Kampus } from '../../types'

const data = useDataStore()

const activeTab = ref<'kampus' | 'kerja' | 'pengumuman'>('kampus')
const filterJenisKampus = ref('')
const selectedKampus = ref<Kampus | null>(null)

const filteredKampus = computed(() => {
  if (!filterJenisKampus.value) return data.kampus
  return data.kampus.filter(k => k.jenis === filterJenisKampus.value)
})

const careerAnnouncements = computed(() => data.pengumuman.filter(p => p.kategori === 'Karir' || p.kategori === 'Universitas'))

const jenisColor: Record<string, string> = {
  Negeri: 'bg-brand-100 text-brand-700 dark:bg-brand-500/20 dark:text-brand-300',
  Swasta: 'bg-navy-100 text-navy-700 dark:bg-navy-500/20 dark:text-navy-300',
}

const jobTypeColor: Record<string, string> = {
  Magang: 'bg-brand-100 text-brand-700 dark:bg-brand-500/20 dark:text-brand-300',
  Kerja: 'bg-navy-100 text-navy-700 dark:bg-navy-500/20 dark:text-navy-300',
  Pelatihan: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300',
  Sertifikasi: 'bg-teal-100 text-teal-700 dark:bg-teal-500/20 dark:text-teal-300',
}

const catColor: Record<string, string> = {
  Karir: 'bg-brand-100 text-brand-700 dark:bg-brand-500/20 dark:text-brand-300',
  Universitas: 'bg-navy-100 text-navy-700 dark:bg-navy-500/20 dark:text-navy-300',
}
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="font-display text-2xl font-bold text-slate-800 dark:text-slate-100">Bimbingan Karir & Masa Depan</h1>
      <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Direktori perguruan tinggi, lowongan dunia kerja, dan pengumuman karir untuk siswa.</p>
    </div>

    <!-- Tabs -->
    <div class="flex gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
      <button @click="activeTab = 'kampus'" class="flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition" :class="activeTab === 'kampus' ? 'bg-white text-brand-700 shadow-soft dark:bg-slate-700 dark:text-brand-300' : 'text-slate-500 dark:text-slate-400'">Direktori Kampus</button>
      <button @click="activeTab = 'kerja'" class="flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition" :class="activeTab === 'kerja' ? 'bg-white text-brand-700 shadow-soft dark:bg-slate-700 dark:text-brand-300' : 'text-slate-500 dark:text-slate-400'">Dunia Kerja</button>
      <button @click="activeTab = 'pengumuman'" class="flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition" :class="activeTab === 'pengumuman' ? 'bg-white text-brand-700 shadow-soft dark:bg-slate-700 dark:text-brand-300' : 'text-slate-500 dark:text-slate-400'">Pengumuman Karir</button>
    </div>

    <!-- Kampus Tab -->
    <div v-if="activeTab === 'kampus'">
      <div class="mb-4 flex gap-2">
        <button @click="filterJenisKampus = ''" class="btn text-xs" :class="!filterJenisKampus ? 'btn-primary' : 'btn-outline'">Semua</button>
        <button @click="filterJenisKampus = 'Negeri'" class="btn text-xs" :class="filterJenisKampus === 'Negeri' ? 'btn-primary' : 'btn-outline'">Negeri</button>
        <button @click="filterJenisKampus = 'Swasta'" class="btn text-xs" :class="filterJenisKampus === 'Swasta' ? 'btn-primary' : 'btn-outline'">Swasta</button>
      </div>
      <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="k in filteredKampus" :key="k.id" class="card overflow-hidden transition hover:-translate-y-1 hover:shadow-card">
          <div class="relative h-32 bg-gradient-to-br from-navy-700 to-brand-700">
            <img :src="k.logo" :alt="k.nama" class="h-full w-full object-cover opacity-30" />
            <div class="absolute inset-0 flex items-center justify-center">
              <span class="badge" :class="jenisColor[k.jenis]">{{ k.jenis }}</span>
            </div>
          </div>
          <div class="p-5">
            <h3 class="font-display text-base font-bold text-slate-800 dark:text-slate-100">{{ k.nama }}</h3>
            <p class="mt-1 flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
              {{ k.lokasi }}
            </p>
            <p class="mt-2 text-sm text-slate-600 dark:text-slate-300 line-clamp-2">{{ k.deskripsi }}</p>
            <div class="mt-3 flex items-center justify-between">
              <span class="badge bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">Akreditasi {{ k.akreditasi }}</span>
              <button @click="selectedKampus = k" class="text-sm font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400">Lihat Detail</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Kerja Tab -->
    <div v-if="activeTab === 'kerja'">
      <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div v-for="l in data.lowongan" :key="l.id" class="card p-5 transition hover:shadow-card">
          <div class="flex items-start justify-between mb-3">
            <span class="badge" :class="jobTypeColor[l.jenis]">{{ l.jenis }}</span>
            <span class="text-xs text-slate-400">Deadline: {{ l.deadline }}</span>
          </div>
          <h3 class="font-display text-base font-bold text-slate-800 dark:text-slate-100">{{ l.judul }}</h3>
          <p class="text-sm font-medium text-brand-600 dark:text-brand-400">{{ l.perusahaan }}</p>
          <p class="mt-1 flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
            {{ l.lokasi }}<span v-if="l.durasi"> · {{ l.durasi }}</span>
          </p>
          <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">{{ l.deskripsi }}</p>
          <div class="mt-3">
            <p class="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Persyaratan:</p>
            <ul class="space-y-1">
              <li v-for="(p, i) in l.persyaratan" :key="i" class="flex items-start gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                <svg class="mt-0.5 h-3 w-3 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                {{ p }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Pengumuman Tab -->
    <div v-if="activeTab === 'pengumuman'">
      <div class="space-y-4">
        <div v-for="p in careerAnnouncements" :key="p.id" class="card p-5">
          <div class="flex items-center justify-between mb-2">
            <span class="badge" :class="catColor[p.kategori]">{{ p.kategori }}</span>
            <span class="text-xs text-slate-400">{{ p.tanggal }}</span>
          </div>
          <h3 class="font-display text-base font-bold text-slate-800 dark:text-slate-100">{{ p.judul }}</h3>
          <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">{{ p.isi }}</p>
        </div>
      </div>
    </div>

    <!-- Kampus Detail Modal -->
    <BaseModal :show="!!selectedKampus" @close="selectedKampus = null" :title="selectedKampus?.nama" size="xl">
      <div v-if="selectedKampus" class="space-y-5">
        <div class="flex items-center gap-3">
          <span class="badge" :class="jenisColor[selectedKampus.jenis]">{{ selectedKampus.jenis }}</span>
          <span class="badge bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">Akreditasi {{ selectedKampus.akreditasi }}</span>
          <span class="text-sm text-slate-500 dark:text-slate-400">{{ selectedKampus.lokasi }}</span>
        </div>
        <p class="text-sm text-slate-600 dark:text-slate-300">{{ selectedKampus.deskripsi }}</p>

        <div>
          <h4 class="mb-2 font-display text-sm font-bold text-slate-800 dark:text-slate-100">Fakultas & Program Studi Tersedia</h4>
          <div class="flex flex-wrap gap-2">
            <span v-for="f in selectedKampus.fakultas" :key="f" class="badge bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300">{{ f }}</span>
          </div>
        </div>

        <div>
          <h4 class="mb-2 font-display text-sm font-bold text-slate-800 dark:text-slate-100">Gelombang Pendaftaran</h4>
          <div class="space-y-2">
            <div v-for="(g, i) in selectedKampus.gelombang" :key="i" class="rounded-xl border border-slate-200 p-3 dark:border-slate-700">
              <div class="flex items-center justify-between">
                <span class="font-semibold text-slate-800 dark:text-slate-100">{{ g.nama }}</span>
                <span class="badge bg-navy-100 text-navy-700 dark:bg-navy-500/20 dark:text-navy-300">{{ g.jalur }}</span>
              </div>
              <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">{{ g.tanggalMulai }} - {{ g.tanggalSelesai }}</p>
            </div>
          </div>
        </div>

        <div>
          <h4 class="mb-2 font-display text-sm font-bold text-slate-800 dark:text-slate-100">Historis Nilai Potong (Tahun {{ selectedKampus.nilaiPotong[0]?.tahun }})</h4>
          <div class="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
            <table class="w-full">
              <thead class="bg-slate-50 dark:bg-slate-700/40">
                <tr>
                  <th class="table-th">Program Studi</th>
                  <th class="table-th">Nilai Potong</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-700/50">
                <tr v-for="(n, i) in selectedKampus.nilaiPotong" :key="i">
                  <td class="table-td">{{ n.prodi }}</td>
                  <td class="table-td"><span class="font-display font-bold text-navy-700 dark:text-navy-300">{{ n.nilai }}</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </BaseModal>
  </div>
</template>
