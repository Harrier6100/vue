import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useConfirmStore = defineStore('confirm', () => {
    const isOpen = ref(false);
    const message = ref('');
    let resolveFunction = null;

    const openConfirm = (msg) => {
        message.value = msg;
        isOpen.value = true;
        return new Promise((resolve) => {
            resolveFunction = resolve;
        });
    };

    const confirm = () => {
        isOpen.value = false;
        resolveFunction?.(true);
        resolveFunction = null;
    };

    const cancel = () => {
        isOpen.value = false;
        resolveFunction?.(false);
        resolveFunction = null;
    };

    return {
        isOpen,
        message,
        openConfirm,
        confirm,
        cancel,
    };
});