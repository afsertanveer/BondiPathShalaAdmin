import React, { useEffect, useState } from 'react'
import axios from '../../utils/axios'
import Loader from '../../Shared/Loader'
import DeactivateButton from '../../features/common/components/DeactivateButton'
import PopUpModal from '../../features/common/components/PopUpModal'
import RemoveScript from '../../features/common/components/RemoveScript'
import toast from 'react-hot-toast'

const StorageClear = () => {
  const [courses, setCourses] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [examType, setExamType] = useState(-1)
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [examList, setExamList] = useState([])
  const [decativateExam,setDecativateExam] = useState("");

  const removeExam = () =>{
// console.log(decativateExam);
    axios.post(`/api/remove/removebyexam?title=0&examId=${decativateExam}`)
    .then(({data})=>{
        axios.post(`/api/remove/removebyexam?title=1&examId=${decativateExam}`)
        .then(({data})=>{
            toast.success("Successfully removed");
            setIsLoading(true)
            axios
              .get(
                `/api/remove/getexam?courseId=${selectedCourse}&type=${examType}&uploads=0`
              )
              .then(({ data }) => {
                setExamList(data)
                if(data.length===0){
                    toast.error("No Exam found");
                }
                document.getElementById('my-modal-1').checked = false
                setIsLoading(false)
              })
        })
    })

  }
  useEffect(() => {
    setIsLoading(true)
    axios.get('/api/course/getallcourseadmin').then(({ data }) => {
      setCourses(data.courses)
      setIsLoading(false)
    })
    if (examType !== -1) {
      setIsLoading(true)
      axios
        .get(
          `/api/remove/getexam?courseId=${selectedCourse}&type=${examType}&uploads=0`
        )
        .then(({ data }) => {
            if(data.length===0){
                toast.error("No Data");
            }
          setExamList(data)
          setIsLoading(false)
        })
    }
  }, [examType, selectedCourse])
  return (
    <div className='px-1 py-2 lg:px-5'>
      {isLoading && <Loader />}
      <div>
        <div className="flex justify-center items-center py-2 px-2 my-3  ">
          <div className="bg-white w-full px-2 lg:px-6 py-2 grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-4 ">
            <div className="form-control">
              <label className="label-text text-center " htmlFor="">
                Select Course
              </label>
              <select
                name="course_list"
                id="course_list"
                className="input w-full border-black input-bordered"
                required
                onChange={(e) => setSelectedCourse(e.target.value)}
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
            {selectedCourse !== null && (
              <div className="form-control">
                <label className="label-text text-center" htmlFor="">
                  Select Type
                </label>
                <select
                  name="course_list"
                  id="course_list"
                  className="input w-full border-black input-bordered"
                  required
                  onChange={(e) => setExamType(parseInt(e.target.value))}
                >
                  <option className="text-center" value=""></option>
                  <option className="text-center" value="1">
                    Written
                  </option>
                  <option className="text-center" value="2">
                    Both
                  </option>
                  <option className="text-center" value="3">
                    Special
                  </option>
                </select>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        {
          examList.length>0 && <table className="table w-full customTable">
          <thead>
            <tr>
              <th className="bg-white">Name</th>
              <th className="bg-white">Action</th>
            </tr>
          </thead>
          <tbody>
            {examList.length > 0 &&
              examList.map((exam,idx) => (
                <tr key={idx}>
                  <td>{exam.examName}</td>
                  <td>
                   
                    <RemoveScript setter={setDecativateExam} value={exam.examId}></RemoveScript>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        }
      </div>
      <PopUpModal modalData={decativateExam} remove={removeExam}></PopUpModal>
    </div>
  )
}

export default StorageClear
