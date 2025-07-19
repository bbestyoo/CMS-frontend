"use client"

import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { useState } from "react"
import { FaSearch } from "react-icons/fa"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { logoutUser } from "@/lib/user/userSlice"
import { useRouter } from "next/navigation"
import { IoIosNotifications } from "react-icons/io"
import { FaUser } from "react-icons/fa"

function Header() {
  const [isFocused, setIsFocused] = useState(false)
  const dispatch = useAppDispatch()
  const router = useRouter()
  const userData = useAppSelector((state) => state.user.value)

  function handleLogout() {
    dispatch(logoutUser())
    router.push("/home")
  }

  function handleSearchFocus() {
    setIsFocused(true)
  }

  function handleSearchBlur() {
    setIsFocused(false)
  }

  function handleSearchSubmit(e) {
    // Added type for e
    e.preventDefault()
    const searchQuery = (e.target ).elements.namedItem("search")  // Corrected type assertion
    if (searchQuery && searchQuery.value) {
      router.push(`/repair/search?q=${searchQuery.value}`)
    }
  }

  return (
    <>
      <div className="flex w-full px-4 sm:px-8 bg-gradient-to-r from-sky-300 to-slate-600 via-sky-600 text-black justify-between h-[50px] items-center">
        {/* Welcome message - hidden on extra small screens, flex on small screens and up */}
        <div className="hidden sm:flex items-center min-w-0">
          <p className="font-sans text-sky-900 text-md whitespace-nowrap">Welcome,&nbsp;</p>
          <p className="capitalize font-semibold text-sky-50 text-xl truncate">
            {userData ? userData?.userDetails?.name || userData?.userinfo?.name : "User"}
          </p>
        </div>

        {/* Search form - takes full width on mobile, then adjusts on larger screens */}
        <form
          className={`flex flex-1 min-w-0 mx-2 sm:mx-0 bg-gray-100 rounded-3xl px-3 py-1 items-center border ${isFocused ? "border-2 border-sky-200" : "border-none"}
                     sm:flex-none sm:w-auto md:w-[50vw] md:max-w-lg`} // Responsive width adjustments
          onSubmit={handleSearchSubmit}
        >
          <input
            onFocus={handleSearchFocus}
            onBlur={handleSearchBlur}
            name="search"
            className="h-[30px] w-full bg-inherit border-none placeholder:text-sky-700 text-black outline-none" // Input takes full width of its parent form
            type="search"
            placeholder="Search your repairs here ..."
          />
          <button type="submit" className="border-none bg-inherit p-0 m-0">
            <FaSearch className="text-sky-700" size={15} />
          </button>
        </form>

        {/* Right-side icons and dropdown */}
        <div className="flex items-center">
          <span className="flex items-center">
            <p className="mr-2 cursor-pointer">
              <IoIosNotifications className="text-white" size={23} />
            </p>
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger className="">
              <div className="border-2 border-white rounded-full p-1">
                <FaUser className="text-white" size={20} />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <div onClick={handleLogout}>
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </div>
              
              <div>
                <DropdownMenuItem>Subscription</DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </>
  )
}

export default Header
