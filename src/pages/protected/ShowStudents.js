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
  const [selectedCourse, setSelectedCourse] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagiNationData, setPagiNationData] = useState({});

  const handleStudents = e =>{
    e.preventDefault();
    const rgn = e.target.rgn_number.value;
    console.log(rgn);
    axios.get(`api/student/getstudentbycoursereg?courseId=${selectedCourse}&regNo=${rgn}`).then(({data})=>{
      console.log(data);
      setStudents([]);
      let newStudent = [];
      newStudent.push(data);
      setStudents(newStudent);
    })
  }
  useEffect(() => {
    setIsLoading(true);
    axios.get("api/course/getallcourse?status=true").then(({ data }) => {
      setCourses(data.courses);
      setIsLoading(false);
    }).catch(e=>console.log(e))
    if (selectedCourse !== "") {
      axios
        .get(
          `/api/coursevsstudent/getstudentbycourse?courseId=${selectedCourse}&page=${currentPage}`
        )
        .then(({ data }) => {
          setStudents(data.data);
          console.log(data.data);
          setPagiNationData(data.paginateData);
        })
        .catch((e) => {
          console.log(e);
          setPagiNationData({});
          setStudents([]);
          toast.error(e.response.data);
        });
    } else {
      setPagiNationData({});
      setStudents([]);
    }
  }, [selectedCourse, currentPage]);
  return (
    <div className="">
      <div className=" py-4 px-2 my-3">
        <label className="label-text mr-3" htmlFor="">
          Select Course
        </label>
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
      {isLoading && <Loader></Loader>}
      {students?.length > 0 && (
        <div className="overflow-x-auto">
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
                      <Link
                        to={`/dashboard/students/${student.studentId._id}/history`}
                        className="btn bg-button text-white"
                      >
                        Exam History
                      </Link>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
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
    </div>
  );
};

export default ShowStudents;
