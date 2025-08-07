#include <WiFiS3.h>
#include "secret.h"

WiFiUDP udp;
int PORT = 12345;
String myString;
String response = "ACK\n";

int sensorPin = A0;

void setup() {
  Serial.begin(9600);
  pinMode(sensorPin, INPUT);
  while (!Serial);
  Serial.print("Connecting to ");
  Serial.println(mySSID);
  WiFi.begin(mySSID, myPASS);
  while (WiFi.status() != WL_CONNECTED) {
    delay(100);
    Serial.print(".");
  }
  Serial.println("\nConnected to WiFi");
  Serial.println(WiFi.localIP());
  udp.begin(PORT);
  Serial.print("UDP Server started on port ");
  Serial.println(PORT);
}

void loop() {
  if (udp.parsePacket()) {
    myString = udp.readStringUntil('\n');
    myString.trim(); 

    // Check received command
    if (myString == "moisture") {
      int waterLevel = readWater();
      String waterMsg = "Water Level: " + String(waterLevel) + " %";
      Serial.println(waterMsg);

      udp.beginPacket(udp.remoteIP(), udp.remotePort());
      udp.print(waterMsg + "\n"); 
      udp.endPacket();
    }
  }
}

int readWater() {
  int totalReading = 0;
  const int numReadings = 20;
  for (int i = 0; i < numReadings; i++) {
    totalReading += analogRead(sensorPin);
    delay(10);  
  }
  float averageReading = totalReading / (float)numReadings;
  float finalWaterLevel = (averageReading - 1023.) / -7.23;
  return (int)finalWaterLevel;  
}

