<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDataStore } from '../../stores/data'
import BaseModal from '../../components/BaseModal.vue'
import type { TingkatPrestasi } from '../../types'

const data = useDataStore()

const showAdd = ref(false)
const form = ref({
  siswaId: '',
  namaLomba: '',
  kategori: '',
  tingkat: 'Sekolah' as TingkatPrestasi,
  hasil: '',
  tanggal: new Date().toISOString().slice(0, 10),
})

const tingkatPoin: Record<TingkatPrestasi, number> = {
  Sekolah: 10,
  Kabupaten: 20,
  Provinsi: 30,
  Nasional: 50,
  Internasional: 75,
}

const selectedSiswa = computed(() => data.siswa.find(s => s.id === form.value.siswaId))
const computedPoin = computed(() => tingkatPoin[form.value.tingkat] || 0)

function submitPrestasi() {
  if (!form.value.siswaId || !form.value.namaLomba) return
  const siswa = data.getSiswaById(form.value.siswaId)
  if (!siswa) return
  const kelas = data.getKelasById(siswa.kelasId)
  data.addPrestasi({
    siswaId: siswa.id,
    siswaNama: siswa.nama,
    kelasNama: kelas?.nama || '',
    namaLomba: form.value.namaLomba,
    kategori: form.value.kategori || 'Umum',
    tingkat: form.value.tingkat,
    poin: computedPoin.value,
    tanggal: form.value.tanggal,
    hasil: form.value.hasil || 'Peserta',
  })
  showAdd.value = false
  form.value = { siswaId: '', namaLomba: '', kategori: '', tingkat: 'Sekolah', hasil: '', tanggal: new Date().toISOString().slice(0, 10) }
}

const tingkatColor: Record<string, string> = {
  Sekolah: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
  Kabupaten: 'bg-brand-100 text-brand-700 dark:bg-brand-500/20 dark:text-brand-300',
  Provinsi: 'bg-navy-100 text-navy-700 dark:bg-navy-500/20 dark:text-navy-300',
  Nasional: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300',
  Internasional: 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300',
}

const totalPoin = computed(() => data.prestasi.reduce((s, p) => s + p.poin, 0))
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="font-display text-2xl font-bold text-slate-800 dark:text-slate-100">Poin Prestasi Siswa</h1>
        <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Prestasi akademik & non-akademik berfungsi sebagai pengurang poin pelanggaran aktif siswa.</p>
      </div>
      <button @click="showAdd = true" class="btn-primary">
        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
        Catat Prestasi Baru
      </button>
    </div>

    <!-- Info banner -->
    <div class="card flex items-center gap-4 bg-gradient-to-r from-brand-50 to-teal-50 p-5 dark:from-brand-500/10 dark:to-teal-500/10">
      <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600 text-white">
        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.482 20.4a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>
      </div>
      <div>
        <p class="font-semibold text-brand-800 dark:text-brand-200">Sistem Pengurang Poin Otomatis</p>
        <p class="text-sm text-brand-700 dark:text-brand-300">Setiap prestasi yang dicatat akan otomatis mengurangi poin pelanggaran aktif siswa. Total {{ totalPoin }} poin prestasi terkumpul dari {{ data.prestasi.length }} catatan.</p>
      </div>
    </div>

    <!-- Prestasi grid -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div v-for="p in data.prestasi" :key="p.id" class="card p-5 transition hover:-translate-y-1 hover:shadow-card">
        <div class="flex items-start justify-between mb-3">
          <span class="badge" :class="tingkatColor[p.tingkat]">{{ p.tingkat }}</span>
          <span class="badge bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">{{ p.hasil }}</span>
        </div>
        <h3 class="font-display text-base font-bold text-slate-800 dark:text-slate-100">{{ p.namaLomba }}</h3>
        <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">{{ p.kategori }}</p>
        <div class="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-700">
          <div>
            <p class="text-sm font-semibold text-slate-800 dark:text-slate-100">{{ p.siswaNama }}</p>
            <p class="text-xs text-slate-400">{{ p.kelasNama }} · {{ p.tanggal }}</p>
          </div>
          <span class="font-display text-2xl font-bold text-brand-600 dark:text-brand-400">+{{ p.poin }}</span>
        </div>
      </div>
    </div>

    <!-- Add Modal -->
    <BaseModal :show="showAdd" @close="showAdd = false" title="Catat Prestasi Siswa" size="lg">
      <div class="space-y-4">
        <div>
          <label class="label">Siswa</label>
          <select v-model="form.siswaId" class="input">
            <option value="">Pilih siswa...</option>
            <option v-for="s in data.siswa" :key="s.id" :value="s.id">{{ s.nama }} - {{ data.getKelasById(s.kelasId)?.nama }}</option>
          </select>
        </div>
        <div v-if="selectedSiswa" class="rounded-xl bg-slate-50 p-3 dark:bg-slate-700/40">
          <p class="text-sm text-slate-600 dark:text-slate-300">Poin pelanggaran aktif saat ini: <span class="font-bold text-red-600 dark:text-red-400">{{ selectedSiswa.poinAktif }}</span></p>
          <p class="text-sm text-slate-600 dark:text-slate-300">Setelah prestasi ini: <span class="font-bold text-brand-600 dark:text-brand-400">{{ Math.max(0, selectedSiswa.poinAktif - computedPoin) }}</span></p>
        </div>
        <div>
          <label class="label">Nama Lomba / Prestasi</label>
          <input v-model="form.namaLomba" type="text" class="input" placeholder="cth: Olimpiade Matematika Tingkat Provinsi" />
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="label">Kategori</label>
            <input v-model="form.kategori" type="text" class="input" placeholder="cth: Sains, Olahraga, Seni" />
          </div>
          <div>
            <label class="label">Hasil</label>
            <input v-model="form.hasil" type="text" class="input" placeholder="cth: Juara 1, Juara 2, Peserta" />
          </div>
        </div>
        <div class="grid grid-cols-2 gap-3">
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
          <div>
            <label class="label">Tanggal</label>
            <input v-model="form.tanggal" type="date" class="input" />
          </div>
        </div>
        <div class="rounded-xl bg-brand-50 p-3 dark:bg-brand-500/10">
          <p class="text-sm font-semibold text-brand-700 dark:text-brand-300">Poin prestasi yang akan diberikan: +{{ computedPoin }}</p>
        </div>
        <div class="flex justify-end gap-3 pt-2">
          <button @click="showAdd = false" class="btn-ghost">Batal</button>
          <button @click="submitPrestasi" :disabled="!form.siswaId || !form.namaLomba" class="btn-primary">Catat Prestasi</button>
        </div>
      </div>
    </BaseModal>
  </div>
</template>
