import React, { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import Loader from '../../Shared/Loader'
import axios from '../../utils/axios'

const AddExam = () => {
  const [courses, setCourses] = useState([])
  const [subjects, setSubjects] = useState([])
  const [curriculums, setCurriculums] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('')
  const [selectedCurriculum, setSelectedCurriculum] = useState(null)
  const [selectedType, setSelectedType] = useState(-1)
  const [selectedVariation, setSelectedVariation] = useState(-1)
  const [isAdmission, setIsAdmission] = useState(false)
  const [questionType, setQuestionType] = useState(0)
  const [numberOfOptions, setNumberOfOptions] = useState(4)
  const [numberOfRetakes, setNumberOfRetakes] = useState(4)
  const [numberOfSet, setNumberOfSet] = useState(4)

  const handleAddExam = async (e) => {
    e.preventDefault()
    let totalQuestionMcq = -1,
      marksPerMcq = -1,
      totalMarks,
      negativeMarks = -1
    const form = e.target
    const name = form.exam.value
    const startTime = form.start_time.value
    const endTime = form.end_time.value
    const duration = parseInt(form.duration.value)
    if (selectedVariation === '1') {
      totalQuestionMcq = parseInt(form.total_questions.value)
      marksPerMcq = parseInt(form.marks_per_question.value)
      totalMarks = totalQuestionMcq * marksPerMcq
    } else {
      totalMarks = form.total_marks.value
    }
    const status = true
    if (selectedVariation === '1') {
      negativeMarks = parseFloat(form.negative_marking.value)
    }
    // console.log(form.iLink.files[0]);

    let iLink = null
    const formdata = new FormData()
    if (form.iLink.files[0] === undefined) {
      formdata.append('iLink', iLink)
    } else {
      iLink = form.iLink.files[0]
      formdata.append('iLink', iLink)
    }
    const stype = parseInt(selectedType)
    const svar = parseInt(selectedVariation)
    formdata.append('name', name)
    formdata.append('examType', stype)
    formdata.append('examVariation', svar)
    formdata.append('examFreeOrNot', false)
    formdata.append('startTime', startTime)
    formdata.append('endTime', endTime)
    formdata.append('duration', duration)
    formdata.append('totalQuestionMcq', totalQuestionMcq)
    formdata.append('marksPerMcq', marksPerMcq)
    formdata.append('status', status)
    formdata.append('subjectId', selectedSubject)
    formdata.append('courseId', selectedCourse)
    formdata.append('curriculumName', selectedCurriculum)
    formdata.append('isAdmission', isAdmission)
    formdata.append('negativeMarks', negativeMarks)
    formdata.append('numberOfRetakes', numberOfRetakes)
    formdata.append('numberOfOptions', numberOfOptions)
    formdata.append('questionType', questionType)
    formdata.append('numberOfSet', numberOfSet)
    formdata.append('totalMarksMcq', totalMarks)
    // const sendMessage = {
    //   username: 'Bondiadmin',
    //   password: 'Bp@@2025',
    //   apicode: '1',
    //   msisdn: '01580942301',
    //   countrycode: '880',
    //   cli: '2222',
    //   messagetype: '1',
    //   message: 'SingleSMS_JesonTest1',
    //   messageid: '0',
    // }
    await axios
      .post(`/api/exam/createexam`, formdata, {
        headers: {
          'Content-Type': 'multipart/ form-data',
        },
      })
      .then(async ({ data }) => {
//         const response = await fetch(
//           `https://gpcmp.grameenphone.com/gpcmpapi/messageplatform/controller.home?username=Bondiadmin&password=Bp@@2025&apicode=${6}&msisdn=01580942301&countrycode=880&cli=Bondiadmin&messagetype=${1}&message=CMPTestMes
// sage&messageid=${0}`,
//           {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json',
//             },
//           }
//         )
//         const dataD = await response.json()
//         console.log(dataD)
        toast.success('Exam Added Succesfully')
        window.location.reload(false)
      })
      .catch((e) => console.log(e))
  }
  useEffect(() => {
    setIsLoading(true)
    axios.get('/api/course/getallcourseadmin').then(({ data }) => {
      setCourses(data.courses)
      setIsLoading(false)
    })
    axios.get('/api/curriculum/getcurriculums').then(({ data }) => {
      // console.log(data);
      setCurriculums(data)
      setIsLoading(false)
    })
    if (selectedCourse !== '') {
      axios
        .get(`/api/subject/getsubjectbycourse?courseId=${selectedCourse}`)
        .then(({ data }) => {
          setSubjects(data.data)
          setIsLoading(false)
        })
    } else {
      setSubjects([])
    }
  }, [selectedCourse])
  return (
    <div>
      <div className="w-full lg:w-2/3 py-2  bg-white flex flex-col mx-auto  px-4  rounded-lg  shadow-lg ">
        <h1 className="text-3xl  font-bold text-center">
          Add MCQ/Written EXAM
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
            <div className="form-control flex flex-col lg:flex-row gap-2 ">
              <div className="w-full">
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
              <div className="w-full">
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
                </select>
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
                    e.target.value < 0 ? (e.target.value = '') : e.target.value
                  }
                  required
                />
                <span className="text-red text-sm ml-0 lg:ml-2">(minutes)</span>
              </div>
            </div>
            {selectedVariation === '1' && (
              <div className="form-control grid grid-cols-1 lg:grid-cols-3 gap-x-2 gap-y-3">
                <div className="">
                  <label htmlFor="" className="label">
                    Total Question
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className="input w-full input-bordered  border-black "
                    name="total_questions"
                    id="total_questions"
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
                    step="0.01"
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
                <div className=" ">
                  <label htmlFor="" className="label">
                    Negative Marking (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className="input w-full input-bordered  border-black "
                    name="negative_marking"
                    id="negative_marking"
                    onChange={(e) =>
                      e.target.value < 0
                        ? (e.target.value = '')
                        : e.target.value
                    }
                    disabled={selectedVariation === '2'}
                    required
                  />
                </div>
              </div>
            )}
            {selectedVariation !== '1' && (
              <div className="form-control flex flex-col lg:flex-row justify-between items-start lg:items-start">
                <div className="w-full lg:w-1/2">
                  <label htmlFor="" className="label">
                    Total Marks
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className="input w-full input-bordered  border-black "
                    name="total_marks"
                    id="total_marks"
                    min={1}
                    required
                  />
                </div>
              </div>
            )}
            <div className="form-control flex flex-col lg:flex-row justify-between items-start lg:items-center">
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
                  Curriculum Name
                </label>
                <select
                  name="course"
                  id="course"
                  className="input w-full  border-black input-bordered "
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
            {selectedVariation === '1' && (
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
                    <option value={5}>5</option>
                    <option value={6}>6</option>
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
                    <option value={5}>5</option>
                    <option value={6}>6</option>
                    <option value={7}>7</option>
                    <option value={8}>8</option>
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
            )}
            <div className="form-control">
              <label htmlFor="" className="label">
                Exam Image
              </label>
              <input
                type="file"
                name="iLink"
                id="iLink"
                className="file-input w-full input-bordered  border-black "
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
  )
}

export default AddExam
