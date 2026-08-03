<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps<{
  target: number
  duration?: number
  suffix?: string
  prefix?: string
}>()

const current = ref(0)
let raf = 0

function animate() {
  const duration = props.duration || 1500
  const start = performance.now()
  const startVal = current.value
  const diff = props.target - startVal

  function step(now: number) {
    const elapsed = now - start
    const progress = Math.min(elapsed / duration, 1)
    const eased = 1 - Math.pow(1 - progress, 3)
    current.value = Math.round(startVal + diff * eased)
    if (progress < 1) {
      raf = requestAnimationFrame(step)
    }
  }
  raf = requestAnimationFrame(step)
}

onMounted(() => {
  if (props.target > 0) animate()
})

watch(() => props.target, () => {
  cancelAnimationFrame(raf)
  animate()
})

onUnmounted(() => cancelAnimationFrame(raf))
</script>

<template>
  <span>{{ prefix }}{{ current.toLocaleString('id-ID') }}{{ suffix }}</span>
</template>
