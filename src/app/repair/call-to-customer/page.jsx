"use client"
import { patchProductsApiCompleted, productsApi } from "@/api/GetRepairProducts";
import { DataTable } from "../data-table";
import { useEffect, useState  } from "react";
import { Button } from "@/components/ui/button";

export default  function DemoPage() {

  const [data, setData] = useState([])  
  const [isCompleted, setIsCompleted] = useState(false)


  const AmountPaidCell = ({ value, row, table }) => {
    const [amountPaid, setAmountPaid] = useState(value || 0);
    const handleInputChange = (e) => {
      const newValue = parseFloat(e.target.value) || 0;
      setAmountPaid(newValue);
      // Update the row data with the new value
      const rowIndex = row.index;
      const updatedRow = { ...row.original, amount_paid: newValue };
      table.options.meta?.updateData(rowIndex, updatedRow);
    };

    return (
      <div className="text-right font-medium flex justify-end gap-4">
        <input
          type="number"
          value={amountPaid}
          onChange={handleInputChange}
          onClick={(e) => e.stopPropagation()}

          className="text-right"
          style={{ width: "100px" }}
        />
        <Button               
onClick={(e)=>handleCompleted(row.original.repair_id, amountPaid, e)}>Ok</Button>
      </div>
    );
  }
  
  // asdasd

  const columns = [
    {
        accessorKey: "phone_model",
        header: "Products",
        cell: ({ row }) => {

          const {customer_name } = row.original

          return <div className="capitalize "> {row.getValue("phone_model")} by {customer_name} </div>
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
        accessorKey: "customer_phone_number",
        header: "Phone",
        cell: ({ row }) => (
          <div className="capitalize">{row.getValue("customer_phone_number")}</div>
        ),
      },
 
  {
    accessorKey: "due",
    header: () => <div className="text-right">Due Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("due"))

      // Format the amount as a dollar amount
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "Nrs",
      }).format(amount)

      return <div className="text-right font-medium">{formatted}</div>
    },
  },

  
  {
    accessorKey: "amount_paid",
    header: () => <div className="text-right">Paid Amount</div>,
    cell: ({ row, table }) => {
      const value = row.getValue('amount_paid');
      return <AmountPaidCell value={value} row={row} table={table} />;
    
    },
  }
  
  
]


const handleCompleted = async (repairId,amountPaid, e) => {
  e.stopPropagation()
  console.log("here")
  try {
    console.log("here again")
    // Perform your PATCH request here
    console.log("******8",repairId)
    console.log("amt",amountPaid)
    const response = await patchProductsApiCompleted(repairId, amountPaid)
    const result = await response
    console.log("patched", result)   
    setIsCompleted(true)     
    console.log(isCompleted)

  } 
  catch (error) {
    console.error('Error updating data:', error);
  }
  
}

  const someFunction = async () => {

  try{

    const products = await productsApi();
    console.log(products)
    const filteredData = products.filter((el)=> el.repair_status === "Repaired" )
    setData(filteredData)
  }
  catch(error) {
    console.error("error",error)
  }
  }
 
useEffect(() => { 
someFunction();

}, [isCompleted]); 

  return (
    <div className="container bg-white  mx-auto  rounded-2xl drop-shadow-xl w-11/12 py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
