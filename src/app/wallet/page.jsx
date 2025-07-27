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
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/lib/hooks';
import { getCookie } from 'cookies-next';
import { IoAddCircleSharp } from "react-icons/io5";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { userInfo, transactionsApi } from '@/api/GetRepairProducts';

const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;


function WalletPage() {

    const userData = useAppSelector((state) => state.user.value)
    console.log("userData i profit", userData)
    const [tdata, setTData] = useState([])
    const [data, setData] = useState([])
    const [chosenData, setChosenData] = useState([])



    const router = useRouter()

    const someTechFunction = async () => {
        try {
            // Call the productsApi function to fetch data
            const data = await userInfo();
            const techs = data.filter((tech)=> tech.role === 'Technician')
            setTData(techs);
        } catch (error) {
            // Handle errors if any
            console.error('Error fetching products:', error);
        }
    };

    const fetchTransactions = async () => {
        try {
            const transactions = await transactionsApi();
            console.log("Fetched transactions:", transactions)
            setData(transactions)
            setChosenData(transactions)
        } catch (error) {
            console.error('Error fetching transactions:', error);
        }
    };

   

    useEffect(() => {
        someTechFunction();
        fetchTransactions();
    }, [])



    return (
        <>
        <div className='flex flex-col '>
            {tdata?.filter(tech => tech.role === "Technician").map((tech) => (
                 <div className='bg-white px-6 py-3 rounded-xl flex justify-between  my-4 w-[95%] mx-auto' key={tech.user_id} >
                    <div className='flex items-center gap-10'>
   <div className=' flex items-center'>

                     <h3 className='capitalize text-md  text-sky-500 text-center  '>{tech.role}:&nbsp;</h3>
                     <h3 className='capitalize text-lg text-center text-sky-900 font-semibold '>{tech.name}</h3>
   </div>
   <div className='flex items-center'>

                     <p className='  text-md text-sky-500 text-center '>
                    Due Amount:&nbsp;
                 </p>
                 <p className='capitalize text-lg text-center font-semibold text-sky-900'>{tech.due}</p>
   </div>
   </div>
   <div>
     <select
                        id='transactionFrom'
                        className='shadow bg-sky-200 border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm'
                        value={""}
                        onChange={(e) => setTransactionFrom(e.target.value)}
                        required
                    >
                        <option className='text-sm'  value=''>Select Technicians</option>
                        {/* {adminOptions.map((admin) => (
                            <option key={admin.user_id} value={admin.user_id}>
                                {admin.name}
                            </option>
                        ))} */}
                    </select>
   </div>
             </div>
            ))}
        </div>
            <div className='bg-white h-[74vh] w-[95%] mx-auto  p-4  rounded-lg overflow-y-scroll'>
                <div className='flex '>
                    {chosenData && chosenData.length > 0 ? (
                        <Table className='w-full text-left'>
                            <TableCaption>Transaction Data</TableCaption>
                            <TableHeader>
                                <TableRow>
                                    {/* <TableHead className='px-4 py-2'>Transaction ID</TableHead> */}
                                    <TableHead className='px-4 py-2'>From</TableHead>
                                    <TableHead className='px-4 py-2'>To</TableHead>
                                    <TableHead className='px-4 py-2'>Amount</TableHead>
                                    <TableHead className='px-4 py-2'>Description</TableHead>
                                    <TableHead className='px-4 py-2 text-center'>Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {chosenData.map((transaction) => (
                                    <TableRow key={transaction.id} className='border-t'>
                                        {/* <TableCell className='px-4 py-2'>{transaction.id}</TableCell> */}
                                        <TableCell className="px-4 py-2 capitalize">{transaction.transaction_from_name}</TableCell>
                                        <TableCell className="px-4 py-2 capitalize">{transaction.transaction_to_name}</TableCell>
                                        <TableCell className='px-4 py-2'>{transaction.amount}</TableCell>
                                        <TableCell className='px-4 py-2'>{transaction.desc}</TableCell>
                                        <TableCell className='px-4 py-2 text-center'>{transaction.date}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <p className='flex justify-center text-sky-600 items-center'>Fetching Data. Please Wait...</p>
                    )}
                </div>
            </div>
        </>
    )
}

export default WalletPage