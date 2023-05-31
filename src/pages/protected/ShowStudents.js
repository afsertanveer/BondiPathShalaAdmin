import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import axios from "../../utils/axios";
import Loader from "./../../Shared/Loader";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";

const ShowStudents = () => {
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);


  const handleChange = e =>{
        if(e.target.value!==""){
      axios.get(`/api/coursevsstudent/getstudentbycourse?courseId=${e.target.value}`).then(({data})=>{
        console.log(data.data)
        setStudents(data.data);
    }).catch(e=>{
      console.log(e);
      toast.error(e.response.data);
      setStudents([]);
    })
    }else{
      setStudents([]);
    }
  }
  
  useEffect(() => {
    setIsLoading(true);
    axios.get("api/course/getallcourse?status=true").then(({ data }) => {
      setCourses(data.courses);
      setIsLoading(false);
    });
}, []);
  return (
    <div className="">
      <div className=" py-4 px-2 my-3">
        <label className="label-text" htmlFor="">Select Course</label>
        <select
                name="course_list"
                id="course_list"
                className="input border-black input-bordered my-5"
                required
                onChange={e=>handleChange(e)}
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
      {isLoading && <Loader></Loader>}
      {
        students?.length>0 && <div className="overflow-x-auto">
        <table className="table w-full compact customTable">
          <thead>
            <tr>
              <th className="bg-white">Subject Name</th>
              <th className="bg-white">Registration Number</th>
              <th className="bg-white">Mobile Number</th>
              <th className="bg-white">Action</th>
            </tr>
          </thead>
          <tbody>
            {students.length > 0 &&
              students.map((student) => (
                <tr key={student._id}>
                  <td>{student.studentId.name}</td>
                  <td>{student.studentId.regNo}</td>
                  <td>{student.studentId.mobileNo}</td>
                 <td>
                    <Link to={`/dashboard/students/${student.studentId._id}/history`} className="btn bg-button text-white">Exam History</Link>
                 </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      }
      
    </div>
  );
};

export default ShowStudents;
