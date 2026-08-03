<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDataStore } from '../../stores/data'
import BaseModal from '../../components/BaseModal.vue'
import type { TingkatPrestasi } from '../../types'

const data = useDataStore()
const showAdd = ref(false)
const selectedLomba = ref<string | null>(null)

const form = ref({
  nama: '',
  kategori: '',
  tingkat: 'Kabupaten' as TingkatPrestasi,
  tanggal: '',
  deadlineDaftar: '',
  persyaratan: '',
})

function submitLomba() {
  if (!form.value.nama) return
  data.addLomba({
    nama: form.value.nama,
    kategori: form.value.kategori || 'Umum',
    tingkat: form.value.tingkat,
    tanggal: form.value.tanggal,
    deadlineDaftar: form.value.deadlineDaftar,
    persyaratan: form.value.persyaratan.split('\n').filter(s => s.trim()),
    kandidatRekomendasi: [],
    status: 'Pendaftaran',
  })
  showAdd.value = false
  form.value = { nama: '', kategori: '', tingkat: 'Kabupaten', tanggal: '', deadlineDaftar: '', persyaratan: '' }
}

const detailLomba = computed(() => data.lomba.find(l => l.id === selectedLomba.value))

const statusColor: Record<string, string> = {
  Pendaftaran: 'bg-brand-100 text-brand-700 dark:bg-brand-500/20 dark:text-brand-300',
  Berlangsung: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300',
  Selesai: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
}

