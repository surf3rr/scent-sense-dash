import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

interface FreshnessScoreProps {
  score: number;
  maxScore: number;
  status: 'good' | 'fair' | 'poor';
  message: string;
}

const FreshnessScore = ({ score, maxScore, status, message }: FreshnessScoreProps) => {
  const statusColors = {
    good: "text-success",
    fair: "text-warning", 
    poor: "text-danger"
  };

  const statusBgColors = {
    good: "bg-success/10",
    fair: "bg-warning/10",
    poor: "bg-danger/10" 
  };

  return (
    <Card className="bg-secondary border-border">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">Freshness Score</CardTitle>
        <div className={`h-8 w-8 rounded-full flex items-center justify-center ${statusBgColors[status]}`}>
          <AlertCircle className={`h-4 w-4 ${statusColors[status]}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline space-x-2 mb-2">
          <div className="text-3xl font-bold text-foreground">{score}</div>
          <div className="text-sm text-muted-foreground">/ {maxScore}</div>
          <div className={`text-sm font-medium capitalize ${statusColors[status]}`}>
            {status}
          </div>
        </div>
        <div className="w-full bg-muted rounded-full h-2 mb-3">
          <div 
            className={`h-2 rounded-full ${status === 'good' ? 'bg-success' : status === 'fair' ? 'bg-warning' : 'bg-danger'}`}
            style={{ width: `${(score / maxScore) * 100}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground">{message}</p>
      </CardContent>
    </Card>
  );
};

export default FreshnessScore;