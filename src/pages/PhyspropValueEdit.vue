<template>
    <div class="container-fluid">
        <div class="mb-3">物性規格</div>

        <form @submit.prevent="save" autocomplete="off">
            <div class="mb-3">
                <div class="row">
                    <div class="col">

                        <div class="mb-3">
                            <label class="form-label" for="productLot">ロット</label>
                            <StockLotInput
                                id="productLot"
                                v-model="physpropValue.productLot"
                                @change="productLotSelect"
                                @error="isError = $event"
                                @errorMessage="errorMessage.productLot = $event"
                                :readonly="!!productLot"
                            />
                            <Message :error="errorMessage.productLot" />
                        </div>

                        <div class="mb-3">
                            <label class="form-label" for="productCode">品名</label>
                            <input class="form-control" type="text" id="productCode" v-model="physpropValue.productCode" readonly>
                        </div>

                        <div class="mb-3">
                            <label class="form-label" for="productName">品名</label>
                            <input class="form-control" type="text" id="productName" v-model="physpropValue.productName" readonly>
                        </div>

                    </div>
                    <div class="col">

                        <div class="mb-3">
                            <label class="form-label" for="customerCode">得意先コード</label>
                            <CustomerCodeInput
                                id="customerCode"
                                v-model="physpropValue.customerCode"
                                @change="customerCodeSelect"
                                @error="isError = $event"
                                @errorMessage="errorMessage.customerCode = $event"
                                :readonly="!!productLot"
                            />
                            <Message :error="errorMessage.customerCode" />
                        </div>

                        <div class="mb-3">
                            <label class="form-label" for="customerName">得意先名</label>
                            <input class="form-control" type="text" id="customerName" v-model="physpropValue.customerName" readonly>
                        </div>

                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col-9">
                    <table class="table table-bordered">
                        <thead class="table-secondary">
                            <tr>
                                <td>物性コード</td>
                                <td>物性名</td>
                                <td>測定日</td>
                                <td>測定者</td>
                                <td>測定者名</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(propertyItem, index) in physpropValue.propertyItems" :key="index">
                                <td>{{ propertyItem.propertyCode }}</td>
                                <td>{{ propertyItem.propertyName }}</td>
                                <td>
                                    <DatePicker class="form-control" v-model="propertyItem.measuredDate" placeholder="YYYY-MM-DD" />
                                </td>
                                <td>
                                    <UserIdInput
                                        v-model="propertyItem.measurerId"
                                        @change="measurerIdSelect(index, $event)"
                                        @error="isError = $event"
                                        @errorMessage="propertyItem.errorMessage = $event"
                                    />
                                    <Message :error="propertyItem.errorMessage" />
                                </td>
                                <td>
                                    <input class="form-control" type="text" v-model="propertyItem.measurerName" readonly>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="col-3">
                </div>
            </div>

            <table class="table table-bordered">
                <thead class="table-secondary">
                    <tr>
                        <td class="align-middle">物性コード</td>
                        <td class="align-middle">物性名</td>
                        <td class="align-middle">規格値</td>
                        <td class="align-middle">単位</td>
                        <td class="align-middle">ｎ数</td>
                        <td class="align-middle">桁数</td>
                        <td class="align-middle">必須</td>
                        <td class="align-middle">有効</td>
                        <td class="align-middle">
                            <div class="d-flex justify-content-center">
                                <button type="button" tabindex="-1" @click="propertySpecs.add(propertySpec)">追加</button>
                            </div>
                        </td>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(spec, index) in physpropValue.specs" :key="index">
                        <td class="align-middle" style="width: 12%">
                            <PropertyCodeInput
                                v-model="spec.propertyCode"
                                @change="propertyCodeSelect(index, $event)"
                                @error="isError = $event"
                                @errorMessage="spec.errorMessage = $event"
                            />
                            <Message :error="spec.errorMessage" />
                        </td>
                        <td class="align-middle" style="width: 20%">
                            <input class="form-control" type="text" v-model="spec.propertyName" readonly>
                        </td>
                        <td class="align-middle" style="width: 30%">
                            <div class="d-flex gap-1">
                                <input class="form-control" type="text" v-model="spec.values[0]">
                                <input class="form-control" type="text" v-model="spec.values[1]">
                                <input class="form-control" type="text" v-model="spec.values[2]">
                                <input class="form-control" type="text" v-model="spec.values[3]">
                                <input class="form-control" type="text" v-model="spec.values[4]">
                            </div>
                        </td>
                        <td class="align-middle" style="width: 8%">
                            <input class="form-control" type="text" v-model="spec.uom" readonly>
                        </td>
                        <td class="align-middle" style="width: 5%">
                            <input class="form-control" type="number" v-model="spec.numberSize">
                        </td>
                        <td class="align-middle" style="width: 6%">
                            <div class="d-flex align-items-center gap-1">
                                <input class="form-control" type="number" v-model="spec.decimalScale">
                                <input class="form-check-input" type="checkbox" v-model="spec.isTrancate">
                            </div>
                        </td>
                        <td class="align-middle" style="width: 3%">
                            <div class="d-flex justify-content-center">
                                <input class="form-check-input" type="checkbox" v-model="spec.isRequired">
                            </div>
                        </td>
                        <td class="align-middle" style="width: 3%">
                            <div class="d-flex justify-content-center">
                                <input class="form-check-input" type="checkbox" v-model="spec.isActive">
                            </div>
                        </td>
                        <td class="align-middle" style="width: 10%">
                            <div class="d-flex justify-content-center gap-1">
                                <button type="button" tabindex="-1" @click="propertySpecs.push(index, propertySpec)">挿</button>
                                <button type="button" tabindex="-1" @click="propertySpecs.up(index)">↑</button>
                                <button type="button" tabindex="-1" @click="propertySpecs.down(index)">↓</button>
                                <button type="button" tabindex="-1" @click="propertySpecs.remove(index)">削</button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>

            <div class="mb-3">
                <label class="form-label" for="remarks">備考</label>
                <textarea class="form-control" id="remarks" v-model="physpropValue.remarks"></textarea>
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
import { useArray } from '@/composables/useArray';
import { Message, DatePicker, SaveButtons, UserIdInput, StockLotInput, ProductCodeInput, CustomerCodeInput, PropertyCodeInput } from '@/components';

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
const propertyItems = useArray();
const propertyItem = {
    propertyCode: '',
    propertyName: '',
    measuredDate: '',
    measurerId: '',
    measurerName: '',
};
const physpropValueRestore = () => ({
    productLot: '',
    productCode: '',
    productNode: '',
    customerCode: '',
    customerName: '',
    propertyItems: propertyItems.items,
    remarks: '',
});
const physpropValue = ref(physpropValueRestore());

