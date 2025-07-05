import React, { useState } from 'react';
import { useNavigate,useParams } from 'react-router-dom';

const Complain = () => {

    // const n=useNavigate();
    const { type } = useParams();
  const [comment, setComment] = useState('');
  const [regno, setRegno] = useState('');
  const [roomno, setRoomno] = useState('');
  const [url, setUrl] = useState('');
  const [image, setImage] = useState('');
  const n= useNavigate()
  // Validate function
  const validate = (data) => {
    const { comment, regno, roomno } = data;
    if (!comment || !regno || !roomno) return false;
    return true;
  };

  // Submit function
  const submit_fun = async (e,req,res) => {
    console.log(" i ma in complain box ",type);
    e.preventDefault();
    const data = { comment, regno, roomno, url };

    if (validate(data)) {
        post_detail()
          .finally(() => {
            console.log("electric data before enterning",data);
            // This block will execute after `post_detail` completes (resolve or reject)
            fetch(`http://localhost:4000/route/${type}`, {
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
                n("/h")
              })
              .catch((err) => {
                console.error("Error during fetch:", err);
              });
          });
      }
      
  }

  // Upload image
  const post_detail = async () => {
    const formData = new FormData();
    formData.append('file', image);
    formData.append('upload_preset', 'insta_clone');
    formData.append('cloud_name', 'dx0lfkfrj');
    return fetch('https://api.cloudinary.com/v1_1/dx0lfkfrj/image/upload', {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => setUrl(data.url))
      .catch((error) => console.log('Image upload error:', error));
  };

  return (
    <div className="p-5 max-w-md mx-auto bg-white shadow-md rounded-md">
      <div className="post-header flex justify-between items-center border-b pb-3 mb-4">
        <h4 className="text-xl font-bold">Submit {type} Complaint</h4>
      </div>
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
            const file = event.target.files[0];
            const output = document.getElementById('output');
            output.src = URL.createObjectURL(file);
            setImage(file);
          }}
        />
      </div>
      <form className="space-y-4">
        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700">
            Comment
          </label>
          <textarea
            id="comment"
            name="comment"
            placeholder="Enter your comment"
            rows="4"
            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setComment(e.target.value)}
          ></textarea>
        </div>
        <div>
          <label htmlFor="regNo" className="block text-sm font-medium text-gray-700">
            Registration Number
          </label>
          <input
            type="text"
            id="regNo"
            name="regNo"
            placeholder="Enter Registration Number"
            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setRegno(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="roomNum" className="block text-sm font-medium text-gray-700">
            Room Number
          </label>
          <input
            type="text"
            id="roomNum"
            name="roomNum"
            placeholder="Enter Room Number"
            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setRoomno(e.target.value)}
          />
        </div>
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
  );
};

export default Complain;
