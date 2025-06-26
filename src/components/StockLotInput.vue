<template>
    <div class="position-relative">
        <input class="form-control" type="text" v-bind="attrs" v-model="inputValue" @change="change">
        <a v-if="!attrs.readonly" class="position-absolute top-50 end-0 translate-middle-y pe-3" role="button" @click="stockLotSelector.open">
            <i class="bi bi-search"></i>
        </a>
    </div>
    <StockLotSelector
        :isOpen="stockLotSelector.isOpen.value"
        @select="select"
        @close="stockLotSelector.close"
    />
</template>

<script setup>
defineOptions({
    inheritAttrs: false,
});
import { ref, watch, useAttrs } from 'vue';
import { api } from '@/services/api';
import { useLoading } from '@/composables/useLoading';
import { useModal } from '@/composables/useModal';
import { StockLotSelector } from '@/components';

const attrs = useAttrs();
const props = defineProps({
    modelValue: String,
});
const emit = defineEmits(['update:modelValue', 'change', 'error', 'errorMessage']);
const { isLoading, startLoading, stopLoading } = useLoading();
const stockLotSelector = useModal();
const inputValue = ref(props.modelValue);

watch(() => props.modelValue, (value) => {
    inputValue.value = value;
});

watch(inputValue, (value) => {
    emit('update:modelValue', value);
});

const select = (selected) => {
    const { lot } = selected;
    inputValue.value = lot;
    emit('change', selected);
    emit('error', false);
    emit('errorMessage', '');
};

const change = async () => {
    emit('change', {});
    emit('error', false);
    emit('errorMessage', '');
    if (!inputValue.value) return;

    try {
        startLoading();
        const response = await api.get(`/api/stocks/${inputValue.value}`);
        emit('change', response.data);
        emit('error', false);
        emit('errorMessage', '');
    } catch (error) {
        emit('change', {});
        emit('error', true);
        emit('errorMessage', error.message);
    } finally {
        stopLoading();
    }
};
</script>