#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include "config.example.h" // Rename this file to config.h and add your credentials

unsigned long previousMillis = 0;

void connectWiFi() {
  Serial.print("Connecting to WiFi");
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nConnected to WiFi!");
}

void setup() {
  Serial.begin(115200);
  
  // Initialize Sensor Pins
  pinMode(MOISTURE_PIN, INPUT);
  pinMode(TEMP_PIN, INPUT);
  pinMode(PH_PIN, INPUT);
  
  connectWiFi();
}

// Mock reading functions - replace with actual sensor library code
float readMoisture() {
  // Read analog value and map to percentage
  int raw = analogRead(MOISTURE_PIN);
  return map(raw, 4095, 0, 0, 100); 
}

float readTemperature() {
  // Placeholder for real temp logic
  return 25.5; 
}

float readPH() {
  // Placeholder for real pH logic
  return 6.5;
}

int readNitrogen() { return 40; }
int readPhosphorus() { return 30; }
int readPotassium() { return 35; }
float readEC() { return 1.2; }

void sendData() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(API_URL);
    http.addHeader("Content-Type", "application/json");
    http.addHeader("x-device-key", DEVICE_KEY);

    StaticJsonDocument<512> doc;
    doc["deviceId"] = DEVICE_ID;
    
    JsonObject readings = doc.createNestedObject("readings");
    readings["soilMoisture"] = readMoisture();
    readings["soilTemperature"] = readTemperature();
    readings["ph"] = readPH();
    readings["nitrogen"] = readNitrogen();
    readings["phosphorus"] = readPhosphorus();
    readings["potassium"] = readPotassium();
    readings["ec"] = readEC();

    String requestBody;
    serializeJson(doc, requestBody);
    
    Serial.println("Sending data: " + requestBody);

    int httpResponseCode = http.POST(requestBody);
    if (httpResponseCode > 0) {
      String response = http.getString();
      Serial.println(httpResponseCode);
      Serial.println(response);
    } else {
      Serial.print("Error on sending POST: ");
      Serial.println(httpResponseCode);
    }
    
    http.end();
  } else {
    Serial.println("WiFi disconnected. Reconnecting...");
    connectWiFi();
  }
}

void loop() {
  unsigned long currentMillis = millis();
  
  if (currentMillis - previousMillis >= INTERVAL_MS) {
    previousMillis = currentMillis;
    sendData();
  }
}
