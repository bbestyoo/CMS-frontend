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
            const techs = await userInfo();
            console.log("((((techs are here))))", techs)

            // Do something with the fetched products data
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

    function handleClick(id) {
        console.log("first");
        console.log(id);
        const filteredData = data.filter(item => item.transaction_to === id);
        console.log(filteredData);
        setChosenData(filteredData);  // Using a separate state for the filtered data
    }



    useEffect(() => {
        someTechFunction();
        fetchTransactions();
    }, [])



    return (
        <>
        <div className='flex flex-wrap justify-center mx-36'>
            {tdata.filter(tech => tech.role === "Technician").map((tech) => (
                 <div className='bg-white drop-shadow-xl px-6 py-3 rounded-xl mx-12 my-5 w-fit' key={tech.user_id} onClick={() => handleClick(tech.user_id)}>
   
                     <h3 className='capitalize text-xl text-center font-bold mt-3'>{tech.name}</h3>
                     <h3 className='capitalize text-md font-serif italic text-gray-500 text-center font-bold mb-3'>{tech.role}</h3>
                     <p className='text-center  text-sm font-bold text-center '>
                    Due Amount:{tech.due}
                 </p>
                 {/* <p className='text-center  text-sm font-bold text-center '>
                    {tech.due}
                 </p>   */}
     
             </div>
             
            ))}
            
        </div>

            <div className='bg-white max-h-[520px] w-[905px] mx-auto my-5 p-4 shadow-lg rounded-lg'>
                <div className='flex h-[330px] '>

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
                        <p>No transactions...</p>
                    )}
                </div>
            </div>
        </>
    )
}

export default WalletPage