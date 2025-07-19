import Sidebarnav from '@/components/Sidebarnav';
import RepairNav from './repair-Nav';
import Header from "@/components/Header";


export default function RepairLayout({ children }) {

  // Your other layout logic here

  return (
    <>

<div className="layout bg-back text-black">

<div className="flex min-h-screen md:w-[250px] w-0">
<Sidebarnav/>
        </div>
<div className="w-full h-screen bg-back">

<Header/>
<RepairNav/>
{children}
</div>
</div>


    
    </>
  )
}
