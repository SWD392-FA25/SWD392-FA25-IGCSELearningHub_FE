import { fetchWithAuth } from './api'

// KPIs Response
export interface KPIsResponse {
  succeeded: boolean
  status: string
  statusCode: number
  message: string
  data: {
    revenuePaid: number
    ordersPaid: number
    newUsers: number
    newEnrollments: number
    livestreamRegistrations: number
    arpu: number
  }
}

// Time Series Data Point
export interface SeriesDataPoint {
  year: number
  month: number
  day: number
  value?: number
  count?: number
}

// Series Response
export interface SeriesResponse {
  succeeded: boolean
  status: string
  statusCode: number
  message: string
  data: {
    seriesName: string
    points: SeriesDataPoint[]
  }
}

// Get KPIs
export const getKPIs = async (): Promise<KPIsResponse> => {
  return fetchWithAuth<KPIsResponse>('/admin/analytics/kpis')
}

// Get Revenue Series
export const getRevenueSeries = async (): Promise<SeriesResponse> => {
  return fetchWithAuth<SeriesResponse>('/admin/analytics/revenue-series')
}

// Get Orders Series
export const getOrdersSeries = async (): Promise<SeriesResponse> => {
  return fetchWithAuth<SeriesResponse>('/admin/analytics/orders-series')
}

// Get Enrollments Series
export const getEnrollmentsSeries = async (): Promise<SeriesResponse> => {
  return fetchWithAuth<SeriesResponse>('/admin/analytics/enrollments-series')
}

// Get Users Series
export const getUsersSeries = async (): Promise<SeriesResponse> => {
  return fetchWithAuth<SeriesResponse>('/admin/analytics/users-series')
}

// Get Livestream Revenue Series
export const getLivestreamRevenueSeries = async (): Promise<SeriesResponse> => {
  return fetchWithAuth<SeriesResponse>('/admin/analytics/livestream-revenue-series')
}
