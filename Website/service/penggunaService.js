import * as penggunaRepo from "../repository/penggunaRepo.js";

export async function getAllPengguna() {
  return await penggunaRepo.getAllPengguna();
}

// isi datanya username, password, tipeakun
// tipeakun itu admin atau penyuluh, case sensitive soalnya enum
export async function simpanPengguna(data) {
  return await penggunaRepo.simpanPengguna(data);
}

// param = id pengguna
export async function getPenggunaById(id) {
  return await penggunaRepo.getPenggunaById(id);
}

export async function editPengguna(id, data) {
  return await penggunaRepo.editPengguna(id, data);
}

export async function deletePengguna(id) {
  return await penggunaRepo.deletePengguna(id);
}
