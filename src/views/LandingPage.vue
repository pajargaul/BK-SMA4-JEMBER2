<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useThemeStore } from '../stores/theme'
import { useDataStore } from '../stores/data'
import AnimatedCounter from '../components/AnimatedCounter.vue'

const theme = useThemeStore()
const data = useDataStore()
const router = useRouter()

const stats = [
  { label: 'Siswa Aktif', value: 487, suffix: '', icon: 'users', color: 'from-brand-500 to-brand-700' },
  { label: 'Kasus Konseling Selesai (Bulan Ini)', value: 34, suffix: '', icon: 'check', color: 'from-navy-500 to-navy-700' },
  { label: 'Total Poin Prestasi Positif', value: 285, suffix: '', icon: 'star', color: 'from-amber-400 to-amber-600' },
  { label: 'Tingkat Kepatuhan Tata Tertib', value: 92, suffix: '%', icon: 'shield', color: 'from-teal-500 to-teal-700' },
]

const features = [
  { title: 'Sistem Analisis Poin Siswa', desc: 'Pencatatan pelanggaran dan prestasi siswa yang terintegrasi, menghasilkan rekomendasi tindak lanjut otomatis secara adil dan transparan.', icon: 'chart' },
  { title: 'Bimbingan Personal & Konseling', desc: 'Manajemen sesi konseling pribadi yang aman dan terdokumentasi, membantu siswa mengatasi masalah personal, akademik, dan sosial.', icon: 'chat' },
  { title: 'Jembatan Karir & Perguruan Tinggi', desc: 'Panduan menuju perguruan tinggi negeri/swasta dan dunia kerja, lengkap dengan direktori kampus, gelombang pendaftaran, dan nilai potong.', icon: 'briefcase' },
  { title: 'Rekap Statistik & Akademik', desc: 'Visualisasi data demografi siswa, rekapitulasi kehadiran, dan integrasi nilai akademik untuk mendeteksi penurunan performa siswa.', icon: 'chart' },
  { title: 'Papan Pengumuman & Informasi', desc: 'Papan informasi real-time untuk pengumuman karir, jadwal pendaftaran SNBP/SNBT, dan lomba sekolah yang sedang berlangsung.', icon: 'bell' },
  { title: 'Lomba & Ekstrakurikuler', desc: 'Pencatatan lomba regional/nasional, rekomendasi kandidat siswa berdasarkan bakat, dan log kemenangan prestasi sekolah.', icon: 'trophy' },
]

const announcements = ref(data.pengumuman.filter(p => p.pinned || p.prioritas === 'Tinggi').slice(0, 4))

const catColor: Record<string, string> = {
  Karir: 'bg-brand-100 text-brand-700 dark:bg-brand-500/20 dark:text-brand-300',
  Universitas: 'bg-navy-100 text-navy-700 dark:bg-navy-500/20 dark:text-navy-300',
  Lomba: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300',
  Umum: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
}

const iconPaths: Record<string, string> = {
  users: 'M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.144 6.144 0 01-1.455-4.057c0-1.333.428-2.566 1.157-3.56C3.854 9.5 5.5 8 8.5 8c1.5 0 3 .5 4 1.5',
  check: 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  star: 'M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.482 20.4a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z',
  shield: 'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z',
  chart: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z',
  chat: 'M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.176 48.176 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z',
  briefcase: 'M20.25 14.15v4.073a2.25 2.25 0 01-2.25 2.25h-12a2.25 2.25 0 01-2.25-2.25V14.15m16.5 0a3 3 0 00-3-3h-10.5a3 3 0 00-3 3m16.5 0v-3.654a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v3.654',
  bell: 'M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0',
  trophy: 'M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m4.5 0a48.024 48.024 0 00-3.878-.306l-.112-.014a48 48 0 00-3.878-.306m6.018 0a23.901 23.901 0 00-3.878-.306l-.112-.014a23.875 23.875 0 00-3.878-.306m6.018 0h-.003v0m0 0h.003',
}

onMounted(() => theme.init())
</script>

