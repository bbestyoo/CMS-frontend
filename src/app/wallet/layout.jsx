import Sidebarnav from '@/components/Sidebarnav';
import Header from "@/components/Header";


export default function RepairLayout({ children }) {

  // Your other layout logic here

  return (
    <>

<div className="layout bg-back text-black">


<Sidebarnav/>
<div className="w-full h-screen bg-back">

<Header/>
{children}
</div>
</div>


    
    </>
  )
}
