import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import axios from "../../utils/axios";
import Loader from "./../../Shared/Loader";
import { Link } from "react-router-dom";
import v2 from "../../assets/img/icons/eye.svg";
import { toast } from "react-hot-toast";
import Pagination from "../../components/common/Pagination";
const WrittenExamDetails = () => {
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [exams, setExams] = useState([]);
  const [detailedExam,setDetailedExam] = useState([]);
  const [examInfo,setExamInfo] = useState({});
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedExam, setSelectedExam] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage,setCurrentPage] = useState(1);
  const [pagiNationData,setPagiNationData] = useState({});
  
 
  const handleChangeCourse = (e) => {
    setSelectedSubject("");
    setSubjects([]);
    setExams("");
    setExams([]);
    setSelectedCourse(e.target.value);
    setDetailedExam([]);
    
  };

  const handleChangeSubject = (e) => {
    setSelectedSubject(e.target.value);
    setSelectedExam("");
    setExams([]);
    setDetailedExam([]);
  };


  const handlePageClick = (event) => {
    let clickedPage = parseInt(event.selected) + 1;
    if (event.selected > 0) {
      axios
        .get(`/api/student/gethistorybywrittenid?examId=${selectedExam}&page=${clickedPage}`)
        .then(({ data }) => {
          console.log(data);
          setDetailedExam(data?.data);
          setExamInfo(data.examInfo)
          setPagiNationData(data.paginateData);
          setIsLoading(false);
        }).catch(e=>{
          toast.error(e.response.data);
          setDetailedExam([]);
        })
    } else {
      axios
      .get(`/api/student/gethistorybywrittenid?examId=${selectedExam}&page=${1}`)
      .then(({ data }) => {
        console.log(data);
        setDetailedExam(data?.data);
        setExamInfo(data.examInfo)
        setPagiNationData(data.paginateData);
        setIsLoading(false);
      }).catch(e=>{
        toast.error(e.response.data);
        setDetailedExam([]);
      })
    }
  };

  useEffect(() => {
    setIsLoading(true);
    axios.get("/api/course/getallcourseadmin").then(({ data }) => {
      setCourses(data.courses);
      setIsLoading(false);
    }).catch(e=>console.log(e))
    if (selectedCourse !== "") {
      axios
        .get(`/api/subject/getsubjectbycourse?courseId=${selectedCourse}`)
        .then(({ data }) => {
          setSubjects(data.data);
          setIsLoading(false);
        }).catch(e=>{
          console.log(e);
          setIsLoading(false);
        })
    } else {
      setSubjects([]);
    }
    if (selectedSubject !== "") {
      axios
        .get(`/api/exam/getwrittenBySub?subjectId=${selectedSubject}`)
        .then(({ data }) => {
          setExams(data);
          setIsLoading(false);
        }).catch(e=>{
          console.log(e)
          setIsLoading(false);
        })
    } else {
      setExams([]);
    }
    if (selectedExam !== "") {
      axios
        .get(`/api/student/gethistorybywrittenid?examId=${selectedExam}&page=${currentPage}`)
        .then(({ data }) => {
          console.log(data);
          setDetailedExam(data?.data);
          setExamInfo(data.examInfo)
          setPagiNationData(data.paginateData);
          setIsLoading(false);
        }).catch(e=>{
          toast.error(e.response.data);
          setDetailedExam([]);
        })
    } else {
        setDetailedExam([]);
        setExamInfo({});
    }
  }, [selectedCourse, selectedSubject, selectedExam,currentPage]);
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
                  <option key={subject._id} value={subject._id}>
                    {subject.name}
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
        <table className="overflow-x-scroll table-fixed w-full customTable">
          {/* head */}
          <thead>
            <tr className="text-center">
              <th className="py-5 w-[80px]">Sl No.</th>
              <th className="py-5 w-[180px]">Name</th>
              <th className="py-5 w-[180px]">Registration Number</th>
              <th className="py-5 w-[180px]">Mobile Number</th>
              {/* <th className="w-[160px]">Start Time</th> */}
              {/* <th className="w-[160px]">End Time</th> */}
              <th className="w-[160px]">Title</th>
              <th className="w-[160px]">Subject</th>
              <th className="w-[160px]">D/W/M</th>
              <th className="w-[160px]">Exam Type</th>
              <th className="w-[90px]">Marks</th>
              <th className="w-[110px]">Merit Postition</th>
              <th className="w-[200px]">Action</th>
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
                  <td>{data.examStud.studentId.name}</td>
                  <td>{data.examStud.studentId.regNo}</td>
                  <td>{data.examStud.studentId.mobileNo}</td>
                  {/* <td>{subtractHours(new Date(examInfo.startTime)).toString().split("GMT")[0]}</td> */}
                  {/* <td>{subtractHours(new Date(examInfo.endTime)).toString().split("GMT")[0]}</td> */}
                  <td>{examInfo.name}</td>
                  <td>{examInfo.subjectName}</td>
                  <td>{examInfo.variation}</td>
                  <td>{examInfo.type}</td>
                  <td>{data.totalObtainedMarks ?? 0}/{examInfo.totalMarks}</td>
                   <td>{data.meritPosition==="-1"? "Pending" : data.meritPosition}</td> 
                  <td>
                    <div className="flex px-2 justify-evenly">
                      <Link to={`/dashboard/exams/${data.studentId}/${examInfo.id}/solution`} className="tooltip bg-color-two rounded-full text-center h-[38px] w-[38px]" data-tip="Get Solution">
                        <img className="inline-flex img p-2" src={v2} alt="view-solution" />
                      </Link>
                    </div>
                  </td>
                </tr>
              )) : (<tr><td colSpan={9}><p  className="my-2 text-3xl text-center font-bold text-red">No Data Found</p></td></tr>)}
          </tbody>
        </table>
        <div className="flex justify-center items-center mt-4 ">
        <div className="mb-6">
          {pagiNationData && (<Pagination pageCount={pagiNationData.totalPages} currentPage={pagiNationData.currentPage} handlePageClick={(e) => handlePageClick(e)} />)}
        </div>
      </div>
      </div>
      )}
     
    </div>
  );
};

export default WrittenExamDetails;