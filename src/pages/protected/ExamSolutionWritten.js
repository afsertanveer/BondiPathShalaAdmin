import { Suspense, lazy, useEffect, useState } from "react";
import {  useParams } from "react-router-dom";
import Skeleton from 'react-loading-skeleton';
import axios from "../../utils/axios";
import backIcon from "../../assets/img/leftArrow.png";
import BackButton from "../../components/common/BackButton";
const ExamInfoDetails = lazy(() => import("../../components/common/ExamInfoDetails"));
const ExamInfoDetails2 = lazy(() => import("../../components/common/v2/ExamInfoDetails"));

const ExamSolutionWritten = () => {
    const params = useParams();
    const [queryParams] = useState(new URLSearchParams(window.location.search));
    const [examData, setExamData] = useState(null);
    const [examDetails, setExamDetails] = useState(null);
   
    useEffect(() => {
        if (queryParams.get('type') === "written") {
            Promise.all([
                axios.get(`/api/student/viewSollutionwrittenadmin?examId=${params.examId}&studentId=${params.studentId} `),
                axios.get('/api/exam/getexambyid?examId=' + params.examId)
            ]).then(res => {
                setExamData(res[0].data);
                setExamDetails(res[1].data);
            }).catch(err => {
                console.log(err);
                window.alert("Something went wrong, please inform us");
            });
        } else if (queryParams.get('type') === "written-both") {
            Promise.all([
                axios.get(`/api/student/bothviewsollutionwrittenadmin?examId=${params.examId}&studentId=${params.studentId}`),
                axios.get('/api/both/getbothexambyid?examId=' + params.examId)
            ]).then(res => {
                setExamData(res[0].data);
                setExamDetails(res[1].data);
            }).catch(err => {
                console.log(err);
                window.alert("Something went wrong, please inform us");
            });
        }
        else if (queryParams.get('type') === "written-special") {
            Promise.all([
                axios.get(`/api/special/viewsollutionwrittenadmin?examId=${params.examId}&studentId=${params.studentId}` ),
                axios.get('/api/special/showspecialexambyidstudent?examId=' + params.examId)
            ]).then(res => {
                setExamData(res[0].data);
                setExamDetails(res[1].data);
            }).catch(err => {
                console.log(err);
                window.alert("Something went wrong, please inform us");
            });
        }
    }, [ queryParams,params.examId,params]);
    return (
        <>
         
            <div className="pb-8 px-4 min-h-[90vh]">
                <div className="container max-w-5xl mx-auto">
                    {/* examInoDetails */}
                    {queryParams.get("type") === "written" && (
                        <div className="mb-8 p-2">
                            {
                                examDetails ?
                                    <Suspense fallback={(<Skeleton count={1} height={128}></Skeleton>)}>
                                        <ExamInfoDetails examInfos={examDetails} examVariation={2} />
                                    </Suspense>
                                    : <Skeleton count={1} height={128}></Skeleton>
                            }

                            {examData && (<>
                                <div className="mb-6 rounded-lg shadow-[0px_0px_6px_2px_rgba(0,0,0,0.25)]">
                                    <div className="mb-3">
                                        <img className="w-full rounded-b-lg" src={`${process.env.REACT_APP_FILES_HOST}/${examData.question}`} alt="aaa" />
                                    </div>
                                </div>
                                {examData.sollutionScript.map((value, index) => (
                                    <div className="mb-6 shadow-[0px_0px_6px_2px_rgba(0,0,0,0.5)] rounded-lg">
                                        <div className="flex p-2 justify-between border-b-2 border-border-color-4">
                                            <h5 className="text-color-one">Marks: <strong>{examData.marksPerQuestion[index] ?? 0}</strong></h5>
                                            <div className="mx-auto">|</div>
                                            <h5 className="text-color-one">Obtained Marks: <strong>{examData.obtainedMarks[index] ?? 0}</strong></h5>
                                        </div>
                                        <div className="flex p-2 justify-center">
                                            <img src={`${process.env.REACT_APP_FILES_HOST}/${value}`}   alt={value} />
                                        </div>
                                    </div>
                                ))}
                            </>)}
                        </div>
                    )}
                    {
                        queryParams.get("type") === "written-both" && (
                            <div className="mb-8 p-4 bg-white rounded-lg border-2 border-orange-200">
                                {
                                    examDetails ?
                                        <Suspense fallback={(<Skeleton count={1} height={128}></Skeleton>)}>
                                            <ExamInfoDetails examInfos={examDetails} examVariation={2} />
                                        </Suspense>
                                        : <Skeleton count={1} height={128}></Skeleton>
                                }

                                {examData && (<>
                                    <div className="mb-6  rounded-lg shadow-[0px_0px_6px_2px_rgba(0,0,0,0.25)]">
                                        <div className="mb-3">
                                            <img className="w-full rounded-b-lg" src={`${process.env.REACT_APP_FILES_HOST}/${examData.question}`} alt={"asdads"} />
                                        </div>
                                    </div>
                                    <h3 className="text-center text-xl font-bold border-b-2 border-t-2 border-orange-400 mt-4 mb-6">Answerscripts</h3>
                                    {examData.sollutionScript.map((value, index) => (
                                        <div className="mb-2 mt-6 pb-1 shadow-[0px_0px_6px_2px_rgba(0,0,0,0.5)] rounded-lg" key={index}>
                                            <div className="flex p-2 justify-between border-b-2 border-border-color-4">

                                                <h5 className="text-color-one">Question no: <strong>{parseInt(1 + index)}</strong></h5>
                                                <div className="mx-auto">|</div>
                                                <h5 className="text-color-one">Marks: <strong>{examData.marksPerQuestion[index] ?? 0}</strong></h5>
                                                <div className="mx-auto">|</div>
                                                <h5 className="text-color-one">Obtained Marks: <strong>{examData.obtainedMarks[index] ?? 0}</strong></h5>
                                            </div>
                                            {value.map((img, idx) => (
                                                <div className="m-4 rounded-lg flex p-2 justify-center border-2 border-orange-200" key={idx}>
                                                    <img src={`${process.env.REACT_APP_FILES_HOST}/${img}`}   alt={img} />
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </>)}
                            </div>
                        )
                    }
                    {queryParams.get("type") === "written-special" && (
                        <div className="mb-8 p-2">
                            {
                                examDetails ?
                                    <Suspense fallback={(<Skeleton count={1} height={128}></Skeleton>)}>
                                        <ExamInfoDetails2 examInfos={examDetails} variationType="special" hide="mcq" /></Suspense>
                                    : <Skeleton count={1} height={128}></Skeleton>
                            }
                            {examData &&
                                <>
                                    {examData.map((value, index) => (<div className="mt-6 rounded-lg bg-white border-2 border-orange-600" key={index}>
                                        <h2 className="bg-orange-600 text-2xl font-bold text-center text-white mb-0 uppercase">{value.name ?? ""}</h2>
                                        <div className="p-4 rounded-b-lg ">
                                            <div className="mb-3">
                                                <img className="w-full rounded-lg shadow-[0px_0px_6px_2px_rgba(0,0,0,0.25)]" src={`${process.env.REACT_APP_FILES_HOST}/${value.iLink}`} />
                                            </div>
                                            <h3 className="text-center text-xl font-bold border-b-2 border-t-2 border-orange-400 mt-4 mb-6">Answerscripts</h3>
                                            {
                                                value.answerScript.map((answerS, indexx) => (
                                                    <div className="mb-4 shadow-[0px_0px_4px_2px_rgba(0,0,0,0.15)] rounded-lg" key={indexx}>
                                                        <div className="flex py-2 px-6 justify-between border-b-2 border-border-color-4">
                                                            <h5 className="text-color-one">Question no: <strong>{parseInt(1 + indexx)}</strong></h5>
                                                            <div className="mx-auto">|</div>
                                                            <h5 className="text-color-one">Obtained Marks: <strong>{value.marksPerQuestion[indexx] ?? 0}</strong></h5>
                                                        </div>
                                                        {
                                                            answerS.map((iLink, index3) => (
                                                                <div className="flex p-2 justify-center" key={index3}>
                                                                    <img src={`${process.env.REACT_APP_FILES_HOST}/${iLink}`}   alt={iLink} />
                                                                </div>
                                                            ))
                                                        }
                                                    </div>
                                                )
                                                )
                                            }
                                        </div>
                                    </div>))
                                    }
                                </>}
                        </div>
                    )}
                    <div className="pb-8">
                        <BackButton url="/history" title="Back to History Page" icon={backIcon} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default ExamSolutionWritten