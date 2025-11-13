"use client"

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar"
import { StatsCard } from "@/components/layout/stats-card"
import { DollarSign, ShoppingCart, Users, GraduationCap, Video } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts'
import { 
  getKPIs, 
  getRevenueSeries, 
  getOrdersSeries, 
  getEnrollmentsSeries, 
  getUsersSeries, 
  getLivestreamRevenueSeries,
  type SeriesDataPoint 
} from '@/services/analyticsService'

// Transform function for chart data
interface ChartDataPoint {
  date: string
  value: number
}

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 768
    }
    return true
  })

  const [kpis, setKpis] = useState({
    revenuePaid: 0,
    ordersPaid: 0,
    newUsers: 0,
    newEnrollments: 0,
    livestreamRegistrations: 0,
    arpu: 0,
  })

  const [revenueSeries, setRevenueSeries] = useState<ChartDataPoint[]>([])
  const [ordersSeries, setOrdersSeries] = useState<ChartDataPoint[]>([])
  const [enrollmentsSeries, setEnrollmentsSeries] = useState<ChartDataPoint[]>([])
  const [usersSeries, setUsersSeries] = useState<ChartDataPoint[]>([])
  const [livestreamRevenueSeries, setLivestreamRevenueSeries] = useState<ChartDataPoint[]>([])

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const transformSeriesData = (points: SeriesDataPoint[]): ChartDataPoint[] => {
    return points.map(point => ({
      date: `${point.year}-${String(point.month).padStart(2, '0')}-${String(point.day).padStart(2, '0')}`,
      value: point.value ?? point.count ?? 0
    }))
  }

  const fetchDashboardStats = async () => {
    try {
      setIsLoading(true)
      
      // Fetch all analytics data in parallel
      const [
        kpisRes, 
        revenueRes, 
        ordersRes, 
        enrollmentsRes, 
        usersRes, 
        livestreamRevenueRes
      ] = await Promise.all([
        getKPIs(),
        getRevenueSeries(),
        getOrdersSeries(),
        getEnrollmentsSeries(),
        getUsersSeries(),
        getLivestreamRevenueSeries(),
      ])
      
      console.log('KPIs Response:', kpisRes)
      console.log('Revenue Series Response:', revenueRes)
      console.log('Orders Series Response:', ordersRes)
      console.log('Enrollments Series Response:', enrollmentsRes)
      console.log('Users Series Response:', usersRes)
      console.log('Livestream Revenue Response:', livestreamRevenueRes)
      
      if (kpisRes.succeeded && kpisRes.data) {
        setKpis(kpisRes.data)
      }
      
      if (revenueRes.succeeded && revenueRes.data?.points && Array.isArray(revenueRes.data.points)) {
        setRevenueSeries(transformSeriesData(revenueRes.data.points))
      }
      
      if (ordersRes.succeeded && ordersRes.data?.points && Array.isArray(ordersRes.data.points)) {
        setOrdersSeries(transformSeriesData(ordersRes.data.points))
      }
      
      if (enrollmentsRes.succeeded && enrollmentsRes.data?.points && Array.isArray(enrollmentsRes.data.points)) {
        setEnrollmentsSeries(transformSeriesData(enrollmentsRes.data.points))
      }
      
      if (usersRes.succeeded && usersRes.data?.points && Array.isArray(usersRes.data.points)) {
        setUsersSeries(transformSeriesData(usersRes.data.points))
      }
      
      if (livestreamRevenueRes.succeeded && livestreamRevenueRes.data?.points && Array.isArray(livestreamRevenueRes.data.points)) {
        setLivestreamRevenueSeries(transformSeriesData(livestreamRevenueRes.data.points))
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 overflow-y-auto bg-muted/30">
          {/* Hero Section with gradient */}
          <div className="bg-gradient-to-br from-[#624bff] to-[#8b7aff] px-4 py-12 md:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-white md:text-4xl">Dashboard Overview</h1>
                  <p className="mt-2 text-white/90">Welcome back! Here's what's happening with your platform today.</p>
                </div>
              </div>

              {/* KPI Stats Cards */}
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                <StatsCard
                  title="Revenue Paid"
                  value={isLoading ? "..." : formatCurrency(kpis.revenuePaid || 0)}
                  subtitle="Total paid revenue"
                  icon={DollarSign}
                  iconColor="text-green-600"
                />
                <StatsCard
                  title="Orders Paid"
                  value={isLoading ? "..." : (kpis.ordersPaid || 0).toString()}
                  subtitle="Completed orders"
                  icon={ShoppingCart}
                  iconColor="text-blue-600"
                />
                <StatsCard
                  title="New Enrollments"
                  value={isLoading ? "..." : (kpis.newEnrollments || 0).toString()}
                  subtitle="New enrollments"
                  icon={GraduationCap}
                  iconColor="text-purple-600"
                />
                <StatsCard
                  title="New Users"
                  value={isLoading ? "..." : (kpis.newUsers || 0).toString()}
                  subtitle="New registered users"
                  icon={Users}
                  iconColor="text-orange-600"
                />
                <StatsCard
                  title="Livestream Registrations"
                  value={isLoading ? "..." : (kpis.livestreamRegistrations || 0).toString()}
                  subtitle="Livestream signups"
                  icon={Video}
                  iconColor="text-red-600"
                />
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
            <div className="space-y-6">
              
              {/* Row 1: Revenue and Orders - Full width charts */}
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Revenue Chart - Area Chart */}
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <DollarSign className="h-5 w-5 text-green-600" />
                      Revenue Trend
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="flex h-[280px] items-center justify-center text-muted-foreground">
                        Loading chart...
                      </div>
                    ) : revenueSeries.length === 0 ? (
                      <div className="flex h-[280px] items-center justify-center text-muted-foreground">
                        No data available
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height={280}>
                        <AreaChart data={revenueSeries as any}>
                          <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis 
                            dataKey="date" 
                            tickFormatter={formatDate}
                            style={{ fontSize: '12px' }}
                            stroke="#6b7280"
                          />
                          <YAxis 
                            tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                            style={{ fontSize: '12px' }}
                            stroke="#6b7280"
                          />
                          <Tooltip 
                            formatter={(value: number) => formatCurrency(value)}
                            labelFormatter={(label) => formatDate(label)}
                            contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="value" 
                            stroke="#10b981" 
                            strokeWidth={2}
                            fill="url(#colorRevenue)"
                            name="Revenue"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    )}
                  </CardContent>
                </Card>

                {/* Orders Chart - Bar Chart */}
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <ShoppingCart className="h-5 w-5 text-blue-600" />
                      Orders Over Time
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="flex h-[280px] items-center justify-center text-muted-foreground">
                        Loading chart...
                      </div>
                    ) : ordersSeries.length === 0 ? (
                      <div className="flex h-[280px] items-center justify-center text-muted-foreground">
                        No data available
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={ordersSeries as any}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis 
                            dataKey="date" 
                            tickFormatter={formatDate}
                            style={{ fontSize: '12px' }}
                            stroke="#6b7280"
                          />
                          <YAxis style={{ fontSize: '12px' }} stroke="#6b7280" />
                          <Tooltip 
                            labelFormatter={(label) => formatDate(label)}
                            contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                          />
                          <Bar dataKey="value" fill="#3b82f6" name="Orders" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Row 2: Enrollments and Users */}
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Enrollments Chart - Line Chart */}
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <GraduationCap className="h-5 w-5 text-purple-600" />
                      Enrollments Growth
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="flex h-[280px] items-center justify-center text-muted-foreground">
                        Loading chart...
                      </div>
                    ) : enrollmentsSeries.length === 0 ? (
                      <div className="flex h-[280px] items-center justify-center text-muted-foreground">
                        No data available
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height={280}>
                        <LineChart data={enrollmentsSeries as any}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis 
                            dataKey="date" 
                            tickFormatter={formatDate}
                            style={{ fontSize: '12px' }}
                            stroke="#6b7280"
                          />
                          <YAxis style={{ fontSize: '12px' }} stroke="#6b7280" />
                          <Tooltip 
                            labelFormatter={(label) => formatDate(label)}
                            contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="value" 
                            stroke="#9333ea" 
                            strokeWidth={3}
                            name="Enrollments"
                            dot={{ fill: '#9333ea', r: 4 }}
                            activeDot={{ r: 6 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    )}
                  </CardContent>
                </Card>

                {/* Users Chart - Area Chart */}
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Users className="h-5 w-5 text-orange-600" />
                      User Registration
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="flex h-[280px] items-center justify-center text-muted-foreground">
                        Loading chart...
                      </div>
                    ) : usersSeries.length === 0 ? (
                      <div className="flex h-[280px] items-center justify-center text-muted-foreground">
                        No data available
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height={280}>
                        <AreaChart data={usersSeries as any}>
                          <defs>
                            <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis 
                            dataKey="date" 
                            tickFormatter={formatDate}
                            style={{ fontSize: '12px' }}
                            stroke="#6b7280"
                          />
                          <YAxis style={{ fontSize: '12px' }} stroke="#6b7280" />
                          <Tooltip 
                            labelFormatter={(label) => formatDate(label)}
                            contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="value" 
                            stroke="#f97316" 
                            strokeWidth={2}
                            fill="url(#colorUsers)"
                            name="Users"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Row 3: Livestream Revenue Chart - Full Width */}
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Video className="h-5 w-5 text-red-600" />
                    Livestream Revenue Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex h-[320px] items-center justify-center text-muted-foreground">
                      Loading chart...
                    </div>
                  ) : livestreamRevenueSeries.length === 0 ? (
                    <div className="flex h-[320px] items-center justify-center text-muted-foreground">
                      No data available
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={320}>
                      <AreaChart data={livestreamRevenueSeries as any}>
                        <defs>
                          <linearGradient id="colorLivestream" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#dc2626" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#dc2626" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis 
                          dataKey="date" 
                          tickFormatter={formatDate}
                          style={{ fontSize: '12px' }}
                          stroke="#6b7280"
                        />
                        <YAxis 
                          tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                          style={{ fontSize: '12px' }}
                          stroke="#6b7280"
                        />
                        <Tooltip 
                          formatter={(value: number) => formatCurrency(value)}
                          labelFormatter={(label) => formatDate(label)}
                          contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#dc2626" 
                          strokeWidth={2}
                          fill="url(#colorLivestream)"
                          name="Livestream Revenue"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>

            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
