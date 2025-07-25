'use client'
import React, { useState, useEffect } from 'react';
import {  useRouter, useSearchParams } from 'next/navigation';
import { getSearchProductsApi } from '@/api/GetRepairProducts';
import {
  Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {  format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

function Search({ className }) {
  const currentDate = new Date();
  const startOfCurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const startOfNextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);

  const [date, setDate] = useState({
    from: startOfCurrentMonth,
    to: startOfNextMonth,
  });

  const [msg, setMsg] = useState("");
  const [dataList, setDataList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();


  async function getSearch() {
    let query;
    if (searchParams.has('start_date')) {
      query = `start_date=${searchParams.get('start_date')}&end_date=${searchParams.get('end_date')}`;
    } else {
      query = `q=${searchParams.get('q')}`;
    }

    try {
      setIsLoading(true)
      const response = await getSearchProductsApi(query);
      if (response && response.length > 0 && response !== 'NONE') {
        setDataList(response);
        setMsg("");
        setIsLoading(false)
      } else {
        setMsg("No repairs found");
        setIsLoading(false)
      }
    } catch (err) {
      console.log("error", err);
    }
  }

  useEffect(() => {
    getSearch();
  }, [searchParams]);

  function onDateSearch(e){
    setIsLoading(true)
    const combinedDateQuery = `start_date=${formattedDate.from}&end_date=${formattedDate.to}`;
    router.push(`/repair/search?${combinedDateQuery}`);
  }

  function handleClick(repair_id) {
    router.push(`/repair/productDetails/${repair_id}`);
  }

  function formatDate(date) {
    if (!date) return '';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  }

  const formattedDate = {
    from: formatDate(date?.from),
    to: formatDate(date?.to)
  };

  return (
    <div className="w-full container">
      <div className='flex w-full mx-auto justify-between px-3'>
        
       {
         isLoading ? <div className=' text-center mt-4 text-sky-600'>Search or filter your products!</div> : <p className='text-center mt-4 text-sky-600'>Here are your Searches</p>
       } 
        <div className='flex gap-3 mt-4 items-center '>
          <div className={cn("grid gap-2 border border-black rounded-md ", className)}>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className={cn("w-[300px] justify-start text-left font-normal bg-black-300", !date && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(date.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>
          <button onClick={onDateSearch} className='bg-sky-600 text-white px-4 py-2 rounded-xl hover:bg-sky-500'>Filter</button>
        </div>
      </div>
      <div className='h-[80vh]  overflow-y-scroll'>
        {
          dataList && dataList.length > 0 && msg === "" ? (
            <Table className="h-full  bg-white drop-shadow-xl mx-auto my-3 rounded-2xl">
              <TableCaption>A list of your recent transactions.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-fit">Customer Info</TableHead>
                  <TableHead>Problem</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dataList.map((data, i) => (
                  <TableRow onClick={() => handleClick(data.repair_id)} className="" key={i}>
                    <TableCell className="font-medium"><p className='p-2'>{`${data.phone_model} by ${data.customer_name}`}</p></TableCell>
                    <TableCell>{data.repair_problem}</TableCell>
                    <TableCell>{data.repair_status}</TableCell>
                    <TableCell className="text-right"><p className='pr-2'>{data.total_amount}</p></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className='mt-60 text-center'>{msg}</p>
          )
        }
      </div>
    </div>
  );
}

export default Search;
