'use client'
import { productsApi } from '@/api/GetRepairProducts';
import React, { useEffect, useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';     
import { PureComponent } from 'react';
import { PieChart, Pie, Sector, Cell } from 'recharts';


const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p>{`Date: ${label}`}</p>
        <p>{`Total Amount: ${payload[0].value}`}</p>
        {/* Add additional details from your data */}
      </div>
    );
  }
}

export const LineDiagram = () => {
  const [selectedView, setSelectedView] = useState('daily'); // Initial state: default to daily view

  // Example data from API
  const [apiData, setData ] = useState([])
  
  const productsfunction  = async ()=> {
    const data = await productsApi()
    console.log("data",data)
    const filteredData = data?.results?.map((el) => ({
      customer_name: el.customer_name,
      phone_model: el.phone_model,
      total_amount: el.total_amount,
      received_date: el.received_date
    }));
     setData(filteredData)

  }

  useEffect(()=>{
    productsfunction()
  }, [])

  // Function to filter data for a specific time period
  const filterDataByTimePeriod = (data, timePeriod) => {
    const today = new Date();
    switch (timePeriod) {
      case 'daily':
        const todayDateString = today.toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
        const daily = data.filter(item => item.received_date === todayDateString);
        
        return daily

      case 'weekly':
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7); // Get date 7 days ago
        return data.filter(item => {
          const receivedDate = new Date(item.received_date);
          const weekly = receivedDate >= sevenDaysAgo && receivedDate <= today;
          return weekly


        });

      case 'monthly':
        const currentMonthStartDate = new Date(today.getFullYear(), today.getMonth(), 1); // Set to the 1st day of the current month
        return data.filter(item => {
          const receivedDate = new Date(item.received_date);
          const monthly = receivedDate >= currentMonthStartDate && receivedDate <= today;
          return monthly
        });

      default:
        return []; // Handle default case
    }
  };

  // Function to get appropriate data key for XAxis
  const getXAxisDataKey = () => {
    switch (selectedView) {
      case 'daily':
        return 'received_date'; // Use received_date for daily view
      case 'weekly':
        return 'day_of_week'; // Use day_of_week for weekly view
      case 'monthly':
        return 'week_number'; // Use week_number for monthly view
      default:
        return ''; // Handle default case
    }
  };

  // Function to get XAxis label based on selected view
  const getXAxisLabel = () => {
    switch (selectedView) {
      case 'daily':
        return 'Date'; // Label for daily view
      case 'weekly':
        return 'Day of Week'; // Label for weekly view
      case 'monthly':
        return 'Week'; // Label for monthly view
      default:
        return ''; // Handle default case
    }
  };

  // Function to prepare data for rendering
  const prepareChartData = () => {
    const filteredData = filterDataByTimePeriod(apiData, selectedView);

    // Adjust data format if needed based on selected view
    switch (selectedView) {

      case 'weekly':
        // Create an array of all weekdays
        const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      
        // Initialize an object to count total amounts per weekday
        const weeklyDataMap = {};
        weekdays.forEach(day => {
          weeklyDataMap[day] = { day_of_week: day, total_amount: 0 };
        });
      
        // Aggregate data by weekday
        filteredData.forEach(item => {
          const receivedDate = new Date(item.received_date);
          const dayOfWeek = receivedDate.toLocaleDateString('en-US', { weekday: 'short' });
          weeklyDataMap[dayOfWeek].total_amount += item.total_amount;
        });
      
        // Convert weeklyDataMap values back to an array
        const weeklyChartData = Object.values(weeklyDataMap);
      
        return weeklyChartData;

      case 'monthly':
        // Example: Assign week number to each data point
        filteredData.forEach((item, index) => {
          item.week_number = `Week ${index + 1}`;
        });
        break;
      default:
        // For daily view, no additional data formatting needed
        break;
    }

    return filteredData;
  };

  return (
    <div className="App">
      <h1>Sales Chart</h1>
      <select  className='py-2 px-4 rounded-3xl'  value={selectedView} onChange={(e) => setSelectedView(e.target.value)}>
        <option value="daily">Daily</option>
        <option value="weekly">Weekly</option>
        <option value="monthly">Monthly</option>
      </select>
      <br /><br />
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={prepareChartData()}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={getXAxisDataKey()} />
          <YAxis />
          <Tooltip content={<CustomTooltip />}/>
          <Legend />
          <Line type="monotone" dataKey="total_amount" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export const PieDiagarm = () => {

  const [pieChartData, setPieChartData] = useState([]);
  const productsfunction = async () => {
    try {
      const res = await productsApi();
      console.log("res",res) // Assuming productsApi is an async function returning an array of data objects
      const status = ["Completed", "outside_repair", "Unrepairable", "Not repaired"];
      const newData = status.map((s) => {
        const filteredData = res.results.filter((el) => el.repair_status === s);
        const sum = filteredData.reduce((total, current) => total + current.total_amount, 0);
        const length = filteredData.length;
        return { name: s, total_amount: sum, length: length };
      });

      setPieChartData(newData);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
  
  useEffect(() => {
    productsfunction();
  }, []);
    
  console.log("asdsetpiechartdata",pieChartData)

  const renderActiveShape = (props) => {
    const RADIAN = Math.PI / 180;
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    return (
      <g>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
          {payload.name}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 15}
          outerRadius={outerRadius + 20}
          fill={fill}
        />
        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`total_amt: ${value}`}</text>
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey + 17} textAnchor={textAnchor} fill="#333">{`total_items: ${payload.length}`}</text>
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={35} textAnchor={textAnchor} fill="#999">
          {`(Rate ${(percent * 100).toFixed(2)}%)`}
        </text>
      </g>
    );
  };

  const [activeIndex, setActiveIndex] = useState(0);

  const onPieEnter = (_, index) => {  
    setActiveIndex(index);
  };

  return (
    <>
    <div className=''>
    <div className='flex justify-between items-center px-3'>
    <h1>Pie Chart</h1>
    <button disabled className='px-3 py-2 bg-sky-100 rounded-3xl'>This Month</button>
      {/* <select  className='py-2 px-4 rounded-3xl'  
      // value={selectedView} onChange={(e) => setSelectedView(e.target.value)}
      >
        <option value="daily">Today</option>
        <option value="weekly">This week</option>
        <option value="monthly">This month</option>
      </select> */}
      

    </div>
    <ResponsiveContainer className={""} width="100%" height={200}>
      <PieChart width={400} height={400}>
        <Pie
          activeIndex={activeIndex}
          activeShape={renderActiveShape}
          data={pieChartData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          fill="#8884d8"
          dataKey="total_amount"
          onMouseEnter={onPieEnter}
          paddingAngle={5}
        />
      </PieChart>
    </ResponsiveContainer>
    </div>
    </>

  );
};
  
// export const BarDiagram = () => {

//   const [pieChartData, setPieChartData] = useState([]);
//   const productsfunction = async () => {
//     try {
//       const res = await productsApi();
//       console.log("res",res) 
//       const categories = [...new Set(res.map((el) => el.cate// Assuming productsApi is an async function returning an array of data objects
//       const status = ["Completed", "outside_repair", "Unrepairable", "Not repaired"];
//       const newData = status.map((s) => {
//         const filteredData = res.filter((el) => el.repair_status === s);
//         const sum = filteredData.reduce((total, current) => total + current.total_amount, 0);
//         const length = filteredData.length;
//         return { name: s, total_amount: sum, length: length };
//       });

//       setPieChartData(newData);
//     } catch (error) {
//       console.error("Error fetching products:", error);
//     }
//   };
  
//   useEffect(() => {
//     productsfunction();
//   }, []); 

// }
export default function App(){

  return (
    <>

    <div className='grid grid-cols-2 '>
    <div className='col-span-1'>

    <LineDiagram/>
    </div>
    <div className='col-span-1'>
    <PieDiagarm/>
    </div>
    </div>
    </>
  )

}