<template>
    <div>
        <canvas ref="chartCanvas" width="500" height="400"></canvas>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const props = defineProps({
    chartData: {
        type: Object,
        required: true
    }
});

const chartCanvas = ref(null);
let chartInstance = null;

const renderChart = () => {
    if (chartInstance) chartInstance.destroy();
    chartInstance = new Chart(chartCanvas.value, {
        type: 'bar',
        data: props.chartData,
        options: {
            responsive: true,
            indexAxis: 'y', // Membuat grafik horizontal
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    beginAtZero: true
                }
            }
        }
    });
};

onMounted(renderChart);

watch(() => props.chartData, renderChart, { deep: true });
</script>

<style scoped>
canvas {
    max-height: 500px;
    margin: auto;
}
</style>
