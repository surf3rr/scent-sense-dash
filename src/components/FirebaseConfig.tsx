import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Copy, Check } from 'lucide-react';

const FirebaseConfig = () => {
  const [copied, setCopied] = useState(false);

  const configTemplate = `// Firebase configuration for your project
const firebaseConfig = {
  apiKey: "your-api-key-here",
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project-default-rtdb.firebaseio.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};`;

  const esp32Code = `#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <DHT.h>

// WiFi credentials
const char* ssid = "your-wifi-ssid";
const char* password = "your-wifi-password";

// Firebase Realtime Database URL
const char* firebaseURL = "https://your-project-default-rtdb.firebaseio.com";
const char* firebaseAuth = "your-database-secret";

// Sensor setup
#define DHT_PIN 4
#define NH3_PIN A0
#define CH4_PIN A1
DHT dht(DHT_PIN, DHT22);

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  
  dht.begin();
  Serial.println("ESP32 Sensor System Ready");
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    // Read sensors
    float temperature = dht.readTemperature();
    float humidity = dht.readHumidity();
    int nh3_raw = analogRead(NH3_PIN);
    int ch4_raw = analogRead(CH4_PIN);
    
    // Convert to ppm (calibration needed)
    float nh3_ppm = map(nh3_raw, 0, 1023, 0, 500);
    float ch4_ppm = map(ch4_raw, 0, 1023, 0, 2000);
    
    // Create JSON payload
    DynamicJsonDocument doc(1024);
    doc["temperature"] = temperature;
    doc["humidity"] = humidity;
    doc["nh3"] = nh3_ppm;
    doc["ch4"] = ch4_ppm;
    doc["deviceId"] = "ESP32_001";
    
    String jsonString;
    serializeJson(doc, jsonString);
    
    // Send to Firebase
    HTTPClient http;
    String url = String(firebaseURL) + "/sensorData.json?auth=" + firebaseAuth;
    http.begin(url);
    http.addHeader("Content-Type", "application/json");
    
    int httpResponseCode = http.POST(jsonString);
    
    if (httpResponseCode > 0) {
      Serial.println("Data sent successfully");
    } else {
      Serial.println("Error sending data");
    }
    
    http.end();
  }
  
  delay(30000); // Send every 30 seconds
}`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Firebase Setup Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertDescription>
              To complete the Firebase integration, you need to:
              <ol className="list-decimal list-inside mt-2 space-y-1">
                <li>Create a Firebase project at <a href="https://console.firebase.google.com" className="text-blue-500 underline" target="_blank" rel="noopener noreferrer">Firebase Console</a></li>
                <li>Enable Realtime Database</li>
                <li>Get your configuration keys</li>
                <li>Update the configuration in src/lib/firebase.ts</li>
              </ol>
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Label>Firebase Configuration Template</Label>
            <div className="relative">
              <pre className="bg-muted p-4 rounded-md text-sm overflow-x-auto">
                <code>{configTemplate}</code>
              </pre>
              <Button
                size="sm"
                variant="outline"
                className="absolute top-2 right-2"
                onClick={() => copyToClipboard(configTemplate)}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>ESP32 Arduino Code</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label>Complete ESP32 Code for Hardware Integration</Label>
            <div className="relative">
              <pre className="bg-muted p-4 rounded-md text-sm overflow-x-auto max-h-96">
                <code>{esp32Code}</code>
              </pre>
              <Button
                size="sm"
                variant="outline"
                className="absolute top-2 right-2"
                onClick={() => copyToClipboard(esp32Code)}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          
          <Alert className="mt-4">
            <AlertDescription>
              <strong>Required Libraries:</strong> Install these in Arduino IDE:
              <ul className="list-disc list-inside mt-2">
                <li>WiFi (built-in)</li>
                <li>HTTPClient (built-in)</li>
                <li>ArduinoJson</li>
                <li>DHT sensor library</li>
              </ul>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};

export default FirebaseConfig;