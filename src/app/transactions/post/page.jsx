"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCookie } from 'cookies-next';
import { postTransactionsApi, userInfo } from '@/api/GetRepairProducts';

const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;

function PostTransactionPage() {
    const [date, setDate] = useState(() => {
        const today = new Date();
        return today.toISOString().split('T')[0]; // Format the date as yyyy-mm-dd
    });
    const [amount, setAmount] = useState('');
    const [transactionFrom, setTransactionFrom] = useState('');
    const [transactionTo, setTransactionTo] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [roles, setRoles] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();

    useEffect(() => { 
        getTechInfo();
    }, []);

    const getTechInfo = async () => {
        try {
            const response = await userInfo();
            setRoles(response);
        } catch (error) {
            console.error('Error fetching user info:', error);
        }
    };

    const handleSubmit = async (e) => {
        setIsLoading(true)
        e.preventDefault();
        const data = {
            date,
            amount: parseFloat(amount),
            transaction_from: transactionFrom,
            transaction_to: transactionTo,
            desc: description  // Include description in the data object
        };
        try {
            const result = await postTransactionsApi(data);
            console.log(result.status);
            if (result.ok) {
                setSuccess('Transaction posted successfully!');
                setError('');
                // Clear form fields
                setDate(() => {
                    const today = new Date();
                    return today.toISOString().split('T')[0]; // Reset date to today after successful submission
                });
                setAmount('');
                setTransactionFrom('');
                setTransactionTo('');
                setDescription('');
                setIsLoading(false)
                // Optionally redirect or perform other actions
                router.push('/transactions');
            } else {
                setError('Failed to post transaction. Please try again.');
                setSuccess('');
            }
        } catch (err) {
            console.error('Error posting transaction:', err);
            setError('An error occurred. Please try again.');
            setSuccess('');
        }
    };

    const adminOptions = roles.filter(role => role.role === 'Admin');
    const technicianOptions = roles.filter(role => role.role === 'Technician');

    return (
        <div className='  flex flex-col items-center text-white '>
            <h1 className='text-xl text-sky-200 mb-6'>Post a New Transaction</h1>
            <form className='w-full max-w-md mb-2' onSubmit={handleSubmit}>
                <div className='mb-4'>
                    <label className='block text-white text-sm font-bold mb-2' htmlFor='date'>
                        Date
                    </label>
                    <input
                        type='date'
                        id='date'
                        className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                    />
                </div>
                <div className='mb-4'>
                    <label className='block text-white text-sm font-bold mb-2' htmlFor='amount'>
                        Amount
                    </label>
                    <input
                        type='number'
                        id='amount'
                        className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                    />
                </div>
                <div className='mb-4'>
                    <label className='block text-white text-sm font-bold mb-2' htmlFor='description'>
                        Description
                    </label>
                    <input
                        type='text'
                        id='description'
                        className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                        required
                    />
                </div>
                <div className='mb-4'>
                    <label className='block text-white text-sm font-bold mb-2' htmlFor='transactionFrom'>
                        Transaction From
                    </label>
                    <select
                        id='transactionFrom'
                        className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                        value={transactionFrom}
                        onChange={(e) => setTransactionFrom(e.target.value)}
                        required
                    >
                        <option  value=''>Select Admin</option>
                        {adminOptions.map((admin) => (
                            <option key={admin.user_id} value={admin.user_id}>
                                {admin.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className='mb-4'>
                    <label className='block text-white text-sm font-bold mb-2' htmlFor='transactionTo'>
                        Transaction To
                    </label>
                    <select
                        id='transactionTo'
                        className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                        value={transactionTo}
                        onChange={(e) => setTransactionTo(e.target.value)}
                        required
                    >
                        <option value=''>Select Technician</option>
                        {technicianOptions.map((technician) => (
                            <option key={technician.user_id} value={technician.user_id}>
                                {technician.name}
                            </option>
                        ))}
                    </select>
                </div>
                {error && <p className='text-red-500 text-xs italic'>{error}</p>}
                {success && <p className='text-green-500 text-xs italic'>{success}</p>}
                <div className='flex items-center justify-center'>
                    <button
                        type='submit'
                        disabled={isLoading}
                        className='bg-sky-900 hover:bg-sky-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:cursor-not-allowed'
                    >
                        Post Transaction
                    </button>
                </div>
            </form>
        </div>
    );
}

export default PostTransactionPage;
