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
                        <div class="slide-menu" :key="menu">
                            <template v-if="menu === 'root'">
                                <div v-for="item in filteredMenus" :key="item.menuName" class="border-bottom">
                                    <div class="d-flex flex-row p-3" role="button" @click="pushMenu(item.menuName)">
                                        <div class="flex-shrink-0">{{ item.label }}</div>
                                        <div class="d-flex w-100">
                                            <i class="bi bi-arrow-right ms-auto"></i>
                                        </div>
                                    </div>
                                </div>
                            </template>
                            <template v-else>
                                <div class="border-bottom">
                                    <div class="d-flex flex-row p-3" role="button" @click="popMenu()">
                                        <div class="flex-shrink-0">
                                            <i class="bi bi-arrow-left me-1"></i>
                                        </div>
                                        <div class="d-flex w-100">前へ</div>
                                    </div>
                                </div>
                                <div v-for="item in filteredMenus" :key="item.to || item.menuName" class="border-bottom">
                                    <div v-if="item.menuName" class="d-flex flex-row p-3" role="button" @click="pushMenu(item.menuName)">
                                        <div class="flex-shrink-0">{{ item.label }}</div>
                                        <div class="d-flex w-100">
                                            <i class="bi bi-arrow-right ms-auto"></i>
                                        </div>
                                    </div>
                                    <router-link v-else-if="item.to" class="text-dark text-decoration-none" :to="item.to" @click="close">
                                        <div class="d-flex flex-row p-3" role="button">
                                            <div class="flex-shrink-0">{{ item.label }}</div>
                                        </div>
                                    </router-link>
                                </div>
                            </template>
                        </div>
                    </transition>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useUser } from '@/composables/useUser';

const props = defineProps({
    isOpen: Boolean,
});
const emit = defineEmits(['close']);
const menuLists = {
    root: [
        {
            label: '品質',
            menuName: 'quality',
        },
        {
            label: '管理',
            menuName: 'management',
        },
    ],
    quality: [
        {
            label: '物性マスタ',
            to: '/physprops',
            roles: ['admin'],
            permission: null,
        },
        {
            label: '物性規格マスタ',
            to: '/physprop/specs',
            roles: ['admin'],
            permission: 'read:physprop_specs',
        },
        {
            label: '物性値',
            to: '/physprop/values',
            roles: ['admin'],
            permission: 'read:physprop_values',
        },
        {
            label: '物性値入力',
            to: '/physprop/values/add',
            roles: ['admin'],
            permission: 'create:physprop_values',
        },
    ],
    management: [
        {
            label: 'アカウント管理',
            to: '/users',
            roles: ['admin'],
            permission: null,
        },
        {
            label: 'アカウント追加',
            to: '/users/add',
            roles: ['admin'],
            permission: null,
        },
    ],
};
const userPermissions = ref(['view:other']);
const { userRole } = useUser();
const menuStack = ref([]);
const isForward = ref(true);

const menu = computed(() => {
    return menuStack.value.at(-1) || 'root';
});

const transitionName = computed(() => {
    return isForward.value ? 'slide-forward' : 'slide-back';
});

const filteredMenus = computed(() => {
    const menuName = menuStack.value.at(-1) || 'root';
    const items = menuLists[menuName] || [];

    return items.filter(item => {
        if (item.to) {
            return (item.roles.length === 0 && !item.permission) || item.roles.includes(userRole.value) || userPermissions.value.includes(item.permission);
        }

        if (item.menuName) {
            const subItems = menuLists[item.menuName] || [];
            const hasSubItem = subItems.some(subItem => {
                return (subItem.roles.length === 0 && !subItem.permission) || subItem.roles.includes(userRole.value) || userPermissions.value.includes(subItem.permission);
            });
            return hasSubItem;
        }

        return true;
    });
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