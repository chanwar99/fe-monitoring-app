<template>
    <div class="flex justify-center items-center min-h-screen">
        <div class="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded">
            <h2 class="text-2xl font-bold text-center">Login</h2>
            <form @submit.prevent="handleSubmit">
                <div class="space-y-4">
                    <label class="block">
                        <span class="text-gray-400">Email</span>
                        <input v-model="userData.email" type="text" class="input input-bordered w-full mt-1" />
                        <span v-if="errors.email" class="text-red-500">{{ errors.email[0] }}</span>
                    </label>
                    <label class="block">
                        <span class="text-gray-400">Password</span>
                        <input v-model="userData.password" type="password" class="input input-bordered w-full mt-1" />
                        <span v-if="errors.password" class="text-red-500">{{ errors.password[0] }}</span>
                    </label>
                    <button type="submit" class="btn btn-primary w-full" :disabled="loading">Login</button>
                </div>
            </form>
            <div class="text-center">
                <p class="mb-2">Don't have an account?</p>
                <router-link :to="{ name: 'Register' }" class="btn btn-secondary btn-sm">Register</router-link>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'vue-router';
import { useNotification } from '@kyvg/vue3-notification';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';


const authStore = useAuthStore();
const router = useRouter();
const { notify } = useNotification(); // Import the notification function

const userData = ref({
    email: '',
    password: '',
});

const loading = ref(false);
const errors = ref({});

const handleSubmit = async () => {
    try {
        NProgress.start();
        const response = await authStore.login(userData.value);
        notify({
            title: 'Success',
            text: response.message,
            type: 'success',
            group: 'default',
            duration: 3000,
            // Tailwind & Daisy UI
        });
        router.push({ name: 'Home' });
    } catch (error) {
        notify({
            title: 'Error',
            text: error.message,
            type: 'error',
            group: 'default',
            duration: 3000,
        });
        errors.value = authStore.errors || {};
    } finally {
        NProgress.done();
    }
};

watch(() => authStore.loading, (newLoading) => {
    loading.value = newLoading;
});

watch(() => authStore.errors, (newErrors) => {
    errors.value = newErrors || {};
});
</script>
