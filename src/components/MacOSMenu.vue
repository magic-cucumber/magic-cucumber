<script setup lang="ts">
import {computed, ref} from 'vue'
import {useEventListener} from '@vueuse/core'
import type {MenuProp} from '@/utils/menu'

const props = withDefaults(defineProps<{
  menu?: MenuProp
  defaultMenu?: string[]
}>(), {
  menu: () => [],
  defaultMenu: () => [],
})

const emit = defineEmits<{
  select: [title: string, menuIndex: number, itemIndex?: number]
  click: [menu?: string, subMenu?: string]
}>()

const menuRef = ref<HTMLElement | null>(null)
const isFocused = ref(false)
const openIndex = ref<number | null>(null)
const hoveredIndex = ref<number | null>(null)
const hoveredItem = ref<number | null>(null)

const hasSubMenu = (index: number) => index === -1
  ? props.defaultMenu.length > 0
  : Boolean(props.menu[index]?.subTitle?.length)
const rootClass = computed(() => [
  'macos-menu',
  (isFocused.value || hoveredIndex.value !== null || openIndex.value !== null) && 'macos-menu-active',
])
const triggerClass = (index: number) => [
  'macos-menu-trigger',
  (hoveredIndex.value === index || openIndex.value === index) && 'macos-menu-trigger-active',
]

const itemClass = (index: number) => [
  'macos-menu-submenu-item',
  hoveredItem.value === index && 'macos-menu-submenu-item-active',
]

const handlePointerEnter = (index: number) => {
  hoveredIndex.value = index

  if (!isFocused.value) {
    return
  }

  hoveredItem.value = null
  openIndex.value = hasSubMenu(index) ? index : null
}

const toggle = (index: number) => {
  if (!hasSubMenu(index)) {
    isFocused.value = true
    openIndex.value = null
    hoveredItem.value = null

    if (index >= 0) {
      emit('select', props.menu[index].title, index)
      emit('click', props.menu[index].title)
    }
    return
  }

  isFocused.value = true
  hoveredItem.value = null
  openIndex.value = index
}

const close = () => {
  isFocused.value = false
  openIndex.value = null
  hoveredIndex.value = null
  hoveredItem.value = null
}

const selectItem = (title: string, menuIndex: number, itemIndex: number) => {
  emit('select', title, menuIndex, itemIndex)
  emit('click', menuIndex === -1 ? undefined : props.menu[menuIndex].title, title)
  close()
}

useEventListener(document, 'pointerdown', (event: PointerEvent) => {
  const target = event.target

  if (!(target instanceof Node) || !menuRef.value?.contains(target)) {
    close()
    return
  }

  const menuItem = target instanceof Element ? target.closest('button') : null
  if (!menuItem || !menuRef.value.contains(menuItem)) {
    close()
  }
})
</script>

