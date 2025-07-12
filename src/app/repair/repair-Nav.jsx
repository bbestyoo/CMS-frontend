'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

const navLinks = [
  { href: "/repair", label: "Ongoing Repairs" },
  { href: "/repair/call-to-customer", label: "Call to Customers" },
  { href: "/repair/completed-repairs", label: "Completed Repairs" },
  { href: "/repair/unrepairable-repairs", label: "Unrepairable Repairs" },
  { href: "/repair/out-repairs", label: "Out Repairs" },
  { href: "/repair/credited-repairs", label: "Credited" },
]

function RepairNav() {
  const pathname = usePathname()

  const shouldHide =
    pathname === "/repair/order" ||
    pathname.includes("/repair/productDetails/") ||
    pathname === "/repair/search" ||
    pathname === "/repair/profit" ||
    pathname.includes("/repair/inventory")

  return (
    <div className={`${shouldHide ? "hidden" : ""} w-full`}>
      <nav className="w-[92%] max-w-6xl mx-auto my-2 bg-white border border-gray-200 rounded-xl shadow-sm px-4 py-2">
        <ul className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6">
          {navLinks.map(({ href, label }) => {
            const isActive = pathname === href
            return (
              <li key={href}>
                <Link href={href}>
                  <button
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                      isActive
                        ? "bg-indigo-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-indigo-100 hover:text-indigo-700"
                    }`}
                  >
                    {label}
                  </button>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}

export default RepairNav
