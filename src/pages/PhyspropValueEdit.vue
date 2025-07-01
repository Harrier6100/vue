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
                                @errorMessage="errorMessage.productLot = $event"
                                @error="isError = $event"
                                :readonly="!!productLot"
                            />
                            <Message :error="errorMessage.productLot" />
                        </div>

                        <div class="mb-3">
                            <label class="form-label" for="productCode">品名コード</label>
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
                                @errorMessage="errorMessage.customerCode = $event"
                                @error="isError = $event"
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
                                <td rowspan="2">#</td>
                                <td rowspan="2">物性コード</td>
                                <td rowspan="2">物性名</td>
                                <td rowspan="2">測定日</td>
                                <td rowspan="2">測定者</td>
                                <td rowspan="2">測定者名</td>
                                <td colspan="2">規格値</td>
                                <td rowspan="2">単位</td>
                                <td rowspan="2">ｎ数</td>
                                <td rowspan="2">平均値</td>
                                <td rowspan="2">判定</td>
                            </tr>
                            <tr>
                                <td>下限</td>
                                <td>上限</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(propertyItem, index) in physpropValue.propertyItems" :key="index" @click="selectedItemIndex = index">
                                <td>
                                    <input class="form-check-input" type="radio" :value="index" v-model="selectedItemIndex">
                                </td>
                                <td>{{ propertyItem.propertyCode }}</td>
                                <td>{{ propertyItem.propertyName }}</td>
                                <td>
                                    <DatePicker class="form-control" v-model="propertyItem.measuredDate" placeholder="YYYY-MM-DD" />
                                </td>
                                <td>
                                    <UserCodeInput
                                        v-model="propertyItem.measurerId"
                                        @change="measurerIdSelect(index, $event)"
                                        @errorMessage="propertyItem.errorMessage = $event"
                                        @error="isError = $event"
                                    />
                                    <Message :error="propertyItem.errorMessage" />
                                </td>
                                <td>
                                    <input class="form-control" type="text" v-model="propertyItem.measurerName" readonly>
                                </td>
                                <td>{{ propertyItem.specLowerValue }}</td>
                                <td>{{ propertyItem.specUpperValue }}</td>
                                <td>{{ propertyItem.uom }}</td>
                                <td>{{ propertyItem.numberSize }}</td>
                                <td>{{ propertyItem.meanValue }}</td>
                                <td>{{ propertyItem.score }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="col-3">
                    <table class="table table-bordered">
                        <thead class="table-secondary">
                            <tr>
                                <td>
                                    <span>最小値={{ propertyValuesLowerValue }}</span>
                                    <span>最大値={{ propertyValuesUpperValue }}</span>
                                </td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(propertyValue, index) in selectedItemPropertyValues" :key="index">
                                <td>{{ index + 1 }}</td>
                                <td>
                                    <input class="form-control" v-model="propertyValue.value" @change="propertyValueChange(index)">
                                </td>
                                <td>
                                    {{ propertyValue.score }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

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
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Decimal from 'decimal.js';
import { api } from '@/services/api';
import { useLoading } from '@/composables/useLoading';
import { useAsyncLoading } from '@/composables/useAsyncLoading';
import { useToast } from '@/composables/useToast';
import { useMessage } from '@/composables/useMessage';
import { useArray } from '@/composables/useArray';
import { Message, SaveButtons, DatePicker, UserCodeInput, StockLotInput, ProductCodeInput, CustomerCodeInput, PhyspropCodeInput } from '@/components';

const route = useRoute();
const router = useRouter();
const { isLoading, startLoading, stopLoading } = useLoading();
const { isAsyncLoading, execute } = useAsyncLoading();
const { addToast } = useToast();
const { errorMessage } = useMessage();
const isError = ref(false);

const {
    productCode,
    customerCode,
} = route.params;
const propertyItems = useArray();
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
const selectedItemIndex = ref(null);

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
            const propertyItem = {};
            propertyItem.propertyCode = spec.propertyCode;
            propertyItem.propertyName = spec.propertyName;
            propertyItem.measuredDate = null;
            propertyItem.measurerCode = null;
            propertyItem.measurerName = null;
            propertyItem.specLowerValue = null;
            propertyItem.specUpperValue = null;
            propertyItem.uom = spec.uom;
            propertyItem.numberSize = spec.numberSize;
            propertyItem.isTrancate = spec.isTrancate;
            propertyItem.propertyValues = Array.from(
                Array(spec.numberSize), () => {
                    return {
                        value: null,
                        score: null,
                    }
                }
            );
            propertyItem.meanValue = null;
            propertyItem.score = null;
            if (spec.values[1] && !spec.values[2]) {
                propertyItem.specLowerValue = spec.values[1];
            }
            if (!spec.values[1] && spec.values[2]) {
                propertyItem.specUpperValue = spec.values[2];
            }
            if (spec.values[1] && spec.values[2]) {
                propertyItem.specLowerValue = spec.values[1];
                propertyItem.specUpperValue = spec.values[2];
            }
            if (spec.values[3] && spec.values[4]) {
                propertyItem.specLowerValue = Decimal(spec.values[3]).sub(spec.values[4]).toNumber();
                propertyItem.specUpperValue = Decimal(spec.values[3]).add(spec.values[4]).toNumber();
            }
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

const selectedItem = computed(() => {
    if (selectedItemIndex.value !== null) {
        return physpropValue.value.propertyItems[selectedItemIndex.value];
    }
    return null;
});

const selectedItemPropertyValues = computed(() => {
    if (selectedItemIndex.value !== null) {
        return selectedItem.value.propertyValues;
    }
    return [];
});

const propertyValuesLowerValue = computed(() => {
    if (selectedItemIndex.value !== null) {
        const propertyValues = selectedItemPropertyValues.value.filter(item => item.value).map(item => item.value);
        if (propertyValues.length) {
            return Math.min(...propertyValues);
        }
    }
    return null;
});

const propertyValuesUpperValue = computed(() => {
    if (selectedItemIndex.value !== null) {
        const propertyValues = selectedItemPropertyValues.value.filter(item => item.value).map(item => item.value);
        if (propertyValues.length) {
            return Math.max(...propertyValues);
        }
    }
    return null;
});

const propertyValueChange = (index) => {
    if (selectedItemIndex.value !== null) {
        const propertyValues = selectedItemPropertyValues.value[index].value.trim().split(/ +|\t/);
        if (propertyValues.length > 1) {
            for (const n in propertyValues) {
                if (selectedItemPropertyValues.value[n]) {
                    selectedItemPropertyValues.value[n].value = propertyValues[n];
                    propertyValueChange(n);
                }
            }
        }
    }
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