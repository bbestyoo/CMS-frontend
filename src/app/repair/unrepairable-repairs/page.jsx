"use client"
import { patchProductsApiCompleted, productsApi, patchProductsApiReturned } from "@/api/GetRepairProducts";
import { DataTable } from "../data-table";
import { useEffect, useState  } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function DemoPage() {

  const router = useRouter()

  function handleRowClick(rowData) {
    console.log('Clicked row:', rowData);
    const repairId = rowData.original.repair_id
    router.push(`/repair/productDetails/${repairId}`)
  }

  const [data, setData] = useState([])
  const [isReturned, setIsReturned] = useState(false)
  const [metadata,setMetadata] = useState({})

  const columns = [
    {
      accessorKey: "phone_model",
      header: "Products",
      cell: ({ row }) => {
        const { customer_name } = row.original
        return <div onClick={() => handleRowClick(row)} className="capitalize hover:cursor-pointer"> {row.getValue("phone_model")} by {customer_name} </div>
      },
    },
    {
      accessorKey: "repair_problem",
      header: "Problem",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("repair_problem")}</div>
      ),
    },
    {
      accessorKey: "total_amount",
      header: () => <div className="text-right">Amount</div>,
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("total_amount"))
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "Nrs",
        }).format(amount)
        return <div className="text-right font-medium">{formatted}</div>
      },
    },
    {
      accessorKey: "repair_status",
      header: "Status",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("repair_status")}</div>
      ),
    },
    {
      accessorKey: "amount_paid",
      header: () => <div className="text-right">Paid Amount</div>,
      cell: ({ row }) => (
        <div className="capitalize text-right ">{row.getValue("amount_paid")}</div>
      ),
    },
    {
      accessorKey: "repair",
      header: "Repair",
      cell: ({ row }) => (
        <button className="px-4 py-2 bg-sky-600 rounded-2xl" onClick={() => handleReturn(row)}>Returned</button>
      ),
    },
  ]

  const handleReturn = async (row) => {
    const repairId = row.original.repair_id;
    try {
      await patchProductsApiReturned(repairId);
      setIsReturned(true);
    } catch (error) {
      console.error("Error updating repair status:", error);
    }
  }

  const someFunction = async () => {
    try {
      const products = await productsApi("Unrepairable");
      console.log(products)
      const filteredData = products
      const filteredProducts = products.results;
        setMetadata({

          "next" : products.next,
          "previous" : products.previous,
          "count" : products.count
        })
    setData(filteredProducts)
    } catch (error) {
      console.error("error", error)
    }
  }

  useEffect(() => {
    someFunction();
    setIsReturned(false);
  }, [isReturned]);

  return (
    <div className="container bg-white mx-auto rounded-2xl drop-shadow-xl h-[80vh] w-11/12">
      <DataTable columns={columns} initialData={data} initialMetadata={metadata} />
    </div>
  );
}
