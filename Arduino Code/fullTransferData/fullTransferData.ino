#include <OneWire.h> // Komunikasi 1-wire untuk DS18B20
#include <DallasTemperature.h> // Sensor suhu tanah DS18B20
#include <SoftwareSerial.h> // Membuat port serial tambahan (untuk XBee)
#include <DHT.h> // Membaca DHT11 (suhu & kelembapan udara)

/**
DHT 11 dan DS18B20 butuh dijadikan objek karena mereka pakai digital protocol, sisanya pakai analog protocol

ANALOG PROTOCOL
hanya baca tegangan di pin tertentu

DIGITAL PROTOCOL
Mengirim data dalam bit digital
- Punya protokol
- Ada timing mikrodetik
- Ada checksum
- Ada command & response

Arduino work on DIGITAL PROTOCOL :
Arduino mengirim perintah -> menunggu -> membaca bit -> verifikasi (Checksum) -> decoding (library change the format from the hexa to Celcius or something that can be read)
*/

/*
  A little about SERIAL
  Arduino → USB → PC → Serial Monitor → You
*/

// ===== XBEE =====
SoftwareSerial XBee(10, 11); // RX, TX

// ===== DS18B20 =====
#define ONE_WIRE_BUS 4 // pin 4
OneWire oneWire(ONE_WIRE_BUS); // jalur data dengan pin 4
DallasTemperature sensors(&oneWire); // objek untuk baca suhu

// ===== SENSOR ANALOG =====
#define MOISTURE_PIN A15
#define PH_PIN A1
#define LIGHT_PIN A0

// ===== DHT11 =====
#define DHTPIN 6
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

void setup() {
  // Pengaktifan serial, xbee, dan sensor
  Serial.begin(9600);
  XBee.begin(9600);
  sensors.begin(); //objek sensor DS18B20
  dht.begin(); //objek sensor DHT11
}

void loop() {
  // ===== BACA SENSOR =====
  sensors.requestTemperatures(); // Minta sensor untuk ukur suhu
  float suhuTanah = sensors.getTempCByIndex(0); // Ambil suhu tanah (°C)

  // 1023 -> 0% kering
  // 950 -> 100% basah
  // int kelembapanTanah = analogRead(MOISTURE_PIN);
  float kelembapanTanah = map(analogRead(MOISTURE_PIN), 1023, 970, 0, 100); // Baca sensor (950–1023) -> Ubah ke persen (0-100%)
  
  //hasil bisa < 0% maka pakai constrain
  kelembapanTanah = constrain(kelembapanTanah, 0, 100);

  int adcPH = analogRead(PH_PIN);

  // Kalibrasi
  float m = -0.0136;
  float b = 16.030;

  float pHTanah = m * adcPH + b;

  // Batas nilai pH realistis
  if (pHTanah < 0) pHTanah = 0;
  if (pHTanah > 14) pHTanah = 14;

  // // 800 -> ph = 4
  // // 400 -> ph = 9
  // float pHTanah = map(analogRead(PH_PIN), 800, 400, 4, 9); // Ini mengubah sinyal pH menjadi angka 4–9
  // pHTanah = constrain(pHTanah, 0, 100); 

  int adcVal = analogRead(LIGHT_PIN);
  float cahaya = 0.00;

  if (adcVal > 0) {
    // Hitung Resistansi LDR dr ADC dan Resistor 10k
    float resistance = (10000.0 * (float)adcVal) / (1023.0 - (float)adcVal);

    // Kalibrasi ke Lux pakai Model Power GL5506
    // Rumus: Lux = 1.2e8 * R^-1.644
    cahaya = 120140000.0 * pow(resistance, -1.644);
  } else {
    cahaya = -1;
  }

  // Baca suhu dan kelembapan udara dari DHT11
  float suhuUdara = dht.readTemperature();
  float kelembapanUdara = dht.readHumidity();

  if (isnan(suhuUdara) || isnan(kelembapanUdara)) {
    suhuUdara = -1;
    kelembapanUdara = -1;
  }

  // ===== KIRIM DATA =====
  XBee.print('<');
  XBee.print(suhuTanah); XBee.print(',');
  XBee.print(kelembapanTanah); XBee.print(',');
  XBee.print(pHTanah); XBee.print(',');
  XBee.print(cahaya); XBee.print(',');
  XBee.print(suhuUdara); XBee.print(',');
  XBee.print(kelembapanUdara);
  XBee.println('>');

  // ===== DEBUG =====
  Serial.println("DATA TERKIRIM:");
  Serial.print("Suhu Tanah : "); Serial.println(suhuTanah);
  Serial.print("RH Tanah   : "); Serial.println(kelembapanTanah);
  Serial.print("pH Tanah   : "); Serial.println(pHTanah);
  Serial.print("Cahaya     : "); Serial.println(cahaya);
  Serial.print("Suhu Udara : "); Serial.println(suhuUdara);
  Serial.print("RH Udara   : "); Serial.println(kelembapanUdara);
  Serial.println();

  delay(2000);
}