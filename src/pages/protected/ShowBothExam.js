import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import axios from '../../utils/axios'
import Loader from './../../Shared/Loader'
import { toast } from 'react-hot-toast'
import DeactivateButton from './../../features/common/components/DeactivateButton'
import PopUpModal from './../../features/common/components/PopUpModal'
import { optionName } from '../../utils/globalVariables'
import Select from 'react-select'
import ImageAdder from '../../components/ImageAdder/ImageAdder'
import SolutionSheetAdder from '../../components/common/SolutionSheetAdder'
import { Link } from 'react-router-dom'
import QuestionAdderBoth from '../../components/QuestionAdder/QuestionAdderBoth'

const ShowBothExam = () => {
  const [courses, setCourses] = useState([])
  const [subjects, setSubjects] = useState([])
  const [curriculums, setCurriculums] = useState([])
  const [selectedCurriculum, setSelectedCurriculum] = useState(null)
  const [exams, setExams] = useState([])
  const [selectedCourse, setSelectedCourse] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [singleExamId, setSingleExamId] = useState(null)
  const [singleExam, setsingleExam] = useState({})
  const [isText, setIsText] = useState(true)
  const [numberOfOptions, setNumberOfOptions] = useState(0)
  const [correctOption, setCorrectOption] = useState(null)
  const [selectedExamId, setSelectedExamId] = useState('')
  const [ruleImg, setRuleImg] = useState('')
  const [qvmark, setQvmark] = useState([])
  const [teachers, setTeachers] = useState([])
  const [selectedTeachers, setSelectedTeachers] = useState([])
  const [questionType, setQuestionType] = useState(0)
  const [updateNumberOfOptions, setUpdateNumberOfOptions] = useState(-1)
  const [numberOfRetakes, setNumberOfRetakes] = useState(4)
  const [numberOfSet, setNumberOfSet] = useState(4)
  const [nameOfSet, setNameOfSet] = useState(0)
  const [addmissionChecked, setAddmissionChecked] = useState(false)
  // console.log(selectedTeachers);

  const generator = (examId) => {
    axios
      .post(`/api/teacher/bothupdaterank`, { examId })
      .then((data) => {
        toast.success('Rank Generated Successfully')
        window.location.reload(false)
      })
      .catch((e) => console.log(e))
  }
  const handleAssignRule = (id) => {
    axios
      .get(`/api/both/bothexamruleget?examId=${id}`)
      .then(({ data }) => {
        if (data !== null) {
          setRuleImg(data.ruleILink)
          return data.ruleILink
        }
        // console.log(data);
      })
      .catch((e) => {
        console.log(e)
      })
  }
  const handleAssignExamId = (id) => {
    // console.log(id);
    setSingleExamId(id)
  }
  const handleAddRule = async (e) => {
    e.preventDefault()

    setIsLoading(true)
    const form = e.target
    const file = e.target.ruleILink.files[0]
    const formData = new FormData()
    formData.append('examId', singleExam._id)
    formData.append('ruleILink', file)
    try {
      await axios
        .post('/api/both/bothexamruleset', formData, {
          headers: {
            'Content-Type': 'multipart/ form-data',
          },
        })
        .then(({ data }) => {
          toast.success('Rules Added Successfully')
          window.location.reload(false)
          form.reset()
          setIsLoading(false)
        })
        .catch((e) => console.log(e))
    } catch (e) {
      toast.error(`${e.response.data.message}`)
      console.log(e)
    }

    document.getElementById('my-modal-3').checked = false
  }
  const handleUpdateExam = async (e) => {
    e.preventDefault()
    const form = e.target
    const name = form.exam.value
    const startTime = form.start_time.value
    const admission =
      document.getElementById('isAdmission').checked === true ? true : false
    const endTime = form.end_time.value
    const totalQuestionMcq = parseInt(form.total_questions.value)
    const totalQuestionWritten = parseInt(form.total_questions_written.value)
    const marksPerMcq = parseInt(form.marks_per_question.value)
    const totalMarksMcq = parseInt(form.total_marks.value)
    const totalMarks = parseInt(form.full_marks.value)
    const totalMarksWritten = parseInt(form.tmw.value)
    const totalDuration = form.duration.value
    const mcqDuration = form.mcq_duration.value
    const writtenDuration = form.written_duration.value
    const negativeMarks = form.negative_marking.value
    const updatedExam = {
      examId: singleExam._id,
      name,
      totalQuestionWritten,
      totalMarksWritten,
      mcqDuration,
      writtenDuration,
      subjectId: singleExam.subjectId._id,
      courseId: singleExam.courseId._id,
      startTime,
      endTime,
      totalQuestionMcq,
      marksPerMcq,
      totalMarksMcq,
      status: true,
      totalDuration,
      totalMarks,
      negativeMarks,
      isAdmission: admission,
      curriculumName: selectedCurriculum,
      numberOfRetakes,
      numberOfSet,
      questionType: questionType,
      numberOfOptions: updateNumberOfOptions,
    }
    await axios
      .put('/api/both/updatebothexam', updatedExam)
      .then(({ data }) => {
        toast.success(data)
        window.location.reload(false)
        form.reset()
      })
    form.reset()
    document.getElementById('my-modal').checked = false
  }
  const handleAddQuestion = async (e) => {
    e.preventDefault()
    const form = e.target
    let questionText = ''
    if (isText === true) {
      questionText = form.question_text.value
    }
    let options = []
    if (isText === true) {
      for (let i = 0; i < singleExam.numberOfOptions; i++) {
        options.push(document.getElementById(`option${i}`).value)
      }
    }
    let questionLink = ''
    const explanationILink = null
    const formdata = new FormData()
    if (isText === false) {
      questionLink = form.iLink.files[0]
      formdata.append('iLink', questionLink)
    } else {
      formdata.append('iLink', questionLink)
    }
    formdata.append('explanationILink', explanationILink)
    console.log(explanationILink)
    const question = {
      questionText: questionText,
      type: isText,
      options,
      optionCount: numberOfOptions,
      correctOption: parseInt(correctOption),
      status: true,
      examId: singleExamId,
    }
    formdata.append('questionText', questionText)
    formdata.append('type', isText)
    formdata.append('options', JSON.stringify(options))
    formdata.append('optionCount', updateNumberOfOptions)
    formdata.append('correctOption', parseInt(correctOption))
    formdata.append('status', true)
    formdata.append('examId', singleExamId)
    formdata.append('setName', nameOfSet)

    console.log(question)

    await axios
      .post(`/api/both/bothaddquestionmcq?examId=${singleExamId}`, formdata, {
        headers: {
          'Content-Type': 'multipart/ form-data',
        },
      })
      .then((data) => {
        toast.success('success')
        form.reset()
      })
      .catch((e) => console.log(e))
    document.getElementById('my-modal-2').checked = false
  }
  const fillMarks = (m, id) => {
    const prevMarks = [...qvmark]
    prevMarks[id] = parseFloat(m).toFixed(2)
    setQvmark(prevMarks)
  }
  const handleAddWrittenQuestion = async (e) => {
    e.preventDefault()
    const form = e.target
    let questionLink = ''
    const formdata = new FormData()
    console.log(singleExamId)
    questionLink = form.iLink.files[0]
    formdata.append('questionILink', questionLink)
    formdata.append('totalQuestions', numberOfOptions)
    formdata.append('status', 'true')
    formdata.append('examId', singleExamId)
    let newArr = [...qvmark]
    let totalMarks = 0.0
    for (let i = 0; i < newArr.length; i++) {
      newArr[i] = parseFloat(newArr[i]).toFixed(2)
      totalMarks = parseFloat(totalMarks + parseFloat(newArr[i]))
    }
    totalMarks = totalMarks.toFixed(2)
    formdata.append('marksPerQuestion', newArr)
    formdata.append('totalMarks', totalMarks)
    await axios
      .post(`/api/both/bothAddQuestionWritten?examId=${singleExamId}`, formdata, {
        headers: {
          'Content-Type': 'multipart/ form-data',
        },
      })
      .then((data) => {
        toast.success('success')
        form.reset()

        document.getElementById('num_of_options').disabled = false
        setNumberOfOptions(0)
        setIsText(true)
      })
      .catch((e) => console.log(e))
    document.getElementById('my-modal-2').checked = false
  }
  const deactivateExam = async (examId) => {
    await axios
      .put('/api/both/deactivatebothexam', { examId })
      .then(({ data }) => {
        toast.success('Exam Deactivated')
        window.location.reload(false)
      })
  }

  const handleChangeNumberOfInput = (e) => {
    setNumberOfOptions(parseInt(e.target.value))
    document.getElementById('num_of_options').disabled = true
  }
  const handleChangeCourse = (e) => {
    setSelectedCourse(e.target.value)
    setSelectedSubject('')
    setExams([])
  }
  const examStopper = (examId) => {
    axios
      .post('/api/student/bothupdatestudentexaminfo', { examId })
      .then((data) => {
        console.log(data)
        toast.success('This exam is stopped now...')
        window.location.reload(false)
      })
      .catch((err) => toast.error(err))
  }
  const handleAssignTeacher = (e) => {
    e.preventDefault()
    let steachers = []
    for (let i = 0; i < selectedTeachers.length; i++) {
      steachers.push(selectedTeachers[i].value)
    }
    const obj = {
      examId: singleExamId,
      teacherId: steachers,
    }
    axios
      .post('/api/exam/bothassignstudenttoteacher', obj)
      .then(({ data }) => {
        console.log(data)
        toast.success('Assigned and Distributed')
      })
      .catch((err) => console.log(err))
  }
  const refillQuestions = id => {
    const sendingData = {
      examId: id
    };
    axios
      .post('/api/both/refillquestion', sendingData)
      .then((data) => {
        console.log(data)
        toast.success('Questions added to all sets')
        window.location.reload(false)
      })
      .catch((err) => toast.error(err.response.data))
  }
  const recalculate = (id) => {
    axios
      .post(`/api/exam/calculatemartks?type=2`, {
        examId: singleExamId,
      })
      .then((data) => {
        axios
          .post(`/api/teacher/bothupdaterank`, { examId:singleExamId })
          .then((data) => {
            toast.success('Rank Generated Successfully')
            window.location.reload(false)
          })
          .catch((e) => console.log(e))
      }).catch((e)=>console.log(e))
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
      axios
        .get(`/api/subject/getsubjectbycourse?courseId=${selectedCourse}`)
        .then(({ data }) => {
          setSubjects(data.data)
          setIsLoading(false)
        })
        .catch((err) => console.log(err))
      axios
        .get(`/api/user/teacherlistbycourse?courseId=${selectedCourse}`)
        .then(({ data }) => {
          // console.log(data);
          setTeachers(data)
          setIsLoading(false)
        })
        .catch((err) => console.log('teacher fetching error'))
    } else {
      setSubjects([])
    }
    if (selectedSubject !== '') {
      axios
        .get(`/api/both/getbothexambysubject?subjectId=${selectedSubject}`)
        .then(({ data }) => {
          setExams(data.examPage.exam)
          if (data.examPage.exam.length === 0) {
            toast.error('No Data')
          }
          setIsLoading(false)
        })
        .catch((e) => {
          toast.error(e.response.data)
          setExams([])
        })
    } else {
      setExams([])
    }
    if (singleExamId !== null) {
      axios
        .get(`/api/both/getbothexambyid?examId=${singleExamId}`)
        .then(({ data }) => {
          setsingleExam(data)
          setNumberOfRetakes(data.numberOfRetakes)
          setUpdateNumberOfOptions(data.numberOfOptions)
          setNumberOfSet(data.numberOfSet)
          setQuestionType(parseInt(data.questionType))
          setAddmissionChecked(data.isAdmission)
          if (data.questionType === '0') {
            // console.log("great");
            setIsText(false)
          } else {
            setIsText(true)
          }
          setIsLoading(false)
        })
        .catch((e) => console.log(e))
    } else {
      setsingleExam({})
    }
  }, [selectedCourse, singleExamId, selectedSubject])
  return (
    <div className="mx-auto px-1 lg:px-4">
      <div className="flex justify-center items-center py-2 px-2 my-3  ">
        <div className="bg-white w-full  lg:w-1/2 px-4  py-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="form-control">
            <label className="text-[12px] text-center" htmlFor="">
              Select Course
            </label>
            <select
              name="course_list"
              id="course_list"
              className="input w-full  border-black input-bordered"
              required
              onChange={(e) => handleChangeCourse(e)}
            >
              <option value=""></option>
              {courses.length > 0 &&
                courses.map(
                  (course) =>
                    course.name !== 'Free' && (
                      <option
                        className="text-center"
                        key={course._id}
                        value={course._id}
                      >
                        {course.name}
                      </option>
                    )
                )}
            </select>
          </div>
          <div className="form-control">
            <label className="text-[12px] text-center" htmlFor="">
              Select Subject
            </label>
            <select
              name="course_list"
              id="course_list"
              className="input w-full  border-black input-bordered"
              required
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              <option value=""></option>
              {subjects.length > 0 &&
                subjects.map(
                  (subject) =>
                    subject.name !== 'Free' && (
                      <option
                        className="text-center"
                        key={subject._id}
                        value={subject._id}
                      >
                        {subject.name}
                      </option>
                    )
                )}
            </select>
          </div>
        </div>
      </div>
      {isLoading && <Loader></Loader>}
      {exams.length > 0 && (
        <div className="overflow-x-auto w-full ">
          <table className="mx-auto  w-full  whitespace-nowrap rounded-lg  divide-y  overflow-hidden">
            <thead>
              <tr>
                <th className="bg-white font-semibold text-[12px] uppercase px-1 py-2">
                  SI No.
                </th>
                <th className="bg-white  font-semibold text-[12px] uppercase px-2 py-2">
                  Exam Name
                </th>
                <th className="bg-white font-semibold text-[12px] uppercase px-6 py-2">
                  Start Time - <br></br> End Time
                </th>
                <th className="bg-white font-semibold text-[12px] uppercase px-6 py-2">
                  Type
                </th>
                <th className="bg-white font-semibold text-[12px] uppercase px-6 py-2">
                  Duration
                </th>
                <th className="bg-white font-semibold text-[12px] uppercase px-6 py-2">
                  Total Marks
                </th>
                <th className="width-setter bg-white font-semibold text-[12px] uppercase px-6 py-2">
                  Pre Exam  Action
                </th>
                <th className="width-setter bg-white font-semibold text-[12px] uppercase px-6 py-2">
                  Post Exam  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {exams.length > 0 &&
                exams.map((exam, idx) => (
                  <tr
                    key={idx}
                    className="even:bg-table-row-even odd:bg-table-row-odd text-center"
                  >
                    <td className="px-1 py-2 text-center">{idx + 1}</td>
                    <td className="px-2 py-2 text-center">{exam.name}</td>
                    <td className="px-1 py-2 text-center">
                      {exam.startTime} <br />
                      {exam.endTime}
                    </td>
                    <td className="px-6 py-2 text-center">
                      {exam.examVariation}
                    </td>
                    <td className="px-6 py-2 text-center">
                      {exam.totalDuration} Minutes
                    </td>
                    <td className="px-6 py-2 text-center">{exam.totalMarks}</td>
                    <td className="px-6 py-2 text-center">
                      <div className="grid grid-cols-1   gap-1 ">
                        {exam.RuleImage !== '0' ? (
                          <label
                            onClick={() => handleAssignRule(exam._id)}
                            htmlFor="my-modal-4"
                            className="btn bg-button hover:bg-gradient-to-r from-[#616161] from-0% to=[#353535] to-100% w-full mr-2 mb-3 lg:mb-0 text-white text-[12px]"
                          >
                            Show Rule
                          </label>
                        ) : (
                          <label
                            onClick={() => handleAssignExamId(exam._id)}
                            htmlFor="my-modal-3"
                            className="btn bg-button text-[12px] hover:bg-gradient-to-r from-[#616161] from-0% to=[#353535] to-100% w-full mr-2 mb-3 lg:mb-0 text-white"
                          >
                            Add Exam Rule
                          </label>
                        )}
                        <label
                          onClick={() => handleAssignExamId(exam._id)}
                          htmlFor="imageAdder"
                          className="btn bg-button text-[12px] hover:bg-gradient-to-r from-[#616161] from-0% to=[#353535] to-100% mr-2 mb-3 lg:mb-0 text-white"
                        >
                          {exam.iLink === null
                            ? 'Add Exam Image'
                            : 'Update Exam Image'}
                        </label>
                        <label
                          onClick={() => handleAssignExamId(exam._id)}
                          htmlFor="my-modal"
                          className="btn bg-button hover:bg-gradient-to-r from-[#616161] from-0% to=[#353535] to-100% w-full mr-2 mb-3 lg:mb-0 text-white text-[12px]"
                        >
                          Update
                        </label>
                        <label
                          htmlFor="my-modal-2"
                          onClick={() => setSingleExamId(exam._id)}
                          className="btn bg-button hover:bg-gradient-to-r from-[#616161] from-0% to=[#353535] to-100% w-full mr-2 mb-3 lg:mb-0 text-white text-[12px]"
                        >
                          Add MCQ Question
                        </label>
                        <label
                          htmlFor="written-modal"
                          onClick={() => setSingleExamId(exam._id)}
                          className="btn bg-button hover:bg-gradient-to-r from-[#616161] from-0% to=[#353535] to-100% w-full mr-2 mb-3 lg:mb-0 text-white text-[12px]"
                        >
                          Add Written Question
                        </label>
                        <button
                          className="btn bg-button text-[12px] hover:bg-gradient-to-r from-[#616161] from-0% to=[#353535] to-100% mr-2 mb-3 lg:mb-0 text-white"
                          onClick={() => refillQuestions(exam._id)}
                        >
                          Refill MCQ Sets
                        </button>
                        <DeactivateButton
                          setter={setSelectedExamId}
                          value={exam._id}
                        ></DeactivateButton>
                      </div>
                    </td>
                    <td className="px-6 py-2 text-center">
                      <div className='grid grid-cols-1 gap-x-2 gap-y-2'>

                        <label
                          onClick={() => handleAssignExamId(exam._id)}
                          htmlFor="solutionSheet"
                          className="btn bg-button text-[12px] hover:bg-gradient-to-r from-[#616161] from-0% to=[#353535] to-100% mr-2 mb-3 lg:mb-0 text-white"
                        >
                          {exam.solutionSheet === null
                            ? 'Add SolutionSheet'
                            : 'Update SolutionSheet'}
                        </label>
                        {exam.solutionSheet !== null && (
                          <Link
                            className="text-green-700 font-extrabold text-[12px] underline "
                            to={exam.solutionSheet}
                            target="_blank"
                          >
                            Solve Sheet
                          </Link>
                        )}

                        <label
                          onClick={() => handleAssignExamId(exam._id)}
                          htmlFor="assign-teacher"
                          className="btn bg-button hover:bg-gradient-to-r from-[#616161] from-0% to=[#353535] to-100% w-full mr-2 mb-3 lg:mb-0 text-white text-[12px]"
                        >
                          Assign Teachers
                        </label>
                        <label
                          onClick={() => handleAssignExamId(exam._id)}
                          htmlFor="my-popup-submit"
                          className="btn bg-button hover:bg-gradient-to-r from-[#616161] from-0% to=[#353535] to-100% w-full mr-2 mb-3 lg:mb-0 text-white text-[12px]"
                        >
                          Submit Exam
                        </label>
                        <label
                          onClick={() => handleAssignExamId(exam._id)}
                          htmlFor="my-popup"
                          className="btn bg-button hover:bg-gradient-to-r from-[#616161] from-0% to=[#353535] to-100% w-full mr-2 mb-3 lg:mb-0 text-white text-[12px]"
                        >
                          Generate Meritlist
                        </label>
                        <label
                          onClick={() => handleAssignExamId(exam._id)}
                          htmlFor="my-calculate"
                          className="btn bg-button text-sm hover:bg-gradient-to-r from-[#616161] from-0% to=[#353535] to-100% mr-2 mb-3 lg:mb-0 text-white"
                        >
                          Recalculate
                        </label>

                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
      <input type="checkbox" id="my-popup-submit" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <h3 className="font-semibold text-[12px] text-center">
            {`Are you sure?`}
          </h3>

          <div className="modal-action flex justify-center items-center">
            <button
              className="btn mr-2"
              onClick={() => examStopper(singleExamId)}
            >
              Yes
            </button>
            <label htmlFor="my-popup-submit" className="btn bg-[red]">
              No!
            </label>
          </div>
        </div>
      </div>
      <div>
        <input type="checkbox" id="my-calculate" className="modal-toggle" />
        <div className="modal">
          <div className="modal-box">
            <h3 className="font-semibold text-lg text-center">
              {`Are you sure?`}
            </h3>

            <div className="modal-action flex justify-center items-center">
              <button
                className="btn mr-2"
                onClick={() => recalculate(singleExamId)}
              >
                Yes
              </button>
              <label htmlFor="my-calculate" className="btn bg-[red]">
                No!
              </label>
            </div>
          </div>
        </div>
        <input type="checkbox" id="my-popup" className="modal-toggle" />
        <div className="modal">
          <div className="modal-box">
            <h3 className="font-semibold text-[12px] text-center">
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
        <div id="assignTeacher">
          <input type="checkbox" id="assign-teacher" className="modal-toggle" />
          <div className="modal">
            <div className="modal-box">
              <h3 className="font-bold text-[12px] text-center">
                Add Teachers
              </h3>
              <form className="add-form" onSubmit={handleAssignTeacher}>
                <div className="form-control">
                  <label htmlFor="" className=" label">
                    <span className="text-[12px] mb-2">Select Teachers </span>
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
        <input type="checkbox" id="my-modal-4" className="modal-toggle" />
        <div className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-[12px] text-center">Exam Rules</h3>
            <img
              src={process.env.REACT_APP_API_HOST + '/' + ruleImg}
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
      <div id="add-modal">
        <input type="checkbox" id="my-modal-3" className="modal-toggle" />
        <div className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-[12px] text-center">Add Rule</h3>
            <form className="add-form" onSubmit={handleAddRule}>
              <div className="form-control">
                <label htmlFor="" className=" label">
                  <span className="text-[12px] mb-2">Add Rule Image </span>
                </label>
                <input
                  type="file"
                  name="ruleILink"
                  id="ruleILink"
                  className="file-input w-full  max-w-xs mb-2 input input-bordered border-black pl-0"
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
            <h3 className="font-bold text-[12px] text-center">Update Exam</h3>
            <form className="add-form" onSubmit={handleUpdateExam}>
              <div className="form-control">
                <label htmlFor="" className=" label">
                  <span className="text-[12px]">Exam Name </span>
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
              <div className="form-control flex flex-col lg:flex-row justify-between items-start lg:items-center">
                <div className="w-full  lg:w-1/2 mr-0 lg:mr-4">
                  <label className="label" htmlFor="">
                    Start Time
                  </label>
                  <input
                    type="datetime-local"
                    className="input input-bordered w-full   border-black "
                    name="start_time"
                    id="start_time"
                    defaultValue={singleExam?.startTime?.split(':00.000Z')[0]}
                    required
                  />
                </div>
                <div className="w-full  lg:w-1/2">
                  <label className="label" htmlFor="">
                    End Time
                  </label>
                  <input
                    type="datetime-local"
                    className="input input-bordered w-full   border-black "
                    name="end_time"
                    id="end_time"
                    defaultValue={singleExam?.endTime?.split(':00.000Z')[0]}
                    required
                  />
                </div>
              </div>
              <div className="form-control mt-1 flex flex-col lg:flex-row justify-between items-start lg:items-center">
                <p className="font-bold text-md">MCQ</p>
              </div>
              <div className="form-control  flex flex-col lg:flex-row justify-between items-start lg:items-start">
                <div className="w-full  lg:w-1/4">
                  <label htmlFor="" className="label">
                    Questions
                  </label>
                  <input
                    type="number" step="0.01"
                    className="input w-full  input-bordered  border-black "
                    name="total_questions"
                    id="total_questions"
                    defaultValue={singleExam.totalQuestionMcq}
                    onInput={(e) =>
                      e.target.value < 0
                        ? (e.target.value = '')
                        : e.target.value
                    }
                    required
                  />
                </div>
                <div className="w-full  lg:w-1/4">
                  <label htmlFor="" className="label">
                    Marks/Question
                  </label>
                  <input
                    type="number" step="0.01"
                    className="input w-full  input-bordered  border-black "
                    name="marks_per_question"
                    id="marks_per_question"
                    defaultValue={singleExam.marksPerMcq}
                    onInput={(e) =>
                      e.target.value < 0
                        ? (e.target.value = '')
                        : e.target.value
                    }
                    required
                  />
                </div>
                <div className="w-full  lg:w-1/4">
                  <label htmlFor="" className="label">
                    Marks
                  </label>
                  <input
                    type="number" step="0.01"
                    className="input w-full  input-bordered  border-black "
                    name="total_marks"
                    id="total_marks"
                    defaultValue={singleExam.totalMarksMcq}
                    onInput={(e) =>
                      e.target.value < 0
                        ? (e.target.value = '')
                        : e.target.value
                    }
                    required
                  />
                </div>
              </div>
              <div className="form-control grid grid-cols-1 lg:grid-cols-2 gap-3 ">
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
                    <option value={parseInt(questionType)}>
                      {parseInt(questionType) === 0 ? 'Image' : 'Text'}
                    </option>
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
                      setUpdateNumberOfOptions(parseInt(e.target.value))
                    }
                    required
                  >
                    <option value={parseInt(updateNumberOfOptions)}>
                      {updateNumberOfOptions}
                    </option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                    <option value={5}>5</option>
                    <option value={6}>6</option>
                    <option value={7}>7</option>
                    <option value={8}>8</option>
                    <option value={9}>9</option>
                    <option value={10}>10</option>
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
                    <option value={parseInt(numberOfSet)}>{numberOfSet}</option>
                    <option value={0}>0</option>
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="" className="label">
                    Repeats
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
                    <option value={parseInt(numberOfRetakes)}>
                      {numberOfRetakes}
                    </option>
                    <option value={0}>0</option>
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                  </select>
                </div>
              </div>
              <div className="form-control mt-1 flex flex-col lg:flex-row justify-between items-start lg:items-center">
                <p className="font-bold text-md">Written</p>
              </div>
              <div className="form-control grid grid-cols-2 gap-x-2">
                <div className="">
                  <label htmlFor="" className="label">
                    Questions
                  </label>
                  <input
                    type="number" step="0.01"
                    className="input w-full  input-bordered  border-black "
                    name="total_questions_written"
                    id="total_questions_written"
                    defaultValue={singleExam.totalQuestionWritten}
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
                    Marks
                  </label>
                  <input
                    type="number" step="0.01"
                    className="input w-full  input-bordered  border-black "
                    name="tmw"
                    id="tmw"
                    defaultValue={singleExam.totalMarksWritten}
                    onInput={(e) =>
                      e.target.value < 0
                        ? (e.target.value = '')
                        : e.target.value
                    }
                    required
                  />
                </div>
              </div>
              <div className="form-control mt-2 flex flex-col lg:flex-row justify-between items-start lg:items-center">
                <div className="w-full  lg:w-1/4">
                  <label className="label" htmlFor="">
                    Total Duration
                  </label>
                  <input
                    type="mumber"
                    className="input w-full  input-bordered border-black "
                    name="duration"
                    id="duration"
                    defaultValue={singleExam.totalDuration}
                    min="1"
                    onInput={(e) =>
                      e.target.value < 0
                        ? (e.target.value = '')
                        : e.target.value
                    }
                    required
                  />
                  <span className="text-red text-[12px] ml-0 lg:ml-2">
                    (minutes)
                  </span>
                </div>
                <div className="w-full  lg:w-1/4">
                  <label className="label" htmlFor="">
                    MCQ Duration
                  </label>
                  <input
                    type="mumber"
                    className="input w-full  input-bordered border-black "
                    name="mcq_duration"
                    id="mcq_duration"
                    defaultValue={singleExam.mcqDuration}
                    min="1"
                    onInput={(e) =>
                      e.target.value < 0
                        ? (e.target.value = '')
                        : e.target.value
                    }
                    required
                  />
                  <span className="text-red text-[12px] ml-0 lg:ml-2">
                    (minutes)
                  </span>
                </div>
                <div className="w-full  lg:w-1/4">
                  <label className="label" htmlFor="">
                    Written Duration
                  </label>
                  <input
                    type="mumber"
                    className="input w-full  input-bordered border-black "
                    name="written_duration"
                    id="written_duration"
                    defaultValue={singleExam.writtenDuration}
                    min="1"
                    onInput={(e) =>
                      e.target.value < 0
                        ? (e.target.value = '')
                        : e.target.value
                    }
                    required
                  />
                  <span className="text-red text-[12px] ml-0 lg:ml-2">
                    (minutes)
                  </span>
                </div>
              </div>
              <div className="form-control grid grid-cols-2  gap-x-3 ">
                <div className="">
                  <label htmlFor="" className="label">
                    Total Marks
                  </label>
                  <input
                    type="number" step="0.01"
                    className="input w-full  input-bordered  border-black "
                    name="full_marks"
                    id="full_marks"
                    defaultValue={singleExam.totalMarks}

                    onChange={(e) =>
                      e.target.value < 0
                        ? (e.target.value = '')
                        : e.target.value
                    }
                    required
                  />
                </div>
                <div className="">
                  <label htmlFor="" className="label">
                    Negative
                  </label>
                  <input
                    type="number" step="0.01"
                    className="input w-full  input-bordered  border-black "
                    name="negative_marking"
                    id="negative_marking"
                    defaultValue={singleExam.negativeMarksMcq}

                    onChange={(e) =>
                      e.target.value < 0
                        ? (e.target.value = '')
                        : e.target.value
                    }
                    required
                  />
                </div>
              </div>
              <div className="form-control grid grid-cols-2 gap-x-3">
                <div className="flex items-center mt-0 lg:mt-5 ">
                  <input
                    id="isAdmission"
                    type="checkbox"
                    name="isAdmission"
                    checked={addmissionChecked}
                    onChange={() => setAddmissionChecked(!addmissionChecked)}
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
                    name="curriculums"
                    id="curriculums"
                    className="input w-full  border-black input-bordered "
                    required
                    onChange={(e) => setSelectedCurriculum(e.target.value)}
                  >
                    <option value={singleExam.curriculumName}>
                      {singleExam.curriculumName === null
                        ? 'NONE'
                        : singleExam.curriculumName}
                    </option>
                    {singleExam.curriculumName !== null && (
                      <option value={null}>NONE</option>
                    )}
                    {curriculums.length > 0 &&
                      curriculums.map((curriculum) => (
                        <option key={curriculum._id} value={curriculum.name}>
                          {curriculum.name}
                        </option>
                      ))}
                  </select>
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
        {/* written modal  */}
        <input type="checkbox" id="written-modal" className="modal-toggle" />
        <div className="modal modal-middle ml:0 lg:ml-56">
          <div className="modal-box w-11/12 max-w-5xl h-11/12">
            <form className="add-form" onSubmit={handleAddWrittenQuestion}>
              <label htmlFor="" className=" label">
                <span className="text-[12px]">Select Question Image </span>
              </label>
              <input
                type="file"
                name="iLink"
                id="iLink"
                className="file-input w-full  input-bordered  border-black "
                required
              />
              <label htmlFor="" className="label">
                Number of Questions
              </label>
              <input
                type="number" step="0.01"
                className="input w-full  input-bordered border-black "
                name="num_of_options"
                id="num_of_options"
                min="1"
                onInput={(e) =>
                  e.target.value < 0 ? (e.target.value = '') : e.target.value
                }
                onBlur={(e) => handleChangeNumberOfInput(e)}
                required
              />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-4">
                {numberOfOptions > 0 &&
                  [...Array(numberOfOptions).keys()].map((id) => {
                    return (
                      <div key={id}>
                        <div>
                          <label htmlFor="" className="text-[12px]">
                            {id + 1 + ')'}
                          </label>
                          <input
                            type="text"
                            placeholder="Marks"
                            name={`option${id}`}
                            id={`option${id}`}
                            onChange={(e) => fillMarks(e.target.value, id)}
                            className="input w-full  input-bordered border-black "
                            required
                          />
                        </div>
                      </div>
                    )
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
              <label htmlFor="" className="text-[12px]">
                Question Type
              </label>
              <select
                name="type"
                id="type"
                className="input border-black input-bordered w-full  "
                onChange={(e) => setIsText(!isText)}
                required
              >
                <option value={true}>Text</option>
                <option value={false}>Image</option>
              </select>
              {isText === true ? (
                <>
                  <label htmlFor="" className=" label">
                    <span className="text-[12px]">
                      Write Down the question{' '}
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
                    <span className="text-[12px]">Select Question Image </span>
                  </label>
                  <input
                    type="file"
                    name="iLink"
                    id="iLink"
                    className="file-input w-full  input-bordered  border-black "
                    required
                  />
                </>
              )}
              <label htmlFor="" className="label">
                Number of Options
              </label>
              <input
                type="number" step="0.01"
                className="input w-full  input-bordered border-black "
                name="num_of_options"
                id="num_of_options"
                min="2"
                onInput={(e) =>
                  e.target.value < 0 ? (e.target.value = '') : e.target.value
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
                          <label htmlFor="" className="text-[12px]">
                            {optionName[id] + ')'}
                          </label>
                          <input
                            type="text"
                            placeholder={`Option ${id + 1}`}
                            name={`option${id}`}
                            id={`option${id}`}
                            className="input w-full  input-bordered border-black "
                            required
                          />
                        </div>
                      </div>
                    )
                  })}
              </div>

              {numberOfOptions > 0 && (
                <>
                  <label className="text-[12px]">Correct Option</label>
                  <select
                    name="type"
                    id="type"
                    className="input border-black input-bordered w-full  "
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
                <span className="text-[12px]">Explanation Link </span>
              </label>
              <input
                type="file"
                name="explanationILink"
                id="explanationILink"
                className="file-input w-full  input-bordered  border-black "
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
      <QuestionAdderBoth 
        singleExam={singleExam}
        handleAddQuestion={handleAddQuestion}
        setNameOfSet={setNameOfSet}
        setCorrectOption={setCorrectOption}
        isText={isText}
        setIsText={setIsText}
      />
      <PopUpModal
        modalData={selectedExamId}
        remove={deactivateExam}
      ></PopUpModal>
      <ImageAdder
        title={`${singleExam.iLink === null ? 'Add Image' : 'Update Image'}`}
        apiEndPoint="/api/both/updateBothExamPhoto"
        examId={singleExamId}
        setIsLoading={setIsLoading}
      />
      <SolutionSheetAdder
        apiEndPoint="/api/exam/uploadsollution"
        examId={singleExamId}
        setIsLoading={setIsLoading}
        type={1}
      />
    </div>
  )
}

export default ShowBothExam
