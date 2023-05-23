import React from "react";
import axios from "../../utils/axios";
import { toast } from "react-hot-toast";
import {  useNavigate } from "react-router-dom";
const CreateCourse = () => {
    const navigate = useNavigate();
  const handleAddCourse = async (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.course.value;
    const descr = form.description.value;
    const course = {
      name,
      descr,
      status: true,
    };
    console.log(course);
    try {
      await axios
        .post("api/course/createcourse", course, {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          withCredentials: true,
        })
        .then(({ data }) => {
          toast.success("Course Added Successfully");
          navigate('/dashboard/courses/show')
          form.reset();
        });
    } catch (e) {
      toast.error(`${e.response.data.message}`)
    }
  };
  return (
    <div className="px-4 py-16 ">
      <div className=" w-full lg:w-1/2 py-10 mt-10 bg-white flex flex-col mx-auto  px-4 border border-white rounded-lg  shadow-lg ">
        <h1 className="text-3xl  font-bold text-center ">Add Course</h1>
        <div className="px-4 lg:px-20">
          <form onSubmit={handleAddCourse}>
            <div className="form-control">
              <label htmlFor="" className=" label">
                <span className="label-text">Course Name </span>
              </label>
              <input
                className="input input-bordered  border-black"
                type="text"
                name="course"
                id="course"
                placeholder="Course Name"
                required
              />
            </div>
            <div className="form-control">
              <label htmlFor="" className=" label">
                <span className="label-text">Description </span>
              </label>
              <textarea
                className="textarea textarea-info  border-black"
                name="description"
                id="description"
                placeholder="Description"
              ></textarea>
            </div>
            <div className="form-control mt-6">
              <input type="submit" value="Add" className="btn " />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateCourse;
