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
            console.log("here", products)
            setData(products);
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
    <div className='h-[390px] overflow-y-scroll  drop-shadow-2xl bg-white text-black rounded-xl'>
        <h3 className='text-center my-5'>Recent Orders</h3>

    <Table>
  <TableCaption>A list of your recent transactions</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead className="w-fit">Customer Info</TableHead>
      <TableHead>Problem</TableHead>
      <TableHead>Status</TableHead>
      <TableHead className="text-right">Amount</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {
        data && data.length > 0 ? (
        data?.map((data, i)=>(
            <TableRow onClick = {()=>handleClick(data.repair_id)} className="" key={i}>
      <TableCell className="font-medium">{`${data.phone_model} by ${data.customer_name}`}</TableCell>
      <TableCell>{data.repair_problem}</TableCell>
      <TableCell>{data.repair_status}</TableCell>
      <TableCell className="text-right">{data.total_amount}</TableCell>
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