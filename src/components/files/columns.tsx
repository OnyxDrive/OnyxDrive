'use client'

import { ColumnDef } from '@tanstack/react-table'
import { Checkbox } from '../ui/checkbox'
import TableDropdown from './table-dropdown'
import { Button } from '../ui/button'
import PlusIcon from '../ui/icons/PlusIcon'
import PlusDropDownMenu from './PlusDropDownMenu'

const PropertyTypeToCellComponent: Map<FilePropertyType, JSX.Element> = new Map([
  ['text', <Checkbox></Checkbox>],
  ['tag', <Checkbox></Checkbox>],
  ['phone', <Checkbox></Checkbox>],
])

// It can be file or directory, for example
export type FileListElement = {
  id: string
  name: string
}

export const columns: ColumnDef<FileListElement>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const file = row.original
      return <TableDropdown key={file.id} fileKey={file.id}></TableDropdown>
    },
  },
  {
    id: 'addProp',
    header: ({ table }) => {
      return <PlusDropDownMenu></PlusDropDownMenu>
    },
  },
]
