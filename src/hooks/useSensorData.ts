import { useState, useEffect } from 'react';
import { subscribeToSensorData, subscribeToDeviceStatus, SensorReading, DeviceStatus } from '@/lib/firebase';

export const useSensorData = () => {
  const [sensorData, setSensorData] = useState<SensorReading[]>([]);
  const [deviceStatus, setDeviceStatus] = useState<DeviceStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // Subscribe to sensor data
      const unsubscribeSensorData = subscribeToSensorData((data) => {
        setSensorData(data);
        setLoading(false);
      });

      // Subscribe to device status
      const unsubscribeDeviceStatus = subscribeToDeviceStatus((status) => {
        setDeviceStatus(status);
      });

      // Cleanup subscriptions
      return () => {
        unsubscribeSensorData();
        unsubscribeDeviceStatus();
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect to Firebase');
      setLoading(false);
    }
  }, []);

  // Get latest sensor reading
  const latestReading = sensorData.length > 0 ? sensorData[0] : null;

  // Get historical data for charts (last 24 readings)
  const historicalData = sensorData.slice(0, 24).reverse().map((reading, index) => ({
    time: new Date(reading.timestamp).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    }),
    temperature: reading.temperature,
    humidity: reading.humidity,
    nh3: reading.nh3,
    ch4: reading.ch4
  }));

  // Calculate freshness score based on sensor readings
  const calculateFreshnessScore = (reading: SensorReading | null): {
    score: number;
    status: 'good' | 'fair' | 'poor';
    message: string;
  } => {
    if (!reading) {
      return {
        score: 0,
        status: 'poor',
        message: 'No sensor data available'
      };
    }

    let score = 100;
    let alerts = [];

    // Temperature scoring (ideal: 2-4°C)
    if (reading.temperature > 8) {
      score -= 30;
      alerts.push('Temperature too high');
    } else if (reading.temperature > 6) {
      score -= 15;
    } else if (reading.temperature < 0) {
      score -= 20;
      alerts.push('Temperature too low');
    }

    // Humidity scoring (ideal: 85-95%)
    if (reading.humidity > 95) {
      score -= 20;
      alerts.push('Humidity too high');
    } else if (reading.humidity < 80) {
      score -= 25;
      alerts.push('Humidity too low');
    }

    // NH3 scoring (spoilage indicator)
    if (reading.nh3 > 100) {
      score -= 40;
      alerts.push('High ammonia levels detected');
    } else if (reading.nh3 > 50) {
      score -= 20;
    }

    // CH4 scoring (fermentation indicator)
    if (reading.ch4 > 1000) {
      score -= 35;
      alerts.push('High methane levels - possible fermentation');
    } else if (reading.ch4 > 800) {
      score -= 15;
    }

    score = Math.max(0, score);

    let status: 'good' | 'fair' | 'poor';
    let message: string;

    if (score >= 80) {
      status = 'good';
      message = 'Food is fresh and safe to consume';
    } else if (score >= 50) {
      status = 'fair';
      message = 'Food quality is declining, consume soon';
    } else {
      status = 'poor';
      message = 'Food may be spoiled, check immediately';
    }

    return { score, status, message };
  };

  const freshnessScore = calculateFreshnessScore(latestReading);

  // Check if device is connected (last seen within 5 minutes)
  const isDeviceConnected = deviceStatus ? 
    (Date.now() - deviceStatus.lastSeen) < 5 * 60 * 1000 : false;

  return {
    sensorData,
    latestReading,
    historicalData,
    deviceStatus,
    freshnessScore,
    isDeviceConnected,
    loading,
    error
  };
};