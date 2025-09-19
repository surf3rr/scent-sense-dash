import { Thermometer, Droplets, Wind, Flame, Settings } from "lucide-react";
import MetricCard from "@/components/MetricCard";
import FreshnessScore from "@/components/FreshnessScore";
import DeviceStatus from "@/components/DeviceStatus";
import SensorHistory from "@/components/SensorHistory";

// Mock data - will be replaced with real ESP32 sensor data via Supabase
const mockSensorData = Array.from({ length: 24 }, (_, i) => ({
  time: `${String(i).padStart(2, '0')}:00`,
  temperature: 25 + Math.sin(i / 4) * 3 + Math.random() * 2,
  humidity: 50 + Math.cos(i / 3) * 10 + Math.random() * 5,
  nh3: 90 + Math.sin(i / 2) * 20 + Math.random() * 10,
  ch4: 800 + Math.cos(i / 5) * 100 + Math.random() * 50
}));

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">FV</span>
              </div>
              <h1 className="text-xl font-bold">FreshView</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">Dashboard</span>
              <Settings className="h-5 w-5 text-muted-foreground" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <MetricCard
            title="Temperature"
            value="25.0"
            unit="°C"
            description="Ambient fridge temperature"
            icon={<Thermometer />}
            variant="temperature"
          />
          <MetricCard
            title="Humidity"
            value="50.0"
            unit="%"
            description="Relative humidity level"
            icon={<Droplets />}
            variant="humidity"
          />
          <MetricCard
            title="NH₃ Level"
            value="92.0"
            unit="ppm"
            description="Ammonia concentration"
            icon={<Wind />}
            variant="nh3"
          />
          <MetricCard
            title="CH₄ Level"
            value="831.9"
            unit="ppm"
            description="Methane concentration"
            icon={<Flame />}
            variant="ch4"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <FreshnessScore
            score={5}
            maxScore={100}
            status="poor"
            message="Contents may be spoiled. Please check immediately."
          />
          <DeviceStatus
            alerts={[
              "SPOILAGE DETECTED - FERMENTATION",
              "TEMP ALERT"
            ]}
            isConnected={true}
          />
        </div>

        <div className="grid grid-cols-1 gap-6">
          <SensorHistory data={mockSensorData} />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;