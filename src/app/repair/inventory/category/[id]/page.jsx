'use client';
import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Smartphone, ArrowLeft, Search, Plus } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { getItems, postCategory } from '@/api/GetRepairProducts';

export default function InventoryPageComponent() {
    const router = useRouter()
    const params = useParams()
    const id = params.id
  const [filteredBrands, setFilteredBrands] = useState([])
  // const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newCatName, setNewCat] = useState('')

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await getItems()
        // console.log("sd",response)
        const data = response.filter((brand) => brand.brand == id);
        setFilteredBrands(data);
        setLoading(false)
      } catch (err) {
        console.error('Error fetching brands:', err)
        setError('Failed to load brands')
        setLoading(false)
      }
    }

    fetchBrands()
  }, [])

  // useEffect(() => {
  //   const results = brands.filter(brand =>
  //     brand.name.toLowerCase().includes(searchTerm.toLowerCase())
  //   )
  //   setFilteredBrands(results)
  // }, [searchTerm, brands])

  // const handleSearch = (event) => {
  //   setSearchTerm(event.target.value)
  // }

  // const handleAddCat = async (e) => {
  //   e.preventDefault()
  //   try {
  //     const response = await postCategory()
  //     response.map((brand) => (
  //       brand.id === id &&
  //       setFilteredBrands(brand)
  //     ))
  //     // setFilteredBrands([...filteredBrands, response.data])
  //     setNewCat('')
  //     setIsDialogOpen(false)
  //   } catch (error) {
  //     console.error('Error adding brand:', error)
  //   }
  // }

  console.log("data",filteredBrands)


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

  return (
      <div className="p-3 bg-inherit text-black h-[90%]">
        <div className="max-w-6xl  mx-auto">
          <div
            className="flex flex-col space-y-4 mb-8"
          >
            <h1 className="text-3xl lg:text-4xl font-bold text-center pb-4 text-black">Select Category</h1>

            <div className="flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0 sm:space-x-4 w-full">
              {/* <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white" />
                <Input
                  type="text"
                  placeholder="Search Category..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="pl-10 w-full bg-indigo-400 placeholder:text-gray-200 text-white border-indigo-500 focus:border-purple-500 focus:ring-purple-500"
                />
              </div> */}

              <Button
                onClick={() => router.push('/repair/inventory/view')}
                variant="outline"
                className="w-full sm:w-auto text-black  border-white hover:bg-indigo-700 hover:text-white"
              >
                <ArrowLeft className="mr-2 h-4 w-3" />
                Back to Brands
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBrands.map((brand) => (
              <BrandCard
                key={brand.id}
                brand={brand}
                onClick={() => router.push(`/repair/inventory/category/${brand.brand}/${brand.category}/`)}
              />
            ))}
          </div>

          {filteredBrands.length === 0 && (
            <div
              className="text-center text-black mt-8"
            >
              No Category found matching your search.
            </div>
          )}
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="fixed bottom-8 right-8 rounded-full w-14 h-14 lg:w-16 lg:h-16 shadow-lg bg-purple-600 hover:bg-purple-700 text-black"
              onClick={()=>router.push(`/repair/inventory/addProduct/`)}
              // onClick={() => setIsDialogOpen(true)}
            >
              <Plus className="w-6 h-6 lg:w-8 lg:h-8" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-slate-800 text-white">
            <DialogHeader>
              <DialogTitle>Add New category</DialogTitle>
              <DialogDescription className="text-slate-400">
                Enter the name of the new category you want to add.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="newCatName" className="text-right">
                  Category Name
                </Label>
                <Input
                  id="newCatName"
                  value={newCatName}
                  onChange={(e) => setNewCat(e.target.value)}
                  className="col-span-3 bg-slate-700 text-white border-gray-600 focus:border-purple-500 focus:ring-purple-500"
                  placeholder="Enter category name"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" className="bg-purple-600 hover:bg-purple-700 text-black">
                Add Category
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
  )
}

function BrandCard({ brand, onClick }) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer"
    >
      <Card className="bg-gradient-to-b from-slate-800 to-slate-900 border-none shadow-lg hover:shadow-xl transition-shadow duration-300 group relative overflow-hidden">
        <div className="absolute inset-0 bg-slate-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
        <div className="absolute inset-0 bg-purple-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
          <CardTitle className="text-lg sm:text-xl font-medium text-slate-300  transition-colors duration-300">
            {brand.name}
          </CardTitle>
          <Smartphone className="h-5 w-5 sm:h-6 sm:w-6 text-purple-400" />
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="text-xs sm:text-sm text-slate-400 group-hover:text-purple-200 transition-colors duration-300">
            Items in stock: {brand.quantity}
          </div>
          <div className="text-xs sm:text-sm text-blue-400 mt-1 group-hover:text-purple-200 transition-colors duration-300">
          RS. {brand.cost}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}