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

const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;



async function transactionsApi() {
    const token = getCookie('accesstoken')
    const res = await fetch(`${baseURL}transactions/`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
        credentials: 'include'
    })
    const result = await res.json()
    console.log("api result:", result)
    return result
}



function TransactionPage() {
    const currentDate = new Date();
    const startOfCurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const startOfNextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);

    const [date, setDate] = useState({
        from: startOfCurrentMonth,
        to: startOfNextMonth,
    });


    const userData = useAppSelector((state) => state.user.value)
    console.log("userData in profit:", userData)
    const [data, setData] = useState([])

    const router = useRouter()


    function formatDate(date) {
        if (!date) return '';
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${year}-${month}-${day}`;
    }

    const formattedDate = {
        from: formatDate(date?.from),
        to: formatDate(date?.to)
    };

    function onDateSearch(e) {
        e.preventDefault();
        const combinedDateQuery = `start_date=${formattedDate.from}&end_date=${formattedDate.to}`;
        router.push(`/transactions/search?${combinedDateQuery}`);
    }

    const fetchTransactions = async () => {
        try {
            const transactions = await transactionsApi();
            console.log("Fetched transactions:", transactions)
            setData(transactions)
        } catch (error) {
            console.error('Error fetching transactions:', error);
        }
    };


    useEffect(() => {
        fetchTransactions();
    }, [])  // Empty dependency array to ensure this runs only once on mount
    return (
        <div className='bg-white max-h-[520px] w-[905px] mx-auto my-5 p-4 shadow-lg rounded-lg'>

            <div className=' w-full flex mb-10 justify-between'>
                <section className='w-fit text-md flex items-center gap-1' onClick={() => router.push('/transactions/post')}>

                    <p className=' '>
                        Add Transactions
                    </p>
                    <IoAddCircleSharp className='text-indigo-500 hover:text-indigo-700' size={30} />

                </section>
                <div className='flex gap-3 items-center '>
                    <div className={cn("grid gap-2 border border-black rounded-md ")}>
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
                    </div>
                    <button onClick={onDateSearch} className='bg-gray-300 px-3 py-1 rounded-2xl hover:bg-gray-500'>Filter</button>
                </div>
            </div>

            <div className='flex overflow-y-scroll'>

                {data && data.length > 0 ? (
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
                            {data.map((transaction) => (
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
                    <p>Loading transactions...</p>
                )}
            </div>
        </div>
    )
}

export default TransactionPage
