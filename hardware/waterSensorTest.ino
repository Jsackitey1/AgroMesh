int sensorPin = A0;

void setup() {
  pinMode(sensorPin,INPUT);
  Serial.begin(9600);
}

void loop() {
  Serial.begin(9600);
  Serial.print("Water Level: ");
  Serial.print(readWater());
  Serial.println(" %");
  delay(500);
}

int readWater(){
  int waterLevel = analogRead(sensorPin);
  float finalWaterLevel = ((float)waterLevel - 1023.)/-7.23;
  return finalWaterLevel;
}