import { Suspense, lazy, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Skeleton from 'react-loading-skeleton';
import axios from "../../utils/axios";
import backIcon from "../../assets/img/leftArrow.png";
import QuestionWithSolutionMcq from "../../components/common/v2/QuestionWithSolutionMcq";
import BackButton from "../../components/common/BackButton";
const ExamInfoDetails2 = lazy(() => import("../../components/common/v2/ExamInfoDetails"));


const ExamSolution = () => {
  const params = useParams();

  const [queryParams] = useState(new URLSearchParams(window.location.search));
  const [examData, setExamData] = useState(null);
  const [examDetails, setExamDetails] = useState(null);


  useEffect(() => {
    if (queryParams.get('type') === "mcq") {
      Promise.all([
        axios.get(`/api/student/viewsollutionadmin?examId=${params.examId}&studentId=${params.studentId}`),
        axios.get('/api/exam/getexambyid?examId=' + params.examId)
      ]).then(res => {
        setExamData(res[0].data);
        if (!res[1].data) {
          window.alert("Invalid Exam or Exam deactivated");
          window.location.href = "/history";
        }
        setExamDetails(res[1].data);
      }).catch(err => {
        console.log(err);
        window.alert("Something went wrong, please inform us");
      });
    } else if (queryParams.get('type') === "mcq-both") {
      Promise.all([
        axios.get(`/api/student/bothviewsollutionmcqadmin?examId=${params.examId}&studentId=${params.studentId}`),
        axios.get('/api/both/getbothexambyid?examId=' + params.examId)
      ]).then(res => {
        setExamData(res[0].data);
        if (!res[1].data) {
          window.alert("Invalid Exam or Exam deactivated");
          window.location.href = "/history";
        }
        setExamDetails(res[1].data);
      }).catch(err => {
        console.log(err);
        window.alert("Something went wrong, please inform us");
      });
    } else if (queryParams.get('type') === "mcq-special") {
      Promise.all([
        axios.get(`/api/special/viewsollutionmcqadmin?examId=${params.examId}&studentId=${params.studentId}`),
        axios.get('/api/special/showspecialexambyidstudent?examId=' + params.examId)
      ]).then(res => {
        setExamData(res[0].data);
        if (!res[1].data) {
          window.alert("Invalid Exam or Exam deactivated");
          window.location.href = "/history";
        }
        setExamDetails(res[1].data);
      }).catch(err => {
        console.log(err);
        window.alert("Something went wrong, please inform us");
      });
    }
  }, [params.examId,queryParams]);

  return (<>
    <div className="pb-8 px-4 min-h-[90vh]">
      <div className="container max-w-5xl mx-auto">
        {/* examInoDetails */}
        <div className="mb-8 ">

          {queryParams.get("type") === "mcq" && (
            <>
              {
                examDetails ?
                  <Suspense fallback={(<Skeleton count={1} height={128}></Skeleton>)}>
                    <ExamInfoDetails2 examInfos={examDetails} /></Suspense>
                  : <Skeleton count={1} height={128}></Skeleton>
              }
              <div className="px-6 md:px-2 py-6 md:py-4">
                {examData ? examData.map((question, index) => (
                  <QuestionWithSolutionMcq question={question} counter={++index} key={index} type="mcq-only" />
                )) : (<Skeleton count={5} height={128}></Skeleton>)}
              </div>
            </>
          )}
          {
            queryParams.get("type") === "mcq-both" && (
              <>
                {
                  examDetails ?
                    <Suspense fallback={(<Skeleton count={1} height={128}></Skeleton>)}>
                      <ExamInfoDetails2 examInfos={examDetails} variationType="mcq" hide="written" /></Suspense>
                    : <Skeleton count={1} height={128}></Skeleton>
                }
                {examData ? examData.map((question, index) => (
                  <div className="rounded-lg bg-white my-8 border-2 border-orange-600" key={index}>
                    <div className="px-6 md:px-2 py-6 md:py-4">
                      <QuestionWithSolutionMcq question={question} counter={++index} key={index} type="mcq-only"/>
                    </div>
                  </div>
                )) :
                  (<Skeleton count={5} height={128}></Skeleton>)}
              </>
            )
          }
          {
            queryParams.get("type") === "mcq-special" &&
            <>
              {
                examDetails ?
                  <Suspense fallback={(<Skeleton count={1} height={128}></Skeleton>)}>
                    <ExamInfoDetails2 examInfos={examDetails} variationType="special" hide="written" /></Suspense>
                  : <Skeleton count={1} height={128}></Skeleton>
              }

              {examData ? examData.map((subject, index) => (
                <div className="rounded-lg bg-white my-8 border-2 border-orange-600" key={index}>
                  {index < 4 && (<><h2 className="bg-orange-600 text-2xl font-bold text-center pt-1 text-white mb-8 uppercase">{subject.subjectName ?? ""}</h2>
                    <div className="px-6 md:px-2 py-6 md:py-4">
                      {
                        subject.questions.map((question, idx) => (
                          <QuestionWithSolutionMcq question={question} counter={++idx} key={idx} />
                        ))
                      }
                    </div>
                  </>)}
                </div>
              )) : (<Skeleton count={5} height={128}></Skeleton>)}
            </>
          }
        </div>
        <div className="pb-8">
          <BackButton url="/history" title="Back to History Page" icon={backIcon} />
        </div>
      </div>
    </div ></>
  );
};

export default ExamSolution;
