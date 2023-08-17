import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../../utils/axios';

const SingleStudentWrittenANswer = () => {
    const params = useParams();
    console.log(params);
   useEffect(()=>{
    axios.get(`/api/student/getwrittenstudentsinglebyexam?examId=${params.examId}&&studentId=${params.studentId}`)
    .then(({data})=>{
        console.log(data);
    })
   },[params])
    return (
        <div>
                {params.studentId}
        </div>
    );
};

export default SingleStudentWrittenANswer;