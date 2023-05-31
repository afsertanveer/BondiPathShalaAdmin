import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from '../../utils/axios';
import v2 from '../../assets/img/icons/eye.svg'
import Loader from '../../Shared/Loader';
import { type, variation } from '../../utils/globalVariables';

const StudentHistory = () => {
    const params = useParams();
    const studentId = params.studentId;
    const [historyData,setHistoryData] = useState([]);
    const [isLoading,setIsLoading] = useState(false);
    
    useEffect(()=>{
        setIsLoading(true);
        axios.get('/api/student/historydataadmin?studentId='+studentId).then(({data})=>{
            setHistoryData(data.resultData);
            setIsLoading(false);
        }).catch(e=>{
            setIsLoading(false);
            console.log(e);
        })

    },[studentId])
    return (
        <div>
            {isLoading && <Loader></Loader>}
      {
        historyData?.length>0 && <div className="overflow-x-auto">
         <div className="overflow-x-auto pt-1 pb-8 px-4">
        <table className="overflow-x-scroll table-fixed w-full customTable">
          {/* head */}
          <thead>
            <tr className="text-center">
              <th className="py-5 w-[80px]">Sl No.</th>
              <th className="py-5 w-[80px]">Exam TItle</th>
              <th className="w-[160px]">Start Time</th>
              <th className="w-[160px]">End Time</th>
              <th className="w-[160px]">Subject</th>
              <th className="w-[160px]">D/W/M</th>
              <th className="w-[160px]">Exam Type</th>
              <th className="w-[90px]">Marks</th>
              <th className="w-[110px]">Merit Postition</th>
              <th className="w-[200px]">Action</th>
            </tr>
          </thead>
          <tbody>
            {historyData ?
              historyData.map((data, index) => (
                <tr
                  key={index}
                  className="even:bg-table-row-even odd:bg-table-row-odd text-center "
                >
                  <td>{index + 1}</td>
                  <td>{data.title}</td>
                  <td>{data.examStartTime}</td>
                  <td>{data.examEndTime}</td>
                  <td>{data.subjectName}</td>
                  <td>{type[data.type]}</td>
                  <td>{variation[data.variation]}</td>
                  <td>{data.totalObtainedMarks ?? 0}/{data.totalMarksMcq}</td>
                  <td>{data.meritPosition}</td>
                  <td>
                    <div className="flex px-2 justify-evenly">
                      <Link to={`/dashboard/exams/${studentId}/${data.examId}/solution`} className="tooltip bg-color-two rounded-full text-center h-[38px] w-[38px]" data-tip="Get Solution">
                        <img className="inline-flex img p-2" src={v2} alt="view-solution" />
                      </Link>
                    </div>
                  </td>
                </tr>
              )) : (<tr><td colSpan={9}><p  className="my-2 text-3xl text-center font-bold text-red">No Data Found</p></td></tr>)}
          </tbody>
        </table>
      </div>
      </div>
      }
        </div>
    );
};

export default StudentHistory;