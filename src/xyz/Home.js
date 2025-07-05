import React from 'react'
import { Link ,useNavigate} from 'react-router-dom'
const Home = () => {
  const navigate = useNavigate();

  const handleNavigation = (type) => {

    navigate(`/form/${type}`);
  };
  const view=(type)=>{
    navigate(`/det/${type}`)
  }
  return (
    <div>
      <h1 >This is home page</h1>
      <h1>LAptop  page</h1>


      <div className=''>
       
      <button
        className="p-2 bg-slate-800 text-white rounded-md"
        onClick={() => handleNavigation('electrict')}
      >
        Electric
      </button>
      <button
        className="p-2 bg-slate-800 text-white rounded-md"
        onClick={() => handleNavigation('internet')}
      >
        Internet
      </button>
      <button
        className="p-2 bg-slate-800 text-white rounded-md"
        onClick={() => handleNavigation('room')}
      >
        Room
      </button>
      </div>


      <div>  <p>This is another buttom to sghow the content of yours </p></div>

      <h1 className="text-3xl font-bold text-center mb-8">Complaint Management</h1>
      <div className="flex justify-center gap-4">
        <button
          className="p-2 bg-slate-800 text-white rounded-md"
          onClick={() => view('electrict')}
        >
          View Electric Complaints
        </button>
        <button
          className="p-2 bg-slate-800 text-white rounded-md"
          onClick={() => view('internet')}
        >
          View Internet Complaints
        </button>
        <button
          className="p-2 bg-slate-800 text-white rounded-md"
          onClick={() => view('room')}
        >
          View Room Complaints
        </button>
      </div>

    </div>
  )
}

export default Home
