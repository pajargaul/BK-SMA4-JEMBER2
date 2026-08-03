<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  data: { label: string; value: number }[]
  height?: number
  color?: string
}>(), {
  height: 220,
  color: '#10b981',
})

const maxVal = computed(() => Math.max(...props.data.map(d => d.value), 1))
const points = computed(() => {
  const w = 100
  const h = 100
  const step = props.data.length > 1 ? w / (props.data.length - 1) : 0
  return props.data.map((d, i) => ({
    x: i * step,
    y: h - (d.value / maxVal.value) * h,
    ...d,
  }))
})
const pathD = computed(() => {
  return points.value.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
})
const areaD = computed(() => {
  if (points.value.length === 0) return ''
  return pathD.value + ` L 100 100 L 0 100 Z`
})
</script>

<template>
  <div :style="{ height: height + 'px' }" class="relative w-full">
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" class="h-full w-full">
      <defs>
        <linearGradient :id="`grad-${color.replace('#','')}`" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" :stop-color="color" stop-opacity="0.3" />
          <stop offset="100%" :stop-color="color" stop-opacity="0" />
        </linearGradient>
      </defs>
      <path :d="areaD" :fill="`url(#grad-${color.replace('#','')})`" />
      <path :d="pathD" fill="none" :stroke="color" stroke-width="2" vector-effect="non-scaling-stroke" stroke-linecap="round" stroke-linejoin="round" />
      <circle
        v-for="(p, i) in points"
        :key="i"
        :cx="p.x"
        :cy="p.y"
        r="1.5"
        :fill="color"
        vector-effect="non-scaling-stroke"
      />
    </svg>
    <div class="absolute inset-x-0 bottom-0 flex justify-between px-1">
      <span v-for="(d, i) in data" :key="i" class="text-[10px] font-medium text-slate-400 truncate">{{ d.label }}</span>
    </div>
  </div>
</template>
