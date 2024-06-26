'use client'
import { getSearchProductsApi } from '@/api/GetRepairProducts';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

function Details({ params }) {


  const router = useRouter()
  console.log("params",params)
  const [details, setDetails] = useState({});
  console.log("details",details)

  async function getSearch() {
    console.log("here");
    if (params.detailsId && params.detailsId.length > 0) {
      console.log("inside",params.detailsId);

      try {
        console.log("entered");
        const  searchQ = `q=${params.detailsId}`
        const response = await getSearchProductsApi(searchQ);
        console.log("here's the response", response[0]);
        const res = response[0]
        response && response.length > 0 && response !== 'NONE' && setDetails(res);
      } catch (err) {
        console.log("error", err);
      }
    } else {
      console.log("params.detailsId is empty or undefined.");
    }
  }

  useEffect(() => {
    getSearch();
  }, []);

  function handleRoute() {
    router.push('/')
  }

  return (
    <>
      <div  className='flex flex-col gap-36'>
        <div className="receipt">
          <div className="header flex gap-80 mb-10">
            <Image 
            onClick={handleRoute}
            height={100}
            width={100}
            src={'/digi.jpg'}
            alt='digi'
            className='h-[70px] w-[130px]'
            />
            <section>

            <h1>Digitech Enterprises</h1>
            <h5>Basundhara, Kathmandu</h5>
            <h5>Contact: 9851193055, 9803300305</h5>
            </section>
          </div>
          <div onClick={() => window.print()}>

          <div className="print-line">
            <p><strong>Repair ID:</strong> {details.repair_id}</p>
            <p><strong>Date:</strong> {details.received_date}</p>
          </div>

          <div className="print-line">
            <p><strong>Customer Name: </strong> {details.customer_name}</p>
            <p><strong>Contact No.: </strong> {details.customer_phone_number}</p>
            <p><strong>Phone Model: </strong> {details.phone_model}</p>
          </div>

          <div className="print-line">
            <p><strong>IMEI No. </strong> {details.imei_number}</p>
            <p><strong>Model No.: </strong> {details.model_number}</p>
            <p><strong>Problem Reported:</strong> {details.repair_problem}</p>
          </div>
          {/* <p className="center"><strong>Accessories Details:</strong></p> */}

          <div className="box">
            <div className="box-line">
              <p><strong>Sim card:</strong> {details.sim}</p>
            </div>
            <div className="box-line">
              <p><strong>Sim tray:</strong> {details.sim_tray}</p>
            </div>
            <div className="box-line">
              <p><strong>SD card:</strong> {details.SD_card}</p>
            </div>
            <div className="box-line">
              <p><strong>Phone Cover:</strong> {details.phone_cover}</p>
            </div>
          </div>

          <br />
          <div className="print-line">
            <p style={{ textAlign: 'left' }}><strong>Received By: </strong> {details.received_by}</p>
            <p style={{ textAlign: 'left' }}><strong>Phone Condition: </strong> {details.phone_condition}</p>
            <p style={{ textAlign: 'right' }}><strong>Total amount: </strong> {details.total_amount}</p>
          </div>
          <p style={{ textAlign: 'right' }}><strong>Advanced paid: </strong> {details.advance_paid}</p>
          <div className="print-line">
            <p>.......................................</p>
            <p><strong>Delivery by: </strong> {details.delivery_date}</p>
            <p style={{ textAlign: 'right' }}><strong>Due Total:  {details.due} </strong></p>
          </div>

        <div>
          <p className='text-xl font-bold text-center mt-10 '>

Thank you for choosing our Digitech!
</p>
        </div>
        </div>
        </div>
        <div className='border-t-4 border-dashed w-full border-black'></div>

        <div className="receipt">
          <div className="header flex gap-80 mb-10">
            <Image 
            height={100}
            width={100}
            src={'/digi.jpg'}
            alt='digi'
            className='h-[70px] w-[130px]'
            />
            <section>

            <h1>Digitech Enterprises</h1>
            <h5>Basundhara, Kathmandu</h5>
            <h5>Contact: 9851193055, 9803300305</h5>
            </section>
          </div>
          <div onClick={() => window.print()}>

<div className="print-line">
  <p><strong>Repair ID:</strong> {details.repair_id}</p>
  <p><strong>Date:</strong> {details.received_date}</p>
</div>

<div className="print-line">
  <p><strong>Customer Name: </strong> {details.customer_name}</p>
  <p><strong>Contact No.: </strong> {details.customer_phone_number}</p>
  <p><strong>Phone Model: </strong> {details.phone_model}</p>
</div>

<div className="print-line">
  <p><strong>IMEI No. </strong> {details.imei_number}</p>
  <p><strong>Model No.: </strong> {details.model_number}</p>
  <p><strong>Problem Reported:</strong> {details.repair_problem}</p>
</div>
{/* <p className="center"><strong>Accessories Details:</strong></p> */}

<div className="box">
  <div className="box-line">
    <p><strong>Sim card:</strong> {details.sim}</p>
  </div>
  <div className="box-line">
    <p><strong>Sim tray:</strong> {details.sim_tray}</p>
  </div>
  <div className="box-line">
    <p><strong>SD card:</strong> {details.SD_card}</p>
  </div>
  <div className="box-line">
    <p><strong>Phone Cover:</strong> {details.phone_cover}</p>
  </div>
</div>

<br />
<div className="print-line">
  <p style={{ textAlign: 'left' }}><strong>Received By: </strong> {details.received_by}</p>
  <p style={{ textAlign: 'left' }}><strong>Phone Condition: </strong> {details.phone_condition}</p>
  <p style={{ textAlign: 'right' }}><strong>Total amount: </strong> {details.total_amount}</p>
</div>
<p style={{ textAlign: 'right' }}><strong>Advanced paid: </strong> {details.advance_paid}</p>
<div className="print-line">
  <p>.......................................</p>
  <p><strong>Delivery by: </strong> {details.delivery_date}</p>
  <p style={{ textAlign: 'right' }}><strong>Due Total:  {details.due} </strong></p>
</div>

<div>
<p className='text-xl font-bold text-center mt-10 '>

Thank you for choosing our Digitech!
</p>
</div>
</div>
        </div>
      </div>
    </>
  );
}

export default Details;
