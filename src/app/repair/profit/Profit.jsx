'use client'
import React, { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { productsProfitApi } from '@/api/GetRepairProducts';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppSelector } from '@/lib/hooks';
import { getCookie } from 'cookies-next';
import { cn } from "@/lib/utils"
import { Calendar as CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { addDays, format } from "date-fns";

const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;


function Profit() {

  const currentDate = new Date();
  const startOfCurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const startOfNextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);

  const [date, setDate] = React.useState({
    from: startOfCurrentMonth,
    to: startOfNextMonth,
  });
  const userData = useAppSelector((state) => state.user.value)
  const [Pdata, setPData] = useState([])
  const [searched, setSearched] = useState(false)
  // useEffect(() => {
  //     if (userData !== null) {
  //         setRole(userData?.userinfo?.role);
  //         setId(userData?.userinfo?.id);
  //     }
  // }, [userData]); 
  const [filteredData, setFilteredData] = useState([])
  const [adminOnlyData, setAdminOnlyData] = useState([])
  const [chosenData, setChosenData] = useState([])
  const searchParams = useSearchParams();



  const router = useRouter()


  const someProfitFunction = async () => {
    try {
      // Call the productsApi function to fetch data
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
      const dd = String(today.getDate()).padStart(2, '0');

      const formatDate = `${yyyy}-${mm}-${dd}`;
      let query = `start_date=${formatDate}&end_date=${formatDate}`;

      if (searchParams.has('start_date') && searchParams.has('end_date')) {
        query = `start_date=${searchParams.get('start_date')}&end_date=${searchParams.get('end_date')}`;
        const token = getCookie('accesstoken')
        const res = await fetch(
          `${baseURL}enterprise/profit?${query}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`, // Assuming it's a bearer token
            },
            credentials: 'include' // Use 'include' to send cookies with the request
          }
        )
        const result = await res.json()
        setPData(result);
        setChosenData(result.data);
        setFilteredData([]);
        setSearched(true)
      }
      else if (searchParams.has('q')) {
        query = `q=${searchParams.get('q')}`;
        const token = getCookie('accesstoken')
        const res = await fetch(
          `${baseURL}enterprise/profit?${query}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`, // Assuming it's a bearer token
            },
            credentials: 'include' // Use 'include' to send cookies with the request
          }
        )
        const result = await res.json()
        setPData(result);
        setChosenData(result.data);
        setFilteredData([]);
        setSearched(true)
      }
      else {
        const monthlyData = await productsProfitApi();
        setPData(monthlyData);
        setChosenData(monthlyData.data);
        let query = `start_date=${formatDate}&end_date=${formatDate}`;
        const token = getCookie('accesstoken')
        const res = await fetch(
          `${baseURL}enterprise/profit?${query}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`, // Assuming it's a bearer token
            },
            credentials: 'include' // Use 'include' to send cookies with the request
          }
        )
        const result = await res.json()
        setFilteredData(result);
        const admindata = result.data.filter((data) => data.admin_only_profit !== null)
        setAdminOnlyData(admindata);
      }
    }
    catch (error) {
      // Handle errors if any
      console.error('Error fetching products:', error);
    }
  };

  // useEffect(() => { 
  // someFunction();
  // }, [userData])
  useEffect(() => {
    someProfitFunction()
    setSearched(false);
  }, [userData, searchParams])



  function handleClick(repair_id) {
    router.push(`/repair/productDetails/${repair_id}`)
  }

  //for filter vith date
  const formattedDate = {
    from: formatDate(date?.from),
    to: formatDate(date?.to)
  };

  function formatDate(date) {
    if (!date) return '';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  }

  function onDateSearch(e) {
    e.preventDefault();
    const combinedDateQuery = `start_date=${formattedDate.from}&end_date=${formattedDate.to}`;
    router.push(`/repair/profit?${combinedDateQuery}`);
  }

  return (
    <>
      <div className='  h-[92vh] bg-main overflow-y-scroll rounded-xl mx-1'>
        <div className=' w-1/2 '>

          <div className=' bg-gradient-to-br from-sky-200 to-slate-200 drop-shadow-xl  px-5 py-3 rounded-xl ml-5 my-2 w-[450px] ' onClick={() => setChosenData(Pdata.data)}>
            {searched === false ? <h1 className='mb-2   text-xl font-semibold text-center text-sky-600'>This Month&apos;s Summary</h1> : <h1 className='mb-2 text-left  text-xl font-semibold text-sky-600'>Chosen date Summary</h1>}

            <div className='grid grid-cols-2'>
              <div className='mb-1 flex items-center gap-2'>
                <h3 className='text-sm font-bold text-slate-600'>Total Number:</h3>
                <p className='font-semibold'>{`${Pdata?.data?.length}`}</p>

              </div>
              {
                userData?.userinfo?.role === 'Admin' &&
                <div className='mb-1 flex items-center gap-2 justify-self-end'>
                  <h3 className='text-sm font-bold text-slate-600'>Total  Profit:</h3>
                  <p className='font-semibold'>{`Rs.${Pdata?.total_profit}`}</p>

                </div>
              }
              {
                userData?.userinfo?.role === 'Admin' &&
                <div className='mb-1 flex items-center gap-2'>
                  <h3 className='text-sm font-bold text-slate-600'>My Profit:</h3>
                  <p className='font-semibold'>{`Rs.${Pdata?.my_profit}`}</p>

                </div>
              }

              <div className='mb-1 flex items-center gap-2 justify-self-end'>
                <h3 className='text-sm font-bold text-slate-600'>Tech&apos;s  Profit:</h3>
                <p className='font-semibold'>{`Rs.${Pdata?.technician_profit}`}</p>

              </div>

              {
                userData?.userinfo?.role === 'Admin' &&
                <div className='mb-1 flex items-center gap-2'>
                  <h3 className='text-sm font-bold text-slate-600'>Admin Only  Profit:</h3>
                  {/* <p className='font-semibold 2xl:font-bold text-lg 2xl:text-2xl'>{`Rs.${Pdata?.admin_only_profit}`}
            </p> */}
                  <p className='font-semibold'>{`Rs.${Pdata?.admin_only_profit}`}
                  </p>
                </div>
              }
            </div>
          </div>

          {searched === false ? <div className=' bg-gradient-to-br from-sky-200 to-slate-200  drop-shadow-xl px-6 ml-5 py-3 rounded-xl my-2 w-[450px]' onClick={() => setChosenData(filteredData.data)}>

            <p className='text-center  text-xl font-semibold text-sky-600'>
              Todays Profit
            </p>
            <div className='grid grid-cols-2 '>

              <div className='my-1 flex items-center gap-2'>
                <h3 className='text-sm font-bold text-slate-600'>Total Number:</h3>
                <p className='font-semibold'>
                  {`${(filteredData?.data?.length) - (adminOnlyData?.length)}`}

                </p>

              </div>
              {
                userData?.userinfo?.role === 'Admin' &&
              <div className='my-1 flex items-center gap-2 justify-self-end'>

                <h3 className='text-sm font-bold text-slate-600'>My Profit:</h3>
                <p className='font-semibold'>
                  {`Rs.${userData?.userinfo?.role === 'Admin' ? filteredData.my_profit : userData?.userinfo?.role === 'Technician' ? filteredData?.technician_profit : 'Role not recognized'}`}</p>

              </div>
}
              <div className='my-1 flex items-center gap-2'>
                <h3 className='text-sm font-bold text-slate-600'>Technician&apos;s Profit:</h3>
                <p className='font-semibold'>
                  {`Rs.${userData?.userinfo?.role === 'Admin' ? filteredData.technician_profit : userData?.userinfo?.role === 'Technician' ? filteredData.technician_profit : 'Role not recognized'}`}</p>

              </div>
            </div>
          </div> : <div></div>}

          {
            userData?.userinfo?.role === 'Admin' && searched === false &&

            <div className=' bg-gradient-to-br from-sky-200 to-slate-200   drop-shadow-xl px-6 py-3 rounded-xl my-2 ml-5 w-[450px]'>

              <p className='text-center  text-xl font-semibold text-sky-600'>
                Personal Profit
              </p>
              <div className='grid grid-cols-2'>

                <div className='my-1 flex items-center gap-2'>
                  <h3 className='text-sm font-bold text-slate-600'>Total Number:</h3>
                  <p className='font-semibold'>
                    {`${adminOnlyData?.length}`}
                  </p>
                </div>
                <div className='my-1 flex items-center justify-self-end gap-2'>
                  <h3 className='text-sm font-bold text-slate-600'>Personal  Profit:</h3>
                  <p className='font-semibold'>{`Rs.${filteredData.admin_only_profit}`}
                  </p>

                </div>
              </div>

            </div>
          }
        </div>
        <div className='flex justify-between items-center  px-7'>

          <h3 className='text-center my-5 font-bold'>My Profit Transactions</h3>
          <div className='flex gap-2'>

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
            <button onClick={onDateSearch} className='bg-sky-400 px-5 py-1 rounded-lg hover:bg-sky-500'>Filter</button>

          </div>
        </div>
        <div className="overflow-y-scroll h-[70vh]  ">

          <Table className="container bg-white min-h-[20vh] overflow-y-scroll h-[61vh] mx-auto rounded-2xl w-11/12 py-10 ">
            
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/5">Repair Info</TableHead>
                <TableHead className="w-1/5">Total Profit</TableHead>
                {userData?.userinfo?.role === 'Admin' && <TableHead className="w-1/5">My Profit</TableHead>}
                <TableHead className="w-1/5">Tech&apos;s Profit</TableHead>
                {userData?.userinfo?.role === 'Admin' && <TableHead className="w-1/5">Admin Only Profit</TableHead>}
                <TableHead className="w-1/5">Technician</TableHead>
              </TableRow>

            </TableHeader>
            <TableBody className="">
              {chosenData && chosenData.length > 0 ? (
                chosenData.map((data, i) => (
                  <TableRow key={i} onClick={() => handleClick(data.repair_id)} className="hover:bg-gray-100">
                    <TableCell className="font-medium">{`${data.phone_model} by ${data.customer_name}`}</TableCell>
                    <TableCell>{data.repair_profit}</TableCell>
                    {userData?.userinfo?.role === 'Admin' && <TableCell>{data.my_profit ? data.my_profit : 0}</TableCell>}
                    <TableCell className="">{data.technician_profit}</TableCell>
                    {userData?.userinfo?.role === 'Admin' && <TableCell>{data.admin_only_profit}</TableCell>}
                    <TableCell className="">{data.repaired_by_name}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={userData?.userinfo?.role === 'Admin' ? 4 : 3} className="text-center py-4">
                    No transactions found
                  </TableCell>
                </TableRow>
              )}

            </TableBody>
          </Table>
        </div>

      </div>

    </>
  )
}

export default Profit