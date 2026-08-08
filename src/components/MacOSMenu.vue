<script setup lang="ts">
import {computed, ref} from 'vue'
import {useEventListener} from '@vueuse/core'
import {menuStyles, type MenuProp} from '@/utils/menu'

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
const openIndex = ref<number | null>(null)
const hoveredIndex = ref<number | null>(null)
const hoveredItem = ref<number | null>(null)

const hasSubMenu = (index: number) => index === -1
  ? props.defaultMenu.length > 0
  : Boolean(props.menu[index]?.subTitle?.length)
const rootStyle = computed(() => [
  menuStyles.container,
  (hoveredIndex.value !== null || openIndex.value !== null) && menuStyles.containerActive,
])
const triggerStyle = (index: number) => [
  menuStyles.trigger,
  (hoveredIndex.value === index || openIndex.value === index) && menuStyles.triggerActive,
]

const itemStyle = (index: number) => [
  menuStyles.submenuItem,
  hoveredItem.value === index && menuStyles.submenuItemActive,
]

const toggle = (index: number) => {
  if (!hasSubMenu(index)) {
    if (index >= 0) {
      emit('select', props.menu[index].title, index)
      emit('click', props.menu[index].title)
    }
    return
  }

  hoveredItem.value = null
  openIndex.value = openIndex.value === index ? null : index
}

const close = () => {
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

  if (menuRef.value && target instanceof Node && !menuRef.value.contains(target)) {
    close()
  }
})
</script>

<template>
  <nav
    ref="menuRef"
    :style="rootStyle"
    aria-label="Application menu"
    @pointerleave="hoveredIndex = null"
    @keydown.esc.stop.prevent="close"
  >
    <div :style="menuStyles.menuItem">
      <button
        type="button"
        :style="triggerStyle(-1)"
        aria-label="Apple menu"
        :aria-haspopup="hasSubMenu(-1) ? 'menu' : undefined"
        :aria-expanded="hasSubMenu(-1) ? openIndex === -1 : undefined"
        @pointerenter="hoveredIndex = -1"
        @focus="hoveredIndex = -1"
        @click="toggle(-1)"
      >
        <svg :style="menuStyles.icon" viewBox="5 4 14 17" aria-hidden="true">
          <path
            fill="currentColor"
            d="M16.31 12.48c0-2.02 1.65-3.01 1.73-3.06-.94-1.37-2.4-1.56-2.92-1.58-1.24-.13-2.44.73-3.08.73-.65 0-1.65-.71-2.71-.69-1.39.02-2.67.81-3.38 2.05-1.46 2.52-.37 6.23 1.03 8.27.68 1 1.5 2.11 2.57 2.07 1.04-.04 1.43-.67 2.69-.67 1.25 0 1.61.67 2.7.65 1.11-.02 1.82-1 2.5-2 .79-1.14 1.11-2.25 1.13-2.31-.02-.01-2.24-.86-2.26-3.46Zm-2.02-5.95c.56-.68.94-1.62.84-2.56-.81.03-1.79.54-2.37 1.22-.52.6-.98 1.56-.86 2.48.91.07 1.83-.46 2.39-1.14Z"
          />
        </svg>
      </button>

      <div v-if="openIndex === -1" role="menu" :style="menuStyles.submenu">
        <button
          v-for="(title, itemIndex) in props.defaultMenu"
          :key="`${title}-${itemIndex}`"
          type="button"
          role="menuitem"
          :style="itemStyle(itemIndex)"
          @pointerenter="hoveredItem = itemIndex"
          @focus="hoveredItem = itemIndex"
          @click="selectItem(title, -1, itemIndex)"
        >
          {{ title }}
        </button>
      </div>
    </div>

    <div v-for="(item, index) in props.menu" :key="`${item.title}-${index}`" :style="menuStyles.menuItem">
      <button
        type="button"
        :style="triggerStyle(index)"
        :aria-haspopup="hasSubMenu(index) ? 'menu' : undefined"
        :aria-expanded="hasSubMenu(index) ? openIndex === index : undefined"
        @pointerenter="hoveredIndex = index"
        @focus="hoveredIndex = index"
        @click="toggle(index)"
      >
        <span :style="menuStyles.title">{{ item.title }}</span>
      </button>

      <div v-if="openIndex === index" role="menu" :style="menuStyles.submenu">
        <button
          v-for="(title, itemIndex) in item.subTitle"
          :key="`${title}-${itemIndex}`"
          type="button"
          role="menuitem"
          :style="itemStyle(itemIndex)"
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
