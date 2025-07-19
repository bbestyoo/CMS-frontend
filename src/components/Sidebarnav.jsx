"use client"

import { useState } from "react" // Import useState for mobile menu state
import { useAppSelector } from "@/lib/hooks"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { HiMiniWrenchScrewdriver } from "react-icons/hi2"
import { FaSearch } from "react-icons/fa"
import { MdAttachMoney } from "react-icons/md"
import { MdSpaceDashboard } from "react-icons/md"
import { TbTransactionDollar } from "react-icons/tb"
import { FaWallet } from "react-icons/fa"
import { Menu, X } from "lucide-react" // Using Lucide React for simple toggle icons

const navItems = [
  { name: "dashboard", href: "/", icon: <MdSpaceDashboard size={21} /> },
  { name: "repair", href: "/repair", icon: <HiMiniWrenchScrewdriver size={21} /> },
  { name: "search", href: "/repair/search", icon: <FaSearch size={21} /> },
  { name: "profit", href: "/repair/profit", icon: <MdAttachMoney size={21} /> },
  { name: "transactions", href: "/transactions", icon: <TbTransactionDollar size={21} /> },
  { name: "wallet", href: "/wallet", icon: <FaWallet size={21} /> },
  { name: "credits", href: "/repair/credits", icon: <FaWallet size={21} /> },
  { name: "inventory", href: "/repair/inventory/view", icon: <MdSpaceDashboard size={21} /> },
]

const Navbar = () => {
  const userData = useAppSelector((state) => state.user.value)
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false) // State to manage mobile menu visibility

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <>
      {/* Mobile menu toggle button (hamburger icon) */}
      <button
        className="fixed top-2 left-2 z-50 md:hidden p-2 text-white bg-sky-500 rounded-md shadow-lg"
        onClick={toggleMobileMenu}
        aria-label="Toggle navigation menu"
        aria-expanded={isMobileMenuOpen}
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={20} />}
      </button>

      {/* Overlay for mobile menu when open */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={toggleMobileMenu}
          aria-hidden="true" // Hide from accessibility tree as it's decorative
        />
      )}

      <nav
        className={`
          fixed inset-y-0 left-0 w-64 h-screen z-40
          text-white flex flex-col justify-start
          transform transition-transform duration-300 ease-in-out
          md:relative md:translate-x-0 md:w-64 md:flex-shrink-0
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div>
          <div className="w-full flex items-center gap-5 justify-center bg-sky-300 text-center py-[11px] font-bold">
            <span className="text-3xl font-extralight text-white px-7 py-1">EziLogs</span>
          </div>
          {/* User welcome section - uncomment if you want to use it */}
          {/*
          <div className="text-center my-3">
            <span className="">
              <p className="text-2xl font-semibold mb-1 text-white capitalize font-serif">welcome</p>
              <p className="text-black text-2xl capitalize font-semibold mb-1">{userData? userData?.userDetails?.name || userData?.userinfo?.name : "User"}</p>
            </span>
            <p className="text-white">{userData? userData?.userDetails?.enterprise || userData?.userinfo?.enterprise : "Owner name"}</p>
          </div>
          */}
        </div>
        <ul className="flex flex-col items-start pl-4 space-y-2 bg-gradient-to-b from-sky-300 to-slate-800 h-full py-16 ">
          {navItems.map((item, index) => (
            <li key={index} className="w-full">
              <Link
                className={`${item.href === pathname ? "bg-[#f6f6f6] text-black md:linkStyleUp md:linkStyleDown relative" : "hover:text-black"} flex gap-3 px-3 rounded-l-2xl items-center`}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)} // Close menu when a link is clicked
              >
                <p>{item.icon}</p>
                <p className="block capitalize w-full p-2 rounded ">{item.name}</p>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  )
}

export default Navbar
