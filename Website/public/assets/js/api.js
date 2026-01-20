// api.js - Handler untuk fetch data dari API 

const API_BASE_URL = '/api';

/**
 * Utility function untuk fetch dengan error handling
 */
async function fetchAPI(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
}

/**
 * Get detail lahan berdasarkan ID
 */
async function getDetailLahan(lahanId) {
    return await fetchAPI(`/lahan/${lahanId}`);
}

/**
 * Get data sensor terbaru dari lahan
 */
async function getSensorData(lahanId) {
    return await fetchAPI(`/lahan/${lahanId}/sensor/latest`);
}

/**
 * Get data historis sensor untuk grafik
 */
async function getSensorHistory(lahanId, sensorType, date) {
    const params = new URLSearchParams({
        type: sensorType,
        date: date
    });

    return await fetchAPI(`/lahan/${lahanId}/sensor/history?${params}`);
}

/**
 * Get semua data sensor history untuk semua tipe
 */
async function getAllSensorHistory(lahanId, date) {
    const sensorTypes = ['suhuudara', 'suhutanah', 'kelembapantanah', 'kelembapanudara', 'cahaya', 'ph'];

    try {
        const promises = sensorTypes.map(type =>
            getSensorHistory(lahanId, type, date)
                .then(response => response.data || response)
                .catch(err => {
                    console.warn(`Failed to fetch ${type}:`, err);
                    return []; // Return array kosong kalo eror
                })
        );

        const results = await Promise.all(promises);

        return {
            suhuudara: results[0],
            suhutanah: results[1],
            kelembapantanah: results[2],
            kelembapanudara: results[3],
            cahaya: results[4],
            ph: results[5]
        };
    } catch (error) {
        console.error('Error getting sensor history:', error);
        // Return struktur data kosong kalau eror
        return {
            suhuudara: [],
            suhutanah: [],
            kelembapantanah: [],
            kelembapanudara: [],
            cahaya: [],
            ph: []
        };
    }
}

/**
 * Load semua data yang dibutuhkan saat halaman dimuat
 */
async function loadPageData(lahanId) {
    try {
        const today = new Date().toISOString().split('T')[0];

        // Fetch data secara parallel dengan error handling
        const [lahanDetail, sensorLatest, sensorHistory] = await Promise.all([
            getDetailLahan(lahanId).catch(err => {
                console.error('Error loading lahan:', err);
                return null;
            }),
            getSensorData(lahanId).catch(err => {
                console.error('Error loading sensor:', err);
                return { data: null };
            }),
            getAllSensorHistory(lahanId, today)
        ]);

        return {
            lahan: lahanDetail,
            sensor: sensorLatest,
            history: sensorHistory
        };
    } catch (error) {
        console.error('Error loading page data:', error);
        throw error;
    }
}



/**
 * Update display dengan data sensor
 */
function updateSensorDisplay(sensorData, jenisLahan) {
    if (!sensorData) {
        console.warn('No sensor data available');
        showPlaceholderData();
        return;
    }

    const metrics = {
        'temp-udara': {
            value: sensorData.suhuudara,
            unit: '°C',
            field: 'suhuudara'
        },
        'temp-tanah': {
            value: sensorData.suhutanah,
            unit: '°C',
            field: 'suhutanah'
        },
        'hum-tanah': {
            value: sensorData.kelembapantanah,
            unit: '%',
            field: 'kelembapantanah'
        },
        'hum-udara': {
            value: sensorData.kelembapanudara,
            unit: '%',
            field: 'kelembapanudara'
        },
        'cahaya': {
            value: sensorData.cahaya,
            unit: 'lux',
            field: 'cahaya'
        },
        'ph': {
            value: sensorData.ph,
            unit: '',
            field: 'ph'
        }
    };

    Object.keys(metrics).forEach(key => {
        const metric = metrics[key];
        const valueEl = document.querySelector(`.${key} .metric-value`);
        const statusEl = document.querySelector(`.${key} .metric-status`);

        if (valueEl) {
            valueEl.textContent =
                metric.value !== null && metric.value !== undefined
                    ? `${metric.value}${metric.unit}`
                    : '-';
        }

        if (statusEl && metric.value !== undefined && metric.value !== null) {
            updateMetricStatus(statusEl, metric.field, metric.value, jenisLahan);
        }
    });
}

