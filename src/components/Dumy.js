import React from 'react'
import { Link } from 'react-router-dom'

const Dumy = () => {
  return (
    <div>
      <p>Hey this s dumy page </p>

      <div className='bg-red-300 w-12'> this </div>
      <button><Link to="/h">Click</Link></button>
    </div>
  )
}

export default Dumy
