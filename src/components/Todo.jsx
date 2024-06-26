'use client'
import React, { useState } from 'react'
import { FaTrash } from "react-icons/fa";
// import { FaCheck } from "react-icons/fa";
import { v4 as uuidv4 } from 'uuid';


function Todo() { 

  const [todos, setTodos] = useState([])
  const [change, setChange] = useState("")
  console.log("Asdasd",todos)

  function handleSubmit(e) {
    e.preventDefault()
    setTodos([...todos, {task: change, id:uuidv4()}])
    setChange("")

  }
  function handleDelete(id){
    setTodos(todos.filter(todo => todo.id !== id))
  }
  return (
    <>
    <div className='bg-white h-[390px] overflow-y-scroll drop-shadow-2xl text-black-500 rounded-xl text-white px-3 py-3 '> 
    <h3 className='text-center mb-5 text-md text-black'>

        Todo
    </h3>
    <div>
      <form onSubmit={(e)=>handleSubmit(e)} action="" className='flex gap-3 items-center'>
        <input className=' border border-1 border-blue-900 p-2 bg-gray-50 rounded-3xl text-black placeholder:text-gray-500' onChange={(e)=>setChange(e.target.value)} type="text" name="todo" value={change} placeholder="Add Your Todo"  />
        <button type='submit' className=' rounded-full h-7 w-7 text-xl bg-indigo-500 hover:bg-indigo-700 text-white capitalize'>+</button>
      </form>

      <div className=' mt-5 flex flex-col gap-3 overflow-scroll p-2 h-[200px]'>
        <ul className=' list-disc'>

        {todos?.map((todo, i)=>{
          return (
            <li className=' text-black py-1 px-3  flex justify-between ' key={i}>
              <p className=''>{todo.task}</p>
              <span className='flex gap-3 items-center'>

              {/* <FaCheck /> */}
              <FaTrash  onClick={()=>handleDelete(todo.id)}/>
              </span>


            </li>
          )
          
          
})

        }
        </ul>


      </div>

    </div>
    </div>
    </>
  )
}

export default Todo