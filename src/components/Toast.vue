<template>
    <teleport to="body">
        <div v-if="toasts.length" class="toast-container position-fixed bottom-0 start-0 p-3">
            <div v-for="toast in toasts"
                :key="toast.id"
                class="toast align-items-center text-white bg-opacity-75 border-0 show"
                :class="toast.color"
                role="alert"
            >
                <div class="d-flex">
                    <div class="toast-body">{{ toast.message }}</div>
                    <button
                        class="btn-close btn-close-white m-auto me-2"
                        type="button"
                        @click="removeToast(toast.id)"
                    >
                    </button>
                </div>
            </div>
        </div>
    </teleport>
</template>

<script setup>
import { useToast } from '@/composables/useToast';
const { toasts, addToast, removeToast } = useToast();
</script>

<style scoped>
.toast {
  --bs-toast-spacing: 1rem;
}
</style>