<template>
    <teleport to="body">
        <div v-if="isOpen">
            <div class="modal-backdrop show"></div>
            <div class="modal d-block show" @click.self="confirmNo">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-body">
                            <p>{{ confirmMessage }}</p>
                            <div class="d-flex justify-content-end gap-3">
                                <button class="btn btn-secondary" type="button" @click="confirmNo">キャンセル</button>
                                <button class="btn btn-primary" type="button" @click="confirmYes">OK</button>
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
const { isOpen, confirmMessage, confirmYes, confirmNo } = useConfirm();
</script>

<style>
.modal {
  z-index: 9999;
}
</style>