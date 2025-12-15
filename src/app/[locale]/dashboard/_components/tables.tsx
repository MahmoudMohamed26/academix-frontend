"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Pencil, Trash2 } from "lucide-react"
import { useTranslation } from "react-i18next"
import { formatDate } from "@/helpers/format-date"
import { DataTableProps, TableHeader as THeader } from "@/lib/types/table"
import Link from "next/link"
import { truncateText } from "@/helpers/word-cut"
import Image from "next/image"

export default function DataTable({
  data,
  isLoading,
  tableHeaders,
  onDelete,
  type = "default",
  getCategoryName,
  noDataText,
}: DataTableProps) {
  const { t } = useTranslation()

  const renderCellContent = (header: THeader, item: any) => {
    if (header.key === "name") {
      if (type === "categories" && getCategoryName) {
        return getCategoryName(item)
      }
      return (item as any).name || "N/A"
    } else if (header.key === "category") {
      if (getCategoryName) {
        return getCategoryName(item)
      }
      return "N/A"
    } else if (header.key === "created") {
      return formatDate(item.created)
    } else if (header.key === "short_description") {
      return truncateText(item.short_description , 15)
    } else if (header.key === "updated") {
      return formatDate(item.updated)
    } else if (header.key === "image") {
      return(
        <Image unoptimized src={item.image} alt="course image" width={64} height={64} />
      )
    }else if (header.key === "actions") {
      return (
        <div className="flex gap-2">
          <Link
            href={`/dashboard/${type}/edit/${item.id}`}
            className="p-2 hover:bg-blue-100 cursor-pointer rounded-md transition-colors"
            aria-label="Edit"
          >
            <Pencil className="w-4 h-4 text-blue-600" />
          </Link>
          {onDelete && (
            <button
              onClick={() => onDelete(item.id)}
              className="p-2 hover:bg-red-100 cursor-pointer rounded-md transition-colors"
              aria-label="Delete"
            >
              <Trash2 className="w-4 h-4 text-red-600" />
            </button>
          )}
        </div>
      )
    } else {
      return (item as any)[header.key] || "N/A"
    }
  }

  return (
    <div className="block px-2 py-2 bg-white rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-start">#</TableHead>
            {tableHeaders.map((header) => (
              <TableHead className="text-start" key={header.key}>
                {header.name}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <TableRow
                key={index}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <TableCell>
                  <Skeleton className="h-8 w-full" />
                </TableCell>
                {tableHeaders.map((header) => (
                  <TableCell key={header.key}>
                    <Skeleton className="h-8 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={tableHeaders.length + 1}
                className="text-center"
              >
                {noDataText || t(`Dashboard.${type}.noData`)}
              </TableCell>
            </TableRow>
          ) : (
            data.map((item, index) => (
              <TableRow
                key={item.id}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <TableCell>{index + 1}</TableCell>
                {tableHeaders.map((header) => (
                  <TableCell key={header.key}>
                    {renderCellContent(header, item)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
