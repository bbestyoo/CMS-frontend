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
import { productsApi } from '@/api/GetRepairProducts';
import { useRouter } from 'next/navigation';


function  TablePage() {

    const [data, setData ] = useState([])
    const router = useRouter()

    const someFunction = async () => {
        try {
            // Call the productsApi function to fetch data
            console.log("asdasd")
            const products = await productsApi();
            // Do something with the fetched products data
            setData(products.results);
            console.log("data",data)
        } catch (error) {
            // Handle errors if any
            console.error('Error fetching products:', error);
        }
    };
    
    useEffect(() => { 
    someFunction();
    }, [])

    function handleClick(repair_id){
        router.push(`/repair/productDetails/${repair_id}`)
 }
    



  return (
    <>
    <div className='h-[62vh] overflow-y-scroll   drop-shadow-2xl bg-white text-black rounded-xl'>
        <h3 className='text-center text-lg my-5'>Recent Orders</h3>

    <Table>
  <TableCaption>A list of your recent transactions</TableCaption>
  <TableHeader>
    <TableRow className="bg-gray-100 ">
      <TableHead className="w-fit font-semibold text-black">Customer Info</TableHead>
      <TableHead className="font-semibold text-black">Problem</TableHead>
      <TableHead className="font-semibold text-black">Status</TableHead>
      <TableHead className="text-right font-semibold text-black">Amount</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody className="bg-sky-100" >
    {
        data && data.length > 0 ? (
        data?.map((data, i)=>(
            <TableRow   onClick = {()=>handleClick(data.repair_id)} className="border-b-2 border-white" key={i}>
      <TableCell className="font-medium "><p className='p-2'>{`${data.phone_model} by ${data.customer_name}`}</p></TableCell>
      <TableCell>{data.repair_problem}</TableCell>
      <TableCell >
      <p
  className={`
    ${data.repair_status === 'Unrepairable' ? 'bg-red-400' : ''} 
    ${data.repair_status === 'Repaired' || data.repair_status === 'Completed' ? 'bg-green-400' : ''}
    ${data.repair_status !== 'Unrepairable' && data.repair_status !== 'Repaired' && data.repair_status !== 'completed' ? 'bg-gray-100' : ''}
    rounded-3xl w-4/5 py-1 text-center px-2 hover:scale-110 hover:cursor-pointer transition-all ease-in
  `}
>
  {data.repair_status}
</p>

        </TableCell>
      <TableCell className="text-right"><p className='pr-2'>{data.total_amount}</p></TableCell>
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