<template>
    <div v-if="props.isOpen">
        <div class="modal-backdrop show" @click.self="close"></div>
        <div class="offcanvas offcanvas-start show">
            <div class="offcanvas-header border-bottom">
                <button class="btn-close" type="button" @click="close"></button>
            </div>
            <div class="offcanvas-body p-0">
                <!-- <transition name="slide-fade">
                    <div v-if="!openSubMenuName">
                        <div class="border-top">
                            <router-link class="text-dark text-decoration-none" to="/users" @click="close">
                                <div class="d-flex flex-row p-3">
                                    <div class="flex-shrink-0">アカウント管理</div>
                                    <div class="d-flex w-100">
                                        <i class="bi bi-arrow-right ms-auto"></i>
                                    </div>
                                </div>
                            </router-link>
                        </div>
                        <div class="border-top">
                            <div class="d-flex flex-row p-3" role="button" @click="openSubMenu('physprop')">
                                <div class="flex-shrink-0">アカウント管理</div>
                                <div class="d-flex w-100">
                                    <i class="bi bi-arrow-right ms-auto"></i>
                                </div>
                            </div>
                        </div>
                        <div class="border-top border-bottom">
                            <router-link class="text-dark text-decoration-none" to="/physprops" @click="close">
                                <div class="d-flex flex-row p-3">
                                    <div class="flex-shrink-0">物性</div>
                                    <div class="d-flex w-100">
                                        <i class="bi bi-arrow-right ms-auto"></i>
                                    </div>
                                </div>
                            </router-link>
                        </div>
                    </div>
                </transition>
                <transition name="slide-fade">
                    <div v-if="openSubMenuName === 'physprop'">
                        <div class="border-top">
                            <div class="d-flex flex-row p-3" role="button" @click="openSubMenu(null)">
                                <div class="d-flex">
                                    <i class="bi bi-arrow-left me-auto"></i>
                                </div>
                                <div class="flex-shrink-0 w-100">アカウント管理</div>
                            </div>
                        </div>
                        <div class="border-top">
                            <router-link class="text-dark text-decoration-none" to="/users" @click="close">
                                <div class="d-flex flex-row p-3">
                                    <div class="flex-shrink-0">アカウント管理</div>
                                    <div class="d-flex w-100">
                                        <i class="bi bi-arrow-right ms-auto"></i>
                                    </div>
                                </div>
                            </router-link>
                        </div>
                    </div>
                </transition> -->
                <div class="offcanvas-body p-0 position-relative" style="min-height: 300px; overflow: hidden;">
                    <div class="offcanvas-body position-relative" style="overflow: hidden; min-height: 300px;">
                        <transition :name="transitionName">
                        <div v-if="currentMenu === 'root'" class="menu-slide">
                            <div @click="pushMenu('account')" class="p-3 border-bottom">アカウント管理 →</div>
                            <div @click="pushMenu('settings')" class="p-3 border-bottom">設定 →</div>
                        </div>
                        </transition>

                        <transition :name="transitionName">
                        <div v-if="currentMenu === 'account'" class="menu-slide">
                            <div @click="popMenu()" class="p-3 border-bottom">← 戻る</div>
                            <div @click="pushMenu('account-profile')" class="p-3 border-bottom">プロフィール →</div>
                            <router-link to="/users">アカウント管理</router-link>
                        </div>
                        </transition>

                        <transition :name="transitionName">
                        <div v-if="currentMenu === 'account-profile'" class="menu-slide">
                            <div @click="popMenu()" class="p-3 border-bottom">← 戻る</div>
                            <router-link to="/users/profile" class="p-3 d-block">プロフィール画面</router-link>
                        </div>
                        </transition>

                        <transition :name="transitionName">
                        <div v-if="currentMenu === 'settings'" class="menu-slide">
                            <div @click="popMenu()" class="p-3 border-bottom">← 戻る</div>
                            <router-link to="/users/profile" class="p-3 d-block">プロフィール画面</router-link>
                        </div>
                        </transition>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
    isOpen: Boolean,
});
const emit = defineEmits(['close']);

const menuStack = ref([]);
const isForward = ref(true);

const pushMenu = (menuName) => {
    menuStack.value.push(menuName);
    isForward.value = true;
};

const popMenu = () => {
    menuStack.value.pop();
    isForward.value = false;
};

const currentMenu = computed(() => {
    return menuStack.value.at(-1) || 'root';
});

const transitionName = computed(() => {
    return isForward.value ? 'slide-forward' : 'slide-back';
});


const subMenu = ref(null);
const openSubMenuName = ref(null);

const openSubMenu = (menuName) => {
    if (openSubMenuName.value === menuName) {
        openSubMenuName.value = null;
    } else {
        openSubMenuName.value = menuName;
    }
};

const close = () => {
    emit('close');
};
</script>

<style>
.menu-slide {
  position: absolute;
  width: 100%;
  top: 0;
  left: 0;
}

/* 進むとき: 左→右 */
.slide-forward-enter-active,
.slide-forward-leave-active,
.slide-back-enter-active,
.slide-back-leave-active {
  transition: all 0.3s ease;
}

.slide-forward-enter-from {
  transform: translateX(100%);
}
.slide-forward-leave-to {
  transform: translateX(-100%);
}

/* 戻るとき: 右→左 */
.slide-back-enter-from {
  transform: translateX(-100%);
}
.slide-back-leave-to {
  transform: translateX(100%);
}
</style>