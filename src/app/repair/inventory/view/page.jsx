'use client';
import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MdDelete } from "react-icons/md";
import { Label } from "@/components/ui/label"
import { Smartphone, ArrowLeft, Search, Plus } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent, 
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { deleteBrands, getBrands, postBrands } from '@/api/GetRepairProducts';
import { IoAddCircleSharp } from 'react-icons/io5';
import PurchaseTransactionForm from '../addProduct/page';

export default function InventoryPageComponent() {
    const router = useRouter()
  const [brands, setBrands] = useState([])
  const [filteredBrands, setFilteredBrands] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isRefetch, setIsRefetch] = useState(false)
  const [newBrandName, setNewBrandName] = useState('')

  useEffect(() => {
    async function fetchBrands(){
      try {
        const response = await getBrands()
        console.log("response brands",response)
        setBrands(response)
        setFilteredBrands(response)
        setLoading(false)
        setIsRefetch(true)
      } catch (err) {
        console.error('Error fetching brands:', err)
        setError('Failed to load brands')
        setLoading(false)
      }
    }
    fetchBrands()
  }, [isRefetch])

  useEffect(() => {
    const results = brands.filter(brand =>
      brand.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredBrands(results)
  }, [searchTerm, brands])

  const handleSearch = (event) => {
    setSearchTerm(event.target.value)
  }

  const handleAddBrand = async (e) => {
    e.preventDefault();
    try {
      const response = await postBrands({ name: newBrandName });
      console.log('New Brand Added:', response);
  
      // Since the response is an object, not an array
      setBrands([...brands, response]);
      setFilteredBrands([...filteredBrands, response]);

      setNewBrandName('');
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error adding brand:', error);
    }
  };
  

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-black">
      Loading...
    </div>
  )
  
  if (error) return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-red-500">
      {error}
    </div>
  )

  function handleRouting(e, id){
    if (e.target.closest('button')) {
      return; // Don't navigate
    }
    router.push(`/repair/inventory/category/${id}`)
  }

  return (
      <div className="p-3 px-8 bg-inherit text-black    h-[90%]">
        <div className="max-w-6xl  mx-auto">
          
          <div
            className="flex flex-col space-y-4 mb-5"
          >
            <h1 className="text-3xl lg:text-2xl  text-center pb-4 text-sky-600 text-semibold">Inventory Brands</h1>

            <div className="flex flex-col bg-white rounded-xl px-1 py-2 sm:flex-row justify-between space-y-4 sm:space-y-0 sm:space-x-4 w-full">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black" />
                <Input
                  type="text"
                  placeholder="Search brands..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="pl-10 w-full bg-sky-200 rounded-lg placeholder:text-black text-black "
                />
              </div>

              <div className="w-full flex justify-end">
                       <Dialog>
               <DialogTrigger>
                 <section
                         className="w-fit text-md flex items-center bg-sky-200 hover:bg-sky-400 px-3 p-1 rounded-xl gap-1"
                       >
                         <p className='text-sm'>add new purchase</p>
                         <IoAddCircleSharp
                           className="text-indigo-500 hover:text-indigo-700"
                           size={30}
                         />
                       </section>
               </DialogTrigger>
               <DialogContent className="border-none h-[90vh] overflow-y-scroll hide-scrollbar">
                 <DialogHeader>
                   <DialogDescription >
                    <PurchaseTransactionForm/>
                   </DialogDescription>
                 </DialogHeader>
               </DialogContent>
             </Dialog>
                       
                     </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3  items-center py-5 px-2 bg-white rounded-xl  mt-1 overflow-y-scroll h-[65vh]">
            {filteredBrands?.map((data, i) => (
              <div key={data.id} className={`justify-self-center w-[100%]`}>
              <BrandCard
                brand={data}
                onClick={(e)=>handleRouting(e, data.id)}
                />
                </div>
            ))}
          </div>

          {filteredBrands.length === 0 && (
            <div
              className="text-center text-black mt-8"
            >
              No brands found matching your search.
            </div>
          )}
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <button
              className="fixed bottom-8 right-8 rounded-full w-14 h-14 lg:w-16 lg:h-16 shadow-lg bg-sky-200 text-gray-600 flex justify-center items-center"
              onClick={() => setIsDialogOpen(true)}
            >
              <Plus className="w-6 h-6 lg:w-8 lg:h-8" />
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[35vw] bg-sky-800 text-white">
            <DialogHeader>
              <DialogTitle>Add New Brand</DialogTitle>
              <DialogDescription className="text-slate-400">
                Enter the name of the new brand you want to add.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="newBrandName" className="text-right">
                  Brand Name
                </Label>
                <Input
                  id="newBrandName"
                  value={newBrandName}
                  onChange={(e) => setNewBrandName(e.target.value)}
                  className="col-span-3 bg-gray-300 text-black"
                  placeholder="Enter brand name"
                />
              </div>
            </div>
            <DialogFooter>  
              <Button type="button" onClick={handleAddBrand} className="bg-white hover:bg-gray-400 text-black">
                Add Brand
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
  )
}

function BrandCard({ brand, onClick }) {

  const handleDelete = async (id) => {
    console.log("id",id)
    try {
      // Perform your PATCH request here
      const response = await deleteBrands(id)
      const result =  response
      console.log("deleted", result)   
    } 
    catch (error) {
      console.error('Error updating data:', error);
    }
  }
  return (
    <div
      onClick={onClick}
      className="cursor-pointer w-[100%]  "
    >
      <div className="bg-gradient-to-b from-sky-700 to-slate-800 border-none shadow-lg hover:shadow-xl hover:scale-105  duration-300 group relative overflow-hidden h-fit w-[100%] rounded-lg">
  <div className="flex  items-center justify-center h-full p-4 px-7 relative z-10">
    <div className="flex  gap-2 items-center justify-center text-center">
      <div className="flex justify-between items-center">
        <div className="text-lg sm:text-xl font-medium text-white  transition-colors duration-300 capitalize">
          {brand.name}
         
        </div>
        {/* <Smartphone className="h-5 w-5 sm:h-6 sm:w-6 text-purple-400" /> */}
      </div>
      
      <AlertDialog onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()}
      }>
         <AlertDialogTrigger   asChild>
    <button 
      className="p-1 rounded"
    >
      <MdDelete className="h-5 w-5 sm:h-6 sm:w-6 text-sky-600 hover:scale-125" />
    </button>
  </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this data
              and remove this data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={()=>handleDelete(brand.id)}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  </div>
</div>
    </div>
  )
}