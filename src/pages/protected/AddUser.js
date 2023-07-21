import React, { useState } from "react";
import axios from "../../utils/axios";
import { toast } from "react-hot-toast";

const AddUser = () => {
  const [getPassword, setGetPassword] = useState("");
  const [getRole, setGetRole] = useState(-1);
  const addOfficer = async (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value;
    const password = form.password.value;
    const userName = form.username.value;
    const address = form.address.value;
    const mobileNo = form.mobile_number.value;
    const user = {
        name,userName,address,mobileNo,password,
        role:getRole
    }
    try {
      await axios
        .post("/api/user/createofficeuser", user)
        .then((data) => {
          toast.success("User Added Successfully");
          form.reset();
          setGetPassword("");
        })
        .catch((e) => console.log(e));
    } catch (e) {
      toast.error(`${e.response.data.message}`);
      console.log(e);
    }
  };

  return (
    <div className="px-4 lg:px-10 py-10 lg:py-20">
      <div className="w-full lg:w-1/2 py-10 mt-10 bg-white flex flex-col mx-auto  px-4 border border-white rounded-lg  shadow-lg ">
        <h1 className="text-3xl  font-bold text-center">Add User</h1>
        <div className="px-4 lg:px-20">
          <form className="add-form" onSubmit={addOfficer}>
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="form-control">
                <label htmlFor="" className=" label">
                  <span className="label-text font-semibold mb-2">Name </span>
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Enter Name"
                  className="input w-full max-w-xs mb-2  input-bordered border-black"
                  required
                />
              </div>
              <div className="form-control">
                <label htmlFor="" className=" label">
                  <span className="label-text font-semibold mb-2">
                    Mobile Number{" "}
                  </span>
                </label>
                <input
                  type="text"
                  name="mobile_number"
                  id="mobile_number"
                  placeholder="Enter Mobile Number"
                  className="input w-full max-w-xs mb-2  input-bordered border-black"
                  required
                />
              </div>
            </div>
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="form-control">
                <label htmlFor="" className=" label">
                  <span className="label-text font-semibold mb-2">
                    Username{" "}
                  </span>
                </label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  placeholder="Enter userame"
                  className="input w-full max-w-xs mb-2  input-bordered border-black"
                  onChange={(e) => setGetPassword(e.target.value)}
                  required
                />
              </div>
              <div className="form-control">
                <label htmlFor="" className=" label">
                  <span className="label-text font-semibold mb-2">
                    Password
                  </span>
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  className="input w-full max-w-xs mb-2  input-bordered border-black"
                  defaultValue={getPassword}
                  readOnly
                />
              </div>
            </div>

            <div className="form-control">
              <label htmlFor="" className=" label">
                <span className="label-text font-semibold mb-2">Address </span>
              </label>
              <input
                type="text"
                name="address"
                id="address"
                placeholder="Enter Address"
                className="input w-full  mb-2  input-bordered border-black"
                required
              />
            </div>
            <div className="form-control">
              <label htmlFor="" className=" label">
                <span className="label-text font-semibold mb-2">
                  Select Role{" "}
                </span>
              </label>
              <select
                name=""
                id=""
                className="input  border-black input-bordered mb-3"
                onChange={e=>setGetRole(e.target.value)}
                required
              >
                <option value="">--Select Role--</option>
                <option value="2">Moderator</option>
                <option value="3">Teacher</option>
              </select>
            </div>
            <div className="form-control flex justify-center items-center">
              <input type="submit" value="Add User" className="btn w-[100px]" />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddUser;
