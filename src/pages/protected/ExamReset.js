import React, { useEffect, useState } from 'react'
import axios from '../../utils/axios'
import toast from 'react-hot-toast'
import Loader from '../../Shared/Loader'

const ExamReset = () => {
  const [courses, setCourses] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [examType, setExamType] = useState(-1)
  const [subjects, setSubjects] = useState([])
  const [selectedSubject, setSelectedSubject] = useState('')
  const [selectedExam, setSelectedExam] = useState('')
  const [selectedCourse, setSelectedCourse] = useState('')
  const [exams, setExams] = useState([])
  const [rgn, setRgn] = useState('')

  const resetAll = () => {
    setRgn('')
    if (selectedCourse) {
      document.getElementById('course').disabled = false
      setSelectedCourse('')
      let options = document.querySelectorAll('#course option')
      for (let i = 0; i < options.length; i++) {
        options[i].selected = options[i].defaultSelected
      }
    }
    if (examType !== -1) {
      document.getElementById('examType').disabled = false
      setExamType(-1)
      let examTypeOptions = document.querySelectorAll('#examType option')
      for (let i = 0; i < examTypeOptions.length; i++) {
        examTypeOptions[i].selected = examTypeOptions[i].defaultSelected
      }
    }

    if (selectedSubject) {
      document.getElementById('subjects').disabled = false
      setSelectedSubject('')
      let subjectsId = document.querySelectorAll('#subjects option')
      for (let i = 0; i < subjectsId.length; i++) {
        subjectsId[i].selected = subjectsId[i].defaultSelected
      }
    }

    if (exams.length > 0) {
      document.getElementById('exam_list').disabled = false
      setSelectedExam('')
      let examsId = document.querySelectorAll('#exam_list option')
      for (let i = 0; i < examsId.length; i++) {
        examsId[i].selected = examsId[i].defaultSelected
      }
    }
  }
  const handleSearch = (value) => {
    if (value.length > 3) {
      if (value.length === 13) {
        document.getElementById('rgn_number').disabled = true
        setRgn(value)
      }
      setRgn(value)
    } else {
      setRgn('')
    }
  }
  const restartExam = () => {
    console.log(rgn, examType, selectedExam)
    axios.post('/api/exam/resetexam',{regNo:rgn,examId:selectedExam,type:parseInt(examType)}).then(({ data }) => {
        setIsLoading(true);
        toast.success(data);
        setIsLoading(false);
      }).catch((e)=>toast.error(e))
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
        .catch((e) => {
          console.log(e)
          setIsLoading(false)
        })
    } else {
      setSubjects([])
    }
    if (selectedSubject && examType !== -1 && examType !== 3) {
      if (examType === 0) {
        axios
          .get(`/api/exam/getmcqBySub?subjectId=${selectedSubject}`)
          .then(({ data }) => {
            if (data.length === 0) {
              toast.error('No Data')
            } else {
              setExams(data)
            }
            setIsLoading(false)
          })
          .catch((e) => {
            console.log(selectedSubject)
            console.log(e)
            setIsLoading(false)
          })
      }
      if (examType === 1) {
        axios
          .get(`/api/exam/getwrittenBySub?subjectId=${selectedSubject}`)
          .then(({ data }) => {
            if (data.length === 0) {
              console.log(data.length)
              toast.error('No Data')
            } else {
              setExams(data)
            }
            setIsLoading(false)
          })
          .catch((e) => {
            console.log(e)
            setIsLoading(false)
          })
      }
      if (examType === 2) {
        axios
          .get(`/api/both/getbothexambysubject?subjectId=${selectedSubject}`)
          .then(({ data }) => {
            if (data.examPage.exam.length === 0) {
              toast.error('No Data')
            } else {
              setExams(data.examPage.exam)
            }
            setIsLoading(false)
          })
          .catch((e) => {
            console.log(e)
            setIsLoading(false)
          })
      }
    } else {
      setExams([])
    }
    if (examType === 3) {
      axios
        .get(`/api/special/showspecialexambycourse?courseId=${selectedCourse}`)
        .then(({ data }) => {
          setExams(data)
          if (data.length === 0) {
            toast.error('No Data')
          }
          setIsLoading(false)
        })
        .catch((e) => toast.error(e.response.data))
    }
  }, [selectedCourse, selectedSubject, examType])
  return (
    <>
      {isLoading && <Loader/>}
      <div className="flex flex-col lg:flex-row justify-between">
        <div className="w-full lg:w-1/4 mr-0 lg:mr-4">
          <select
            name="course"
            id="course"
            className="input inline-block border-black input-bordered "
            required
            onChange={(e) => {
              setSelectedCourse(e.target.value)
              document.getElementById('course').disabled = true
            }}
          >
            <option value="" className="text-center">
              Select Course
            </option>
            {courses.length > 0 &&
              courses.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.name}
                </option>
              ))}
          </select>
        </div>
        {selectedCourse && (
          <div>
            <select
              name="examType"
              id="examType"
              className="input border-black input-bordered w-full "
              onChange={(e) => {
                document.getElementById('examType').disabled = true
                setExamType(parseInt(e.target.value))
              }}
              required
            >
              <option value={-1} className="text-center">
                Select Exam Type
              </option>
              <option value={0}>MCQ</option>
              <option value={1}>Written</option>
              <option value={2}>Both</option>
              <option value={3}>Special</option>
            </select>
          </div>
        )}
        {selectedCourse && examType !== -1 && examType !== 3 && (
          <div className="form-control">
            <select
              name="subjects"
              id="subjects"
              className="input w-full border-black input-bordered"
              required
              onChange={(e) => {
                setSelectedSubject(e.target.value)
                document.getElementById('subjects').disabled = true
              }}
            >
              <option value="" className="text-center">
                Select Subject
              </option>
              {subjects?.length > 0 &&
                subjects.map((subject) => (
                  <option key={subject._id} value={subject._id}>
                    {subject.name}
                  </option>
                ))}
            </select>
          </div>
        )}
        {selectedCourse && exams.length > 0 && (
          <div className="form-control">
            <select
              name="exam_list"
              id="exam_list"
              className="input w-full border-black input-bordered"
              required
              onChange={(e) => {
                document.getElementById('exam_list').disabled = true
                setSelectedExam(e.target.value)
              }}
            >
              <option value="" className="text-center">
                {' '}
                Select Exam Name
              </option>
              {exams.length > 0 &&
                exams.map((exam) => (
                  <option key={exam._id} value={exam._id}>
                    {exam.name}
                  </option>
                ))}
            </select>
          </div>
        )}
        {selectedExam && (
          <div>
            <input
              name="rgn_number"
              id="rgn_number"
              className="input w-2/3 border-black input-bordered mx-3 font-bold"
              placeholder="Type Registration Number"
              onChange={(e) => handleSearch(e.target.value)}
              required
            />
          </div>
        )}
      </div>
      <div className="mt-5">
        <button className="btn btn-primary" onClick={resetAll}>
          Reset Inputs
        </button>
        {rgn && (
          <button
            className="btn btn-primary ml-4"
            onClick={() => restartExam()}
          >
            {' '}
            Reset Exam
          </button>
        )}
      </div>
    </>
  )
}

export default ExamReset