<template>
  <nav
    ref="menuRef"
    :class="rootClass"
    aria-label="Application menu"
    @pointerleave="hoveredIndex = null"
    @keydown.esc.stop.prevent="close"
  >
    <div class="macos-menu-item">
      <button
        type="button"
        :class="[triggerClass(-1), 'macos-menu-apple-trigger']"
        aria-label="Apple menu"
        :aria-haspopup="hasSubMenu(-1) ? 'menu' : undefined"
        :aria-expanded="hasSubMenu(-1) ? openIndex === -1 : undefined"
        @pointerenter="handlePointerEnter(-1)"
        @focus="hoveredIndex = -1"
        @click="toggle(-1)"
      >
        <svg class="macos-menu-icon" viewBox="5 4 14 17" aria-hidden="true">
          <path
            fill="currentColor"
            d="M16.31 12.48c0-2.02 1.65-3.01 1.73-3.06-.94-1.37-2.4-1.56-2.92-1.58-1.24-.13-2.44.73-3.08.73-.65 0-1.65-.71-2.71-.69-1.39.02-2.67.81-3.38 2.05-1.46 2.52-.37 6.23 1.03 8.27.68 1 1.5 2.11 2.57 2.07 1.04-.04 1.43-.67 2.69-.67 1.25 0 1.61.67 2.7.65 1.11-.02 1.82-1 2.5-2 .79-1.14 1.11-2.25 1.13-2.31-.02-.01-2.24-.86-2.26-3.46Zm-2.02-5.95c.56-.68.94-1.62.84-2.56-.81.03-1.79.54-2.37 1.22-.52.6-.98 1.56-.86 2.48.91.07 1.83-.46 2.39-1.14Z"
          />
        </svg>
      </button>

      <div v-if="openIndex === -1" class="macos-menu-submenu" role="menu">
        <button
          v-for="(title, itemIndex) in props.defaultMenu"
          :key="`${title}-${itemIndex}`"
          type="button"
          role="menuitem"
          :class="itemClass(itemIndex)"
          @pointerenter="hoveredItem = itemIndex"
          @focus="hoveredItem = itemIndex"
          @click="selectItem(title, -1, itemIndex)"
        >
          {{ title }}
        </button>
      </div>
    </div>

    <div v-for="(item, index) in props.menu" :key="`${item.title}-${index}`" class="macos-menu-item">
      <button
        type="button"
        :class="triggerClass(index)"
        :aria-haspopup="hasSubMenu(index) ? 'menu' : undefined"
        :aria-expanded="hasSubMenu(index) ? openIndex === index : undefined"
        @pointerenter="handlePointerEnter(index)"
        @focus="hoveredIndex = index"
        @click="toggle(index)"
      >
        <span class="macos-menu-title">{{ item.title }}</span>
      </button>

      <div v-if="openIndex === index" class="macos-menu-submenu" role="menu">
        <button
          v-for="(title, itemIndex) in item.subTitle"
          :key="`${title}-${itemIndex}`"
          type="button"
          role="menuitem"
          :class="itemClass(itemIndex)"
          @pointerenter="hoveredItem = itemIndex"
          @focus="hoveredItem = itemIndex"
          @click="selectItem(title, index, itemIndex)"
        >
          {{ title }}
        </button>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.macos-menu {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  min-height: 40px;
  padding: 2px 10px;
  border-radius: 0;
  background: rgba(255, 255, 255, 0.52);
  box-shadow: inset 0 0.5px 0 rgba(255, 255, 255, 0.5), 0 0.5px 0 rgba(0, 0, 0, 0.03);
  color: #1d1d1f;
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  isolation: isolate;
}

.macos-menu-active {
  background: rgba(255, 255, 255, 0.62);
  box-shadow: inset 0 0.5px 0 rgba(255, 255, 255, 0.55), 0 0.5px 0 rgba(0, 0, 0, 0.04);
}

.macos-menu-item {
  position: relative;
  display: inline-flex;
  align-items: center;
}

.macos-menu-trigger {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-height: 32px;
  padding: 4px 20px;
  border: 0;
  border-radius: 16px;
  background: transparent;
  color: inherit;
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", sans-serif;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  letter-spacing: -0.01em;
  white-space: nowrap;
  cursor: pointer;
  outline: none;
  -webkit-tap-highlight-color: transparent;
  transition: background-color 0.08s ease, color 0.08s ease;
}

.macos-menu-trigger-active {
  background: rgba(0, 0, 0, 0.11);
  box-shadow: inset 0 0.5px 0 rgba(255, 255, 255, 0.25);
}

.macos-menu-apple-trigger {
  justify-content: center;
}

.macos-menu-icon {
  display: block;
  flex: 0 0 auto;
  width: 18px;
  height: 22px;
  color: currentColor;
}

.macos-menu-item:not(:first-child) {
  margin-left: -12px;
}

.macos-menu-title {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: min(42vw, 280px);
}

.macos-menu-submenu {
  position: absolute;
  z-index: 10;
  top: calc(100% + 8px);
  left: 0;
  min-width: 270px;
  padding: 8px 10px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.12), 0 4px 10px rgba(0, 0, 0, 0.06);
  backdrop-filter: blur(28px) saturate(180%);
  -webkit-backdrop-filter: blur(28px) saturate(180%);
}

.macos-menu-submenu-item {
  display: flex;
  align-items: center;
  width: 100%;
  min-height: 32px;
  padding: 5px 16.25px;
  border: 0;
  border-radius: 16px;
  background: transparent;
  color: #1d1d1f;
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 23px;
  text-align: left;
  white-space: nowrap;
  cursor: pointer;
  outline: none;
  -webkit-tap-highlight-color: transparent;
  transition: background-color 0.08s ease, color 0.08s ease;
}

.macos-menu-submenu-item-active {
  background: rgba(0, 0, 0, 0.11);
  color: #000;
}
</style>
