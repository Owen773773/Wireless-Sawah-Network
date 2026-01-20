import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const login = (req, res) => {
  res.sendFile(path.join(__dirname, "../public/Login.html"));
};

export const dashboard = (req, res) => {
    // Cek tipe akun dan redirect ke dashboard yang sesuai
    if (req.session.tipeAkun === 'admin') {
        res.sendFile(path.join(__dirname, "../private/adminDashboardLahan.html"));
    } else {
        // Untuk penyuluh
        res.sendFile(path.join(__dirname, "../private/DashboardUser.html"));
    }
};

export const detailLahan = (req, res) => {
    res.sendFile(path.join(__dirname, "../private/DetailCard.html"));
};

export const adminPenggunaPage = (req, res) => {
    // Mengirim file HTML halaman Pengguna
    res.sendFile(path.join(__dirname, "../private/adminDashboardPengguna.html"));
};

