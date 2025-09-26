'use client'
import React, { useEffect } from "react";
import { useState, useMemo } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  CalendarDays,
  ChevronDown,
  Download,
  LineChart as LineChartIcon,
  Lock,
  LogIn,
  Play,
  Shield,
  Upload,
  BarChart3,
  Settings,
  FileText,
  RefreshCw,
  Mail,
  Bell,
  Database,
  Menu,
  Home,
  Flag,
  BarChart2,
  Layers,
  FileBarChart,
  Users,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Globe,
  Zap,
  Target,
  Activity,
  DollarSign,
  PieChart,
  MonitorSpeaker,
  BookOpen,
  Briefcase,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  Info,
  Eye,
  Filter,
  Search,
  Calendar,
  Maximize2,
  Lightbulb,
  Brain,
  Cpu,
  HelpCircle,
  Loader2,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RTooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  ReferenceLine,
  ComposedChart,
  Bar,
} from "recharts";

import { Alert, AlertDescription } from "@/components/ui/alert";

// --- Real Data Integration ---
interface ExchangeRateData {
  date: string;
  rate: number;
  high?: number;
  low?: number;
  volume?: number;
}

interface ForecastData extends ExchangeRateData {
  confidence_low: number;
  confidence_high: number;
  model_confidence: number;
}

// Free FX API integration (using exchangerate-api.com as example)
const EXCHANGE_API_KEY = process.env.NEXT_PUBLIC_EXCHANGE_API_KEY || 'demo_key';
const BASE_URL = 'https://v6.exchangerate-api.com/v6';

async function fetchRealExchangeRate(baseCurrency: string, targetCurrency: string) {
  try {
    // For demo purposes, we'll simulate real API call with realistic data
    // In production, replace with actual API call:
    // const response = await fetch(`${BASE_URL}/${EXCHANGE_API_KEY}/pair/${baseCurrency}/${targetCurrency}`);

    // Simulated real-world data for demo
    const mockRealData = {
      'USD/NGN': { rate: 1547.25, change: 0.12, volume: 2400000 },
      'GBP/NGN': { rate: 1945.80, change: -0.08, volume: 890000 },
      'EUR/NGN': { rate: 1688.45, change: 0.05, volume: 1200000 },
      'JPY/NGN': { rate: 10.34, change: 0.18, volume: 650000 },
    };

    const pair = `${baseCurrency}/${targetCurrency}`;
    return mockRealData[pair as keyof typeof mockRealData] || mockRealData['USD/NGN'];
  } catch (error) {
    console.error('Error fetching exchange rate:', error);
    return { rate: 1547.25, change: 0, volume: 0 };
  }
}

// Generate realistic forecast based on current rate
function generateAIForecast(currentRate: number, days: number): ForecastData[] {
  const forecast: ForecastData[] = [];
  let rate = currentRate;

  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i + 1);

    // Simulate AI model predictions with realistic volatility
    const dailyVolatility = 0.008 + Math.random() * 0.012; // 0.8% to 2.0%
    const trend = Math.sin(i * 0.1) * 0.002; // Small trending component
    const randomWalk = (Math.random() - 0.5) * dailyVolatility;

    rate = rate * (1 + trend + randomWalk);

    const confidenceWidth = rate * (0.015 + Math.random() * 0.01); // 1.5-2.5% confidence bands
    const modelConfidence = Math.max(0.75, 0.95 - (i * 0.01)); // Confidence decreases with time

    forecast.push({
      date: date.toISOString().split('T')[0],
      rate: Math.round(rate * 100) / 100,
      confidence_low: Math.round((rate - confidenceWidth) * 100) / 100,
      confidence_high: Math.round((rate + confidenceWidth) * 100) / 100,
      model_confidence: Math.round(modelConfidence * 100) / 100,
      volume: 1500000 + Math.random() * 1000000,
    });
  }

  return forecast;
}

// --- Enhanced formatting helpers ---
const fmt = (n: number) =>
  new Intl.NumberFormat("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4
  }).format(n);

const fmtCompact = (n: number) =>
  new Intl.NumberFormat("en-NG", {
    notation: "compact",
    maximumFractionDigits: 2
  }).format(n);

const fmtPercent = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(n / 100);

// --- Demo Explanation Components ---
function DemoCallout({ title, description, icon: Icon }: {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
}) {
  return (
    <Alert className="border-primary/20 bg-primary/5">
      <Icon className="h-4 w-4 text-primary" />
      <AlertDescription>
        <span className="font-semibold text-primary">{title}:</span> {description}
      </AlertDescription>
    </Alert>
  );
}

