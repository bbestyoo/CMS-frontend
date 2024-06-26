'use client'
import React from 'react'
import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { getSearchProductsApi } from '@/api/GetRepairProducts';

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  import { addDays, format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"
 
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

function Search({className}) {

  const currentDate = new Date();

  const startOfCurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const startOfNextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);

  const [date, setDate] = React.useState({
    from: startOfCurrentMonth,
    to: startOfNextMonth,
  });
    // console.log("date",date)

    const formattedDate = {
      from: formatDate(date?.from),
      to: formatDate(date?.to)
    };
    

  
  const [msg, setMsg] = useState("");
  // const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");
  const [dataList, setDataList] = useState([]);
  const [isEmpty, setIsEmpty] = useState(false);
  const router = useRouter();
  const search = useSearchParams()
  
  console.log("***********88",dataList)


  function handleChange(e) {
    setInput(e.target.value)
    console.log(input)
  }
  function onSearch(e) {
    e.preventDefault()
    const combinedDateQuery = `start_date=${formattedDate.from}&end_date=${formattedDate.to}`;
    if(input && input.length > 0 ){

      router.push(`/repair/search${input ? `?q=${input}` : ''}`);
      }
      else {
        router.push(`/repair/search?${combinedDateQuery}`)

      }
  }

  async function getSearch(){
    let start_date = null;
    let end_date = null;
    let q = null;
    console.log("here")
    if (search.has('start_date')) {
      start_date = search.get('start_date');
      end_date = search.get('end_date');
      const query = `start_date=${start_date}&end_date=${end_date}`
      try{
        
        console.log("etered")
        const response = await getSearchProductsApi(query)
        console.log("heres the response",response)
        if( response && response.length > 0 && response != 'NONE'){

          setDataList(response)
        }
        else {
          setMsg("No repairs found")

        }
        router.push('')


    }
    catch(err){
        console.log("error",err)
    }
      
  } 
  else {
      q = search.get('q');
      try{
        
        console.log("etered")
        const response = await getSearchProductsApi(q)
        console.log("heres the response",response)
        if( response && response.length > 0 && response != 'NONE'){

          setDataList(response)
        }
        else {
          setMsg("No repairs found")

        }
        router.push('')


    }
    catch(err){
        console.log("error",err)
    }
  }

    if((q && q.length > 0) || (start_date && end_date)){
        console.log("inside")

    try{
        
        console.log("etered")
        const response = await getSearchProductsApi(search)
        console.log("heres the response",response)
        if( response && response.length > 0 && response != 'NONE'){

          setDataList(response)
        }
        else {
          setMsg("No repairs found")

        }


    }
    catch(err){
        console.log("error",err)
    }
}
else {
  console.log("error")

}
    }

useEffect (()=>{
    getSearch()
    
  }, [search]);

  function handleClick(repair_id){
    router.push(`/search/${repair_id}`)
  }

  function formatDate(date) {
    if (!date) return ''; 

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();
  
    return `${year}-${month}-${day}`;
  }

  return (
    <div className="w-full my-5 mx-5 container">
        <div className='flex w-full mx-auto justify-between px-3'>

        <form className='w-fit' onSubmit={onSearch} action="">

      <input
        name="search"
        onChange={(e) => {
            e.preventDefault();
            handleChange(e);
        }}
        value={input}
        className="w-[400px]  my-3 text-sm border-2 text-black-500 bg-white rounded-md p-2 outline-none"
        placeholder="search your repairs"
        />
        
        </form>
        <div className='flex gap-3 items-center'>
        <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal bg-black-300",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
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
    <button onClick={onSearch} className='bg-gray-300 px-3 py-1 rounded-2xl hover:bg-gray-500'>Filter</button>
    </div>
        </div>
        <div className='h-[465px] overflow-y-scroll'>

        {
  dataList && dataList.length > 0 && msg === "" ? (
    <Table className="h-full w-5/6 bg-white drop-shadow-xl mx-auto my-3 rounded-2xl">
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
    <p>{msg}</p>
  )
}



        </div>
    </div>
  );
}

export default Search;