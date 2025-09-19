import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

interface SensorHistoryProps {
  data: Array<{
    time: string;
    temperature: number;
    humidity: number;
    nh3: number;
    ch4: number;
  }>;
}

const SensorHistory = ({ data }: SensorHistoryProps) => {
  return (
    <Card className="bg-secondary border-border">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">Sensor History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis 
                dataKey="time" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis hide />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--secondary))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="temperature" 
                stroke="hsl(var(--temperature))" 
                strokeWidth={2}
                dot={false}
              />
              <Line 
                type="monotone" 
                dataKey="humidity" 
                stroke="hsl(var(--humidity))" 
                strokeWidth={2}
                dot={false}
              />
              <Line 
                type="monotone" 
                dataKey="nh3" 
                stroke="hsl(var(--nh3))" 
                strokeWidth={2}
                dot={false}
              />
              <Line 
                type="monotone" 
                dataKey="ch4" 
                stroke="hsl(var(--ch4))" 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default SensorHistory;