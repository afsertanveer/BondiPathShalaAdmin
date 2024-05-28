import React, { useEffect, useState } from 'react'
import axios from '../../utils/axios'
import Loader from '../../Shared/Loader'
import toast from 'react-hot-toast'
import Latex from 'react-latex'

const AllTeacherScriptCount = () => {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const changeStatus = (id) => {
    axios.post('/api/scripts/changeStatus', { id }).then(({ data }) => {
      toast.success('Payment Successful')
      window.location.reload(false)
    })
  }
  useEffect(() => {
    setIsLoading(true)
    axios.get('/api/scripts/getAll').then(({ data }) => {
      console.log(data)
      setData(data)
      setIsLoading(false)
    })
  }, [])
  return (
    <div className="px-1 lg:px-8">
      {isLoading && <Loader />}
      {data.length === 0 && (
        <h1 className="text-4xl font-extrabold text-red flex justify-center items-center">
          No Data Found
        </h1>
      )}
      {data.length > 0 && (
        <table className="table w-full customTable">
          <thead>
            <tr>
              <th className="bg-white">SI</th>
              <th className="bg-white">Teacher Name</th>
              <th className="bg-white">Exam Name</th>
              <th className="bg-white">Number of Questions</th>
              <th className="bg-white">Number of Students</th>
              <th className="bg-white">Action</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 &&
              data.map((user, idx) => (
                <tr key={user._id}>
                  <td>{idx + 1}</td>
                  <td>{user.teacherId.name}</td>
                  <td>{user.examId.name}</td>
                  <td>{user.numberOfQuestions}</td>
                  <td>{user.numberOfStudents}</td>
                  <td>
                    {user.paid ? (
                      <h1 className="text-2xl text-success font-bold">Paid</h1>
                    ) : (
                      <button
                        className="btn "
                        onClick={() => changeStatus(user._id)}
                      >
                        Pay
                      </button>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </div>
    
  )
}

export default AllTeacherScriptCount
