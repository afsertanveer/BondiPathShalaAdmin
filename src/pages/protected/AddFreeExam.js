import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import axios from "../../utils/axios";
import Loader from "../../Shared/Loader";
import { toast } from "react-hot-toast";

const AddFreeExam = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedVariation, setSelectedVariation] = useState(1);
  const [isSSC, setIsSSC] = useState(false);
  const [isHSC, setIsHSC] = useState(false);
  const [freeCourseId,setFreeCourseId] = useState('');
  const [freeSubjecteId,setFreeSubjecteId] = useState('');


  const handleAddExam = async (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.exam.value;
    const startTime = form.start_time.value;
    const endTime = form.end_time.value;
    const duration = parseInt(form.duration.value);
    const totalQuestionMcq = parseInt(form.total_questions.value);
    const marksPerMcq = parseInt(form.marks_per_question.value);
    const status = true;
    const negativeMarks = parseFloat(form.negative_marking.value);
    const iLink = form.iLink.files[0];
    const formdata = new FormData();
    formdata.append("iLink", iLink);
    const exam = {
      name,
      examType:-1,
      examVariation: 1,
      examFreeOrNot: true,
      startTime,
      endTime,
      duration,
      totalQuestionMcq,
      marksPerMcq,
      status,
      subjectId: freeSubjecteId,
      courseId: freeCourseId,
      sscStatus: isSSC,
      hscStatus: isHSC,
      negativeMarks,
    };
    await axios
    .post(`/api/exam/createexam?exam=${JSON.stringify(exam)}`, formdata, {
      headers: {
        "Content-Type": "multipart/ form-data",
      },
    })
    .then(({ data }) => {
      toast.success("Free Exam Added Succesfully");
      window.location.reload(false);
    });
  };
  useEffect(() => {
    setIsLoading(true);
    axios.get("/api/exam/freecoursesub?course=Free&sub=Free").then(({ data }) => {
        setFreeCourseId(data[0]._id);
        setFreeSubjecteId(data[1]._id);
        setIsLoading(false);
    });
  }, []);
  return (
    <div>
      <div className="w-full lg:w-2/3 py-2  bg-white flex flex-col mx-auto  px-4  rounded-lg  shadow-lg ">
        <h1 className="text-3xl  font-bold text-center">ADD FREE EXAM</h1>
        {isLoading && <Loader></Loader>}
        <div className="px-4 lg:px-10">
          <form className="add-form" onSubmit={handleAddExam}>
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
                required
              />
            </div>
            <div className="flex flex-col lg:flex-row gap-2 w-full">
            <div className="w-full lg:w-1/4">
                <label htmlFor="" className="label">
                  Variation
                </label>
                <input 
                        type="text" 
                        name="subject" 
                        id="subject" 
                        defaultValue={"MCQ"} 
                        className="input w-full  border-black input-bordered " 
                        disabled  
                    />     
              </div>
                <div className="form-control w-full lg:w-1/2 mr-0 lg:mr-4">
                    <label className="label" htmlFor="">
                    Course
                    </label>
                    <input 
                        type="text" 
                        name="course" 
                        id="course" 
                        defaultValue={"Free"} 
                        className="input w-full  border-black input-bordered " 
                        disabled  
                    />     
                </div>
                <div className="form-control w-full lg:w-1/2 mr-0 lg:mr-4">
                    <label className="label" htmlFor="">
                    Subject
                    </label>
                    <input 
                        type="text" 
                        name="subject" 
                        id="subject" 
                        defaultValue={"Free"} 
                        className="input w-full  border-black input-bordered " 
                        disabled  
                    />     
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
                  min="1"
                  onInput={(e) =>
                    e.target.value < 0 ? (e.target.value = "") : e.target.value
                  }
                  required
                />
                <span className="text-red text-sm ml-0 lg:ml-2">(minutes)</span>
              </div>
            </div>
            <div className="form-control flex flex-col lg:flex-row justify-between items-start lg:items-start">
              <div className="w-full lg:w-1/3">
                <label htmlFor="" className="label">
                  Total Question
                </label>
                <input
                  type="number"
                  className="input w-full input-bordered  border-black "
                  name="total_questions"
                  id="total_questions"
                  onInput={(e) =>
                    e.target.value < 0 ? (e.target.value = "") : e.target.value
                  }
                  required
                />
              </div>
              <div className="w-full lg:w-1/3">
                <label htmlFor="" className="label">
                  Marks Per Question
                </label>
                <input
                  type="number"
                  className="input w-full input-bordered  border-black "
                  name="marks_per_question"
                  id="marks_per_question"
                  onInput={(e) =>
                    e.target.value < 0 ? (e.target.value = "") : e.target.value
                  }
                  required
                />
              </div>
            
            </div>
            <div className="form-control flex flex-col lg:flex-row justify-between items-start lg:items-center">
              <div className="w-full lg:w-1/3">
                <label htmlFor="" className="label">
                  Negative Marking (%) (Per Question)
                </label>
                <input
                  type="number"
                  className="input w-full input-bordered  border-black "
                  name="negative_marking"
                  id="negative_marking"
                  step="any"
                  onChange={(e) =>
                    e.target.value < 0 ? (e.target.value = "") : e.target.value
                  }
                  required
                />
              </div>
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
            <div className="form-control">
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

export default AddFreeExam;
