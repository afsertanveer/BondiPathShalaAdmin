import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import axios from "../../utils/axios";
import Loader from "../../Shared/Loader";
import { toast } from "react-hot-toast";

const AssignToCourse = () => {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const assignStudent = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const form = e.target;
    const file = form.student_file.files[0];
    const formdata = new FormData();
    formdata.append("excelFile", file);
    await axios
      .post(
        `/apicoursevsstudent/addstudenttocourse?courseId=${selectedCourse}`,
        formdata,
        {
          headers: {
            "Content-Type": "multipart/ form-data",
          },
        }
      )
      .then((data) => {
        console.log(data);
        toast.success("Assigned Students Successfully");
        form.reset();
        setIsLoading(false);
      });
  };
  useEffect(() => {
    setIsLoading(true);
    axios.get("/apicourse/getallcourseadmin").then(({ data }) => {
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
                <span className="text-md">Add Student File </span>
              </label>
              <input
                type="file"
                name="student_file"
                id="student_file"
                className="file-input mb-5 input input-bordered border-black pl-0"
                required
              />
            </div>
            <div className="form-control">
              <select
                name="course_list"
                id="course_list"
                className="input border-black input-bordered my-5"
                required
                onChange={(e) => setSelectedCourse(e.target.value)}
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

export default AssignToCourse;
