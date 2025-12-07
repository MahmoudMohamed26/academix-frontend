export interface TableHeader {
  key: string
  name: string
}

export interface DataTableProps<
  T extends { id: string; createdAt: string; }
> {
  data: T[]
  isLoading: boolean
  tableHeaders: TableHeader[]
  onDelete?: (itemId: string) => void
  type?: "categories" | "courses" | "payments" | "default"
  getCategoryName?: (item: T) => string
  noDataText?: string
}
