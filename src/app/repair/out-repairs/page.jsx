'use client'
import { useRouter } from "next/navigation";
import { DataTable } from "../data-table";
import { useEffect, useState } from "react";
import { patchProductsApiOutRepair, patchProductsApiRepaired, patchProductsApiUnrepairable, productsApi, userInfo } from "@/api/GetRepairProducts";
import { useForm } from "react-hook-form";

const RepairForm  = ({row, handlePatchFn, handleUnrepairable}) => {
    const [show, setShow] = useState(false)

    const { repair_id } = row.original;
  
  
    const getTechInfo =  async () => {
      console.log("!!!!!!!!!!!!!!!!!!")
      const response = await userInfo()
      console.log("!!!!!!again",response)
      setRoles(response)
    }
    useEffect(()=>{
      getTechInfo()
  
    },[])
  
    const handlePopup = (e) => {
      e.stopPropagation()
      setShow(true)
  }
  
  
    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm()
    const { register: register1, handleSubmit: handleSubmit1 } = useForm();
  
    const [roles, setRoles] = useState([])
  
    const onSubmit = async (data) => {
      console.log("here");
      console.log("Form Data:", data);
      console.log("Repair ID:", repair_id);
      const formData = {
        ...data,
        repair_status: data.repair_status || 'Repaired' // No change here
      };
    
      if (formData.repair_cost_price !== "" && formData.repair_status === "Repaired") { // Changed from != to !==
        handlePatchFn(formData, repair_id);
      } else if(formData.repair_cost_price === "" && formData.repair_status === "Unrepairable") {
        handleUnrepairable(repair_id);
      }
    };
  
    function onPost(data){
      console.log("hereeeeeeeeee")
      console.log("data",data)
  
       async function products(){
         
         try{
           
           const res = await patchProductsApiOutRepair(data, repair_id)
           console.log("asdasd",res)         
            console.log("reached here")
            router.push("/repair/")
        }
        catch(err){
          console.log("error",err)
        }
      }
  
      products()
  
  
    }
  
    
    
    return ( 
      <>
  
      <div className="flex  items-center pr-4">
        <form
          className="flex ml-4 mr-2 gap-4 items-center w-full max-w-xl"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className='w-fit '>
            <div className="flex gap-1 justify-start w-full ">
              <p>Unrepairable</p>
              <input
                onClick={(e) => e.stopPropagation()}
                type="checkbox"
                name="repair_status" // Changed from name="Repaired" to name="repair_status"
                value="Unrepairable"
                {...register('repair_status')}
              />
            </div>
          </div>
          <div className="flex flex-col w-2/5">
            <label
              htmlFor="repair_cost_price"
              className="block text-sm font-medium text-black capitalize"
            >
             Description
            </label>
            <input
              type="text"
              id="repair_cost_price"
              name="repair_cost_price"
              {...register('cost_price_description')}
              onClick={(e) => e.stopPropagation()}
              className="mt-1 text-black-600 p-2 w-full border rounded-md"
            />
          </div>
          <div className="flex flex-col w-2/5">
            <label
              htmlFor="repair_cost_price"
              className="block text-sm font-medium text-black capitalize"
            >
               Cost
            </label>
            <input
              type="text"
              id="repair_cost_price"
              name="repair_cost_price"
              {...register('repair_cost_price')}
              onClick={(e) => e.stopPropagation()}
              className="mt-1 text-black-600 p-2 w-full border rounded-md"
            />
          </div>
          <div className="flex flex-col w-2/5">
            <label
              htmlFor="returned_by"
              className="block text-sm font-medium text-black capitalize"
            >
              Returned By
            </label>
            <input
              type="text"
              id="returned_by"
              name="returned_by"
              {...register('returned_by')}
              onClick={(e) => e.stopPropagation()}
              className="mt-1 text-black-600 p-2 w-full border rounded-md"
            />
          </div>
       
          <button
            onClick={(e) => e.stopPropagation()}
            className="bg-indigo-500 hover:bg-indigo-700 text-white rounded-xl p-1"
            type="submit"
          >
            OK
          </button>
        </form>
      
        
      </div>
        </>                                                                                                     
  
    );
   }
  
 
   
export default function RecentOrders() {
    
    const [isRepaired, setIsRepaired] = useState(false)
  // const [isCompleted, setIsCompleted] = useState(false)
  const [isUnrepairable, setIsUnrepairable] = useState(false)

    const router = useRouter()
    function handleRowClick (rowData){
      console.log('Clicked row:', rowData);
      const repairId = rowData.original.repair_id
      router.push(`/repair/productDetails/${repairId}`)
  }
    
  
   
    const [isLoading, setIsLoading] = useState(true)
  
  
  
    
     
  
    // localStorage.clear();
    console.log("here")
    
    const [data, setData] = useState([])
   
  
    const columns = [
      {
          accessorKey: "phone_model",
          header: "Products",
          cell: ({ row }) => {
  
            const {customer_name } = row.original
  
           
            return <div  onClick={() => handleRowClick(row)}  className="capitalize "> {row.getValue("phone_model")} by {customer_name} </div>
          },
        },
      {
          accessorKey: "outside_name",
          header: "Store",
          cell: ({ row }) => (
            <div className="capitalize">{row.getValue("outside_name")}</div>
          ),
        },

    
    {
    id: "select",
    header: "Repaired?",
    cell: ({ row }) => {
      return (
  
        
        <RepairForm row={row} 
        handlePatchFn={handlePatchFn}
            handleUnrepairable={handleUnrepairable}
        />
      )
     
    },
    enableSorting: false,
    enableHiding: false,
  }
  
   
    
    
    
  ]
  
  
  
  
  const handlePatchFn = async (formData, repair_id) => {
  
    
    console.log("entereddddddddddddddd")
  
    console.log("tfisgoingon",formData)
    console.log("*******",repair_id)
        try {
          // Perform your PATCH request here
          const response = await patchProductsApiRepaired(formData, repair_id)
          const result = await response
          console.log("patched", result)   
          setIsRepaired(true)     
  
        } 
        catch (error) {
          console.error('Error updating data:', error);
        }
        
  }
  const handleUnrepairable = async (repairId) => {
    console.log("here")
  
        try {
          // Perform your PATCH request here
          console.log("here agian")
          console.log("******8",repairId)
          const response = await patchProductsApiUnrepairable(repairId)
          const result = await response
          console.log("patched", result)   
          setIsUnrepairable(true)     
  
        } 
        catch (error) {
          console.error('Error updating data:', error);
        }
        
  }
 
  
    const someFunction = async () => {
      try {
          // Call the productsApi function to fetch data
          console.log("asdasd")
          const products = await productsApi();
          
          // Do something with the fetched products data
          console.log("here", products);
          const filteredProducts = products.filter((product) => product.repair_status === "Outrepaired");
          console.log("filtered", filteredProducts);
          setData(filteredProducts);
          console.log("datatoshov",filteredProducts)
          setIsLoading(false)
      } catch (error) {
          // Handle errors if any
          console.error('Error fetching products:', error);
      }
  };
  
  useEffect(() => { 
  someFunction();
    
  }, [isRepaired, isUnrepairable])
  
  return (
      <>
       <div className=" h-[460px] container drop-shadow-xl mx-auto py-10 bg-white text-black h-[480px] rounded-xl">
        <DataTable isLoading={isLoading} columns={columns} data={data} />
      </div>
  
      </>
    )
  }