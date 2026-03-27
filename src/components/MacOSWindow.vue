<script setup lang="ts">
import {computed, ref} from 'vue'
import {useEventListener, useFullscreen} from '@vueuse/core'

type Point = {
  x: number
  y: number
}

type Size = {
  w: number
  h: number
}

type ResizeDirection = 'n' | 'e' | 's' | 'w' | 'ne' | 'nw' | 'se' | 'sw'

withDefaults(defineProps<{
  title?: string
}>(), {
  title: '',
})

const point = defineModel<Point>('point', {required: true})
const size = defineModel<Size>('size', {required: true})

const windowRef = ref<HTMLElement | null>(null)
const {isFullscreen, enter, exit, isSupported} = useFullscreen(windowRef)

const MIN_WIDTH = 320
const MIN_HEIGHT = 220

const dragState = ref<{
  startX: number
  startY: number
  point: Point
} | null>(null)

const resizeState = ref<{
  direction: ResizeDirection
  startX: number
  startY: number
  point: Point
  size: Size
} | null>(null)

const frameStyle = computed(() => ({
  left: `${point.value.x}px`,
  top: `${point.value.y}px`,
  width: `${size.value.w}px`,
  height: `${size.value.h}px`,
}))

const close = () => history.back()
const minimize = () => windowRef.value?.blur()

const clampSize = (nextWidth: number, nextHeight: number) => ({
  width: Math.max(MIN_WIDTH, nextWidth),
  height: Math.max(MIN_HEIGHT, nextHeight),
})

const beginDrag = (event: PointerEvent) => {
  if (isFullscreen.value || event.button !== 0) {
    return
  }

  const target = event.target
  if (target instanceof HTMLElement && target.closest('button, [data-resize-handle="true"]')) {
    return
  }

  dragState.value = {
    startX: event.clientX,
    startY: event.clientY,
    point: {...point.value},
  }
}

const beginResize = (direction: ResizeDirection, event: PointerEvent) => {
  if (isFullscreen.value || event.button !== 0) {
    return
  }

  event.stopPropagation()
  resizeState.value = {
    direction,
    startX: event.clientX,
    startY: event.clientY,
    point: {...point.value},
    size: {...size.value},
  }
}

const stopInteraction = () => {
  dragState.value = null
  resizeState.value = null
}

useEventListener(window, 'pointermove', (event: PointerEvent) => {
  if (dragState.value) {
    point.value = {
      x: dragState.value.point.x + event.clientX - dragState.value.startX,
      y: dragState.value.point.y + event.clientY - dragState.value.startY,
    }
  }

  if (!resizeState.value) {
    return
  }

  const {direction, startX, startY} = resizeState.value
  const deltaX = event.clientX - startX
  const deltaY = event.clientY - startY

  let nextX = resizeState.value.point.x
  let nextY = resizeState.value.point.y
  let nextWidth = resizeState.value.size.w
  let nextHeight = resizeState.value.size.h

  if (direction.includes('e')) {
    nextWidth = resizeState.value.size.w + deltaX
  }

  if (direction.includes('s')) {
    nextHeight = resizeState.value.size.h + deltaY
  }

  if (direction.includes('w')) {
    const clamped = clampSize(resizeState.value.size.w - deltaX, nextHeight)
    nextWidth = clamped.width
    nextX = resizeState.value.point.x + (resizeState.value.size.w - clamped.width)
  }

  if (direction.includes('n')) {
    const clamped = clampSize(nextWidth, resizeState.value.size.h - deltaY)
    nextHeight = clamped.height
    nextY = resizeState.value.point.y + (resizeState.value.size.h - clamped.height)
  }

  const clamped = clampSize(nextWidth, nextHeight)
  size.value = {w: clamped.width, h: clamped.height}
  point.value = {x: nextX, y: nextY}
})

useEventListener(window, 'pointerup', stopInteraction)
useEventListener(window, 'pointercancel', stopInteraction)

const toggleFullscreen = () => {
  if (!isSupported.value) {
    alert('fullscreen is not supported')
    return
  }

  if (isFullscreen.value) {
    void exit()
    return
  }

  void enter()
}
</script>

<template>
  <section ref="windowRef" class="macos-window" :style="frameStyle">
    <header class="macos-toolbar" @pointerdown="beginDrag">
      <div class="traffic-lights">
        <button class="traffic-light close" type="button" title="Close" aria-label="Close" @click="close" />
        <button
          class="traffic-light minimize"
          type="button"
          title="Minimize"
          aria-label="Minimize"
          @click="minimize"
        />
        <button
          class="traffic-light maximize"
          type="button"
          title="Zoom"
          aria-label="Zoom"
          @click="toggleFullscreen"
        />
      </div>
      <p v-if="title" class="window-title">{{ title }}</p>
    </header>

    <div class="window-content">
      <slot />
    </div>

    <button class="resize-handle resize-handle-n" type="button" aria-label="Resize north" data-resize-handle="true" @pointerdown="beginResize('n', $event)" />
    <button class="resize-handle resize-handle-e" type="button" aria-label="Resize east" data-resize-handle="true" @pointerdown="beginResize('e', $event)" />
    <button class="resize-handle resize-handle-s" type="button" aria-label="Resize south" data-resize-handle="true" @pointerdown="beginResize('s', $event)" />
    <button class="resize-handle resize-handle-w" type="button" aria-label="Resize west" data-resize-handle="true" @pointerdown="beginResize('w', $event)" />
    <button class="resize-handle resize-handle-ne" type="button" aria-label="Resize north east" data-resize-handle="true" @pointerdown="beginResize('ne', $event)" />
    <button class="resize-handle resize-handle-nw" type="button" aria-label="Resize north west" data-resize-handle="true" @pointerdown="beginResize('nw', $event)" />
    <button class="resize-handle resize-handle-se" type="button" aria-label="Resize south east" data-resize-handle="true" @pointerdown="beginResize('se', $event)" />
    <button class="resize-handle resize-handle-sw" type="button" aria-label="Resize south west" data-resize-handle="true" @pointerdown="beginResize('sw', $event)" />
  </section>
