<template>
    <div class="position-relative">
        <input class="form-control" type="text" v-model="inputValue" @change="change">
        <a class="position-absolute top-50 end-0 translate-middle-y pe-3" role="button" @click="propertyCodeSelector.open">
            <i class="bi bi-search"></i>
        </a>
    </div>
    <PropertyCodeSelector
        :isOpen="propertyCodeSelector.isOpen.value"
        @select="select"
        @close="propertyCodeSelector.close"
    />
</template>

<script setup>
import { ref, watch } from 'vue';
import { api } from '@/services/api';
import { useLoading } from '@/composables/useLoading';
import { useModal } from '@/composables/useModal';
import { PropertyCodeSelector } from '@/components';

const props = defineProps({
    modelValue: String,
});
const emit = defineEmits(['update:modelValue', 'change', 'error', 'errorMessage']);
const { isLoading, startLoading, stopLoading } = useLoading();
const propertyCodeSelector = useModal();
const inputValue = ref(props.modelValue);

watch(() => props.modelValue, (value) => {
    inputValue.value = value;
});

watch(inputValue, (value) => {
    emit('update:modelValue', value);
});

const select = (selected) => {
    const { code } = selected;
    inputValue.value = code;
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
        const response = await api.get(`/api/physprop/names/${inputValue.value}`);
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