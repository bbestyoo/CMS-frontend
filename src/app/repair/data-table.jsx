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
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { nextPageApi } from "@/api/GetRepairProducts"

export function DataTable({ columns, initialData, initialMetadata, isLoading }) {
  const router = useRouter();


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
    router.push("/repair/order");
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
    <div className="w-full  mx-auto h-[57vh] ">
      <div className=" text-black-500 flex items-center justify-between py-4">
        <div className="w-full flex justify-end">
          <section
            className="w-fit text-md flex items-center gap-1"
            onClick={handleClickRoute}
          >
            <p>Add Repairs</p>
            <IoAddCircleSharp
              className="text-indigo-500 hover:text-indigo-700"
              size={30}
            />
          </section>
        </div>
      </div>
      <div className="rounded-md border h-[55vh] overflow-y-scroll">
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