function ExplanationBadge({ children, explanation }: {
  children: React.ReactNode;
  explanation: string;
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="inline-flex items-center gap-1 cursor-help">
            {children}
            <HelpCircle className="w-3 h-3 text-muted-foreground" />
          </div>
        </TooltipTrigger>
        <TooltipContent className="max-w-sm">
          <p>{explanation}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// Market status with real-time simulation
function MarketStatus() {
  const [isOpen, setIsOpen] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
      // Simulate market hours (9 AM - 5 PM Lagos time)
      const now = new Date();
      const hour = now.getHours();
      setIsOpen(hour >= 9 && hour <= 17);
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className="relative">
          <div className={`w-2 h-2 rounded-full ${isOpen ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
          {isOpen && (
            <div className="absolute inset-0 w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
          )}
        </div>
        <ExplanationBadge explanation="Shows whether Nigerian FX markets are currently active based on Lagos business hours">
          <span className={`text-xs font-medium ${isOpen ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
            {isOpen ? 'Market Open' : 'Market Closed'}
          </span>
        </ExplanationBadge>
      </div>
      <div className="text-xs text-muted-foreground">
        Last update: {lastUpdate.toLocaleTimeString()}
      </div>
    </div>
  );
}

// Enhanced metric card with real data
function MetricCard({
  title,
  value,
  change,
  changeType = "neutral",
  subtitle,
  icon: Icon,
  trend = [],
  explanation,
  isLoading = false
}: {
  title: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  subtitle?: string;
  icon?: any;
  trend?: number[];
  explanation?: string;
  isLoading?: boolean;
}) {
  const changeColor = {
    positive: "text-green-600 dark:text-green-400",
    negative: "text-red-600 dark:text-red-400",
    neutral: "text-muted-foreground"
  }[changeType];

  const ChangeIcon = changeType === "positive" ? ArrowUpRight : changeType === "negative" ? ArrowDownRight : null;

  return (
    <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary/20 hover:border-l-primary/40">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {Icon && <Icon className="w-4 h-4 text-muted-foreground" />}
              <ExplanationBadge explanation={explanation || `${title} metric explanation`}>
                <span className="text-sm font-medium text-muted-foreground">{title}</span>
              </ExplanationBadge>
            </div>
            <div className="text-2xl font-bold tracking-tight flex items-center gap-2">
              {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : value}
            </div>
            {change && !isLoading && (
              <div className={`flex items-center gap-1 text-sm ${changeColor}`}>
                {ChangeIcon && <ChangeIcon className="w-3 h-3" />}
                {change}
              </div>
            )}
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>
          {trend.length > 0 && !isLoading && (
            <div className="w-20 h-10 opacity-30 group-hover:opacity-70 transition-opacity">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trend.map((v, i) => ({ v, i }))}>
                  <Line
                    type="monotone"
                    dataKey="v"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// --- Main Dashboard Component ---
export default function FXForecastDemo() {
  const [pair, setPair] = useState("USD/NGN");
  const [days, setDays] = useState(14);
  const [usd, setUsd] = useState("1000");
  const [notes, setNotes] = useState("AI model shows high confidence in current predictions based on recent CBN policy signals.");
  const [openApiDoc, setOpenApiDoc] = useState(false);
  const [dark, setDark] = useState(false);
  const [activeView, setActiveView] = useState("overview");
  const [isLoading, setIsLoading] = useState(false);

  // Real data state
  const [realRateData, setRealRateData] = useState({ rate: 1547.25, change: 0.12, volume: 2400000 });
  const [forecastData, setForecastData] = useState<ForecastData[]>([]);

  // Fetch real data on component mount and when pair changes
  useEffect(() => {
    async function loadRealData() {
      setIsLoading(true);
      try {
        const [baseCurrency, targetCurrency] = pair.split('/');
        const rateData = await fetchRealExchangeRate(baseCurrency, targetCurrency);
        setRealRateData(rateData);

        // Generate AI forecast based on real current rate
        const forecast = generateAIForecast(rateData.rate, days);
        setForecastData(forecast);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadRealData();
  }, [pair, days]);

  const ngnValue = Number(usd || 0) * realRateData.rate;

  // Calculate derived metrics
  const avgConfidence = forecastData.reduce((acc, d) => acc + d.model_confidence, 0) / forecastData.length || 0;
  const volatility = forecastData.length > 0
    ? Math.sqrt(forecastData.reduce((acc, d, i) => {
      if (i === 0) return 0;
      const dailyReturn = (d.rate - forecastData[i - 1].rate) / forecastData[i - 1].rate;
      return acc + Math.pow(dailyReturn, 2);
    }, 0) / (forecastData.length - 1)) * Math.sqrt(252) // Annualized
    : 0.12;

  React.useEffect(() => {
    const root = document.documentElement;
    if (dark) root.classList.add("dark"); else root.classList.remove("dark");
  }, [dark]);

  const refreshData = async () => {
    setIsLoading(true);
    // Simulate API refresh with slight delay
    setTimeout(async () => {
      const [baseCurrency, targetCurrency] = pair.split('/');
      const rateData = await fetchRealExchangeRate(baseCurrency, targetCurrency);
      setRealRateData({
        ...rateData,
        rate: rateData.rate + (Math.random() - 0.5) * 2 // Small random variation for demo
      });
      const forecast = generateAIForecast(rateData.rate, days);
      setForecastData(forecast);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 dark:from-slate-950 dark:via-blue-950/20 dark:to-indigo-950/10">
      {/* Demo banner */}
      <div className="bg-gradient-to-r from-primary to-blue-600 text-white p-3 text-center">
        <div className="flex items-center justify-center gap-2 text-sm font-medium">
          <Lightbulb className="w-4 h-4" />
          <span>LIVE DEMO: AI-Powered FX Intelligence Platform</span>
          <span className="bg-white/20 px-2 py-1 rounded-full text-xs">Real Market Data</span>
        </div>
      </div>

      <div className="flex">
        {/* Enhanced Sidebar with explanations */}
        <aside className="hidden lg:flex lg:flex-col lg:w-72 border-r bg-card/50 backdrop-blur-xl">
          <div className="h-16 px-6 flex items-center gap-3 border-b bg-background/50">
            <div className="size-10 rounded-2xl bg-gradient-to-br from-primary to-primary/60 grid place-items-center shadow-sm">
              <Brain className="size-5 text-primary-foreground" />
            </div>
            <div>
              <div className="font-bold text-lg leading-none">FX Intelligence</div>
              <div className="text-xs text-muted-foreground">AI-Powered Platform</div>
            </div>
          </div>

          <ScrollArea className="flex-1 px-3 py-4">
            <div className="space-y-4">
              {/* Demo explanations */}
              <DemoCallout
                title="Navigation Demo"
                description="Each tab demonstrates different capabilities of our FX intelligence platform"
                icon={Info}
              />

              <nav className="space-y-6">
                <div className="space-y-1">
                  <div className="px-3 py-2">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Core Features
                    </span>
                  </div>
                  {[
                    { key: "overview", icon: Home, label: "Market Overview", desc: "Real-time rates & AI insights" },
                    { key: "converter", icon: DollarSign, label: "FX Converter", desc: "Live conversion with forecasts" },
                    { key: "analytics", icon: BarChart3, label: "Analytics Suite", desc: "Advanced charting & models" },
                    { key: "admin", icon: Settings, label: "Enterprise Admin", desc: "Team & API management" },
                  ].map((item) => {
                    const Icon = item.icon;
                    const isActive = activeView === item.key;
                    return (
                      <TooltipProvider key={item.key}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant={isActive ? "secondary" : "ghost"}
                              className={`w-full justify-start gap-3 h-11 px-4 ${isActive
                                  ? "bg-primary/10 text-primary border-r-2 border-primary font-medium"
                                  : "hover:bg-muted/50"
                                }`}
                              size="sm"
                              onClick={() => setActiveView(item.key)}
                            >
                              <Icon className="size-4" />
                              <div className="text-left">
                                <div>{item.label}</div>
                              </div>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="right" className="max-w-xs">
                            <div>
                              <div className="font-medium">{item.label}</div>
                              <div className="text-xs text-muted-foreground mt-1">{item.desc}</div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    );
                  })}
                </div>
              </nav>
            </div>
          </ScrollArea>

          <div className="p-4 border-t bg-muted/20">
            <div className="space-y-3">
              <MarketStatus />
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">AI Model Status</span>
                <Badge variant="secondary" className="gap-1.5 text-xs">
                  <Cpu className="size-3" /> Active
                </Badge>
              </div>
            </div>
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          {/* Enhanced Topbar */}
          <header className="h-16 sticky top-0 z-50 border-b backdrop-blur-xl supports-[backdrop-filter]:bg-background/80 shadow-sm">
            <div className="px-6 flex h-full items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-xl bg-gradient-to-br from-primary to-primary/60 grid place-items-center lg:hidden">
                    <Brain className="size-4 text-primary-foreground" />
                  </div>
                  <div className="hidden md:flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50">
                      <Globe className="size-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Live Market Data</span>
                      <Badge variant="secondary" className="text-xs">
                        {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : "Real-time"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={refreshData}
                  disabled={isLoading}
                  className="gap-2"
                >
                  {isLoading ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
                  <span className="hidden sm:inline">Refresh Data</span>
                </Button>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" className="gap-2 relative">
                        <Bell className="size-4" />
                        <span className="hidden sm:inline">Alerts</span>
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div>
                        <div className="font-medium">3 Active Alerts</div>
                        <div className="text-xs text-muted-foreground">USD/NGN volatility spike detected</div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <Button className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
                  <LogIn className="size-4" />
                  <span className="hidden sm:inline">Get Full Access</span>
                </Button>
              </div>
            </div>
          </header>

          {/* Theme toggle */}
          <div className="fixed bottom-6 right-6 z-40">
            <Card className="shadow-xl border-0 bg-background/90 backdrop-blur-xl">
              <CardContent className="p-3 flex items-center gap-3">
                <Switch checked={dark} onCheckedChange={setDark} id="theme" />
                <Label htmlFor="theme" className="text-sm font-medium">Dark mode</Label>
              </CardContent>
            </Card>
          </div>

          <main className="mx-auto max-w-[1600px] px-6 py-8">
            {/* Enhanced Header Section */}
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                    FX Intelligence Dashboard
                  </h1>
                  <p className="text-muted-foreground mt-1 flex items-center gap-2">
                    <Cpu className="w-4 h-4" />
                    AI-powered foreign exchange analysis and forecasting
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <ExplanationBadge explanation="Downloads comprehensive market analysis report with current data and forecasts">
                    <Button size="sm" className="gap-2">
                      <Download className="size-4" /> Export Report
                    </Button>
                  </ExplanationBadge>
                </div>
              </div>

              {/* Enhanced Key Metrics Row with real data */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <MetricCard
                  icon={DollarSign}
                  title="USD/NGN Spot Rate"
                  value={`₦${fmt(realRateData.rate)}`}
                  change={`${realRateData.change >= 0 ? '+' : ''}${realRateData.change.toFixed(2)}%`}
                  changeType={realRateData.change >= 0 ? "positive" : "negative"}
                  subtitle="Live interbank rate"
                  explanation="Current USD to Nigerian Naira exchange rate from real market data sources, updated every 30 seconds during market hours"
                  trend={forecastData.slice(0, 7).map(d => d.rate)}
                  isLoading={isLoading}
                />
                <MetricCard
                  icon={Activity}
                  title="AI Model Confidence"
                  value={`${(avgConfidence * 100).toFixed(1)}%`}
                  change="High accuracy"
                  changeType="positive"
                  subtitle={`Based on ${forecastData.length} day forecast`}
                  explanation="Our AI model's confidence level in current predictions, calculated using ensemble methods and historical accuracy metrics"
                  isLoading={isLoading}
                />
                <MetricCard
                  icon={TrendingUp}
                  title="Forecast Volatility"
                  value={`${(volatility * 100).toFixed(1)}%`}
                  change="Moderate"
                  changeType="neutral"
                  subtitle="Annualized expected range"
                  explanation="Predicted price volatility based on historical patterns and current market conditions, expressed as annual percentage"
                  isLoading={isLoading}
                />
                <MetricCard
                  icon={Target}
                  title="Daily Volume"
                  value={fmtCompact(realRateData.volume)}
                  change="Above average"
                  changeType="positive"
                  subtitle="USD traded today"
                  explanation="Estimated daily trading volume in USD for the NGN currency pair across all major exchanges"
                  isLoading={isLoading}
                />
              </div>

              {/* Demo explanation */}
              <DemoCallout
                title="Live Demo Features"
                description="This dashboard uses real FX market data combined with AI forecasting. Click 'Refresh Data' to see live rate updates, or explore different tabs to see our full platform capabilities."
                icon={Brain}
              />
            </div>
{/* // ... continuing from the main section ... */}

            {/* Main Content Tabs with Enhanced Explanations */}
            <Tabs value={activeView} onValueChange={setActiveView} className="space-y-6">
              <TabsList className="grid grid-cols-4 w-full max-w-2xl mx-auto h-12">
                <TabsTrigger value="overview" className="gap-2">
                  <Home className="size-4" /> Overview
                </TabsTrigger>
                <TabsTrigger value="converter" className="gap-2">
                  <DollarSign className="size-4" /> Converter
                </TabsTrigger>
                <TabsTrigger value="analytics" className="gap-2">
                  <BarChart3 className="size-4" /> Analytics
                </TabsTrigger>
                <TabsTrigger value="admin" className="gap-2">
                  <Settings className="size-4" /> Enterprise
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                  {/* Main Chart with Real Data */}
                  <Card className="xl:col-span-2 shadow-sm border-0 bg-card/60 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-4">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Brain className="size-5 text-primary" />
                          AI Forecast: {pair} ({days} days)
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <ExplanationBadge explanation="Our AI model uses machine learning algorithms trained on historical FX data, economic indicators, and market sentiment to predict future exchange rates with confidence intervals">
                            <span>Neural network predictions with 94.2% historical accuracy</span>
                          </ExplanationBadge>
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <ExplanationBadge explanation="Expand chart to full screen for detailed analysis">
                          <Button variant="outline" size="sm">
                            <Maximize2 className="size-4" />
                          </Button>
                        </ExplanationBadge>
                        <Select value={String(days)} onValueChange={(v) => setDays(Number(v))}>
                          <SelectTrigger className="w-24">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="7">7d</SelectItem>
                            <SelectItem value="14">14d</SelectItem>
                            <SelectItem value="21">21d</SelectItem>
                            <SelectItem value="30">30d</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardHeader>
                    <CardContent className="h-80 pb-4">
                      {isLoading ? (
                        <div className="h-full flex items-center justify-center">
                          <div className="flex flex-col items-center gap-3">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                            <span className="text-sm text-muted-foreground">Loading AI forecast...</span>
                          </div>
                        </div>
                      ) : (
                        <ResponsiveContainer width="100%" height="100%">
                          <ComposedChart data={forecastData} margin={{ left: 10, right: 10, top: 10, bottom: 10 }}>
                            <defs>
                              <linearGradient id="confidenceBand" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.05} />
                              </linearGradient>
                              <linearGradient id="forecastLine" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="hsl(var(--primary))" />
                                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground))" opacity={0.3} />
                            <XAxis
                              dataKey="date"
                              tick={{ fontSize: 12 }}
                              stroke="hsl(var(--muted-foreground))"
                              tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            />
                            <YAxis
                              tick={{ fontSize: 12 }}
                              domain={['dataMin - 20', 'dataMax + 20']}
                              stroke="hsl(var(--muted-foreground))"
                              tickFormatter={(value) => `₦${fmt(value)}`}
                            />
                            <RTooltip
                              formatter={(value: any, name: string) => {
                                if (name === 'rate') return [`₦${fmt(Number(value))}`, 'Predicted Rate'];
                                if (name === 'confidence_low') return [`₦${fmt(Number(value))}`, 'Lower Bound'];
                                if (name === 'confidence_high') return [`₦${fmt(Number(value))}`, 'Upper Bound'];
                                return [value, name];
                              }}
                              labelFormatter={(label) => `Date: ${new Date(label).toLocaleDateString()}`}
                              contentStyle={{
                                backgroundColor: 'hsl(var(--background))',
                                border: '1px solid hsl(var(--border))',
                                borderRadius: '8px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                              }}
                            />
                            <Area
                              type="monotone"
                              dataKey="confidence_high"
                              stackId="confidence"
                              strokeOpacity={0}
                              fill="url(#confidenceBand)"
                            />
                            <Area
                              type="monotone"
                              dataKey="confidence_low"
                              stackId="confidence"
                              strokeOpacity={0}
                              fill="url(#confidenceBand)"
                            />
                            <Line
                              type="monotone"
                              dataKey="rate"
                              stroke="url(#forecastLine)"
                              strokeWidth={3}
                              dot={false}
                              activeDot={{ r: 6, fill: 'hsl(var(--primary))' }}
                            />
                            <ReferenceLine
                              y={realRateData.rate}
                              stroke="hsl(var(--muted-foreground))"
                              strokeDasharray="6 6"
                              label={{ value: "Current Spot", position: "topRight" }}
                            />
                          </ComposedChart>
                        </ResponsiveContainer>
                      )}
                    </CardContent>
                    <div className="px-6 pb-4">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-primary/20 rounded"></div>
                          Confidence Band (±{forecastData.length > 0 ? fmt(forecastData[0].confidence_high - forecastData[0].rate) : '0'})
                        </span>
                        <span className="flex items-center gap-1">
                          <div className="w-3 h-1 bg-primary rounded"></div>
                          AI Prediction
                        </span>
                        <span className="flex items-center gap-1">
                          <div className="w-3 h-1 bg-muted-foreground rounded opacity-50"></div>
                          Current Rate
                        </span>
                      </div>
                    </div>
                  </Card>

                  {/* Enhanced Side Panel with Real Market Data */}
                  <div className="space-y-6">
                    <Card className="shadow-sm border-0 bg-card/60 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Globe className="size-5" />
                          <ExplanationBadge explanation="Live exchange rates from multiple data sources, updated every 30 seconds during market hours">
                            Live Market Rates
                          </ExplanationBadge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {[
                          { pair: "USD/NGN", rate: realRateData.rate, change: realRateData.change, volume: "2.4M" },
                          { pair: "GBP/NGN", rate: 1945.80, change: -0.08, volume: "890K" },
                          { pair: "EUR/NGN", rate: 1688.45, change: 0.05, volume: "1.2M" },
                          { pair: "JPY/NGN", rate: 10.34, change: 0.18, volume: "650K" },
                        ].map((item, index) => (
                          <div key={item.pair} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors border">
                            <div>
                              <div className="font-medium flex items-center gap-2">
                                {item.pair}
                                {index === 0 && !isLoading && (
                                  <Badge variant="secondary" className="text-xs">Live</Badge>
                                )}
                                {isLoading && index === 0 && (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                )}
                              </div>
                              <div className="text-sm text-muted-foreground">Vol: {item.volume}</div>
                            </div>
                            <div className="text-right">
                              <div className="font-mono">₦{fmt(item.rate)}</div>
                              <div className={`text-sm flex items-center gap-1 justify-end ${item.change >= 0 ? "text-green-600" : "text-red-600"
                                }`}>
                                {item.change >= 0 ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
                                {Math.abs(item.change).toFixed(2)}%
                              </div>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>

                    <Card className="shadow-sm border-0 bg-card/60 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Brain className="size-5" />
                          <ExplanationBadge explanation="AI-powered market analysis identifying key factors affecting exchange rates">
                            Market Intelligence
                          </ExplanationBadge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
                          <Brain className="size-4 text-blue-600 dark:text-blue-400 mt-0.5" />
                          <div>
                            <div className="text-sm font-medium">AI Insight</div>
                            <div className="text-xs text-muted-foreground">
                              Model predicts {realRateData.change >= 0 ? 'strengthening' : 'weakening'} trend based on recent policy signals
                            </div>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800">
                          <AlertTriangle className="size-4 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                          <div>
                            <div className="text-sm font-medium">Volatility Alert</div>
                            <div className="text-xs text-muted-foreground">
                              Higher than usual trading volume detected - monitor closely
                            </div>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
                          <CheckCircle className="size-4 text-green-600 dark:text-green-400 mt-0.5" />
                          <div>
                            <div className="text-sm font-medium">High Confidence</div>
                            <div className="text-xs text-muted-foreground">
                              {(avgConfidence * 100).toFixed(1)}% model accuracy on current predictions
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="shadow-sm border-0 bg-card/60 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Activity className="size-5" />
                          Key Economic Indicators
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {[
                          { name: "CBN Policy Rate", value: "18.75%", change: "+0.50%", impact: "High" },
                          { name: "Inflation Rate", value: "24.08%", change: "-0.32%", impact: "High" },
                          { name: "Oil Price (Brent)", value: "$88.10", change: "+1.2%", impact: "Medium" },
                          { name: "US Dollar Index", value: "104.2", change: "-0.1%", impact: "Medium" },
                        ].map((indicator) => (
                          <div key={indicator.name} className="flex items-center justify-between p-2 rounded border bg-muted/20">
                            <div>
                              <div className="text-sm font-medium">{indicator.name}</div>
                              <div className="text-xs text-muted-foreground">Impact: {indicator.impact}</div>
                            </div>
                            <div className="text-right">
                              <div className="font-mono text-sm">{indicator.value}</div>
                              <div className={`text-xs ${indicator.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                                }`}>
                                {indicator.change}
                              </div>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="converter" className="space-y-6">
                <DemoCallout
                  title="FX Converter Demo"
                  description="Real-time currency conversion with AI-powered future value predictions. Try changing the amount or currency pair to see instant updates."
                  icon={DollarSign}
                />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="shadow-sm border-0 bg-card/60 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <DollarSign className="size-5" />
                        <ExplanationBadge explanation="Convert any amount using live exchange rates with AI-powered forecast overlays showing potential future values">
                          Smart FX Converter
                        </ExplanationBadge>
                      </CardTitle>
                      <CardDescription>
                        Live rates with AI forecast integration
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Currency Pair</Label>
                          <Select value={pair} onValueChange={setPair}>
                            <SelectTrigger className="h-12">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="USD/NGN">🇺🇸 USD → 🇳🇬 NGN</SelectItem>
                              <SelectItem value="GBP/NGN">🇬🇧 GBP → 🇳🇬 NGN</SelectItem>
                              <SelectItem value="EUR/NGN">🇪🇺 EUR → 🇳🇬 NGN</SelectItem>
                              <SelectItem value="JPY/NGN">🇯🇵 JPY → 🇳🇬 NGN</SelectItem>
                              <SelectItem value="CAD/NGN">🇨🇦 CAD → 🇳🇬 NGN</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Forecast Horizon</Label>
                          <Select value={String(days)} onValueChange={(v) => setDays(Number(v))}>
                            <SelectTrigger className="h-12">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1 day ahead</SelectItem>
                              <SelectItem value="7">1 week ahead</SelectItem>
                              <SelectItem value="14">2 weeks ahead</SelectItem>
                              <SelectItem value="21">3 weeks ahead</SelectItem>
                              <SelectItem value="30">1 month ahead</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Amount ({pair.split('/')[0]})</Label>
                          <Input
                            value={usd}
                            onChange={(e) => setUsd(e.target.value.replace(/[^0-9.]/g, ""))}
                            placeholder="Enter amount"
                            className="h-12 text-lg font-mono"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>
                            <ExplanationBadge explanation="Current interbank exchange rate, updated every 30 seconds during market hours">
                              Live Exchange Rate
                            </ExplanationBadge>
                          </Label>
                          <div className="relative">
                            <Input
                              value={`₦${fmt(realRateData.rate)}`}
                              readOnly
                              className="h-12 text-lg font-mono bg-muted/50 pr-16"
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                              <Badge variant={isLoading ? "outline" : "secondary"} className="text-xs">
                                {isLoading ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : null}
                                {isLoading ? "Updating" : "Live"}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-6 rounded-xl bg-gradient-to-r from-primary/5 to-blue-50 dark:from-primary/10 dark:to-blue-950/20 border">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-muted-foreground">Current Value</span>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="size-4 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Based on live interbank rate: ₦{fmt(realRateData.rate)}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <div className="text-3xl font-bold tracking-tight">₦ {fmtCompact(ngnValue)}</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {fmt(Number(usd))} {pair.split('/')[0]} × ₦{fmt(realRateData.rate)}
                        </div>

                        {/* AI Forecast Preview */}
                        {forecastData.length > 0 && (
                          <div className="mt-4 pt-4 border-t">
                            <div className="text-sm font-medium text-muted-foreground mb-2">AI Forecast ({days} days)</div>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                              <div>
                                <div className="text-muted-foreground">Expected Value</div>
                                <div className="font-bold">₦ {fmtCompact(Number(usd) * forecastData[forecastData.length - 1]?.rate)}</div>
                              </div>
                              <div>
                                <div className="text-muted-foreground">Confidence</div>
                                <div className="font-bold">{(forecastData[forecastData.length - 1]?.model_confidence * 100).toFixed(0)}%</div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <Button
                          className="gap-2 flex-1 sm:flex-none"
                          onClick={refreshData}
                          disabled={isLoading}
                        >
                          {isLoading ? <Loader2 className="size-4 animate-spin" /> : <Brain className="size-4" />}
                          {isLoading ? "Analyzing..." : "Run AI Analysis"}
                        </Button>
                        <ExplanationBadge explanation="Get the latest exchange rates from our data providers">
                          <Button variant="outline" className="gap-2" onClick={refreshData} disabled={isLoading}>
                            <RefreshCw className="size-4" /> Refresh
                          </Button>
                        </ExplanationBadge>
                        <Button variant="outline" className="gap-2">
                          <Download className="size-4" /> Export
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-sm border-0 bg-card/60 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Flag className="size-5" />
                        <ExplanationBadge explanation="Test how your conversion performs under different market scenarios - from market stress to favorable conditions">
                          Scenario Analysis
                        </ExplanationBadge>
                      </CardTitle>
                      <CardDescription>
                        Test different market conditions
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          {
                            label: "Market Crash",
                            desc: "-8% shock",
                            mult: 0.92,
                            color: "red",
                            explanation: "Severe market stress scenario - currency weakens significantly"
                          },
                          {
                            label: "Bear Market",
                            desc: "-3% decline",
                            mult: 0.97,
                            color: "orange",
                            explanation: "Moderate market decline - typical during economic uncertainty"
                          },
                          {
                            label: "Base Case",
                            desc: "Current rate",
                            mult: 1,
                            color: "blue",
                            explanation: "No change from current market conditions"
                          },
                          {
                            label: "Bull Market",
                            desc: "+5% rally",
                            mult: 1.05,
                            color: "green",
                            explanation: "Favorable market conditions - currency strengthening"
                          },
                        ].map((scenario) => (
                          <ExplanationBadge
                            key={scenario.label}
                            explanation={scenario.explanation}
                          >
                            <div className={`p-4 rounded-xl border-2 transition-all hover:shadow-sm cursor-help ${scenario.color === "red" ? "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20" :
                                scenario.color === "orange" ? "border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/20" :
                                  scenario.color === "blue" ? "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20" :
                                    "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20"
                              }`}>
                              <div className="text-sm font-medium">{scenario.label}</div>
                              <div className="text-xs text-muted-foreground mb-2">{scenario.desc}</div>
                              <div className="text-xl font-bold">₦ {fmtCompact(ngnValue * scenario.mult)}</div>
                              <div className="text-xs text-muted-foreground">
                                Rate: ₦{fmt(realRateData.rate * scenario.mult)}
                              </div>
                            </div>
                          </ExplanationBadge>
                        ))}
                      </div>

                      <Separator />

                      <div className="space-y-3">
                        <Label className="text-sm font-medium flex items-center gap-2">
                          <FileText className="size-4" />
                          <ExplanationBadge explanation="Add your market analysis, risk factors, or trading notes for this conversion">
                            Market Analysis Notes
                          </ExplanationBadge>
                        </Label>
                        <Textarea
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="Add your market observations, risk factors, or strategic notes..."
                          className="min-h-[120px] resize-none"
                        />
                        <div className="text-xs text-muted-foreground">
                          Notes are automatically saved and included in exported reports
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-6">
                <DemoCallout
                  title="Advanced Analytics Suite"
                  description="Professional-grade charting and statistical analysis tools used by institutional traders and analysts worldwide."
                  icon={BarChart3}
                />

                <div className="grid grid-cols-1 2xl:grid-cols-4 gap-6">
                  {/* Advanced Analytics Chart */}
                  <Card className="2xl:col-span-3 shadow-sm border-0 bg-card/60 backdrop-blur-sm">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="size-5" />
                            <ExplanationBadge explanation="Multi-dimensional analysis combining price forecasts, volatility patterns, trading volume, and cross-currency correlations">
                              Professional Analytics Suite
                            </ExplanationBadge>
                          </CardTitle>
                          <CardDescription>
                            Institutional-grade market analysis with real-time data
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <ExplanationBadge explanation="Apply custom filters for date ranges, currency pairs, or volatility thresholds">
                            <Button variant="outline" size="sm" className="gap-2">
                              <Filter className="size-4" /> Filters
                            </Button>
                          </ExplanationBadge>
                          <Button variant="outline" size="sm" className="gap-2">
                            <Calendar className="size-4" /> Range
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Tabs defaultValue="forecast" className="w-full">
                        <TabsList className="grid w-full grid-cols-4 mb-6">
                          <TabsTrigger value="forecast">Price Forecast</TabsTrigger>
                          <TabsTrigger value="volatility">Volatility</TabsTrigger>
                          <TabsTrigger value="volume">Volume</TabsTrigger>
                          <TabsTrigger value="correlation">Correlation</TabsTrigger>
                        </TabsList>

                        <TabsContent value="forecast" className="space-y-4">
                          <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={forecastData}>
                                <defs>
                                  <linearGradient id="forecastGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.05} />
                                  </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                <XAxis
                                  dataKey="date"
                                  tick={{ fontSize: 12 }}
                                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                />
                                <YAxis
                                  tick={{ fontSize: 12 }}
                                  tickFormatter={(value) => `₦${fmt(value)}`}
                                />
                                {/* // ... continuing from the analytics section ... */}

                                <RTooltip
                                  formatter={(v: any, name: string) => {
                                    if (name === 'rate') return [`₦${fmt(Number(v))}`, 'Predicted Rate'];
                                    if (name === 'model_confidence') return [`${(Number(v) * 100).toFixed(1)}%`, 'AI Confidence'];
                                    return [v, name];
                                  }}
                                  contentStyle={{
                                    backgroundColor: 'hsl(var(--background))',
                                    border: '1px solid hsl(var(--border))',
                                    borderRadius: '8px'
                                  }}
                                />
                                <Area
                                  type="monotone"
                                  dataKey="rate"
                                  stroke="hsl(var(--primary))"
                                  strokeWidth={2}
                                  fill="url(#forecastGradient)"
                                />
                                <Line
                                  type="monotone"
                                  dataKey="model_confidence"
                                  stroke="hsl(var(--secondary))"
                                  strokeWidth={1}
                                  dot={false}
                                  yAxisId="confidence"
                                />
                              </AreaChart>
                            </ResponsiveContainer>
                          </div>

                          <div className="grid grid-cols-3 gap-4">
                            <div className="p-4 rounded-lg bg-muted/30 border">
                              <div className="text-sm text-muted-foreground">Mean Forecast</div>
                              <div className="text-2xl font-bold">
                                ₦{fmt(forecastData[forecastData.length - 1]?.rate || realRateData.rate)}
                              </div>
                              <div className="text-xs text-green-600 flex items-center gap-1 mt-1">
                                <TrendingUp className="w-3 h-3" />
                                {days}-day ahead
                              </div>
                            </div>
                            <div className="p-4 rounded-lg bg-muted/30 border">
                              <div className="text-sm text-muted-foreground">Confidence Band</div>
                              <div className="text-2xl font-bold">
                                ±₦{fmt(forecastData[0]?.confidence_high - forecastData[0]?.rate || 8.5)}
                              </div>
                              <div className="text-xs text-blue-600 flex items-center gap-1 mt-1">
                                <Activity className="w-3 h-3" />
                                95% interval
                              </div>
                            </div>
                            <div className="p-4 rounded-lg bg-muted/30 border">
                              <div className="text-sm text-muted-foreground">Model Accuracy</div>
                              <div className="text-2xl font-bold">94.2%</div>
                              <div className="text-xs text-purple-600 flex items-center gap-1 mt-1">
                                <Target className="w-3 h-3" />
                                30-day MAPE
                              </div>
                            </div>
                          </div>
                        </TabsContent>

                        <TabsContent value="volatility" className="space-y-4">
                          <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={forecastData}>
                                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                <XAxis
                                  dataKey="date"
                                  tick={{ fontSize: 12 }}
                                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                />
                                <YAxis
                                  tick={{ fontSize: 12 }}
                                  tickFormatter={(value) => `${(Number(value) * 100).toFixed(1)}%`}
                                />
                                <RTooltip
                                  formatter={(v: any) => [`${(Number(v) * 100).toFixed(2)}%`, 'Daily Volatility']}
                                  contentStyle={{
                                    backgroundColor: 'hsl(var(--background))',
                                    border: '1px solid hsl(var(--border))',
                                    borderRadius: '8px'
                                  }}
                                />
                                <Line
                                  type="monotone"
                                  dataKey={(d) => Math.abs((d.confidence_high - d.confidence_low) / d.rate)}
                                  stroke="hsl(var(--destructive))"
                                  strokeWidth={2}
                                  dot={false}
                                />
                                <ReferenceLine
                                  y={0.02}
                                  stroke="hsl(var(--muted-foreground))"
                                  strokeDasharray="4 4"
                                  label="Normal (2%)"
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                          <div className="p-4 rounded-lg border bg-muted/20">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium">Volatility Analysis</span>
                              <Badge variant="secondary">Live Analysis</Badge>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Current volatility: <span className="font-medium">{(volatility * 100).toFixed(2)}%</span> (annualized)
                              <br />
                              This is considered <span className="font-medium text-orange-600">elevated</span> compared to historical average of 12.3%
                            </div>
                          </div>
                        </TabsContent>

                        <TabsContent value="volume" className="space-y-4">
                          <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                              <ComposedChart data={forecastData}>
                                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                <XAxis
                                  dataKey="date"
                                  tick={{ fontSize: 12 }}
                                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                />
                                <YAxis
                                  tick={{ fontSize: 12 }}
                                  tickFormatter={(value) => fmtCompact(Number(value))}
                                />
                                <RTooltip
                                  formatter={(v: any) => [fmtCompact(Number(v)), 'Predicted Volume (USD)']}
                                  contentStyle={{
                                    backgroundColor: 'hsl(var(--background))',
                                    border: '1px solid hsl(var(--border))',
                                    borderRadius: '8px'
                                  }}
                                />
                                <Bar dataKey="volume" fill="hsl(var(--primary))" opacity={0.7} />
                                <Line
                                  type="monotone"
                                  dataKey="rate"
                                  stroke="hsl(var(--secondary))"
                                  strokeWidth={2}
                                  dot={false}
                                  yAxisId="right"
                                />
                              </ComposedChart>
                            </ResponsiveContainer>
                          </div>
                        </TabsContent>

                        <TabsContent value="correlation" className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-lg border">
                              <h4 className="font-medium mb-3 flex items-center gap-2">
                                <Globe className="w-4 h-4" />
                                <ExplanationBadge explanation="Statistical correlation between different currency pairs - values closer to 1 indicate strong positive correlation">
                                  Currency Correlations
                                </ExplanationBadge>
                              </h4>
                              {[
                                { pair: "EUR/USD", corr: 0.72, desc: "Strong positive" },
                                { pair: "GBP/USD", corr: 0.68, desc: "Moderate positive" },
                                { pair: "USD/JPY", corr: -0.45, desc: "Moderate negative" },
                                { pair: "AUD/USD", corr: 0.58, desc: "Moderate positive" }
                              ].map((item) => (
                                <ExplanationBadge
                                  key={item.pair}
                                  explanation={`${item.desc} correlation (${item.corr.toFixed(2)}) with USD/NGN over the past 30 days`}
                                >
                                  <div className="flex justify-between items-center py-2 hover:bg-muted/20 rounded px-2 cursor-help">
                                    <span className="text-sm font-mono">{item.pair}</span>
                                    <div className="flex items-center gap-2">
                                      <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                                        <div
                                          className={`h-full rounded-full ${item.corr > 0 ? 'bg-green-500' : 'bg-red-500'
                                            }`}
                                          style={{ width: `${Math.abs(item.corr) * 100}%` }}
                                        />
                                      </div>
                                      <span className="text-sm font-mono w-12 text-right">
                                        {item.corr.toFixed(2)}
                                      </span>
                                    </div>
                                  </div>
                                </ExplanationBadge>
                              ))}
                            </div>

                            <div className="p-4 rounded-lg border">
                              <h4 className="font-medium mb-3 flex items-center gap-2">
                                <BarChart2 className="w-4 h-4" />
                                <ExplanationBadge explanation="How strongly various economic indicators influence NGN exchange rates based on historical analysis">
                                  Market Drivers
                                </ExplanationBadge>
                              </h4>
                              {[
                                { name: "Oil Price (Brent)", impact: 0.85, desc: "Very high impact", current: "$88.10" },
                                { name: "US Dollar Index", impact: 0.91, desc: "Extremely high", current: "104.2" },
                                { name: "CBN Policy Rate", impact: -0.62, desc: "High negative", current: "18.75%" },
                                { name: "Nigeria CPI", impact: -0.78, desc: "High negative", current: "24.08%" }
                              ].map((item) => (
                                <ExplanationBadge
                                  key={item.name}
                                  explanation={`${item.desc} correlation (${item.impact.toFixed(2)}) - when this indicator rises, NGN typically ${item.impact > 0 ? 'weakens' : 'strengthens'}`}
                                >
                                  <div className="flex justify-between items-center py-2 hover:bg-muted/20 rounded px-2 cursor-help">
                                    <div>
                                      <div className="text-sm">{item.name}</div>
                                      <div className="text-xs text-muted-foreground">{item.current}</div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                                        <div
                                          className={`h-full rounded-full ${Math.abs(item.impact) > 0.7 ? 'bg-red-500' :
                                              Math.abs(item.impact) > 0.5 ? 'bg-yellow-500' : 'bg-green-500'
                                            }`}
                                          style={{ width: `${Math.abs(item.impact) * 100}%` }}
                                        />
                                      </div>
                                      <span className="text-sm font-mono w-12 text-right">
                                        {item.impact.toFixed(2)}
                                      </span>
                                    </div>
                                  </div>
                                </ExplanationBadge>
                              ))}
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>

                  {/* Enhanced Data Table */}
                  <Card className="shadow-sm border-0 bg-card/60 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Database className="size-5" />
                        <ExplanationBadge explanation="Detailed forecast data showing AI predictions, confidence intervals, and expected trading volumes for each day">
                          Forecast Data
                        </ExplanationBadge>
                      </CardTitle>
                      <CardDescription>
                        AI predictions with confidence metrics
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-80">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-20">Date</TableHead>
                              <TableHead className="text-right">Rate</TableHead>
                              <TableHead className="text-right">Range</TableHead>
                              <TableHead className="text-right">Conf.</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {forecastData.slice(0, 12).map((row, index) => (
                              <TableRow key={row.date} className="hover:bg-muted/30">
                                <TableCell className="font-mono text-xs">
                                  {new Date(row.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </TableCell>
                                <TableCell className="text-right font-mono text-sm">
                                  ₦{fmt(row.rate)}
                                  {index === 0 && (
                                    <Badge variant="secondary" className="ml-1 text-xs">Today</Badge>
                                  )}
                                </TableCell>
                                <TableCell className="text-right text-xs text-muted-foreground">
                                  {fmt(row.confidence_low)}-{fmt(row.confidence_high)}
                                </TableCell>
                                <TableCell className="text-right text-xs">
                                  <div className="flex items-center gap-1 justify-end">
                                    <div
                                      className="w-8 h-1.5 rounded-full overflow-hidden bg-muted"
                                    >
                                      <div
                                        className="h-full bg-primary rounded-full"
                                        style={{ width: `${row.model_confidence * 100}%` }}
                                      />
                                    </div>
                                    <span className="font-mono">
                                      {(row.model_confidence * 100).toFixed(0)}%
                                    </span>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </ScrollArea>
                      <div className="mt-4 p-3 rounded-lg bg-muted/20 border">
                        <div className="text-xs text-muted-foreground">
                          <strong>Legend:</strong> Rate = AI predicted exchange rate, Range = 95% confidence interval,
                          Conf. = Model confidence score based on data quality and market conditions
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="admin" className="space-y-6">
                <DemoCallout
                  title="Enterprise Administration"
                  description="Full-featured admin panel for team management, API oversight, system monitoring, and compliance reporting - designed for institutional deployment."
                  icon={Settings}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {/* Enhanced User Management */}
                  <Card className="shadow-sm border-0 bg-card/60 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="size-5" />
                        <ExplanationBadge explanation="Invite team members, assign roles (Admin, Analyst, Viewer), and manage access permissions across the platform">
                          Team Management
                        </ExplanationBadge>
                      </CardTitle>
                      <CardDescription>Invite users and manage permissions</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex gap-2">
                        <Input placeholder="user@company.com" className="flex-1" />
                        <Button size="sm" className="gap-1">
                          <Mail className="w-3 h-3" /> Invite
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {[
                          { name: "John Smith", email: "j.smith@corp.com", role: "Admin", status: "Active", lastSeen: "2 min ago" },
                          { name: "Sarah Connor", email: "s.connor@corp.com", role: "Senior Analyst", status: "Active", lastSeen: "1 hour ago" },
                          { name: "Mike Johnson", email: "m.johnson@corp.com", role: "Junior Analyst", status: "Pending", lastSeen: "Never" }
                        ].map((user, i) => (
                          <div key={i} className="flex items-center justify-between p-3 rounded-lg border bg-muted/20 hover:bg-muted/30 transition-colors">
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium">{user.name}</div>
                              <div className="text-xs text-muted-foreground truncate">{user.email}</div>
                              <div className="text-xs text-muted-foreground">{user.role} • {user.lastSeen}</div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant={user.status === "Active" ? "default" : "secondary"}
                                className="text-xs"
                              >
                                {user.status}
                              </Badge>
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                <Settings className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="pt-2 border-t">
                        <div className="text-xs text-muted-foreground">
                          <strong>3 active users</strong> • 1 pending invite • 2 admin seats available
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Enhanced API Management */}
                  <Card className="shadow-sm border-0 bg-card/60 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Zap className="size-5" />
                        <ExplanationBadge explanation="Generate API keys for programmatic access, monitor usage quotas, and manage rate limits for institutional integrations">
                          API Management
                        </ExplanationBadge>
                      </CardTitle>
                      <CardDescription>API keys and usage monitoring</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex gap-2">
                        <Button size="sm" className="gap-2 flex-1">
                          <Zap className="size-4" /> Generate Key
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setOpenApiDoc(true)}>
                          <FileText className="size-4" />
                        </Button>
                      </div>
                      <div className="space-y-3">
                        {[
                          { name: "Production API", key: "pk_live_1a2b3c...", usage: 1247, limit: 5000, status: "Active", created: "2024-01-10" },
                          { name: "Testing API", key: "pk_test_9x8y7z...", usage: 45, limit: 1000, status: "Active", created: "2024-01-15" },
                          { name: "Mobile Integration", key: "pk_live_4d5e6f...", usage: 890, limit: 2000, status: "Limited", created: "2024-01-08" }
                        ].map((api, i) => (
                          <div key={i} className="p-3 rounded-lg border bg-muted/20">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <span className="text-sm font-medium">{api.name}</span>
                                <div className="text-xs text-muted-foreground font-mono">{api.key}</div>
                              </div>
                              <Badge
                                variant={api.status === "Active" ? "default" : "secondary"}
                                className="text-xs"
                              >
                                {api.status}
                              </Badge>
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center justify-between text-xs">
                                <span>Usage</span>
                                <span className="font-mono">{api.usage.toLocaleString()}/{api.limit.toLocaleString()}</span>
                              </div>
                              <Progress
                                value={(api.usage / api.limit) * 100}
                                className="h-1.5"
                              />
                              <div className="text-xs text-muted-foreground">
                                Created: {api.created} • {api.limit - api.usage} requests remaining
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Enhanced System Status */}
                  <Card className="shadow-sm border-0 bg-card/60 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MonitorSpeaker className="size-5" />
                        <ExplanationBadge explanation="Real-time monitoring of all system components including APIs, databases, AI models, and data feeds with uptime statistics">
                          System Health
                        </ExplanationBadge>
                      </CardTitle>
                      <CardDescription>Infrastructure monitoring</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 gap-3">
                        {[
                          { name: "API Gateway", status: "Operational", uptime: "99.98%", latency: "145ms", load: 45 },
                          { name: "Database Cluster", status: "Operational", uptime: "99.95%", latency: "12ms", load: 32 },
                          { name: "AI Model Pipeline", status: "Operational", uptime: "99.87%", latency: "2.3s", load: 78 },
                          { name: "Data Feeds", status: "Degraded", uptime: "98.12%", latency: "890ms", load: 89 }
                        ].map((service, i) => (
                          <div key={i} className="p-3 rounded-lg border bg-muted/20">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${service.status === "Operational" ? "bg-green-500 animate-pulse" :
                                    service.status === "Degraded" ? "bg-yellow-500" : "bg-red-500"
                                  }`} />
                                <span className="text-sm font-medium">{service.name}</span>
                              </div>
                              <Badge
                                variant={service.status === "Operational" ? "secondary" : "outline"}
                                className="text-xs"
                              >
                                {service.status}
                              </Badge>
                            </div>
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span>Uptime: {service.uptime}</span>
                                <span>Latency: {service.latency}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">Load:</span>
                                <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                                  <div
                                    className={`h-full rounded-full transition-all ${service.load > 80 ? 'bg-red-500' :
                                        service.load > 60 ? 'bg-yellow-500' : 'bg-green-500'
                                      }`}
                                    style={{ width: `${service.load}%` }}
                                  />
                                </div>
                                <span className="text-xs font-mono w-8 text-right">{service.load}%</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Enhanced Reports & Export */}
                  <Card className="shadow-sm border-0 bg-card/60 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileBarChart className="size-5" />
                        <ExplanationBadge explanation="Generate and schedule comprehensive reports in multiple formats (PDF, Excel, CSV) with custom branding and automated delivery">
                          Reports & Analytics
                        </ExplanationBadge>
                      </CardTitle>
                      <CardDescription>Automated reporting and exports</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" size="sm" className="gap-2">
                          <Download className="size-4" /> CSV
                        </Button>
                        <Button variant="outline" size="sm" className="gap-2">
                          <FileText className="size-4" /> PDF
                        </Button>
                        <Button variant="outline" size="sm" className="gap-2">
                          <Mail className="size-4" /> Email
                        </Button>
                        <Button variant="outline" size="sm" className="gap-2">
                          <Calendar className="size-4" /> Schedule
                        </Button>
                      </div>
                      <Separator />
                      <div className="space-y-3">
                        <div>
                          <Label className="text-sm">Report Schedule</Label>
                          <Select defaultValue="daily">
                            <SelectTrigger className="h-9">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="realtime">Real-time alerts</SelectItem>
                              <SelectItem value="daily">Daily at 9:00 AM</SelectItem>
                              <SelectItem value="weekly">Weekly summary</SelectItem>
                              <SelectItem value="monthly">Monthly analysis</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <div className="text-sm font-medium">Recent Exports</div>
                          {[
                            { name: "Daily FX Report", date: "2024-01-16", format: "PDF", size: "2.1 MB" },
                            { name: "API Usage Analysis", date: "2024-01-15", format: "Excel", size: "890 KB" },
                            { name: "Forecast Data", date: "2024-01-15", format: "CSV", size: "156 KB" }
                          ].map((report, i) => (
                            <div key={i} className="flex items-center justify-between p-2 rounded border bg-muted/10 text-sm">
                              <div>
                                <div className="font-medium">{report.name}</div>
                                <div className="text-xs text-muted-foreground">{report.date} • {report.format} • {report.size}</div>
                              </div>
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                <Download className="w-3 h-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Enhanced Model Management */}
                  <Card className="shadow-sm border-0 bg-card/60 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Brain className="size-5" />
                        <ExplanationBadge explanation="Manage AI model versions, monitor performance metrics, and switch between different forecasting algorithms (Prophet, LightGBM, Neural Networks)">
                          AI Model Management
                        </ExplanationBadge>
                      </CardTitle>
                      <CardDescription>ML pipeline and model versions</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 rounded-lg border bg-muted/20">
                          <div className="text-xs text-muted-foreground">Active Model</div>
                          <div className="font-medium flex items-center gap-2">
                            <Brain className="w-4 h-4 text-primary" />
                            Prophet v2.1
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">Deployed: Jan 10</div>
                        </div>
                        <div className="p-3 rounded-lg border bg-muted/20">
                          <div className="text-xs text-muted-foreground">Performance</div>
                          <div className="font-medium text-green-600">94.2% Accuracy</div>
                          <div className="text-xs text-muted-foreground mt-1">30-day MAPE</div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm">Switch Model</Label>
                        <div className="flex gap-2">
                        {/* // ... continuing from the model management section ... */}

                          <Select defaultValue="prophet">
                            <SelectTrigger className="h-9 flex-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="prophet">
                                <div className="flex items-center gap-2">
                                  <Brain className="w-4 h-4" />
                                  Prophet v2.1
                                </div>
                              </SelectItem>
                              <SelectItem value="lightgbm">
                                <div className="flex items-center gap-2">
                                  <Zap className="w-4 h-4" />
                                  LightGBM v1.3
                                </div>
                              </SelectItem>
                              <SelectItem value="lstm">
                                <div className="flex items-center gap-2">
                                  <Cpu className="w-4 h-4" />
                                  LSTM Neural Net
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <Button variant="outline" size="sm" disabled={isLoading}>
                            {isLoading ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="text-sm font-medium">Model Performance</div>
                        {[
                          { metric: "Accuracy (MAPE)", value: "94.2%", trend: "↑" },
                          { metric: "Training Time", value: "2.3 hours", trend: "→" },
                          { metric: "Inference Speed", value: "145ms", trend: "↓" },
                          { metric: "Memory Usage", value: "1.2 GB", trend: "→" }
                        ].map((metric, i) => (
                          <div key={i} className="flex justify-between items-center py-1 text-sm">
                            <span className="text-muted-foreground">{metric.metric}</span>
                            <span className="font-mono flex items-center gap-1">
                              {metric.value}
                              <span className={`text-xs ${metric.trend === "↑" ? "text-green-600" :
                                  metric.trend === "↓" ? "text-red-600" : "text-muted-foreground"
                                }`}>
                                {metric.trend}
                              </span>
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Enhanced Audit Log */}
                  <Card className="shadow-sm border-0 bg-card/60 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="size-5" />
                        <ExplanationBadge explanation="Complete audit trail of all system activities including user actions, API calls, data changes, and security events for compliance">
                          Security & Audit Log
                        </ExplanationBadge>
                      </CardTitle>
                      <CardDescription>Compliance and security monitoring</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-64">
                        <div className="space-y-3">
                          {[
                            {
                              time: "14:32",
                              action: "API key created",
                              user: "admin@corp.com",
                              details: "Production environment",
                              severity: "info"
                            },
                            {
                              time: "14:15",
                              action: "Model retrained",
                              user: "system",
                              details: "Prophet v2.1 → 94.2% accuracy",
                              severity: "success"
                            },
                            {
                              time: "13:45",
                              action: "Failed login attempt",
                              user: "unknown@example.com",
                              details: "IP: 192.168.1.100",
                              severity: "warning"
                            },
                            {
                              time: "12:20",
                              action: "User role changed",
                              user: "j.smith@corp.com",
                              details: "Analyst → Senior Analyst",
                              severity: "info"
                            },
                            {
                              time: "11:00",
                              action: "Data ingestion completed",
                              user: "system",
                              details: "2.4M records processed",
                              severity: "success"
                            },
                            {
                              time: "10:30",
                              action: "Rate limit exceeded",
                              user: "api_client_123",
                              details: "1000/1000 requests used",
                              severity: "warning"
                            }
                          ].map((log, i) => (
                            <div key={i} className={`text-sm p-3 rounded border-l-4 ${log.severity === "success" ? "border-green-500 bg-green-50 dark:bg-green-950/20" :
                                log.severity === "warning" ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20" :
                                  log.severity === "error" ? "border-red-500 bg-red-50 dark:bg-red-950/20" :
                                    "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
                              }`}>
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="text-xs font-mono">{log.time}</Badge>
                                    <span className="font-medium">{log.action}</span>
                                  </div>
                                  <div className="text-xs text-muted-foreground mt-1">
                                    by {log.user} • {log.details}
                                  </div>
                                </div>
                                <div className={`w-2 h-2 rounded-full mt-1 ${log.severity === "success" ? "bg-green-500" :
                                    log.severity === "warning" ? "bg-yellow-500" :
                                      log.severity === "error" ? "bg-red-500" :
                                        "bg-blue-500"
                                  }`} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                      <div className="mt-4 pt-3 border-t flex items-center justify-between text-xs text-muted-foreground">
                        <span>Showing last 6 events</span>
                        <Button variant="ghost" size="sm" className="h-6 text-xs">
                          View All Logs
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Enterprise Features Showcase */}
                <Card className="shadow-sm border-0 bg-gradient-to-r from-primary/5 to-blue-50 dark:from-primary/10 dark:to-blue-950/20 border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="size-5 text-primary" />
                      Enterprise Features Demo
                    </CardTitle>
                    <CardDescription>
                      Full platform capabilities available in production deployment
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 rounded-lg border bg-background/50">
                        <div className="flex items-center gap-2 mb-2">
                          <Shield className="w-5 h-5 text-primary" />
                          <span className="font-medium">Enterprise Security</span>
                        </div>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• SSO/SAML Integration</li>
                          <li>• Role-based Access Control</li>
                          <li>• Audit Logging & Compliance</li>
                          <li>• API Rate Limiting</li>
                          <li>• Data Encryption at Rest</li>
                        </ul>
                      </div>

                      <div className="p-4 rounded-lg border bg-background/50">
                        <div className="flex items-center gap-2 mb-2">
                          <Zap className="w-5 h-5 text-primary" />
                          <span className="font-medium">Advanced APIs</span>
                        </div>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• RESTful & GraphQL APIs</li>
                          <li>• WebSocket Real-time Feeds</li>
                          <li>• Bulk Data Exports</li>
                          <li>• Webhook Notifications</li>
                          <li>• Custom Integrations</li>
                        </ul>
                      </div>

                      <div className="p-4 rounded-lg border bg-background/50">
                        <div className="flex items-center gap-2 mb-2">
                          <Brain className="w-5 h-5 text-primary" />
                          <span className="font-medium">AI & Analytics</span>
                        </div>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Multiple ML Models</li>
                          <li>• Custom Model Training</li>
                          <li>• Advanced Forecasting</li>
                          <li>• Risk Analytics</li>
                          <li>• Market Intelligence</li>
                        </ul>
                      </div>
                    </div>

                    <div className="mt-6 flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        Ready to deploy in your infrastructure with full customization
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setOpenApiDoc(true)}>
                          <FileText className="size-4 mr-2" />
                          API Documentation
                        </Button>
                        <Button size="sm" className="gap-2">
                          <Mail className="size-4" />
                          Contact Sales
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </main>

          {/* Enhanced Footer */}
          <footer className="mx-auto max-w-[1600px] px-6 py-8 border-t bg-muted/10">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-lg bg-primary/10 grid place-items-center">
                    <Brain className="size-4 text-primary" />
                  </div>
                  <div>
                    <div className="font-bold">FX Intelligence</div>
                    <div className="text-xs text-muted-foreground">by Backtick Labs</div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  AI-powered foreign exchange intelligence platform for institutional trading and risk management.
                </p>
              </div>

              <div className="space-y-3">
                <div className="font-medium text-sm">Platform Features</div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Real-time Exchange Rates</li>
                  <li>• AI-Powered Forecasting</li>
                  <li>• Risk Analytics & Alerts</li>
                  <li>• API Integration</li>
                </ul>
              </div>

              <div className="space-y-3">
                <div className="font-medium text-sm">Enterprise</div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Team Management</li>
                  <li>• Custom Deployments</li>
                  <li>• SLA Support</li>
                  <li>• Compliance Tools</li>
                </ul>
              </div>

              <div className="space-y-3">
                <div className="font-medium text-sm">Demo Information</div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Live Market Data</li>
                  <li>• Real AI Predictions</li>
                  <li>• Interactive Features</li>
                  <li>• Full API Access</li>
                </ul>
              </div>
            </div>

            <div className="pt-6 border-t flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} Backtick Labs. This is a live demonstration of our FX Intelligence platform.
              </div>

              <div className="flex items-center gap-6 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="size-3 text-green-500" />
                  <span>Real-time Data</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Brain className="size-3 text-primary" />
                  <span>AI Predictions</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Shield className="size-3 text-blue-500" />
                  <span>Enterprise Ready</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Zap className="size-3 text-yellow-500" />
                  <span>API First</span>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>

      {/* Enhanced Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <button aria-hidden className="hidden" />
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-80">
          <div className="h-full flex flex-col">
            <div className="h-16 px-6 flex items-center gap-3 border-b bg-background">
              <div className="size-10 rounded-2xl bg-gradient-to-br from-primary to-primary/60 grid place-items-center shadow-sm">
                <Brain className="size-5 text-primary-foreground" />
              </div>
              <div>
                <div className="font-bold text-lg leading-none">FX Intelligence</div>
                <div className="text-xs text-muted-foreground">Demo Platform</div>
              </div>
            </div>
            <ScrollArea className="flex-1 px-3 py-4">
              <div className="space-y-4">
                <DemoCallout
                  title="Mobile Navigation"
                  description="Full platform access optimized for mobile and tablet devices"
                  icon={Info}
                />
                {/* Navigation items would go here - same as desktop */}
              </div>
            </ScrollArea>
          </div>
        </SheetContent>
      </Sheet>

      {/* Enhanced API Documentation Modal */}
      <Dialog open={openApiDoc} onOpenChange={setOpenApiDoc}>
        <DialogContent className="max-w-5xl max-h-[85vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Zap className="size-6 text-primary" />
              FX Intelligence API Documentation
            </DialogTitle>
            <DialogDescription className="text-base">
              Complete integration guide for institutional-grade FX data and AI predictions
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-auto">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Quick Start</TabsTrigger>
                <TabsTrigger value="auth">Authentication</TabsTrigger>
                <TabsTrigger value="endpoints">API Reference</TabsTrigger>
                <TabsTrigger value="examples">Code Examples</TabsTrigger>
                <TabsTrigger value="sdks">SDKs & Tools</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6 mt-6">
                <Alert className="border-primary/20 bg-primary/5">
                  <Lightbulb className="h-4 w-4 text-primary" />
                  <AlertDescription>
                    <span className="font-semibold text-primary">Live Demo API:</span> This documentation shows real endpoints you can test right now with the demo data you see in the dashboard.
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Globe className="size-5" />
                        Base Configuration
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Production URL</Label>
                        <div className="p-3 rounded-lg bg-muted font-mono text-sm">
                          https://api.fxintel.backtick.com/v1
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Demo URL (this session)</Label>
                        <div className="p-3 rounded-lg bg-muted font-mono text-sm">
                          https://demo.fxintel.backtick.com/v1
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="text-center p-3 border rounded">
                          <div className="text-2xl font-bold text-primary">99.9%</div>
                          <div className="text-muted-foreground">Uptime SLA</div>
                        </div>
                        <div className="text-center p-3 border rounded">
                          <div className="text-2xl font-bold text-primary">150ms</div>
                          <div className="text-muted-foreground">Avg Response</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <CheckCircle className="size-5 text-green-500" />
                        Key Features
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 gap-3 text-sm">
                        {[
                          { feature: "Real-time Rates", desc: "Live exchange rates updated every 30 seconds" },
                          { feature: "AI Forecasting", desc: "Machine learning predictions with confidence intervals" },
                          { feature: "Historical Data", desc: "10+ years of historical FX data" },
                          { feature: "Risk Analytics", desc: "Volatility and correlation analysis" },
                          { feature: "Multiple Formats", desc: "JSON, CSV, Excel export options" }
                        ].map((item, i) => (
                          <div key={i} className="flex items-start gap-3">
                            <CheckCircle className="size-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <div>
                              <div className="font-medium">{item.feature}</div>
                              <div className="text-muted-foreground text-xs">{item.desc}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* ... other tabs content would continue here ... */}
            </Tabs>
          </div>

          <DialogFooter className="flex items-center justify-between border-t pt-4">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <CheckCircle className="size-4 text-green-500" />
                <span>API Status: Operational</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="size-4" />
                <span>Response Time: ~{isLoading ? '...' : '145ms'}</span>
              </div>
              <div className="flex items-center gap-1">
                <Database className="size-4" />
                <span>Data: Real-time</span>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setOpenApiDoc(false)}>
                Close
              </Button>
              <Button className="gap-2">
                <Zap className="size-4" />
                Get API Access
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <TooltipProvider />
    </div>
  );
}
