"use client"

import { useEffect, useState } from "react"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { productsApi } from "@/api/GetRepairProducts" // Assuming this path is correct
import { useRouter } from "next/navigation"

function TablePage() {
  const [data, setData] = useState([])
  const router = useRouter()

  const someFunction = async () => {
    try {
      console.log("Fetching products data...")
      const products = await productsApi()
      setData(products.results)
      console.log("Fetched data:", products.results)
    } catch (error) {
      console.error("Error fetching products:", error)
      // You might want to add state to show an error message to the user
    }
  }

  useEffect(() => {
    someFunction()
  }, [])

  function handleClick(repair_id) {
    router.push(`/repair/productDetails/${repair_id}`)
  }

  return (
    <>
      <div className="h-[62vh] overflow-y-scroll overflow-x-auto drop-shadow-2xl bg-gradient-to-r from-blue-200 to-slate-300 text-black rounded-lg p-2 ">
        {" "}
        {/* Added responsive padding and overflow-x-auto */}
        <h3 className="text-center text-lg mb-2">Recent Orders</h3>
        <Table className="min-w-full rounded-2xl">
          {" "}
          {/* Ensures table takes minimum full width to enable horizontal scroll */}
          <TableCaption>A list of your recent transactions</TableCaption>
          <TableHeader className="" >
            <TableRow className="bg-gray-100 rounded-lg">
              <TableHead className="font-semibold text-black whitespace-nowrap">Customer Info</TableHead>
              <TableHead className="font-semibold text-black whitespace-nowrap">Problem</TableHead>
              <TableHead className="font-semibold text-black whitespace-nowrap">Status</TableHead>
              <TableHead className="text-right font-semibold text-black whitespace-nowrap">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="">
            {data && data.length > 0 ? (
              data?.map((item, i) => (
                <TableRow
                  onClick={() => handleClick(item.repair_id)}
                  className="border-b border-gray-200 cursor-pointer hover:bg-gray-200 transition-colors"
                  key={i}
                >
                  <TableCell className="font-medium whitespace-nowrap">
                    <p className="p-2">{`${item.phone_model} by ${item.customer_name}`}</p>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">{item.repair_problem}</TableCell>
                  <TableCell>
                    <p
                      className={`
                    ${item.repair_status === "Unrepairable" ? "bg-red-400" : ""}
                    ${item.repair_status === "Repaired" || item.repair_status === "Completed" ? "bg-green-400" : ""}
                    ${
                      item.repair_status !== "Unrepairable" &&
                      item.repair_status !== "Repaired" &&
                      item.repair_status !== "completed"
                        ? "bg-gray-100"
                        : ""
                    }
                    rounded-3xl w-fit py-1 text-center px-2 text-xs sm:text-sm hover:scale-110 transition-all ease-in
                  `}
                    >
                      {item.repair_status}
                    </p>
                  </TableCell>
                  <TableCell className="text-right whitespace-nowrap">
                    <p className="pr-2">{item.total_amount}</p>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4 text-gray-500">
                  No recent orders found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  )
}

export default TablePage
