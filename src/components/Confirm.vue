<template>
    <teleport to="body">
        <div v-if="isOpen">
            <div class="modal-backdrop show"></div>
            <div class="modal d-block show" @click.self="cancel">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-body">
                            <p>{{ message }}</p>
                            <div class="d-flex justify-content-end gap-3">
                                <button class="btn btn-secondary" type="button" @click="cancel">キャンセル</button>
                                <button class="btn btn-primary" type="button" @click="confirm">OK</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </teleport>
</template>

<script setup>
import { useConfirm } from '@/composables/useConfirm';
const { isOpen, message, confirm, cancel } = useConfirm();
</script>

<style>
.modal {
  z-index: 9999;
}
</style>