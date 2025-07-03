<template>
    <div class="container">
        <div class="mb-3">Sandbox</div>

        <div class="mb-3">
            <div>isOpen</div>
            <div>{{ isOpen }}</div>
        </div>

        <div class="mb-3">
            <label>Name</label>
            <input type="text" v-model="menu.name">
        </div>

        <div class="mb-3">
            <div>Menu</div>
            <div>{{ menu }}</div>
        </div>

        <div class="mb-3">
            <div>Menus</div>
            <div v-for="(item, index) in menu.menu" :key="index">
                <div class="d-flex gap-3">
                    <div>Label: {{ item.label }}</div>
                    <div>To: {{ item.to }}</div>
                    <div>Plan Number: {{ item.planNumber }}</div>
                    <button @click="edit(item, index)">編集</button>
                    <button @click="remove(index)">削除</button>
                </div>
            </div>
        </div>

        <button @click="add">追加</button>

        <hr>

        <div class="mb-3">Sandbox Second</div>

        <div class="mb-3">
            <div>isOpenSecond</div>
            <div>{{ isOpenSecond }}</div>
        </div>

        <div class="mb-3">
            <label>Name</label>
            <input type="text" v-model="menuSecond.name">
        </div>

        <div class="mb-3">
            <div>Menu</div>
            <div>{{ menuSecondDisp }}</div>
        </div>

        <div class="mb-3">
            <div>Menus</div>
            <div v-for="(group, groupName) in menuSecond.menu" :key="groupName">
                <div>GroupName: {{ groupName }}</div>
                <div v-for="(item, index) in group" :key="index">
                    <div class="d-flex gap-3">
                        <img v-if="item.image" :src="item.image" class="img-thumbnail" style="height: 40px; width: auto; cursor: pointer;" @click="openImage(item.image)">
                        <div>Lable:{{ item.label }}</div>
                        <div>To:{{ item.to }}</div>
                        <div>Plan Number:{{ item.planNumber }}</div>
                        <div>Menu Name: {{ item.menuName }}</div>
                        <button @click="editSecond(groupName, index)">編集</button>
                        <button @click="removeSecond(groupName, index)">削除</button>
                    </div>
                </div>
                <button @click="addSecond(groupName)">追加</button>
                <button @click="removeGroup(groupName)">グループ削除</button>
            </div>
        </div>

        <input type="text" v-model="groupName">
        <button @click="addGroup">グループ追加</button>

        <Sandbox
            v-if="isOpen"
            :isOpen="isOpen"
            :modelValue="mitem.item"
            @close="isOpen = false"
            @save="save"
        />

        <Sandbox
            v-if="isOpenSecond"
            :isOpen="isOpenSecond"
            :modelValue="mitemSecond.item"
            :menuNameOptions="Object.keys(menuSecond.menu)"
            :allowMenuName=true
            @close="isOpenSecond = false"
            @save="saveSecond"
        />

        <div v-if="imageOpen">
            <div class="modal-backdrop show"></div>
            <div class="modal d-block show" @click.self="imageOpen = false">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-body">
                            <img :src="image" class="img-fluid" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <hr>

        <div class="position-relative overflow-hidden p-3" style="height: 150px">
            <transition name="slide" mode="out-in">
                <div :key="step" class="position-absolute top-0 start-0">
                    <div v-if="step === 1">
                        <h5>Step1: 基本情報</h5>
                        <div>
                            <input v-model="form.name" placeholder="名前">
                        </div>
                        <div>
                            <input v-model="form.age" placeholder="年齢">
                        </div>
                    </div>

                    <div v-else-if="step === 2">
                        <h5>Step2: 詳細</h5>
                        <div>
                            <select v-model="form.role">
                                <option value="admin">Admin</option>
                                <option value="user">User</option>
                            </select>
                        </div>
                        <div>
                            <textarea v-model="form.remarks" placeholder="備考"></textarea>
                        </div>
                    </div>

                    <div v-else-if="step === 3">
                        <h5>Step3: 最終確認</h5>
                        <div>名前:{{ form.name }}</div>
                        <div>年齢:{{ form.age }}</div>
                        <div>ロール:{{ form.role }}</div>
                        <div>コメント:{{ form.remarks }}</div>
                    </div>
                </div>
            </transition>
        </div>

        <div class="d-flex justify-content-between">
            <button @click="step--" :disabled="step === 1">前へ</button>
            <button v-if="step < steps" @click="step++">次へ</button>
            <button v-else @click="saveStep">保存</button>
        </div>

    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import Sandbox from './Sandbox2.vue';

