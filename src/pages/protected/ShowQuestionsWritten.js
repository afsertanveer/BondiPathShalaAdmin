import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import axios from "../../utils/axios";
import Loader from "../../Shared/Loader";
import { toast } from "react-hot-toast";
import DeactivateButton from "../../features/common/components/DeactivateButton";
import PopUpModal from "../../features/common/components/PopUpModal";
const ShowQuestionsWritten = () => {
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [exams, setExams] = useState([]);
  const [questions, setQuestions] = useState({});
  const [questSet,setQuestSet] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedExam, setSelectedExam] = useState("");
  const [selectedQuestionId, setSelectedQuestionId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChangeCourse = (e) => {
    setSelectedSubject("");
    setSubjects([]);
    setExams("");
    setExams([]);
    setQuestions([]);
    setSelectedCourse(e.target.value);
  };


  const handleChangeSubject = (e) => {
    setSelectedSubject(e.target.value);
    setSelectedExam("");
    setExams([]);
    setQuestions([]);
  };
  const removeQuestion = (examId) => {
    console.log(examId);
    axios
      .post("/api/exam/removequestionwritten",{examId} )
      .then(({ data }) => {
        toast.success("Removed Successfuly");
        window.location.reload(false);
      })
      .catch((e) => toast.error(e.response.data));

    document.getElementById("my-modal-1").checked = false;
  };

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
        })
        .catch((e) => console.log(e));
    } else {
      setSubjects([]);
    }
    if (selectedSubject !== "") {
      axios
        .get(`/api/exam/getExamBySub?subjectId=${selectedSubject}&examType=2`)
        .then(({ data }) => {
          const newData = data.filter((d) => d.examVariation === 2);
          setExams(newData);
          setIsLoading(false);
        })
        .catch((e) => console.log(e));
    } else {
      setExams([]);
    }
    if (selectedExam !== "") {
      axios
        .get(`/api/exam/getwrittenquestionbyexam?examId=${selectedExam}`)
        .then(({ data }) => {
          setQuestSet(true)
          console.log(data);
          setQuestions(data);
          setIsLoading(false);
        })
        .catch((e) => {
          setQuestions([]);
          toast.error(e.response.data);
        });
    } else {
      setQuestions([]);
    }
  }, [selectedCourse, selectedSubject, selectedExam]);
  return (
    <div className=" bg-white">
      <div className=" py-4 px-2 my-3 ">
        <div className="w-full  mx-auto flex flex-row justify-between items-center">
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
          {questSet && (
            <>
              <table className="table w-full my-10 customTable">
                <thead>
                  <tr>
                   
                    <th className="bg-white">Question </th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                <tr>
                    
                      <td className="w-1/4">
                        <img
                          src={
                            process.env.REACT_APP_API_HOST +
                            "/" +
                            questions.questionILink
                          }
                          alt="question"
                        ></img>
                      </td>
                      <td>
                        <DeactivateButton
                          setter={setSelectedQuestionId}
                          value={questions.examId._id}
                        ></DeactivateButton>
                      </td>
                    </tr>
                </tbody>
              </table>
            </>
          )}
        </div>
      )}
      <PopUpModal
        modalData={selectedQuestionId}
        remove={removeQuestion}
      ></PopUpModal>
    </div>
  );
};

export default ShowQuestionsWritten;
