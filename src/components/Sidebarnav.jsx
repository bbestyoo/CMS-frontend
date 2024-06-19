'use client'
import React from 'react'
import { Nav } from './ui/nav'
import {
  AlertCircle,
  Archive,
  ArchiveX,
  File,
  Inbox,
  MessagesSquare,
  Search,
  Send,
  ShoppingCart,
  Trash2,
  Users2, 
} from "lucide-react"


function Sidebarnav() {

  return (
    <>
    <Nav
            isCollapsed={false}
            links={[
              {
                title: "Dashboard",
                label: "128",
                links: "/",
                icon: Inbox,
                // variant: "default",
              },
              {
                title: "Repair",
                label: "9",
                links: "/repair",
                icon: File,
                // variant: "ghost",
              },
              {
                title: "Search",
                label: "",
                links: "/repair/search/",
                icon: Send,
                // variant: "ghost",
              },
              {
                title: "Profits",
                label: "23",
                links: "/repair/profit",
                icon: ArchiveX,
                // variant: "ghost",
              },
              {
                title: "Trash",
                label: "",
                links: "/repair",
                icon: Trash2,
                // variant: "ghost",
              },
              {
                title: "About Us",
                label: "",
                links: "/repair",
                icon: Archive,
                // variant: "ghost",
              },
            ]}
          />
    </>
  )
}

export default Sidebarnav