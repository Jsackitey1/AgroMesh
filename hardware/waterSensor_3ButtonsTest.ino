#include <LiquidCrystal_I2C.h>
#include <WiFiS3.h>
#include "secret.h"

// Initialize the LCD screen
LiquidCrystal_I2C screen(0x27, 16, 2);

// WiFi and UDP setup
WiFiUDP udp;
int PORT = 12345;
String myString;
String response = "ACK\n";

// Pin definitions
int sensorPin = A0;
int backPin = 12;
int midPin = 11;
int forwardPin = 10;

// Global variables
int currentReadingIndex = 0;
bool readingsInitialized = false;
String sensorReadings[3]; // Array to hold sensor readings

void setup() {
  Serial.begin(9600);
  pinMode(sensorPin, INPUT);
  pinMode(backPin, INPUT_PULLUP);
  pinMode(midPin, INPUT_PULLUP);
  pinMode(forwardPin, INPUT_PULLUP);

  screen.init();
  screen.clear();
  screen.backlight();

  // === Welcome message loop ===
  String scrollText = "Place for Innovative Agriculture!!";

  while (digitalRead(midPin) == HIGH) { // Wait until mid button is pressed to start
    screen.setCursor(0, 0);
    screen.print("Welcome to AgroMesh!");

    for (int i = 0; i < scrollText.length() - 15; i++) {
      screen.setCursor(0, 2);
      screen.print(scrollText.substring(i, i + 16));
      delay(300);

      // Break loop immediately if button is pressed mid-scroll
      if (digitalRead(midPin) == LOW) break;
    }

    delay(500);
    screen.clear();
  }

  screen.clear();

  // ==== WiFi Connection Setup ====
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
  int backVal = digitalRead(backPin);
  int midVal = digitalRead(midPin);
  int forwardVal = digitalRead(forwardPin);

  // Handle mid button (initialize or re-initialize readings)
  // The '&& !readingsInitialized' check was removed to allow re-initialization.
  if (midVal == LOW) {
    delay(200); // Debounce delay
    initializeSensorReadings();
  }

  // Navigate with forward and back buttons
  if (readingsInitialized) {
    if (forwardVal == LOW) {
      delay(200); // Debounce delay
      currentReadingIndex = (currentReadingIndex + 1) % 3;
      display(sensorReadings[currentReadingIndex]);
    }

    if (backVal == LOW) {
      delay(200); // Debounce delay
      currentReadingIndex = (currentReadingIndex - 1 + 3) % 3;
      display(sensorReadings[currentReadingIndex]);
    }
  }

  // Handle UDP command
  if (udp.parsePacket()) {
    myString = udp.readStringUntil('\n');
    myString.trim();

    if (myString == "moisture") {
      int waterLevel = readWater();
      String waterMsg = "Water Level: " + String(waterLevel) + " %";
      Serial.println(waterMsg);
      display(waterMsg);

      udp.beginPacket(udp.remoteIP(), udp.remotePort());
      udp.print(waterMsg + "\n");
      udp.endPacket();
    }
  }
}

void initializeSensorReadings() {
  display("Initializing...");
  delay(1500);
  int waterLevel = readWater();

  // Get new readings
  sensorReadings[0] = "Moisture: " + String(waterLevel) + " %";
  sensorReadings[1] = "Temp: 26.4 C"; // This is still simulated
  sensorReadings[2] = "pH: 6.8";      // This is still simulated

  currentReadingIndex = 0;
  readingsInitialized = true; // Set flag to true to enable navigation

  display("Click Forward");
  delay(1500);
  display(sensorReadings[0]); // Display the first new reading
}

int readWater() {
  int totalReading = 0;
  const int numReadings = 20;
  for (int i = 0; i < numReadings; i++) {
    totalReading += analogRead(sensorPin);
    delay(10);
  }
  float averageReading = totalReading / (float)numReadings;
  // Convert the analog reading to a percentage
  float finalWaterLevel = (averageReading - 1023.) / -7.23;
  int level = (int)finalWaterLevel;
  level = constrain(level, 0, 100); // Ensure value is between 0 and 100
  return level;
}

void display(String message) {
  screen.clear();
  screen.setCursor(0, 0);
  screen.print(message);
}