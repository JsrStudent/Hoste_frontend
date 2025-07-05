import React, { useEffect, useState } from "react";
import { useNavigate,useParams } from 'react-router-dom';


const Details = () => {
   const { type } = useParams();
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(
      `http://localhost:4000/route/get/${type}/${JSON.parse(localStorage.getItem("user"))._id}`,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      }
    )
      .then((res) => res.json())
      .then((result) => {
        console.log(`Fetching data for ${type} complaints`, result.data.type);
        setData(result.data);
      });
  }, [type]);

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">
        {type.charAt(0).toUpperCase() + type.slice(1)} Complaints
      </h1>
      <div className="grid gap-6 max-w-4xl mx-auto">
        {data.map((item) => (
          <div key={item._id} className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Complaints for ID: <span className="text-blue-600">{item._id}</span>
            </h2>
            <div className="space-y-4">
              {item[type]?.map((complaint) => (
                <div
                  key={complaint._id}
                  className="border border-gray-300 rounded-lg p-4 bg-gray-50"
                >
                  {complaint.url && (
                    <div className="mb-4">
                      <img
                        src={complaint.url}
                        alt="Complaint Visual"
                        className="w-full h-64 object-cover rounded-md shadow-md"
                      />
                    </div>
                  )}
                  <p>
                    <span className="font-bold text-gray-700">Comments:</span>{" "}
                    {complaint.comments}
                  </p>
                  <p>
                    <span className="font-bold text-gray-700">Registration No:</span>{" "}
                    {complaint.regno}
                  </p>
                  <p>
                    <span className="font-bold text-gray-700">Room No:</span>{" "}
                    {complaint.roomno}
                  </p>
                  <p>
                    <span className="font-bold text-gray-700">Student ID:</span>{" "}
                    {complaint.student_id}
                  </p>
                  <p>
                    <span className="font-bold text-gray-700">Status:</span>{" "}
                    {complaint.status ? (
                      <span className="text-green-600 font-bold">Resolved</span>
                    ) : (
                      <span className="text-red-600 font-bold">Pending</span>
                    )}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Details;
