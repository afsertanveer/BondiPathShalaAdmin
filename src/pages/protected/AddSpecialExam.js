import React, { Fragment } from "react";
import { useEffect } from "react";
import { useState } from "react";
import axios from "../../utils/axios";
import Loader from "../../Shared/Loader";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

const AddSpecialExam = () => {
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [selectedOptionalSubjects, setSelectedOptionalSubjects] = useState([]);
  const [selectedVariation, setSelectedVariation] = useState(-1);
  const [totalSubject, setTotalSubject] = useState(-1);
  const [totalOptionalSubject, setTotalOptionalSubject] = useState(-1);
  const [examSubjectNumber, setExamSubjectNumber] = useState(-1);
  const [isSSC, setIsSSC] = useState(false);
  const [isHSC, setIsHSC] = useState(false);
  const [allSubjects, setAllSubjects] = useState([]);
  const navigate = useNavigate();
  

  const handleAddExam = async (e) => {
    e.preventDefault();
    let totalQuestionMcq = -1,
      marksPerMcq = -1,
      totalMarks=0;
    const form = e.target;
    const name = form.exam.value;
    const startTime = form.start_time.value;
    const endTime = form.end_time.value;
    const status = true;
    let negativeMarks=null,mcqDuration=null,writtenDuration = null,writtenTotalQuestions=null,totalDuration=null,
    mcqTotalMarks=null,writtenTotalMarks=null;
    if(selectedVariation!=='2'){
      mcqDuration = form.mcq_duration.value;
      negativeMarks = parseInt(form.negative_marking.value);
      totalQuestionMcq=parseInt(form.mcq_total_questions.value);
      marksPerMcq=parseInt(form.marks_per_question.value);
      mcqTotalMarks = totalQuestionMcq*marksPerMcq;
    }else{
      writtenDuration = form.written_duration.value;
      writtenTotalQuestions = form.total_written_questions.value;
      writtenTotalMarks =form.total_written_marks.value;
    }
    if(selectedVariation==='3'){
      totalDuration= form.total_duration.value;
      totalMarks=form.total_marks.value;
    }
    const iLink = form.iLink.files[0];
    const formdata = new FormData();
    formdata.append("iLink", iLink);
    const svar = parseInt(selectedVariation);
    let oSubject = selectedOptionalSubjects;
    let selectedOsbuject = [];
    for(let i = 0 ; i<oSubject.length; i++){
      selectedOsbuject.push(oSubject[i].value);
      
    }
    let allSubjects = selectedSubjects;
    let selectedAllSubjects = [];
    let subjectQuestions = [];
    for(let i = 0 ; i<allSubjects.length; i++){
      selectedAllSubjects.push(allSubjects[i].value);
      if(selectedVariation==="1"){
        let obj ={
          subjectName:"",
          subjectId:"",
          numberOfQuestions:0
        };
        obj.subjectName = allSubjects[i].label;
        obj.subjectId = allSubjects[i].value;
        obj.numberOfQuestions = parseInt(document.getElementById(`${allSubjects[i].label}mcq`).value);
        subjectQuestions.push(obj);
      }if(selectedVariation==="2"){
        let obj ={
          subjectName:"",
          subjectId:"",
          numberOfQuestions:0
        };
        obj.subjectName = allSubjects[i].label;
        obj.subjectId = allSubjects[i].value;
        obj.numberOfQuestions = parseInt(document.getElementById(`${allSubjects[i].label}written`).value);
        subjectQuestions.push(obj);
      }else{
        let obj ={
          subjectName:"",
          subjectId:"",
          numberOfMcqQuestions:0,
          numberOfWrittenQuestions:0
        };
        obj.subjectName = allSubjects[i].label;
        obj.subjectId = allSubjects[i].value;
        obj.numberOfMcqQuestions = parseInt(document.getElementById(`${allSubjects[i].label}mcq`).value);
        obj.numberOfWrittenQuestions = parseInt(document.getElementById(`${allSubjects[i].label}written`).value);
        subjectQuestions.push(obj);
      }
    }
    console.log(subjectQuestions);
    formdata.append("name", name);
    formdata.append("courseId", selectedCourse);
    formdata.append("examVariation", svar);
    formdata.append("startTime", startTime);
    formdata.append("endTime", endTime);
    formdata.append("totalOptionalSubject",totalOptionalSubject)
    formdata.append("totalSubject",totalSubject);
    formdata.append("totalExamSubject",examSubjectNumber);
    formdata.append("subjects", selectedAllSubjects);
    formdata.append("optionalSubjects", selectedOsbuject);
    formdata.append("totalDuration",totalDuration);
    formdata.append("totalMarks",totalMarks);
    formdata.append("mcqDuration", mcqDuration);
    formdata.append("totalQuestionMcq", totalQuestionMcq);
    formdata.append("subjectQuestions",subjectQuestions);
    formdata.append("totalQuestionMcq",totalQuestionMcq)
    formdata.append("marksPerMcq",marksPerMcq)
    formdata.append("marksPerMcq", marksPerMcq);    
    formdata.append("negativeMarks", negativeMarks);
    formdata.append("mcqTotalMarks", mcqTotalMarks);
    formdata.append("writtenDuration", writtenDuration);
    formdata.append("writtenTotalQuestions", writtenTotalQuestions);
    formdata.append("writtenTotalMarks", writtenTotalMarks);
    formdata.append("status", status);
    formdata.append("sscStatus", isSSC);
    formdata.append("hscStatus", isHSC);
    formdata.append("totalMarksMcq", totalMarks);
    for (const value of formdata.values()) {
      console.log(value);
    }
    // await axios
    //   .post(`/api/exam/createexam`, formdata, {
    //     headers: {
    //       "Content-Type": "multipart/ form-data",
    //     },
    //   })
    //   .then(({ data }) => {
    //     console.log(data);
    //     toast.success("Exam Added Succesfully");
    //     navigate("/dashboard");
    //   });
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
          let options = [];
          setSubjects(data.data);
          for (let i = 0; i < data.data.length; i++) {
            let obj = {
              value: "0",
              label: "0",
            };
            obj.value = data.data[i]._id;
            obj.label = data.data[i].name;
            options.push(obj);
          }
          setAllSubjects(options);
          setIsLoading(false);
        });
    } else {
      setSubjects([]);
    }
  }, [selectedCourse]);
  return (
    <div>
      <div className="w-full lg:w-2/3 py-2  bg-white flex flex-col mx-auto  px-4  rounded-lg  shadow-lg ">
        <h1 className="text-3xl  font-bold text-center">Add Special EXAM</h1>
        {isLoading && <Loader></Loader>}
        <div className="px-4 lg:px-10">
          <form className="add-form" onSubmit={handleAddExam}>
            <div className="form-control">
              <label htmlFor="" className=" label">
                <span className="label-text">Name </span>
              </label>
              <input
                className="input input-bordered  border-black"
                type="text"
                name="exam"
                id="exam"
                placeholder="Subject Name"
                required
              />
            </div>
            <div className="form-control">
            <label className="label" htmlFor="">
              Select Course
            </label>
            <select
              name="course"
              id="course"
              className="input w-full  border-black input-bordered "
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
            <div className="form-control flex flex-col lg:flex-row justify-between items-start lg:items-center">
              <div className="w-full lg:w-1/3 mr-0 lg:mr-2">
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
                  <option value="">Select Variation</option>
                  <option value={1}>MCQ</option>
                  <option value={2}>Written</option>
                  <option value={3}>Both</option>
                </select>
              </div>
              <div className="w-full lg:w-1/3 mr-0 lg:mr-2">
                <label className="label" htmlFor="">
                  Start Time
                </label>
                <input
                  type="datetime-local"
                  className="input input-bordered w-full  border-black "
                  name="start_time"
                  id="start_time"
                  required
                />
              </div>
              <div className="w-full lg:w-1/3">
                <label className="label" htmlFor="">
                  End Time
                </label>
                <input
                  type="datetime-local"
                  className="input input-bordered w-full  border-black "
                  name="end_time"
                  id="end_time"
                  required
                />
              </div>
            </div>
            <div className="form-control flex flex-col lg:flex-row gap-2 ">
              <div className="w-full">
                <label htmlFor="" className="label">
                  Number of Subject (Optional)
                </label>
                <select
                  name="number_of_optional_subject"
                  id="number_of_optional_subject"
                  className="input border-black input-bordered w-full "
                  onChange={(e) => setTotalOptionalSubject(e.target.value)}
                  required
                >
                  <option value="">--Select---</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                </select>
              </div>
              <div className="w-full">
                <label htmlFor="" className="label">
                  Number of Subject (All)
                </label>
                <select
                  name="type"
                  id="type"
                  className="input border-black input-bordered w-full "
                  onChange={(e) => setTotalSubject(e.target.value)}
                  required
                >
                  <option value="">--Select---</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                  <option value={5}>5</option>
                  <option value={6}>6</option>
                </select>
              </div>
              <div className="w-full">
                <label htmlFor="" className="label">
                 Number of Exam Subject 
                </label>
                <select
                  name="nes"
                  id="nes"
                  className="input border-black input-bordered w-full "
                  onChange={(e) => setExamSubjectNumber(e.target.value)}
                  required
                >
                  <option value="">--Select---</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                  <option value={5}>5</option>
                  <option value={6}>6</option>
                </select>
              </div>
            </div>
            <div className="form-control flex flex-col lg:flex-row justify-between  items-start lg:items-center">
            <div className="w-full lg:w-1/2 mr-0 lg:mr-2">
            <label className="label ml-0 lg:ml-2" htmlFor="">
              Select Optional Subject
            </label>

            <Select
              options={allSubjects}
              onChange={(choice) => setSelectedOptionalSubjects(choice)}
              isMulti
              isDisabled={
                selectedOptionalSubjects.length === parseInt(totalOptionalSubject)
              }
              labelledBy="Select"
            />
          </div>
              <div className="w-full lg:w-1/2">
                <label className="label ml-0 lg:ml-2" htmlFor="">
                  Select Subject
                </label>

                <Select
                  options={allSubjects}
                  onChange={(choice) => setSelectedSubjects(choice)}
                  isMulti
                  isDisabled={
                    selectedSubjects.length === parseInt(totalSubject)
                  }
                  labelledBy="Select"
                />
              </div>
            </div>
            {selectedVariation === "1" && selectedSubjects.length > 0 && (
              <Fragment>
                <div className="form-control">
                  <div className="w-full">
                    <label className="label" htmlFor="">
                      MCQ Duration
                    </label>
                    <input
                      type="mumber"
                      className="input w-full input-bordered border-black "
                      name="mcq_duration"
                      id="mcq_duration"
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
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-2">
                  {selectedSubjects.map((sd, idx) => {
                    return (
                      <div className="w-full">
                        <label htmlFor="" className="label">
                          {sd.label}
                        </label>
                        <input
                          key={idx}
                          type="number"
                          className="input w-full input-bordered  border-black "
                          name={sd.label+'mcq'}
                          id={sd.label+'mcq'}
                          min={1}
                          placeholder="number of questions"
                          required
                        />
                      </div>
                    );
                  })}
                </div>

                <div className="form-control flex flex-col lg:flex-row justify-between items-start lg:items-start">
                  <div className="w-full lg:w-1/3 mr-0 lg:mr-2">
                    <label htmlFor="" className="label">
                      Total Question
                    </label>
                    <input
                      type="number"
                      className="input w-full input-bordered  border-black "
                      name="mcq_total_questions"
                      id="mcq_total_questions"
                      onInput={(e) =>
                        e.target.value < 0
                          ? (e.target.value = "")
                          : e.target.value
                      }
                      required
                    />
                  </div>
                  <div className="w-full lg:w-1/3 mr-0 lg:mr-2">
                    <label htmlFor="" className="label">
                      Marks Per Question
                    </label>
                    <input
                      type="number"
                      className="input w-full input-bordered  border-black "
                      name="marks_per_question"
                      id="marks_per_question"
                      onInput={(e) =>
                        e.target.value < 0
                          ? (e.target.value = "")
                          : e.target.value
                      }
                      required
                    />
                  </div>
                  <div className="w-full lg:w-1/3">
                    <label htmlFor="" className="label">
                      Negative Marking (%)
                    </label>
                    <input
                      type="number"
                      className="input w-full input-bordered  border-black "
                      name="negative_marking"
                      id="negative_marking"
                      step="any"
                      onChange={(e) =>
                        e.target.value < 0
                          ? (e.target.value = "")
                          : e.target.value
                      }
                      required
                    />
                  </div>
                </div>
              </Fragment>
            )}
            {selectedVariation === "2" && (
            <Fragment>
            <div className="form-control">
                  <div className="w-full">
                    <label className="label" htmlFor="">
                      Written Duration
                    </label>
                    <input
                      type="mumber"
                      className="input w-full input-bordered border-black "
                      name="written_duration"
                      id="written_duration"
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
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-x-2">
              {selectedSubjects.map((sd, idx) => {
                return (
                  <div className="w-full">
                    <label htmlFor="" className="label">
                      {sd.label}
                    </label>
                    <input
                      key={idx}
                      type="number"
                      className="input w-full input-bordered  border-black "
                      name={sd.label+'written'}
                      id={sd.label+'written'}
                      min={1}
                      placeholder="number of questions"
                      required
                    />
                  </div>
                );
              })}
            </div>
            <div className="form-control flex flex-col lg:flex-row justify-between  items-start lg:items-center">
              <div className="w-full lg:w-1/2 mr-0 lg:mr-2">
                    <label htmlFor="" className="label">
                      Total Questions
                    </label>
                    <input
                      type="number"
                      className="input w-full input-bordered  border-black "
                      name="total_written_questions"
                      id="total_written_questions"
                      min={1}
                      placeholder="number of questions"
                      required
                    />
              </div>
              <div className="w-full lg:w-1/2 mr-0 lg:mr-2">
                    <label htmlFor="" className="label">
                      Total Marks
                    </label>
                    <input
                      type="number"
                      className="input w-full input-bordered  border-black "
                      name="total_written_marks"
                      id="total_written_marks"
                      min={1}
                      placeholder="number of questions"
                      required
                    />
              </div>
            </div>
            </Fragment>
            )}
            {
              selectedVariation === "3" && <Fragment>
              <div className="form-control flex flex-col lg:flex-row justify-between items-start lg:items-start">
                  <div className="w-full lg:w-1/2 mr-0 lg:mr-2">
                    <label htmlFor="" className="label">
                      Total Duration
                    </label>
                    <input
                      type="number"
                      className="input w-full input-bordered  border-black "
                      name="total_duration"
                      id="total_duration"
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
                  <div className="w-full lg:w-1/2 mr-0 lg:mr-2">
                    <label htmlFor="" className="label">
                      Total Marks
                    </label>
                    <input
                      type="number"
                      className="input w-full input-bordered  border-black "
                      name="total_marks"
                      id="total_marks"
                      onInput={(e) =>
                        e.target.value < 0
                          ? (e.target.value = "")
                          : e.target.value
                      }
                      required
                    />
                  </div>
                </div>
              <label htmlFor="" className="label text-lg font-bold">
              MCQ: 
              </label>
              <div className="form-control">
                  <div className="w-full">
                    <label className="label" htmlFor="">
                      MCQ Duration
                    </label>
                    <input
                      type="mumber"
                      className="input w-full input-bordered border-black "
                      name="mcq_duration"
                      id="mcq_duration"
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
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-2">
                  {selectedSubjects.map((sd, idx) => {
                    return (
                      <div className="w-full">
                        <label htmlFor="" className="label">
                          {sd.label}
                        </label>
                        <input
                          key={idx}
                          type="number"
                          className="input w-full input-bordered  border-black "
                          name={sd.label+'mcq'}
                          id={sd.label+'mcq'}
                          min={1}
                          placeholder="number of questions"
                          required
                        />
                      </div>
                    );
                  })}
                </div>
                <div className="form-control flex flex-col lg:flex-row justify-between items-start lg:items-start">
                  <div className="w-full lg:w-1/3 mr-0 lg:mr-2">
                    <label htmlFor="" className="label">
                      Total Question
                    </label>
                    <input
                      type="number"
                      className="input w-full input-bordered  border-black "
                      name="mcq_total_questions"
                      id="mcq_total_questions"
                      onInput={(e) =>
                        e.target.value < 0
                          ? (e.target.value = "")
                          : e.target.value
                      }
                      required
                    />
                  </div>
                  <div className="w-full lg:w-1/3 mr-0 lg:mr-2">
                    <label htmlFor="" className="label">
                      Marks Per Question
                    </label>
                    <input
                      type="number"
                      className="input w-full input-bordered  border-black "
                      name="marks_per_question"
                      id="marks_per_question"
                      onInput={(e) =>
                        e.target.value < 0
                          ? (e.target.value = "")
                          : e.target.value
                      }
                      required
                    />
                  </div>
                  <div className="w-full lg:w-1/3">
                    <label htmlFor="" className="label">
                      Negative Marking (%)
                    </label>
                    <input
                      type="number"
                      className="input w-full input-bordered  border-black "
                      name="negative_marking"
                      id="negative_marking"
                      step="any"
                      onChange={(e) =>
                        e.target.value < 0
                          ? (e.target.value = "")
                          : e.target.value
                      }
                      required
                    />
                  </div>
                </div>
                <div className="form-control flex flex-col lg:flex-row justify-between items-start lg:items-start">
                <div className="w-full">
                  <label htmlFor="" className="label">
                    MCQ Total Marks
                  </label>
                  <input
                    type="number"
                    className="input w-full input-bordered  border-black "
                    name="mcq_total_marks"
                    id="mcq_total_marks"
                    onInput={(e) =>
                      e.target.value < 0
                        ? (e.target.value = "")
                        : e.target.value
                    }
                    required
                  />
                </div>
              </div>
              <label htmlFor="" className="label text-lg font-bold">
              Written: 
              </label>
              <div className="form-control">
                  <div className="w-full">
                    <label className="label" htmlFor="">
                      Written Duration
                    </label>
                    <input
                      type="mumber"
                      className="input w-full input-bordered border-black "
                      name="written_duration"
                      id="written_duration"
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
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-x-2">
              {selectedSubjects.map((sd, idx) => {
                return (
                  <div className="w-full">
                    <label htmlFor="" className="label">
                      {sd.label}
                    </label>
                    <input
                      key={idx}
                      type="number"
                      className="input w-full input-bordered  border-black "
                      name={sd.label+'written'}
                      id={sd.label+'written'}
                      min={1}
                      placeholder="number of questions"
                      required
                    />
                  </div>
                );
              })}
            </div>
            <div className="form-control flex flex-col lg:flex-row justify-between  items-start lg:items-center">
              <div className="w-full lg:w-1/2 mr-0 lg:mr-2">
                    <label htmlFor="" className="label">
                      Total Questions
                    </label>
                    <input
                      type="number"
                      className="input w-full input-bordered  border-black "
                      name="total_written_questions"
                      id="total_written_questions"
                      min={1}
                      placeholder="number of questions"
                      required
                    />
              </div>
              <div className="w-full lg:w-1/2 mr-0 lg:mr-2">
                    <label htmlFor="" className="label">
                      Total Marks
                    </label>
                    <input
                      type="number"
                      className="input w-full input-bordered  border-black "
                      name="total_written_marks"
                      id="total_written_marks"
                      min={1}
                      placeholder="number of questions"
                      required
                    />
              </div>
            </div>
              </Fragment>
            }
            <div className="form-control flex flex-col lg:flex-row justify-between items-start lg:items-center">
              <div className="w-full lg:w-1/2 mr-0 lg:mr-2">
                <label htmlFor="" className="label">
                  Exam Image
                </label>
                <input
                  type="file"
                  name="iLink"
                  id="iLink"
                  className="file-input w-full input-bordered  border-black "
                  required
                />
              </div>
              <div class="w-full lg:w-1/4 mr-0 lg:mr-2">
                <div className="flex items-center mt-0 lg:mt-5 ">
                  <input
                    id="disabled-checked-checkbox"
                    type="checkbox"
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
              </div>
              <div class="w-full lg:w-1/4 mr-0 lg:mr-2">
              <div className="flex items-center mt-0 lg:mt-5 ">
              <input
                id="disabled-checked-checkbox"
                type="checkbox"
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
            </div>
            <div className="form-control mt-2">
              <input
                type="submit"
                value="Add Exam"
                className="btn w-[150px] mt-4"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddSpecialExam;