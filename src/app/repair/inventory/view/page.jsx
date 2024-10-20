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

export default function InventoryPageComponent() {
    const router = useRouter()
  const [brands, setBrands] = useState([])
  const [filteredBrands, setFilteredBrands] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newBrandName, setNewBrandName] = useState('')

  useEffect(() => {
    async function fetchBrands(){
      try {
        const response = await getBrands()
        console.log("response brands",response)
        setBrands(response)
        setFilteredBrands(response)
        setLoading(false)
      } catch (err) {
        console.error('Error fetching brands:', err)
        setError('Failed to load brands')
        setLoading(false)
      }
    }
    fetchBrands()
  }, [])

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

  function handleRouting(id){
    console.log("clicked")
    router.push(`/repair/inventory/category/${id}`)
  }

  return (
      <div className="p-3 bg-inherit text-black h-[90%]">
        <div className="max-w-6xl  mx-auto">
          <div
            className="flex flex-col space-y-4 mb-8"
          >
            <h1 className="text-3xl lg:text-4xl font-bold text-center pb-4 text-black">Inventory Brands</h1>

            <div className="flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0 sm:space-x-4 w-full">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white" />
                <Input
                  type="text"
                  placeholder="Search brands..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="pl-10 w-full bg-indigo-400 placeholder:text-gray-200 text-white border-indigo-500 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>

              <Button
                onClick={() => router.push('/')}
                variant="outline"
                className="w-full sm:w-auto text-black  border-white hover:bg-indigo-700 hover:text-white"
              >
                <ArrowLeft className="mr-2 h-4 w-3" />
                Back to Dashboard
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredBrands?.map((data) => (
              <BrandCard
                key={data.id}
                brand={data}
                onClick={()=>handleRouting(data.id)}
              />
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
            <Button
              className="fixed bottom-8 right-8 rounded-full w-14 h-14 lg:w-16 lg:h-16 shadow-lg bg-purple-600 hover:bg-purple-700 text-black"
              onClick={() => setIsDialogOpen(true)}
            >
              <Plus className="w-6 h-6 lg:w-8 lg:h-8" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-slate-800 text-white">
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
                  className="col-span-3 bg-slate-700 text-white border-gray-600 focus:border-purple-500 focus:ring-purple-500"
                  placeholder="Enter brand name"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" onClick={handleAddBrand} className="bg-purple-600 hover:bg-purple-700 text-black">
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

    try {
      // Perform your PATCH request here
      const response = await deleteBrands(id)
      const result =  response
      console.log("deleted", result)   
      setIsDelete(true)     
  
    } 
    catch (error) {
      console.error('Error updating data:', error);
    }
  }
  return (
    <div
      onClick={onClick}
      className="cursor-pointer w-[230px]"
    >
      <Card className="bg-gray-200  border-none shadow-lg hover:shadow-xl transition-shadow duration-300 group relative overflow-hidden">
        <div className="absolute inset-0 bg-slate-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
        <div className="absolute inset-0 bg-purple-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
          <div className="flex gap-1 items-center">

          <CardTitle className="text-lg sm:text-xl font-medium text-black group-hover:text-black transition-colors duration-300">
            {brand.name}
          </CardTitle>
          <Smartphone className="h-5 w-5 sm:h-6 sm:w-6 text-purple-400" />
          </div>
          <AlertDialog>
<AlertDialogTrigger>          <MdDelete onClick  className="h-5 w-5 sm:h-6 sm:w-6 text-purple-400 hover:scale-125" />

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

        </CardHeader>
        <CardContent className="relative z-10">
        </CardContent>
      </Card>
    </div>
  )
}