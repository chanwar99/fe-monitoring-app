<template>
    <div class="container mx-auto py-8 px-4 md:px-0">
        <div class="flex mb-4">
            <h2 class="text-3xl font-bold mb-2 flex-1">Admin Dashboard</h2>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Total Reports -->
            <div class="stats shadow col-span-1 md:col-span-2 xl:col-span-4 bg-blue-100">
                <div class="stat place-items-center">
                    <div class="stat-title text-xl text-gray-700">Total Laporan</div>
                    <div class="stat-value text-8xl text-blue-600">{{ dashboards.total_reports }}</div>
                    <div class="stat-desc text-gray-500">Total laporan yang masuk</div>
                </div>
            </div>

            <!-- Recipients Per Program Chart (Pie) -->
            <div class="mb-8">
                <h3 class="text-md font-semibold mb-4 text-center">Jumlah penerima bantuan per program</h3>
                <PieChart :chart-data="recipientsPerProgramData" />
            </div>

            <!-- Distribution Per Region Chart (Horizontal Bar) -->
            <div class="mb-8">
                <h3 class="text-md font-semibold mb-4 text-center">Penyaluran bantuan per wilayah</h3>
                <HorizontalBarChart :chart-data="distributionPerRegionData" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useDashboardStore } from '@/stores/DashboardStore';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import PieChart from '@/components/PieChart.vue'; // Komponen untuk grafik pie
import HorizontalBarChart from '@/components/HorizontalBarChart.vue'; // Komponen untuk grafik batang horizontal

const dashboardStore = useDashboardStore();
const dashboards = ref({});

const recipientsPerProgramData = ref({
    labels: [],
    datasets: [{
        label: 'Penerima',
        data: [],
        backgroundColor: ['#4caf50', '#ff9800', '#f44336', '#2196f3', '#9c27b0'],
    }]
});

const distributionPerRegionData = ref({
    labels: [],
    datasets: [{
        label: 'Penerima',
        data: [],
        backgroundColor: '#2196f3',
    }]
});

const fetchDashboard = async () => {
    try {
        NProgress.start();
        await dashboardStore.fetchDashboards();
        dashboards.value = dashboardStore.dashboards;

        // Generate data for charts
        recipientsPerProgramData.value.labels = dashboards.value.recipients_per_program.map(program => program.program_name);
        recipientsPerProgramData.value.datasets[0].data = dashboards.value.recipients_per_program.map(program => program.total_recipients);

        distributionPerRegionData.value.labels = dashboards.value.distribution_per_region.map(region => `${region.provinsi}, ${region.kabupaten}`);
        distributionPerRegionData.value.datasets[0].data = dashboards.value.distribution_per_region.map(region => region.total_recipients);
    } catch (error) {
        console.error('Failed to load dashboard:', error);
    } finally {
        NProgress.done();
    }
};

onMounted(() => {
    fetchDashboard();
});
</script>