const tingkatColor: Record<string, string> = {
  Sekolah: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
  Kabupaten: 'bg-brand-100 text-brand-700 dark:bg-brand-500/20 dark:text-brand-300',
  Provinsi: 'bg-navy-100 text-navy-700 dark:bg-navy-500/20 dark:text-navy-300',
  Nasional: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300',
  Internasional: 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300',
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="font-display text-2xl font-bold text-slate-800 dark:text-slate-100">Lomba & Ekstrakurikuler</h1>
        <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Pencatatan lomba regional/nasional, rekomendasi kandidat siswa, dan log kemenangan.</p>
      </div>
      <button @click="showAdd = true" class="btn-primary">
        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
        Tambah Lomba
      </button>
    </div>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div v-for="l in data.lomba" :key="l.id" class="card p-5 transition hover:-translate-y-1 hover:shadow-card">
        <div class="flex items-start justify-between mb-3">
          <span class="badge" :class="tingkatColor[l.tingkat]">{{ l.tingkat }}</span>
          <span class="badge" :class="statusColor[l.status]">{{ l.status }}</span>
        </div>
        <h3 class="font-display text-base font-bold text-slate-800 dark:text-slate-100">{{ l.nama }}</h3>
        <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">{{ l.kategori }}</p>
        <div class="mt-3 space-y-1 text-xs text-slate-500 dark:text-slate-400">
          <p>Tanggal: <span class="font-medium text-slate-700 dark:text-slate-200">{{ l.tanggal }}</span></p>
          <p>Deadline Daftar: <span class="font-medium" :class="l.status === 'Pendaftaran' ? 'text-amber-600 dark:text-amber-400' : 'text-slate-700 dark:text-slate-200'">{{ l.deadlineDaftar }}</span></p>
        </div>
        <div v-if="l.hasil" class="mt-3 rounded-lg bg-brand-50 p-2 text-center dark:bg-brand-500/10">
          <span class="font-display text-sm font-bold text-brand-700 dark:text-brand-300">Hasil: {{ l.hasil }}</span>
        </div>
        <div v-if="l.kandidatRekomendasi.length" class="mt-3">
          <p class="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Kandidat Rekomendasi:</p>
          <div class="flex flex-wrap gap-1">
            <span v-for="(k, i) in l.kandidatRekomendasi" :key="i" class="badge bg-navy-100 text-navy-700 dark:bg-navy-500/20 dark:text-navy-300">{{ k }}</span>
          </div>
        </div>
        <button @click="selectedLomba = l.id" class="mt-4 w-full btn-outline text-sm">Lihat Detail</button>
      </div>
    </div>

    <!-- Add Modal -->
    <BaseModal :show="showAdd" @close="showAdd = false" title="Tambah Lomba / Kompetisi" size="lg">
      <div class="space-y-4">
        <div>
          <label class="label">Nama Lomba</label>
          <input v-model="form.nama" type="text" class="input" placeholder="cth: Olimpiade Sains Nasional 2026" />
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="label">Kategori</label>
            <input v-model="form.kategori" type="text" class="input" placeholder="cth: Sains, Olahraga, Seni" />
          </div>
          <div>
            <label class="label">Tingkat</label>
            <select v-model="form.tingkat" class="input">
              <option>Sekolah</option>
              <option>Kabupaten</option>
              <option>Provinsi</option>
              <option>Nasional</option>
              <option>Internasional</option>
            </select>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="label">Tanggal Pelaksanaan</label>
            <input v-model="form.tanggal" type="date" class="input" />
          </div>
          <div>
            <label class="label">Deadline Pendaftaran</label>
            <input v-model="form.deadlineDaftar" type="date" class="input" />
          </div>
        </div>
        <div>
          <label class="label">Persyaratan (satu per baris)</label>
          <textarea v-model="form.persyaratan" class="input" rows="4" placeholder="Raport minimal 85&#10;Surat rekomendasi guru"></textarea>
        </div>
        <div class="flex justify-end gap-3 pt-2">
          <button @click="showAdd = false" class="btn-ghost">Batal</button>
          <button @click="submitLomba" :disabled="!form.nama" class="btn-primary">Tambah Lomba</button>
        </div>
      </div>
    </BaseModal>

    <!-- Detail Modal -->
    <BaseModal :show="!!selectedLomba" @close="selectedLomba = null" title="Detail Lomba" size="lg">
      <div v-if="detailLomba" class="space-y-4">
        <div class="flex items-center gap-2">
          <span class="badge" :class="tingkatColor[detailLomba.tingkat]">{{ detailLomba.tingkat }}</span>
          <span class="badge" :class="statusColor[detailLomba.status]">{{ detailLomba.status }}</span>
        </div>
        <h3 class="font-display text-lg font-bold text-slate-800 dark:text-slate-100">{{ detailLomba.nama }}</h3>
        <p class="text-sm text-slate-600 dark:text-slate-300">Kategori: {{ detailLomba.kategori }}</p>
        <div class="grid grid-cols-2 gap-3 text-sm">
          <div class="rounded-xl bg-slate-50 p-3 dark:bg-slate-700/40">
            <p class="text-xs text-slate-400">Tanggal Pelaksanaan</p>
            <p class="font-semibold text-slate-800 dark:text-slate-100">{{ detailLomba.tanggal }}</p>
          </div>
          <div class="rounded-xl bg-slate-50 p-3 dark:bg-slate-700/40">
            <p class="text-xs text-slate-400">Deadline Pendaftaran</p>
            <p class="font-semibold text-slate-800 dark:text-slate-100">{{ detailLomba.deadlineDaftar }}</p>
          </div>
        </div>
        <div>
          <p class="label">Persyaratan</p>
          <ul class="space-y-1">
            <li v-for="(p, i) in detailLomba.persyaratan" :key="i" class="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
              <svg class="mt-0.5 h-4 w-4 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
              {{ p }}
            </li>
          </ul>
        </div>
        <div v-if="detailLomba.kandidatRekomendasi.length">
          <p class="label">Kandidat Siswa Rekomendasi</p>
          <div class="flex flex-wrap gap-2">
            <span v-for="(k, i) in detailLomba.kandidatRekomendasi" :key="i" class="badge bg-navy-100 text-navy-700 dark:bg-navy-500/20 dark:text-navy-300">{{ k }}</span>
          </div>
        </div>
        <div v-if="detailLomba.hasil" class="rounded-xl bg-brand-50 p-4 text-center dark:bg-brand-500/10">
          <p class="font-display text-lg font-bold text-brand-700 dark:text-brand-300">Hasil: {{ detailLomba.hasil }}</p>
        </div>
      </div>
    </BaseModal>
  </div>
</template>
