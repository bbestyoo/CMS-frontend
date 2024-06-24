"use client"
import { patchProductsApiCompleted, productsApi } from "@/api/GetRepairProducts";
import { DataTable } from "../data-table";
import { useEffect, useState  } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default  function DemoPage() {


  const router = useRouter()

  function handleRowClick (rowData){
    console.log('Clicked row:', rowData);
    router.push(`/repair/productDetails/${rowData.original.repair_id}`)
}
  const [data, setData] = useState([])  
  const [isCompleted, setIsCompleted] = useState(false)

  

  const columns = [
    {
        accessorKey: "phone_model",
        header: "Products",
        cell: ({ row }) => {

          const {customer_name } = row.original

          return <div onClick={() => handleRowClick(row)} className="capitalize hover:cursor-pointer"> {row.getValue("phone_model")} by {customer_name} </div>
        },
       
      },
    {
        accessorKey: "repair_problem",
        header: "Problem",
        cell: ({ row }) => (
          <div className="capitalize">{row.getValue("repair_problem")}</div>
        ),
      },
 
  {
    accessorKey: "total_amount",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("total_amount"))

      // Format the amount as a dollar amount
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "Nrs",
      }).format(amount)

      return <div className="text-right font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: "repair_status",
    header: "Status",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("repair_status")}</div>
    ),
  },
  
  {
    accessorKey: "amount_paid",
    header: () => <div className="text-right">Paid Amount</div>,
    cell: ({ row }) => (
        <div className="capitalize text-right ">{row.getValue("amount_paid")}</div>
      ),
  }
  
  
]


  const someFunction = async () => {

  try{

    const products = await productsApi();
    console.log(products)
    const filteredData = products.filter((el)=> el.repair_status === "Completed" )
    setData(filteredData)
  }
  catch(error) {
    console.error("error",error)
  }
  }
useEffect(() => { 
  someFunction();
  
  }, []); 


  return (
    <div className="container bg-white  mx-auto  rounded-2xl drop-shadow-xl w-11/12 py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
