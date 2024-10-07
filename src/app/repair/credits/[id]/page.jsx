"use client"
import { getSingleCreditsCustomerApi, patchProductsApiCompleted, productsApi } from "@/api/GetRepairProducts";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from 'react';


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
import { Input } from "@/components/ui/input"
import { IoAddCircleSharp } from "react-icons/io5";
import { useRouter, useParams } from 'next/navigation';
import { Skeleton } from "@/components/ui/skeleton"



 function DataTable({ columns, data, isLoading }) {

     
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
      
      <div className=" bg-white text-black-500 flex items-center justify-between py-4">
       
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

  const router = useRouter()
  const params = useParams()
  const id = params.id
  console.log("asd",id)

  function handleRowClick (rowData){
    console.log('Clicked row:', rowData);
    const repairId = rowData.original.repair_id
    router.push(`/repair/productDetails/${repairId}`)
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

    const products = await getSingleCreditsCustomerApi(id);
    console.log("adadasd",products.credits.repair)
    setData(products.credits.repair)
  }
  catch(error) {
    console.error("error",error)
  }
  }
useEffect(() => { 
  someFunction();
  
  }, []); 


  return (
    <div className="container bg-white  mx-auto  rounded-2xl drop-shadow-xl w-11/12 h-[480px] ">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
