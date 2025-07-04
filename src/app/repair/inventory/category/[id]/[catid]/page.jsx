"use client"
import { getItems, patchProductsApiCompleted, productsApi } from "@/api/GetRepairProducts";
import { useEffect, useState  } from "react";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import {ArrowLeft } from 'lucide-react'


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
import { IoAddCircleSharp } from "react-icons/io5";
import { Skeleton } from "@/components/ui/skeleton";
import { nextPageApi } from "@/api/GetRepairProducts"



export function DataDisplay({ columns, initialData, initialMetadata, isLoading }) {
  const router = useRouter();
  console.log("intiial data",initialData)


  // State to manage data and metadata for pagination
  const [data, setData] = useState([]); // Initialize with empty array
  const [metadata, setMetadata] = useState({}); // Initialize with empty object
  const [loading, setLoading] = useState();
  
  
  // States for table configurations
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});

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
  });

  useEffect(() => {
    // Simulate loading initial data
    setData(initialData);
    setMetadata(initialMetadata);
    setLoading(isLoading);
  }, [initialMetadata]);

  const handleClickRoute = () => {
    router.push("/repair/inventory/addProduct/");
  };

  // Function to fetch paginated data from API
  const fetchPaginatedData = async (url) => {
    setLoading(true);
    try {
      const result = await nextPageApi(url)
      setData(result.results || []); // Ensure fallback to empty array
      setMetadata({
        next: result.next,
        previous: result.previous,
        count: result.count,
      });
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle pagination button clicks
  const handlePreviousPage = () => {
    if (metadata.previous) {
      fetchPaginatedData(metadata.previous);
    }
  };

  const handleNextPage = () => {
    if (metadata.next) {
      fetchPaginatedData(metadata.next);
    }
  };

  return (
    <div className="w-full  mx-auto  ">
      <div className=" text-black-500  flex items-center justify-between py-4">
        <div className="justify-start ">
        <Button
                onClick={() => router.push('/repair/inventory/view')}
                variant="outline"
                className="w-full sm:w-auto text-black bg-sky-300   hover:bg-sky-400 "
              >
                <ArrowLeft className="mr-2 h-4 w-3" />
                Back to Brands
              </Button>   
        </div>
        <div className="w-full flex justify-end">
          <section
            className="w-fit text-md flex items-center gap-1"
            onClick={handleClickRoute}
          >
            <p>Add New Products</p>
            <IoAddCircleSharp
              className="text-indigo-500 hover:text-indigo-700"
              size={30}
            />
          </section>
        </div>
           
              </div>
      <div className="rounded-md border  h-[55vh] overflow-y-scroll">
        {loading ? (
          <Skeleton className="w-[100px] h-[20px] rounded-full" />
        ) : (
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
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
                      <TableCell className="text-black-500" key={cell.id}>
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
        )}
      </div>
      <div className="flex items-center justify-end space-x-2 my-5 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel()?.rows?.length || 0} of{" "}
          {table.getFilteredRowModel()?.rows?.length || 0} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreviousPage}
            disabled={!metadata.previous }
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={!metadata.next}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}




export default  function DemoPage() {


  const router = useRouter()
  const params = useParams()
  console.log("params",params)
  const brandId = params.id
  const catId = params.catid
  function handleRowClick (rowData){
    console.log('Clicked row:', rowData);
    const repairId = rowData.original.repair_id
    router.push(`/repair/productDetails/${repairId}`)
}
  const [data, setData] = useState([])  
  const [isCompleted, setIsCompleted] = useState(false)
  const [metadata, setMetadata] = useState({})


  const columns = [
    {
        accessorKey: "name",
        header: "Products",
        cell: ({ row }) => {

          return <div onClick={() => handleRowClick(row)} className="capitalize hover:cursor-pointer"> {row.getValue("name")}  </div>
        },
       
      },
    {
        accessorKey: "quantity",
        header: "Quantity",
        cell: ({ row }) => (
          <div className="capitalize">{row.getValue("quantity")}</div>
        ),
      },
 
  {
    accessorKey: "cost",
    header: () => <div className="text-right">Cost</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("cost"))

      // Format the amount as a dollar amount
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "Nrs",
      }).format(amount)

      return <div className="text-right font-medium">{formatted}</div>
    },
  },
 
  
  // {
  //   accessorKey: "amount_paid",
  //   header: () => <div className="text-right">Paid Amount</div>,
  //   cell: ({ row }) => {
  //     const value = row.getValue("amount_paid");
  //     return <AmountPaidCell value={value} row={row} />;
  //   },
  // }
  
  
  
]


  const someFunction = async () => {

  try{

    const products = await getItems();
    console.log(products)
    const filteredProducts = products.filter((item)=> item.brand == brandId && item.category == catId)
        setMetadata({

          "next" : products.next,
          "previous" : products.previous,
          "count" : products.count
        })
    setData(filteredProducts)
    console.log(metadata)
  }
  catch(error) {
    console.error("error",error)
  }
  }
useEffect(() => { 
  someFunction();
  
  }, []); 

  console.log("data",data)

  return (
    <div className="container bg-white  mx-auto mt-3 rounded-2xl drop-shadow-xl w-11/12 h-[85vh] ">
      <DataDisplay columns={columns} initialData={data} initialMetadata={metadata} />
    </div>
  );
}
