import React, { useEffect, useState } from 'react'
import axios from '../../utils/axios'
import Loader from '../../Shared/Loader'

const TeacherScriptCount = () => {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const teacher = JSON.parse(localStorage.getItem('user'))

  useEffect(() => {
    setIsLoading(true);
    axios.get('/api/scripts/get?teacherId='+teacher._id).then(({data}) => {
      console.log(data);
      setData(data)
      setIsLoading(false)
    })
  }, [teacher._id])
  return <div className='px-1 lg:px-8'>
    {
        isLoading && <Loader/>
    }
    {
        data.length===0 && <h1 className='text-4xl font-extrabold text-red flex justify-center items-center'>No Data Found</h1>
    }
    {
          data.length>0 && <table className="table w-full customTable">
          <thead>
            <tr>
              <th className="bg-white">SI</th>
              <th className="bg-white">Exam Name</th>
              <th className="bg-white">Number of Questions</th>
              <th className="bg-white">Number of Students</th>
              <th className="bg-white">Payment Status</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 &&
              data.map((user,idx) => (
                <tr key={user._id}>
                  <td>{idx+1}</td>
                  <td>{user.examId.name}</td>
                  <td>{user.numberOfQuestions}</td>
                  <td>{user.numberOfStudents}</td>
                  <td className={`${user.paid===true? ' text-success' : 'text-red'} font-semibold text-center`}>{user.paid? "Paid" : "Not Paid"}</td>
                  
                </tr>
              ))}
          </tbody>
        </table>
        }
  </div>
}

export default TeacherScriptCount
