import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import axios from "../../utils/axios";
import Loader from "./../../Shared/Loader";
import { toast } from "react-hot-toast";
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
const ViewResultSpecial = () => {
  const [exams, setExams] = useState([]);
  const [courses, setCourses] = useState([]);
  const [detailedExam,setDetailedExam] = useState([]);
  const [selectedExam, setSelectedExam] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState("");

  const handleChangeCourse = (e) => {
    setSelectedCourse(e.target.value);
    setDetailedExam([]);
    
  };

 

  useEffect(() => {
    setIsLoading(true);
    axios.get("/api/course/getallcourseadmin").then(({ data }) => {
      setCourses(data.courses);
      setIsLoading(false);
    }).catch(e=>console.log(e))
    if (selectedCourse !== "") {
      axios
      .get(`/api/special/showspecialexambycourse?courseId=${selectedCourse}`)
      .then(({ data }) => {
        setExams(data);
        if (data.length === 0) {
          toast.error("No Data");
        }
        setIsLoading(false);
      })
      .catch((e) => toast.error(e.response.data));
    } else {
      setExams([]);
    }
 
    if (selectedExam !== "") {
        axios
          .get(`/api/special/getallrank?examId=${selectedExam}`)
          .then(({ data }) => {
            console.log(data);
            setDetailedExam(data);
            setIsLoading(false);
          }).catch(e=>{
            toast.error(e.response.data);
            setDetailedExam([]);
          })
      } else {
          setDetailedExam([]);
      }
  }, [selectedCourse, selectedExam]);
  return (
    <div className=" bg-white  min-h-[800px]">
       <div className=" py-4 px-2 my-3 ">
        <div className=" w-full lg:w-2/3 mx-auto flex flex-row justify-evenly items-center">
          <div className="form-control">
            <label className="label-text" htmlFor="">
              Select Course
            </label>
            <select
              name="course_list"
              id="course_list"
              className="input w-full border-black input-bordered"
              required
              onChange={(e) => handleChangeCourse(e)}
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
            <label className="label-text" htmlFor="">
              Select Exam Name
            </label>
            <select
              name="exam_list"
              id="exam_list"
              className="input w-full border-black input-bordered"
              required
              onChange={(e) => setSelectedExam(e.target.value)}
            >
              <option value=""></option>
              {exams.length > 0 &&
                exams.map((exam) => (
                  <option key={exam._id} value={exam._id}>
                    {exam.name}
                  </option>
                ))}
            </select>
          </div>
        </div>        
      </div>
      {isLoading && <Loader></Loader>}
      {detailedExam?.length > 0 && (
        <div className="overflow-x-auto pt-1 pb-8 px-4">
             <ReactHTMLTableToExcel
                    id="test-table-xls-button"
                    className="download-table-xls-button btn bg-button hover:bg-gradient-to-r from-[#616161] from-0% to=[#353535] to-100% mr-2 mb-3 lg:mb-0 text-white"
                    table="table-to-xls"
                    filename="tablexls"
                    sheet="tablexls"
                    buttonText="Download as XLS"/>
        <table className="overflow-x-scroll table-fixed w-full customTable" id="table-to-xls">
          <thead>
            <tr className="text-center">
              <th className="py-5 w-[80px]">Sl No.</th>
              <th className="w-[160px]">Student Name</th>
              <th className="py-5 w-[180px]">Mobile Number</th>
              <th className="py-5 w-[180px]">Full Mobile Number</th>
              <th className="w-[160px]">Institution</th>
              <th className="w-[100px]">MCQ</th>
              <th className="w-[100px]">Written</th>
              <th className="w-[160px]">Marks</th>
              <th className="w-[110px]">Merit Postition</th>
            </tr>
          </thead>
          <tbody>
            {detailedExam ?
              detailedExam.map((data, index) => (
                <tr
                  key={index}
                  className="even:bg-table-row-even odd:bg-table-row-odd text-center "
                >
                  <td>{index + 1}</td>
                  <td>{data.studentName}</td>
                  <td>{data.mobileNo}</td>
                  <td>{data.mobileNoOrg}</td>
                  <td>{data.institution}</td>
                  <td>{data.totalObtaineMarksMcq + ' |' + data.totalMcqMarks}</td>
                  <td>{data.totalObtaineMarksWritten + ' |' + data.totalWrittenMarks}</td>
                  <td>{data.totalObtainedMarks +' | ' + data.totalMarks}</td>
                  <td>{data.rank +' | ' + data.totalStudent}</td>
                </tr>
              )) : (<tr><td colSpan={9}><p  className="my-2 text-3xl text-center font-bold text-red">No Data Found</p></td></tr>)}
          </tbody>
        </table>
      </div>
      )}
     
    </div>
  );
};

export default ViewResultSpecial;