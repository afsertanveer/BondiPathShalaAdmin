import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import axios from "../../utils/axios";
import Loader from "./../../Shared/Loader";
import { toast } from "react-hot-toast";
import DeactivateButton from "../../features/common/components/DeactivateButton";
import PopUpModal from "../../features/common/components/PopUpModal";
const ShowQuestions = () => {
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [exams, setExams] = useState([]);
  const [secondsubjects, setSecondSubjects] = useState([]);
  const [secondexams, setSecondExams] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedExam, setSelectedExam] = useState("");
  const [questionCourse, setQuestionCourse] = useState("");
  const [questionSubject, setQuestionSubject] = useState("");
  const [selectedQuestionId,setSelectedQuestionId] = useState("");
  const [questionExam, setQuestionExam] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const optionName = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
  ];
  const handleChangeCourse = (e) => {
    setSelectedSubject("");
    setSubjects([]);
    setExams("");
    setExams([]);
    setQuestions([]);
    setSelectedCourse(e.target.value);
    
  };
  const handleChangeSecondCourse = (e) => {
    setQuestionCourse(e.target.value);
    setSecondSubjects([]);
    setSecondExams([]);
    axios
      .get(`/api/subject/getsubjectbycourse?courseId=${e.target.value}`)
      .then(({ data }) => {
        setSecondSubjects(data.data);
        setIsLoading(false);
      }).catch(e=>console.log(e))
  };

  const handleChangeSubject = (e) => {
    setSelectedSubject(e.target.value);
    setSelectedExam("");
    setExams([]);
    setQuestions([]);
  };
  const handleChangeSecondSubject = (e) => {
    setQuestionSubject(e.target.value);
    setSecondExams([]);
    axios
      .get(`/api/exam/getExamBySub?subjectId=${e.target.value}`)
      .then(({ data }) => {
        console.log(data);
        setSecondExams(data);
        setIsLoading(false);
      }).catch(e=>console.log(e))
  };
  function arrayRemove(arr, value) {
    return arr.filter(function (ele) {
      return ele !== value;
    });
  }
  const setQuestionBulk = (e, id) => {
    let prev = [...selectedQuestions];
    if (document.getElementById(`select_question` + id).checked === true) {
      prev.push(id);
    } else {
      const index = prev.indexOf(id);
      if (index !== -1) {
        prev = arrayRemove(prev, id);
      }
    }
    setSelectedQuestions(prev);
  };

  const setQuestionBulkAll  =  () =>{
    let q = [];
    const allCheckboxes = document.getElementsByName("single_checbox");
    if (document.getElementById("all_check").checked === true) {
      for(let i = 0; i<questions.length;i++){
        q.push(questions[i].questionId);
      }
      for(let i = 0 ; i < allCheckboxes.length ; i++ ){
        allCheckboxes[i].checked = true;
      }
    }else{
      q=[]
      for(let i = 0 ; i < allCheckboxes.length ; i++ ){
        allCheckboxes[i].checked = false;
      }
    }
    setSelectedQuestions(q);
  }
  const sendQuestions = async(e) =>{
    e.preventDefault();
    const examId = questionExam;
    const questionSet = {
      examId,
      questionArray:selectedQuestions
    }
    await axios.put("/api/exam/addQuestionMcqBulk",questionSet).then(({data})=>{
      toast.success("Successfully added all the questions");
      e.target.reset();      
      document.getElementById("my-modal").checked = false;
      window.location.reload(false);
    }).catch(e=>console.log(e))
  }

  const removeQuestion = (questionId)=>{
     axios.put("/api/exam/updatequestionstatus",{questionId}).then(({data})=>{
      toast.success("Removed Successfuly");
      let prev = [...questions];
      prev = prev.filter(pr=>pr.questionId!==questionId);
      setQuestions(prev);
    }).catch(e=>console.log(e))
    
    document.getElementById("my-modal-1").checked = false;
    
  }

  useEffect(() => {
    setIsLoading(true);
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
        .get(`/api/exam/getExamBySub?subjectId=${selectedSubject}`)
        .then(({ data }) => {
          const newData = data.filter(d=>d.examVariation===1);
          setExams(newData);
          setIsLoading(false);
        }).catch(e=>console.log(e))
    } else {
      setExams([]);
    }
    if (selectedExam !== "") {
      axios
        .get(`/api/exam/questionbyexamid?examId=${selectedExam}`)
        .then(({ data }) => {
          setQuestions(data);
          setIsLoading(false);
        }).catch(e=>{
          setQuestions([]);
          setSelectedQuestions([]);
          toast.error(e.response.data);
        })
    } else {
      setQuestions([]);
    }
  }, [selectedCourse, selectedSubject, selectedExam]);
  return (
    <div className=" bg-white">
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
      {exams.length > 0 && (
        <div className="overflow-x-auto px-0 lg:px-4">
          {
        selectedQuestions.length>0 && <div className="w-full mx-auto mt-6 flex justify-start ">
        <label
          htmlFor="my-modal"
          className="btn bg-button hover:bg-gradient-to-r from-[#616161] from-0% to=[#353535] to-100% mr-2 mb-3 lg:mb-0 text-white"
        >
          Send Questions
        </label>
      </div>
      }
          {
            questions.length>0 && <table className="table w-full my-10 customTable">
            <thead>
              <tr>
                <th className="bg-white w-[10px] text-left">
                  <input
                    type="checkbox"
                    id="all_check"
                    className="w-4 h-4  border-black rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    onChange={setQuestionBulkAll}
                  />
                </th>
                <th className="bg-white">Question </th>
                <th className="bg-white">Options</th>
                <th className="bg-white">
                  Correct<br></br> Option
                </th>
                <th className="bg-white">Explanation </th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {  questions.map((question) => (
                  <tr key={question.questionId}>
                    <td className="w-[10px]">
                      <input
                        type="checkbox"
                        name="single_checbox"
                        id={`select_question` + question.questionId}
                        className="w-4 h-4  border-black rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        onChange={(e) =>
                          setQuestionBulk(e, question.questionId)
                        }
                      />
                    </td>
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
                    <td className="w-1/5">
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
                    <td className="w-[10px]">
                      {optionName[question.correctOption]}
                    </td>
                    <td className="w-1/4">
                      <img
                        src={
                          process.env.REACT_APP_API_HOST +
                          "/" +
                          question.explanation
                        }
                        alt=""
                      />
                    </td>
                    <td>                      
                      <DeactivateButton setter={setSelectedQuestionId} value={question.questionId}></DeactivateButton>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          }
        </div>
      )}
     
      <input type="checkbox" id="my-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
        <form onSubmit={sendQuestions} className="mt-4 w-full  mx-auto flex flex-col ">
            <div className="form-control">
              <label className="label-text" htmlFor="">
                Select Course
              </label>
              <select
                className="input border-black input-bordered w-full"
                required
                onChange={(e) => handleChangeSecondCourse(e)}
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
            <div className="form-control mr-3">
              <label className="label-text" htmlFor="">
                Select Subject
              </label>
              <select
                className="input  border-black input-bordered w-full"
                required
                onChange={(e) => handleChangeSecondSubject(e)}
              >
                <option value=""></option>
                {secondsubjects.length > 0 &&
                  secondsubjects.map((subject) => (
                    <option key={subject._id} value={subject._id}>
                      {subject.name}
                    </option>
                  ))}
              </select>
            </div>
            <div className="form-control mr-3">
              <label className="label-text" htmlFor="">
                Select Exam Name
              </label>
              <select
                className="input  border-black input-bordered w-full"
                required
                onChange={(e) => setQuestionExam(e.target.value)}
              >
                <option value=""></option>
                {secondexams.length > 0 &&
                  secondexams.map((exam) => (
                    <option key={exam._id} value={exam._id}>
                      {exam.name}
                    </option>
                  ))}
              </select>
            </div>
            <div className="form-control mt-4  flext justify-center items-center">
              <input type="submit" value="Add Questions" className="btn" />
            </div>
          </form>
          <div className="modal-action">
            <label htmlFor="my-modal" className="btn bg-red w-[80px]">
              Close!
            </label>
          </div>
        </div>
      </div>
      <PopUpModal modalData={selectedQuestionId} remove={removeQuestion}></PopUpModal>
    </div>
  );
};

export default ShowQuestions;