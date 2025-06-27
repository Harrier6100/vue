<template>
    <div class="container-fluid">
        <div class="mb-3">物性名</div>

        <form @submit.prevent="save" autocomplete="off">

            <div class="mb-3">
                <label class="form-label" for="code">物性コード</label>
                <div class="d-flex d-flex-row gap-2">
                    <input v-for="(n, index) in 5" class="form-control" type="text" :id="index === 0 ? 'code' : ''" v-model="physprop.codes[index]" :readonly="!!code">
                </div>
                <Message :error="errorMessage.code" />
            </div>

            <div class="mb-3">
                <label class="form-label" for="name">物性名</label>
                <input class="form-control" type="text" id="name" v-model="physprop.name">
                <Message :error="errorMessage.name" />
            </div>

            <div class="mb-3">
                <table class="table table-bordered">
                    <thead class="table-secondary">
                        <tr>
                            <td>言語</td>
                            <td>物性名</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="localize in physprop.localizes" :key="localize.lang">
                            <td style="width: 20%"><input class="form-control" type="text" v-model="localize.lang" readonly></td>
                            <td style="width: 80%"><input class="form-control" type="text" v-model="localize.name"></td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="mb-3">
                <label class="form-label" for="uom">単位</label>
                <input class="form-control" type="text" id="uom" v-model="physprop.uom">
            </div>

            <div class="mb-3">
                <label class="form-label" for="uom">SI単位</label>
                <input class="form-control" type="text" id="si_uom" v-model="physprop.si_uom">
            </div>

            <div class="mb-3">
                <label class="form-label" for="numberSize">ｎ数</label>
                <input class="form-control" type="number" id="numberSize" v-model="physprop.numberSize">
            </div>

            <div class="mb-3">
                <label class="form-label" for="remarks">備考</label>
                <textarea class="form-control" id="remarks" v-model="physprop.remarks"></textarea>
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
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { api } from '@/services/api';
import { useLoading } from '@/composables/useLoading';
import { useAsyncLoading } from '@/composables/useAsyncLoading';
import { useToast } from '@/composables/useToast';
import { useMessage } from '@/composables/useMessage';
import { Message, SaveButtons } from '@/components';

const route = useRoute();
const router = useRouter();
const { isLoading, startLoading, stopLoading } = useLoading();
const { isAsyncLoading, execute } = useAsyncLoading();
const { addToast } = useToast();
const { errorMessage } = useMessage();

const { code } = route.params;
const physpropRestore = () => ({
    code: '',
    codes: new Array(5).fill(''),
    uom: '',
    si_uom: '',
    numberSize: 1,
    localizes: ['ja', 'en'].map((lang) => {
        return {
            lang: lang,
            name: '',
        }
    }),
    remarks: '',
});
const physprop = ref(physpropRestore());

onMounted(async () => {
    if (code) {
        try {
            startLoading();
            const response = await api.get(`/api/physprops/${code}`);
            physprop.value.code = response.data.code;
            physprop.value.codes = response.data.code.split('_');
            physprop.value.name = response.data.name;
            physprop.value.uom = response.data.uom;
            physprop.value.si_uom = response.data.si_uom;
            physprop.value.numberSize = response.data.numberSize;
            physprop.value.localizes = response.data.localizes;
            physprop.value.remarks = response.data.remarks;
        } catch (error) {
            addToast(error.message, 'error');
        } finally {
            stopLoading();
        }
    }
});

watch(() => physprop.value.codes, (newValue) => {
    newValue.forEach((value, i) => {
        physprop.value.codes[i] = value.toUpperCase();
    });
    if (newValue[0] === 'A') {
        physprop.value.code = newValue.slice(0, 4).join('_');
    } else {
        physprop.value.code = newValue.join('_');
    }
}, { deep: true });

const validate = () => {
    let isValid = true;

    errorMessage.value.code = '';
    if (!physprop.value.code) {
        errorMessage.value.code = '物性コードを入力してください。';
        isValid = false;
    }

    errorMessage.value.name = '';
    if (!physprop.value.name) {
        errorMessage.value.name = '物性名を入力してください。';
        isValid = false;
    }

    return isValid;
};

const save = async () => {
    if (!validate()) {
        addToast('入力内容に誤りがあります。', 'error');
        return;
    }

    try {
        startLoading();
        if (code) {
            await execute(async () => {
                await api.put(`/api/physprops/${code}`, physprop.value);
            });
            addToast('保存しました。', 'success');
        } else {
            await execute(async () => {
                await api.post(`/api/physprops`, physprop.value);
            });
            addToast('保存しました。', 'success');
            // physprop.value = physpropRestore();
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
        name: 'PhyspropList',
        query: routeQuery,
    });
};
</script>