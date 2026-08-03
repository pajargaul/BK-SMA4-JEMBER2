<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useThemeStore } from '../stores/theme'
import type { Role } from '../types'

const auth = useAuthStore()
const theme = useThemeStore()
const router = useRouter()

const selectedRole = ref<Role | null>(null)
const email = ref('')
const password = ref('')
const error = ref('')

const roles: { value: Role; label: string; desc: string; icon: string; color: string }[] = [
  { value: 'kepala_sekolah', label: 'Kepala Sekolah', desc: 'Pantau seluruh rekapitulasi & analitik BK', icon: 'school', color: 'from-navy-600 to-navy-800' },
  { value: 'guru_bk', label: 'Guru BK / Konselor', desc: 'Kelola pelanggaran, konseling & bimbingan karir', icon: 'counselor', color: 'from-brand-600 to-brand-800' },
  { value: 'admin', label: 'Administrator Sistem', desc: 'Konfigurasi aturan & pengelolaan sistem', icon: 'admin', color: 'from-teal-600 to-teal-800' },
  { value: 'siswa', label: 'Siswa', desc: 'Lihat poin pribadi & jadwal bimbingan', icon: 'student', color: 'from-amber-500 to-amber-700' },
]

const iconPaths: Record<string, string> = {
  school: 'M4.26 10.53a64.026 64.026 0 00-1.26 3.47m1.26-3.47C5.677 7.834 7.24 5.45 9.213 3.42M4.26 10.53a64.79 64.79 0 003.42 9.47m0 0a48.18 48.18 0 003.42-9.47m-3.42 9.47c1.973 2.03 3.536 4.414 4.953 7.11M9.213 3.42C11.186 1.39 13.749 0 16.5 0c2.751 0 5.314 1.39 7.287 3.42M9.213 3.42C7.24 5.45 5.677 7.834 4.26 10.53m15.587 0a64.026 64.026 0 011.26 3.47m-1.26-3.47c-1.417-2.696-2.98-5.08-4.953-7.11m6.213 3.47a64.79 64.79 0 01-3.42 9.47m3.42-9.47c1.417 2.696 2.98 5.08 4.953 7.11',
  counselor: 'M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z',
  admin: 'M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.37.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.37-.49l-1.296-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.241.437-.613.43-.992a7.716 7.716 0 010-.255c.007-.378-.138-.75-.43-.991l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.281z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
  student: 'M4.26 10.53a64.026 64.026 0 00-1.26 3.47m1.26-3.47C5.677 7.834 7.24 5.45 9.213 3.42M4.26 10.53a64.79 64.79 0 003.42 9.47m0 0a48.18 48.18 0 003.42-9.47m-3.42 9.47c1.973 2.03 3.536 4.414 4.953 7.11',
}

function selectRole(role: Role) {
  selectedRole.value = role
  const userMap: Record<Role, string> = {
    kepala_sekolah: 'kepsek@sman4jember.sch.id',
    guru_bk: 'gurubk@sman4jember.sch.id',
    admin: 'admin@sman4jember.sch.id',
    siswa: 'aisyah.putri@siswa.sch.id',
  }
  email.value = userMap[role]
  password.value = 'demo1234'
}

function handleLogin() {
  if (!selectedRole.value) {
    error.value = 'Silakan pilih peran terlebih dahulu'
    return
  }
  if (selectedRole.value === 'siswa') {
    auth.loginAsStudent()
  } else {
    auth.login(selectedRole.value)
  }
  router.push('/dashboard/home')
}
</script>

