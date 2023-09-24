import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import axios from "../../utils/axios";
import Loader from "./../../Shared/Loader";
import { toast } from "react-hot-toast";
import { optionName } from "../../utils/globalVariables";
const ShowQuestionSpecial = () => {
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [exams, setExams] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedExam, setSelectedExam] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [examType,setExamType] = useState(-1);
  const [singleExam,setSingleExam] = useState({})
  const [writtenQuestion,setWrittenQuestion] = useState({});
  const [bothStatus,setBothStatus] = useState(-1);
  
  const handleChangeCourse = (e) => {
    setSelectedSubject("");
    setSubjects([]);
    setExams("");
    setExams([]);
    setQuestions([]);
    setSelectedCourse(e.target.value);
    
  };

const bothStatusChanger = e =>{
  setQuestions([]);
  setWrittenQuestion({});
  setExamType(3);
  setBothStatus(parseInt(e.target.value));
}

const examTypeChanger = e =>{
  setQuestions([]);
  setWrittenQuestion({});
  setExamType(parseInt(e.target.value));
}

  useEffect(() => {
    setIsLoading(true);
    axios.get("/api/course/getallcourseadmin").then(({ data }) => {
      setCourses(data.courses);
      setIsLoading(false);
    });
    if (selectedCourse !== "" && examType!==-1) {
      axios
        .get(`/api/special/showspecialexambycourse?courseId=${selectedCourse}`)
        .then(({ data }) => {
          const sExams = data.filter(d=>d.examVariation===examType)
          setExams(sExams);
          if (data.length === 0) {
            toast.error("No Data");
          }
        setIsLoading(false);
        }).catch(e=>console.log(e))
        axios
        .get(`/api/subject/getsubjectbycourse?courseId=${selectedCourse}`)
        .then(({ data }) => {
          setSubjects(data.data);
          setIsLoading(false);
        }).catch(err=>console.log("subject fetching error"));
    } else {
      setSubjects([]);
    }
    if (selectedExam) {
      axios
        .get(`/api/special/showspecialexambyid?examId=${selectedExam}`)
        .then(({ data }) => {
          setSingleExam(data);
          
        })
        .catch((e) => console.log(e));
    } else {
      setSingleExam({});
    }
    
    if (selectedSubject) {      
      if(examType===1){
        axios
        .get(`/api/special/questionbyexamsub?examId=${selectedExam}&subjectId=${selectedSubject}`)
        .then(({ data }) => {
          console.log(data);
          setQuestions(data);
          setIsLoading(false);
        }).catch(e=>{
          setQuestions([]);
          toast.error(e.response.data);
        })

      }else if(examType===2){
        
        axios
        .get(`api/special/getwrittenquestionbyexamsub?examId=${selectedExam}&subjectId=${selectedSubject}`)
        .then(({ data }) => {
          console.log(data);
          setWrittenQuestion(data);
          setIsLoading(false);
        }).catch(e=>{
          setQuestions([]);
          setWrittenQuestion({});
          toast.error(e.response.data);
        })
      }else if(examType===3){
        if(bothStatus===1){
          axios
        .get(`/api/special/questionbyexamsub?examId=${selectedExam}&subjectId=${selectedSubject}`)
        .then(({ data }) => {
          console.log(data);
          setQuestions(data);
          setIsLoading(false);
        }).catch(e=>{
          setQuestions([]);
          toast.error(e.response.data);
        })
        }else{
          axios
        .get(`api/special/getwrittenquestionbyexamsub?examId=${selectedExam}&subjectId=${selectedSubject}`)
        .then(({ data }) => {
          console.log(data);
          setWrittenQuestion(data);
          setIsLoading(false);
        }).catch(e=>{
          setQuestions([]);
          setWrittenQuestion({});
          toast.error(e.response.data);
        })
        }
      }
      
    } else {
      setQuestions([]);
    }
  }, [selectedCourse, selectedSubject, selectedExam,examType,bothStatus]);
  return (
    <div className=" bg-white">
    <div className="flex w-full justify-center items-center py-5 px-2 my-5  ">
    <div className="bg-white  lg:w-2/3 py-2 flex flex-row justify-between items-center">
      <div className="form-control mr-2 w-1/5 ">
        <label className="label-text text-center font-semibold text-lg" htmlFor="">
          Select Course
        </label>
        <select
          name="course_list"
          id="course_list"
          className="input w-full border-black input-bordered"
          required
          onChange={(e) => handleChangeCourse(e)}
        >
          <option value="">---Select Course----</option>
          {courses.length > 0 &&
            courses.map(
              (course) =>
                course.name !== "Free" && (
                  <option key={course._id} value={course._id}>
                    {course.name}
                  </option>
                )
            )}
        </select>
      </div>
      <div className="form-control mr-2 w-1/5">
        <label className="label-text text-center font-semibold text-lg" htmlFor="">
          Select Type
        </label>
        <select
          name="exam_type"
          id="exam_type"
          className="input w-full border-black input-bordered"
          required
          onChange={(e) => examTypeChanger(e)}
        >
          <option value="">---Select Type---</option>
          <option value={1}>MCQ</option>
          <option value={2}>Written</option>
          <option value={3}>Both</option>
          
        </select>
      </div>
      <div className="form-control mr-2 w-1/5 ">
        <label className="label-text text-center font-semibold text-lg" htmlFor="">
          Select Exam
        </label>
        <select
          name="exams"
          id="exams"
          className="input w-full border-black input-bordered"
          required
          onChange={(e) => setSelectedExam(e.target.value)}
        >
          <option value="">---Select Exam---</option>
          {
            exams.length>0 && exams.map(exam=><option key={exam._id} value={exam._id}>{exam.name}</option>)
            
            
            }
          
        </select>
      </div>
      
      <div className="form-control mr-2 w-1/5 ">
        <label className="label-text text-center font-semibold text-lg" htmlFor="">
          Select Subject
        </label>
        <select
          name="subjects_options"
          id="subjects_options"
          className="input w-full border-black input-bordered"
          required
          onChange={(e) => setSelectedSubject(e.target.value)}
        >
          <option value="">---Select Subject---</option>
          {
            subjects?.filter(s=> singleExam?.allSubject?.includes(s._id)).map(sub=><option key={sub._id} value={sub._id}>{sub.name}</option>)
            
            }
          
        </select>
      </div>
      {
        examType===3 && <div className="form-control mr-2 w-1/5 ">
        <label className="label-text text-center font-semibold text-lg" htmlFor="">
          Select Type
        </label>
        <select
          name="both_type"
          id="both_type"
          className="input w-full border-black input-bordered"
          required
          onChange={(e) => bothStatusChanger(e)}
        >
        <option value="">---Select MCQ/Written---</option>
        <option value={1}>MCQ</option>
        <option value={2}>Written</option>
          
        </select>
      </div>
      }

    </div>
  </div>
      {isLoading && <Loader></Loader>}
      {exams.length > 0 && (
        <div className="overflow-x-auto px-0 lg:px-4">
         
          {
           ( questions.length>0 || writtenQuestion) && <table className="table w-full my-10 customTable">
            <thead>
              <tr>
                <th className="bg-white">Question </th>
                {
                  (examType===1 || (bothStatus===1 && examType===3)) && <th className="bg-white">Options</th>
                }
                {
                 (examType===1 || (bothStatus===1 && examType===3)) && <th className="bg-white">
                  Correct<br></br> Option
                </th>
                }
              {
                (examType===1 || (bothStatus===1 && examType===3)) && <th className="bg-white">Explanation </th>
              }
              {
               ( examType===2 || (bothStatus===2 && examType===3)) && <th className="bg-white">Marks By Questions</th>
              }
              </tr>
            </thead>
            <tbody>
            {
             ( examType===2 || (bothStatus===2 && examType===3)) && <tr>
              <td className="w-2/3">  <img
                src={
                  process.env.REACT_APP_API_HOST +
                  "/" +
                  writtenQuestion.writtenILink
                }
                alt="question"
              ></img>

              </td>
              <td>
                {
                  writtenQuestion?.marksPerQuestion?.map((mp,idx)=><span key={idx} className="mr-2 text-lg font-bold">{idx+1+') '+mp+''}</span>)
                }
              </td>
              </tr>
            }
              {  questions.map((question) => (
                  <tr key={question.questionId}>
                    
                    <td className="w-1/4">
                      {question.type === true ? (
                        question.question
                      ) : (
                        <img
                          src={
                            process.env.REACT_APP_API_HOST +
                            "/" +
                            question.question
                          }
                          alt="question"
                        ></img>
                      )}
                      
                    </td>
                    {
                      (examType===1 || (bothStatus===1 && examType===3)) && <td className="w-1/5">
                      {question.type !== false && (
                        <div className="grid grid-cols-1 lg:grid-cols-2">
                          {question.options.map((opt, idx) => {
                            return (
                              <div key={idx}>
                                <span className="text-x">
                                  {`${optionName[idx]})  ${opt}`}{" "}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </td>
                    }
                    {
                      (examType===1 || (bothStatus===1 && examType===3)) && <td className="w-[10px]">
                      {optionName[question.correctOption]}
                    </td>
                    }
                    {
                      (examType===1 || (bothStatus===1 && examType===3)) && <td className="w-1/4">
                      <img
                        src={
                          process.env.REACT_APP_API_HOST +
                          "/" +
                          question.explanation
                        }
                        alt=""
                      />
                    </td>
                    }
                  </tr>
                ))}
            </tbody>
          </table>
          }
        </div>
      )}
     
    </div>
  );
};

export default ShowQuestionSpecial;