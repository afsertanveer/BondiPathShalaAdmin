import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import axios from "../../utils/axios";
import Loader from "../../Shared/Loader";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AddBothExam = () => {
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedType, setSelectedType] = useState(-1);
  const [isSSC, setIsSSC] = useState(false);
  const [isHSC, setIsHSC] = useState(false);
  const navigate = useNavigate();

  const handleAddExam = async (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.exam.value;
    const startTime = form.start_time.value;
    const endTime = form.end_time.value;
    const duration = parseInt(form.duration.value);
    const totalQuestionMcq = parseInt(form.mcq_questions.value);
    const marksPerMcq = parseInt(form.mcq_mpq.value);
    const mcqTotalMarks = parseInt(form.mcq_total_marks.value);
    const writtenTotalMarks = parseInt(form.written_total_marks.value);
    const mcqDuration = parseInt(form.mcq_duration.value);
    const writtenDurartion = parseInt(form.written_duration.value);
    const totalQuestionWritten = parseInt(form.written_questions.value);
    const totalMarks = form.total_marks.value;
    const status = true;
    const negativeMarks = parseFloat(form.negative_marking.value);
    const iLink = form.iLink.files[0];
    const formdata = new FormData();
    formdata.append("iLink", iLink);
    const stype = parseInt(selectedType);
    formdata.append("name",name);
    formdata.append("examType", stype);
    formdata.append("startTime",startTime);
    formdata.append("endTime",endTime);
    formdata.append("totalDuration",duration);
    formdata.append("mcqDuration",mcqDuration);
    formdata.append("writtenDurartion",writtenDurartion);
    formdata.append("totalQuestionWritten",totalQuestionWritten);
    formdata.append("totalQuestionMcq",totalQuestionMcq);
    formdata.append("totalMarksMcq",mcqTotalMarks);
    formdata.append("totalMarksWritten",writtenTotalMarks);
    formdata.append("marksPerMcq",marksPerMcq);
    formdata.append("status",status);
    formdata.append("subjectId",selectedSubject);
    formdata.append("courseId",selectedCourse);
    formdata.append("sscStatus",isSSC);
    formdata.append("hscStatus",isHSC);
    formdata.append("negativeMarks",negativeMarks);
    formdata.append("totalMarks",totalMarks);
    console.log(formdata);
    await axios
      .post(`/api/both/createbothexam`, formdata, {
        headers: {
          "Content-Type": "multipart/ form-data",
        },
      })
      .then(({ data }) => {
        console.log(data);
        toast.success("Full Exam Added Succesfully");
        navigate("/dashboard");
      });
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
        });
    } else {
      setSubjects([]);
    }
  }, [selectedCourse]);
  return (
    <div>
      <div className="w-full lg:w-2/3 py-2  bg-white flex flex-col mx-auto  px-4  rounded-lg  shadow-lg ">
        <h1 className="text-3xl  font-bold text-center">Add Both Exam</h1>
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
            <div className="form-control flex flex-col lg:flex-row gap-2 ">
              <div className="w-full lg:w-1/3 mr-0 lg:mr-4">
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
                  <option value="">Select Type</option>
                  <option value={1}>Daily</option>
                  <option value={2}>Weekly</option>
                  <option value={3}>Monthly</option>
                </select>
              </div>
              <div className="w-full lg:w-1/3 mr-0 lg:mr-4">
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
              <div className="w-full lg:w-1/3">
                <label className="label ml-0 lg:ml-2" htmlFor="">
                  Select Subject
                </label>
                <select
                  name="subject"
                  id="subject"
                  className="input w-full  border-black input-bordered"
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
            <div className="form-control flex flex-col lg:flex-row gap-2 ">
              <div className="w-full lg:w-1/3 mr-0 lg:mr-4">
                <label className="label" htmlFor="">
                  Total Duration
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
              <div className="w-full lg:w-1/3 mr-0 lg:mr-4">
                <label className="label" htmlFor="">
                 Duration (MCQ)
                </label>
                <input
                  type="mumber"
                  className="input w-full input-bordered border-black "
                  name="mcq_duration"
                  id="mcq_duration"
                  min="1"
                  onInput={(e) =>
                    e.target.value < 0 ? (e.target.value = "") : e.target.value
                  }
                  required
                />
                <span className="text-red text-sm ml-0 lg:ml-2">(minutes)</span>
              </div>
              <div className="w-full lg:w-1/3 mr-0 lg:mr-4">
                <label className="label" htmlFor="">
                   Duration(Writen)
                </label>
                <input
                  type="mumber"
                  className="input w-full input-bordered border-black "
                  name="written_duration"
                  id="written_duration"
                  min="1"
                  onInput={(e) =>
                    e.target.value < 0 ? (e.target.value = "") : e.target.value
                  }
                  required
                />
                <span className="text-red text-sm ml-0 lg:ml-2">(minutes)</span>
              </div>
            </div>
            <div className="w-full flex">
            <p className="text-lg font-bold">MCQ:</p> 
            </div>
            <div className="form-control flex flex-col lg:flex-row justify-between items-start lg:items-start">
            <div className="w-full lg:w-1/4 mr-0 lg:mr-4">
                <label htmlFor="" className="label">
                  Total  Questions
                </label>
                <input
                  type="number"
                  className="input w-full input-bordered  border-black "
                  name="mcq_questions"
                  id="mcq_questions"
                  onInput={(e) =>
                    e.target.value < 0 ? (e.target.value = "") : e.target.value
                  }
                  required
                />
              </div>
              <div className="w-full lg:w-1/4 mr-0 lg:mr-4">
                <label htmlFor="" className="label">
                  Marks Per Question
                </label>
                <input
                  type="number"
                  className="input w-full input-bordered  border-black "
                  name="mcq_mpq"
                  id="mcq_mpq"
                  onInput={(e) =>
                    e.target.value < 0 ? (e.target.value = "") : e.target.value
                  }
                  required
                />
              </div>        
              <div className="w-full lg:w-1/4 mr-0 lg:mr-4">
                <label htmlFor="" className="label">
                  Marks
                </label>
                <input
                  type="number"
                  className="input w-full input-bordered  border-black "
                  name="mcq_total_marks"
                  id="mcq_total_marks"
                  step="any"
                  onChange={(e) =>
                    e.target.value < 0 ? (e.target.value = "") : e.target.value
                  }
                  required
                />
              </div>    
              <div className="w-full lg:w-1/4 mr-0 lg:mr-4">
                <label htmlFor="" className="label">
                  Negative Marking
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
            </div>
            <div className="w-full flex">
            <p className="text-lg font-bold">Written:</p> 
            </div>
            <div className="form-control flex flex-col lg:flex-row justify-between items-start lg:items-start">
              <div className="w-full lg:w-1/4 mr-0 lg:mr-4">
                <label htmlFor="" className="label">
                   Total Questions
                </label>
                <input
                  type="number"
                  className="input w-full input-bordered  border-black "
                  name="written_questions"
                  id="written_questions"
                  onInput={(e) =>
                    e.target.value < 0 ? (e.target.value = "") : e.target.value
                  }
                  required
                />
              </div>
              <div className="w-full lg:w-1/4 mr-0 lg:mr-4">
                <label htmlFor="" className="label">
                 Written Total Marks
                </label>
                <input
                  type="number"
                  className="input w-full input-bordered  border-black "
                  name="written_total_marks"
                  id="written_total_marks"
                  onInput={(e) =>
                    e.target.value < 0 ? (e.target.value = "") : e.target.value
                  }
                  required
                />
              </div>    
              <div className="w-full lg:w-1/4 flex items-center mt-0 lg:mt-5 mr-0 lg:mr-4 ">
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
                <div className="w-full lg:w-1/4 flex items-center mt-0 lg:mt-5 ">
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
            <div className="form-control flex flex-col lg:flex-row justify-between items-start lg:items-start">
              <div className="w-full ">
                <label htmlFor="" className="label">
                  Total Marks
                </label>
                <input
                  type="number"
                  className="input w-full input-bordered  border-black font-extrabold "
                  placeholder="Total Marks"
                  name="total_marks"
                  id="total_marks"
                  min={1}
                  required
                />
              </div>            
            </div>
            <div className="form-control flex flex-col lg:flex-row justify-between items-start lg:items-center">
              
              
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

export default AddBothExam;
