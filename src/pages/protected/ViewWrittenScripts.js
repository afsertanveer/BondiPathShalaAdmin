

import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import axios from "../../utils/axios";
import Loader from "./../../Shared/Loader";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import Pagination from "../../components/common/Pagination";

const ViewWrittenScripts = () => {
    const [courses, setCourses] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [exams, setExams] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState("");
    const [selectedSubject, setSelectedSubject] = useState("");
    const [selectedExam, setSelectedExam] = useState("");
    const [writtenData,setWrittenData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [pagiNationData, setPagiNationData] = useState({});
    const user =JSON.parse(localStorage.getItem('user')) ;
    const role = user.role;
 
    const handleChangeCourse = (e) => {
      setSelectedSubject("");
      setSubjects([]);
      setExams("");
      setExams([]);
      setSelectedCourse(e.target.value);
      
    };
  
    const handleChangeSubject = (e) => {
      setSelectedSubject(e.target.value);
      setSelectedExam("");
      setExams([]);
    };
 
    const handlePageClick = (event) => {
        let clickedPage = parseInt(event.selected) + 1;
        let url;
        if(role===3){
          url = "/api/teacher/getstudentdata";
        }else{
          url ="api/student/getwrittenstudentallbyexam";
        }
        if (event.selected > 0) {
          axios
          .get(
            `${url}?examId=${selectedExam}&page=${clickedPage}`
          )
          .then(({ data }) => {
            setWrittenData(data.data1);
            setPagiNationData(data.paginateData);
          })
          .catch((e) => {
            console.log(e);
            setPagiNationData({});
            setWrittenData([]);
            toast.error(e.response.data);
          });
        } else {
          axios
          .get(
            `${url}?examId=${selectedExam}&page=${1}`
          )
          .then(({ data }) => {
            setWrittenData(data.data1);
            setPagiNationData(data.paginateData);
          })
          .catch((e) => {
            console.log(e);
            setPagiNationData({});
            setWrittenData([]);
            toast.error(e.response.data);
          });
        }
      };
  
    useEffect(() => {
      setIsLoading(true);
      const resultData = JSON.parse(localStorage.getItem('writtenData')) || []
      const paginateData = JSON.parse(localStorage.getItem('writtenDataPagination')) || {}
      // console.log(resultData,paginateData)
      if(resultData.length>0){
        setWrittenData(resultData)
        setPagiNationData(paginateData)
        setIsLoading(false);
      }
      axios.get("/api/course/getallcourseadmin").then(({ data }) => {
        setCourses(data.courses);
        setIsLoading(false);
      });
      if (selectedCourse !== "") {
        axios
          .get(`/api/subject/getsubjectbycourse?courseId=${selectedCourse}`)
          .then(({ data }) => {
            setSubjects(data.data);
            setIsLoading(false);
          }).catch(e=>console.log(e))
      } else {
        setSubjects([]);
      }
      if (selectedSubject !== "") {
        axios
          .get(`/api/exam/getExamBySub?subjectId=${selectedSubject}&&examType=2`)
          .then(({ data }) => {
            const newData = data.filter(d=>d.examVariation===2);
            setExams(newData);
            setIsLoading(false);
          }).catch(e=>console.log(e))
      } else {
        setExams([]);
      }
      if (selectedExam !== "") {
        if(role===3){
          axios
          .get(`/api/teacher/getstudentdata?examId=${selectedExam}`)
          .then(({ data }) => {
            if(data.data1.length===0){
              toast.success("No Data found!")
            }else{

              setWrittenData(data.data1)
              localStorage.setItem("writtenData",JSON.stringify(data.data1))
              localStorage.setItem("writtenDataPagination",JSON.stringify(data.paginateData))
            }
            setPagiNationData(data.paginateData)
            setIsLoading(false);
          }).catch(e=>{
            setWrittenData([])
            setPagiNationData({})
            toast.error(e.response.data);
          })
        }else{
          axios
          .get(`api/student/getwrittenstudentallbyexam?examId=${selectedExam}`)
          .then(({ data }) => {
            if(data.data1.length===0){
              toast.success("No Data found!")
            }else{

              setWrittenData(data.data1)
            }
            setPagiNationData(data.paginateData)
            setIsLoading(false);
          }).catch(e=>{
            setWrittenData([])
            setPagiNationData({})
            toast.error(e.response.data);
          })
        }
        
      } else {
        setWrittenData([])
            setPagiNationData({})
      }
    }, [selectedCourse, selectedSubject, selectedExam,role]);
  return (
    <div className="mx-auto">
        <div className="bg-white py-4 px-2 my-3 ">
        <div className="w-full  mx-auto grid grid-cols-1 lg:grid-cols-3 gap-3">
          <div className="form-control">
            <label className="label-text text-center" htmlFor="">
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
                  <option className="text-center" key={course._id} value={course._id}>
                    {course.name}
                  </option>
                ))}
            </select>
          </div>
          <div className="form-control">
            <label className="label-text text-center" htmlFor="">
              Select Subject
            </label>
            <select
              name="course_list"
              id="course_list"
              className="input w-full border-black input-bordered"
              required
              onChange={(e) => handleChangeSubject(e)}
            >
              <option value=""></option>
              {subjects?.length > 0 &&
                subjects.map((subject) => (
                  <option className="text-center" key={subject._id} value={subject._id}>
                    {subject.name}
                  </option>
                ))}
            </select>
          </div>
          <div className="form-control">
            <label className="label-text text-center" htmlFor="">
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
                  <option className="text-center" key={exam._id} value={exam._id}>
                    {exam.name}
                  </option>
                ))}
            </select>
          </div>
        </div>
      </div>
      {isLoading && <Loader></Loader>}
      {writtenData && writtenData.length>0 && (
        <div className="overflow-x-auto w-full">        
          <table className="mx-auto w-full whitespace-nowrap rounded-lg  divide-y  overflow-hidden">
            <thead>
              <tr>
                <th className="bg-white font-semibold text-sm uppercase px-6 py-4">
                  SI No.
                </th>
                <th className="bg-white font-semibold text-sm uppercase px-6 py-4">
                  Student Name
                </th>
                <th className="bg-white font-semibold text-sm uppercase px-6 py-4">
                 Total Marks
                </th>
                <th className="bg-white font-semibold text-sm uppercase px-6 py-4">
                 Total Questions
                </th>
                <th className="bg-white font-semibold text-sm uppercase px-6 py-4">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {
                writtenData.length>0 && writtenData.map((wd,idx)=>{
                    return <tr key={idx} className="bg-white">
                        <td>{idx+1}</td>
                        <td>{wd.studentName}</td>
                        <td>{wd.totalMarks}</td>
                        <td>{wd.totalQuestions}</td>
                        <td>
                            <Link to={`/dashboard/${selectedExam}/checkanswer/${wd.studentId}`}   className="text-red font-bold">Check </Link>
                        </td>

                    </tr>
                })
              }
            </tbody>
          </table>
        </div>
      )}
      <div className="mb-6">
          {pagiNationData.totalPages>1 && (<Pagination pageCount={pagiNationData.totalPages} currentPage={pagiNationData.currentPage} handlePageClick={(e) => handlePageClick(e)} />)}
        </div>
    </div>
  );
};

export default ViewWrittenScripts;
