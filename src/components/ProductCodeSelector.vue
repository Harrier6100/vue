<template>
    <teleport to="body">
        <div v-if="props.isOpen">
            <div class="modal-backdrop show"></div>
            <div class="modal d-block show" @click.self="close">
                <div class="modal-dialog modal-xl">
                    <div class="modal-content">
                        <div class="modal-header">
                            <button class="btn-close" @click="close"></button>
                        </div>
                        <div class="modal-body">
                            <Message class="mb-3" :error="errorMessage.error" />

                            <div class="row">
                                <div class="col-3">
                                    <form @submit.prevent="search" autocomplete="off">
                                        <div class="mb-3">
                                            <input class="form-control" type="text" v-model="form.productCode" placeholder="品名コード">
                                        </div>

                                        <div class="mb-3">
                                            <input class="form-control" type="text" v-model="form.productName" placeholder="品名">
                                        </div>

                                        <div class="d-grid">
                                            <button class="btn btn-primary" :disabled="isLoading">
                                                <span v-if="isLoading" class="spinner-border spinner-border-sm me-1"></span>検索
                                            </button>
                                        </div>
                                    </form>
                                </div>
                                <div class="col-9">
                                    <table class="table table-bordered table-hover">
                                        <thead class="table-secondary">
                                            <tr>
                                                <td :class="orderBy('productCode')" @click="sortBy('productCode')">品名コード</td>
                                                <td :class="orderBy('productName')" @click="sortBy('productName')">品名</td>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="item in paginatedData" :key="item.productCode">
                                                <td class="text-start">{{ item.productCode }}</td>
                                                <td class="text-start">{{ item.productCode }}</td>
                                                <td class="text-start">
                                                    <div class="d-flex justify-content-center">
                                                        <button class="btn btn-link text-dark text-decoration-none p-0" @click="select(item)">選択</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </teleport>
</template>

<script setup>
import { ref } from 'vue';
import { api } from '@/services/api';
import { useLoading } from '@/composables/useLoading';
import { useMessage } from '@/composables/useMessage';
import { useSort } from '@/composables/useSort';
import { usePagination } from '@/composables/usePagination';
import { Message, Pagination } from '@/components';

const props = defineProps({
    isOpen: Boolean,
});
const emit = defineEmits(['select', 'close']);
const { isLoading, startLoading, stopLoading } = useLoading();
const { errorMessage } = useMessage();

const items = ref([]);
const { sortedData, sortBy, orderBy } = useSort(items);
const { page, pageLength, paginatedData } = usePagination(sortedData, 10);

const formRestore = () => ({
    productCode: '',
    productName: '',
});
const form = ref(formRestore());

const search = async () => {
    if (!form.value.productCode && !form.value.productName) {
        errorMessage.value.error = '検索条件を指定してください。';
        return;
    }

    try {
        startLoading();
        const response = await api.get(`/api/product/names/search`, { params: form.value });
        items.value = response.data;
    } catch (error) {
        errorMessage.value.error = error.message;
    } finally {
        stopLoading();
    }
};

const select = (selected) => {
    emit('select', selected);
    emit('close');
};

const close = () => {
    emit('close');
};
</script>