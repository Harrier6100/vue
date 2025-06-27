<template>
    <div class="position-relative">
        <input class="form-control" type="text" v-bind="attrs" v-model="inputValue" @change="change">
        <a class="position-absolute top-50 end-0 translate-middle-y pe-3" role="button" @click="physpropCodeSelector.open">
            <i class="bi bi-search"></i>
        </a>
    </div>

    <PhyspropCodeSelector
        :isOpen="physpropCodeSelector.isOpen.value"
        @select="select"
        @close="physpropCodeSelector.close"
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
import { ADHERENDS_KN, ADHERENDS_HO } from '@/constants/adherends';
import { PhyspropCodeSelector } from '@/components';

const attrs = useAttrs();
const props = defineProps({
    modelValue: String,
});
const emit = defineEmits(['update:modelValue', 'change', 'errorMessage', 'error']);
const { isLoading, startLoading, stopLoading } = useLoading();
const physpropCodeSelector = useModal();
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

    let adherendName = '';
    const codes = inputValue.value.split('_');
    if (codes[0] === 'A' && codes[3]) {
        const adherend = ADHERENDS_KN.find(item => item.code === codes[3]);
        if (adherend) adherendName = adherend.name;
        codes[3] = '';
    }
    if (codes[0] !== 'A' && codes[4]) {
        const adherend = ADHERENDS_HO.find(item => item.code === codes[4]);
        if (adherend) adherendName = adherend.name;
        codes[4] = '';
    }
    const code = codes.join('_');
    if (!adherendName) {
        emit('update:modelValue', code);
    }

    try {
        startLoading();
        const response = await api.get(`/api/physprops/${code}`);
        emit('change', { ...response.data, adherendName });
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