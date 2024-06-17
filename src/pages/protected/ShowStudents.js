import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import axios from "../../utils/axios";
import Loader from "./../../Shared/Loader";
import { toast } from "react-hot-toast";
import Pagination from "../../components/common/Pagination";

const ShowStudents = () => {
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagiNationData, setPagiNationData] = useState({});

  const handlePageClick = (event) => {
    let clickedPage = parseInt(event.selected) + 1;
    if (event.selected > 0) {
      axios
        .get(
          `/api/coursevsstudent/getstudentbycourse?courseId=${selectedCourse}&page=${clickedPage}`
        )
        .then(({ data }) => {
          setStudents(data.data);
          setPagiNationData(data.paginateData);
        })
        .catch((e) => {
          console.log(e);
          setPagiNationData({});
          setStudents([]);
          toast.error(e.response.data);
        });
    } else {
      axios
        .get(
          `/api/coursevsstudent/getstudentbycourse?courseId=${selectedCourse}&page=${1}`
        )
        .then(({ data }) => {
          setStudents(data.data);
          setPagiNationData(data.paginateData);
        })
        .catch((e) => {
          console.log(e);
          setPagiNationData({});
          setStudents([]);
          toast.error(e.response.data);
        });
    }
  };
  const handleChangeOption = e => {
    setSelectedCourse(e.target.value);
    setCurrentPage(1);
  }
  const setData = (id,password)=>{
    console.log(password);
    axios.post(`/api/student/changepassword?password=${password}&studentId=${id}` )
    .then(({ data }) => {
      toast.success("Password Reset Successfully");
      
    })
  }
  useEffect(() => {
    setIsLoading(true);
    axios.get("/api/course/getallcourseadmin").then(({ data }) => {
      setCourses(data.courses);
      setIsLoading(false);
    }).catch(e => console.log(e))
    if (selectedCourse !== "") {
      axios
        .get(
          `/api/coursevsstudent/getstudentbycourse?courseId=${selectedCourse}&page=${currentPage}`
        )
        .then(({ data }) => {
          setStudents(data.data);
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
    <div className="px-4">
      <div className=" py-4 px-2 my-3 w-full bg-white">
        <div className="flex flex-col justify-center items-center">
          <label className="label-text mr-3 font-semibold text-2xl" htmlFor="">
            Select Course
          </label>
          <select
            name="course_list"
            id="course_list"
            className="input border-black input-bordered mb-2"
            required
            onChange={(e) => handleChangeOption(e)}
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
      </div>
      {isLoading && <Loader></Loader>}

      {
        students.length > 0 && <div className="min-h-screen bg-red-800 py-5">
          <div className='overflow-x-auto w-full'>
            <table className='mx-auto   w-full whitespace-nowrap rounded-lg bg-white divide-y  overflow-hidden'>
              <thead>
                <tr>
                  <th className="bg-white font-semibold text-sm uppercase px-6 py-4"> Name</th>
                  <th className="bg-white font-semibold text-sm uppercase px-6 py-4">Registration Number</th>
                  <th className="bg-white font-semibold text-sm uppercase px-6 py-4">Mobile Number</th>
                  <th className="bg-white font-semibold text-sm uppercase px-6 py-4">Institution</th>
                  <th className="bg-white font-semibold text-sm uppercase px-6 py-4"> Roll</th>
                  <th className="bg-white font-semibold text-sm uppercase px-6 py-4"> Reset Password</th>
                </tr>
              </thead>
              <tbody>
                {students.length > 0 &&
                  students.map((student) => (
                    <tr key={student._id} className="even:bg-table-row-even odd:bg-table-row-odd text-center">
                      <td className="px-6 py-4 text-center">{student.studentId.name}</td>
                      <td className="px-6 py-4 text-center">{student.studentId.regNo}</td>
                      <td className="px-6 py-4 text-center">{student.studentId.mobileNo}</td>
                      <td className="px-6 py-4 text-center">{student.studentId.institution === null ? "N/A" : student.studentId.institution}</td>
                      <td className="px-6 py-4 text-center">{student.studentId.curriculumRoll === null ? "N/A" : student.studentId.curriculumRoll}</td>
                      <td className="px-6 py-4 text-center"><button className="btn" onClick={()=>setData(student.studentId._id,student.studentId.regNo)}>Reset Password</button></td>

                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      }
      {
        students.length > 0 && <div className="mb-6">
          {pagiNationData && (<Pagination pageCount={pagiNationData.totalPages} currentPage={pagiNationData.currentPage} handlePageClick={(e) => handlePageClick(e)} />)}
        </div>
      }
    </div>
  );
};

export default ShowStudents;
