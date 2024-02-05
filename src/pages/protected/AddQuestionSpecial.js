import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import axios from "../../utils/axios";
import Loader from "./../../Shared/Loader";
import { toast } from "react-hot-toast";
import { optionName } from "../../utils/globalVariables";

const AddQuestionSpecial = () => {
  const [courses, setCourses] = useState([]);
  const [exams, setExams] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [singleExamId, setSingleExamId] = useState(null);
  const [singleExam, setsingleExam] = useState({});
  const [examType, setExamType] = useState(4);
  const [subjects,setSubjects] = useState([]);
  const [selectedSubject,setSelectedSubject] = useState(null)  
  const [isText, setIsText] = useState(true);
  const [numberOfOptions, setNumberOfOptions] = useState(0);
  const [correctOption, setCorrectOption] = useState(null);
  const [qvmark,setQvmark] = useState([]);
  const [numberOfWrittenQuestions,setNumberOfWrittenQuestions] = useState(-1);
 
  const handleAddQuestion = async (e) => {
    e.preventDefault();
    const form = e.target;
    let questionText = "";
    if (isText === true) {
      questionText = form.question_text.value;
    }
    let options = [];
    if (isText === true) {
      for (let i = 0; i < numberOfOptions; i++) {
        options.push(document.getElementById(`option${i}`).value);
      }
    }
    let questionLink = "";
    const explanationILink = form.explanationILink.files[0];
    const formdata = new FormData();
    if (isText === false) {
      questionLink = form.iLink.files[0];
      formdata.append("iLink", questionLink);
    } else {
      formdata.append("iLink", questionLink);
    }
    formdata.append("explanationILink", explanationILink);
    console.log(explanationILink);
    const question = {
      questionText: questionText,
      type: isText,
      options,
      optionCount: numberOfOptions,
      correctOption: parseInt(correctOption),
      status: true,
      examId: singleExamId,
    };
    formdata.append("questionText", questionText);
    formdata.append("type", isText);
    formdata.append("options", JSON.stringify(options));
    formdata.append("optionCount", numberOfOptions);
    formdata.append("correctOption", parseInt(correctOption));
    formdata.append("status", true);
    formdata.append("examId", singleExamId);
    formdata.append("subjectId", selectedSubject);

    console.log(question);

    await axios
      .post(`api/special/addquestionmcq`, formdata, {
        headers: {
          "Content-Type": "multipart/ form-data",
        },
      })
      .then((data) => {
        toast.success("success");
        form.reset();

        document.getElementById("num_of_options").disabled = false;
        setNumberOfOptions(0);
        setIsText(true);
      })
      .catch((e) => console.log(e));
    document.getElementById("my-modal-2").checked = false;
  };
  const fillMarks = (m,id) =>{
    const prevMarks = [...qvmark];
    prevMarks[id] =parseFloat(m).toFixed(2);
    setQvmark(prevMarks);
  }
  const handleAddWrittenQuestion = async (e) => {
    e.preventDefault();
    const form = e.target;
    let questionLink = "";
    const formdata = new FormData();
    console.log(singleExamId);
    questionLink = form.iLink.files[0];
    formdata.append("iLink", questionLink);
    formdata.append("totalQuestions", numberOfOptions);
    formdata.append("examId", singleExamId);
    let newArr = [...qvmark];
    let totalMarks=0;
    for(let i =0 ; i<newArr.length;i++){
      newArr[i] = parseFloat(newArr[i]).toFixed(2) ;
      totalMarks = totalMarks+newArr[i];
    }
    
    formdata.append("marksPerQuestion", newArr);
    formdata.append("totalMarks", totalMarks);
    formdata.append("subjectId",selectedSubject)
    await axios
      .post(`/api/special/addquestionwritten`, formdata, {
        headers: {
          "Content-Type": "multipart/ form-data",
        },
      })
      .then((data) => {
        toast.success("success");
        document.getElementById("num_of_options").disabled = false;
        setNumberOfOptions(0);
        setIsText(true);
      })
      .catch((e) => console.log(e));
    document.getElementById("my-modal-2").checked = false;
  };
  const handleChangeNumberOfInput = (e) => {
    setNumberOfOptions(parseInt(e.target.value));
    document.getElementById("num_of_options").disabled = true;
  };
  const handleChangeCourse = (e) => {
    setSelectedCourse(e.target.value);
    setExams([]);
  };
  const changeSubject = id =>{
    setSelectedSubject(id);
    console.log(typeof(id));
    if(examType!==1){
      setNumberOfWrittenQuestions(singleExam.subjectInfo.filter(s=>s.subjectId===id)[0].noOfQuestionsWritten)
    }
  }
  useEffect(() => {
    setIsLoading(true);
    axios.get("/api/course/getallcourseadmin").then(({ data }) => {
      setCourses(data.courses);
      setIsLoading(false);
    });
    if (selectedCourse !== "" && examType!==-1) {
      axios
        .get(`/api/subject/getsubjectbycourse?courseId=${selectedCourse}`)
        .then(({ data }) => {
          setSubjects(data.data);
          setIsLoading(false);
        }).catch(err=>console.log("subject fetching error"));
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
    if (singleExamId !== null) {
      axios
        .get(`/api/special/showspecialexambyid?examId=${singleExamId}`)
        .then(({ data }) => {
          setsingleExam(data);
          
        })
        .catch((e) => console.log(e));
    } else {
      setsingleExam({});
    }
  }, [selectedCourse, singleExamId,examType]);
  return (
    <div className="mx-auto">
      <div className="flex w-full justify-center items-center py-5 px-2 my-5  ">
        <div className="bg-white w-full px-4 py-2 flex flex-row justify-evenly items-center">
          <div className="form-control mr-2 ">
            <label className="label-text text-lg text-center" htmlFor="">
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
          
          <div className="form-control mr-2 ">
            <label className="label-text text-lg text-center" htmlFor="">
              Select Exam
            </label>
            <select
              name="exams"
              id="exams"
              className="input w-full border-black input-bordered"
              required
              onChange={(e) => setSingleExamId(e.target.value)}
            >
              <option value="">---Select Exam---</option>
              {
                exams.length>0 && exams.map(exam=><option key={exam._id} value={exam._id}>{exam.name}</option>)
                
                
                }
              
            </select>
          </div>
          
          <div className="form-control mr-2 ">
            <label className="label-text text-lg text-center" htmlFor="">
              Select Subject
            </label>
            <select
              name="subjects_options"
              id="subjects_options"
              className="input w-full border-black input-bordered"
              required
              onChange={(e) => changeSubject(e.target.value)}
            >
              <option value="">---Select Subject---</option>
              {
                subjects?.filter(s=> singleExam?.allSubject?.includes(s._id)).map(sub=><option key={sub._id} value={sub._id}>{sub.name}</option>)
                
                }
              
            </select>
          </div>

        </div>
      </div>
      {isLoading && <Loader></Loader>}
      {selectedSubject && subjects.length>0 && (
        <div className="overflow-x-auto w-full">        
          <table className="mx-auto  w-full whitespace-nowrap rounded-lg  divide-y  overflow-hidden">
            <thead>
              <tr>
                <th className="bg-white  font-semibold text-sm uppercase px-2 py-2">
                  Exam Name
                </th>
                <th className="width-setter bg-white font-semibold text-sm uppercase px-6 py-2">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
            <tr
            className="even:bg-table-row-even odd:bg-table-row-odd text-center"
          >
            <td className="px-2 py-2 text-center">
            {subjects.filter(s=>s._id===selectedSubject)[0].name}
          </td>
            
            <td className="px-6 py-2 text-center">
              <div className="flex flex-col lg:flex-row justify-center">
              {
                examType!==2 && <label
                htmlFor="my-modal-2"
                onClick={() => setSingleExamId(singleExamId)}
                className="btn bg-button hover:bg-gradient-to-r from-[#616161] from-0% to=[#353535] to-100% mr-2 mb-3 lg:mb-0 text-white"
              >
                Add MCQ  Question
              </label>
              }
              {
                examType!==1 && <label
                htmlFor="written-modal"
                onClick={() => setSingleExamId(singleExamId)}
                className="btn bg-button hover:bg-gradient-to-r from-[#616161] from-0% to=[#353535] to-100% mr-2 mb-3 lg:mb-0 text-white"
              >
                Add Written Question
              </label>
              }
              </div>
            </td>
          </tr>
            </tbody>
          </table>
        </div>
      )}
     
      <div id="add-question-modal">
      <input type="checkbox" id="my-modal-2" className="modal-toggle" />
      <div className="modal modal-middle ml:0 lg:ml-56">
        <div className="modal-box w-11/12 max-w-5xl h-11/12">
          <form className="add-form" onSubmit={handleAddQuestion}>
            <label htmlFor="" className="label-text text-lg text-center">
              Question Type
            </label>
            <select
              name="type"
              id="type"
              className="input border-black input-bordered w-full "
              onChange={(e) => setIsText(!isText)}
              required
            >
              <option value={true}>Text</option>
              <option value={false}>Image</option>
            </select>
            {isText === true ? (
              <>
                <label htmlFor="" className=" label">
                  <span className="label-text text-lg text-center">Write Down the question </span>
                </label>
                <textarea
                  className="textarea textarea-info   border-black"
                  name="question_text"
                  id="question_text"
                  cols={100}
                  placeholder="Description"
                ></textarea>
              </>
            ) : (
              <>
                <label htmlFor="" className=" label">
                  <span className="label-text text-lg text-center">Select Question Image </span>
                </label>
                <input
                  type="file"
                  name="iLink"
                  id="iLink"
                  className="file-input w-full input-bordered  border-black "
                  required
                />
              </>
            )}
            <label htmlFor="" className="label">
              Number of Options
            </label>
            <input
              type="number"
              className="input w-full input-bordered border-black "
              name="num_of_options"
              id="num_of_options"
              min="2"
              onInput={(e) =>
                e.target.value < 0 ? (e.target.value = "") : e.target.value
              }
              onBlur={(e) => handleChangeNumberOfInput(e)}
              required
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-4">
              {isText === true &&
                numberOfOptions > 0 &&
                [...Array(numberOfOptions).keys()].map((id) => {
                  return (
                    <div key={id}>
                      <div>
                        <label htmlFor="" className="label-text text-lg text-center">
                          {optionName[id] + ")"}
                        </label>
                        <input
                          type="text"
                          placeholder={`Option ${id + 1}`}
                          name={`option${id}`}
                          id={`option${id}`}
                          className="input w-full input-bordered border-black "
                          required
                        />
                      </div>
                    </div>
                  );
                })}
            </div>

            {numberOfOptions > 0 && (
              <>
                <label className="label-text text-lg text-center">Correct Option</label>
                <select
                  name="type"
                  id="type"
                  className="input border-black input-bordered w-full "
                  onChange={(e) => setCorrectOption(e.target.value)}
                  required
                >
                  <option>---</option>
                  {[...Array(numberOfOptions).keys()].map((id) => (
                    <option key={id} value={id}>
                      {optionName[id]}
                    </option>
                  ))}
                </select>
              </>
            )}
            <label htmlFor="" className=" label">
              <span className="label-text text-lg text-center">Explanation Link </span>
            </label>
            <input
              type="file"
              name="explanationILink"
              id="explanationILink"
              className="file-input w-full input-bordered  border-black "
              required
            />
            <div className="form-control my-2">
              <input
                type="submit"
                value="Add Question"
                className="btn w-32 "
              />
            </div>
          </form>
          <div className="modal-action">
            <label htmlFor="my-modal-2" className="btn bg-red text-white">
              Close
            </label>
          </div>
        </div>
      </div>
      <input type="checkbox" id="written-modal" className="modal-toggle" />
      <div className="modal modal-middle ml:0 lg:ml-56">
        <div className="modal-box w-11/12 max-w-5xl h-11/12">
          <form className="add-form" onSubmit={handleAddWrittenQuestion}>
          <label htmlFor="" className=" label">
                  <span className="label-text text-lg text-center">Select Question Image </span>
                </label>
                <input
                  type="file"
                  name="iLink"
                  id="iLink"
                  className="file-input w-full input-bordered  border-black "
                  required
                />
            <label htmlFor="" className="label">
              Number of Questions
            </label>
            <input
              type="number"
              className="input w-full input-bordered border-black "
              name="num_of_options"
              id="num_of_options"
              min="1"
              onInput={(e) =>
                e.target.value < 0 ? (e.target.value = "") : e.target.value
              }
              value={numberOfWrittenQuestions}
              disabled
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-4">
              { numberOfWrittenQuestions > 0 &&
                [...Array(numberOfWrittenQuestions).keys()].map((id) => {
                  return (
                    <div key={id}>
                      <div>
                        <label htmlFor="" className="label-text text-lg text-center">
                          {(id+1) + ")"}
                        </label>
                        <input
                          type="text"
                          placeholder="Marks"
                          name={`option${id}`}
                          id={`option${id}`}
                          onChange={e=>fillMarks(e.target.value,id)}
                          className="input w-full input-bordered border-black "
                          required
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
            <div className="form-control my-2">
              <input
                type="submit"
                value="Add Question"
                className="btn w-32 "
              />
            </div>
          </form>
          <div className="modal-action">
            <label htmlFor="written-modal" className="btn bg-red text-white">
              Close
            </label>
          </div>
        </div>
      </div>
      
    </div> 
    </div>
  );
};

export default AddQuestionSpecial;
