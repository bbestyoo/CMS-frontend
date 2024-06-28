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
    const [role, setRole ] = useState("")
    const [id, setId ] = useState("")
    // useEffect(() => {
    //     if (userData !== null) {
    //         setRole(userData?.userinfo?.role);
    //         setId(userData?.userinfo?.id);
    //     }
    // }, [userData]); 
    const [filteredData, setFilteredData ] = useState([])
    const [adminOnlyData, setAdminOnlyData ] = useState([])
    const [chosenData, setChosenData] = useState([])



    const router = useRouter()

    const someFunction = async () => {
        try {
            // Call the productsApi function to fetch data
            const products = await productsProfitApi();
            console.log("((((first))))",products)
            
            // Do something with the fetched products data
            setPData(products);
            setData(products.data)
            setChosenData(products)
        } catch (error) {
            // Handle errors if any
            console.error('Error fetching products:', error);
        }
    };

    const someProfitFunction = async () => {
        try {
            // Call the productsApi function to fetch data
            const today = new Date();
            const yyyy = today.getFullYear();
            const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
            const dd = String(today.getDate()).padStart(2, '0');

const formatDate = `${yyyy}-${mm}-${dd}`;
const query = `start_date=${formatDate}&end_date=${formatDate}`

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
            setFilteredData(result)
            const admindata = result.data.filter((data)=>data.admin_only_profit !== null)
            console.log("askjdnksa dksa dsk sakds ak j",admindata)
            setAdminOnlyData(admindata)
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
    }, [userData])



    function handleClick(repair_id){
        router.push(`/repair/productDetails/${repair_id}`)
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
                    <h3 className='text-sm font-bold'>Tech's <br /> Profit</h3>
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
            <h3 className='text-sm font-bold'>Tech's<br/>Profit</h3>
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
            <div className='flex gap-6'>    

            <div className='my-5'>
                <h3 className='text-sm font-bold'>Transactions</h3>
            <p className='font-bold'>
            {`${adminOnlyData?.length}`}
            </p>

            </div>
            <div className='my-5'>
            <h3 className='text-sm font-bold'>Transactions</h3>
            <p className='font-bold'>{`RS.${filteredData.admin_only_profit}`}
            </p>

            </div>
            </div>

        </div>
        }
        </div>
        <h3 className='text-center my-5 font-bold'>My transactions Profits</h3>
<div className="overflow-y-scroll max-h-[50vh]">

    <Table className="container bg-white mx-auto rounded-2xl drop-shadow-xl w-11/12 py-10 ">
  <TableCaption className="text-gray-500 text-sm mt-2">A list of your recent transactions</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead className="w-1/5">Repair Info</TableHead>
      <TableHead className="w-1/5">Total Profit</TableHead>
      {userData?.userinfo?.role === 'Admin' && <TableHead className="w-1/5">My Profit</TableHead>}
      <TableHead className="w-1/5">Tech's Profit</TableHead>
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

export default TablePage