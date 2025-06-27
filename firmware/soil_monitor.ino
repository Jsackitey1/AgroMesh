#include <Wire.h>
#include <Adafruit_Sensor.h>
#include <DHT.h>
#include <SoftwareSerial.h>
#include <LowPower.h>

// Pin Definitions
#define SOIL_MOISTURE_PIN A0
#define DHT_PIN 2
#define LIGHT_SENSOR_PIN A1
#define LORA_RX 3
#define LORA_TX 4

// Sensor Types
#define DHT_TYPE DHT22

// Initialize sensors
DHT dht(DHT_PIN, DHT_TYPE);
SoftwareSerial loraSerial(LORA_RX, LORA_TX);

// Sensor readings
struct SensorData {
  float soilMoisture;
  float temperature;
  float humidity;
  float lightLevel;
  unsigned long timestamp;
};

void setup() {
  Serial.begin(9600);
  loraSerial.begin(9600);
  
  // Initialize sensors
  dht.begin();
  pinMode(SOIL_MOISTURE_PIN, INPUT);
  pinMode(LIGHT_SENSOR_PIN, INPUT);
  
  Serial.println("AgroMesh Sensor Node v1.0");
  Serial.println("Initializing...");
}

void loop() {
  SensorData data = readSensors();
  transmitData(data);
  
  // Sleep for 15 minutes (113 loops of 8s)
  for(int i = 0; i < 113; i++) {
    LowPower.idle(SLEEP_8S, ADC_OFF, TIMER2_OFF, TIMER1_OFF, TIMER0_OFF, 
                  SPI_OFF, USART0_OFF, TWI_OFF);
  }
}

SensorData readSensors() {
  SensorData data;
  
  // Read soil moisture (0-1023, higher is drier)
  data.soilMoisture = analogRead(SOIL_MOISTURE_PIN);
  
  // Read temperature and humidity
  data.temperature = dht.readTemperature();
  data.humidity = dht.readHumidity();
  
  // Read light level
  data.lightLevel = analogRead(LIGHT_SENSOR_PIN);
  
  // Get timestamp
  data.timestamp = millis();
  
  return data;
}

void transmitData(SensorData data) {
  // Format data as JSON
  String jsonData = "{";
  jsonData += "\"soil_moisture\":" + String(data.soilMoisture) + ",";
  jsonData += "\"temperature\":" + String(data.temperature) + ",";
  jsonData += "\"humidity\":" + String(data.humidity) + ",";
  jsonData += "\"light_level\":" + String(data.lightLevel) + ",";
  jsonData += "\"timestamp\":" + String(data.timestamp);
  jsonData += "}";
  
  // Transmit via LoRa
  loraSerial.println(jsonData);
  
  // Also print to Serial for debugging
  Serial.println(jsonData);
} 