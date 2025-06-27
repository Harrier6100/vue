<template>
    <div class="position-relative">
        <input class="form-control" type="text" v-bind="attrs" v-model="inputValue" @change="change">
        <a class="position-absolute top-50 end-0 translate-middle-y pe-3" role="button" @click="userCodeSelector.open">
            <i class="bi bi-search"></i>
        </a>
    </div>

    <UserCodeSelector
        :isOpen="userCodeSelector.isOpen.value"
        @select="select"
        @close="userCodeSelector.close"
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
import { UserCodeSelector } from '@/components';

const attrs = useAttrs();
const props = defineProps({
    modelValue: String,
});
const emit = defineEmits(['update:modelValue', 'change', 'errorMessage', 'error']);
const { isLoading, startLoading, stopLoading } = useLoading();
const userCodeSelector = useModal();
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
    emit('errorMessage', '');
    emit('error', false);
};

const change = async () => {
    emit('change', {});
    emit('errorMessage', '');
    emit('error', false);
    if (!inputValue.value) return;

    try {
        startLoading();
        const response = await api.get(`/api/users/${inputValue.value}`);
        emit('change', response.data);
        emit('errorMessage', '');
        emit('error', false);
    } catch (error) {
        emit('change', {});
        emit('errorMessage', error.message);
        emit('error', true);
    } finally {
        stopLoading();
    }
};
</script>