</template>

<style scoped>
.macos-window {
  position: absolute;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  min-width: 320px;
  min-height: 220px;
  border: 1px solid rgba(110, 193, 255, 0.16);
  background: rgba(3, 16, 24, 0.7);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05),
    0 24px 80px rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(22px);
  overflow: hidden;
}

.macos-toolbar {
  --traffic-hit-size: 20px;
  --traffic-dot-size: 14px;
  --traffic-gap: 10px;
  display: flex;
  align-items: center;
  gap: 16px;
  min-height: 38px;
  padding: 0 14px;
  border-bottom: 1px solid rgba(110, 193, 255, 0.12);
  background: linear-gradient(180deg, rgba(8, 32, 47, 0.92), rgba(3, 16, 24, 0.72));
  cursor: move;
  user-select: none;
  touch-action: none;
}

.traffic-lights {
  display: flex;
  gap: var(--traffic-gap);
  margin-left: calc(var(--traffic-hit-size) * -0.18);
}

.traffic-light {
  position: relative;
  display: grid;
  place-items: center;
  width: var(--traffic-hit-size);
  height: var(--traffic-hit-size);
  padding: 0;
  border: 0;
  border-radius: 999px;
  background: transparent;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
  transition: transform 0.16s ease, filter 0.16s ease, background-color 0.16s ease;
}

.traffic-light::after {
  content: '';
  width: var(--traffic-dot-size);
  height: var(--traffic-dot-size);
  border-radius: 50%;
  border: 1px solid transparent;
  box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.18);
}

.traffic-light.close::after {
  background: linear-gradient(180deg, #ff6d67 0%, #ed5b55 100%);
  border-color: #d94b44;
}

.traffic-light.minimize::after {
  background: linear-gradient(180deg, #f6be4f 0%, #edae2f 100%);
  border-color: #d59b2a;
}

.traffic-light.maximize::after {
  background: linear-gradient(180deg, #62c755 0%, #4cb748 100%);
  border-color: #40a53d;
}

.traffic-light::before {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  color: rgba(0, 0, 0, 0.62);
  font-size: clamp(10px, 1vw, 12px);
  font-weight: 700;
  line-height: 1;
  opacity: 0;
  transition: opacity 0.12s ease;
}

.traffic-light.close::before {
  content: '×';
}

.traffic-light.minimize::before {
  content: '−';
}

.traffic-light.maximize::before {
  content: '+';
}

.traffic-lights:hover .traffic-light::before {
  opacity: 1;
}

.traffic-light:focus-visible {
  outline: 2px solid rgba(126, 249, 198, 0.72);
  outline-offset: 2px;
}

.traffic-light:hover {
  filter: brightness(0.96);
  background: rgba(255, 255, 255, 0.06);
}

.traffic-light:active {
  transform: scale(0.96);
}

.window-title {
  margin: 0;
  color: rgba(216, 243, 255, 0.82);
  font-size: 0.92rem;
  letter-spacing: 0.12em;
}

.window-content {
  min-width: 0;
  min-height: 0;
}

.resize-handle {
  position: absolute;
  z-index: 2;
  padding: 0;
  border: 0;
  background: transparent;
  color: transparent;
  appearance: none;
}

.resize-handle-n,
.resize-handle-s {
  left: 8px;
  right: 8px;
  height: 12px;
}

.resize-handle-e,
.resize-handle-w {
  top: 8px;
  bottom: 8px;
  width: 12px;
}

.resize-handle-n,
.resize-handle-ne,
.resize-handle-nw {
  top: -8px;
}

.resize-handle-s,
.resize-handle-se,
.resize-handle-sw {
  bottom: -8px;
}

.resize-handle-e,
.resize-handle-ne,
.resize-handle-se {
  right: -8px;
}

.resize-handle-w,
.resize-handle-nw,
.resize-handle-sw {
  left: -8px;
}

.resize-handle-ne,
.resize-handle-nw,
.resize-handle-se,
.resize-handle-sw {
  width: 16px;
  height: 16px;
}

.resize-handle-n,
.resize-handle-s {
  cursor: ns-resize;
}

.resize-handle-e,
.resize-handle-w {
  cursor: ew-resize;
}

.resize-handle-ne,
.resize-handle-sw {
  cursor: nesw-resize;
}

.resize-handle-nw,
.resize-handle-se {
  cursor: nwse-resize;
}
</style>
