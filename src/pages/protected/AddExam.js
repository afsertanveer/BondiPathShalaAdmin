import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import axios from "../../utils/axios";
import Loader from "../../Shared/Loader";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AddExam = () => {
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedType, setSelectedType] = useState(-1);
  const [selectedVariation, setSelectedVariation] = useState(-1);
  const [isFree, setIsFree] = useState(false);
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
    const totalQuestionMcq = parseInt(form.total_questions.value);
    const marksPerMcq = parseInt(form.marks_per_question.value);
    const totalMarksMcq = parseInt(form.total_marks.value);
    const status = true;
    const negativeMarks = parseFloat(form.negative_marking.value);
    const iLink = form.iLink.files[0];
    const formdata = new FormData();
    formdata.append("iLink", iLink);
    const exam = {
      name,
      examType: parseInt(selectedType),
      examVariation: parseInt(selectedVariation),
      examFreeOrNot: isFree,
      startTime,
      endTime,
      duration,
      totalQuestionMcq,
      marksPerMcq,
      totalMarksMcq,
      status,
      subjectId: selectedSubject,
      courseId: selectedCourse,
      sscStatus: isSSC,
      hscStatus: isHSC,
      negativeMarks,
    };
    await axios
      .post(`api/exam//createexam?exam=${JSON.stringify(exam)}`, formdata, {
        headers: {
          "Content-Type": "multipart/ form-data",
        },
      })
      .then(({ data }) => {
        toast.success("Exam Added Succesfully");
        navigate("/dashboard");
      });
    console.log(exam);
  };
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
    console.log(isFree);
  }, [selectedCourse,isFree]);
  return (
    <div>
      <div className="w-full lg:w-2/3 py-2  bg-white flex flex-col mx-auto  px-4  rounded-lg  shadow-lg ">
        <h1 className="text-3xl  font-bold text-center">Add EXAM</h1>
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
            <div className="form-control flex flex-col lg:flex-row justify-between">
              <div className="w-full lg:w-1/4">
                <label htmlFor="" className="label">
                  Exam Type
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
              <div className="w-full lg:w-1/4">
                <label htmlFor="" className="label">
                  Exam Variation
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
              <div className="w-full lg:w-1/4">
                <div className="flex items-center mt-0 lg:mt-5 ">
                  <input
                    type="checkbox"             
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
            <div className="form-control flex flex-col lg:flex-row justify-between  items-start lg:items-center">
              <div className="w-full lg:w-1/2 mr-0 lg:mr-4">
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
              <div className="w-full lg:w-1/2">
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
              <div className="w-full lg:w-1/4">
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
              <div className="w-full lg:w-1/4">
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
              <div className="w-full lg:w-1/4">
                <label htmlFor="" className="label">
                  Total Marks
                </label>
                <input
                  type="number"
                  className="input w-full input-bordered  border-black  mb-3"
                  name="total_marks"
                  id="total_marks"
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
                  Negative Marking (Per Question)
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

export default AddExam;
