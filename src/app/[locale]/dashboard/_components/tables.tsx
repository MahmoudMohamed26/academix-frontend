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
import { CircleCheck, CircleX, Pencil, Section, Trash2 } from "lucide-react"
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
  onApprove,
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
    } else if (header.key === "title") {
      return truncateText(item.title, 10)
    } else if (header.key === "short_description") {
      return truncateText(item.short_description, 15)
    } else if (header.key === "updated") {
      return formatDate(item.updated)
    } else if (header.key === "image") {
      return (
        <div
          className={`rounded-md overflow-hidden relative w-[140px] h-[70px]`}
        >
          <Image
            src={item.image}
            fill
            alt={item.title}
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 400px"
            loading="eager"
            unoptimized
          />
        </div>
      )
    } else if (header.key === "actions" && type !== "pending-courses") {
      return (
        <div className="flex gap-2">
          {type === "courses" && (
            <Link
              className="p-2 hover:bg-orange-100 cursor-pointer rounded-md transition-colors"
              href={`/dashboard/courses/sections/${item.id}`}
              title="sections"
            >
              <Section className="w-4 h-4 text-(--main-color)" />
            </Link>
          )}
          <Link
            href={`/dashboard/${type}/edit/${item.id}`}
            className="p-2 hover:bg-blue-100 cursor-pointer rounded-md transition-colors"
            aria-label="Edit"
            title="edit"
          >
            <Pencil className="w-4 h-4 text-blue-600" />
          </Link>
          {onDelete && (
            <button
              onClick={() => onDelete(item.id)}
              className="p-2 hover:bg-red-100 cursor-pointer rounded-md transition-colors"
              aria-label="Delete"
              title="delete"
            >
              <Trash2 className="w-4 h-4 text-red-600" />
            </button>
          )}
        </div>
      )
    } else if (header.key === "actions" && type === "pending-courses") {
      return (
        <div className="flex gap-2">
          {onApprove && <button
            onClick={() => onApprove(item.id)}
            className="p-2 hover:bg-green-100 cursor-pointer rounded-md transition-colors"
            title="Approve course"
          >
            <CircleCheck className="w-4 h-4 text-green-600" />
          </button>}
          {onDelete && (
            <button
              onClick={() => onDelete(item.id)}
              className="p-2 hover:bg-red-100 cursor-pointer rounded-md transition-colors"
              aria-label="Delete"
              title="Reject course"
            >
              <CircleX className="w-4 h-4 text-red-600" />
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
