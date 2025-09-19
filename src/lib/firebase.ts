import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, push, serverTimestamp } from 'firebase/database';
import { getAuth } from 'firebase/auth';

// Firebase configuration - replace with your actual config
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project-default-rtdb.firebaseio.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
export const auth = getAuth(app);

// Data types
export interface SensorReading {
  temperature: number;
  humidity: number;
  nh3: number;
  ch4: number;
  timestamp: number;
  deviceId: string;
}

export interface DeviceStatus {
  isConnected: boolean;
  lastSeen: number;
  deviceId: string;
  alerts: string[];
}

// Database references
export const sensorDataRef = ref(database, 'sensorData');
export const deviceStatusRef = ref(database, 'deviceStatus');
export const alertsRef = ref(database, 'alerts');

// Helper functions for ESP32 to write data
export const writeSensorData = async (data: Omit<SensorReading, 'timestamp'>) => {
  const dataWithTimestamp = {
    ...data,
    timestamp: serverTimestamp()
  };
  return push(sensorDataRef, dataWithTimestamp);
};

export const updateDeviceStatus = async (status: Omit<DeviceStatus, 'lastSeen'>) => {
  const statusWithTimestamp = {
    ...status,
    lastSeen: serverTimestamp()
  };
  return push(deviceStatusRef, statusWithTimestamp);
};

// Helper functions for dashboard to read data
export const subscribeToSensorData = (callback: (data: SensorReading[]) => void) => {
  return onValue(sensorDataRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const readings = Object.values(data) as SensorReading[];
      // Sort by timestamp, most recent first
      readings.sort((a, b) => (b.timestamp as number) - (a.timestamp as number));
      callback(readings);
    } else {
      callback([]);
    }
  });
};

export const subscribeToDeviceStatus = (callback: (status: DeviceStatus | null) => void) => {
  return onValue(deviceStatusRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const statuses = Object.values(data) as DeviceStatus[];
      // Get the most recent status
      const latestStatus = statuses.sort((a, b) => (b.lastSeen as number) - (a.lastSeen as number))[0];
      callback(latestStatus);
    } else {
      callback(null);
    }
  });
};