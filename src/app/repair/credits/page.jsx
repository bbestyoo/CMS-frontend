"use client"
import { getAllCredits, getCreditsCustomerApi, patchProductsApiCompleted, postCreditsCustomerApi, productsApi } from "@/api/GetRepairProducts";
import { DataTable } from "../data-table";
import { useEffect, useState  } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { IoAddCircleSharp } from "react-icons/io5";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"


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



 function CreditorsTable({ columns, data }) {

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


  function handleClick(id){
    router.push(`/repair/credits/${id}`)
  }

  return (
    <div className="w-full mx-auto  h-[50vh]">
      
      <div className=" bg-white overflow-y-scroll h-[] text-black-500 flex items-center justify-between py-4">
        

       
      </div>
      <div className="rounded-md border h-full overflow-y-scroll">
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
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                onClick={()=>handleClick(row.original.id)}
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

export default  function DemoPage() {

  const [isCreditorsTrue, setisCreditorsTrue] = useState(false)
const [open, setOpen] = useState(false);

  const router = useRouter()

  function handleRowClick (rowData){
    console.log('Clicked row:', rowData);
    const repairId = rowData.original.repair_id
    router.push(`/repair/productDetails/${repairId}`)
}
  const [data, setData] = useState([])  
  const [isCompleted, setIsCompleted] = useState(false)

  

  const columns = [
    {
        accessorKey: "name",
        header: "Customer Name",
        cell: ({ row }) => {

          const {name } = row.original

          return <div onClick={() => handleRowClick(row)} className="capitalize hover:cursor-pointer"> {name} </div>
        },
       
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
    accessorKey: "transactions_no",
    header: () => <div className="text-right">No of transactions</div>,
    cell: ({ row }) => (
        <div className="capitalize text-right ">{row.original.repair.length}</div>
      ),
  }
  
  
]


  const someFunction = async () => {

  try{

    const products = await getCreditsCustomerApi();
    console.log("Asdasdresults",products)
    setData(products.credits)
  }
  catch(error) {
    console.error("error",error)
  }
  }
useEffect(() => { 
  someFunction();
  
  }, [isCreditorsTrue]); 

   const [customerName, setCustomerName] = useState('');
  const [due, setDue] = useState('');

  const handleSubmit0 = async (e) => {
    e.preventDefault();
    const data = {'name': customerName, 'due': due};
    const response = await postCreditsCustomerApi(data);
    console.log("data", response);
    setOpen(false);  
    setisCreditorsTrue(true)

  };


  return (
    <div className="container bg-white  mx-auto  rounded-2xl drop-shadow-xl w-11/12 h-[80vh] py-5 ">
        <div className="w-full flex justify-between">
          <p className="text-lg font-semibold">Creditors Details</p>
<Dialog open={open} onOpenChange={setOpen}>
  <DialogTrigger>
     <section
            className="w-fit text-md flex items-center gap-1"
          >
            <p>Add Creditors</p>
            <IoAddCircleSharp
              className="text-indigo-500 hover:text-indigo-700"
              size={30}
            />
          </section>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogDescription>
         <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h1 className="text-lg font-semibold text-center mb-6">Create Creditor</h1>
          <form onSubmit={handleSubmit0} className="space-y-4">
            <input
              type="text"
              value={customerName} // Add value here
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Customer Name"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="text"
              value={due} // Add value here
              onChange={(e) => setDue(e.target.value)}
              placeholder="Due"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition duration-200"
            >
              Submit
            </button>
          </form>
        </div>
      </DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>
             
        </div>
      <CreditorsTable columns={columns} data={data} />
    </div>
  );
}