<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-900">
    <!-- Navbar -->
    <nav class="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-slate-700 dark:bg-slate-800/80">
      <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-navy-700 text-white shadow-glow">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6M5.25 9v11a1.5 1.5 0 001.5 1.5h10.5a1.5 1.5 0 001.5-1.5V9" /></svg>
          </div>
          <div>
            <h1 class="font-display text-base font-bold text-slate-800 dark:text-slate-100">SIBK SMAN 4 Jember</h1>
            <p class="text-xs text-slate-500 dark:text-slate-400">Sistem Bimbingan Konseling & Poin Siswa</p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <button @click="theme.toggle()" class="rounded-xl p-2.5 text-slate-500 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700">
            <svg v-if="theme.isDark" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></svg>
            <svg v-else class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.72 9.72 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" /></svg>
          </button>
          <button @click="router.push('/login')" class="btn-primary">Masuk Sistem</button>
        </div>
      </div>
    </nav>

    <!-- Hero -->
    <section class="relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-navy-900 via-navy-800 to-brand-900"></div>
      <div class="absolute inset-0 opacity-20" style="background-image: radial-gradient(circle at 20% 50%, rgba(16,185,129,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(47,99,158,0.3) 0%, transparent 50%);"></div>
      <div class="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div class="mx-auto max-w-3xl text-center">
          <span class="badge bg-brand-500/20 text-brand-300 ring-1 ring-brand-500/30">Sistem Informasi BK Terpadu</span>
          <h1 class="mt-6 font-display text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
            Bimbingan Konseling &<br />
            <span class="bg-gradient-to-r from-brand-400 to-teal-300 bg-clip-text text-transparent">Sistem Poin Siswa</span>
          </h1>
          <p class="mt-6 text-lg text-slate-300">
            SMA Negeri 4 Jember berkomitmen membimbing setiap siswa menuju potensi terbaiknya melalui sistem pembinaan yang terstruktur, transparan, dan berorientasi pada masa depan akademik maupun karir.
          </p>
          <div class="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button @click="router.push('/login')" class="btn-primary px-6 py-3 text-base">Masuk ke Dashboard</button>
            <a href="#fitur" class="btn-outline border-white/30 bg-white/10 text-white hover:bg-white/20 px-6 py-3 text-base">Pelajari Sistem</a>
          </div>
        </div>

        <!-- Stats -->
        <div class="mt-16 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
          <div v-for="s in stats" :key="s.label" class="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm transition hover:bg-white/10">
            <div class="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br" :class="s.color">
              <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" :d="iconPaths[s.icon]" /></svg>
            </div>
            <p class="font-display text-3xl font-extrabold text-white"><AnimatedCounter :target="s.value" :suffix="s.suffix" /></p>
            <p class="mt-1 text-sm text-slate-300">{{ s.label }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section id="fitur" class="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-2xl text-center">
        <h2 class="font-display text-3xl font-bold text-slate-800 dark:text-slate-100">Sistem BK yang Menyeluruh</h2>
        <p class="mt-4 text-slate-600 dark:text-slate-400">Bagaimana SMAN 4 Jember memantau poin pelanggaran, menangani konsultasi personal, dan menjembatani jalur karir serta perguruan tinggi untuk setiap siswa.</p>
      </div>
      <div class="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="f in features" :key="f.title" class="card p-6 transition hover:-translate-y-1 hover:shadow-card">
          <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" :d="iconPaths[f.icon]" /></svg>
          </div>
          <h3 class="font-display text-lg font-bold text-slate-800 dark:text-slate-100">{{ f.title }}</h3>
          <p class="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{{ f.desc }}</p>
        </div>
      </div>
    </section>

    <!-- Info Corner -->
    <section class="bg-white dark:bg-slate-800">
      <div class="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div class="flex items-end justify-between">
          <div>
            <h2 class="font-display text-3xl font-bold text-slate-800 dark:text-slate-100">Papan Informasi Terkini</h2>
            <p class="mt-2 text-slate-600 dark:text-slate-400">Pengumuman terbaru seputar karir, pendaftaran perguruan tinggi, dan lomba sekolah.</p>
          </div>
          <button @click="router.push('/login')" class="hidden btn-ghost sm:flex">Lihat Semua</button>
        </div>
        <div class="mt-8 grid gap-4 md:grid-cols-2">
          <div v-for="a in announcements" :key="a.id" class="card flex flex-col p-5 transition hover:shadow-card">
            <div class="mb-3 flex items-center justify-between">
              <span class="badge" :class="catColor[a.kategori]">{{ a.kategori }}</span>
              <span v-if="a.pinned" class="badge bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">Disematkan</span>
            </div>
            <h3 class="font-display text-base font-bold text-slate-800 dark:text-slate-100">{{ a.judul }}</h3>
            <p class="mt-2 flex-1 text-sm text-slate-600 dark:text-slate-400 line-clamp-3">{{ a.isi }}</p>
            <p class="mt-3 text-xs text-slate-400">{{ new Date(a.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div class="overflow-hidden rounded-3xl bg-gradient-to-br from-brand-700 via-brand-600 to-navy-700 p-10 text-center shadow-glow lg:p-16">
        <h2 class="font-display text-3xl font-bold text-white lg:text-4xl">Siap Memulai?</h2>
        <p class="mx-auto mt-4 max-w-xl text-brand-50">Akses dashboard BK, catat pembinaan siswa, dan pantau perkembangan akademik secara terintegrasi.</p>
        <button @click="router.push('/login')" class="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-base font-semibold text-brand-700 transition hover:bg-brand-50">Masuk ke Sistem</button>
      </div>
    </section>

    <!-- Footer -->
    <footer class="border-t border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
      <div class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div class="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div class="flex items-center gap-3">
            <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-brand-600 to-navy-700 text-white">
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6M5.25 9v11a1.5 1.5 0 001.5 1.5h10.5a1.5 1.5 0 001.5-1.5V9" /></svg>
            </div>
            <div>
              <p class="text-sm font-bold text-slate-800 dark:text-slate-100">SIBK SMAN 4 Jember</p>
              <p class="text-xs text-slate-500 dark:text-slate-400">Jl. Imam Bonjol No. 04, Jember, Jawa Timur</p>
            </div>
          </div>
          <p class="text-xs text-slate-500 dark:text-slate-400">© 2026 SMA Negeri 4 Jember. Sistem Bimbingan Konseling Terpadu.</p>
        </div>
      </div>
    </footer>
  </div>
</template>
