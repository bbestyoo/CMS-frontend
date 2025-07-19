"use client"

import { useAppSelector } from "@/lib/hooks"
import { useEffect, useState } from "react"
import { MdShopTwo } from "react-icons/md"
import { FcLineChart } from "react-icons/fc"
import { FaMoneyCheckAlt } from "react-icons/fa"
import { getStats } from "@/api/GetRepairProducts" // Assuming this path is correct
import { useRouter } from "next/navigation"

function Dashboard() {
  const router = useRouter()
  const [pending, setPending] = useState([])
  const [unrepairable, setUnrepairable] = useState([])
  const [outRepaired, setOutrepaired] = useState([])
  const userData = useAppSelector((state) => state.user.value)

  console.log("userData", userData)

  useEffect(() => {
    getRepair()
  }, [])

  const getRepair = async () => {
    try {
      const response = await getStats()
      console.log(response)
      setPending(response.pending)
      setUnrepairable(response.unrepairable)
      setOutrepaired(response.outside)
    } catch (error) {
      console.error("Failed to fetch repair stats:", error)
      // Handle error, e.g., set default empty arrays or show a message
    }
  }

  return (
    <>
      <div className="mt-0 p-2 sm:p-0">
        {" "}
        {/* Added responsive padding to the main container */}
        <div className="container mx-auto">
          {" "}
          {/* Added mx-auto for centering on larger screens */}
          <h2 className="text-xl text-center text-black my-2">Dashboard</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:gap-4 mb-5">
            {" "}
            {/* Responsive Grid for cards */}
            {/* Pending Repairs Card */}
            <div
              onClick={() => router.push("/repair/")}
              className="group border-l-4 border-l-sky-600 bg-white flex gap-3 px-3 py-4 sm:py-5 sm:px-4 xl:py-5 xl:px-6 items-center shadow-md rounded-md bg-gradient-to-br from-gray-100 to-blue-200 cursor-pointer justify-between"
            >
              <div>
                <div className="flex gap-3 items-center">
                  <span>
                    <MdShopTwo className="group-hover:scale-105 transition-transform duration-200" size={30} />
                  </span>
                  <p className="text-lg sm:text-xl whitespace-nowrap">Pending Repairs</p>
                </div>
                <div>
                  <p className="text-left text-xl font-bold">{`${pending}`}</p>
                </div>
              </div>
              <div className="group-hover:scale-105 transition-transform duration-200">
                <FcLineChart className="size-[35px] xl:size-[50px]" />
              </div>
            </div>
            {/* Unrepairable Repairs Card */}
            <div
              onClick={() => router.push("/repair/unrepairable-repairs")}
              className="group border-l-4 border-l-sky-600 flex gap-3 px-3 py-4 sm:py-5 sm:px-4 xl:py-5 xl:px-6 items-center shadow-md rounded-md bg-gradient-to-br from-sky-100 to-slate-300 cursor-pointer justify-between "
            >
              <div>
                <div className="flex gap-3 items-center">
                  <span>
                    <FaMoneyCheckAlt className="group-hover:scale-105 transition-transform duration-200" size={30} />
                  </span>
                  <p className="text-lg sm:text-xl whitespace-nowrap">Unrepairables</p>
                </div>
                <div>
                  <p className="text-left text-xl font-bold">{`${unrepairable}`}</p>
                </div>
              </div>
              <div className="group-hover:scale-110 transition-transform duration-200">
                <FcLineChart className="size-[35px] xl:size-[50px]" />
              </div>
            </div>
            {/* Outside Repairs Card */}
            <div
              onClick={() => router.push("/repair/out-repairs")}
              className="group border-l-4 border-l-sky-600 bg-white flex gap-3 px-3 py-4 sm:py-5 sm:px-4 xl:py-5 xl:px-6 items-center shadow-md rounded-md bg-gradient-to-br from-gray-100 to-blue-200 cursor-pointer justify-between"
            >
              <div>
                <div className="flex gap-3 items-center">
                  <span>
                    <FaMoneyCheckAlt className="group-hover:scale-110 transition-transform duration-200" size={30} />
                  </span>
                  <p className="text-lg sm:text-xl whitespace-nowrap">Outside Repairs</p>
                </div>
                <div>
                  <p className="text-left text-xl font-medium">{`${outRepaired}`}</p>
                </div>
              </div>
              <div className="group-hover:scale-110 transition-transform duration-200">
                <FcLineChart className="size-[35px] xl:size-[50px]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Dashboard
