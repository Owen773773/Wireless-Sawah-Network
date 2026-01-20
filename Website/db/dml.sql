-- =========================
-- INSERT: Pengguna
-- =========================
INSERT INTO Pengguna (username, password, tipeAkun, email, noTelepon) VALUES
                                                        ('admin1', 'admin123', 'admin', 'admin1@gmail.com', '01234567890'),
                                                        ('admin2', 'admin123', 'admin', 'admin2@gmail.com', '01234567891'),
                                                        ('penyuluh_andi', 'andi123', 'penyuluh', 'andi@gmail.com', '01234567892'),
                                                        ('penyuluh_budi', 'budi123', 'penyuluh','budi@gmail.com', '01234567893'),
                                                        ('penyuluh_siti', 'siti123', 'penyuluh', 'siti@gmail.com', '01234567894');

-- =========================
-- INSERT: JenisLahan (dengan 6 sensor)
-- =========================
INSERT INTO JenisLahan (
    jenis,
    phMin, phMax,
    suhuUdaraMin, suhuUdaraMax,
    suhuTanahMin, suhuTanahMax,
    kelembapanTanahMin, kelembapanTanahMax,
    kelembapanUdaraMin, kelembapanUdaraMax,
    cahayaMin, cahayaMax
) VALUES
-- Sawah Irigasi
('Sawah Irigasi',
 6.0, 7.0,
 28, 32,
 26, 30,
 65, 75,
 70, 80,
 800, 900),

-- Sawah Tadah Hujan
('Sawah Tadah Hujan',
 5.5, 6.5,
 30, 34,
 28, 32,
 60, 70,
 65, 75,
 850, 950),

-- Sawah Organik
('Sawah Organik',
 6.5, 7.2,
 27, 31,
 25, 29,
 70, 80,
 75, 85,
 750, 850),

-- Sawah Pasang Surut
('Sawah Pasang Surut',
 5.5, 6.2,
 29, 33,
 27, 31,
 65, 72,
 70, 78,
 850, 920);

-- =========================
-- INSERT: Sawah
-- =========================
INSERT INTO Sawah (namaSawah, luas, lokasi, namaPemilik, jenis, idPengguna) VALUES
                                                                     ('Sawah A', 1.2, 'Desa Sukamaju, Jawa Barat', 'Pak Jaya', 'Sawah Irigasi', 3),
                                                                     ('Sawah B', 0.8, 'Desa Sukamaju, Jawa Barat', 'Pak Udin', 'Sawah Tadah Hujan', 3),
                                                                     ('Sawah C', 2.0, 'Desa Makmur, Jawa Tengah', 'Bu Siti', 'Sawah Organik', 4),
                                                                     ('Sawah D', 1.5, 'Desa Makmur, Jawa Tengah', 'Pak Budi', 'Sawah Irigasi', 4),
                                                                     ('Sawah E', 3.0, 'Desa Tani Sejahtera, Jawa Timur', 'Pak Slamet', 'Sawah Pasang Surut', 5),
                                                                     ('Sawah F', 2.3, 'Desa Tani Sejahtera, Jawa Timur', 'Bu Rina', 'Sawah Organik', 5),
                                                                     ('Sawah G', 1.0, 'Desa Harapan, Sumatera Selatan', 'Pak Darto', 'Sawah Pasang Surut', 3),
                                                                     ('Sawah H', 1.8, 'Desa Harapan, Sumatera Selatan', 'Bu Lina', 'Sawah Tadah Hujan', 4);

-- =========================
-- INSERT: DataSensor (6 sensor: suhuUdara, suhuTanah, kelembapanTanah, kelembapanUdara, cahaya, ph)
-- =========================

-- Sawah 1: Pak Jaya (Sawah Irigasi)
INSERT INTO DataSensor (suhuUdara, suhuTanah, kelembapanTanah, kelembapanUdara, cahaya, ph, idSawah) VALUES
                                                                                                         (30.5, 28.5, 72, 75, 850, 6.4, 1),
                                                                                                         (31.0, 29.0, 70, 76, 845, 6.5, 1),
                                                                                                         (29.8, 27.8, 74, 74, 855, 6.6, 1),
                                                                                                         (30.2, 28.2, 71, 75, 850, 6.5, 1);

