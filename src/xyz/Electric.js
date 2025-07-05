import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";

const Electric = () => {

    const[comment ,setcomment]=useState("");
    const[regno ,setregno]=useState("");
    const[roomno,setroomno]=useState("");
    const[url,seturl]=useState("");
    const[image,setimage]=useState("");
    const n=useNavigate();

    // validate function
    const validate=(data)=>{
        const{comment,regno,roomno}=data;

        if(!comment ||!regno||!roomno)return false;

        console.log(data);

        return true;

    }

    const submit_fun=async (e,req,res)=>{


        e.preventDefault();
        const data={
            comment,
            regno,
            roomno,
            url
        }


        if (validate(data)) {
          post_detail()
            .finally(() => {
              console.log("electric data before enterning",data);
              // This block will execute after `post_detail` completes (resolve or reject)
              fetch("http://localhost:4000/route/electric", {
                method: "post",
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": "Bearer " + localStorage.getItem("jwt"),
                },
                body: JSON.stringify({
                  comments: comment,
                  regno: regno,
                  roomno: roomno,
                  url:url
                }),
              })
                .then((res) => res.json())
                .then((data) => {
                  console.log("Data while entering electric:");
                  console.log(data);
                })
                .catch((err) => {
                  console.error("Error during fetch:", err);
                });
            });
        }
        
    }

    const post_detail=async ()=>{
      const data=new FormData();
      data.append("file",image);
      data.append("upload_preset","insta_clone")
      data.append("cloud_name","dx0lfkfrj")
      fetch("https://api.cloudinary.com/v1_1/dx0lfkfrj/image/upload", {
        method:"post",
        body:data
    }).then(res => res.json())
     .then((data) =>{
      seturl(data.url)
     } )
     .catch(error => console.log(error))
     console.log();
    
    }

    const loadfile = (event) => {
      var output = document.getElementById("output");
      console.log("upload documents",event.target.files[0]);
      console.log("url hai ye wala ",URL.createObjectURL(event.target.files[0]))
      output.src = URL.createObjectURL(event.target.files[0]);
      output.onload = function () {
        URL.revokeObjectURL(output.src); // free memory
      };
    }

  return (
    <div className="p-5 max-w-md mx-auto bg-white shadow-md rounded-md">
    {/* Post Header */}
    <div className="post-header flex justify-between items-center border-b pb-3 mb-4">
      <h4 className="text-xl font-bold">Create New Post</h4>
     
    </div>
  
    {/* Image Preview */}
    <div className="main-div text-center mb-6">
      <img
        id="output"
        src="https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-image-512.png"
        alt=""
        className="w-40 h-40 mx-auto object-cover rounded-md mb-3"
      />
      <input
        type="file"
        accept="image/*"
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        onChange={(event) => {
          loadfile(event);
          setimage(event.target.files[0]);
        }}
      />
    </div>
  
    {/* Input Form */}
    <form className="space-y-4">
      {/* Comment */}
      <div>
        <label
          htmlFor="comment"
          className="block text-sm font-medium text-gray-700"
        >
          Comment
        </label>
        <textarea
          id="comment"
          name="comment"
          placeholder="Enter your comment"
          rows="4"
          className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setcomment(e.target.value)}
        ></textarea>
      </div>
  
      {/* Registration Number */}
      <div>
        <label
          htmlFor="regNo"
          className="block text-sm font-medium text-gray-700"
        >
          Registration Number
        </label>
        <input
          type="text"
          id="regNo"
          name="regNo"
          placeholder="Enter Registration Number"
          className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setregno(e.target.value)}
        />
      </div>
  
      {/* Room Number */}
      <div>
        <label
          htmlFor="roomNum"
          className="block text-sm font-medium text-gray-700"
        >
          Room Number
        </label>
        <input
          type="text"
          id="roomNum"
          name="roomNum"
          placeholder="Enter Room Number"
          className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setroomno(e.target.value)}
        />
      </div>
  
      {/* Submit Button */}
      <div>
        <button
          type="button"
          className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={submit_fun}
        >
          Submit
        </button>
      </div>
    </form>
  </div>
  
  )
}

export default Electric
