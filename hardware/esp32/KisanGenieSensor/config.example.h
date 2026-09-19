#ifndef CONFIG_H
#define CONFIG_H

// WiFi Configuration
const char* WIFI_SSID = "YOUR_WIFI_SSID";
const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";

// API Configuration
const char* API_URL = "http://YOUR_SERVER_IP:5000/api/iot/readings"; // Use IP address for local testing, e.g. 192.168.1.5

// Device Authentication
const char* DEVICE_ID = "KG-ESP32-001";
const char* DEVICE_KEY = "your-secure-device-key";

// Data Sending Interval
const unsigned long INTERVAL_MS = 60000; // 60 seconds

// GPIO Pins (Update according to your actual wiring)
#define MOISTURE_PIN 34
#define TEMP_PIN 35
#define PH_PIN 32
#define NPK_RX_PIN 16
#define NPK_TX_PIN 17

#endif // CONFIG_H
