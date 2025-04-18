import type { ReactNode } from "react"

interface Column<T> {
  header: string
  accessor: keyof T | ((item: T, index: number) => ReactNode)
  className?: string
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  keyExtractor: (item: T, index: number) => string | number
}

export default function DataTable<T>({ columns, data, keyExtractor }: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-gray-50">
            {columns.map((column, index) => (
              <th
                key={index}
                className={`text-left py-3 px-4 font-medium text-sm text-gray-600 ${column.className || ""}`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={keyExtractor(item, index)} className="border-b">
              {columns.map((column, colIndex) => (
                <td key={colIndex} className={`py-3 px-4 ${column.className || ""}`}>
                  {typeof column.accessor === "function" ? column.accessor(item, index) : (item[column.accessor] as ReactNode)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

