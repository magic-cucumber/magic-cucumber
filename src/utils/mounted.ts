import {onMounted, onUnmounted} from "vue";

type CreateHookAndDispose = () => (() => void) | void;

export const useMounted = (fn: CreateHookAndDispose) => {
    let dispose: (() => void) | undefined = undefined
    onMounted(() => {
        dispose = fn() ?? undefined
    })

    onUnmounted(() => {
        dispose?.()
        dispose = undefined
    })
}
