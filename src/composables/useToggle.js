import { ref } from 'vue';

export const useToggle = () => {
    const isOpen = ref(false);

    const open = () => {
        isOpen.value = true;
    };

    const close = () => {
        isOpen.value = false;
    };

    const toggle = () => {
        isOpen.value = !isOpena.value;
    };

    return {
        isOpen,
        open,
        close,
        toggle,
    };
};