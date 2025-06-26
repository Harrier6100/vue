<template>
    <div class="container-fluid">
        <div class="mb-3">物性名</div>

        <form @submit.prevent="save" autocomplete="off">

            <div class="mb-3">
                <label class="form-label" for="code">物性コード</label>
                <div class="d-flex d-flex-row gap-2">
                    <input v-for="(n, index) in 5" class="form-control" type="text" :id="index === 0 ? 'code' : ''" v-model="physpropName.codes[index]">
                </div>
                <Message :error="errorMessage.code" />
            </div>

            <div class="mb-3">
                <label class="form-label" for="name">物性名</label>
                <input class="form-control" type="text" id="name" v-model="physpropName.name">
                <Message :error="errorMessage.name" />
            </div>

            <div class="mb-3">
                <label class="form-label" for="uom">単位</label>
                <input class="form-control" type="text" id="uom" v-model="physpropName.uom">
            </div>

            <div class="mb-3">
                <label class="form-label" for="numberSize">ｎ数</label>
                <input class="form-control" type="number" id="numberSize" v-model="physpropName.numberSize">
            </div>

            <div class="mb-3">
                <label class="form-label">多言語</label>
                <table class="table table-bordered">
                    <thead>
                        <tr>
                            <td>言語</td>
                            <td>物性名</td>
                            <td>単位</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="localize in physpropName.localizes" :key="localize.lang">
                            <td style="width: 15%"><input class="form-control" type="text" v-model="localize.lang" readonly></td>
                            <td style="width: 50%"><input class="form-control" type="text" v-model="localize.name"></td>
                            <td style="width: 35%"><input class="form-control" type="text" v-model="localize.uom"></td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="mb-3">
                <label class="form-label" for="remarks">備考</label>
                <textarea class="form-control" id="remarks" v-model="physpropName.remarks"></textarea>
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
import { Message, SaveButtons } from '@/components';

const route = useRoute();
const router = useRouter();
const { isLoading, startLoading, stopLoading } = useLoading();
const { isAsyncLoading, execute } = useAsyncLoading();
const { addToast } = useToast();
const { errorMessage } = useMessage();

const { code } = route.params;
const physpropNameRestore = () => ({
    code: '',
    codes: new Array(5).fill(''),
    uom: '',
    numberSize: 0,
    localizes: ['ja', 'en'].map((lang) => {
        return {
            lang: lang,
            name: '',
            uom: '',
        }
    }),
    remarks: '',
});
const physpropName = ref(physpropNameRestore());

onMounted(async () => {
    if (code) {
        try {
            startLoading();
            const response = await api.get(`/api/physprop/names/${code}`);
            physpropName.value.code = response.data.code;
            physpropName.value.codes = response.data.code.split('_');
            physpropName.value.name = response.data.name;
            physpropName.value.uom = response.data.uom;
            physpropName.value.numberSize = response.data.numberSize;
            physpropName.value.localizes = response.data.localizes;
            physpropName.value.remarks = response.data.remarks;
        } catch (error) {
            addToast(error.message, 'error');
        } finally {
            stopLoading();
        }
    }
});

const validate = () => {
    let isValid = true;

    errorMessage.value.code = '';
    if (!physpropName.value.code) {
        errorMessage.value.code = '物性コードを入力してください。';
        isValid = false;
    }

    errorMessage.value.name = '';
    if (!physpropName.value.name) {
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
                await api.put(`/api/physprop/names/${code}`, physpropName.value);
            });
            addToast('保存しました。', 'success');
        } else {
            await execute(async () => {
                await api.post(`/api/physprop/names`, physpropName.value);
            });
            addToast('保存しました。', 'success');
            physpropName.value = physpropNameRestore();
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
        name: 'PhyspropNameList',
        query: routeQuery,
    });
};
</script>