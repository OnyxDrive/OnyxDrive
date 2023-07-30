import React, { ReactNode } from 'react'
import LeftNavbar from './leftbar/LeftNavbar'
import TopNavbar from './TopNavbar'

type Props = {
  children: ReactNode
}

export default function AppLayout({ children }: Props) {
  return (
    <div className="flex">
      <LeftNavbar />
      <div className="flex grow-[4] flex-col">
        <TopNavbar />
        {children}
      </div>
    </div>
  )
}
