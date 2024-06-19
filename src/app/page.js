import Dashboard from "@/components/Dashboard";
import Header from "@/components/Header";
import Sidebarnav from "@/components/Sidebarnav";
import Todo from "@/components/Todo";
import TablePage from "@/components/Table";

export default function Home() {


  

  return (

    < >
    <div className="layout">

<Sidebarnav/>
<div className="w-full">

<Header/>
    <div className="bg-[#f6f6f6] text-black h-screen drop-shadow-xl">

    <Dashboard/>
    <div className="grid grid-cols-3 gap-3 container mx-1 mt-3">
      <div className=" col-span-2">
      
      <TablePage/>
      </div>
      <Todo className=""/>

     
      </div>

    </div>
    </div>
    </div>
    
    </>
    
  );
}
