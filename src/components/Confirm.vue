<template>
    <teleport to="body">
        <div v-if="isConfirm">
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
const { isConfirm, confirmMessage, confirmYes, confirmNo } = useConfirm();
</script>

<style>
.modal {
  z-index: 9999;
}
</style>