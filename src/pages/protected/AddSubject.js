import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import axios from "../../utils/axios";
import Loader from "../../Shared/Loader";
import { toast } from "react-hot-toast";

const AddSubject = () => {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const assignStudent = async (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.subject.value;
    const descr = form.description.value;
    const file = form.iLink.files[0];
    const formdata = new FormData();
    formdata.append("iLink", file);
    const subject = {
      name,
      descr,
      courseId: selectedCourse
    }
    formdata.append('name', name);
    formdata.append('descr', descr);
    formdata.append('courseId', selectedCourse);
    // console.log(subject,file);
    await axios.post(`/api/subject/createsubject`, formdata, {
      headers: {
        "Content-Type": "multipart/form-data",
      }
    }).then(({ data }) => {
      toast.success(data.message);
      form.reset();
    })
  };
  useEffect(() => {
    setIsLoading(true);
    axios.get("api/course/getallcourse?status=true").then(({ data }) => {
      setCourses(data.courses);
      setIsLoading(false);
    });
  }, []);
  return (
    <div>
      <div className="w-full lg:w-1/2 py-10 mt-10 bg-white flex flex-col mx-auto  px-4 border border-white rounded-lg  shadow-lg ">
        <h1 className="text-3xl  font-bold text-center">
          Assing Student To Course
        </h1>
        {isLoading && <Loader></Loader>}
        <div className="px-4 lg:px-20">
          <form onSubmit={assignStudent}>
            <div className="form-control">
              <label htmlFor="" className=" label">
                <span className="label-text">Subject Name </span>
              </label>
              <input
                className="input input-bordered  border-black"
                type="text"
                name="subject"
                id="subject"
                placeholder="Subject Name"
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
            <div className="form-control">
              <label htmlFor="" className=" label">
                <span className="text-md">Subject Image </span>
              </label>
              <input
                type="file"
                name="iLink"
                id="iLink"
                className="file-input mb-5 input input-bordered border-black pl-0"
                required
              />
            </div>
            <div className="form-control">
              <label className="label-text" htmlFor="">Select Course</label>
              <select
                name="course_list"
                id="course_list"
                className="input border-black input-bordered my-5"
                required
                onChange={e => setSelectedCourse(e.target.value)}
              >
                <option value=""></option>
                {courses.length > 0 &&
                  courses.map((course) => (
                    <option key={course._id} value={course._id}>
                      {course.name}
                    </option>
                  ))}
              </select>
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

export default AddSubject;
