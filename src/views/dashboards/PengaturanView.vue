<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '../../stores/auth'

const auth = useAuthStore()

const form = ref({
  name: auth.currentUser?.name || '',
  nipNis: auth.currentUser?.nipNis || '',
  email: auth.currentUser?.email || '',
  phone: auth.currentUser?.phone || '',
  avatar: auth.currentUser?.avatar || '',
})

const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const passwordMsg = ref('')
const profileMsg = ref('')

function saveProfile() {
  auth.updateProfile({
    name: form.value.name,
    nipNis: form.value.nipNis,
    email: form.value.email,
    phone: form.value.phone,
    avatar: form.value.avatar,
  })
  profileMsg.value = 'Profil berhasil diperbarui.'
  setTimeout(() => profileMsg.value = '', 3000)
}

function changePassword() {
  if (newPassword.value !== confirmPassword.value) {
    passwordMsg.value = 'Konfirmasi kata sandi tidak cocok.'
    return
  }
  if (newPassword.value.length < 6) {
    passwordMsg.value = 'Kata sandi minimal 6 karakter.'
    return
  }
  passwordMsg.value = 'Kata sandi berhasil diubah.'
  currentPassword.value = ''
  newPassword.value = ''
  confirmPassword.value = ''
  setTimeout(() => passwordMsg.value = '', 3000)
}
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="font-display text-2xl font-bold text-slate-800 dark:text-slate-100">Pengaturan Profil</h1>
      <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Kelola informasi pribadi dan keamanan akun Anda.</p>
    </div>

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <!-- Avatar card -->
      <div class="card p-6 text-center">
        <img :src="form.avatar" :alt="form.name" class="mx-auto h-24 w-24 rounded-2xl object-cover ring-4 ring-brand-500/20" />
        <h3 class="mt-4 font-display text-lg font-bold text-slate-800 dark:text-slate-100">{{ form.name }}</h3>
        <p class="text-sm text-slate-500 dark:text-slate-400">{{ form.email }}</p>
        <div class="mt-4">
          <label class="label text-left">URL Foto Profil</label>
          <input v-model="form.avatar" type="text" class="input" placeholder="https://..." />
        </div>
      </div>

      <!-- Profile form -->
      <div class="card p-6 lg:col-span-2">
        <h3 class="section-title mb-4">Informasi Pribadi</h3>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label class="label">Nama Lengkap</label>
            <input v-model="form.name" type="text" class="input" />
          </div>
          <div>
            <label class="label">NIP / NIS</label>
            <input v-model="form.nipNis" type="text" class="input" />
          </div>
          <div>
            <label class="label">Email</label>
            <input v-model="form.email" type="email" class="input" />
          </div>
          <div>
            <label class="label">Nomor Telepon</label>
            <input v-model="form.phone" type="text" class="input" />
          </div>
        </div>
        <div class="mt-5 flex items-center gap-3">
          <button @click="saveProfile" class="btn-primary">Simpan Perubahan</button>
          <span v-if="profileMsg" class="text-sm font-medium text-brand-600 dark:text-brand-400">{{ profileMsg }}</span>
        </div>
      </div>
    </div>

    <!-- Password -->
    <div class="card p-6">
      <h3 class="section-title mb-4">Ubah Kata Sandi</h3>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label class="label">Kata Sandi Saat Ini</label>
          <input v-model="currentPassword" type="password" class="input" />
        </div>
        <div>
          <label class="label">Kata Sandi Baru</label>
          <input v-model="newPassword" type="password" class="input" />
        </div>
        <div>
          <label class="label">Konfirmasi Kata Sandi</label>
          <input v-model="confirmPassword" type="password" class="input" />
        </div>
      </div>
      <div class="mt-5 flex items-center gap-3">
        <button @click="changePassword" class="btn-secondary">Ubah Kata Sandi</button>
        <span v-if="passwordMsg" class="text-sm font-medium" :class="passwordMsg.includes('tidak') || passwordMsg.includes('minimal') ? 'text-red-600 dark:text-red-400' : 'text-brand-600 dark:text-brand-400'">{{ passwordMsg }}</span>
      </div>
    </div>
  </div>
</template>
