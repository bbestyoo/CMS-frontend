"use client"
import {  getCreditsCustomerApi, getSingleCreditsCustomerApi, patchCreditsCustomerApi, productsApi } from "@/api/GetRepairProducts";
import { useEffect, useState  } from "react";
import { useRouter } from "next/navigation";
import { DataTable } from "../data-table";
import { BiEditAlt } from "react-icons/bi";
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
// columns.js

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { IoAddCircleSharp } from "react-icons/io5";

export function CreditTable({ columns, data, isLoading }) {


  console.log("herebitch",data)
     
  const router = useRouter()
  const [sorting, setSorting] = useState([])
  const [columnFilters, setColumnFilters] = useState(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    useState({})
  const [rowSelection, setRowSelection] = useState({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  function handleClickRoute(){
    router.push('/repair/order')
  }




  return (
    <div className="w-full mx-auto h-[320px]">
      
      <div className="rounded-md border h-full overflow-y-scroll ">
        {/* {isLoading &&  <Skeleton className="w-[100px] h-[20px] rounded-full" >

           </Skeleton>} */}
        <Table className="h-fit">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table?.getRowModel()?.rows?.length ? (
              table?.getRowModel()?.rows.map((row) => (
                <TableRow
                  key={row.id}
                  
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell 

                    className="text-black-500" key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )

}

export function CreditPaid({row, handleCreditPaid}){

  const [value, selectValue] = useState(Number)
  const repair_id = row.original.repair_id


  return (
    <>
    <div className="flex gap-3 justify-end  items-center">
        <div className="capitalize text-center ">{row.getValue("credit_due")}</div>
        <div className="mb-4 flex  w-2/3  items-center gap-3">
                    <input
                      type="number"
                      id="credit_paid"
                      name="credit_paid"
                      onChange={(e)=>selectValue(e.target.value)}
                      className="mt-1 p-2 w-full border rounded-md"
                      required
                    />
                  <button
                    type="submit"
                    onClick={() => handleCreditPaid(value, repair_id)}
                    className="bg-blue-500 text-black py-2 px-4 rounded-md hover:bg-blue-600"
                  >
                    Post
                  </button>
        </div>
      </div>
    </>
  )

}

export default  function DemoPage() {

  const [creditsCustomer, setCreditsCustomer] = useState([])
  // const [selectedCustomer, setSelectedCustomer] = useState('');
  const [data, setData] = useState([])  
  const [isData, setIsData] = useState(false)  
  console.log("second datta check",data)

  async function handleSelectChange(event){
    const selectedValue = event.target.value;
    // setSelectedCustomer(selectedValue);
    console.log('Selected customer name:', selectedValue);
    const response = await getSingleCreditsCustomerApi(selectedValue)
    console.log("sigle",response)
    setData(response.credit_repairs)
    setIsData(true)


  };


  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const router = useRouter()

  function handleRowClick (rowData){
    console.log('Clicked row:', rowData);
    const repairId = rowData.original.repair_id
    router.push(`/repair/productDetails/${repairId}`)
}

  
  async function onSubmit(data){
    console.log("datacredits",data)
    const credits_data = {...data, repair_id:row.original.repair_id, repair_status:"Credited"}
    // const response = await patchCreditsCustomerApi(credits_data)
    // console.log(response)
    // setIsCredited(true)
  }

  const columns = [
    {
        accessorKey: "phone_model",
        header: "Customer",
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
    accessorKey: "amount_paid",
    header: () => <div className="text-right">Paid Amount</div>,
    cell: ({ row }) => (
        <div className="capitalize text-right ">{row.getValue("amount_paid")}</div>
      ),
  },
  
  {
    accessorKey: "credit_due",
    header: () => <div className="text-right">Due Amount</div>,
    cell: ({ row }) => (
      <CreditPaid row={row} handleCreditPaid={handleCreditPaid} />
      ),
  },
  
  
]


  const someFunction = async () => {
      try {
        const response = await getCreditsCustomerApi();
        console.log("initial", response);
        // console.log("once againnnnnnnnnn");
        setCreditsCustomer(response.credits);
        !isData && setData(response.credit_repairs)
        // console.log("**************",data.length)
      } catch (error) {
        console.error("Error fetching credits customer:", error);
      }
  }

//for tvo or more credit users and vhen u select them store the value in localstorage or smth for the users t
// to save so that after one select credit user and patch the data u get the data from same user instead of the recent data or smthelse
  const handleCreditPaid = async(value, repair_id) => {
    
    const credits_data = {credit_paid: value, repair_id,}
    console.log("Asd",credits_data)
    const response = await patchCreditsCustomerApi(credits_data)
    console.log("***********",response)
    setIsData(true)


  }


useEffect(() => { 
  someFunction();
  // setIsData(false)
  // return () => {
    setIsData(false)
  // }
  }, [isData]); 


  return (
    <div className="container bg-white  mx-auto  rounded-2xl drop-shadow-xl w-11/12 h-[480px] pt-10">
        <div className="mb-4">
                    <label htmlFor="outside_name" className="block text-sm font-medium text-black">
    Select Customers
  </label>
  <select
    id="credit_id"
    name="credit_id"
    {...register('credit_id', { required: true })}
    className="mt-1 p-2 w-full border rounded-md"
    required
    onChange={handleSelectChange} 
  >
  <option value="">Select Customer</option>
    {
      creditsCustomer?.map((el, i)=>{
        return <option key={i} value={`${el.id}`}>{el.name}</option>

      })
    } 
  </select>
        </div>
      <CreditTable columns={columns} data={data} />
    </div>
  );
}
