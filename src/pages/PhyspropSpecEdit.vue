<template>
    <div class="container-fluid">
        <div class="mb-3">物性名</div>

        <form @submit.prevent="save" autocomplete="off">
            <div class="row">
                <div class="col">

                    <div class="mb-3">
                        <label class="form-label" for="productCode">品名コード</label>
                        <ProductCodeInput
                            id="productCode"
                            v-model="physpropSpec.productCode"
                            @change="productCodeSelect"
                            @error="isError = $event"
                            @errorMessage="errorMessage.productCode = $event"
                            :disabled="!!productCode"
                        />
                        <Message :error="errorMessage.productCode" />
                    </div>

                </div>
                <div class="col">
                </div>
            </div>

            <SaveButtons
                :isLoading="isLoading"
                :isAsyncLoading="isAsyncLoading"
                @cancel="cancel"
            />
        </form>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { api } from '@/services/api';
import { useLoading } from '@/composables/useLoading';
import { useAsyncLoading } from '@/composables/useAsyncLoading';
import { useToast } from '@/composables/useToast';
import { useMessage } from '@/composables/useMessage';
import { Message, SaveButtons, ProductCodeInput } from '@/components';

const route = useRoute();
const router = useRouter();
const { isLoading, startLoading, stopLoading } = useLoading();
const { addToast } = useToast();
const { isAsyncLoading, execute } = useAsyncLoading();
const { errorMessage } = useMessage();
const isError = ref(false);

const {
    productCode,
    customerCode,
} = route.params;
const physpropSpecRestore = () => ({
    productCode: '',
    productNode: '',
    customerCode: '',
    customerName: '',
});
const physpropSpec = ref(physpropSpecRestore());

onMounted(async () => {
    if (code) {
        try {
            startLoading();
            const response = await api.get(`/api/physprop/specs/${productCode}/${customerCode ?? ''}`);
            physpropSpec.value.productCode = response.data.productCode;
        } catch (error) {
            addToast(error.message, 'error');
        } finally {
            stopLoading();
        }
    }
});

const validate = () => {
    let isValid = true;

    errorMessage.value.productCode = '';
    if (!physpropSpec.value.productCode) {
        errorMessage.value.productCode = '品名コードを入力してください。';
        isValid = false;
    }

    errorMessage.value.productName = '';
    if (!physpropSpec.value.productName) {
        errorMessage.value.productName = '品名を入力してください。';
        isValid = false;
    }

    return isValid;
};

const save = async () => {
    if (!validate() || isError.value) {
        addToast('入力内容に誤りがあります。', 'error');
        return;
    }

    try {
        startLoading();
        if (code) {
            await execute(async () => {
                await api.put(`/api/physprop/specs/${code}`, physpropSpec.value);
            });
            addToast('保存しました。', 'success');
        } else {
            await execute(async () => {
                await api.post(`/api/physprop/specs`, physpropSpec.value);
            });
            addToast('保存しました。', 'success');
            physpropSpec.value = physpropSpecRestore();
        }
    } catch (error) {
        addToast(error.message, 'error');
    } finally {
        stopLoading();
    }
};

const cancel = () => {
    const { routeQuery } = window.history.state || {};
    router.push({
        name: 'PhyspropSpecList',
        query: routeQuery,
    });
};
</script>