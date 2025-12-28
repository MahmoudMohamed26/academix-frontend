export interface TableHeader {
  key: string
  name: string
}

export interface DataTableProps{
  data: any[]
  isLoading: boolean
  tableHeaders: TableHeader[]
  onDelete?: (itemId: string) => void
  onApprove?: (itemId: string) => void
  type?: "categories" | "courses" | "payments" | "default" | "pending-courses"
  getCategoryName?: (item: any) => string
  noDataText?: string
}
