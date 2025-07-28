'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronsUpDown, Plus, Trash2, Check } from 'lucide-react'
import { getCookie } from 'cookies-next'
import { cn } from "@/lib/utils"
import { useAppSelector } from '@/lib/hooks'
import { usePathname, useRouter } from 'next/navigation'

const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;

async function fetchApi(endpoint) {
  const token = getCookie('accesstoken')
  const res = await fetch(`${baseURL}${endpoint}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    credentials: 'include'
  })
  return await res.json()
}

async function postApi(endpoint, data) {
  const token = getCookie('accesstoken')
  const res = await fetch(`${baseURL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    credentials: 'include'
  })
  return res
}

export default function PurchaseTransactionForm() {

  const userData = useAppSelector((state)=> state.user.value)
  const pathname = usePathname()
console.log("pathname",pathname)
const userId = userData?.userinfo?.id
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    purchases: [{ item: '', quantity: 1, price: 0 }],
    purchased_by: userId

  })
  const [items, setItems] = useState([])
   const [showBrandDropdown, setShowBrandDropdown] = useState(false)
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)
  const [brands, setBrands] = useState([])
  const [categories, setCategories] = useState([])
  const [newItemData, setNewItemData] = useState({ name: '', brand: '', category: '', cost: 0})
  const [newBrandName, setNewBrandName] = useState('')
  const [newCategoryName, setNewCategoryName] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isLoading0, setIsLoading0] = useState(false)
  const [isAlert, setIsAlert] = useState(false)
  const [error, setError] = useState(null)
  const [openItemDialog, setOpenItemDialog] = useState(false)
  const [openBrandDialog, setOpenBrandDialog] = useState(false)
  const [openCategoryDialog, setOpenCategoryDialog] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const [itemsData, brandsData, categoriesData] = await Promise.all([
          fetchApi('inventory/item/'),
          fetchApi('inventory/brand/'),
          fetchApi('inventory/category/')
        ])
        setItems(itemsData)
        setBrands(brandsData)
        setCategories(categoriesData)
      } catch (err) {
        setError('Failed to fetch data. Please try again.')
        console.error('Error fetching data:', err)
      }
      setIsLoading(false)
    }
    fetchData()
  }, [])

  const handleInputChange = (index, field, value) => {
    const newPurchases = [...formData.purchases]
    newPurchases[index] = { ...newPurchases[index], [field]: value }
    setFormData({ ...formData, purchases: newPurchases })
  }

  const handleAddPurchase = () => {
    setFormData({
      ...formData,
      purchases: [...formData.purchases, { item: '', quantity: 1, price: 0 }]
    })
  }

  const handleRemovePurchase = (index) => {
    const newPurchases = formData.purchases.filter((_, i) => i !== index)
    setFormData({ ...formData, purchases: newPurchases })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
        setIsLoading0(true)

    try {
      const response = await postApi('inventory/purchase/', formData)
      if (response.ok) {
        setFormData({
          date: new Date().toISOString().split('T')[0],
          purchases: [{ item: '', quantity: 1, price: 0 }],
          purchased_by: ''

        })
        setIsAlert(true)
        router.push('/repair/inventory/view/')
      } else {
        throw new Error('Failed to submit purchase transaction')
      }
    } catch (err) {
      setError('Failed to submit purchase transaction. Please try again.')
      console.error('Error submitting purchase transaction:', err)
    }
    setIsLoading(false)
  }

  const handleAddNewItem = async () => {
    try {
      const response = await postApi('inventory/item/', newItemData)
      if (response.ok) {
        const newItem = await response.json()
        // console.log("asd",newItem)
        setItems([...items, newItem])
        setNewItemData({ name: '', brand: '', category: '', cost: 0 })
        setOpenItemDialog(false)
      } else {
        throw new Error('Failed to add new item')
      }
    } catch (err) {
      setError('Failed to add new item. Please try again.')
      console.error('Error adding new item:', err)
    }
  }

  const handleAddNewBrand = async () => {
    try {
      const response = await postApi('inventory/brand/', { name: newBrandName })
      if (response.ok) {
        const newBrand = await response.json()
        setBrands([...brands, newBrand])
        setNewBrandName('')
        setOpenBrandDialog(false)
        setOpenItemDialog(true)
      } else {
        throw new Error('Failed to add new brand')
      }
    } catch (err) {
      setError('Failed to add new brand. Please try again.')
      console.error('Error adding new brand:', err)
    }
  }

  const handleAddNewCategory = async () => {
    try {
      const response = await postApi('inventory/category/', { name: newCategoryName })
      if (response.ok) {
        const newCategory = await response.json()
        setCategories([...categories, newCategory])
        setNewCategoryName('')
        setOpenCategoryDialog(false)
        setOpenItemDialog(true)
      } else {
        throw new Error('Failed to add new category')
      }
    } catch (err) {
      setError('Failed to add new category. Please try again.')
      console.error('Error adding new category:', err)
    }
  }

   const handleBrandSelect = (brandId) => {
    setNewItemData({ ...newItemData, brand: brandId })
    setShowBrandDropdown(false)
  }

  const handleCategorySelect = (categoryId) => {
    setNewItemData({ ...newItemData, category: categoryId })
    setShowCategoryDropdown(false)
  }

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>
  }

  return (
    <Card className="w-[98%] mx-auto border-none p-0 m-3 h-[89vh] bg-white rounded-lg">
      <CardHeader>
        { pathname == '/repair/inventory/addProduct' &&
          <CardTitle className="text-sky-700">Purchase Transaction Form</CardTitle>
        }
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                type="date"
                id="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full"
              />
            </div>
            <div> 
              <Label htmlFor="purchased_by">Purchased By</Label>
              <Input
                type="text"
                id="purchased_by"
                value={userData?.userinfo?.name}
                onChange={(e) => setFormData({ ...formData, purchased_by: userId })}
                className="w-full"
                placeholder="Enter purchaser ID"
              />
            </div>
          </div>
          <div className='h-[42vh] overflow-y-scroll'>

          {formData.purchases.map((purchase, index) => (
            <Card key={index} className="mt-1">
              <CardHeader>
                <CardTitle className="text-lg text-sky-700">Purchase Item {index + 1}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <Label htmlFor={`item-${index}`}>Item</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-between">
                        {purchase.item ? items.find(i => i.id === purchase.item)?.name : "Select item..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search item..." />
                        <CommandList>
                          <CommandEmpty>No item found.</CommandEmpty>
                          <CommandGroup>
                            {items.map((item) => (
                              <CommandItem
                                key={item.id}
                                onSelect={() => handleInputChange(index, 'item', item.id)}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    purchase.item === item.id ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                {item.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                          <CommandSeparator />
                          <CommandGroup>
                            <CommandItem onSelect={() => setOpenItemDialog(true)}>
                              <Plus className="mr-2 h-4 w-4" />
                              Add new item
                            </CommandItem>
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`quantity-${index}`}>Quantity</Label>
                    <Input
                      type="number"
                      id={`quantity-${index}`}
                      value={purchase.quantity}
                      onChange={(e) => handleInputChange(index, 'quantity', parseInt(e.target.value))}
                      min="1"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`price-${index}`}>Price</Label>
                    <Input
                      type="number"
                      id={`price-${index}`}
                      value={purchase.price}
                      onChange={(e) => handleInputChange(index, 'price', parseFloat(e.target.value))}
                      min="0"
                      step="0.01"
                      className="w-full"
                    />
                  </div>
                </div>
                {index > 0 && (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => handleRemovePurchase(index)}
                    className="w-full"
                  >
                    <Trash2 className="mr-2 h-4 w-4" /> Remove Item
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
          </div>


          <button type="button" onClick={handleAddPurchase} className="w-full bg-sky-800 flex justify-center items-center p-2 text-white hover:bg-sky-900 rounded-xl">
            <Plus className="mr-2 h-4 w-4" /> Add Another Purchase Item
          </button>

          <button type="submit" disabled={isLoading0} className="w-full disabled:cursor-not-allowed bg-sky-800 p-2 text-white hover:bg-sky-900 rounded-xl">Submit Purchase Transaction</button>
          {isAlert && <p className='text-green-300 text-sm text-center my-2'>Transaction submitted successfully</p>}
        </form>

        <Dialog open={openItemDialog} onOpenChange={setOpenItemDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Item</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Item Name"
                value={newItemData.name }
                onChange={(e) => setNewItemData({ ...newItemData, name: e.target.value })}
              />
              <div>
                <Label>Brand</Label>
                <div className="relative">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full justify-between bg-transparent"
                    onClick={() => setShowBrandDropdown(!showBrandDropdown)}
                  >
                    {newItemData.brand
                      ? brands.find((b) => b.id === newItemData.brand)?.name || "Select brand..."
                      : "Select brand..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>

                  {showBrandDropdown && (
                    <div className="absolute top-full left-0 right-0 z-50 bg-white border border-gray-200 rounded-md shadow-lg mt-1 max-h-60 overflow-auto">
                      {brands.map((brand) => (
                        <button
                          key={brand.id}
                          type="button"
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center border-none bg-transparent cursor-pointer"
                          onClick={() => handleBrandSelect(brand.id)}
                        >
                          <Check
                            className={cn("mr-2 h-4 w-4", newItemData.brand === brand.id ? "opacity-100" : "opacity-0")}
                          />
                          {brand.name}
                        </button>
                      ))}
                      <div className="border-t">
                        <button
                          type="button"
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center text-blue-600 border-none bg-transparent cursor-pointer"
                          onClick={() => {
                            setOpenBrandDialog(true)
                            setOpenItemDialog(false)
                            setShowBrandDropdown(false)
                          }}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Add new brand
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Category Selection - Simple Dropdown */}
              <div>
                <Label>Category</Label>
                <div className="relative">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full justify-between bg-transparent"
                    onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                  >
                    {newItemData.category
                      ? categories.find((c) => c.id === newItemData.category)?.name || "Select category..."
                      : "Select category..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>

                  {showCategoryDropdown && (
                    <div className="absolute top-full left-0 right-0 z-50 bg-white border border-gray-200 rounded-md shadow-lg mt-1 max-h-60 overflow-auto">
                      {categories.map((category) => (
                        <button
                          key={category.id}
                          type="button"
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center border-none bg-transparent cursor-pointer"
                          onClick={() => handleCategorySelect(category.id)}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              newItemData.category === category.id ? "opacity-100" : "opacity-0",
                            )}
                          />
                          {category.name}
                        </button>
                      ))}
                      <div className="border-t">
                        <button
                          type="button"
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center text-blue-600 border-none bg-transparent cursor-pointer"
                          onClick={() => {
                            setOpenCategoryDialog(true)
                            setOpenItemDialog(false)
                            setShowCategoryDropdown(false)
                          }}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Add new category
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div  className="">
                <div className="mb-2">
                  Cost :
                </div>
                 
              <Input
                type="number"
                placeholder="Cost"
                value={newItemData.cost}
                onChange={(e) => setNewItemData({ ...newItemData, cost: parseFloat(e.target.value) })}
                min="0"
                step="0.01"
                />
            </div>
                </div>
            <DialogFooter>
              <Button onClick={handleAddNewItem}>Add Item</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={openBrandDialog} onOpenChange={setOpenBrandDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Brand</DialogTitle>
            </DialogHeader>
            <Input
              placeholder="Brand Name"
              value={newBrandName}
              onChange={(e) => setNewBrandName(e.target.value)}
            />
            <DialogFooter>
              <Button onClick={handleAddNewBrand}>Add Brand</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={openCategoryDialog} onOpenChange={setOpenCategoryDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
            </DialogHeader>
            <Input
              placeholder="Category Name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
            />
            <DialogFooter>
              <Button onClick={handleAddNewCategory}>Add Category</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}



// need to update radix for it to Work doesnt work by default in shadcn can use npm update