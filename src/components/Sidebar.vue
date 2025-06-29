<template>
    <!-- <div class="d-flex"> -->
        <!-- <nav class="border-end p-3" style="width: 200px"> -->
        <!-- <nav>
            <div class="mb-3">メニュー</div>
            <ul class="nav flex-column">
                <li class="nav-item">
                    <router-link class="nav-link" to="/users">TEST</router-link>
                </li>
            </ul>
        </nav> -->
        
        <!-- <main class="flex-grow-1 p-3">
            <slot></slot>
        </main> -->
    <!-- </div> -->
    <div v-if="props.isOpen">
        <div class="modal-backdrop show" @click.self="close"></div>
        <div class="offcanvas offcanvas-start show">
            <div class="offcanvas-header">
                <button class="btn-close" type="button" @click="close"></button>
            </div>
            <div class="offcanvas-body">
                test
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    isOpen: Boolean,
});
const emit = defineEmits(['close']);

const close = () => {
    emit('close');
};
</script>