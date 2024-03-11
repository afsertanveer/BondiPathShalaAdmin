import { useEffect } from 'react'
import { useState } from 'react'
import axios from '../../utils/axios'
import Loader from '../../Shared/Loader'
import { toast } from 'react-hot-toast'
import Select from 'react-select'
import { singleColumnGrid, twoColumnGrid } from '../../utils/globalVariables'

const AddSpecialMcq = () => {
  const [courses, setCourses] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState('')
  const [selectedSubjects, setSelectedSubjects] = useState([])
  const [selectedOptionalSubjects, setSelectedOptionalSubjects] = useState([])
  const [selectedCurriculum, setSelectedCurriculum] = useState(null)
  const [curriculums, setCurriculums] = useState([])
  const [numberOfSubject, setNumberOfSubject] = useState(-1)
  const [numberOfOptionalSubject, setNumberOfOptionalSubject] = useState(0)
  const [numberOfFixedSubject, setNumberOfFixedSubject] = useState(-1)
  const [examSubjectNumber, setExamSubjectNumber] = useState(-1)
  const [isOptionalAvailable, setIsOptionalAvailable] = useState(false)
  const [selectedFixedSubject, setSelectedFixedSubject] = useState([])
  const [allSubjects, setAllSubjects] = useState([])
  const [questionType, setQuestionType] = useState(0)
  const [numberOfOptions, setNumberOfOptions] = useState(4)
  const [numberOfRetakes, setNumberOfRetakes] = useState(4)
  const [numberOfSet, setNumberOfSet] = useState(4)
  const [isAdmission, setIsAdmission] = useState(false)

  const handleAddExam = async (e) => {
    e.preventDefault()
    const form = e.target
    const name = form.exam.value
    const startTime = form.start_time.value
    const endTime = form.end_time.value
    const duration = form.total_duration.value
    const totalMarks = form.total_marks.value
    const totalQuestions = form.mcq_total_questions.value
    const marksPerMcq = form.marks_per_question.value
    const negativeMarks = form.negative_marking.value
    const status = true
    const exam = {
      name,
      startTime,
      endTime,
      duration,
      totalMarks,
      totalQuestions,
      marksPerMcq,
      negativeMarks,
      status,
      selectedCourse,
      numberOfSubject,
      numberOfOptionalSubject,
      numberOfFixedSubject,
      examSubjectNumber,
      selectedOptionalSubjects,
      selectedFixedSubject,
      isOptionalAvailable,
      isAdmission,
      selectedCurriculum,
      selectedSubjects,
      questionType,
      numberOfOptions,
      numberOfRetakes,
      numberOfSet,
    }
    console.log(exam)
  }
  useEffect(() => {
    setIsLoading(true)
    axios.get('/api/curriculum/getcurriculums').then(({ data }) => {
      // console.log(data);
      setCurriculums(data)
      setIsLoading(false)
    })
    axios.get('/api/course/getallcourseadmin').then(({ data }) => {
      setCourses(data.courses)
      setIsLoading(false)
    })
    if (selectedCourse !== '') {
      setIsLoading(true)
      axios
        .get(`/api/subject/getsubjectbycourse?courseId=${selectedCourse}`)
        .then(({ data }) => {
          let options = []
          for (let i = 0; i < data.data.length; i++) {
            let obj = {
              value: '0',
              label: '0',
            }
            obj.value = data.data[i]._id
            obj.label = data.data[i].name
            options.push(obj)
          }
          setAllSubjects(options)
          setIsLoading(false)
        })
    } else {
    }
  }, [selectedCourse])
  return (
    <div>
      <div className="w-full lg:w-2/3 py-2  bg-white flex flex-col mx-auto  px-4  rounded-lg  shadow-lg ">
        <h1 className="text-3xl  font-bold text-center">
          Add Special MCQ EXAM
        </h1>
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
                placeholder="Exam Name"
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
            <div className="form-control grid grid-cols-1 lg:grid-cols-3 gap-x-2 gap-y-3">
              <div className="">
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
              <div className="">
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
              <div className="flex items-center mt-0 lg:mt-5 ">
                <input
                  id="disabled-checked-checkbox"
                  type="checkbox"
                  onChange={(e) => setIsOptionalAvailable(!isOptionalAvailable)}
                  className="w-4 h-4  border-black rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label
                  htmlFor="disabled-checked-checkbox"
                  className="ml-2 text-lg"
                >
                  Is Optional Available
                </label>
              </div>
            </div>
            <div className="form-control flex flex-col lg:flex-row gap-2 ">
              <div className="w-full">
                <label className="label" htmlFor="">
                  Optional Subject
                </label>
                <input
                  type="number"
                  className="input input-bordered w-full  border-black "
                  name="nos"
                  id="nos"
                  onBlur={(e) =>
                    setNumberOfOptionalSubject(parseInt(e.target.value))
                  }
                  disabled={isOptionalAvailable === false}
                />
              </div>
              <div className="w-full">
                <label className="label" htmlFor="">
                  Fixed Subject
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full  border-black "
                  name="nof"
                  id="nof"
                  onBlur={(e) =>
                    setNumberOfFixedSubject(parseInt(e.target.value))
                  }
                />
              </div>
              <div className="w-full">
                <label htmlFor="" className="label">
                  Subject (All)
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full  border-black "
                  name="noas"
                  id="noas"
                  onBlur={(e) => setNumberOfSubject(parseInt(e.target.value))}
                />
              </div>
              <div className="w-full">
                <label htmlFor="" className="label">
                  Exam Subject
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full  border-black "
                  name="noes"
                  id="noes"
                  onBlur={e=>setExamSubjectNumber(parseInt(e.target.value))}
                />
              </div>
            </div>
            <div className={`form-control ${singleColumnGrid}`}>
              {numberOfSubject > 0 && (
                <div className="">
                  <label className="label ml-0 lg:ml-2" htmlFor="">
                    Select All Subjects
                  </label>
                  <Select
                    options={allSubjects}
                    onChange={(choice) => setSelectedSubjects(choice)}
                    isMulti
                    isDisabled={
                      selectedSubjects.length === parseInt(numberOfSubject)
                    }
                    labelledBy="Select"
                  />
                </div>
              )}
            </div>
            <div className={`form-control ${twoColumnGrid}`}>
              {numberOfFixedSubject > 0 && (
                <div className="">
                  <label className="label ml-0 lg:ml-2" htmlFor="">
                    Select Fixed Subject
                  </label>

                  <Select
                    options={allSubjects}
                    onChange={(choice) => setSelectedFixedSubject(choice)}
                    isMulti
                    isDisabled={
                      selectedFixedSubject.length === parseInt(numberOfFixedSubject)
                    }
                    labelledBy="Select"
                  />
                </div>
              )}
              <div className="">
                <label className="label ml-0 lg:ml-2" htmlFor="">
                  Select Optional Subject
                </label>

                {numberOfOptionalSubject > 0 && (
                  <Select
                    options={allSubjects}
                    onChange={(choice) => setSelectedOptionalSubjects(choice)}
                    isMulti
                    isDisabled={
                      selectedOptionalSubjects.length ===
                      parseInt(numberOfOptionalSubject)
                    }
                    labelledBy="Select"
                  />
                )}
              </div>
            </div>
            <div>
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
                        ? (e.target.value = '')
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
                        ? (e.target.value = '')
                        : e.target.value
                    }
                    required
                  />
                </div>
              </div>
              <div className="form-control grid grid-cols-1 lg:grid-cols-3 gap-x-3">
                <div className="">
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
                        ? (e.target.value = '')
                        : e.target.value
                    }
                    required
                  />
                </div>
                <div className="">
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
                        ? (e.target.value = '')
                        : e.target.value
                    }
                    required
                  />
                </div>
                <div className="">
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
                        ? (e.target.value = '')
                        : e.target.value
                    }
                    required
                  />
                </div>
              </div>

              <div className="form-control grid grid-cols-1 lg:grid-cols-4 gap-3 ">
                <div>
                  <label htmlFor="" className="label">
                    Question Type
                  </label>
                  <select
                    name="questionType"
                    id="questionType"
                    className="input border-black input-bordered w-full "
                    onChange={(e) => setQuestionType(parseInt(e.target.value))}
                    required
                  >
                    <option value={0}>Image</option>
                    <option value={1}>Text</option>
                    <option value={0}>Image</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="" className="label">
                    Options
                  </label>
                  <select
                    name="numberOfOptions"
                    id="numberOfOptions"
                    className="input border-black input-bordered w-full "
                    onChange={(e) =>
                      setNumberOfOptions(parseInt(e.target.value))
                    }
                    required
                  >
                    <option value={4}>4</option>
                    <option value={0}>0</option>
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                    <option value={4}>5</option>
                    <option value={4}>6</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="" className="label">
                    Sets
                  </label>
                  <select
                    name="numberOfSets"
                    id="numberOfSets"
                    className="input border-black input-bordered w-full "
                    onChange={(e) => setNumberOfSet(parseInt(e.target.value))}
                    required
                  >
                    <option value={4}>4</option>
                    <option value={0}>0</option>
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="" className="label">
                    Retakes
                  </label>
                  <select
                    name="numberOfRetakes"
                    id="numberOfRetakes"
                    className="input border-black input-bordered w-full "
                    onChange={(e) =>
                      setNumberOfRetakes(parseInt(e.target.value))
                    }
                    required
                  >
                    <option value={4}>4</option>
                    <option value={0}>0</option>
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="form-control grid grid-cols-1 lg:grid-cols-4 gap-x-2">
              <div className="col-span-1 lg:col-span-2">
                <label htmlFor="" className="label">
                  Exam Image
                </label>
                <input
                  type="file"
                  name="iLink"
                  id="iLink"
                  className="file-input w-full input-bordered  border-black "
                  // required
                />
              </div>
              <div className="flex items-center mt-0 lg:mt-5 ">
                <input
                  id="disabled-checked-checkbox"
                  type="checkbox"
                  onChange={(e) => setIsAdmission(!isAdmission)}
                  className="w-4 h-4  border-black rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label
                  htmlFor="disabled-checked-checkbox"
                  className="ml-2 text-lg"
                >
                  Is Admission
                </label>
              </div>
              <div className="flex items-center mt-0 lg:mt-5 ">
                <label
                  htmlFor="disabled-checked-checkbox"
                  className="ml-2 text-lg"
                >
                  Curriculum
                </label>
                <select
                  name="course"
                  id="course"
                  className="input w-full  border-black input-bordered "
                  required
                  onChange={(e) => setSelectedCurriculum(e.target.value)}
                >
                  <option value={null}></option>
                  {curriculums.length > 0 &&
                    curriculums.map((curriculum) => (
                      <option key={curriculum._id} value={curriculum.name}>
                        {curriculum.name}
                      </option>
                    ))}
                </select>
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
  )
}

export default AddSpecialMcq
