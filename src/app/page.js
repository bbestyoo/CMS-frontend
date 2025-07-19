import Dashboard from "@/components/Dashboard";
import Header from "@/components/Header";
import Sidebarnav from "@/components/Sidebarnav";
// import Todo from "@/components/Todo";
import TablePage from "@/components/Table";
import App from "./repair/charts/page";
import  ChartPieInteractive  from "@/components/PieChart";

export default function Home() {

  return (

    < >
    <div className="layout ">
<div className="flex min-h-screen md:w-[250px] w-0">
<Sidebarnav/>
        </div>
<div className="w-full bg-[#f6f6f6]">

<Header/>
    <div className="bg-inherit text-black ">

    <Dashboard/>
    {/* <App /> */}
    <div className="grid grid-cols-5 gap-3 container mt-3">
      <div className=" col-span-3 ">
      
      <TablePage/>
      </div>
      <div className="col-span-2" >
        <ChartPieInteractive />
      </div>
      {/* <Todo className=""/> */}

     
      </div>

    </div>
    </div>
    </div>
    
    </>
    
  );
}
