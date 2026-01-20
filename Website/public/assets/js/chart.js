// chart.js - Handler untuk Chart.js dengan handling data kosong

/**
 * Chart instances storage
 */
const chartInstances = {};

/**
 * Chart color configurations
 */
const chartConfigs = {
    suhuudara: {
        color: '#FF8A00',
        label: 'Suhu Udara (°C)',
        yAxisLabel: 'Suhu Udara (°C)'
    },
    suhutanah: {
        color: '#E63946',
        label: 'Suhu Tanah (°C)',
        yAxisLabel: 'Suhu Tanah (°C)'
    },
    kelembapantanah: {
        color: '#0066FF',
        label: 'Kelembapan Tanah (%)',
        yAxisLabel: 'Kelembapan Tanah (%)'
    },
    kelembapanudara: {
        color: '#3B9EFF',
        label: 'Kelembapan Udara (%)',
        yAxisLabel: 'Kelembapan Udara (%)'
    },
    cahaya: {
        color: '#FFB800',
        label: 'Cahaya (lux)',
        yAxisLabel: 'Cahaya (lux)'
    },
    ph: {
        color: '#9C27B0',
        label: 'pH Tanah',
        yAxisLabel: 'pH'
    }
};

/**
 * Initialize semua chart
 */
function initializeCharts() {
    Object.keys(chartConfigs).forEach(type => {
        const canvas = document.getElementById(`canvas-${type}`);
        if (canvas) {
            const ctx = canvas.getContext('2d');
            chartInstances[type] = createChart(ctx, type);
        }
    });
}

/**
 * Create single chart instance
 */
function createChart(ctx, type) {
    const config = chartConfigs[type];

    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: config.label,
                data: [],
                borderColor: config.color,
                backgroundColor: hexToRGBA(config.color, 0.1),
                tension: 0.4,
                fill: true,
                borderWidth: 2,
                pointRadius: 3,
                pointHoverRadius: 5,
                pointBackgroundColor: config.color,
                pointBorderColor: '#fff',
                pointBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: {
                        size: 13,
                        weight: 'bold'
                    },
                    bodyFont: {
                        size: 12
                    },
                    callbacks: {
                        title: function(tooltipItems) {
                            return tooltipItems[0].label;
                        },
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                label += context.parsed.y.toFixed(2);
                            }
                            return label;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            size: 11
                        },
                        maxRotation: 45,
                        minRotation: 0
                    }
                },
                y: {
                    beginAtZero: false,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)',
                        drawBorder: false
                    },
                    ticks: {
                        font: {
                            size: 11
                        },
                        padding: 8,
                        callback: function(value) {
                            return value.toFixed(1);
                        }
                    },
                    title: {
                        display: true,
                        text: config.yAxisLabel,
                        font: {
                            size: 12,
                            weight: 'bold'
                        },
                        padding: {
                            bottom: 10
                        }
                    }
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            }
        }
    });
}

/**
 * Update chart dengan data baru
 */
function updateChart(type, labels, data) {
    const chart = chartInstances[type];

    if (!chart) {
        console.error(`Chart ${type} not found`);
        return;
    }

    // Update data
    chart.data.labels = labels;
    chart.data.datasets[0].data = data;

    // Update chart
    chart.update('active');
}

/**
 * Show placeholder message on chart
 */
function showChartPlaceholder(type, message = 'Belum ada data untuk tanggal ini') {
    const container = document.getElementById(`chart-${type}`);
    if (!container) return;

    const canvas = document.getElementById(`canvas-${type}`);
    if (!canvas) return;

    // Hide canvas and show message
    canvas.style.display = 'none';

    let placeholderDiv = container.querySelector('.chart-placeholder');
    if (!placeholderDiv) {
        placeholderDiv = document.createElement('div');
        placeholderDiv.className = 'chart-placeholder';
        placeholderDiv.style.cssText = `
            display: flex;
            align-items: center;
            justify-content: center;
            height: 300px;
            color: #999;
            font-size: 14px;
            text-align: center;
            flex-direction: column;
            gap: 10px;
        `;
        container.appendChild(placeholderDiv);
    }

    placeholderDiv.innerHTML = `
<!--        img bs-->
        <p>${message}</p>
    `;
    placeholderDiv.style.display = 'flex';
}

/**
 * Hide placeholder and show chart
 */
function hideChartPlaceholder(type) {
    const container = document.getElementById(`chart-${type}`);
    if (!container) return;

    const canvas = document.getElementById(`canvas-${type}`);
    if (canvas) canvas.style.display = 'block';

    const placeholder = container.querySelector('.chart-placeholder');
    if (placeholder) placeholder.style.display = 'none';
}

