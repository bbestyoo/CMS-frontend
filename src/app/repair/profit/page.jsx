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
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/lib/hooks';
import { getCookie } from 'cookies-next';
const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;


function TablePage() {

    const userData = useAppSelector((state)=>state.user.value)
    console.log("userData i profit",userData)
    const [Pdata, setPData ] = useState([])
    const [data, setData ] = useState([])
    const [filteredData, setFilteredData ] = useState([])
    const [adminOnlyData, setAdminOnlyData ] = useState([])



    const router = useRouter()



    const someFunction = async () => {
        try {
            // Call the productsApi function to fetch data
            const products = await productsProfitApi();
            console.log("((((first))))",products)
            
            // Do something with the fetched products data
            setPData(products);
            setData(products.data)
            const admindata = products.filter((data)=>data.repaired_by === 'Admin')
            setAdminOnlyData(admindata)
        } catch (error) {
            // Handle errors if any
            console.error('Error fetching products:', error);
        }
    };
    const someProfitFunction = async () => {
        try {
            // Call the productsApi function to fetch data
            console.log("asdasd")
            const today = new Date();
            const yyyy = today.getFullYear();
            const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
            const dd = String(today.getDate()).padStart(2, '0');

const formatDate = `${yyyy}-${mm}-${dd}`;
console.log("formdat",formatDate)
const query = `start_date=${formatDate}&end_date=${formatDate}`

console.log("hereeeeeeeeeeeeeeee")
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
            console.log("asfasd",result)
            setFilteredData(result)
            return result

        }
            
         catch (error) {
            // Handle errors if any
            console.error('Error fetching products:', error);
        }
    };
    
    useEffect(() => { 
    someFunction();
    someProfitFunction()
    }, [])



    function handleClick(repair_id){
        router.push(`/search/${repair_id}`)
 }



  return (
    <>
    <div className='h-full overflow-y-scroll bg-main rounded-xl mx-1'>
        <div className='flex gap-2 w-fit '>

        <div className='bg-white drop-shadow-xl px-5 py-3 rounded-xl ml-5 my-5 w-fit'>
            <h1 className='text-left  text-2xl font-medium'>This Month&apos;s Summary</h1>
            <div className='grid grid-flow-col auto-cols-auto gap-6'>
                <div className='my-3 '>
                    <h3 className='text-sm'>Total <br /> Transactions</h3>
                    <p className='font-semibold 2xl:font-bold text-lg  2xl:text-2xl'>{`${Pdata?.data?.length}`}</p>

                </div>
                {
                    userData?.userinfo?.role === 'Admin' &&
                <div className='my-3 '>
                    <h3 className='text-sm'>Total <br /> Profit</h3>
                    <p className='font-semibold 2xl:font-bold text-lg 2xl:text-2xl'>{`NRS.${Pdata?.total_profit}`}</p>

                </div>
                }
                {
                    userData?.userinfo?.role === 'Admin' &&
                <div className='my-3 '>
                    <h3 className='text-sm'>My <br /> Profit</h3>
                    <p className='font-semibold 2xl:font-bold text-lg 2xl:text-2xl'>{`NRS.${Pdata?.my_profit}`}</p>

                </div>
                }
               
                 <div className='my-3 '>
                    <h3 className='text-sm'>Technician&apos;s <br /> Profit</h3>
                    <p className='font-semibold 2xl:font-bold text-lg 2xl:text-2xl'>{`NRS.${Pdata?.technician_profit}`}</p>

                </div>
            </div>
        </div>
        <div className='bg-white drop-shadow-xl p-3 rounded-xl my-5 w-fit'>

            <p className='text-left  text-2xl font-medium'>
            Todays Profit
            </p>
            <div className='flex gap-6'>

            <div className='my-3'>
                <p>Transactions</p>
            <p className='font-semibold 2xl:font-bold text-lg 2xl:text-2xl'>
            {`${filteredData?.data?.length}`}
            </p>

            </div>
            <div className='my-3'>
                <p>Profit</p>
            <p className='font-semibold 2xl:font-bold text-lg 2xl:text-2xl'>
            {`NRS.${userData?.userinfo?.role === 'Admin' ? filteredData.total_profit : userData?.userinfo?.role === 'Technician' ? filteredData?.technician_profit : 'Role not recognized'}`}</p>

            </div>
            </div>

        </div>
        {
            userData?.userinfo?.role === 'Admin' &&

        <div className='bg-white drop-shadow-xl p-3 rounded-xl my-5 w-fit'>

            <p className='text-left  text-2xl font-medium'>
            Personal Profit
            </p>    
            <div className='flex gap-6'>    

            <div className='my-3'>
                <p>Transactions</p>
            <p className='font-semibold 2xl:font-bold text-lg 2xl:text-2xl'>
            {`${adminOnlyData?.length}`}
            </p>

            </div>
            <div className='my-3'>
                <p>Profit</p>
            <p className='font-semibold 2xl:font-bold text-lg 2xl:text-2xl'>{`NRS.${Pdata.admin_only_profit}`}
            </p>

            </div>
            </div>

        </div>
        }
        </div>
        <h3 className='text-center my-5'>My transactions Profits</h3>


    <Table  className="container bg-white  mx-auto  rounded-2xl drop-shadow-xl w-11/12 py-10" > 
  <TableCaption>A list of your recent transactions</TableCaption>
  <TableHeader>
    <TableRow >
      <TableHead className="w-fit">Repair Info</TableHead>
      <TableHead>Total Profit</TableHead>
      {
        userData?.userinfo?.role === 'Admin' &&
      
        
          <TableHead>My Profit</TableHead>
      }
      
      <TableHead className="text-right">Technician Profit</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {
        data && data.length > 0 ? (
        data.map((data, i)=>(
            <TableRow key={i} onClick = {()=>handleClick(data.repair_id)} className="" >
      <TableCell className="font-medium">{`${data.phone_model} by ${data.phone_model}`}</TableCell>
      <TableCell>{data.repair_profit}</TableCell>
      {
        userData?.userinfo?.role === 'Admin' &&
      <TableCell>{data.repair_profit - data.technician_profit}</TableCell>
      }
      <TableCell className="text-right">{data.technician_profit}</TableCell>
    </TableRow>
        ))) : null

        

        
    }

  </TableBody>
</Table>
</div>


    </>
  )
}

export default TablePage