-- Sawah 2: Pak Udin (Sawah Tadah Hujan)
INSERT INTO DataSensor (suhuUdara, suhuTanah, kelembapanTanah, kelembapanUdara, cahaya, ph, idSawah) VALUES
                                                                                                         (32.1, 30.1, 65, 70, 900, 6.0, 2),
                                                                                                         (33.0, 31.0, 63, 69, 910, 5.9, 2),
                                                                                                         (31.5, 29.5, 66, 71, 895, 6.1, 2),
                                                                                                         (32.3, 30.3, 64, 70, 905, 6.0, 2);

-- Sawah 3: Bu Siti (Sawah Organik)
INSERT INTO DataSensor (suhuUdara, suhuTanah, kelembapanTanah, kelembapanUdara, cahaya, ph, idSawah) VALUES
                                                                                                         (28.8, 26.8, 76, 80, 800, 6.9, 3),
                                                                                                         (29.1, 27.1, 75, 81, 795, 6.8, 3),
                                                                                                         (28.5, 26.5, 77, 79, 805, 6.7, 3),
                                                                                                         (29.0, 27.0, 76, 80, 800, 6.8, 3);

-- Sawah 4: Pak Budi (Sawah Irigasi)
INSERT INTO DataSensor (suhuUdara, suhuTanah, kelembapanTanah, kelembapanUdara, cahaya, ph, idSawah) VALUES
                                                                                                         (30.9, 28.9, 69, 74, 860, 6.5, 4),
                                                                                                         (31.2, 29.2, 68, 73, 855, 6.4, 4),
                                                                                                         (30.7, 28.7, 70, 75, 865, 6.6, 4),
                                                                                                         (31.0, 29.0, 69, 74, 860, 6.5, 4);

-- Sawah 5: Pak Slamet (Sawah Pasang Surut)
INSERT INTO DataSensor (suhuUdara, suhuTanah, kelembapanTanah, kelembapanUdara, cahaya, ph, idSawah) VALUES
                                                                                                         (31.8, 29.8, 67, 72, 880, 5.7, 5),
                                                                                                         (32.2, 30.2, 68, 71, 885, 5.8, 5),
                                                                                                         (31.5, 29.5, 69, 73, 875, 5.9, 5),
                                                                                                         (32.0, 30.0, 68, 72, 880, 5.8, 5);

-- Sawah 6: Bu Rina (Sawah Organik)
INSERT INTO DataSensor (suhuUdara, suhuTanah, kelembapanTanah, kelembapanUdara, cahaya, ph, idSawah) VALUES
                                                                                                         (29.2, 27.2, 75, 80, 805, 6.8, 6),
                                                                                                         (29.5, 27.5, 76, 81, 800, 6.9, 6),
                                                                                                         (28.9, 26.9, 74, 79, 810, 6.7, 6),
                                                                                                         (29.3, 27.3, 75, 80, 805, 6.8, 6);

-- Sawah 7: Pak Darto (Sawah Pasang Surut)
INSERT INTO DataSensor (suhuUdara, suhuTanah, kelembapanTanah, kelembapanUdara, cahaya, ph, idSawah) VALUES
                                                                                                         (32.5, 30.5, 66, 71, 890, 5.8, 7),
                                                                                                         (32.1, 30.1, 65, 70, 885, 5.7, 7),
                                                                                                         (31.8, 29.8, 67, 72, 895, 5.9, 7),
                                                                                                         (32.3, 30.3, 66, 71, 890, 5.8, 7);

-- Sawah 8: Bu Lina (Sawah Tadah Hujan)
INSERT INTO DataSensor (suhuUdara, suhuTanah, kelembapanTanah, kelembapanUdara, cahaya, ph, idSawah) VALUES
                                                                                                         (31.7, 29.7, 64, 69, 905, 6.0, 8),
                                                                                                         (31.9, 29.9, 65, 70, 900, 6.1, 8),
                                                                                                         (31.5, 29.5, 63, 68, 910, 5.9, 8),
                                                                                                         (31.8, 29.8, 64, 69, 905, 6.0, 8);