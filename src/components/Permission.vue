<template>
    <teleport to="body">
        <div v-if="isOpen">
            <div class="modal-backdrop show"></div>
            <div class="modal d-block show" @click.self="emit('close')">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <button class="btn-close" @click="emit('close')"></button>
                        </div>
                        <div class="modal-body">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th class="text-start"></th>
                                        <th class="text-center">閲覧</th>
                                        <th class="text-center">作成</th>
                                        <th class="text-center">更新</th>
                                        <th class="text-center">削除</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(permissionAction, key) in permissionActions" :key="key">
                                        <td>{{ permissionAction.label }}</td>
                                        <td v-for="action in actions" :key="action">
                                            <div class="d-flex justify-content-center">
                                                <input class="form-check-input" type="checkbox" :value="permissionAction.actions[action]" v-model="permissions">
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            <div class="d-flex justify-content-end gap-3">
                                <button class="btn btn-secondary" @click="emit('close')">キャンセル</button>
                                <button class="btn btn-primary" @click="handleSave">保存</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </teleport>
</template>

<script setup>
import { ref, watch } from 'vue';
import { permissionActions } from '@/config/permissionActions';

const props = defineProps({
    isOpen: Boolean,
    modelValue: {
        type: Array,
        default: () => [],
    },
});
const emit = defineEmits(['save', 'close']);

const actions = ['view', 'create', 'update', 'remove'];
const permissions = ref([]);

watch(() => props.modelValue, (value) => {
    if (Array.isArray(value)) {
        permissions.value = [...value];
    }
}, { immediate: true });

const handleSave = () => {
    emit('save', permissions.value);
    emit('close');
};
</script>