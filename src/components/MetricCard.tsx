import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string;
  unit: string;
  description: string;
  icon: React.ReactNode;
  variant: 'temperature' | 'humidity' | 'nh3' | 'ch4';
}

const MetricCard = ({ title, value, unit, description, icon, variant }: MetricCardProps) => {
  const variantStyles = {
    temperature: "text-temperature",
    humidity: "text-humidity", 
    nh3: "text-nh3",
    ch4: "text-ch4"
  };

  return (
    <Card className="bg-secondary border-border">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className={cn("h-4 w-4", variantStyles[variant])}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline space-x-1">
          <div className="text-2xl font-bold text-foreground">{value}</div>
          <div className="text-sm text-muted-foreground">{unit}</div>
        </div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  );
};

export default MetricCard;