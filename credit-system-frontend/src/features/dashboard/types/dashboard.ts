export type RequestsLast7Days = {
    date: string
    count: number
  }
  
  export type RequestsByCountry = {
    country: string
    total: number
  }
  
  export type DashboardSummary = {
    totalRequests: number
    pendingRequests: number
    approvedRequests: number
    totalAmount: number
    requestsLast7Days: RequestsLast7Days[]
    requestsByCountry: RequestsByCountry[]
  }