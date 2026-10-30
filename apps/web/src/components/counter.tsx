'use client'
 
import { useState } from 'react'
 
export function Counter() {
  const [count, setCount] = useState(0)
  
  return (
    <button
      type="button"
      onClick={() => setCount(count + 1)}
      className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
    >
      Count: {count}
    </button>
  )
}