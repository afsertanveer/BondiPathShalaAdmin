import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import axios from '../../utils/axios'
import Loader from './../../Shared/Loader'
import { toast } from 'react-hot-toast'
import { optionName } from '../../utils/globalVariables'
import QuestionAdderSpecial from './QuestionAdderSpecial'

const AddQuestionMcqSpecial = () => {
  const [courses, setCourses] = useState([])
  const [exams, setExams] = useState([])
  const [selectedCourse, setSelectedCourse] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [singleExamId, setSingleExamId] = useState(null)
  const [singleExam, setsingleExam] = useState({})
  const [examType, setExamType] = useState(4)
  const [subjects, setSubjects] = useState([])
  const [selectedSubject, setSelectedSubject] = useState(null)
  const [isText, setIsText] = useState(true)
  const [numberOfOptions, setNumberOfOptions] = useState(0)
  const [correctOption, setCorrectOption] = useState(null)
  const [selectedSubjectName,setSelectedSubjectName] = useState("");
  const [nameOfSet, setNameOfSet] = useState(-1)
  const [mcqOptions, setMcqOptions] = useState([])

  const handleAddQuestion = async (e) => {
    e.preventDefault()
    const form = e.target
    let questionText = ''
    if (isText === true) {
      questionText = form.question_text.value
    }

    console.log(mcqOptions)
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

    formdata.append('questionText', questionText)
    formdata.append('type', isText)
    formdata.append('options', JSON.stringify(mcqOptions))
    formdata.append('optionCount', numberOfOptions)
    formdata.append('correctOption', parseInt(correctOption))
    formdata.append('status', true)
    formdata.append('examId', singleExamId)
    formdata.append('subjectId', selectedSubject)
    formdata.append('setName', nameOfSet)

    // console.log(question);

    await axios
      .post(`api/mcqspecialexam/addquestionmcq?examId=${singleExamId}`, formdata, {
        headers: {
          'Content-Type': 'multipart/ form-data',
        },
      })
      .then((data) => {
        toast.success('success')
        form.reset()

        document.getElementById('num_of_options').disabled = false
        setNumberOfOptions(0)
      })
      .catch((e) => console.log(e))
    document.getElementById('my-modal-2').checked = false
  }
  
  const changeSubjectEntries = data =>{
    const newD = data.split('+');
    setSelectedSubjectName(newD[0]);
    setSelectedSubject(newD[1]);
  }

  const handleChangeCourse = (e) => {
    setSelectedCourse(e.target.value)
    setExams([])
  }

  const refillQuestions = id =>{
    const sendingData = {
      examId:id,
      subjectId:selectedSubject
    };
    axios
    .post('/api/mcqspecialexam/refillquestion',sendingData)
    .then((data) => {
      console.log(data)
      toast.success('Questions added to all sets')
      // window.location.reload(false)
    })
    .catch((err) => toast.error(err.response.data))
  }
  useEffect(() => {
    setIsLoading(true)
    axios.get('/api/course/getallcourseadmin').then(({ data }) => {
      setCourses(data.courses)
      setIsLoading(false)
    })
    if (selectedCourse !== '' && examType !== -1) {
     
      axios
        .get(`/api/mcqspecialexam/showmcqspecialexambycourse?courseId=${selectedCourse}`)
        .then(({ data }) => {
          setExams(data)
          if (data.length === 0) {
            toast.error('No Data')
          }
          setIsLoading(false)
        })
        .catch((e) => toast.error(e.response.data))
    } else {
      setExams([])
    }
    if (singleExamId !== null) {
     setIsLoading(true);
      axios
        .get(`/api/mcqspecialexam/showspecialexambyid?examId=${singleExamId}`)
        .then(({ data }) => {
          console.log(data);
          setsingleExam(data)
          setSubjects(data.questionMcq);
          setMcqOptions(data.numberOfOptions)
          if (data.questionType === '0') {
            setIsText(false)
          } else {
            setIsText(true)
          }
          setIsLoading(false);
        })
        .catch((e) => console.log(e))
    } else {
      setsingleExam({})
    }
  }, [selectedCourse, singleExamId, examType])
  return (
    <div className="px-1 lg:px-7">
      <div className="flex w-full justify-center items-center py-5 px-2 my-5  ">
        <div className="bg-white w-full px-4 py-2 flex flex-row justify-evenly items-center">
          <div className="form-control mr-2 ">
            <label className="label-text text-lg text-center" htmlFor="">
              Select Course
            </label>
            <select
              name="course_list"
              id="course_list"
              className="input w-full border-black input-bordered"
              required
              onChange={(e) => handleChangeCourse(e)}
            >
              <option value="">---Select Course---</option>
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

          <div className="form-control mr-2 ">
            <label className="label-text text-lg text-center" htmlFor="">
              Select Exam
            </label>
            <select
              name="exams"
              id="exams"
              className="input w-full border-black input-bordered"
              required
              onChange={(e) => setSingleExamId(e.target.value)}
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

          <div className="form-control mr-2 ">
            <label className="label-text text-lg text-center" htmlFor="">
              Select Subject
            </label>
            <select
              name="subjects_options"
              id="subjects_options"
              className="input w-full border-black input-bordered"
              required
              onChange={(e) => changeSubjectEntries(e.target.value)}
            >
              <option value="">---Select Subject---</option>
              {subjects.map((sub) => (
                  <option key={sub.subjectId._id} value={`${sub.subjectId.name}+${sub.subjectId._id}`}>
                    {sub.subjectId.name}
                  </option>
                ))}
            </select>
          </div>
        </div>
      </div>
      {isLoading && <Loader></Loader>}
      {selectedSubject && subjects.length > 0 && (
        <div className="overflow-x-auto w-full">
          <table className="mx-auto  w-full whitespace-nowrap rounded-lg  divide-y  overflow-hidden">
            <thead>
              <tr>
                
                <th className="width-setter bg-white font-semibold text-sm uppercase px-6 py-2">
                  Subject 
                </th>
                <th className="width-setter bg-white font-semibold text-sm uppercase px-6 py-2">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="even:bg-table-row-even odd:bg-table-row-odd text-center">
              <td className="px-2 py-2 text-center">
                  {selectedSubjectName}
                </td>

                <td className="px-6 py-2 text-center">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    {examType !== 2 && (
                      <label
                        htmlFor="my-modal-2"
                        onClick={() => setSingleExamId(singleExamId)}
                        className="btn bg-button hover:bg-gradient-to-r from-[#616161] from-0% to=[#353535] to-100% mr-2 mb-3 lg:mb-0 text-white"
                      >
                        Add  Question
                      </label>
                    )}
                    <button
                      className="btn bg-button text-[12px] hover:bg-gradient-to-r from-[#616161] from-0% to=[#353535] to-100% mr-2 mb-3 lg:mb-0 text-white"
                      onClick={() => refillQuestions(singleExamId)}
                    >
                      Refill MCQ Sets
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
      <QuestionAdderSpecial
        singleExam={singleExam}
        handleAddQuestion={handleAddQuestion}
        setNameOfSet={setNameOfSet}
        setCorrectOption={setCorrectOption}
        isText={isText}
        setIsText={setIsText}
        setMcqOptions={setMcqOptions}
        mcqOptions={mcqOptions}
      />

    </div>
  )
}

export default AddQuestionMcqSpecial
