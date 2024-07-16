'use client';

import { getSearchProductsApi } from "@/api/GetRepairProducts";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { FaPrint } from "react-icons/fa6";

function ProductDetails() {
  const [showMore, setShowMore] = useState(false);
  const [obj, setObject] = useState({});
  const router = useRouter();
  const path = useParams();
  const params = path.details;

    console.log("*********", path);
    console.log("*********#######", params);

  useEffect(() => {
    if (params) {
      getRepair(params);
    }
  }, [params]);

  const getRepair = async (params) => {
    try {
      const response = await getSearchProductsApi(`q=${params}`);
      console.log("Here is searched product", response);
      if (response && response.length > 0) {
        const data = response[0];
        setObject(data);
      }
    } catch (error) {
      console.error("Error fetching repair data:", error);
    }
  };

  const primaryDetails = [
    'customer_name',
    'customer_phone_number',
    'phone_model',
    'repair_problem',
    'total_amount',
    'advance_paid',
    'due',
    'amount_paid'
  ];

  const allDetailsOrder = [
    'customer_name',
    'customer_phone_number',
    'phone_model',
    'repair_problem',
    'total_amount',
    'due',
    'amount_paid',
    'sim_tray',
    'sim',
    'SD_card',
    'phone_cover',
    'repair_id',
    'repair_description',
    'imei_number',
    'model_number',
    'phone_condition',
    'received_date',
    'received_by',
    'outside_repair',
    'delivery_date',
    'repair_status',
    'repair_cost_price',
    'cost_price_description',
    'repair_profit',
    'technician_profit',
    'my_profit',
    'admin_only_profit',
    'outside_name',
    'outside_desc',
    'taken_by',
    'outside_cost',
    'repaired_by',
  ];

  const renderDetails = (details) => (
    details.map((key) => (
      <tr key={key} className="border-b">
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">
          {key.replace(/_/g, ' ')}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {obj[key] !== undefined && obj[key] !== null ? obj[key].toString() : 'N/A'}
        </td>
      </tr>
    ))
  );

  return (
    <div className="container h-[545px] p-4 overflow-y-scroll mx-auto bg-gray-100 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-center mb-6">Repair Details</h1>
      <div className="justify-end flex gap-4">
        <div onClick={() => router.push(`/repair/productDetails/${params}/edit`)}>
        <span className='bg-white drop-shadow-xl flex gap-3 w-fit px-3 py-1 mb-3 rounded-xl hover:bg-gray-100'>
            <p className=''>Edit</p>
            <button className='rounded-md'><FaEdit size={30} /></button>
          </span>
  
        </div>
        <div onClick={() => router.push(`/search/${params}`)}>
          <span className='bg-white drop-shadow-xl flex gap-3 w-fit px-3 py-1 mb-3 rounded-xl hover:bg-gray-100'>
            <p className=''>Print in PDF</p>
            <button className='rounded-md'><FaPrint size={30} /></button>
          </span>
        </div>
      </div>
      <table className="min-w-full bg-white">
        <tbody>
          {renderDetails(primaryDetails)}
          {showMore && renderDetails(allDetailsOrder.filter(key => !primaryDetails.includes(key)))}
        </tbody>
      </table>
      <div className="flex justify-center mt-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300"
          onClick={() => setShowMore(!showMore)}
        >
          {showMore ? 'Show Less' : 'Show More'}
        </button>
      </div>
    </div>
  );
}

export default ProductDetails;
