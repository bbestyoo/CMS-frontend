'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

function RepairNav() {

    const pathname = usePathname()
    console.log("*********",pathname)

    

  return (
<div className={`bg-black-400 ${(pathname === "/repair/order" || pathname.includes("/repair/productDetails/") || pathname === "/repair/search" || pathname === "/repair/profit") ? "hidden" : ""}`}>        
<ul className='flex gap-5 drop-shadow-2xl rounded-2xl my-3 mx-auto w-fit px-3 py-1'>
            <Link href="/repair">
            <li><button className={`${pathname === "/repair" ? "bg-indigo-700 " : " bg-indigo-500" } p-3 text-white  rounded-3xl`}>

                Ongoing Repairs
            </button>
                </li>
            </Link>
            <Link href="/repair/call-to-customer">
            <li><button className={` ${pathname === "/repair/call-to-customer" ? "bg-indigo-700 " : " bg-indigo-500" } p-3 text-white bg-press rounded-3xl`}>

                Call to Customers
            </button>
                </li>
            </Link>
            <Link href="/repair/completed-repairs">
            <li><button className={`${pathname === "/repair/completed-repairs" ? "bg-indigo-700 " : " bg-indigo-500" } p-3 text-white bg-press rounded-3xl`}>

                Completed Repairs
            </button>
                </li>
            </Link>
            <Link href="/repair/unrepairable-repairs">
            <li><button className={`${pathname === "/repair/    unrepairable-repairs" ? "bg-indigo-700 " : " bg-press" } p-3 text-white bg-indigo-500 rounded-3xl`}>

                Unrepairable Repairs
            </button>
                </li>
            </Link>
        </ul>

    </div>
  )
}

export default RepairNav