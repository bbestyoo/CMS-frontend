'use client'
import { useAppSelector } from '@/lib/hooks';
import Link from 'next/link';
import { usePathname } from "next/navigation"
import { HiMiniWrenchScrewdriver } from "react-icons/hi2";
import { FaSearch } from "react-icons/fa";
import { MdAttachMoney } from "react-icons/md";
import { IoStatsChartSharp } from "react-icons/io5";
import { MdSpaceDashboard } from "react-icons/md";
import { TbTransactionDollar } from "react-icons/tb";
import { BsFillInfoCircleFill } from "react-icons/bs";
import { FaTrash } from "react-icons/fa";
import { FaWallet } from "react-icons/fa";

const navItems = [
  { name: 'dashboard', href: '/', icon: <MdSpaceDashboard size={21}/>  },
  { name: 'repair', href: '/repair', icon: <HiMiniWrenchScrewdriver size={21}/> },
  { name: 'search', href: '/repair/search', icon: <FaSearch size={21}/> },
  { name: 'profit', href: '/repair/profit', icon: <MdAttachMoney size={21}/> },
  { name: 'transactions', href: '/transactions', icon: <TbTransactionDollar size={21}/> },
  { name: 'wallet', href: '/wallet', icon: <FaWallet size={21}/> },
  { name: 'credits', href: '/repair/credits', icon: <FaWallet size={21}/> },

];


const Navbar = () => {


  const userData = useAppSelector((state)=> state.user.value)
  // console.log("userdata in sidebar",userData)  
  const pathname = usePathname()
  // console.log("pathname",pathname)
  return (
    <nav
    className="w-full h-full z-20  text-white bg-sky-600 group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2"
     > 
     <div>

<div className="mt-1 ml-2 text-center text-white font-bold">
  LOGO --  EziLogs

</div>
<div className="text-center my-5">
  <span className="">

    <p className="text-2xl font-semibold mb-1 text-white capitalize font-serif">welcome</p>
    <p className="text-black text-2xl capitalize font-semibold mb-1">{userData? userData?.userDetails?.name || userData?.userinfo?.name : "User"}</p>
  </span>
    <p className="text-white">{userData? userData?.userDetails?.enterprise || userData?.userinfo?.enterprise : "Owner name"}</p>
</div>

</div>
      <ul className="flex flex-col items-start pl-4 space-y-2">
        {navItems.map((item, index) => (
          <li key={index} className="w-full">
            <Link className={`${item.href === pathname ? 'bg-[#f6f6f6] text-black linkStyleUp linkStyleDown relative' : 'hover:text-black'} flex gap-3 px-3 rounded-l-2xl  items-center  `} href={item.href}>
              <p>{item.icon}</p>
              <p className="block capitalize w-full p-2 rounded ">{item.name}</p>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;

