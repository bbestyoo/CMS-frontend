
"use client";
import React, { useEffect, useState } from "react";
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
import { Button } from "@/components/ui/button";
import { IoAddCircleSharp } from "react-icons/io5";
import { usePathname, useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { nextPageApi, postProductsApi } from "@/api/GetRepairProducts"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useAppSelector } from "@/lib/hooks";
import { useForm } from "react-hook-form";


export function  DataTable({ columns, initialData, initialMetadata, isLoading }) {
  const router = useRouter();
  const pathname = usePathname()
  console.log("pathname",pathname)

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


  //order code 
  const userData = useAppSelector((state)=> state.user.value)
  
    const {
      register,
      watch, 
      setValue,
      handleSubmit,
      formState: { errors },
    } = useForm()
  
    const totalAmount = watch('total_amount');
    const advancePaid = watch('advance_paid');
  
    const [receivedDate, setReceivedDate] = useState(() => {
      const today = new Date();
      return today.toISOString().split('T')[0]; // Format the date as yyyy-mm-dd
    });
    const [deliveryDate, setDeliveryDate] = useState(() => {
      const today = new Date();
      return today.toISOString().split('T')[0]; // Format the date as yyyy-mm-dd
    });
  
    const [receivedBy, setReceivedBy] = useState(userData?.userinfo?.name)
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
  
    function formatErrors(errorObj) {
    return Object.entries(errorObj)
      .map(([key, messages]) => `${formatField(key)}: ${messages.join(", ")}`)
      .join(". ");
  }
  
  function formatField(field) {
    // Make it pretty
    return field
      .replace(/_/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());
  }
  
    useEffect(() => {
      // Calculate the due amount
      const dueAmount = (parseFloat(totalAmount) || 0) - (parseFloat(advancePaid) || 0);
      // Set the due value in the form
      setValue('due', dueAmount);
    }, [totalAmount, advancePaid, setValue]);
  
    async function onSubmit(data){
      if (isSubmitting) return;
      setIsSubmitting(true);  
      try {
        const res = await postProductsApi(data)
        console.log("reached here",res)
        if(!res.ok){
          const errData = await res.json();
           const message = formatErrors(errData);
        setError(message);
        setIsSubmitting(false)
          return;
        }
        const pathres = await res.json()
        setError("");
        router.push(`/search/${pathres.repair_id}`)
      } catch(err) {
        console.log("error", err)
        setIsSubmitting(false)
      } 
    }
  return (
    <div className={`${pathname == '/repair/credited-repairs' ? "h-[70vh]" : "h-[78vh]" } w-full mx-auto  overflow-y-scroll hide-scrollbar`}>
      <div className=" text-black-500 flex items-center justify-between py-4">
        { 
        !pathname.includes('/repair/credited-repairs') && (
          <div className="px-1 w-full flex justify-end">
          <Dialog className="">
  <DialogTrigger>
              <div className="w-full  ">
              <section
                className="w-fit text-md flex items-center gap-1"
              >
          <p>Add Repairs</p>
            <IoAddCircleSharp
              className="text-indigo-500 hover:text-indigo-700"
              size={30}
            />
            </section>
        </div>
  </DialogTrigger>
  <DialogContent className="bg-sky-700 border-none h-[80vh] overflow-y-scroll hide-scrollbar">
    <DialogHeader>
      <DialogDescription>
         <div className="   text-black mx-auto rounded-xl drop-shadow-xl mb-0 capitalize0 bg-footer">
        <h2 className="text-sky-100 text-xl text-center font-semibold mb-5">Enter a Record</h2>
        <form  
        className='flex flex-wrap justify-around gap-2'
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="mb-0 capitalize w-[45%]">
            <label htmlFor="customer_name" className="block text-sm font-medium text-white">
              Customer Name
            </label>
            <input
              type="text"
              id="customer_name"
              name="customer_name"
              {...register('customer_name',  { required: true })}
              className="mt-1 p-2 w-full border rounded-md "
            />

          </div>
          <div className="mb-0 capitalize w-[45%]">
            <label htmlFor="customer_phone_number" className="block text-sm font-medium text-white">
              Customer Phone Number
            </label>
            <input
              type="text"
              id="customer_phone_number"
              name="customer_phone_number"
              {...register('customer_phone_number',  { required: true })}

              className="mt-1 p-2 w-full border rounded-md "
            />
          </div>
          <div className="mb-0 capitalize  w-[45%]">
            <label htmlFor="phone_model" className="block text-sm font-medium text-white">
              Phone Model
            </label>
            <input
              type="text"
              id="phone_model"
              name="phone_model"
              {...register('phone_model',  { required: true })}

              className="mt-1 p-2 w-full border rounded-md "
              required
            />
          </div>
          <div className="mb-0 capitalize  w-[45%]">
            <label htmlFor="repair_problem" className="block text-sm font-medium text-white">
              Repair Problem
            </label>
            <input
              type="text"
              id="repair_problem"
              name="repair_problem"
              {...register('repair_problem',  { required: true })}
              className="mt-1 p-2 w-full border rounded-md "
              required
            />
          </div>  
         
          <div className="mb-0 capitalize  w-[45%]">
            <label htmlFor="imei_number" className="block text-sm font-medium text-white">
              Imei number
            </label>
            <input
              type="text"
              id="imei_number"
              name="imei_number"
              {...register('imei_number',  { required: true })}

              className="mt-1 p-2 w-full border rounded-md "
              required
            />
          </div>
          <div className="mb-0 capitalize  w-[45%]">
            <label htmlFor="sim" className="block text-sm font-medium text-white">
            Sim 
            </label>
            <select
              id="sim"
              name="sim"
              {...register('sim')}

              className="mt-1 p-2 w-full border rounded-md "
              required
            >
              <option value="" disabled>
                Select Sim 
              </option>
              <option value="Absent">Absent</option> 
              <option value="Present">Present</option>
            </select>
          </div>
          <div className="mb-0 capitalize  w-[45%]">
            <label htmlFor="sim_tray" className="block text-sm font-medium text-white">
            Sim tray
            </label>
            <select
              id="sim_tray"
              name="sim_tray"
              {...register('sim_tray')}

              className="mt-1 p-2 w-full border rounded-md "
              required
            >
              <option value="" disabled>
                Select Sim tray
              </option>
              <option value="Present">Present</option>
              <option value="Absent">Absent</option> 
            </select>
          </div>
          <div className="mb-0 capitalize  w-[45%]">
            <label htmlFor="SD_card" className="block text-sm font-medium text-white">
            SD card
            </label>
            <select
              id="SD_card"
              name="SD_card"
              {...register('SD_card')}

              className="mt-1 p-2 w-full border rounded-md "
              required
            >
              <option value="" disabled>
                Select SD card
              </option>
              <option value="Absent">Absent</option>
              <option value="Present">Present</option>
            </select>
          </div>
          <div className="mb-0 capitalize  w-[45%]">
            <label htmlFor="phone_cover" className="block text-sm font-medium text-white">
            phone cover
            </label>
            <select
              id="phone_cover"
              name="phone_cover"
              {...register('phone_cover')}

              className="mt-1 p-2 w-full border rounded-md "
              required
            >
              <option value="" disabled>
                Select cover
              </option>
              <option value="Absent">Absent</option>
              <option value="Present">Present</option>
            </select>
          </div>
          <div className="mb-0 capitalize  w-[45%]">
            <label htmlFor="total_amount" className="block text-sm font-medium text-white">
              Total Amount
            </label>
            <input
              type="text"
              id="total_amount"
              name="total_amount"
              {...register('total_amount',  { required: true })}

              className="mt-1 p-2 w-full border rounded-md "
              required
            />
          </div>
          <div className="mb-0 capitalize  w-[45%]">
            <label htmlFor="advance_paid" className="block text-sm font-medium text-white">
              Advance paid
            </label>
            <input
              type="text"
              id="advance_paid"
              name="advance_paid"
              {...register('advance_paid',  { required: true })}

              className="mt-1 p-2 w-full border rounded-md "
              required
            />
          </div>
          <div className="mb-0 capitalize  w-[45%]">
            <label htmlFor="due" className="block text-sm font-medium text-white">
              Due
            </label>
            <input
              type="text"
              id="due"
              name="due"
              {...register('due',  { required: true })}

              className="mt-1 p-2 w-full border rounded-md "
              required
            />
          </div>
          <div className="mb-0 capitalize   w-[45%]">
            <label htmlFor="received_date" className="block text-sm font-medium text-white">
              received date
            </label>
            <input
              type="date"
              id="received_date"
              name="received_date"
              {...register('received_date',  { required: true })}
              defaultValue={receivedDate}
              onChange={(e) => setReceivedDate(e.target.value)}

              className="mt-1 p-2 w-full border rounded-md "
            />
          </div>
          <div className="mb-0 capitalize   w-[45%]">
            <label htmlFor="delivery_date" className="block text-sm font-medium text-white">
              delivery date
            </label>
            <input
              type="date"
              id="delivery_date"
              name="delivery_date"
              {...register('delivery_date',  { required: true })}
              defaultValue={deliveryDate}
              onChange={(e) => setDeliveryDate(e.target.value)}

              className="mt-1 p-2 w-full border rounded-md "
            />
          </div>
          <div className="mb-0 capitalize   w-[45%]">
            <label htmlFor="received_by" className="block text-sm font-medium text-white">
              received by
            </label>
            <input
              type="text"
              id="received_by"
              name="received_by"
              {...register('received_by',  { required: true })}
              defaultValue={receivedBy}
              className="mt-1 p-2 w-full border rounded-md "
            />
          </div>
          <button
            type="submit"
            className="w-full bg-sky-600 hover:bg-sky-800 text-white font-semibold p-3 mt-4 rounded-md disabled:bg-gray-400"
            disabled={isSubmitting}
          >
            Submit
          </button>
          {error && <p className='text-red-400 text-sm'>{error}</p>}
        </form>
      </div>
      </DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>
</div>
            
           )
}
      </div>
      <div className="rounded-md border   ">
        
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
           
            <TableBody className=" z-10">
              {table?.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                  className="bg-sky-50 border-b-4 border-white z-10"
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell className="text-black-500  z-10" key={cell.id}>
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
      <div className="flex items-center justify-end space-x-2 my-5">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredRowModel()?.rows?.length || 0} records .
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