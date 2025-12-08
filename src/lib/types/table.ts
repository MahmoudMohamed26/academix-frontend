export interface TableHeader {
  key: string
  name: string
}

export interface DataTableProps{
  data: any[]
  isLoading: boolean
  tableHeaders: TableHeader[]
  onDelete?: (itemId: string) => void
  type?: "categories" | "courses" | "payments" | "default"
  getCategoryName?: (item: any) => string
  noDataText?: string
}