/**
 * Show placeholder data kalo ga ada sensor 
 */
function showPlaceholderData() {
    const metricCards = document.querySelectorAll('.metric-card');

    metricCards.forEach(card => {
        const valueEl = card.querySelector('.metric-value');
        const statusEl = card.querySelector('.metric-status');

        if (valueEl) {
            valueEl.innerHTML = '<span style="color: #999;">--</span>';
        }
        if (statusEl) {
            statusEl.textContent = 'Belum ada data';
            statusEl.style.color = '#999';
        }
    });
}

/**
 * Get jenis lahan berdasarkan nama
 */
async function getJenisLahanByNama(nama) {
    return await fetchAPI(`/jenislahan/${encodeURIComponent(nama)}`);
}

/**
 * Update status sensor individual
 */
function updateMetricStatus(statusEl, field, value, jenisLahan) {
    if (!jenisLahan) {
        statusEl.textContent = 'Unknown';
        statusEl.style.color = '#999';
        return;
    }

    const ranges = {
        suhuudara: [jenisLahan.suhuudaramin, jenisLahan.suhuudaramax],
        suhutanah: [jenisLahan.suhutanahmin, jenisLahan.suhutanahmax],
        kelembapantanah: [jenisLahan.kelembapantanahmin, jenisLahan.kelembapantanahmax],
        kelembapanudara: [jenisLahan.kelembapanudaramin, jenisLahan.kelembapanudaramax],
        cahaya: [jenisLahan.cahayamin, jenisLahan.cahayamax],
        ph: [jenisLahan.phmin, jenisLahan.phmax]
    };

    const [min, max] = ranges[field] || [];

    let status = 'Normal';
    let color = '#00A642';

    if (min !== undefined && max !== undefined) {
        if (value < min || value > max) {
            status = 'Peringatan';
            color = '#FF8A00';
        }
    }

    statusEl.textContent = status;
    statusEl.style.color = color;
}


/**
 * Update display dengan info lahan
 */
function updateLahanDisplay(lahanData) {
    if (!lahanData) {
        console.warn('No lahan data available');
        return;
    }

    const data = lahanData.data || lahanData;

    const h1 = document.querySelector('.header-card h1');
    if (h1) {
        h1.innerHTML = `<i class="ph-fill ph-map-pin"></i> ${data.namapemilik || 'Lahan'}`;
    }

    const headerInfo = document.querySelector('.header-info');
    if (headerInfo) {
        headerInfo.innerHTML = `
            <div class="info-item">
                <i class="ph ph-map-trifold"></i>
                <span>Alamat: ${data.lokasi || '-'}</span>
            </div>
            <div class="info-item">
                <i class="ph ph-user"></i>
                <span>Luas: ${data.luas || '-'} m²</span>
            </div>
            <div class="info-item">
                <i class="ph ph-calendar"></i>
                <span>Jenis: ${data.jenis || '-'}</span>
            </div>
        `;
    }
}

/**
 * Show loading indicator
 */
function showLoading() {
    console.log('Loading...');
}

/**
 * Hide loading indicator
 */
function hideLoading() {
    console.log('Loading complete');
}

/**
 * Show error message
 */
function showError(message) {
    const errorContainer = document.createElement('div');
    errorContainer.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #ef4444;
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 9999;
        max-width: 400px;
        animation: slideIn 0.3s ease;
    `;
    errorContainer.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <i class="ph-fill ph-warning-circle" style="font-size: 24px;"></i>
            <div>
                <div style="font-weight: 600; margin-bottom: 4px;">Error</div>
                <div style="font-size: 14px;">${message}</div>
            </div>
        </div>
    `;

    document.body.appendChild(errorContainer);

    // Auto remove setelah 5 detik
    setTimeout(() => {
        errorContainer.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => errorContainer.remove(), 300);
    }, 5000);
}
// Export functions
export {
    getDetailLahan,
    getSensorData,
    getSensorHistory,
    getAllSensorHistory,
    loadPageData,
    updateSensorDisplay,
    updateLahanDisplay,
    showLoading,
    hideLoading,
    showError
};