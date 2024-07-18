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
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
  
import { productsProfitApi, userInfo } from '@/api/GetRepairProducts';
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

  const [roles, setRoles] = useState([])
  const [selectedRole, setSelectedRole] = useState(null);

  const handleChange = (value) => {
    setSelectedRole(value);
    console.log('Selected role ID:', value); // Log or use the selected value as needed
  };
  
  const getTechInfo =  async () => {
    const response = await userInfo()
    setRoles(response)
  }

  useEffect(()=>{
    getTechInfo()
  },[])


    const currentDate = new Date();
    const startOfCurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const startOfNextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);

    const [date, setDate] = React.useState({
        from: null,
        to: null,
      });
    const userData = useAppSelector((state)=>state.user.value)
    console.log("userData i profit",userData)
    const [Pdata, setPData ] = useState([])
    const [data, setData ] = useState([])
    const [role, setRole ] = useState("")
    const [id, setId ] = useState("")
   
    const [filteredData, setFilteredData ] = useState([])
    const [adminOnlyData, setAdminOnlyData ] = useState([])
    const [chosenData, setChosenData] = useState([])
    const searchParams = useSearchParams();
    console.log("params",searchParams)



    const router = useRouter()

    const someProfitFunction = async () => {
        try {
            // Call the productsApi function to fetch data
            const today = new Date();
            const yyyy = today.getFullYear();
            const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
            const dd = String(today.getDate()).padStart(2, '0');

const formatDate = `${yyyy}-${mm}-${dd}`;
let query
if(!searchParams){
    console.log("initial")
     query = `start_date=${formatDate}&end_date=${formatDate}`
}
else {
    console.log("query")
    if (searchParams.has('start_date')) {
        query = `start_date=${searchParams.get('start_date')}&end_date=${searchParams.get('end_date')}`;
      } 
    else if (searchParams.has('tech')) {
        query = `tech=${searchParams.get('tech')}`;
      } 
      
      else if (searchParams.has('start_date') && searchParams.has('tech')) {
        query = `start_date=${searchParams.get('start_date')}&end_date=${searchParams.get('end_date')}&tech=${searchParams.get('tech')}`;
      }
}
console.log("hereeeeeeeeeeeeeeee",query)
            const token = getCookie('accesstoken')
            const res = await fetch (
                `${baseURL}enterprise/profit?${query}`,
                {
                headers: {
                    'Authorization': `Bearer ${token}`, // Assuming it's a bearer token
                },
                credentials: 'include' // Use 'include' to send cookies with the request
            }
            )
            const result = await res.json()
            console.log("afterapifetch******8",result)
            setFilteredData(result)
            const admindata = result.data.filter((data)=>data.admin_only_profit !== null)
            console.log("askjdnksa dksa dsk sakds ak j",admindata)
            setAdminOnlyData(admindata)
            setPData(result);
            setData(result.data)
            setChosenData(result)
            return result
        }
         catch (error) {
            // Handle errors if any
            console.error('Error fetching products:', error);
        }
    };
    
  

    useEffect(() => { 
    someProfitFunction()
    }, [userData, searchParams])



    function handleClick(repair_id){
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

  function  onDateSearch(e){
    e.preventDefault();
    const combinedDateQuery = `start_date=${formattedDate.from}&end_date=${formattedDate.to}`;
    if(!selectedRole && formattedDate.from){

      router.push(`/repair/profit?${combinedDateQuery}`); 
    }
    else if (!formattedDate.from && selectedRole){
      router.push(`/repair/profit?tech=${selectedRole}`); 


    }
    else if(formattedDate.from && selectedRole){
      router.push(`/repair/profit?${combinedDateQuery}&tech=${selectedRole}`); 

      
    }
    else {}
  }

  return (
    <>
    <div className=' bg-main rounded-xl mx-1'>
        <div className='flex gap-4 w-fit '>

        <div className='bg-white drop-shadow-xl px-5 py-3 rounded-xl ml-5 my-5 w-fit ' onClick={()=>setChosenData(Pdata)}>
            <h1 className='text-left  text-2xl font-bold text-center text-gray-500'>This Month&apos;s Summary</h1>
            
            <div className='grid grid-flow-col auto-cols-auto gap-6'>
                <div className='my-5'>
                    <h3 className='text-sm font-bold'>Total <br /> No.</h3>
                    <p className='font-bold'>{`${Pdata?.data?.length}`}</p>

                </div>
                {
                    userData?.userinfo?.role === 'Admin' &&
                <div className='my-5'>
                    <h3 className='text-sm font-bold'>Total <br /> Profit</h3>
                    <p className='font-bold'>{`RS.${Pdata?.total_profit}`}</p>

                </div>
                }
                {
                    userData?.userinfo?.role === 'Admin' &&
                <div className='my-5'>
                    <h3 className='text-sm font-bold'>My <br /> Profit</h3>
                    <p className='font-bold'>{`RS.${Pdata?.my_profit}`}</p>

                </div>
                }
               
                 <div className='my-5'>
                    <h3 className='text-sm font-bold'>Tech&apos;s <br /> Profit</h3>
                    <p className='font-bold'>{`RS.${Pdata?.technician_profit}`}</p>

                </div>
                
                <div className='my-5'>
                <h3 className='text-sm font-bold'>Admin Only <br /> Profit</h3>
            {/* <p className='font-semibold 2xl:font-bold text-lg 2xl:text-2xl'>{`RS.${Pdata?.admin_only_profit}`}
            </p> */}
             <p className='font-bold'>{`RS.${Pdata?.admin_only_profit}`}
            </p>
            </div>
            </div>
        </div>


        <div className='bg-white drop-shadow-xl px-6 py-3 rounded-xl my-5 w-fit' onClick={()=>setChosenData(filteredData)}>

            <p className='text-left  text-2xl font-bold text-center text-gray-500'>
            Todays Profit
            </p>
            <div className='flex gap-6'>

            <div className='my-5'>
                <h3 className='text-sm font-bold'>Total<br/>No.</h3>
            <p className='font-bold'>
            {`${(filteredData?.data?.length) - (adminOnlyData?.length)}`}

            </p>

            </div>
            {/* <div className='my-5'>
            <h3 className='text-sm font-bold'>Total<br/>Profit</h3>
            <p className='font-bold'>
            {`RS.${userData?.userinfo?.role === 'Admin' ?(filteredData.my_profit + filteredData.technician_profit) : userData?.userinfo?.role === 'Technician' ? filteredData?.technician_profit : 'Role not recognized'}`}</p>

            </div> */}
            <div className='my-5'>
            <h3 className='text-sm font-bold'>My<br/>Profit</h3>
            <p className='font-bold'>
            {`RS.${userData?.userinfo?.role === 'Admin' ?filteredData.my_profit : userData?.userinfo?.role === 'Technician' ? filteredData?.technician_profit : 'Role not recognized'}`}</p>

            </div>
            <div className='my-5'>
            <h3 className='text-sm font-bold'>Tech&apos;s<br/>Profit</h3>
            <p className='font-bold'>
            {`RS.${userData?.userinfo?.role === 'Admin' ?filteredData.technician_profit : userData?.userinfo?.role === 'Technician' ? filteredData?.technician_profit : 'Role not recognized'}`}</p>

            </div>
            </div>
        </div>
        {
            userData?.userinfo?.role === 'Admin' &&

        <div className='bg-white drop-shadow-xl px-6 py-3 rounded-xl my-5 w-fit'>

            <p className='text-left  text-2xl font-bold text-center text-gray-500'>
            Personal Profit
            </p>    
            <div className='flex gap-6 justify-between'>    

            <div className='my-5'>
                <h3 className='text-sm font-bold'>Total<br/>No.</h3>
            <p className='font-bold'>
            {`${adminOnlyData?.length}`}
            </p>
            </div>
            <div className='my-5'>
            <h3 className='text-sm font-bold'>Personal <br/> Profit</h3>
            <p className='font-bold'>{`RS.${filteredData.admin_only_profit}`}
            </p>

            </div>
            </div>

        </div>
        }
        </div>
        <div className='flex justify-between items-center '>

        <h3 className='text-center my-5 font-bold ml-7'>My transactions Profits</h3>
        <div className='flex gap-3'>
        <div>
        <Select onValueChange={handleChange}>
  <SelectTrigger className="w-[180px] rounded-3xl focus:border-none">
    <SelectValue placeholder="Technicians" />
  </SelectTrigger>
  <SelectContent>
  {roles.map((role, i) => (
                <SelectItem key={i} value={`${role.user_id}`}> {role.name}</SelectItem>
            ))}
  </SelectContent>
</Select>

        </div>
        <div>

        <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className={cn("w-[300px] justify-start text-left rounded-3xl font-normal ", !date && "text-muted-foreground")}
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
            <button onClick={onDateSearch} className='bg-gray-300 px-3 py-1 rounded-2xl hover:bg-gray-500'>Filter</button>

            </div>
        </div>
        </div>

<div className="overflow-y-scroll max-h-[50vh]">

    <Table className="container bg-white mx-auto rounded-2xl drop-shadow-xl w-11/12 py-10 ">
  <TableCaption className="text-gray-500 text-sm mt-2">A list of your recent transactions</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead className="w-1/5">Repair Info</TableHead>
      <TableHead className="w-1/5">Total Profit</TableHead>
      {userData?.userinfo?.role === 'Admin' && <TableHead className="w-1/5">My Profit</TableHead>}
      <TableHead className="w-1/5">Tech&apos;s Profit</TableHead>
      <TableHead className="w-1/5">Admin Only Profit</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {data && data.length > 0 ? (
       chosenData.data.map((data, i) => (
            <TableRow key={i} onClick={() => handleClick(data.repair_id)} className="hover:bg-gray-100">
          <TableCell className="font-medium">{`${data.phone_model} by ${data.customer_name}`}</TableCell>
          <TableCell>{data.repair_profit}</TableCell>
          {userData?.userinfo?.role === 'Admin' && <TableCell>{data.my_profit?data.my_profit:0}</TableCell>}
          <TableCell className="">{data.technician_profit}</TableCell>
          {userData?.userinfo?.role === 'Admin' && <TableCell>{data.admin_only_profit}</TableCell>}
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