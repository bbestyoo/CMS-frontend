"use client"

import * as React from "react"
import { Label, Pie, PieChart, Sector } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {  ChartConfig, ChartContainer, ChartStyle, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { productsApi } from "@/api/GetRepairProducts"


export default function RepairStatusPieChart() {
  const id = "repair-status-pie"
  const [rawData, setRawData] = React.useState([])
  const [chartData, setChartData] = React.useState([])
  const [chartConfigState, setChartConfigState] = React.useState({})
  const [activeIndex, setActiveIndex] = React.useState(0)

  // Define a palette of distinct HSL colors for the chart slices
  // These are direct HSL values, not references to other CSS variables
  const colorPalette = [
   "hsl(205 90% 70%)", // Light Sky Blue (like sky-blue-400)
    "hsl(205 80% 50%)", // Standard Blue (like blue-500)
    "hsl(240 50% 30%)", // Deep Blue (like blue-900)
    "hsl(215 70% 45%)", // Another medium blue
    "hsl(225 55% 35%)", // Another dark blue
    "hsl(235 45% 25%)",   
  ]

  // Fetch data on component mount
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching products data...")
        const products = await productsApi()
        setRawData(products.results)
        console.log("Fetched data:", products.results)
      } catch (error) {
        console.error("Error fetching products:", error)
      }
    }
    fetchData()
  }, [])

  // Process raw data into chart data and config when rawData changes
  React.useEffect(() => {
    if (rawData.length > 0) {
      const statusCounts  = {}
      rawData.forEach((item) => {
        const status = item.repair_status
        statusCounts[status] = (statusCounts[status] || 0) + 1
      })

      const newChartData = Object.entries(statusCounts).map(([status, count]) => {
        const key = status.replace(/\s+/g, "-").toLowerCase()
        return {
          status,
          count,
          // The fill property should reference the CSS variable that ChartStyle will create
          fill: `var(--color-${key})`,
        }
      })

      const newChartConfig = {}
      Object.keys(statusCounts).forEach((status, index) => {
        const key = status.replace(/\s+/g, "-").toLowerCase()
        newChartConfig[key] = {
          label: status,
          // Assign a direct color from the palette
          color: colorPalette[index % colorPalette.length],
        }
      })

      setChartData(newChartData)
      setChartConfigState(newChartConfig)
      if (newChartData.length > 0) {
        setActiveIndex(0) // Set initial active index to the first item
      }
      console.log("Processed Chart Data:", newChartData)
      console.log("Processed Chart Config:", newChartConfig) // Check this log for direct HSL colors
    }
  }, [rawData])

  // Handle mouse enter for interactive highlighting
  const onPieEnter = (_, index) => {
    setActiveIndex(index)
  }

  // Get the currently active item for the center label
  const activeItem = chartData[activeIndex]

  return (
    <Card data-chart={id} className="flex flex-col bg-gradient-to-r from-blue-200 to-slate-300">
      <ChartStyle id={id} config={chartConfigState} />
      <CardHeader className="flex-row items-start space-y-0 pb-0 p-3">
        <div className="grid gap-1">
          <CardTitle className="text-lg font-semibold">Repair Status Distribution</CardTitle>
          <CardDescription>Pie Chart of your repair data.</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 justify-center pb-0">
        <ChartContainer id={id} config={chartConfigState} className="mx-auto aspect-square w-full max-w-[300px]">
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="status"
              innerRadius={60}
              strokeWidth={5}
              activeIndex={activeIndex}
              activeShape={({ outerRadius = 0, ...props }) => (
                <g>
                  <Sector {...props} outerRadius={outerRadius + 10} />
                  <Sector {...props} outerRadius={outerRadius + 25} innerRadius={outerRadius + 12} />
                </g>
              )}
              onMouseEnter={onPieEnter} // Update activeIndex on mouse enter
              onMouseLeave={() => setActiveIndex(0)} // Reset activeIndex on mouse leave
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox && activeItem) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                        <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-3xl font-bold">
                          {activeItem.count.toLocaleString()}
                        </tspan>
                        <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground">
                          {activeItem.status}
                        </tspan>
                      </text>
                    )
                  }
                  return null
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
