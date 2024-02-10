import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import axios from "../../utils/axios";
import Loader from "./../../Shared/Loader";
import { toast } from "react-hot-toast";
import DeactivateButton from "./../../features/common/components/DeactivateButton";
import PopUpModal from "./../../features/common/components/PopUpModal";
import { optionName, type } from "../../utils/globalVariables";
import { Fragment } from "react";
import Select from "react-select";
import moment from "moment/moment";

const ShowExam = () => {
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [exams, setExams] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [singleExamId, setSingleExamId] = useState(null);
  const [singleExam, setsingleExam] = useState({});
  const [isText, setIsText] = useState(true);
  const [numberOfOptions, setNumberOfOptions] = useState(0);
  const [correctOption, setCorrectOption] = useState(null);
  const [selectedExamId, setSelectedExamId] = useState("");
  const [ruleImg, setRuleImg] = useState("");
  const [examType,setExamType] = useState("");
  const [sscChecked, setSscChecked] = useState(false);
  const [hscChecked, setHscChecked] = useState(false);
  const [qvmark,setQvmark] = useState([]);
  const [teachers,setTeachers] = useState([]);
  const [ selectedTeachers, setSelectedTeachers ] = useState([]);
 
  const generator = (id) => {
    axios
      .put(`/api/student/updatestudentexaminfo?examId=${id}`)
      .then((data) => {
        axios
          .post(`/api/student/updaterank?examId=${id}`)
          .then((data) => {
            toast.success("Rank Generated Successfully");
            window.location.reload(false);
          })
          .catch((e) => console.log(e));
      })
      .catch((e) => console.log(e));
  };
  const handleAssignRule = (id) => {
    axios
      .get(`/api/exam/examruleget?examId=${id}`)
      .then(({ data }) => {
        if (data !== null) {
          setRuleImg(data.ruleILink);
          return data.ruleILink;
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const handleAssignExamId = (id) => {
    setSingleExamId(id);
  };
  const handleAddRule = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    const form = e.target;
    const file = e.target.ruleILink.files[0];
    const formData = new FormData();
    formData.append("examId", singleExam._id);
    formData.append("ruleILink", file);
    try {
      await axios
        .post("/api/exam/examruleset", formData, {
          headers: {
            "Content-Type": "multipart/ form-data",
          },
        })
        .then(({ data }) => {
          toast.success("Rules Added Successfully");
          window.location.reload(false);
          form.reset();
          setIsLoading(false);
        })
        .catch((e) => console.log(e));
    } catch (e) {
      toast.error(`${e.response.data.message}`);
      console.log(e);
    }

    document.getElementById("my-modal-3").checked = false;
  };
  const handleUpdateExam = async (e) => {
    e.preventDefault();
    let totalQuestionMcq= singleExam.totalQuestionMcq, marksPerMcq= singleExam.marksPerMcq,totalMarksMcq=singleExam.totalMarksMcq;
    const form = e.target;
    const name = form.exam.value;
    const type = form.type.value;
    const variation = form.variation.value;
    const startTime = form.start_time.value;
    const endTime = form.end_time.value;
    if(singleExam.examVariation===1){
      totalQuestionMcq =parseInt( form.total_questions.value);
      marksPerMcq = parseInt(form.marks_per_question.value);
      totalMarksMcq= totalQuestionMcq*marksPerMcq;
    }else{
      totalMarksMcq=parseInt(form.total_marks.value);
    }
    const duration = form.duration.value;
    const negativeMarks = form.negative_marking.value;
    const ssc = document.getElementById("ssc").checked === true ? true : false;
    const hsc = document.getElementById("hsc").checked === true ? true : false;
    const updatedExam = {
      examId: singleExam._id,
      name,
      examType: type,
      subjectId: singleExam.subjectId._id,
      courseId: singleExam.courseId._id,
      examVariation: variation,
      examFreeOrNot: false,
      startTime,
      endTime,
      totalQuestionMcq,
      marksPerMcq,
      totalMarksMcq,
      status: true,
      duration: duration,
      negativeMarks,
      sscStatus: ssc,
      hscStatus: hsc,
      buetStatus: singleExam.buetStatus,
      medicalStatus: singleExam.medicalStatus,
      universityStatus: singleExam.universityStatus
    };
    await axios.put("/api/exam/updateexam", updatedExam).then(({ data }) => {
      toast.success(data);
      window.location.reload(false);
      form.reset();
    });
    form.reset();
    document.getElementById("my-modal").checked = false;
  };
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


    await axios
      .post(`/api/exam/addquestionmcq`, formdata, {
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
    questionLink = form.iLink.files[0];
    formdata.append("questionILink", questionLink);
    formdata.append("totalQuestions", numberOfOptions);
    formdata.append("status", "true");
    formdata.append("examId", singleExamId);
    let newArr = [...qvmark];
    let totalMarks=0.0;
    for(let i =0 ; i<newArr.length;i++){
      newArr[i] = parseFloat(newArr[i]).toFixed(2);
      totalMarks = parseFloat(totalMarks+parseFloat(newArr[i]));
    }
    totalMarks=totalMarks.toFixed(2);
    formdata.append("marksPerQuestion", newArr);
    formdata.append("totalMarks", totalMarks);
    await axios
      .post(`/api/exam/addquestionwritten`, formdata, {
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
  const deactivateExam = async (examId) => {
    await axios.put("/api/exam/deactivateexam", { examId }).then(({ data }) => {
      toast.success("Exam Deactivated");
      window.location.reload(false);
    });
  };

  const handleChangeNumberOfInput = (e) => {
    setNumberOfOptions(parseInt(e.target.value));
    document.getElementById("num_of_options").disabled = true;
  };
  const handleChangeCourse = (e) => {
    setSelectedCourse(e.target.value);
    setSelectedSubject("");
    setExams([]);
  };
  const examStopper = examId =>{
    axios.post("/api/student/updatedstudentwritteninfo",{examId})
    .then(data=>{
      toast.success("This exam is stopped now...")
      document.getElementById("my-popup-written").checked = false;
    }).catch(err=>toast.error(err));
  }
  const generatorWritten = examId =>{
    axios.post(`/api/teacher/updaterank`,{examId}).then(data=>{
      toast.success("Rank Updated");
      window.location.reload(false);
    })
  }
  const handleAssignTeacher = e =>{
      e.preventDefault();
      let steachers = [];
      for(let i = 0 ; i<selectedTeachers.length;i++){
            steachers.push(selectedTeachers[i].value);
      }
      const obj ={
        examId:singleExamId,
        teacherId:steachers
      }
      axios.post("/api/exam/assignstudenttoteacher",obj).then(({data})=>{
      
        toast.success("Assigned and Distributed");
      }).catch(err=>console.log(err))
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
        }).catch(err=>console.log("subject fetching error"));

      axios
        .get(`/api/user/teacherlistbycourse?courseId=${selectedCourse}`)
        .then(({ data }) => {
          setTeachers(data)
          setIsLoading(false);
        }).catch(err=>console.log("teacher fetching error"));
    } else {
      setSubjects([]);
    }
    if (selectedSubject !== "" && examType!=="") {
      axios
        .get(`/api/exam/getexambysubadmin?subjectId=${selectedSubject}&examType=${examType}`)
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
        .get(`/api/exam/getExamById?examId=${singleExamId}`)
        .then(({ data }) => {
          setsingleExam(data);
          setSscChecked(data.sscStatus);
          setHscChecked(data.hscStatus);
        })
        .catch((e) => console.log(e));
    } else {
      setsingleExam({});
    }
  }, [selectedCourse, singleExamId, selectedSubject,examType]);
  return (
    <div className="mx-auto">
      <div className="flex justify-center items-center py-2 px-2 my-3  ">
        <div className="bg-white w-full px-2 lg:px-6 py-2 grid grid-cols-1 lg:grid-cols-3 gap-0 lg:gap-4 ">
          <div className="form-control">
            <label className="label-text text-center " htmlFor="">
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
                      <option className="text-center" key={course._id} value={course._id}>
                        {course.name}
                      </option>
                    )
                )}
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
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              <option value=""></option>
              {subjects.length > 0 &&
                subjects.map(
                  (subject) =>
                    subject.name !== "Free" && (
                      <option className="text-center" key={subject._id} value={subject._id}>
                        {subject.name}
                      </option>
                    )
                )}
            </select>
          </div>
          <div className="form-control">
            <label className="label-text text-center" htmlFor="">
              Select Type
            </label>
            <select
              name="course_list"
              id="course_list"
              className="input w-full border-black input-bordered"
              required
              onChange={(e) => setExamType(e.target.value)}
            >
              <option className="text-center" value=""></option>
              <option className="text-center"  value="1">MCQ</option>
              <option className="text-center"  value="2">WRITTEN</option>
            </select>
          </div>
        </div>
      </div>
      {isLoading && <Loader></Loader>}
      {exams.length > 0 && (
        <div className="overflow-x-auto w-full">        
          <table className="mx-auto  w-full whitespace-nowrap rounded-lg  divide-y  overflow-hidden">
            <thead>
              <tr>
                <th className="bg-white font-semibold text-sm uppercase px-1 py-2">
                  SI No.
                </th>
                <th className="bg-white  font-semibold text-sm uppercase px-2 py-2">
                  Exam Name
                </th>
                <th className="bg-white font-semibold text-sm uppercase px-6 py-2">
                  Start Time - <br></br> End Time
                </th>
                <th className="bg-white font-semibold text-sm uppercase px-6 py-2">
                  Type
                </th>
                <th className="bg-white font-semibold text-sm uppercase px-6 py-2">
                  Duration
                </th>
                <th className="bg-white font-semibold text-sm uppercase px-6 py-2">
                  SSC?/HSC?
                </th>
                <th className="bg-white font-semibold text-sm uppercase px-6 py-2">
                  Marks/Questions-<br/>Total Questions-<br/>Total Marks
                </th>
                <th className="width-setter bg-white font-semibold text-sm uppercase px-6 py-2">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {exams.length > 0 &&
                exams.map((exam, idx) => (
                  <tr
                    key={exam._id}
                    className="even:bg-table-row-even odd:bg-table-row-odd text-center"
                  >
                    <td className="px-1 py-2 text-center">{idx + 1}</td>
                    <td className="px-2 py-2 text-center">{exam.name}</td>
                    <td className="px-1 py-2 text-center">
                      {
                        (moment(exam.startTime).format('llll'))
                      } <br/> 
                      {
                        (moment(exam.endTime).format('llll'))
                      }
                    </td>
                    <td className="px-6 py-2 text-center">
                      {type[exam.examType]}
                    </td>
                    <td className="px-6 py-2 text-center">
                      {exam.duration} Minutes
                    </td>
                    <td className="px-6 py-2 text-center">
                      {exam.sscStatus ? "Yes" : "No"} / {exam.hscStatus ? "Yes" : "No"}
                    </td>
                    <td className="px-6 py-2 text-center">
                      {exam.examVariation===1? exam.marksPerMcq : "N/A"}-{exam.examVariation===1? exam.totalQuestionMcq : "N/A"}-{exam.totalMarksMcq}
                    </td>
                    <td className="px-2 py-3 ">
                      <div className="grid  lg:grid-cols-2 gap-1 lg:gap-2">
                        {exam.RuleImage !== "0" ? (
                          <label
                            onClick={() => handleAssignRule(exam._id)}
                            htmlFor="my-modal-4"
                            className="btn bg-button hover:bg-gradient-to-r from-[#616161] from-0% to=[#353535] to-100% mr-2 mb-3 lg:mb-0 text-white"
                          >
                            Show Rule
                          </label>
                        ) : (
                          <label
                            onClick={() => handleAssignExamId(exam._id)}
                            htmlFor="my-modal-3"
                            className="btn bg-button hover:bg-gradient-to-r from-[#616161] from-0% to=[#353535] to-100% mr-2 mb-3 lg:mb-0 text-white"
                          >
                            Add Exam Rule
                          </label>
                        )}
                        {
                          examType==="1" && <label
                          onClick={() => handleAssignExamId(exam._id)}
                          htmlFor="my-popup"
                          className="btn bg-button hover:bg-gradient-to-r from-[#616161] from-0% to=[#353535] to-100% mr-2 mb-3 lg:mb-0 text-white"
                        >
                          Generate Meritlist
                        </label>
                        }
                        {
                          examType === "2" && <label
                          onClick={() => handleAssignExamId(exam._id)}
                          htmlFor="assign-teacher"
                          className="btn bg-button hover:bg-gradient-to-r from-[#616161] from-0% to=[#353535] to-100% mr-2 mb-3 lg:mb-0 text-white"
                        >
                          Assign Teachers
                          </label>
                        }
                        {
                          examType==="2" && 
                           <label
                          onClick={() => handleAssignExamId(exam._id)}
                          htmlFor="my-popup-written"
                          className="btn bg-button hover:bg-gradient-to-r from-[#616161] from-0% to=[#353535] to-100% mr-2 mb-3 lg:mb-0 text-white"
                        >
                          Submit Exam
                        </label>
                        
                        }
                        {
                          examType ==="2" && <label
                          onClick={() => handleAssignExamId(exam._id)}
                          htmlFor="written-generator"
                          className="btn bg-button hover:bg-gradient-to-r from-[#616161] from-0% to=[#353535] to-100% mr-2 mb-3 lg:mb-0 text-white"
                        >
                          Generate Meritlist
                        </label>
                        }
                        <label
                          onClick={() => handleAssignExamId(exam._id)}
                          htmlFor="my-modal"
                          className="btn bg-button hover:bg-gradient-to-r from-[#616161] from-0% to=[#353535] to-100% mr-2 mb-3 lg:mb-0 text-white"
                        >
                          Update
                        </label>
                        {
                          exam.examVariation===1 && <label
                          htmlFor="my-modal-2"
                          onClick={() => setSingleExamId(exam._id)}
                          className="btn bg-button hover:bg-gradient-to-r from-[#616161] from-0% to=[#353535] to-100% mr-2 mb-3 lg:mb-0 text-white"
                        >
                          Add  Question
                        </label>
                        }
                        {
                          exam.examVariation===2 && <label
                          htmlFor="written-modal"
                          onClick={() => setSingleExamId(exam._id)}
                          className="btn bg-button hover:bg-gradient-to-r from-[#616161] from-0% to=[#353535] to-100% mr-2 mb-3 lg:mb-0 text-white"
                        >
                          Add  Question
                        </label>
                        }
                        {
                          exam.examVariation===3 && <label
                          htmlFor="both-modal"
                          onClick={() => setSingleExamId(exam._id)}
                          className="btn bg-button hover:bg-gradient-to-r from-[#616161] from-0% to=[#353535] to-100% mr-2 mb-3 lg:mb-0 text-white"
                        >
                          Add  Question
                        </label>
                        }
                        
                        <DeactivateButton
                          setter={setSelectedExamId}
                          value={exam._id}
                        ></DeactivateButton>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
      <div>
        <input type="checkbox" id="my-popup-written" className="modal-toggle" />
        <div className="modal">
          <div className="modal-box">
            <h3 className="font-semibold text-lg text-center">
              {`Are you sure?`}
            </h3>

            <div className="modal-action flex justify-center items-center">
              <button
                className="btn mr-2"
                onClick={() => examStopper(singleExamId)}
              >
                Yes
              </button>
              <label htmlFor="my-popup-written" className="btn bg-[red]">
                No!
              </label>
            </div>
          </div>
        </div>
        <input type="checkbox" id="my-popup" className="modal-toggle" />
        <div className="modal">
          <div className="modal-box">
            <h3 className="font-semibold text-lg text-center">
              {`Are you sure?`}
            </h3>

            <div className="modal-action flex justify-center items-center">
              <button
                className="btn mr-2"
                onClick={() => generator(singleExamId)}
              >
                Yes
              </button>
              <label htmlFor="my-popup" className="btn bg-[red]">
                No!
              </label>
            </div>
          </div>
        </div>
        <input type="checkbox" id="written-generator" className="modal-toggle" />
        <div className="modal">
          <div className="modal-box">
            <h3 className="font-semibold text-lg text-center">
              {`Are you sure?`}
            </h3>

            <div className="modal-action flex justify-center items-center">
              <button
                className="btn mr-2"
                onClick={() => generatorWritten(singleExamId)}
              >
                Yes
              </button>
              <label htmlFor="written-generator" className="btn bg-[red]">
                No!
              </label>
            </div>
          </div>
        </div>
        <input type="checkbox" id="my-modal-4" className="modal-toggle" />
        <div className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg text-center">Exam Rules</h3>
            <img
              src={process.env.REACT_APP_API_HOST + "/" + ruleImg}
              alt="exam-rules"
            />
            <div className="modal-action">
              <label htmlFor="my-modal-4" className="btn bg-[red] ">
                Close!
              </label>
            </div>
          </div>
        </div>
      </div>
      <div id="assignTeacher">
        <input type="checkbox" id="assign-teacher" className="modal-toggle" />
        <div className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg text-center">Add Rule</h3>
            <form className="add-form" onSubmit={handleAssignTeacher}>
              <div className="form-control">
                <label htmlFor="" className=" label">
                  <span className="label-text mb-2">Select Teachers </span>
                </label>
                <Select
                  options={teachers}
                  onChange={(choice) => setSelectedTeachers(choice)}
                  isMulti
                  
                  labelledBy="Select"
            />
              </div>
              <input type="submit" value="Add" className="btn w-32" />
            </form>
            <div className="modal-action">
              <label htmlFor="assign-teacher" className="btn bg-[red] ">
                Close!
              </label>
            </div>
          </div>
        </div>
      </div>
      <div id="add-modal">
        <input type="checkbox" id="my-modal-3" className="modal-toggle" />
        <div className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg text-center">Add Rule</h3>
            <form className="add-form" onSubmit={handleAddRule}>
              <div className="form-control">
                <label htmlFor="" className=" label">
                  <span className="label-text mb-2">Add Rule Image </span>
                </label>
                <input
                  type="file"
                  name="ruleILink"
                  id="ruleILink"
                  className="file-input w-full max-w-xs mb-2 input input-bordered border-black pl-0"
                />
              </div>
              <input type="submit" value="Add" className="btn w-32" />
            </form>
            <div className="modal-action">
              <label htmlFor="my-modal-3" className="btn bg-[red] ">
                Close!
              </label>
            </div>
          </div>
        </div>
      </div>
      <div id="update-modal  ">
            <input type="checkbox" id="my-modal" className="modal-toggle" />
            <div className="modal">
              <div className="modal-box">
                <h3 className="font-bold text-lg text-center">Update Exam</h3>
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
                    <div className="w-full lg:w-1/2">
                      <label htmlFor="" className="label">
                        Type
                      </label>
                      <select
                        name="type"
                        id="type"
                        className="input border-black input-bordered w-full "
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
                    <div className="w-full lg:w-1/2 ml-0 lg:ml-1">
                      <label htmlFor="" className="label">
                        Variation
                      </label>
                      <select
                        name="variation"
                        id="variation"
                        className="input border-black input-bordered w-full "
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
                      </select>
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
                        defaultValue={
                          singleExam?.startTime?.split(":00.000Z")[0]
                        }
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
                  <div className="form-control flex flex-col lg:flex-row justify-between items-start lg:items-start">
                    {
                      singleExam.examVariation===1 && <>
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
                      </>
                    }
                    {
                      singleExam.examVariation!==1 && <div className="w-full lg:w-1/4">
                      <label htmlFor="" className="label">
                        Total Marks
                      </label>
                      <input
                        type="number"
                        className="input w-full input-bordered  border-black "
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
                    }
                    <div className="w-full lg:w-1/3">
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
                  <div className="form-control flex flex-col lg:flex-row justify-between items-start lg:items-center">
                    <div className="w-full lg:w-1/3">
                      <label htmlFor="" className="label">
                        Negative Marking (%)
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
                        id="ssc"
                        type="checkbox"
                        name="ssc"
                        checked={sscChecked}
                        onChange={() => setSscChecked(!sscChecked)}
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
                        id="hsc"
                        type="checkbox"
                        name="hsc"
                        checked={hscChecked}
                        onChange={() => setHscChecked(!hscChecked)}
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
                onChange={(e) => setIsText(!isText)}
                required
              >
                <option value={true}>Text</option>
                <option value={false}>Image</option>
              </select>
              {isText === true ? (
                <>
                  <label htmlFor="" className=" label">
                    <span className="label-text">Write Down the question </span>
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
                {isText === true &&
                  numberOfOptions > 0 &&
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
        {/* written modal  */}
        <input type="checkbox" id="written-modal" className="modal-toggle" />
        <div className="modal modal-middle ml:0 lg:ml-56">
          <div className="modal-box w-11/12 max-w-5xl h-11/12">
            <form className="add-form" onSubmit={handleAddWrittenQuestion}>
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
                onChange={(e) => handleChangeNumberOfInput(e)}
                required
              />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-4">
                { numberOfOptions > 0 &&
                  [...Array(numberOfOptions).keys()].map((id) => {
                    return (
                      <div key={id}>
                        <div>
                          <label htmlFor="" className="label-text">
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
        <input type="checkbox" id="both-modal" className="modal-toggle" />
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
                onChange={(e) => setIsText(!isText)}
                required
              >
                <option value={true}>Text</option>
                <option value={false}>Image</option>
              </select>
              {isText === true ? (
                <>
                  <label htmlFor="" className=" label">
                    <span className="label-text">Write Down the question </span>
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
                {isText === true &&
                  numberOfOptions > 0 &&
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
                <input
                  type="submit"
                  value="Add Question"
                  className="btn w-32 "
                />
              </div>
            </form>
            <div className="modal-action">
              <label htmlFor="both-modal" className="btn bg-red text-white">
                Close
              </label>
            </div>
          </div>
        </div>
      </div>
      <PopUpModal
        modalData={selectedExamId}
        remove={deactivateExam}
      ></PopUpModal>
    </div>
  );
};

export default ShowExam;
