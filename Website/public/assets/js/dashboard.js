// dashboard.js - Script untuk DashboardUser.html (List Lahan)


async function loadLahanData() {
    try {
        showLoading();
        const response = await fetch('/api/lahan');
        const result = await response.json();

        if (result.success && result.data) {
            renderLahanCards(result.data);
        } else {
            showError('Gagal memuat data lahan');
        }

        hideLoading();
    } catch (error) {
        console.error('Error loading lahan:', error);
        hideLoading();
        showError('Gagal memuat data lahan');
    }
}


function renderLahanCards(lahanList) {
    const cardGrid = document.querySelector('.card-grid');

    if (!cardGrid) {
        console.error('Card grid not found');
        return;
    }

    if (lahanList.length === 0) {
        cardGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: #666;">
                <i class="ph-fill ph-plant" style="font-size: 64px; color: #ddd; margin-bottom: 16px;"></i>
                <p style="font-size: 18px; margin: 0;">Belum ada data lahan</p>
                <p style="font-size: 14px; color: #999; margin-top: 8px;">Hubungi admin untuk menambahkan lahan</p>
            </div>
        `;
        return;
    }

    cardGrid.innerHTML = lahanList.map(lahan => createLahanCard(lahan)).join('');

    // Load sensor data untuk setiap lahan
    lahanList.forEach(lahan => {
        loadSensorData(lahan.idsawah);
    });
}


function createLahanCard(lahan) {
    const lahanId = lahan.idsawah;
    const namaPemilik = lahan.namapemilik;
    const lokasi = lahan.lokasi;

    return `
        <div class="card" onclick="goToDetail(${lahanId})">
            <div class="card-header">
                <div class="card-title">
                    <i class="ph-fill ph-map-pin"></i>
                    <h3>${namaPemilik || 'Lahan ' + lahanId}</h3>
                </div>
                <div class="card-subtitle">
                    <i class="ph ph-map-trifold"></i>
                    <span>${lokasi || 'Lokasi tidak tersedia'}</span>
                </div>
            </div>
            <div class="card-body">
                <div class="metric-box temp-udara">
                    <div class="icon-wrap"><i class="ph-fill ph-thermometer-simple"></i></div>
                    <div class="metric-info">
                        <span class="label">Suhu Udara</span>
                        <span class="value" id="suhuudara-${lahanId}">
                            <span class="loading-text">Memuat...</span>
                        </span>
                    </div>
                </div>
                <div class="metric-box temp-tanah">
                    <div class="icon-wrap"><i class="ph-fill ph-thermometer"></i></div>
                    <div class="metric-info">
                        <span class="label">Suhu Tanah</span>
                        <span class="value" id="suhutanah-${lahanId}">
                            <span class="loading-text">Memuat...</span>
                        </span>
                    </div>
                </div>
                <div class="metric-box hum-tanah">
                    <div class="icon-wrap"><i class="ph-fill ph-drop"></i></div>
                    <div class="metric-info">
                        <span class="label">Kelembapan Tanah</span>
                        <span class="value" id="kelemtanah-${lahanId}">
                            <span class="loading-text">Memuat...</span>
                        </span>
                    </div>
                </div>
                <div class="metric-box hum-udara">
                    <div class="icon-wrap"><i class="ph-fill ph-droplet"></i></div>
                    <div class="metric-info">
                        <span class="label">Kelembapan Udara</span>
                        <span class="value" id="kelemudara-${lahanId}">
                            <span class="loading-text">Memuat...</span>
                        </span>
                    </div>
                </div>
                <div class="metric-box cahaya">
                    <div class="icon-wrap"><i class="ph-fill ph-sun"></i></div>
                    <div class="metric-info">
                        <span class="label">Cahaya</span>
                        <span class="value" id="cahaya-${lahanId}">
                            <span class="loading-text">Memuat...</span>
                        </span>
                    </div>
                </div>
                <div class="metric-box ph">
                    <div class="icon-wrap"><i class="ph-fill ph-flask"></i></div>
                    <div class="metric-info">
                        <span class="label">pH Tanah</span>
                        <span class="value" id="ph-${lahanId}">
                            <span class="loading-text">Memuat...</span>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * ========== LOAD SENSOR DATA ==========
 */
async function loadSensorData(lahanId) {
    try {
        const response = await fetch(`/api/lahan/${lahanId}/sensor/latest`);
        const result = await response.json();

        if (result.success && result.data) {
            console.log("Berhasil 1");
            updateSensorDisplay(lahanId, result.data);
        } else {
            updateSensorDisplay(lahanId, null);
        }
    } catch (error) {
        console.log("Berhasil 2");
        console.error(`Error loading sensor for lahan ${lahanId}:`, error);
        updateSensorDisplay(lahanId, null);
    }
}

/**
 * ========== UPDATE SENSOR DISPLAY ==========
 */
function updateSensorDisplay(lahanId, sensorData) {
    const suhuUdaraEl = document.getElementById(`suhuudara-${lahanId}`);
    const suhuTanahEl = document.getElementById(`suhutanah-${lahanId}`);
    const kelemTanahEl = document.getElementById(`kelemtanah-${lahanId}`);
    const kelemUdaraEl = document.getElementById(`kelemudara-${lahanId}`);
    const cahayaEl = document.getElementById(`cahaya-${lahanId}`);
    const phEl = document.getElementById(`ph-${lahanId}`);

    if (sensorData) {
        if (suhuUdaraEl) suhuUdaraEl.textContent = sensorData.suhuudara ? `${sensorData.suhuudara}°C` : '-- °C';
        if (suhuTanahEl) suhuTanahEl.textContent = sensorData.suhutanah ? `${sensorData.suhutanah}°C` : '-- °C';
        if (kelemTanahEl) kelemTanahEl.textContent = sensorData.kelembapantanah ? `${sensorData.kelembapantanah}%` : '-- %';
        if (kelemUdaraEl) kelemUdaraEl.textContent = sensorData.kelembapanudara ? `${sensorData.kelembapanudara}%` : '-- %';
        if (cahayaEl) cahayaEl.textContent = sensorData.cahaya ? `${sensorData.cahaya} lux` : '-- lux';
        if (phEl) phEl.textContent = sensorData.ph || '--';
    } else {
        // Data tidak tersedia
        if (suhuUdaraEl) suhuUdaraEl.innerHTML = '<span style="color: #999;">-- °C</span>';
        if (suhuTanahEl) suhuTanahEl.innerHTML = '<span style="color: #999;">-- °C</span>';
        if (kelemTanahEl) kelemTanahEl.innerHTML = '<span style="color: #999;">-- %</span>';
        if (kelemUdaraEl) kelemUdaraEl.innerHTML = '<span style="color: #999;">-- %</span>';
        if (cahayaEl) cahayaEl.innerHTML = '<span style="color: #999;">-- lux</span>';
        if (phEl) phEl.innerHTML = '<span style="color: #999;">--</span>';
    }
}

/**
 * ========== GO TO DETAIL PAGE ==========
 */
function goToDetail(lahanId) {
    window.location.href = `/lahan/detail?id=${lahanId}`;
}
/**
 * ========== LOGOUT HANDLER ==========
 */
async function handleLogout(e) {
    e.preventDefault();

    if (confirm('Yakin ingin keluar?')) {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            window.location.href = '/login';
        } catch (error) {
            console.error('Logout error:', error);
            window.location.href = '/login';
        }
    }
}

/**
 * ========== LOADING INDICATOR ==========
 */
function showLoading() {
    const cardGrid = document.querySelector('.card-grid');
    if (cardGrid) {
        cardGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
                <div class="spinner" style="
                    width: 50px;
                    height: 50px;
                    border: 4px solid #f3f3f3;
                    border-top: 4px solid #00A642;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin: 0 auto 20px;
                "></div>
                <p style="color: #666;">Memuat data lahan...</p>
            </div>
            <style>
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>
        `;
    }
}

function hideLoading() {
    // Loading akan otomatis hilang saat card di-render
}


function showError(message) {
    const cardGrid = document.querySelector('.card-grid');
    if (cardGrid) {
        cardGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: #dc3545;">
                <i class="ph-fill ph-warning-circle" style="font-size: 64px; margin-bottom: 16px;"></i>
                <p style="font-size: 18px; margin: 0;">${message}</p>
                <button onclick="location.reload()" style="
                    margin-top: 20px;
                    padding: 10px 24px;
                    background: #00A642;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 14px;
                ">Coba Lagi</button>
            </div>
        `;
    }
}


function setupAutoRefresh() {
    // Refresh data sensor setiap 1 menit
    setInterval(() => {
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            const onclick = card.getAttribute('onclick');
            if (onclick) {
                const lahanId = onclick.match(/\d+/);
                if (lahanId) {
                    loadSensorData(parseInt(lahanId[0]));
                }
            }
        });
    }, 60000); // 60 seconds
}

async function initDashboard() {

    // Load lahan data
    await loadLahanData();

    // Setup logout button
    const logoutBtn = document.querySelector('.btn-logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    // Setup auto refresh (optional)
    setupAutoRefresh();
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDashboard);
} else {
    initDashboard();
}