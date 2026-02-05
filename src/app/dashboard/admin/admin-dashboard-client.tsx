'use client';

import { useState, useEffect, useMemo } from 'react';
import type { Transaction, Ambulance, AdminDashboardData, AmbulancePerformanceData } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import { format, startOfMonth, endOfMonth, subMonths, isWithinInterval, startOfDay, endOfDay } from 'date-fns';
import { cn } from '@/lib/utils';
import { DataTable } from '@/components/ui/data-table';
import { columns } from './columns';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { RadialBar, RadialBarChart } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const formatCurrency = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'KES' }).format(value);

export default function AdminDashboardClient({ initialTransactions, initialAmbulances }: { initialTransactions: Transaction[], initialAmbulances: Ambulance[] }) {
    const today = new Date();
    const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
        from: startOfMonth(today),
        to: endOfMonth(today),
    });
    const [dashboardData, setDashboardData] = useState<AdminDashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    const calculateDashboardData = useMemo(() => {
        return (transactions: Transaction[], ambulances: Ambulance[], range: { from: Date, to: Date }): AdminDashboardData => {
            const filteredTransactions = transactions.filter(t => isWithinInterval(new Date(t.date), { start: startOfDay(range.from), end: endOfDay(range.to) }));
            
            const summary = filteredTransactions.reduce((acc, t) => {
                acc.total_target += t.target;
                acc.total_net_banked += t.net_banked;
                acc.total_till += t.total_till;
                acc.total_deficit += t.deficit;
                return acc;
            }, { total_target: 0, total_net_banked: 0, total_till: 0, total_deficit: 0 });

            const overall_performance = summary.total_target > 0 ? (summary.total_net_banked / summary.total_target) * 100 : 0;
            
            const ambulancePerformanceMap = new Map<number, { trans: Transaction[], count: number }>();
            filteredTransactions.forEach(t => {
                if (!ambulancePerformanceMap.has(t.ambulance.id)) {
                    ambulancePerformanceMap.set(t.ambulance.id, { trans: [], count: 0 });
                }
                const entry = ambulancePerformanceMap.get(t.ambulance.id)!;
                entry.trans.push(t);
                entry.count++;
            });

            const ambulance_performance: AmbulancePerformanceData[] = Array.from(ambulancePerformanceMap.entries()).map(([ambulanceId, data]) => {
                const ambulance = ambulances.find(a => a.id === ambulanceId)!;
                const totals = data.trans.reduce((acc, t) => {
                    acc.total_target += t.target;
                    acc.total_net_banked += t.net_banked;
                    acc.total_performance += t.performance;
                    return acc;
                }, { total_target: 0, total_net_banked: 0, total_performance: 0 });

                return {
                    ambulanceId,
                    reg_no: ambulance.reg_no,
                    total_target: totals.total_target,
                    total_net_banked: totals.total_net_banked,
                    avg_performance: (data.count > 0 ? (totals.total_performance / data.count) : 0) * 100,
                };
            }).sort((a, b) => b.avg_performance - a.avg_performance);

            // Period Comparison
            const prevRange = { from: subMonths(range.from, 1), to: subMonths(range.to, 1) };
            const prevTransactions = transactions.filter(t => isWithinInterval(new Date(t.date), { start: startOfDay(prevRange.from), end: endOfDay(prevRange.to) }));
            
            const prevSummary = prevTransactions.reduce((acc, t) => {
                acc.net_banked += t.net_banked;
                acc.deficit += t.deficit;
                return acc;
            }, { net_banked: 0, deficit: 0 });

            return {
                ...summary,
                overall_performance,
                ambulance_performance,
                period_comparison: {
                    current: { net_banked: summary.total_net_banked, deficit: summary.total_deficit },
                    previous: prevSummary
                }
            };
        };
    }, []);

    useEffect(() => {
        setLoading(true);
        if (dateRange.from && dateRange.to) {
            const data = calculateDashboardData(initialTransactions, initialAmbulances, dateRange);
            setDashboardData(data);
        }
        setLoading(false);
    }, [dateRange, initialTransactions, initialAmbulances, calculateDashboardData]);

    const handleStartDateChange = (date: Date | undefined) => {
        if (date) {
            setDateRange(prev => ({ ...prev, from: date }));
        }
    };
    
    const handleEndDateChange = (date: Date | undefined) => {
        if (date) {
            setDateRange(prev => ({ ...prev, to: date }));
        }
    };
    
    if (loading || !dashboardData) {
        return <div className="flex h-96 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    const { overall_performance, ambulance_performance, period_comparison } = dashboardData;

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-headline tracking-tight">Admin Dashboard</h1>
                    <p className="text-muted-foreground">High-level overview of fleet performance.</p>
                </div>
                <div className="flex items-end gap-4">
                    <div className="grid gap-1">
                        <Label>Start Date</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    id="start_date"
                                    variant={"outline"}
                                    className={cn("w-[180px] justify-start text-left font-normal")}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {format(dateRange.from, "LLL dd, y")}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    initialFocus
                                    mode="single"
                                    selected={dateRange.from}
                                    onSelect={handleStartDateChange}
                                    disabled={{ after: dateRange.to }}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                     <div className="grid gap-1">
                        <Label>End Date</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    id="end_date"
                                    variant={"outline"}
                                    className={cn("w-[180px] justify-start text-left font-normal")}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {format(dateRange.to, "LLL dd, y")}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    initialFocus
                                    mode="single"
                                    selected={dateRange.to}
                                    onSelect={handleEndDateChange}
                                    disabled={{ before: dateRange.from }}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle>Overall Performance</CardTitle>
                        <CardDescription>
                            Net Banked vs Target for {format(dateRange.from, "LLL d")} - {format(dateRange.to, "LLL d, y")}.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-center justify-center">
                        <ChartContainer
                            config={{ performance: { label: "Performance", color: "hsl(var(--primary))" } }}
                            className="mx-auto aspect-square h-[250px]"
                        >
                            <RadialBarChart
                                data={[{ name: "performance", value: overall_performance }]}
                                startAngle={-140}
                                endAngle={130}
                                innerRadius="70%"
                                outerRadius="100%"
                                barSize={20}
                            >
                                <RadialBar
                                    dataKey="value"
                                    background
                                    cornerRadius={10}
                                    className="fill-primary"
                                />
                                <ChartTooltip
                                    cursor={false}
                                    content={
                                        <ChartTooltipContent
                                            hideLabel
                                            formatter={(value) => `${Number(value).toFixed(0)}%`}
                                        />
                                    }
                                />
                                <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="fill-foreground text-4xl font-bold">
                                    {overall_performance.toFixed(0)}%
                                </text>
                                <text x="50%" y="65%" textAnchor="middle" dominantBaseline="middle" className="fill-muted-foreground text-sm">
                                    Performance
                                </text>
                            </RadialBarChart>
                        </ChartContainer>
                    </CardContent>
                </Card>

                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Period Comparison</CardTitle>
                        <CardDescription>Comparing key metrics against the previous period.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Metric</TableHead>
                                    <TableHead className="text-right">{format(dateRange.from, 'MMM d')} - {format(dateRange.to, 'd')}</TableHead>
                                    <TableHead className="text-right">{format(subMonths(dateRange.from, 1), 'MMM d')} - {format(subMonths(dateRange.to, 1), 'd')}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell className="font-medium">Net Banked</TableCell>
                                    <TableCell className="text-right">{formatCurrency(period_comparison.current.net_banked)}</TableCell>
                                    <TableCell className="text-right">{formatCurrency(period_comparison.previous.net_banked)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">Deficit</TableCell>
                                    <TableCell className="text-right text-red-500">{formatCurrency(period_comparison.current.deficit)}</TableCell>
                                    <TableCell className="text-right text-red-500">{formatCurrency(period_comparison.previous.deficit)}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>Ambulance Performance Analysis</CardTitle>
                     <CardDescription>
                        Period: {format(dateRange.from, "MMMM d, yyyy")} - {format(dateRange.to, "MMMM d, yyyy")}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <DataTable columns={columns} data={ambulance_performance} />
                </CardContent>
            </Card>
        </div>
    );
}
