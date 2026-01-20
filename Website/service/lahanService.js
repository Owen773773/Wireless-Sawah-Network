import * as lahanRepo from "../repository/lahanRepo.js";

export async function getAllLahan() {
  return await lahanRepo.getAllLahan();
}

// isi datanya luad, lokasi, nama pemilik, jenis, idPengguna
export async function simpanLahan(data) {
  return await lahanRepo.simpanLahan(data);
}

// id = id lahan
export async function getLahanById(id) {
  return await lahanRepo.getLahanById(id);
}

export async function editLahan(id, data) {
  return await lahanRepo.editLahan(id, data);
}

export async function deleteLahan(id) {
  return await lahanRepo.deleteLahan(id);
}

// id = id penyuluh
export async function getLahanByPenyuluh(id) {
  return await lahanRepo.getLahanByPenyuluh(id);
}

// id = id lahan, jadi ngambil data sensor terbaru dari lahan dengan id sekian
export async function getLatestSensor(id) {
  return await lahanRepo.getLatestSensor(id);
}

export async function getSensorHistory(id, type, date) {
  return await lahanRepo.getSensorHistory(id, type, date);
}
