<template>
    <div v-if="props.isOpen">
        <div class="modal-backdrop show" @click.self="close"></div>
        <div class="offcanvas offcanvas-start show">
            <div class="offcanvas-header border-bottom">
                <button class="btn-close" type="button" @click="close"></button>
            </div>
            <div class="offcanvas-body overflow-hidden p-0">
                <div class="position-relative">
                    <transition :name="transitionName">
                        <div v-if="menu === 'root'" class="slide-menu">
                            <div v-for="item in filteredMenus" :key="item.menu" class="border-bottom">
                                <div class="d-flex flex-row p-3" role="button" @click="pushMenu(item.menu)">
                                    <div class="flex-shrink-0">{{ item.label }}</div>
                                    <div class="d-flex w-100">
                                        <i class="bi bi-arrow-right ms-auto"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </transition>
                    <transition :name="transitionName">
                        <div v-if="menu !== 'root'" class="slide-menu">
                            <div class="border-bottom">
                                <div class="d-flex flex-row p-3" role="button" @click="popMenu()">
                                    <div class="flex-shrink-0 me-1">
                                        <i class="bi bi-arrow-left ms-auto"></i>
                                    </div>
                                    <div class="d-flex w-100">戻る</div>
                                </div>
                            </div>
                            <div v-for="item in filteredMenus" :key="item.to || item.menu" class="border-bottom">
                                <router-link v-if="item.to" class="text-dark text-decoration-none" :to="item.to" @click="close">
                                    <div class="d-flex flex-row p-3" role="button">
                                        <div class="flex-shrink-0">{{ item.label }}</div>
                                    </div>
                                </router-link>
                                <div v-else-if="item.menu" class="d-flex flex-row p-3" role="button" @click="pushMenu(item.menu)">
                                    <div class="flex-shrink-0">{{ item.label }}</div>
                                    <div class="d-flex w-100">
                                        <i class="bi bi-arrow-right ms-auto"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </transition>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const menuDefinitions = {
    root: [
        {
            label: '品質',
            menu: 'physprop',
        },
        {
            label: '管理',
            menu: 'management',
        },
    ],
    physprop: [
        {
            label: '物性マスタ',
            to: '/physprops',
            permission: 'view:physprops',
        },
        {
            label: '物性規格マスタ',
            to: '/physprop/specs',
            permission: 'view:physprop_specs',
        },
    ],
    management: [
        {
            label: 'その他',
            menu: 'other',
        },
        {
            label: 'アカウント管理',
            to: '/users',
            permission: 'view:users',
        },
    ],
    other: [
        {
            label: 'その他テスト',
            to: '/other',
            permission: 'view:other',
        },
    ],
};

const props = defineProps({
    isOpen: Boolean,
});
const emit = defineEmits(['close']);
const menuStack = ref([]);
const isForward = ref(true);

const menu = computed(() => {
    return menuStack.value.at(-1) || 'root';
});

const transitionName = computed(() => {
    return isForward.value ? 'slide-forward' : 'slide-back';
});

const pushMenu = (menuName) => {
    menuStack.value.push(menuName);
    isForward.value = true;
};

const popMenu = () => {
    menuStack.value.pop();
    isForward.value = false;
};

const close = () => {
    emit('close');
};

const userPermissions = ref(['view:other']);
// const filteredMenus = computed(() => {
//     const menuName = menuStack.value.at(-1) || 'root';
//     return menuDefinitions[menuName].filter(item => {
//         return !item.permission || userPermissions.value.includes(item.permission);
//     });
// });

const filteredMenus = computed(() => {
    const menuName = menuStack.value.at(-1) || 'root';
    const items = menuDefinitions[menuName] || [];

    return items.filter(item => {
        if (item.to) {
            return !item.permission || userPermissions.value.includes(item.permission);
        }

        if (item.menu) {
            const subItems = menuDefinitions[item.menu] || [];
            const hasVisibleChildren = subItems.some(subItem => {
                return !subItem.permission || userPermissions.value.includes(subItem.permission);
            });
            return hasVisibleChildren;
        }

        return true;
    });
});

</script>

<style>
.slide-menu {
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