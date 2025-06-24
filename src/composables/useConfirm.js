import { storeToRefs } from 'pinia';
import { useConfirmStore } from '@/stores/confirm.store';

export const useConfirm = () => {
    const confirmStore = useConfirmStore();
    const { isShow, message } = storeToRefs(confirmStore);
    const { confirm, confirmAccept, confirmCancel } = confirmStore;

    return {
        isShow,
        message,
        confirm,
        confirmAccept,
        confirmCancel,
    };
};