import { TableHeader } from "@/lib/types/table";
import DataTable from "../../_components/tables";


export default function ProfilePaymentsPage() {

  const data = [{
    id: "1",
    title: "Sample Payment",
    status: "Successful",
    createdAt: "2024-01-01",
  }, {
    id: "2",
    title: "Another Payment",
    status: "failed",
    createdAt: "2024-02-01",
  }]

  const tableHeaders: TableHeader[] = [
      { key: "title", name: "Course Name" },
      { key: "createdAt", name: "Created At" },
      { key: "status", name: "Status" },
      { key: "actions", name: "Details" },
    ]

  return (
    <>
      <DataTable
        data={data}
        isLoading={false}
        tableHeaders={tableHeaders}
        type={"payments"}
      />
    </>
  )
}