/**
 * Update semua chart dengan data history
 */
function updateAllCharts(historyData) {
    if (!historyData) {
        console.warn('No history data available');
        Object.keys(chartConfigs).forEach(type => {
            showChartPlaceholder(type);
        });
        return;
    }

    Object.keys(historyData).forEach(type => {
        const sensorData = historyData[type];

        if (Array.isArray(sensorData) && sensorData.length > 0) {
            // Extract labels dan values dari data
            const labels = sensorData.map(item => formatTime(item.waktu || item.timestamp));
            const values = sensorData.map(item => item.nilai || item.value);

            hideChartPlaceholder(type);
            updateChart(type, labels, values);
        } else {
            // Show placeholder if no data
            showChartPlaceholder(type);
        }
    });
}

/**
 * Update chart berdasarkan tanggal yang dipilih
 */
async function updateChartsByDate(lahanId, date) {
    try {
        // Import function dari api.js
        const { getAllSensorHistory, showLoading, hideLoading, showError } = await import('./api.js');

        showLoading();
        const historyData = await getAllSensorHistory(lahanId, date);
        updateAllCharts(historyData);
        hideLoading();
    } catch (error) {
        console.error('Error updating charts:', error);
        hideLoading();

        // Show placeholder on all charts
        Object.keys(chartConfigs).forEach(type => {
            showChartPlaceholder(type, 'Gagal memuat data');
        });
    }
}

/**
 * Format waktu untuk label chart
 */
function formatTime(timeString) {
    if (!timeString) return '';
    const date = new Date(timeString);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
}

/**
 * Convert hex color to RGBA
 */
function hexToRGBA(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Destroy all chart instances
 */
function destroyAllCharts() {
    Object.keys(chartInstances).forEach(type => {
        if (chartInstances[type]) {
            chartInstances[type].destroy();
            delete chartInstances[type];
        }
    });
}

/**
 * Setup tab switching untuk charts
 */
function setupTabSwitching() {
    const tabs = document.querySelectorAll('.tab');
    const chartContainers = document.querySelectorAll('.chart-container');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs and containers
            tabs.forEach(t => t.classList.remove('active'));
            chartContainers.forEach(c => c.classList.remove('active'));

            // Add active class to clicked tab
            tab.classList.add('active');

            // Show corresponding chart
            const chartType = tab.dataset.chart;
            const chartContainer = document.getElementById(`chart-${chartType}`);
            if (chartContainer) {
                chartContainer.classList.add('active');
            }

            // Trigger chart update/resize
            const chart = chartInstances[chartType];
            if (chart) {
                chart.resize();
            }
        });
    });
}

/**
 * Setup date picker event
 */
function setupDatePicker(lahanId) {
    const dateInput = document.querySelector('.date-input');

    if (dateInput) {
        dateInput.addEventListener('change', (e) => {
            const selectedDate = e.target.value;
            updateChartsByDate(lahanId, selectedDate);
        });
    }
}

/**
 * Initialize chart module
 */
function initChartModule(lahanId, initialData = null) {
    // Initialize all charts
    initializeCharts();

    // Setup tab switching
    setupTabSwitching();

    // Setup date picker
    setupDatePicker(lahanId);

    // Load initial data
    if (initialData) {
        updateAllCharts(initialData);
    } else {
        // Show placeholder
        Object.keys(chartConfigs).forEach(type => {
            showChartPlaceholder(type);
        });
    }
    startChartAutoRefresh(lahanId, 60000);
}
let chartAutoRefreshTimer = null;

function startChartAutoRefresh(lahanId, intervalMs = 60000) {
    stopChartAutoRefresh();

    chartAutoRefreshTimer = setInterval(async () => {
        try {
            const { getAllSensorHistory } = await import('./api.js');

            const today = new Date().toISOString().split('T')[0];
            const historyData = await getAllSensorHistory(lahanId, today);

            updateAllCharts(historyData);
        } catch (err) {
            console.error('Auto refresh chart error:', err);
        }
    }, intervalMs);
}

function stopChartAutoRefresh() {
    if (chartAutoRefreshTimer) {
        clearInterval(chartAutoRefreshTimer);
        chartAutoRefreshTimer = null;
    }
}


// Export functions
export {
    initializeCharts,
    createChart,
    updateChart,
    updateAllCharts,
    updateChartsByDate,
    destroyAllCharts,
    setupTabSwitching,
    setupDatePicker,
    initChartModule,
    startChartAutoRefresh,
    stopChartAutoRefresh
};