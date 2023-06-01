import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import axios from "../../utils/axios";
import Loader from "./../../Shared/Loader";
import { toast } from "react-hot-toast";

const ShowUsers = () => {
  const[users,setUsers] = useState([]);
  const[getRole,setGetRole] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [singleuser, setSingleuser] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pagiNationData, setPagiNationData] = useState({});

  const updateuser = (id) => {
    console.log(id);
    setSingleuser(users.filter(us=>us._id===id)[0]);
  };
  const deactiveuser = (_id) => {
    axios.put(`api/user/deactivateuser`,{_id}).then(({ data }) => {
      toast.success("user Deactivation Successful");
      window.location.reload(false);
    });
  };
  const handleUpdate = e =>{
    e.preventDefault();
    const form = e.target;
    const name = form.name.value;
    const mobileNo = form.mobileNo.value;
    const address = form.address.value;
    const updateuser ={
        userId:singleuser._id,
        userName:singleuser.userName,
        name,mobileNo,address
    }
    axios.put("api/user/updateofficeuser",updateuser).then(({ data }) => {
        toast.success("user Update Successful");
        window.location.reload(false);
      }).catch(e=>console.log(e))
    document.getElementById('my-modal').checked = false;
  }
  useEffect(() => {
    setIsLoading(true);
    if(getRole!==""){
        axios.get(`api/user/getuserbyrole?role=${getRole}&page=${currentPage}`).then(({ data }) => {
            setUsers(data.user);
            setPagiNationData(data.paginaeData);
            setIsLoading(false);
          });
    }else{
        setIsLoading(false)
    }
  }, [getRole,currentPage]);
  return (
    <div className="">
      <div className=" py-4 px-2 lg:px-20 my-3">
        <label htmlFor="" className="label-text text-3xl font-semibold">Select Role</label>
        <select name="" id="" onChange={e=>setGetRole(e.target.value)} className="input  border-black input-bordered mb-3 ml-5">
            <option value=""></option>
            <option value="2">Moderators</option>
            <option value="3">Teachers</option>
        </select>
      </div>
      {isLoading && <Loader></Loader>}
      <div className="overflow-x-auto">
        {
          users.length>0 && <table className="table w-full customTable">
          <thead>
            <tr>
              <th className="bg-white">Name</th>
              <th className="bg-white">Mobile Number</th>
              <th className="bg-white">Username</th>
              <th className="bg-white">Address</th>
              {/* <th className="bg-white">Created Date</th> */}
              <th className="bg-white">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 &&
              users.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.mobileNo}</td>
                  <td>{user.userName}</td>
                  <td>{user.address}</td>
                  {/* <td>{user?.createdAt.split("T")[0]}</td> */}
                  <td>
                    <label
                      onClick={() => updateuser(user._id)}
                      htmlFor="my-modal"
                      className="btn bg-button hover:bg-gradient-to-r from-[#616161] from-0% to=[#353535] to-100% mr-2 text-white"
                    >
                      Update
                    </label>
                    <button
                      onClick={(e) => deactiveuser(user._id)}
                      className="btn"
                    >
                      Deactive
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        }
      </div>
      <div className="flex justify-center items-center mt-4 ">
        <div className="flex justify-center w-full px-4 lg:px-16">
          {pagiNationData?.totalPages > 1 &&
            [...Array(pagiNationData.totalPages).keys()].map((i) => {
              return (
                <button
                  key={i}
                  className="bg-button px-4 py-2 mr-2"
                  onClick={(e) => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              );
            })}
        </div>
      </div>
      <input type="checkbox" id="my-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg text-center">Update user</h3>
          <form onSubmit={e=>handleUpdate(e)}>
            <div className="form-control">
              <label htmlFor="" className=" label">
                <span className="label-text">user Name </span>
              </label>
              <input
                className="input input-bordered  border-black"
                type="text"
                name="name"
                id="name"
                placeholder="Name"
                defaultValue={singleuser.name}
              />
            </div>
            <div className="form-control">
              <label htmlFor="" className=" label">
                <span className="label-text">MobileNo </span>
              </label>
              <input
                className="textarea textarea-info  border-black"
                name="mobileNo"
                id="mobileNo"
                placeholder="Mobile"
                defaultValue={singleuser.mobileNo}
              />
            </div>
            <div className="form-control">
              <label htmlFor="" className=" label">
                <span className="label-text">Address </span>
              </label>
              <input
                className="textarea textarea-info  border-black"
                name="address"
                id="address"
                placeholder="Address"
                defaultValue={singleuser.address}
              />
            </div>
            <div className="form-control mt-6">
              <input type="submit" value="Update" className="btn " />
            </div>
          </form>
          <div className="modal-action">
            <label htmlFor="my-modal" className="btn bg-[red] text-white">
              Close!
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowUsers;
