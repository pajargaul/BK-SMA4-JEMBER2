<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  data: { label: string; value: number; color?: string }[]
  type?: 'bar' | 'donut'
  height?: number
}>(), {
  type: 'bar',
  height: 200,
})

const maxVal = computed(() => Math.max(...props.data.map(d => d.value), 1))
const total = computed(() => props.data.reduce((s, d) => s + d.value, 0))

const donutSegments = computed(() => {
  let offset = 0
  const circumference = 2 * Math.PI * 40
  return props.data.map(d => {
    const fraction = d.value / total.value
    const dash = fraction * circumference
    const seg = { ...d, dash, offset, fraction }
    offset += dash
    return seg
  })
})
</script>

<template>
  <div v-if="type === 'bar'" class="flex items-end justify-between gap-3" :style="{ height: height + 'px' }">
    <div v-for="(d, i) in data" :key="i" class="flex flex-1 flex-col items-center gap-2">
      <div class="flex w-full flex-1 items-end">
        <div
          class="w-full rounded-t-lg transition-all duration-700 ease-out hover:opacity-80"
          :style="{ height: (d.value / maxVal * 100) + '%', backgroundColor: d.color || '#10b981', minHeight: '4px' }"
        >
          <div class="text-center text-xs font-semibold text-white pt-1">{{ d.value }}</div>
        </div>
      </div>
      <div class="text-center text-xs font-medium text-slate-500 dark:text-slate-400 truncate w-full">{{ d.label }}</div>
    </div>
  </div>

  <div v-else class="flex items-center justify-center gap-6" :style="{ minHeight: height + 'px' }">
    <svg width="120" height="120" viewBox="0 0 120 120" class="-rotate-90">
      <circle cx="60" cy="60" r="40" fill="none" stroke="currentColor" stroke-width="16" class="text-slate-200 dark:text-slate-700" />
      <circle
        v-for="(seg, i) in donutSegments"
        :key="i"
        cx="60" cy="60" r="40" fill="none"
        :stroke="seg.color || '#10b981'"
        stroke-width="16"
        :stroke-dasharray="`${seg.dash} ${2 * Math.PI * 40}`"
        :stroke-dashoffset="-seg.offset"
        class="transition-all duration-700"
      />
    </svg>
    <div class="space-y-2">
      <div v-for="(d, i) in data" :key="i" class="flex items-center gap-2 text-sm">
        <span class="h-3 w-3 rounded-full" :style="{ backgroundColor: d.color || '#10b981' }"></span>
        <span class="text-slate-600 dark:text-slate-300">{{ d.label }}</span>
        <span class="font-semibold text-slate-800 dark:text-slate-100">{{ d.value }}</span>
      </div>
    </div>
  </div>
</template>
