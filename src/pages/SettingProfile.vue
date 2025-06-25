<template>
    <div class="container-fluid">
        <div class="mb-3">
            <router-link class="text-dark text-decoration-none" to="/setting">
                <i class="bi bi-arrow-left me-1"></i>設定
            </router-link>
        </div>

        <div class="border-top">
            <router-link class="text-dark text-decoration-none" to="/setting/profile/name">
                <div class="d-flex flex-row py-3">
                    <div class="flex-shrink-0">名前</div>
                    <div class="d-flex w-100">
                        <i class="bi bi-arrow-right ms-auto"></i>
                    </div>
                </div>
            </router-link>
        </div>

        <div class="border-top border-bottom">
            <router-link class="text-dark text-decoration-none" to="/setting/profile/email">
                <div class="d-flex flex-row py-3">
                    <div class="flex-shrink-0">メールアドレス</div>
                    <div class="d-flex w-100">
                        <i class="bi bi-arrow-right ms-auto"></i>
                    </div>
                </div>
            </router-link>
        </div>

    </div>
</template>