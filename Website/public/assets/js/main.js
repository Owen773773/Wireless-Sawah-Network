// main.js - Main script untuk halaman detail lahan 

import {
    loadPageData,
    updateSensorDisplay,
    updateLahanDisplay,
    getSensorData,
    showLoading,
    hideLoading,
    showError
} from './api.js';

import {
    initChartModule,
    updateChartsByDate
} from './chart.js';

// Global variables
let currentLahanId = null;
let currentLahanData = null; // Simpan data lahan untuk cek status sensor

/**
 * Initialize page
 */
async function initPage() {
    try {
        // Get lahan ID dari URL parameter
        const urlParams = new URLSearchParams(window.location.search);
        currentLahanId = parseInt(urlParams.get('id'));

        if (!currentLahanId) {
            throw new Error('ID lahan tidak ditemukan');
        }

        showLoading();

        // Load all page data
        const pageData = await loadPageData(currentLahanId);

        console.log('Page data loaded:', pageData);

        // Update displays sekaligus handle null data 
        if (pageData.lahan) {
            currentLahanData = pageData.lahan; 
            updateLahanDisplay(pageData.lahan);
        }

        if (pageData.sensor && pageData.sensor.data) {
            updateSensorDisplay(pageData.sensor.data, currentLahanData);
        } else if (pageData.sensor) {
            updateSensorDisplay(pageData.sensor, currentLahanData);
        } else {
            updateSensorDisplay(null, currentLahanData);
        }

        // Initialize charts with history data
        initChartModule(currentLahanId, pageData.history);

        // Setup event listeners
        setupEventListeners();

        // Setup auto refresh
        setupAutoRefresh();

        hideLoading();

    } catch (error) {
        console.error('Error initializing page:', error);
        hideLoading();
        showError('Gagal memuat data halaman');
    }
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
    //  event pemilihan/perubahan tanggal
    const dateInput = document.querySelector('.date-input');
    if (dateInput) {
        // Set ke tanggal hari ini
        dateInput.valueAsDate = new Date();
        dateInput.addEventListener('change', handleDateChange);
    }
}

/**
 * Handle perubahan tanggal
 */
async function handleDateChange(e) {
    const selectedDate = e.target.value;

    try {
        showLoading();
        await updateChartsByDate(currentLahanId, selectedDate);
        hideLoading();
    } catch (error) {
        console.error('Error updating charts:', error);
        hideLoading();
        showError('Gagal memuat data grafik');
    }
}

/**
 * Setup auto refresh untuk data sensor
 * Refresh setiap 60 detik
 */
function setupAutoRefresh() {
    setInterval(async () => {
        try {
            const sensorData = await getSensorData(currentLahanId);
            updateSensorDisplay(sensorData.data || sensorData, currentLahanData);
        } catch (error) {
            console.error('Auto refresh error:', error);
        }
    }, 30000); // 30 seconds
}

/**
 * Show success message
 */
function showSuccess(message) {
    console.log('Success:', message);
}

/**
 * Refresh sensor data manual
 */
window.refreshSensorData = async function() {
    try {
        showLoading();
        const sensorData = await getSensorData(currentLahanId);
        updateSensorDisplay(sensorData.data || sensorData, currentLahanData);
        hideLoading();
        showSuccess('Data sensor berhasil diperbarui');
    } catch (error) {
        console.error('Error refreshing sensor data:', error);
        hideLoading();
        showError('Gagal memperbarui data sensor');
    }
}

/**
 * Refresh chart data manual
 */
window.refreshChartData = async function() {
    try {
        showLoading();

        const dateInput = document.querySelector('.date-input');
        const selectedDate = dateInput ? dateInput.value : new Date().toISOString().split('T')[0];

        await updateChartsByDate(currentLahanId, selectedDate);

        hideLoading();
        showSuccess('Data grafik berhasil diperbarui');

    } catch (error) {
        console.error('Error refreshing chart data:', error);
        hideLoading();
        showError('Gagal memperbarui data grafik');
    }
}

// Initialize page ketika DOM siap
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPage);
} else {
    initPage();
}

// Export initPage 
export {
    initPage
};