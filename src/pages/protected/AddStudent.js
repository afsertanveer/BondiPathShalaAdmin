import React from "react";
import axios from "../../utils/axios";
import { toast } from 'react-hot-toast';

const AddStudent = () => {
  const AddStudents = async (e) => {
    e.preventDefault();
    const form = e.target;
    const file = e.target.student_file.files[0];
    const formData = new FormData();
    formData.append("excelFile",file);
    console.log(file);
    try {
        await axios
          .post("api/student/addstudent", formData, {
            headers: {
              "Content-Type": "multipart/ form-data",
            }})
          .then(data => {
            toast.success("Students Added Successfully");
            form.reset();
            
          }).catch(e=>console.log(e))
      } catch (e) {
        toast.error(`${e.response.data.message}`)
        console.log(e);
      }
    }

    
  return (
    <div className="px-4 lg:px-10 py-10 lg:py-20">
      <div className="w-full lg:w-1/2 py-10 mt-10 bg-white flex flex-col mx-auto  px-4 border border-white rounded-lg  shadow-lg ">
        <h1 className="text-3xl  font-bold text-center">Add Student</h1>
        <div className="px-4 lg:px-20">
          <form onSubmit={AddStudents}>
            <div className="form-control">
              <label htmlFor="" className=" label">
                <span className="label-text mb-2">Add Student File </span>
              </label>
              <input
                type="file"
                name="student_file"
                id="student_file"
                className="file-input w-full max-w-xs mb-2 input input-bordered border-black pl-0"
              />
            </div>
            <div className="form-control">
              <input
                type="submit"
                value="Upload File"
                className="btn w-[150px]"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddStudent;
