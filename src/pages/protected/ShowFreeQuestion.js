import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import axios from '../../utils/axios'
import Loader from './../../Shared/Loader'
import { toast } from 'react-hot-toast'
import DeactivateButton from '../../features/common/components/DeactivateButton'
import PopUpModal from '../../features/common/components/PopUpModal'
import { optionName } from '../../utils/globalVariables'
import QuestionSender from '../../components/QuestionSender/QuestionSender'
import SpecialQuestionSender from './SpecialQuestionSender'
import OptionChanger from './OptionChanger'
const ShowQuestions = () => {
  const [courses, setCourses] = useState([])
  const [subjects, setSubjects] = useState([])
  const [exams, setExams] = useState([])
  const [secondsubjects, setSecondSubjects] = useState([])
  const [secondexams, setSecondExams] = useState([])
  const [questions, setQuestions] = useState([])
  const [selectedCourse, setSelectedCourse] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('')
  const [selectedExam, setSelectedExam] = useState('')
  const [bothStatus, setBothStatus] = useState(false)
  const [specialExams, setSpecialExmas] = useState([])
  const [questionSubject, setQuestionSubject] = useState('')
  const [selectedQuestionId, setSelectedQuestionId] = useState('')
  const [questionExam, setQuestionExam] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedQuestions, setSelectedQuestions] = useState([])
  const [singleExam, setSingleExam] = useState({})
  const [singleSecondExam, setSingleSecondExam] = useState({})
  const [selectedSet, setSelectedSet] = useState(-1)
  const [secondSet, setSecondSet] = useState(-1)
  const [numberOfOptions,setNumberOfOptions]= useState(0);

  const handleChangeCourse = (e) => {
    setSelectedSubject('')
    setSubjects([])
    setExams('')
    setExams([])
    setQuestions([])
    setSelectedCourse(e.target.value)
  }
  const handleChangeSecondCourse = (e) => {
    setSecondSubjects([])
    setSecondExams([])
    axios
      .get(`/api/subject/getsubjectbycourse?courseId=${e.target.value}`)
      .then(({ data }) => {
        setSecondSubjects(data.data)
        setIsLoading(false)
      })
      .catch((e) => console.log(e))
    axios
      .get(`/api/special/showspecialexambycourse?courseId=${e.target.value}`)
      .then(({ data }) => {
        // console.log(data);
        setSpecialExmas(data)
        if (data.length === 0) {
          toast.error('No Data')
        }
        setIsLoading(false)
      })
      .catch((e) => toast.error(e.response.data))
  }


  const handleChangeSubject = (e) => {
    setSelectedSubject(e.target.value)
    setSelectedExam('')
    setExams([])
    setQuestions([])
  }
  const handleChangeExam = (e) => {
    setQuestions([])
    setSelectedExam('')

    if (e.target.value !== '') {
      axios
        .get(`/api/exam/getExamById?examId=${e.target.value}`)
        .then(({ data }) => {
          setSingleExam(data)
          setNumberOfOptions(data.numberOfOptions);
          setSelectedExam(e.target.value)
        })
        .catch((e) => console.log(e))
    } else {
      setSelectedExam('')
      setSingleExam({})
      setQuestions([])
    }
  }
  const handleChangeSet = (setName) => {
    setSelectedSet(parseInt(setName))
    if (parseInt(setName) !== -1) {
      axios
        .get(
          `/api/exam/questionByExamIdAndSet?examId=${selectedExam}&setName=${setName}`
        )
        .then(({ data }) => {
          setQuestions(data)
          setIsLoading(false)
        })
        .catch((e) => {
          setQuestions([])
          setSelectedQuestions([])
          toast.error(e.response.data)
        })
    } else {
      setQuestions([])
    }
  }
  const handleChangeBothStatus = (val) => {
    if (val === '0') {
      setBothStatus(false)
      axios
        .get(`/api/exam/getexambysubquestion?subjectId=${questionSubject}`)
        .then(({ data }) => {
          setSecondExams(data)
          setIsLoading(false)
        })
        .catch((e) => console.log(e))
    } else {
      setBothStatus(true)
      axios
        .get(`/api/both/getbothexambysubject?subjectId=${questionSubject}`)
        .then(({ data }) => {
          setSecondExams(data.examPage.exam)
          if (data.examPage.exam.length === 0) {
            // toast.error("No Data");
          }
          setIsLoading(false)
        })
        .catch((e) => toast.error(e.response.data))
    }
  }
 
  const handleSecondExam = (val) => {
    if (val !== '') {
      if (bothStatus === false) {
        axios
          .get(`/api/exam/getExamById?examId=${val}`)
          .then(({ data }) => {
            setSingleSecondExam(data)
            setQuestionExam(val)
          })
          .catch((e) => console.log(e))
      } else {
        axios
          .get('/api/both/getbothexambyid?examId=' + val)
          .then(({ data }) => {
            console.log(data)
            setSingleSecondExam(data)
            setQuestionExam(val)
          })
      }
    } else {
      setSecondExams('')
      setSingleSecondExam({})
    }
  }
  function arrayRemove(arr, value) {
    return arr.filter(function (ele) {
      return ele !== value
    })
  }
  const setQuestionBulk = (e, id) => {
    let prev = [...selectedQuestions]
    if (document.getElementById(`select_question` + id).checked === true) {
      prev.push(id)
    } else {
      const index = prev.indexOf(id)
      if (index !== -1) {
        prev = arrayRemove(prev, id)
      }
    }
    setSelectedQuestions(prev)
  }

  const setQuestionBulkAll = () => {
    let q = []
    const allCheckboxes = document.getElementsByName('single_checbox')
    if (document.getElementById('all_check').checked === true) {
      for (let i = 0; i < questions.length; i++) {
        q.push(questions[i].questionId)
      }
      for (let i = 0; i < allCheckboxes.length; i++) {
        allCheckboxes[i].checked = true
      }
    } else {
      q = []
      for (let i = 0; i < allCheckboxes.length; i++) {
        allCheckboxes[i].checked = false
      }
    }
    setSelectedQuestions(q)
  }
  const sendQuestions = async (e) => {
    e.preventDefault()
    const examId = questionExam
    if (secondSet !== -1) {
      const questionSet = {
        examId,
        questionArray: selectedQuestions,
        setName: secondSet,
      }
      console.log(questionSet)
      console.log(selectedQuestions.length)
      let curSlot
      if (bothStatus) {
        axios
          .get(
            `/api/both/slotAvailable?examId=${examId}&setName=${parseInt(
              secondSet
            )}`
          )
          .then(async ({ data }) => {
            curSlot = parseInt(data.slots) - selectedQuestions.length
            console.log(selectedQuestions.length, parseInt(data.slots), curSlot)
            if (curSlot >= 0) {
              await axios
                .put('/api/both/bothaddquestionmcqbulk', questionSet)
                .then(({ data }) => {
                  toast.success(
                    'Successfully added all the questions to both Exam'
                  )
                  e.target.reset()
                  document.getElementById('my-modal').checked = false
                  window.location.reload(false)
                })
                .catch((e) => console.log(e))
            } else {
              if (data.slots === 0) {
                toast.error('No slot available')
              } else if (data.slots === 1) {
                toast.error('You can send only 1 photo')
              } else {
                toast.error(`You can transfer only  ${data.slots} photoes`)
              }
            }
          })
      } else {
        axios
          .get(
            `/api/exam/slotAvailable?examId=${examId}&setName=${parseInt(
              secondSet
            )}`
          )
          .then(async ({ data }) => {
            const slot = parseInt(data.slots) - selectedQuestions.length
            console.log(
              slot +
                'aasdas ' +
                selectedQuestions.length +
                '  ' +
                parseInt(data.slots)
            )
            if (slot >= 0) {
              await axios
                .put('/api/exam/addQuestionMcqBulk', questionSet)
                .then(({ data }) => {
                  toast.success('Successfully transfered all the questions')
                  e.target.reset()
                  document.getElementById('my-modal').checked = false
                  window.location.reload(false)
                })
                .catch((e) => console.log(e))
            } else {
              if (data.slots === 0) {
                toast.error('No slot available')
              } else if (data.slots === 1) {
                toast.error('You can send only 1 photo')
              } else {
                toast.error(
                  `You cannot transfer more  photoes than the exam has`
                )
              }
            }
          })
          .catch((e) => {
            console.log(e)
            toast.error(e)
          })
      }
    } else {
      toast.error('Select correct Set')
      // document.getElementById("my-modal").checked = false;
      // window.location.reload(false);
    }
  }

  const removeQuestion = (questionId) => {
    axios
      .put('/api/exam/updatequestionstatus', { questionId })
      .then(({ data }) => {
        toast.success('Removed Successfuly')
        let prev = [...questions]
        prev = prev.filter((pr) => pr.questionId !== questionId)
        setQuestions(prev)
      })
      .catch((e) => console.log(e))

    document.getElementById('my-modal-1').checked = false
  }
  const sendQuestionSpecial = async (e) => {
    e.preventDefault()
    const examId = questionExam
    const questionSet = {
      subjectId: questionSubject,
      examId,
      questionArray: selectedQuestions,
      setName: secondSet,
    }

    await axios
      .put('/api/special/addquestionmcqbulk', questionSet)
      .then(({ data }) => {
        toast.success('Successfully added all the questions')
        e.target.reset()
        document.getElementById('my-modal-special').checked = false
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
    if (selectedCourse !== '') {
      axios
        .get(`/api/subject/getsubjectbycourse?courseId=${selectedCourse}`)
        .then(({ data }) => {
          setSubjects(data.data)
          setIsLoading(false)
        })
        .catch((e) => console.log(e))
    } else {
      setSubjects([])
    }
    if (selectedSubject !== '') {
      axios
        .get(
          `/api/exam/getexambysubadmin?subjectId=${selectedSubject}&examType=-1&type=free`
        )
        .then(({ data }) => {
          const newData = data.filter((d) => d.examVariation === 1)
          setExams(newData)
          setIsLoading(false)
        })
        .catch((e) => console.log(e))
    } else {
      setExams([])
    }
  }, [selectedCourse, selectedSubject])
  return (
    <div className=" ">
      <div className="bg-white py-4 px-2 my-3 ">
        <div
          className={` w-full  mx-auto grid grid-cols-1 lg:${
            singleExam?.numberOfSet > 0 ? 'grid-cols-4' : 'grid-cols-3 '
          } gap-4`}
        >
          <div className="form-control">
            <label className="label-text text-center" htmlFor="">
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
                courses.map((course) => (
                  <option
                    className="text-center"
                    key={course._id}
                    value={course._id}
                  >
                    {course.name}
                  </option>
                ))}
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
              onChange={(e) => handleChangeSubject(e)}
            >
              <option value=""></option>
              {subjects?.length > 0 &&
                subjects.map((subject) => (
                  <option
                    className="text-center"
                    key={subject._id}
                    value={subject._id}
                  >
                    {subject.name}
                  </option>
                ))}
            </select>
          </div>
          <div className="form-control">
            <label className="label-text text-center" htmlFor="">
              Select Exam Name
            </label>
            <select
              name="exam_list"
              id="exam_list"
              className="input w-full border-black input-bordered"
              required
              onChange={(e) => handleChangeExam(e)}
            >
              <option value=""></option>
              {exams.length > 0 &&
                exams.map((exam) => (
                  <option
                    className="text-center"
                    key={exam._id}
                    value={exam._id}
                  >
                    {exam.name}
                  </option>
                ))}
            </select>
          </div>
          {singleExam?.numberOfSet > 0 && selectedExam !== '' && (
            <div className="form-control">
              <label className="label-text text-center" htmlFor="">
                Select Set Name
              </label>
              <select
                name="set_name"
                id="set_name"
                className="input w-full border-black input-bordered"
                required
                onChange={(e) => handleChangeSet(parseInt(e.target.value))}
              >
                <option value={-1}></option>
                {[...Array(singleExam?.numberOfSet).keys()].map((id) => (
                  <option key={id} value={id}>
                    {optionName[id]}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>
      {isLoading && <Loader></Loader>}
      {exams.length > 0 && (
        <div className="overflow-x-auto px-0 lg:px-4">
          {selectedQuestions.length > 0 && (
            <div className="w-full mx-auto mt-6 flex justify-start ">
              <label
                htmlFor="my-modal"
                className="btn bg-button hover:bg-gradient-to-r from-[#616161] from-0% to=[#353535] to-100% mr-2 mb-3 lg:mb-0 text-white"
              >
                Send Questions
              </label>
              <label
                htmlFor="my-modal-special"
                className="btn bg-button hover:bg-gradient-to-r from-[#616161] from-0% to=[#353535] to-100% mr-2 mb-3 lg:mb-0 text-white"
              >
                Send Questions to Special
              </label>
            </div>
          )}
          {questions.length > 0 && (
            <table className="table w-full my-10 customTable">
              <thead>
                <tr>
                  <th className="bg-white w-1/12 text-left">
                    <div className="flex justify-center items-center">
                      <input
                        type="checkbox"
                        id="all_check"
                        className="w-6 h-8  border-black rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        onChange={setQuestionBulkAll}
                      />
                    </div>
                  </th>
                  <th className="w-1/12">SI No</th>
                  <th className="bg-white">Question </th>
                  <th className="bg-white">Options</th>
                  <th className="bg-white">
                    Correct<br></br> Option
                  </th>
                  {/* <th className="bg-white">Explanation </th> */}
                  <th className="w-[20px]">Action</th>
                </tr>
              </thead>
              <tbody>
                {questions.map((question, idx) => (
                  <tr key={question.questionId}>
                    <td className="w-[10px]">
                      <div className="flex justify-center items-center">
                        <input
                          type="checkbox"
                          name="single_checbox"
                          id={`select_question` + question.questionId}
                          className="w-4 h-4  border-black rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                          onChange={(e) =>
                            setQuestionBulk(e, question.questionId)
                          }
                        />
                      </div>
                    </td>
                    <td>
                      <span className="text-[20px] font-bold">
                        &nbsp; {idx + 1}.{' '}
                      </span>
                    </td>
                    <td className="w-1/4">
                      {question.type === true ? (
                        question.question
                      ) : (
                        <img
                          src={
                            process.env.REACT_APP_API_HOST +
                            '/' +
                            question.question
                          }
                          alt="question"
                        ></img>
                      )}
                    </td>
                    <td className="w-1/5">
                      {question.type !== false && (
                        <div className="grid grid-cols-1 lg:grid-cols-2">
                          {question.options.map((opt, idx) => {
                            return (
                              <div key={idx}>
                                <span className="text-x">
                                  {`${optionName[idx]})  ${opt}`}{' '}
                                </span>
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </td>
                    <td className="w-[10px]">
                      {optionName[question.correctOption]}
                    </td>
                    {/* <td className="w-1/4">
                      <img
                        src={
                          process.env.REACT_APP_API_HOST +
                          "/" +
                          question.explanation
                        }
                        alt=""
                      />
                    </td> */}
                    <td>
                      <div className='grid grid-cols-1 gap-y-2'>
                      <label
                        htmlFor="option-changer"
                        onClick={()=>setSelectedQuestionId(question.questionId)}
                        className="btn bg-button hover:bg-gradient-to-r from-[#616161] from-0% to=[#353535] to-100% mr-2 mb-3 lg:mb-0 text-white"
                      >
                        Change Answer
                      </label>
                      <DeactivateButton
                        setter={setSelectedQuestionId}
                        value={question.questionId}
                      ></DeactivateButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
      <OptionChanger questionId={selectedQuestionId} numberOfOptions={numberOfOptions}/>
      <SpecialQuestionSender
        sendQuestionSpecial={sendQuestionSpecial}
        setIsLoading={setIsLoading}
        courses={courses}
        questionExam={questionExam}
        setQuestionExam={setQuestionExam}
        questionSubject={questionSubject}
        setQuestionSubject={setQuestionSubject}
        setSecondSet={setSecondSet}
      />
      <QuestionSender
        sendQuestions={sendQuestions}
        handleChangeSecondCourse={handleChangeSecondCourse}
        courses={courses}
        setQuestionSubject={setQuestionSubject}
        secondsubjects={secondsubjects}
        handleChangeBothStatus={handleChangeBothStatus}
        handleSecondExam={handleSecondExam}
        secondexams={secondexams}
        singleSecondExam={singleSecondExam}
        questionExam={questionExam}
        setSecondSet={setSecondSet}
      />
      <PopUpModal
        modalData={selectedQuestionId}
        remove={removeQuestion}
      ></PopUpModal>
    </div>
  )
}

export default ShowQuestions
