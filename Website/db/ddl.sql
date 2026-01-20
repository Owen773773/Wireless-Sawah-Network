-- =========================
-- DROP TABLE (urutan aman)
-- =========================
DROP TABLE IF EXISTS DataSensor CASCADE;
DROP TABLE IF EXISTS Sawah CASCADE;
DROP TABLE IF EXISTS JenisLahan CASCADE;
DROP TABLE IF EXISTS Pengguna CASCADE;

-- DROP TYPE ENUM JIKA ADA
DROP TYPE IF EXISTS tipe_akun;

-- =========================
-- ENUM
-- =========================
CREATE TYPE tipe_akun AS ENUM (
    'admin',
    'penyuluh'
    );

-- =========================
-- TABLE: Pengguna
-- =========================
CREATE TABLE Pengguna (
                          idPengguna SERIAL PRIMARY KEY,
                          username VARCHAR(50) UNIQUE NOT NULL,
                          password VARCHAR(255) NOT NULL,
                          tipeAkun tipe_akun NOT NULL,
						  email VARCHAR(100) UNIQUE,
						  noTelepon VARCHAR(20) UNIQUE
);

-- =========================
-- TABLE: JenisLahan
-- =========================
CREATE TABLE JenisLahan (
                            jenis VARCHAR(50) PRIMARY KEY,
    -- pH Range
                            phMin DOUBLE PRECISION,
                            phMax DOUBLE PRECISION,
    -- Suhu Udara Range
                            suhuUdaraMin DOUBLE PRECISION,
                            suhuUdaraMax DOUBLE PRECISION,
    -- Suhu Tanah Range
                            suhuTanahMin DOUBLE PRECISION,
                            suhuTanahMax DOUBLE PRECISION,
    -- Kelembapan Tanah Range
                            kelembapanTanahMin DOUBLE PRECISION,
                            kelembapanTanahMax DOUBLE PRECISION,
    -- Kelembapan Udara Range
                            kelembapanUdaraMin DOUBLE PRECISION,
                            kelembapanUdaraMax DOUBLE PRECISION,
    -- Cahaya Range
                            cahayaMin DOUBLE PRECISION,
                            cahayaMax DOUBLE PRECISION
);

-- =========================
-- TABLE: Sawah
-- =========================
CREATE TABLE Sawah (
                       idSawah SERIAL PRIMARY KEY,
					   namaSawah VARCHAR(100) NOT NULL,
                       luas DOUBLE PRECISION NOT NULL,
                       lokasi VARCHAR(255) NOT NULL,
                       namaPemilik VARCHAR(100) NOT NULL,
                       tanggalDitambahkan DATE NOT NULL DEFAULT CURRENT_DATE,
                       jenis VARCHAR(50) NOT NULL,
                       idPengguna INT,
                       FOREIGN KEY (jenis) REFERENCES JenisLahan(jenis)
                           ON DELETE RESTRICT ON UPDATE CASCADE,
                       FOREIGN KEY (idPengguna) REFERENCES Pengguna(idPengguna)
                           ON DELETE SET NULL ON UPDATE CASCADE
);

-- =========================
-- TABLE: DataSensor (6 Sensor)
-- =========================
CREATE TABLE DataSensor (
                            idData SERIAL PRIMARY KEY,
                            suhuUdara DOUBLE PRECISION NOT NULL,
                            suhuTanah DOUBLE PRECISION NOT NULL,
                            kelembapanTanah DOUBLE PRECISION NOT NULL,
                            kelembapanUdara DOUBLE PRECISION NOT NULL,
                            cahaya DOUBLE PRECISION NOT NULL,
                            ph DOUBLE PRECISION NOT NULL,
                            timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                            idSawah INT NOT NULL,
                            FOREIGN KEY (idSawah) REFERENCES Sawah(idSawah)
                                ON DELETE CASCADE ON UPDATE CASCADE
);

-- =========================
-- INDEX
-- =========================
CREATE INDEX idx_sawah_jenis ON Sawah(jenis);
CREATE INDEX idx_sawah_pengguna ON Sawah(idPengguna);
CREATE INDEX idx_data_sawah ON DataSensor(idSawah);
CREATE INDEX idx_data_timestamp ON DataSensor(timestamp);
