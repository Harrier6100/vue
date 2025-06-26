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
                                    <div class="mb-3">
                                        <input class="form-control" type="text" v-model="keyword" placeholder="検索">
                                    </div>
                                </div>
                                <div class="col-9">
                                    <table class="table table-bordered table-hover">
                                        <thead class="table-secondary">
                                            <tr>
                                                <td :class="orderBy('code')" @click="sortBy('code')">物性コード</td>
                                                <td :class="orderBy('name')" @click="sortBy('name')">物性名</td>
                                                <td :class="orderBy('uom')" @click="sortBy('uom')">単位</td>
                                                <td :class="orderBy('numberSize')" @click="sortBy('numberSize')">ｎ数</td>
                                                <td></td>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="item in paginatedData" :key="item.code">
                                                <td class="text-start">{{ item.code }}</td>
                                                <td class="text-start">{{ item.name }}</td>
                                                <td class="text-start">{{ item.uom }}</td>
                                                <td class="text-end">{{ item.numberSize }}</td>
                                                <td class="text-start">
                                                    <div class="d-flex justify-content-center">
                                                        <button class="btn btn-link text-dark text-decoration-none p-0" @click="select(item)">選択</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <Pagination
                                        v-model:page="page"
                                        :pageLength="pageLength"
                                    />
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
import { ref, onMounted, watch } from 'vue';
import { api } from '@/services/api';
import { useLoading } from '@/composables/useLoading';
import { useMessage } from '@/composables/useMessage';
import { useFilter } from '@/composables/useFilter';
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
const { keyword, filteredData } = useFilter(items);
const { sortedData, sortBy, orderBy } = useSort(filteredData);
const { page, pageLength, paginatedData } = usePagination(sortedData, 10);

onMounted(async () => {
    try {
        startLoading();
        const response = await api.get(`/api/physprop/names`);
        items.value = response.data;
    } catch (error) {
        errorMessage.value.error = error.message;
    } finally {
        stopLoading();
    }
});

watch(keyword, () => {
    page.value = 1;
});

const select = (selected) => {
    emit('select', selected);
    emit('close');
};

const close = () => {
    emit('close');
};
</script>