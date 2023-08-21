import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../../utils/axios';
import { LoaderIcon } from 'react-hot-toast';

const SingleStudentWrittenANswer = () => {
    const params = useParams();
    const [singleResult,setSingleResult] = useState({});
    const [isLoading,setIsLoading] = useState(false);
    // const [answerScript,setAnswerScript] = useState()
   useEffect(()=>{
    setIsLoading(true);
    axios.get(`/api/student/getwrittenstudentsinglebyexam?examId=${params.examId}&&studentId=${params.studentId}`)
    .then(({data})=>{
        console.log(data);
        setSingleResult(data)
        setIsLoading(false);
        // setAnswerScript(data.answerScript)
    })
   },[params])
    return (
        isLoading? <LoaderIcon></LoaderIcon> : <div>
        {
          typeof(singleResult.answerScript) !== 'undefined' && singleResult.answerScript.length>0 && singleResult.answerScript.map((ans,idx)=>{
           return <div key={idx}>
                {typeof(ans)!=='undefined' && ans.length>0 && <p>{idx+1}</p> }
                <div className='grid grid-cols-1'>
                {
                    typeof(ans)!=='undefined' && ans.length>0 && ans.map((photo,index)=>{
                        return <img key={index+100} src={process.env.REACT_APP_API_HOST+'/'+ photo} alt='ans'/>

                    })
                }
                </div>
                
            </div>
          })
        }
</div>
    );
};

export default SingleStudentWrittenANswer;