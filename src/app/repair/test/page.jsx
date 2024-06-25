'use client'
import { useRouter } from 'next/navigation'
import React from 'react'

export default function Test() {
    const router = useRouter()
    function handleClick(){
        router.push('/repair/test/asdasd')
    }
  return (
    <div onClick={handleClick}>Click here for route</div>
  )
}
