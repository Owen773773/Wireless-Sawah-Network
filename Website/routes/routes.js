import express from "express";

import { protectRoute } from "../middleware/protectroute.js";

import * as pageController from "../controller/pageController.js";
import * as authController from "../controller/authController.js";
import * as penggunaController from "../controller/penggunaController.js";
import * as lahanController from "../controller/lahanController.js";
import * as jenisLahanController from "../controller/jenisLahanController.js";

const router = express.Router();

// PAGE CONTROLLER
router.get("/login", pageController.login);
router.get("/dashboard", protectRoute, pageController.dashboard);
router.get("/dashboardPengguna", protectRoute, pageController.adminPenggunaPage);

// API ENDPOINT
// AUTH
router.post("/api/auth/login", authController.login);
router.post("/api/auth/logout", authController.logout);

router.use(protectRoute);

// MANAJEMEN PENGGUNA OLEH ADMIN
//Ambil semua pengguna
router.get("/api/pengguna", penggunaController.getPengguna);
// Simpan pengguna baru 
router.post("/api/pengguna", penggunaController.simpanPengguna);

router.put("/api/pengguna/:id", penggunaController.editPengguna);
router.delete("/api/pengguna/:id", penggunaController.deletePengguna);
router.get("/api/pengguna/:id", penggunaController.getPenggunaById);



// MANAJEMEN LAHAN OLEH ADMIN
// Ambil semua lahan
router.get("/api/lahan", lahanController.getLahan);
// Simpan lahan baru 
router.post("/api/lahan", lahanController.simpanLahan);
// Edit lahan
router.put("/api/lahan/:id", lahanController.editLahan);
// Hapus lahan 
router.delete("/api/lahan/:id", lahanController.deleteLahan);

// LAHAN UNTUK PENYULUH
router.get("/api/lahan", lahanController.getLahanByPenyuluh);
router.get("/api/lahan/:id", lahanController.getLahanById);
router.get("/lahan/detail", protectRoute, pageController.detailLahan);

// DATA DARI SENSOR
// data sensor terbaru
router.get("/api/lahan/:id/sensor/latest", lahanController.getLatestSensor);

// data historis sensor
router.get("/api/lahan/:id/sensor/history", lahanController.getSensorHistory);

// semua role (admin & penyuluh)
router.get("/api/jenislahan", jenisLahanController.getAllJenisLahan);
router.get("/api/jenislahan/:nama", jenisLahanController.getJenisLahanByNama);

// khusus admin
router.post(
    "/api/admin/jenislahan/simpan",
    jenisLahanController.tambahJenisLahan
);


// ini temp doang, cuma buat testing session doang
router.get("/api/me", protectRoute, (req, res) => {
  res.json(req.user);
});

export default router;
