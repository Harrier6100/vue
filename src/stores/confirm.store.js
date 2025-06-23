import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useConfirmStore = defineStore('confirm', () => {
    const isConfirm = ref(false);
    const confirmMessage = ref('');
    let resolveFunction = null;

    const confirm = (msg) => {
        confirmMessage.value = msg;
        isConfirm.value = true;
        return new Promise((resolve) => {
            resolveFunction = resolve;
        });
    };

    const confirmYes = () => {
        isConfirm.value = false;
        resolveFunction?.(true);
        resolveFunction = null;
    };

    const confirmNo = () => {
        isConfirm.value = false;
        resolveFunction?.(false);
        resolveFunction = null;
    };

    return {
        isConfirm,
        confirmMessage,
        confirm,
        confirmYes,
        confirmNo,
    };
});