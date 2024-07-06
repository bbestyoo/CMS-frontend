import Dashboard from "@/components/Dashboard";
import Header from "@/components/Header";
import Sidebarnav from "@/components/Sidebarnav";
// import Todo from "@/components/Todo";
import TablePage from "@/components/Table";

export default function Home() {

  return (

    < >
    <div className="layout">

<Sidebarnav/>
<div className="w-full bg-[#f6f6f6]">

<Header/>
    <div className="bg-inherit text-black ">

    <Dashboard/>
    <div className="grid grid-cols-3 gap-3 container mt-3">
      <div className=" col-span-3">
      
      <TablePage/>
      </div>
      {/* <Todo className=""/> */}

     
      </div>

    </div>
    </div>
    </div>
    
    </>
    
  );
}
