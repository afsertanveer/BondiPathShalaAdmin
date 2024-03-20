import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import axios from '../../utils/axios'
import Loader from './../../Shared/Loader'
import { toast } from 'react-hot-toast'
import { optionName } from '../../utils/globalVariables'
import DeactivateButton from '../../features/common/components/DeactivateButton'
import PopUpModal from '../../features/common/components/PopUpModal'
import QuestionSender from '../../components/QuestionSender/QuestionSender'
import SpecialQuestionSender from './SpecialQuestionSender'
import OptionChanger from './OptionChanger'
import { shuffle } from '../../utils/globalFunction'
const ShowQuestionSpecial = () => {
  const [courses, setCourses] = useState([])
  const [subjects, setSubjects] = useState([])
  const [exams, setExams] = useState([])
  const [questions, setQuestions] = useState([])
  const [selectedCourse, setSelectedCourse] = useState('')
  const [selectedQuestionId, setSelectedQuestionId] = useState('')
  const [selectedSubject, setSelectedSubject] = useState(null)
  const [selectedExam, setSelectedExam] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [examType, setExamType] = useState(3)
  const [singleExam, setSingleExam] = useState({})
  const [writtenQuestion, setWrittenQuestion] = useState({})
  const [bothStatus, setBothStatus] = useState(-1)
  const [selectedSet, setSelectedSet] = useState(-1)
  const [selectedQuestions, setSelectedQuestions] = useState([])
  const [secondsubjects, setSecondSubjects] = useState([])
  const [questionExam, setQuestionExam] = useState('')
  const [singleSecondExam, setSingleSecondExam] = useState({})
  const [secondexams, setSecondExams] = useState([])
  const [questionSubject, setQuestionSubject] = useState('')
  const [secondSet, setSecondSet] = useState(-1)
  const [numberOfOptions, setNumberOfOptions] = useState(0)
  const [specialExams, setSpecialExmas] = useState([])

  function arrayRemove(arr, value) {
    return arr.filter(function (ele) {
      return ele !== value
    })
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
  const handleSecondExam = (val) => {
    if (val !== '') {
      if (bothStatus === false) {
        axios
          .get(`/api/exam/getExamById?examId=${val}`)
          .then(({ data }) => {
            setSingleSecondExam(data)
            setQuestionExam(val)
            setQuestions([])
          })
          .catch((e) => console.log(e))
      } else {
        axios
          .get('/api/both/getbothexambyid?examId=' + val)
          .then(({ data }) => {
            console.log(data)
            setSingleSecondExam(data)
            setQuestionExam(val)
            setQuestions([])
          })
      }
    } else {
      setSecondExams('')
      setQuestions([])
      setSingleSecondExam({})
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
  const handleChangeCourse = (e) => {
    setSelectedSubject('')
    setSubjects([])
    setExams('')
    setExams([])
    setQuestions([])
    setSelectedCourse(e.target.value)
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
  const bothStatusChanger = (e) => {
    setQuestions([])
    setWrittenQuestion({})
    setExamType(parseInt(e.target.value))
    setBothStatus(parseInt(e.target.value))
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
  const onChangeExam = (id) => {
    setSelectedExam(id)
  }
  const handleChangeSet = (setName) => {
    console.log(setName)
    setSelectedSet(parseInt(setName))
    setIsLoading(true)
    if (parseInt(setName) !== -1) {
      axios
        .get(
          `/api/special/questionByExamIdSubjectAndSet?examId=${selectedExam}&subjectId=${selectedSubject}&setName=${parseInt(
            setName
          )}`
        )
        .then(({ data }) => {
          const newData = shuffle(data);
          setQuestions(newData);
          setIsLoading(false)
          if (data.length === 0) {
            toast.error('No question for this set')
          }
          setWrittenQuestion(null)
          setIsLoading(false)
        })
        .catch((e) => {
          setIsLoading(false)
          setQuestions([])
          toast.error(e.response.data)
        })
    } else {
      setIsLoading(false)
      setQuestions([])
    }
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
        // window.location.reload(false)
      })
      .catch((e) => console.log(e))
  }

  useEffect(() => {
    setIsLoading(true)
    axios.get('/api/course/getallcourseadmin').then(({ data }) => {
      setCourses(data.courses)
      setIsLoading(false)
    })
    if (selectedCourse !== '' && examType !== -1) {
      axios
        .get(`/api/special/showspecialexambycourse?courseId=${selectedCourse}`)
        .then(({ data }) => {
          setExams(data)
          if (data.lengdh === 0) {
            toast.error('No Data')
          }
          setIsLoading(false)
        })
        .catch((e) => console.log(e))
      axios
        .get(`/api/subject/getsubjectbycourse?courseId=${selectedCourse}`)
        .then(({ data }) => {
          setSubjects(data.data)
          setIsLoading(false)
        })
        .catch((err) => console.log('subject fetching error'))
    } else {
      setSubjects([])
    }
    if (selectedExam) {
      axios
        .get(`/api/special/showspecialexambyid?examId=${selectedExam}`)
        .then(({ data }) => {
          // console.log(data);
          // let allSub = subjects;
          // let newSub = [];
          // for(let i = 0 ; i<data.allsubject.length;i++){
          //   for(let j =0 ; j<allSub.length;j++){
          //     if(allSub[j]===data.allSubject[i]){
          //       newSub.push(data.allSubject[i])
          //     }
          //   }

          // }
          // setSubjects(newSub)
          setSingleExam(data)
          setNumberOfOptions(data.numberOfOptions);
        })
        .catch((e) => console.log(e))
    } else {
      setSingleExam({})
    }

    if (selectedSubject) {
      if (examType === 2) {
        axios
          .get(
            `api/special/getwrittenquestionbyexamsub?examId=${selectedExam}&subjectId=${selectedSubject}`
          )
          .then(({ data }) => {
            setWrittenQuestion(data)
            setIsLoading(false)
          })
          .catch((e) => {
            setQuestions([])
            setWrittenQuestion({})
            toast.error(e.response.data)
          })
      }
    } else {
      setQuestions([])
    }
  }, [selectedCourse, selectedSubject, selectedExam, examType, bothStatus])
  return (
    <div className=" px-0 lg:px-4">
      <div className="flex w-full justify-center items-center py-5 px-2 my-5  ">
        <div className="bg-white px-1 lg:px-2   py-2 grid grid-cols-1 lg:grid-cols-5 gap-3">
          <div className="form-control  ">
            <label
              className="label-text text-center font-semibold text-lg"
              htmlFor=""
            >
              Select Course
            </label>
            <select
              name="course_list"
              id="course_list"
              className="input w-full border-black input-bordered"
              required
              onChange={(e) => handleChangeCourse(e)}
            >
              <option value="">---Select Course----</option>
              {courses.length > 0 &&
                courses.map(
                  (course) =>
                    course.name !== 'Free' && (
                      <option key={course._id} value={course._id}>
                        {course.name}
                      </option>
                    )
                )}
            </select>
          </div>
          <div className="form-control  ">
            <label
              className="label-text text-center font-semibold text-lg"
              htmlFor=""
            >
              Select Exam
            </label>
            <select
              name="exams"
              id="exams"
              className="input w-full border-black input-bordered"
              required
              onChange={(e) => onChangeExam(e.target.value)}
            >
              <option value="">---Select Exam---</option>
              {exams.length > 0 &&
                exams.map((exam) => (
                  <option key={exam._id} value={exam._id}>
                    {exam.name}
                  </option>
                ))}
            </select>
          </div>

          <div className="form-control  ">
            <label
              className="label-text text-center font-semibold text-lg"
              htmlFor=""
            >
              Select Subject
            </label>
            <select
              name="subjects_options"
              id="subjects_options"
              className="input w-full border-black input-bordered"
              required
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              <option value="">---Select Subject---</option>
              {subjects.map((sub) => (
                <option key={sub._id} value={sub._id}>
                  {sub.name}
                </option>
              ))}
            </select>
          </div>
          {
            <div className="form-control  ">
              <label
                className="label-text text-center font-semibold text-lg"
                htmlFor=""
              >
                Select Type
              </label>
              <select
                name="both_type"
                id="both_type"
                className="input w-full border-black input-bordered"
                required
                onChange={(e) => bothStatusChanger(e)}
              >
                <option value="">---Select MCQ/Written---</option>
                <option value={1}>MCQ</option>
                <option value={2}>Written</option>
              </select>
            </div>
          }
          {singleExam?.numberOfSet > 0 &&
            selectedExam !== '' &&
            examType === 1 && (
              <div className="form-control">
                <label
                  className="label-text text-center font-semibold text-lg"
                  htmlFor=""
                >
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
      {isLoading && <Loader></Loader>}
      {(questions.length > 0 || writtenQuestion) && (
        <div className="overflow-x-auto px-0 lg:px-4">
          {(questions.length > 0 || writtenQuestion) && (
            <table className="table w-full my-10 customTable">
              <thead>
                <tr>
                  {(examType === 1 || (bothStatus === 1 && examType === 3)) && (
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
                  )}
                  {(examType === 1 || (bothStatus === 1 && examType === 3)) && (
                    <th className="bg-white">SI No</th>
                  )}
                  <th className="bg-white">Question </th>
                  {(examType === 1 || (bothStatus === 1 && examType === 3)) && (
                    <th className="bg-white">Options</th>
                  )}
                  {(examType === 1 || (bothStatus === 1 && examType === 3)) && (
                    <th className="bg-white">
                      Correct<br></br> Option
                    </th>
                  )}

                  {(examType === 2 || (bothStatus === 2 && examType === 3)) && (
                    <th className="bg-white">Marks By Questions</th>
                  )}
                  <th className="bg-white">Action</th>
                </tr>
              </thead>
              <tbody>
                {(examType === 2 || (bothStatus === 2 && examType === 3)) && (
                  <tr>
                    <td className="w-2/3">
                      {' '}
                      <img
                        src={
                          process.env.REACT_APP_API_HOST +
                          '/' +
                          writtenQuestion.writtenILink
                        }
                        alt="question"
                      ></img>
                    </td>
                    <td>
                      {writtenQuestion?.marksPerQuestion?.map((mp, idx) => (
                        <span key={idx} className="mr-2 text-lg font-bold">
                          {idx + 1 + ') ' + mp + ''}
                        </span>
                      ))}
                    </td>
                  </tr>
                )}
                {questions.map((question, idx) => (
                  <tr key={question.questionId}>
                    {(examType === 1 ||
                      (bothStatus === 1 && examType === 3)) && (
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
                    )}
                    {(examType === 1 ||
                      (bothStatus === 1 && examType === 3)) && (
                      <td className="bg-white">{idx + 1}.</td>
                    )}
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
                    {(examType === 1 ||
                      (bothStatus === 1 && examType === 3)) && (
                      <td className="w-fit lg:w-1/4">
                        {question.type !== false && (
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-3 pr-0 lg:pr-10">
                            {question.options.map((opt, idx) => {
                              return (
                                <div
                                  key={idx}
                                  className="grid grid-cols-1 lg:grid-cols-2 gap-x-2 gap-y-2 "
                                >
                                  <span className="flex justify-start lg:justify-end">
                                    {`${optionName[idx]})  `}&nbsp;
                                  </span>
                                  <span className="flex justify-start">
                                    {opt}
                                  </span>
                                </div>
                              )
                            })}
                          </div>
                        )}
                      </td>
                    )}
                    {(examType === 1 ||
                      (bothStatus === 1 && examType === 3)) && (
                      <td className="w-[10px]">
                        {optionName[question.correctOption]}
                      </td>
                    )}

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

      <OptionChanger
        questionId={selectedQuestionId}
        numberOfOptions={numberOfOptions}
      />

      <PopUpModal
        modalData={selectedQuestionId}
        remove={removeQuestion}
      ></PopUpModal>
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
    </div>
  )
}

export default ShowQuestionSpecial
