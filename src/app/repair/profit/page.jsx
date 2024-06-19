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


function TablePage() {

    const userData = useAppSelector((state)=>state.user.value)
  console.log("userdata", userData)
    const [Pdata, setPData ] = useState([])
    const [data, setData ] = useState([])
    const [filteredData, setFilteredData ] = useState([])




    const router = useRouter()

    console.log("dataaaaaaaaaa",data)


    const someFunction = async () => {
        try {
            // Call the productsApi function to fetch data
            console.log("asdasd")
            const products = await productsProfitApi();
            
            // Do something with the fetched products data
            console.log("here", products)
            const todayDate = new Date().toISOString().split('T')[0];

        // Filter products that are done today or have today's date
        const filteredProducts = products.data.filter(product => {
            // Assuming product has a date property in YYYY-MM-DD format
            return product.delivery_date === todayDate;
        });
            setData(products.data);
            setFilteredData(filteredProducts);
            console.log("**********************",filteredProducts)

            setPData(products);
        } catch (error) {
            // Handle errors if any
            console.error('Error fetching products:', error);
        }
    };
    
    useEffect(() => { 
    someFunction();
    }, [])

    function handleClick(repair_id){
        router.push(`/search/${repair_id}`)
 }


 const totalProfit = filteredData.reduce((sum, item) => sum + item.my_profit, 0);
 console.log("total",totalProfit)



  return (
    <>
    <div className='h-full overflow-y-scroll bg-main rounded-xl mx-1'>
        <div className='flex gap-3 w-fit '>

        <div className='bg-white drop-shadow-xl px-5 py-3 rounded-xl mx-5 my-5 w-fit'>
            <h1 className='text-left  text-2xl font-medium'>Profits Summary</h1>
            <div className='grid grid-flow-col auto-cols-auto gap-20'>
                <div className='my-3 '>
                    <h3>Total Transactions</h3>
                    <p className='font-bold text-2xl'>{`${Pdata?.data?.length}`}</p>

                </div>
                <div className='my-3 '>
                    <h3>Total Profit</h3>
                    <p className='font-bold text-2xl'>{`NRS.${Pdata?.total_profit}`}</p>

                </div>
                {/* {
                    userData?.userinfo?.role === admin && (
                        <div className='my-3 '>
                    <h3>My Profit</h3>
                    <p className='font-bold text-2xl'>{`NRS.${data?.my_profit}`}</p>

                </div>

                    )
                }
                 */}
                 <div className='my-3 '>
                    <h3>Technician&apos;s Profit</h3>
                    <p className='font-bold text-2xl'>{`NRS.${Pdata?.technician_profit}`}</p>

                </div>
            </div>
        </div>
        <div className='bg-white drop-shadow-xl p-3 rounded-xl my-5 w-fit'>

            <p className='text-left  text-2xl font-medium'>
            Todays Profit
            </p>
            <div className='flex gap-10'>

            <div className='my-3'>
                <p>Transactions</p>
            <p className='font-bold text-2xl'>
            {`${filteredData?.length}`}
            </p>

            </div>
            <div className='my-3'>
                <p>Profit</p>
            <p className='font-bold text-2xl'>
            {`NRS.${totalProfit}`}</p>

            </div>
            </div>

        </div>
        </div>
        <h3 className='text-center my-5'>My transactions Profits</h3>


    <Table  className="container bg-white  mx-auto  rounded-2xl drop-shadow-xl w-11/12 py-10" > 
  <TableCaption>A list of your recent transactions</TableCaption>
  <TableHeader>
    <TableRow >
      <TableHead className="w-fit">Repair Info</TableHead>
      <TableHead>Total Profit</TableHead>
      <TableHead>My Profit</TableHead>
      <TableHead className="text-right">Amount</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {
        data && data.length > 0 ? (
        data.map((data, i)=>(
            <TableRow key={i} onClick = {()=>handleClick(data.repair_id)} className="" >
      <TableCell className="font-medium">{`${data.phone_model} by ${data.phone_model}`}</TableCell>
      <TableCell>{data.repair_profit}</TableCell>
      <TableCell>{data.my_profit}</TableCell>
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