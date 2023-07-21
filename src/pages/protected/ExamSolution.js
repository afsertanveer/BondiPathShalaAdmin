import { lazy, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import QuestionWithSolution from "../../components/common/QuestionWithSolution";
import axios from "../../utils/axios";
import Loader from "../../Shared/Loader";

const ExamInfoDetails = lazy(() => import("../../components/common/ExamInfoDetails"));


const ExamSolution = () => {
  const params = useParams();
  const [examData, setExamData] = useState(null);
  const [examDetails, setExamDetails] = useState(null);

  useEffect(() => {
    axios.get(`api/student/viewsollutionadmin?studentId=${params.studentId}&examId=${params.examId}`).then(data=>{
        setExamData(data.data)
    }).catch(err => {
        console.log(err);
        window.alert("Something went wrong, please inform us");
      });

    axios.get('api/exam/getExamById?examId=' + params.examId).then(res=>{

        console.log(res.data);
        setExamDetails(res.data)
    }).catch(err => {
        console.log(err);
        window.alert("Something went wrong, please inform us");
      });

  }, [params.examId,params.studentId]);

  return (
    <div className="px-0 md:px-4 lg:px-20">
      <div className="container mx-auto">
        {/* examInoDetails */}
        <div className="mb-8">
          {
            examDetails &&
              <ExamInfoDetails examInfos={examDetails} />
              
          }

          <div className=" bg-white px-6 md:px-2 py-6 md:py-4 mt-4">
            {examData ? examData.map((question, index) => (
              <QuestionWithSolution question={question} index={++index} key={index} />
            )) : <Loader></Loader> }
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamSolution;
