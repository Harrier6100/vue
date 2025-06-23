import { storeToRefs } from 'pinia';
import { useConfirmStore } from '@/stores/confirm.store';

export const useConfirm = () => {
    const confirmStore = useConfirmStore();
    const { isOpen, message } = storeToRefs(confirmStore);
    const { openConfirm, confirm, cancel } = confirmStore;

    return {
        isOpen,
        message,
        openConfirm,
        confirm,
        cancel,
    };
};