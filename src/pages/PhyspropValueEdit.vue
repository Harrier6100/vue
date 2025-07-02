<template>
    <div class="container-fluid">
        <div class="mb-3">物性値</div>

        <form @submit.prevent="save" autocomplete="off">

            <div class="mb-3">
                <div class="row">
                    <div class="col">

                        <div class="mb-3">
                            <label class="form-label" for="productLot">ロット</label>
                            <StockLotInput
                                id="productLot"
                                v-model="physpropValue.productLot"
                                @change="productLotChange"
                                @errorMessage="errorMessage.productLot = $event"
                                @error="isError = $event"
                                :readonly="!!productLot"
                            />
                            <Message :error="errorMessage.productLot" />
                        </div>
                        <div>{{ physpropValue.productCode }}</div>
                        <div>{{ physpropValue.productName }}</div>

                    </div>
                    <div class="col">

                        <div class="mb-3">
                            <label class="form-label" for="customerCode">得意先コード</label>
                            <CustomerCodeInput
                                id="customerCode"
                                v-model="physpropValue.customerCode"
                                @change="customerCodeChange"
                                @errorMessage="errorMessage.customerCode = $event"
                                @error="isError = $event"
                                :readonly="!!productLot"
                            />
                            <Message :error="errorMessage.customerCode" />
                        </div>
                        <div>{{ physpropValue.customerName }}</div>

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
                                <td>最小値</td>
                                <td>最大値</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(propertyItem, index) in physpropValue.propertyItems" :class="{ 'opacity-25': selectedIndex != index }" :key="index" role="button" @click="selectedIndex = index">
                                <td class="text-center align-middle">
                                    <input class="form-check-input" type="radio" :value="index" v-model="selectedIndex">
                                </td>
                                <td class="text-start align-middle">{{ propertyItem.propertyCode }}</td>
                                <td class="text-start align-middle">{{ propertyItem.propertyName }}</td>
                                <td>
                                    <DatePicker
                                        class="form-control"
                                        v-model="propertyItem.measuredDate"
                                        placeholder="YYYY-MM-DD"
                                    />
                                </td>
                                <td>
                                    <UserCodeInput
                                        v-model="propertyItem.measurerCode"
                                        @change="measurerCodeChange"
                                        @errorMessage="propertyItem.errorMessage = $event"
                                        @error="isError = $event"
                                    />
                                    <Message :error="propertyItem.errorMessage" />
                                </td>
                                <td class="text-start align-middle">{{ propertyItem.measurerName }}</td>
                                <td class="text-end align-middle">{{ propertyItem.specLowerValue }}</td>
                                <td class="text-end align-middle">{{ propertyItem.specUpperValue }}</td>
                                <td class="text-start align-middle">{{ propertyItem.uom }}</td>
                                <td class="text-end align-middle">{{ propertyItem.numberSize }}</td>
                                <td class="text-end align-middle">{{ propertyItem.mean }}</td>
                                <td class="text-center align-middle" :class="{ 'text-danger': propertyValuesCheck(propertyItem) }">
                                    <span v-if="propertyItem.score === true" class="bi bi-circle"></span>
                                    <span v-if="propertyItem.score === false" class="bi bi-x-lg"></span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="col-3">
                    <table class="table table-bordered">
                        <thead class="table-secondary">
                            <tr>
                                <td colspan="3">
                                    <span>最小値={{ propertyValuesLowerValue }}</span>
                                    <span>最大値={{ propertyValuesUpperValue }}</span>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div class="d-flex justify-content-center gap-3">
                                        <button class="btn btn-sm btn-link text-decoration-none p-0" @click="page--" :disabled="page == 1">◀</button>
                                        <button class="btn btn-sm btn-link text-decoration-none p-0" @click="page++" :disabled="page >= pageLength">▶</button>
                                    </div>
                                </td>
                                <td>測定値</td>
                                <td>判定</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(propertyValue, index) in propertyValues" :key="index" v-show="propertyValuesShow(index)">
                                <td class="text-center align-middle">{{ index + 1 }}</td>
                                <td>
                                    <input class="form-control" v-model="propertyValue.value" @change="propertyValueChange(index)">
                                </td>
                                <td class="text-center align-middle">
                                    <span v-if="propertyValue.score === true" class="bi bi-circle"></span>
                                    <span v-if="propertyValue.score === false" class="bi bi-x-lg"></span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

        </form>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import Decimal from 'decimal.js';
import { api } from '@/services/api';
import { useMessage } from '@/composables/useMessage';
import { useArray } from '@/composables/useArray';
import { usePagination } from '@/composables/usePagination';
import { Message, DatePicker, StockLotInput, CustomerCodeInput, UserCodeInput } from '@/components';

const { errorMessage } = useMessage();

const propertyItems = useArray();
const physpropValueRestore = () => ({
    productLot: '',
    productCode: '',
    productName: '',
    customerCode: '',
    customerName: '',
    propertyItems: propertyItems.items,
});
const physpropValue = ref(physpropValueRestore());

