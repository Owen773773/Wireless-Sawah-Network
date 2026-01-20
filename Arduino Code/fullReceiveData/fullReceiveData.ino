#include <SoftwareSerial.h>

SoftwareSerial XBee(10, 11);

String data = "";
bool started = false;

void setup() {
  Serial.begin(9600);
  XBee.begin(9600);
}

void loop() {
  while (XBee.available()) {
    char c = XBee.read();

    if (c == '<') {
      data = "";
      started = true;
    }
    else if (c == '>') {
      started = false;

      // find the index of comma
      int i1 = data.indexOf(',');

      // find the index of comma after i(1)+1 index, if i(1) doesnt +1, it will give the i1 index
      int i2 = data.indexOf(',', i1 + 1);
      int i3 = data.indexOf(',', i2 + 1);
      int i4 = data.indexOf(',', i3 + 1);
      int i5 = data.indexOf(',', i4 + 1);

      // read by using the substring from, to
      float suhuTanah = data.substring(0, i1).toFloat();
      int rhTanah = data.substring(i1 + 1, i2).toInt();
      float pH = data.substring(i2 + 1, i3).toFloat();
      int cahaya = data.substring(i3 + 1, i4).toInt();
      float suhuUdara = data.substring(i4 + 1, i5).toFloat();
      float rhUdara = data.substring(i5 + 1).toFloat();

      // Serial.println("=== DATA DITERIMA ===");
      // Serial.println("ID Sawah: 0");
      // Serial.print("Suhu Tanah : "); Serial.println(suhuTanah);
      // Serial.print("RH Tanah   : "); Serial.println(rhTanah);
      // Serial.print("pH Tanah   : "); Serial.println(pH);
      // Serial.print("Cahaya     : "); Serial.println(cahaya);
      // Serial.print("Suhu Udara : "); Serial.println(suhuUdara);
      // Serial.print("RH Udara   : "); Serial.println(rhUdara);
      // Serial.println();

      // The data will go through to the USB port
      // thats why, bima's program can read through COM3 USB PORT
      Serial.print(rhTanah);
      Serial.print(';');
      Serial.print(rhUdara);
      Serial.print(';');
      Serial.print(pH);
      Serial.print(';');
      Serial.print(suhuUdara);
      Serial.print(';');
      Serial.print(suhuTanah);
      Serial.print(';');
      Serial.println(cahaya);
    }
    else if (started) {
      data += c;
    }
  }
}
