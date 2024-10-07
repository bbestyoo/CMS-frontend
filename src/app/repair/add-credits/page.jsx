'use client'
import { postCreditsCustomerApi } from '@/api/GetRepairProducts';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Home() {
  const [customerName, setCustomerName] = useState('');
  const [due, setDue] = useState('');
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Customer Name:', customerName);
    const data = {'name': customerName, 'due': due};
    const response = await postCreditsCustomerApi(data);
    console.log("data", response);
    if (response != null) {
      router.push('/repair/call-to-customer');
    }
  };

  return (
    <>
      <div className="text-2xl font-medium text-center mt-10">
        Credits Create Page
      </div>
      <div className="flex items-start mt-16 justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h1 className="text-2xl font-bold text-center mb-6">Enter Customer Name</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              value={customerName} // Add value here
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Customer Name"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="text"
              value={due} // Add value here
              onChange={(e) => setDue(e.target.value)}
              placeholder="Due"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition duration-200"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