<template>
  <div class="flex min-h-screen bg-slate-50 dark:bg-slate-900">
    <!-- Left panel -->
    <div class="relative hidden w-1/2 overflow-hidden lg:block">
      <div class="absolute inset-0 bg-gradient-to-br from-navy-900 via-navy-800 to-brand-900"></div>
      <div class="absolute inset-0 opacity-20" style="background-image: radial-gradient(circle at 30% 50%, rgba(16,185,129,0.4) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(47,99,158,0.3) 0%, transparent 50%);"></div>
      <div class="relative flex h-full flex-col justify-center p-12">
        <div class="flex items-center gap-3">
          <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-white backdrop-blur-sm">
            <svg class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6M5.25 9v11a1.5 1.5 0 001.5 1.5h10.5a1.5 1.5 0 001.5-1.5V9" /></svg>
          </div>
          <div>
            <h1 class="font-display text-xl font-bold text-white">SIBK SMAN 4 Jember</h1>
            <p class="text-sm text-slate-300">Sistem Bimbingan Konseling & Poin Siswa</p>
          </div>
        </div>
        <h2 class="mt-12 font-display text-4xl font-extrabold leading-tight text-white">
          Membimbing setiap siswa<br />menuju masa depan yang lebih baik
        </h2>
        <p class="mt-6 max-w-md text-lg text-slate-300">
          Sistem terpadu untuk pencatatan poin pelanggaran, sesi konseling personal, bimbingan karir perguruan tinggi, dan rekapitulasi akademik siswa SMA Negeri 4 Jember.
        </p>
        <div class="mt-10 space-y-4">
          <div v-for="f in ['Rekomendasi tindak lanjut otomatis berdasarkan akumulasi poin', 'Log pembinaan & konseling yang aman dan terdokumentasi', 'Direktori kampus lengkap dengan gelombang & nilai potong']" :key="f" class="flex items-center gap-3 text-slate-200">
            <div class="flex h-6 w-6 items-center justify-center rounded-full bg-brand-500/30 text-brand-300">
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
            </div>
            <span class="text-sm">{{ f }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Right panel -->
    <div class="flex w-full items-center justify-center p-6 lg:w-1/2">
      <div class="w-full max-w-md">
        <div class="mb-8 text-center lg:hidden">
          <div class="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-navy-700 text-white">
            <svg class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6M5.25 9v11a1.5 1.5 0 001.5 1.5h10.5a1.5 1.5 0 001.5-1.5V9" /></svg>
          </div>
          <h1 class="font-display text-xl font-bold text-slate-800 dark:text-slate-100">SIBK SMAN 4 Jember</h1>
        </div>

        <h2 class="font-display text-2xl font-bold text-slate-800 dark:text-slate-100">Selamat Datang</h2>
        <p class="mt-2 text-sm text-slate-600 dark:text-slate-400">Pilih peran Anda untuk masuk ke sistem.</p>

        <div class="mt-6 grid grid-cols-2 gap-3">
          <button
            v-for="r in roles"
            :key="r.value"
            @click="selectRole(r.value)"
            class="rounded-2xl border-2 p-4 text-left transition"
            :class="selectedRole === r.value ? 'border-brand-500 bg-brand-50 dark:bg-brand-500/10' : 'border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600'"
          >
            <div class="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br text-white" :class="r.color">
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" :d="iconPaths[r.icon]" /></svg>
            </div>
            <p class="text-sm font-bold text-slate-800 dark:text-slate-100">{{ r.label }}</p>
            <p class="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{{ r.desc }}</p>
          </button>
        </div>

        <form @submit.prevent="handleLogin" class="mt-6 space-y-4">
          <div>
            <label class="label">Email</label>
            <input v-model="email" type="email" class="input" placeholder="nama@sman4jember.sch.id" />
          </div>
          <div>
            <label class="label">Kata Sandi</label>
            <input v-model="password" type="password" class="input" placeholder="••••••••" />
          </div>
          <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
          <button type="submit" class="btn-primary w-full py-3 text-base">Masuk ke Dashboard</button>
        </form>

        <p class="mt-4 text-center text-xs text-slate-500 dark:text-slate-400">
          Demo: pilih peran, email & sandi terisi otomatis. Klik "Masuk".
        </p>

        <button @click="theme.toggle()" class="mt-4 mx-auto flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400">
          <svg v-if="theme.isDark" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></svg>
          <svg v-else class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.72 9.72 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" /></svg>
          {{ theme.isDark ? 'Mode Terang' : 'Mode Gelap' }}
        </button>

        <div class="mt-6 text-center">
          <button @click="$router.push('/')" class="text-sm text-slate-500 hover:text-brand-600 dark:text-slate-400">← Kembali ke Beranda</button>
        </div>
      </div>
    </div>
  </div>
</template>
