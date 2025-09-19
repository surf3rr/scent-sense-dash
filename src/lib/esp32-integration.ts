// ESP32 Integration Guide and Helper Functions
// This file provides the structure for ESP32 to send data to Firebase

import { writeSensorData, updateDeviceStatus } from './firebase';

// Example ESP32 Arduino code structure (for reference):
/*
#include <WiFi.h>
#include <FirebaseESP32.h>
#include <DHT.h>

// WiFi credentials
const char* ssid = "your-wifi-ssid";
const char* password = "your-wifi-password";

// Firebase config
#define FIREBASE_HOST "your-project-default-rtdb.firebaseio.com"
#define FIREBASE_AUTH "your-database-secret"

// Sensor pins
#define DHT_PIN 4
#define NH3_PIN A0
#define CH4_PIN A1

DHT dht(DHT_PIN, DHT22);
FirebaseData firebaseData;

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
  dht.begin();
}

void loop() {
  // Read sensors
  float temperature = dht.readTemperature();
  float humidity = dht.readHumidity();
  int nh3_raw = analogRead(NH3_PIN);
  int ch4_raw = analogRead(CH4_PIN);
  
  // Convert analog readings to ppm (calibration needed)
  float nh3_ppm = map(nh3_raw, 0, 1023, 0, 500);
  float ch4_ppm = map(ch4_raw, 0, 1023, 0, 2000);
  
  // Create JSON object
  FirebaseJson json;
  json.set("temperature", temperature);
  json.set("humidity", humidity);
  json.set("nh3", nh3_ppm);
  json.set("ch4", ch4_ppm);
  json.set("deviceId", "ESP32_001");
  
  // Send to Firebase
  Firebase.pushJSON(firebaseData, "/sensorData", json);
  
  // Update device status
  FirebaseJson statusJson;
  statusJson.set("isConnected", true);
  statusJson.set("deviceId", "ESP32_001");
  statusJson.set("alerts", "[]");
  Firebase.setJSON(firebaseData, "/deviceStatus/ESP32_001", statusJson);
  
  delay(30000); // Send data every 30 seconds
}
*/

// TypeScript interfaces for ESP32 data structure
export interface ESP32SensorData {
  temperature: number;
  humidity: number;
  nh3: number;
  ch4: number;
  deviceId: string;
}

export interface ESP32DeviceStatus {
  isConnected: boolean;
  deviceId: string;
  alerts: string[];
}

// Helper function to simulate ESP32 data (for testing)
export const simulateESP32Data = async () => {
  const mockData: ESP32SensorData = {
    temperature: 2 + Math.random() * 6, // 2-8°C range
    humidity: 85 + Math.random() * 15, // 85-100% range
    nh3: 10 + Math.random() * 90, // 10-100 ppm range
    ch4: 400 + Math.random() * 600, // 400-1000 ppm range
    deviceId: 'ESP32_SIMULATOR'
  };

  const mockStatus: ESP32DeviceStatus = {
    isConnected: true,
    deviceId: 'ESP32_SIMULATOR',
    alerts: []
  };

  try {
    await writeSensorData(mockData);
    await updateDeviceStatus(mockStatus);
    console.log('Simulated ESP32 data sent to Firebase');
  } catch (error) {
    console.error('Error sending simulated data:', error);
  }
};

// REST API endpoint structure for ESP32 HTTP requests
export const createESP32Endpoint = () => {
  // This would be implemented as a Firebase Cloud Function or Express.js endpoint
  return {
    endpoint: '/api/sensor-data',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer your-api-key'
    },
    body: {
      temperature: 'number',
      humidity: 'number',
      nh3: 'number',
      ch4: 'number',
      deviceId: 'string'
    }
  };
};