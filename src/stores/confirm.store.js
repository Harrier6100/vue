import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useConfirmStore = defineStore('confirm', () => {
    const isShow = ref(false);
    const message = ref('');
    let resolveFunction = null;

    const confirm = (msg) => {
        isShow.value = true;
        message.value = msg;
        return new Promise((resolve) => {
            resolveFunction = resolve;
        });
    };

    const confirmAccept = () => {
        isShow.value = false;
        resolveFunction?.(true);
        resolveFunction = null;
    };

    const confirmCancel = () => {
        isShow.value = false;
        resolveFunction?.(false);
        resolveFunction = null;
    };

    return {
        isShow,
        message,
        confirm,
        confirmAccept,
        confirmCancel,
    };
});