import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import axios from "../../utils/axios";
import Loader from "./../../Shared/Loader";
import { toast } from "react-hot-toast";

const ShowExam = () => {
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [exams, setExams] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [singleExamId, setSingleExamId] = useState(null);
  const [singleExam, setsingleExam] = useState({});
  const [selectedType, setSelectedType] = useState(-1);
  const [selectedVariation, setSelectedVariation] = useState(-1);
  const [isFree, setIsFree] = useState(false);
  const [isSSC, setIsSSC] = useState(false);
  const [isHSC, setIsHSC] = useState(false);
  const [isText, setIsText] = useState(true);
  const [numberOfOptions, setNumberOfOptions] = useState(0);
  const [correctOption, setCorrectOption] = useState(null);
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
  const  handleAssignExamId = id=>{
    console.log(id);
    setSingleExamId(id);
  }
  const handleUpdateExam = async (e) => {
    e.preventDefault();
    const form = e.target;

    form.reset();
    document.getElementById("my-modal").checked = false;
  };
  const handleAddQuestion = async(e) => {
    e.preventDefault();
    const form = e.target;
    let questionText = "";
    if(isText===true){
       questionText = form.question_text.value;
    }
    let options = [];
    if(isText===true){
      for(let i=0;i<numberOfOptions;i++){
        options.push(document.getElementById(`option${i}`).value)
      }
    }
    let  questionLink ="";
    const explanationILink = form.explanationILink.files[0];
    const formdata = new FormData();
    if(isText===false){
       questionLink = form.iLink.files[0];
      formdata.append("iLink",questionLink)
    }else{
      formdata.append("iLink",questionLink)
    }
    formdata.append("explanationILink",explanationILink)
    console.log(explanationILink);
    const question = {
      questionText:questionText,
      type:isText,
      options,
      optionCount:numberOfOptions,
      correctOption:parseInt(correctOption),
      status:true,
      examId:singleExamId
    }
    console.log(question);

    await axios.post(`/api/exam/addquestionmcq?questionObj=${JSON.stringify(question)}`,formdata,{
      headers: {
        "Content-Type": "multipart/ form-data",
      }
    }).then(data=>{
      toast.success(data);
    }).catch(e=>console.log(e))
    document.getElementById("my-modal-2").checked = false;
  };
  const handleChangeNumberOfInput = e=>{
    setNumberOfOptions(parseInt(e.target.value))
    document.getElementById("num_of_options").disabled = true;
  }
  useEffect(() => {
    setIsLoading(true);
    axios.get("api/course/getallcourse?status=true").then(({ data }) => {
      setCourses(data.courses);
      setIsLoading(false);
    });
    if (selectedCourse !== "") {
      axios
        .get(`api/subject/getsubjectbycourse?courseId=${selectedCourse}`)
        .then(({ data }) => {
          setSubjects(data);
          setIsLoading(false);
        });
    } else {
      setSubjects([]);
    }
    if (selectedSubject !== "") {
      axios
        .get(`api/exam/getExamBySub?subjectId=${selectedSubject}`)
        .then(({ data }) => {
          setExams(data);
          setIsLoading(false);
        });
    } else {
      setExams([]);
    }
    if (singleExamId !== null) {
      axios
        .get(`api/exam/getExamById?examId=${singleExamId}`)
        .then(({ data }) => {
          setsingleExam(data);
        })
        .catch((e) => console.log(e));
    } else {
      setsingleExam({});
    }
  }, [selectedCourse, singleExamId, selectedSubject]);
  return (
    <div className=" bg-white w-full lg:w-1/2 mx-auto">
      <div className=" py-4 px-2 my-3 ">
        <div className="flex flex-row justify-evenly items-center">
          <div className="form-control">
            <label className="label-text" htmlFor="">
              Select Course
            </label>
            <select
              name="course_list"
              id="course_list"
              className="input w-full border-black input-bordered"
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
          <div className="form-control">
            <label className="label-text" htmlFor="">
              Select Subject
            </label>
            <select
              name="course_list"
              id="course_list"
              className="input w-full border-black input-bordered"
              required
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              <option value=""></option>
              {subjects.length > 0 &&
                subjects.map((subject) => (
                  <option key={subject._id} value={subject._id}>
                    {subject.name}
                  </option>
                ))}
            </select>
          </div>
        </div>
      </div>
      {isLoading && <Loader></Loader>}
      {exams.length > 0 && (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th className="bg-white">Exam Name</th>
                <th className="bg-white">Action</th>
              </tr>
            </thead>
            <tbody>
              {exams.length > 0 &&
                exams.map((exam) => (
                  <tr key={exam._id}>
                    <td>{exam.name}</td>
                    <td>
                      <div className="flex flex-col lg:flex-row justify-center">
                      <label
                        onClick={() => handleAssignExamId(exam._id)}
                        htmlFor="my-modal"
                        className="btn bg-button hover:bg-gradient-to-r from-[#616161] from-0% to=[#353535] to-100% mr-2 mb-3 lg:mb-0 text-white"
                      >
                        Update
                      </label>
                      <label
                        htmlFor="my-modal-2"
                        onClick={()=>setSingleExamId(exam._id)}
                        className="btn bg-button hover:bg-gradient-to-r from-[#616161] from-0% to=[#353535] to-100% mr-2 mb-3 lg:mb-0 text-white"
                      >
                        Add Questions
                      </label>
                      <button className="btn">Deactivate</button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
      <div id="update-modal">
        <input type="checkbox" id="my-modal" className="modal-toggle" />
        <div className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg text-center">Update Subject</h3>
            <form className="add-form" onSubmit={handleUpdateExam}>
              <div className="form-control">
                <label htmlFor="" className=" label">
                  <span className="label-text">Exam Name </span>
                </label>
                <input
                  className="input input-bordered  border-black"
                  type="text"
                  name="exam"
                  id="exam"
                  placeholder="Subject Name"
                  defaultValue={singleExam.name}
                  required
                />
              </div>
              <div className="form-control flex flex-col lg:flex-row justify-between">
                <div className="w-full lg:w-1/4">
                  <label htmlFor="" className="label">
                    Type
                  </label>
                  <select
                    name="type"
                    id="type"
                    className="input border-black input-bordered w-full "
                    onChange={(e) => setSelectedType(e.target.value)}
                    required
                  >
                    <option value={singleExam.examType} defaultChecked>
                      {singleExam.examType === 1
                        ? "Daily"
                        : singleExam.examType === 2
                        ? "Weekly"
                        : "Monthly"}
                    </option>
                    <option value={1}>Daily</option>
                    <option value={2}>Weekly</option>
                    <option value={3}>Monthly</option>
                  </select>
                </div>
                <div className="w-full lg:w-1/4">
                  <label htmlFor="" className="label">
                    Variation
                  </label>
                  <select
                    name="variation"
                    id="variation"
                    className="input border-black input-bordered w-full "
                    onChange={(e) => setSelectedVariation(e.target.value)}
                    required
                  >
                    <option value={singleExam.examVariation}>
                      {singleExam.examVariation === 1
                        ? "MCQ"
                        : singleExam.examVariation === 2
                        ? "Written"
                        : "Both"}
                    </option>
                    <option value={1}>MCQ</option>
                    <option value={2}>Written</option>
                    <option value={3}>Both</option>
                  </select>
                </div>
                <div className="w-full lg:w-1/4">
                  <div className="flex items-center mt-0 lg:mt-5 ">
                    <input
                      type="checkbox"
                      checked={singleExam.examFreeOrNot ? "checked" : ""}
                      onChange={(e) => setIsFree(!isFree)}
                      className="w-4 h-4  border-black rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label
                      htmlFor="disabled-checked-checkbox"
                      className="ml-2 text-sm font-medium"
                    >
                      Free
                    </label>
                  </div>
                </div>
              </div>
              <div className="form-control"></div>
              <div className="form-control flex flex-col lg:flex-row justify-between items-start lg:items-center">
                <div className="w-full lg:w-1/2 mr-0 lg:mr-4">
                  <label className="label" htmlFor="">
                    Start Time
                  </label>
                  <input
                    type="datetime-local"
                    className="input input-bordered w-full  border-black "
                    name="start_time"
                    id="start_time"
                    defaultValue={singleExam?.startTime?.split(":00.000Z")[0]}
                    required
                  />
                </div>
                <div className="w-full lg:w-1/2">
                  <label className="label" htmlFor="">
                    End Time
                  </label>
                  <input
                    type="datetime-local"
                    className="input input-bordered w-full  border-black "
                    name="end_time"
                    id="end_time"
                    defaultValue={singleExam?.endTime?.split(":00.000Z")[0]}
                    required
                  />
                </div>
              </div>
              <div className="form-control">
                <div className="w-full">
                  <label className="label" htmlFor="">
                    Duration
                  </label>
                  <input
                    type="mumber"
                    className="input w-full input-bordered border-black "
                    name="duration"
                    id="duration"
                    defaultValue={singleExam.duration}
                    min="1"
                    onInput={(e) =>
                      e.target.value < 0
                        ? (e.target.value = "")
                        : e.target.value
                    }
                    required
                  />
                  <span className="text-red text-sm ml-0 lg:ml-2">
                    (minutes)
                  </span>
                </div>
              </div>
              <div className="form-control flex flex-col lg:flex-row justify-between items-start lg:items-start">
                <div className="w-full lg:w-1/4">
                  <label htmlFor="" className="label">
                    Questions
                  </label>
                  <input
                    type="number"
                    className="input w-full input-bordered  border-black "
                    name="total_questions"
                    id="total_questions"
                    defaultValue={singleExam.totalQuestionMcq}
                    onInput={(e) =>
                      e.target.value < 0
                        ? (e.target.value = "")
                        : e.target.value
                    }
                    required
                  />
                </div>
                <div className="w-full lg:w-1/4">
                  <label htmlFor="" className="label">
                    Marks/Question
                  </label>
                  <input
                    type="number"
                    className="input w-full input-bordered  border-black "
                    name="marks_per_question"
                    id="marks_per_question"
                    defaultValue={singleExam.marksPerMcq}
                    onInput={(e) =>
                      e.target.value < 0
                        ? (e.target.value = "")
                        : e.target.value
                    }
                    required
                  />
                </div>
                <div className="w-full lg:w-1/4">
                  <label htmlFor="" className="label">
                    Total Marks
                  </label>
                  <input
                    type="number"
                    className="input w-full input-bordered  border-black  mb-3"
                    name="total_marks"
                    id="total_marks"
                    defaultValue={singleExam.totalMarksMcq}
                    onInput={(e) =>
                      e.target.value < 0
                        ? (e.target.value = "")
                        : e.target.value
                    }
                    required
                  />
                </div>
              </div>
              <div className="form-control flex flex-col lg:flex-row justify-between items-start lg:items-center">
                <div className="w-full lg:w-1/3">
                  <label htmlFor="" className="label">
                    Negative Marking
                  </label>
                  <input
                    type="number"
                    className="input w-full input-bordered  border-black "
                    name="negative_marking"
                    id="negative_marking"
                    defaultValue={singleExam.negativeMarks}
                    step="any"
                    onChange={(e) =>
                      e.target.value < 0
                        ? (e.target.value = "")
                        : e.target.value
                    }
                    required
                  />
                </div>
                <div className="flex items-center mt-0 lg:mt-5 ">
                  <input
                    id="disabled-checked-checkbox"
                    type="checkbox"
                    checked={singleExam.sscStatus ? "checked" : ""}
                    onChange={(e) => setIsSSC(!isSSC)}
                    className="w-4 h-4  border-black rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    htmlFor="disabled-checked-checkbox"
                    className="ml-2 text-sm font-medium"
                  >
                    SSC
                  </label>
                </div>
                <div className="flex items-center mt-0 lg:mt-5 ">
                  <input
                    id="disabled-checked-checkbox"
                    type="checkbox"
                    checked={singleExam.hscStatus ? "checked" : ""}
                    onChange={(e) => setIsHSC(!isHSC)}
                    className="w-4 h-4  border-black rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    htmlFor="disabled-checked-checkbox"
                    className="ml-2 text-sm font-medium"
                  >
                    HSC
                  </label>
                </div>
              </div>
              <div className="form-control mt-2 flex flex-row justify-between">
                <input
                  type="submit"
                  value="Update Exam"
                  className="btn w-[150px] mt-4"
                />
                <div className="modal-action">
                  <label htmlFor="my-modal" className="btn bg-[red] ">
                    Close!
                  </label>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div id="add-question-modal">
      <input type="checkbox" id="my-modal-2" className="modal-toggle" />
          <div className="modal modal-middle ml:0 lg:ml-56">
            <div className="modal-box w-11/12 max-w-5xl h-11/12">
              <form className="add-form" onSubmit={handleAddQuestion}>
                <label htmlFor="" className="label-text">
                  Question Type
                </label>
                <select
                  name="type"
                  id="type"
                  className="input border-black input-bordered w-full "
                  onChange={(e) => setIsText(e.target.value)}
                  required
                >
                  <option value={true}>Text</option>
                  <option value={false}>Image</option>
                </select>
                {isText === true ? (
                  <>
                    <label htmlFor="" className=" label">
                      <span className="label-text">
                        Write Down the question{" "}
                      </span>
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
                      <span className="label-text">Select Question Image </span>
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
                {isText===true && numberOfOptions > 0 &&
                  [...Array(numberOfOptions).keys()].map((id) => {
                    return (
                      <div key={id}>
                        <div>
                        <label htmlFor="" className="label-text">
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
                    <label className="label-text">Correct Option</label>
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
                  <span className="label-text">Explanation Link </span>
                </label>
                <input
                  type="file"
                  name="explanationILink"
                  id="explanationILink"
                  className="file-input w-full input-bordered  border-black "
                  required
                />
              <div className="form-control my-2">
                <input type="submit" value="Add Question" className="btn w-32 " />
              </div>
              </form>
              <div className="modal-action">
                <label htmlFor="my-modal-2" className="btn bg-red text-white">
                  Close
                </label>
              </div>
            </div>
          </div>
      </div>
    </div>
  );
};

export default ShowExam;
