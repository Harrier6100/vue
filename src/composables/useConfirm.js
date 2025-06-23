import { storeToRefs } from 'pinia';
import { useConfirmStore } from '@/stores/confirm.store';

export const useConfirm = () => {
    const confirmStore = useConfirmStore();
    const { isConfirm, confirmMessage } = storeToRefs(confirmStore);
    const { confirm, confirmYes, confirmNo } = confirmStore;

    return {
        isConfirm,
        confirmMessage,
        confirm,
        confirmYes,
        confirmNo,
    };
};