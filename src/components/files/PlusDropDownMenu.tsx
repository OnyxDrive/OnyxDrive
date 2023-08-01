import React from 'react'
import { Button } from '../ui/button'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from '../ui/dropdown-menu'
import { MoreHorizontal } from 'lucide-react'
import PlusIcon from '../ui/icons/PlusIcon'

type Props = {}

export default function PlusDropDownMenu({}: Props) {
  const handleText = () => {}

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <PlusIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>New property on Files</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Type:</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Text</DropdownMenuItem>
        <DropdownMenuItem>Text</DropdownMenuItem>
        <DropdownMenuItem>Text</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
