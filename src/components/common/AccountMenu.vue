<template>
    <div v-if="!isAuthenticated">
        <router-link :to="{ name: 'Login' }" class="btn btn-primary btn-sm">Login</router-link>
    </div>
    <div v-else class="dropdown dropdown-end">
        <div class="tooltip tooltip-left" :data-tip="'Hi ' + user?.name">
            <label tabindex="1" class="btn btn-ghost btn-circle avatar m-1">
                <div class="w-10 rounded-full">
                    <img alt="Tailwind CSS Navbar component"
                        src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                </div>
            </label>
        </div>
        <ul tabindex="1" class="dropdown-content menu p-2 shadow bg-gray-900 rounded-box w-52">
            <li><a @click="logout">Logout</a></li>
        </ul>
    </div>
</template>
<script setup>
import { computed } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { useRouter, useRoute } from 'vue-router';

import { useNotification } from '@kyvg/vue3-notification';
const { notify } = useNotification(); // Import the notification function

const authStore = useAuthStore();
const isAuthenticated = computed(() => !!authStore.token);
const user = computed(() => authStore.user);

const router = useRouter();
const route = useRoute();



const logout = async () => {
    const isConfirmed = window.confirm('Are you sure you want to logout?');

    if (!isConfirmed) {
        return;
    }

    try {
        const response = await authStore.logout();
        notify({
            title: 'Success',
            text: response.message,
            type: 'success',
            group: 'default',
            duration: 3000,
        });
        router.push({ name: 'Login' });
    } catch (error) { }
};
</script>