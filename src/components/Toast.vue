<template>
    <teleport to="body">
        <div class="toast-container position-fixed bottom-0 p-3">
            <div v-for="toast in toasts"
                :key="toast.id"
                :class="['toast', 'text-white', 'bg-opacity-75', 'border-0', 'show', toast.color]"
                role="alert"
            >
                <div class="d-flex">
                    <div class="toast-body">
                        {{ toast.message }}
                    </div>
                    <button class="btn-close btn-close-white me-2 m-auto" @click="removeToast(toast.id)"></button>
                </div>
            </div>
        </div>
    </teleport>
</template>

<script setup>
import { useToast } from '@/composables/useToast';
const { toasts, addToast, removeToast } = useToast();
</script>