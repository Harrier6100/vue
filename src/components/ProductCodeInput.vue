<template>
    <div class="position-relative">
        <input class="form-control" type="text" v-model="inputValue" @change="change">
        <a class="position-absolute top-50 end-0 translate-middle-y pe-3" role="button" @click="ProductCodeSelector.open">
            <i class="bi bi-search"></i>
        </a>
    </div>
</template>

<script setup>
</script>