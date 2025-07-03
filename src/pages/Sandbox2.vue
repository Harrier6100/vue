<template>
    <teleport to="body">
        <div v-if="props.isOpen">
            <div class="modal-backdrop show"></div>
            <div class="modal d-block show">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <button class="btn-close" @click="close"></button>
                        </div>
                        <div class="modal-body">

                            <div v-if="allowMenuName" class="mb-3">
                                <select v-model="menu.menuName">
                                    <option value=""></option>
                                    <option v-for="opt in menuNameOptions" :key="opt" :value="opt">
                                        {{ opt }}
                                    </option>
                                </select>
                            </div>

                            <div class="mb-3">
                                <label>Label</label>
                                <input type="text" v-model="menu.label">
                            </div>

                            <div class="mb-3">
                                <label>To</label>
                                <input type="text" v-model="menu.to">
                            </div>

                            <div class="mb-3">
                                <label>Plan Number</label>
                                <input type="text" v-model="menu.planNumber">
                            </div>

                            <div class="mb-3">
                                <label>Image</label>
                                <input type="file" accept="image/*" @change="imageChange">
                            </div>

                            <img v-if="menu.image" :src="menu.image" class="img-thumbnail" style="max-height: 150px" />
                            <!-- <div v-if="imageView">
                                <img :src="imageView" class="img-thumbnail" style="max-height: 150px">
                            </div> -->

                            <div>
                                <i v-for="star in stars"
                                    :key="star"
                                    :class="(star <= menu.rating || hoverRating >= star) ? 'bi-star-fill' : 'bi-star'"
                                    class="bi text-warning"
                                    style="cursor: pointer; font-size: 1rem;"
                                    @click="menu.rating = (menu.rating === star ? 0 : star)"
                                    @mouseover="hoverRating = star"
                                    @mouseleave="hoverRating = 0"
                                ></i>
                                <div>{{ menu.rating }} / {{ stars }}</div>
                            </div>

                            <button @click="close">キャンセル</button>
                            <button @click="save" :disabled="!isChange">保存</button>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
const props = defineProps({
    isOpen: Boolean,
    modelValue: Object,
    menuNameOptions: Array,
    allowMenuName: Boolean,
});
const emit = defineEmits(['save', 'close']);

const menuRestore = () => ({
    label: '',
    to: '',
    planNumber: '',
    menuName: '',
    image: '',
    rating: 0,
});
const menu = ref(menuRestore());
const _menu = ref(menuRestore());
const stars = 5;
const hoverRating = ref(0);

watch(() => props.modelValue, (newValue) => {
    if (newValue) {
        Object.assign(menu.value, newValue);
        _menu.value = JSON.parse(JSON.stringify(newValue));
    }
}, { immediate: true });

const isChange = computed(() => {
    return JSON.stringify(menu.value) !== JSON.stringify(_menu.value);
});

// const imageView = ref('');
const imageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
        menu.value.image = reader.result;
    };
    reader.readAsDataURL(file);
    // if (file && file.type.startsWith('image/')) {
    //     imageView.value = URL.createObjectURL(file);
    //     menu.value.image = imageView.value;
    // }
};

const save = () => {
    emit('save', {
        ...menu.value,
        menuName: props.allowMenuName ? menu.value.menuName : undefined,
        // image: menu.value.image ?? '',
    });
};

const close = () => {
    emit('close');
};
</script>