onMounted(async () => {
    if (productCode) {
        try {
            startLoading();
            const response = await api.get(`/api/physprop/specs/${productCode}/${customerCode ?? ''}`);
            physpropSpec.value.productCode = response.data.productCode;
            physpropSpec.value.productName = response.data.productName;
            physpropSpec.value.customerCode = response.data.customerCode;
            physpropSpec.value.customerName = response.data.customerName;
            physpropSpec.value.specs = response.data.specs;
            physpropSpec.value.remarks = response.data.remarks;
        } catch (error) {
            addToast(error.message, 'error');
        } finally {
            stopLoading();
        }
    }
});

const productLotSelect = (selected) => {
    physpropValue.value.productCode = selected?.code ?? '';
    physpropValue.value.productName = selected?.name ?? '';
    if (selected?.lot) {
        physpropSpecGet();
    }
};

const physpropSpecGet = async () => {
    const productCode = physpropValue.value.productCode.slice(0, 9);
    const customerCode = physpropValue.value.customerCode;

    try {
        startLoading();
        const response = await api.get(`/api/physprop/specs/${productCode}/${customerCode ?? ''}`);
        const physpropSpec = response.data;
        for (const spec of physpropSpec.specs) {
            propertyItem.propertyCode = spec.propertyCode;
            propertyItem.propertyName = spec.propertyName;
            propertyItem.uom = spec.uom;
            propertyItem.numberSize = spec.numberSize;
            console.log(propertyItem);
            propertyItems.add(propertyItem);
        }
    } catch (error) {
        addToast(error.message, 'error');
    } finally {
        stopLoading();
    }
};

const measurerIdSelect = (index, selected) => {
    propertyItems.items.value[index].measurerName = selected?.name ?? '';
};

const productCodeSelect = (selected) => {
    physpropSpec.value.productName = selected?.productName ?? '';
};

const customerCodeSelect = (selected) => {
    physpropSpec.value.customerName = selected?.customerName ?? '';
};

const propertyCodeSelect = (index, selected) => {
    physpropSpec.value.specs[index].propertyName = selected?.name ?? '';
    physpropSpec.value.specs[index].propertyName = (selected?.name ?? '') + (selected?.adherendName ?? '');
    physpropSpec.value.specs[index].uom = selected?.uom ?? '';
    physpropSpec.value.specs[index].numberSize = selected?.numberSize ?? 0;
};

const validate = () => {
    let isValid = true;

    errorMessage.value.productCode = '';
    if (!physpropSpec.value.productCode) {
        errorMessage.value.productCode = '品名コードを入力してください。';
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
        if (productCode) {
            await execute(async () => {
                await api.put(`/api/physprop/specs/${productCode}/${customerCode ?? ''}`, physpropSpec.value);
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