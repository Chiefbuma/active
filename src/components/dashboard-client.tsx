'use client';

import { useState } from 'react';
import type { HealthData, Metric } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getHealthAdvice } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Line, LineChart, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip, XAxis, YAxis } from 'recharts';
import { ArrowUp, ArrowDown, Minus, Bot, Loader2 } from 'lucide-react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';

const chartConfig = {
  value: {
    label: "Value",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

const renderChangeIcon = (changeType: Metric['changeType']) => {
  switch (changeType) {
    case 'increase':
      return <ArrowUp className="h-4 w-4 text-destructive" />;
    case 'decrease':
      return <ArrowDown className="h-4 w-4 text-accent" />;
    default:
      return <Minus className="h-4 w-4 text-muted-foreground" />;
  }
};

export default function DashboardClient({ healthData }: { healthData: HealthData }) {
  const [selectedMetric, setSelectedMetric] = useState<Metric>(healthData.metrics[0]);
  const [advice, setAdvice] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGetAdvice = async () => {
    setIsLoading(true);
    setAdvice(null);
    const result = await getHealthAdvice();
    setIsLoading(false);
    if (result.success && result.advice) {
      setAdvice(result.advice);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error || 'An unknown error occurred.',
      });
    }
  };

  return (
    <div className="grid gap-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {healthData.metrics.map((metric) => (
          <Card key={metric.id} className="cursor-pointer hover:border-primary transition-all duration-300 shadow-sm hover:shadow-md" onClick={() => setSelectedMetric(metric)}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
              <metric.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                {renderChangeIcon(metric.changeType)}
                <span>{metric.change} from last week</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>{selectedMetric.name} Progress</CardTitle>
            <CardDescription>Your weekly progress for the last 8 weeks.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <LineChart data={selectedMetric.data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="week" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => `W${value}`} />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} domain={['dataMin - 10', 'dataMax + 10']} />
                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                <Line type="monotone" dataKey="value" stroke="var(--color-value)" strokeWidth={2} dot={{ r: 4, fill: "var(--color-value)" }} activeDot={{r: 6}} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-2 flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="text-primary" />
              <span>Personalized Health Advice</span>
            </CardTitle>
            <CardDescription>AI-powered recommendations based on your latest data.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-center items-center text-center p-6">
            {isLoading ? (
              <div className="space-y-4 flex flex-col items-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground">Generating your advice...</p>
              </div>
            ) : advice ? (
              <p className="text-sm text-left whitespace-pre-wrap leading-relaxed">{advice}</p>
            ) : (
              <div className="text-center">
                <p className="text-muted-foreground">Click the button below to get AI-powered insights and recommendations for your health journey.</p>
              </div>
            )}
          </CardContent>
          <div className="p-6 pt-0 mt-auto">
            <Button className="w-full" onClick={handleGetAdvice} disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Bot className="mr-2 h-4 w-4" />}
              Generate Advice
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
