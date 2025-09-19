import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Wifi } from "lucide-react";

interface DeviceStatusProps {
  alerts: string[];
  isConnected: boolean;
}

const DeviceStatus = ({ alerts, isConnected }: DeviceStatusProps) => {
  return (
    <Card className="bg-secondary border-border">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground">Device Status</CardTitle>
        <div className="flex items-center space-x-2">
          <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-success' : 'bg-danger'}`} />
          <Wifi className={`h-4 w-4 ${isConnected ? 'text-success' : 'text-danger'}`} />
        </div>
      </CardHeader>
      <CardContent>
        {alerts.length > 0 ? (
          <div className="space-y-2">
            {alerts.map((alert, index) => (
              <div key={index} className="flex items-center space-x-2 text-sm">
                <AlertTriangle className="h-4 w-4 text-warning flex-shrink-0" />
                <span className="text-foreground font-medium">{alert}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center space-x-2 text-sm text-success">
            <div className="h-4 w-4 rounded-full bg-success/20 flex items-center justify-center">
              <div className="h-2 w-2 rounded-full bg-success" />
            </div>
            <span>All systems operational</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DeviceStatus;