'use client'

import Link from "next/link"
import { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "./button"

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "./tooltip"
import { useAppSelector } from "@/lib/hooks"


export function Nav({links, isCollapsed} ){
  
  // console.log("userdata", userData)




  return (
    <div
      data-collapsed={isCollapsed}
      className="w-full h-full px-5  text-white bg-sky-600 group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2"
    >
       
      <nav className=" mt-5 grid gap-3 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
        {links.map((link, index) =>
          isCollapsed ? (      
            <Tooltip key={index} delayDuration={0}>
              <TooltipTrigger asChild>
                <Link
              href={`${links.links}`}
              className={cn(
                    buttonVariants({ variant: link.links === pathname ? "bg-red-100" : "ghost", size: "icon" }),
                    "h-9 w-9",
                    link.variant === "default" &&
                      "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white"
                  )}
                >
                  <link.icon className="h-4 w-3" />
                  <span className="sr-only">{link.title}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" className="flex items-center gap-4">
                {link.title}
                {link.label && (
                  <span className="ml-auto text-muted-foreground">
                    {link.label}
                  </span>
                )}
              </TooltipContent>
            </Tooltip>
          ) : (
            <Link
              key={index}
              href={`${link.links}`}
              className={cn(
                buttonVariants({variant: link.href === pathname ? "bg-red-400" : "ghost", size: "sm" }),
                link.variant === "default text-white" &&
                  "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white",
                "justify-start"
              )}
            >
              <link.icon className="mr-2 h-4 w-4" />
              {link.title}
              {link.label && (
                <span
                  className={cn(
                    "ml-auto",
                    link.variant === "default" &&
                      "text-background dark:text-white"
                  )}
                >
                  {link.label}
                </span>
              )}
            </Link>
          )
        )}
      </nav>
    </div>
  )
}