const productLotChange = ({ lot, code, name }) => {
    physpropValue.value.productCode = code ?? '';
    physpropValue.value.productName = name ?? '';
    propertyItems.items.value = [];
    if (lot) physpropSpecGet();
};

const physpropSpecGet = async () => {
    const { productCode, customerCode } = physpropValue.value;

    try {
        const response = await api.get(`/api/physprop/specs/${productCode.slice(0, 9)}/${customerCode ?? ''}`);
        const { specs } = response.data;
        for (const spec of specs) {
            if (spec.isActive) {
                const propertyItem = {};
                propertyItem.propertyCode = spec.propertyCode;
                propertyItem.propertyName = spec.propertyName;
                propertyItem.measuredDate = null;
                propertyItem.measurerCode = null;
                propertyItem.measurerName = null;
                propertyItem.specLowerValue = null;
                propertyItem.specUpperValue = null;
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
                propertyItem.propertyValues = Array.from(
                    Array(spec.numberSize), () => {
                        return {
                            value: null,
                            score: null,
                        }
                    }
                );
                propertyItem.uom = spec.uom;
                propertyItem.numberSize = spec.numberSize;
                propertyItem.decimalScale = spec.decimalScale;
                propertyItem.isTrancate = spec.isTrancate;
                propertyItem.mean = null;
                propertyItem.score = null;
                propertyItems.add(propertyItem);
            }
        }
    } catch (error) {
        console.error(error);
    }
};

const customerCodeChange = ({ name }) => {
    physpropValue.value.customerName = name ?? '';
};

const selectedIndex = ref(null);

const selectedItem = computed(() => {
    return physpropValue.value.propertyItems[selectedIndex.value] || [];
});

const measurerCodeChange = ({ name }) => {
    selectedItem.value.measurerName = name ?? '';
};

const propertyValues = computed(() => {
    return selectedItem.value.propertyValues || [];
});

const propertyValuesCheck = (propertyItem) => {
    const scores = propertyItem.propertyValues.map(item => item.score);
    return !scores.every(Boolean);
};

const propertyValuesLowerValue = computed(() => {
    const values = propertyValues.value
        .filter(item => item.value)
        .map(item => item.value);
    return values.length ? Math.min(...values) : null;
});

const propertyValuesUpperValue = computed(() => {
    const values = propertyValues.value
        .filter(item => item.value)
        .map(item => item.value);
    return values.length ? Math.max(...values) : null;
});

const { page, pageLength } = usePagination(propertyValues, 10);
const propertyValuesShow = (index) => {
    const startIndex = (page.value - 1) * 10;
    const endIndex = startIndex + 10;
    return index >= startIndex && index < endIndex;
};

const propertyValueChange = (index) => {
    const values = propertyValues.value[index].value.trim().split(/ +|\t/);
    if (values.length > 1) {
        for (const n in values) {
            if (propertyValues.value[n]) {
                propertyValues.value[n].value = values[n];
                propertyValueChange(n);
            }
        }
    }

    const decimalScale = selectedItem.value.decimalScale;
    const isTrancate = selectedItem.value.isTrancate;
    const roundMode = (isTrancate) ? Decimal.ROUND_DOWN : Decimal.ROUND_HALF_UP;
    let value = propertyValues.value[index].value;
    if (value !== '') {
        value = Decimal(value).toDecimalPlaces(decimalScale, roundMode).toNumber();
    }
    propertyValues.value[index].value = value;
    propertyValues.value[index].score = calculationScore(value);
    calculationMean();
};

const calculationMean = () => {
    const decimalScale = selectedItem.value.decimalScale;
    const isTrancate = selectedItem.value.isTrancate;
    const roundMode = (isTrancate) ? Decimal.ROUND_DOWN : Decimal.ROUND_HALF_UP;
    const values = propertyValues.value.filter(item => item.value).map(item => item.value);
    const total = values.reduce((sum, num) => Decimal(sum).add(num).toNumber(), 0);
    let mean = Decimal(total).div(values.length).toNumber().toFixed(4);
    if (!isNaN(mean)) {
        selectedItem.value.mean = Decimal(mean).toDecimalPlaces(decimalScale, roundMode).toNumber();
        selectedItem.value.score = calculationScore(mean);
    } else {
        selectedItem.value.mean = null;
        selectedItem.value.score = null;
    }
};

const calculationScore = (value) => {
    let score = null;
    const specLowerValue = selectedItem.value.specLowerValue;
    const specUpperValue = selectedItem.value.specUpperValue;

    if (value !== '' && !isNaN(value)) {
        if (specLowerValue && !specUpperValue) {
            score = (value >= specLowerValue) ? true : false;
        }
        if (!specLowerValue && specUpperValue) {
            score = (value <= specUpperValue) ? true : false;
        }
        if (specLowerValue && specUpperValue) {
            score = (value >= specLowerValue && value <= specUpperValue) ? true : false;
        }
    }

    return score;
};
</script>