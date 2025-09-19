import { Thermometer, Droplets, Wind, Flame, Settings } from "lucide-react";
import MetricCard from "@/components/MetricCard";
import FreshnessScore from "@/components/FreshnessScore";
import DeviceStatus from "@/components/DeviceStatus";
import SensorHistory from "@/components/SensorHistory";
import { useSensorData } from "@/hooks/useSensorData";

const Dashboard = () => {
  const {
    latestReading,
    historicalData,
    deviceStatus,
    freshnessScore,
    isDeviceConnected,
    loading,
    error
  } = useSensorData();

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Connecting to sensors...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <p className="text-danger mb-4">Error: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

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
            value={latestReading ? latestReading.temperature.toFixed(1) : "--"}
            unit="°C"
            description="Ambient fridge temperature"
            icon={<Thermometer />}
            variant="temperature"
          />
          <MetricCard
            title="Humidity"
            value={latestReading ? latestReading.humidity.toFixed(1) : "--"}
            unit="%"
            description="Relative humidity level"
            icon={<Droplets />}
            variant="humidity"
          />
          <MetricCard
            title="NH₃ Level"
            value={latestReading ? latestReading.nh3.toFixed(1) : "--"}
            unit="ppm"
            description="Ammonia concentration"
            icon={<Wind />}
            variant="nh3"
          />
          <MetricCard
            title="CH₄ Level"
            value={latestReading ? latestReading.ch4.toFixed(1) : "--"}
            unit="ppm"
            description="Methane concentration"
            icon={<Flame />}
            variant="ch4"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <FreshnessScore
            score={freshnessScore.score}
            maxScore={100}
            status={freshnessScore.status}
            message={freshnessScore.message}
          />
          <DeviceStatus
            alerts={deviceStatus?.alerts || []}
            isConnected={isDeviceConnected}
          />
        </div>

        <div className="grid grid-cols-1 gap-6">
          <SensorHistory data={historicalData} />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;