const isOpen = ref(false);

const menuRestore = () => ({
    name: '',
    menu: [],
});
const menu = ref(menuRestore());
const mitem = ref({
    item: null,
    index: -1,
    isNew: false,
});

const add = () => {
    mitem.value.item = { label: '', to: '', planNumber: '', };
    mitem.value.index = -1;
    mitem.value.isNew = true;
    isOpen.value = true;
};

const edit = (item, index) => {
    mitem.value.item = { ...item };
    mitem.value.index = index;
    mitem.value.isNew = false;
    isOpen.value = true;
};

const remove = (index) => {
    menu.value.menu.splice(index, 1);
};

const save = (item) => {
    const { index, isNew } = mitem.value;
    if (isNew) {
        menu.value.menu.push(item);
    } else {
        menu.value.menu[index] = item;
    }
    isOpen.value = false;
};

//----- Second -----//

const isOpenSecond = ref(false);

const groupName = ref('');
const menuSecondRestore = () => ({
    name: '',
    menu: {
        root: [],
    },
});
const menuSecond = ref(menuSecondRestore());
const mitemSecond = ref({
    groupName: '',
    item: null,
    index: -1,
    isNew: false,
});

const addGroup = () => {
    const name = groupName.value.trim();
    if (!name) return;

    if (!menuSecond.value.menu[name]) {
        menuSecond.value.menu[name] = [];
    }

    groupName.value = '';
};

const removeGroup = (groupName) => {
    const entries = Object.entries(menuSecond.value.menu)
        .filter(([key]) => key !== groupName);
    menuSecond.value.menu = Object.fromEntries(entries);
};

const addSecond = (groupName) => {
    mitemSecond.value.groupName = groupName;
    mitemSecond.value.item = { label: '', to: '', planNumber: '', };
    mitemSecond.value.index = -1;
    mitemSecond.value.isNew = true;
    isOpenSecond.value = true;
};

const editSecond = (groupName, index) => {
    const target = menuSecond.value.menu[groupName][index];
    mitemSecond.value.groupName = groupName;
    mitemSecond.value.item = { ...target };
    mitemSecond.value.index = index;
    mitemSecond.value.isNew = false;
    isOpenSecond.value = true;
};

const saveSecond = (item) => {
    const { groupName, index, isNew } = mitemSecond.value;
    if (isNew) {
        menuSecond.value.menu[groupName].push(item);
    } else {
        menuSecond.value.menu[groupName][index] = item;
    }
    isOpenSecond.value = false;
};

const removeSecond = (groupName, index) => {
    menuSecond.value.menu[groupName].splice(index, 1);
};

const menuSecondDisp = computed(() => {
    const { name, menu } = menuSecond.value;
    const newMenu = {};
    for (const [groupName, items] of Object.entries(menu)) {
        newMenu[groupName] = items.map(({ image, ...rest }) => rest);
    }
    return {
        name,
        menu: newMenu,
    };
});

const image = ref('');
const imageOpen = ref(false);
const openImage = (src) => {
    image.value = src;
    imageOpen.value = true;
};
const closeImage = () => {
    imageOpen.value = false;
};

//----- Step -----//
const step = ref(1);
const steps = 3;
const formRestore = () => ({
    name: '',
    age: 0,
    role: '',
    remarks: '',
});
const form = ref(formRestore());

const saveStep = () => {
};
</script>

<style scoped>
.slide-enter-active, .slide-leave-active {
  transition: transform 0.4s ease-in-out, opacity 0.4s ease-in-out;
}
.slide-enter-from {
  transform: translateX(100%);
  opacity: 0;
}
.slide-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}
</style>