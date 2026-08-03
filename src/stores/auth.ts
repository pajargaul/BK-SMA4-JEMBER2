import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { users } from '../data/mockData'
import type { User, Role } from '../types'

export const useAuthStore = defineStore('auth', () => {
  const currentUser = ref<User | null>(null)

  function login(role: Role) {
    const user = users.find(u => u.role === role)
    if (user) {
      currentUser.value = user
      localStorage.setItem('sman4-user', JSON.stringify(user))
    }
  }

  function loginAsStudent() {
    const user = users.find(u => u.role === 'siswa')
    if (user) {
      currentUser.value = user
      localStorage.setItem('sman4-user', JSON.stringify(user))
    }
  }

  function logout() {
    currentUser.value = null
    localStorage.removeItem('sman4-user')
  }

  function init() {
    const saved = localStorage.getItem('sman4-user')
    if (saved) {
      currentUser.value = JSON.parse(saved)
    }
  }

  function updateProfile(data: Partial<User>) {
    if (currentUser.value) {
      currentUser.value = { ...currentUser.value, ...data }
      localStorage.setItem('sman4-user', JSON.stringify(currentUser.value))
    }
  }

  const isLoggedIn = computed(() => currentUser.value !== null)
  const role = computed(() => currentUser.value?.role)

  return { currentUser, isLoggedIn, role, login, loginAsStudent, logout, init, updateProfile }
})
