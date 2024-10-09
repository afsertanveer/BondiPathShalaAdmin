import React, { Fragment, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from '../../utils/axios'
import Loader from '../../Shared/Loader'
import toast from 'react-hot-toast'
import CheckAnswerScript from '../../components/Editor/CheckAnswerScript'
import CommentAdder from '../../components/common/CommentAdder'

const SingleStudentBothWrittenAnswer = () => {
  const params = useParams()
  const [singleResult, setSingleResult] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [source, setSource] = useState([])
  const [sendButtonEnabler, setSendButtonEnabler] = useState(true)
  const [ansTracker, setAnsTracker] = useState(0)
  const [answerScripts, setAnswerScripts] = useState([])
  const [vacantAnswerSubmitter, setVacantAnswerSubmitter] = useState([])
  const [numberOfAnsweredQuestions, setNumberOfAnsweredQuestions] = useState(-1)
  const [enabler, setEnabler] = useState([])
  const [tracker, setTracker] = useState([])
  const [saveId, setSaveId] = useState(-1)
  const [totalAnsweredQuestion, setTotalAnsweredQuestion] = useState(-1)
  const [teacherId, setTeacherId] = useState(null)
  const [error, setError] = useState("");
  const [subjectId, setSubjectId] = useState(null);

  const navigate = useNavigate()
  let prevSource = []

  const sendImage = async (e) => {
    let lastTracker = tracker
    lastTracker[saveId] = -1
    let lastEnabler = enabler
    for (let i = 0; i < lastEnabler.length; i++) {
      if (lastEnabler[i] === saveId) {
        lastEnabler[i] = -1
      }
    }
    // const id = saveId;
    // console.log(id)
    for (let i = 0; i < lastEnabler.length; i++) {
      if (lastTracker[lastEnabler[i]] === -1 && enabler[i] !== saveId) {
        lastTracker[lastEnabler[i]] = 1
        break
      }
    }
    // console.log('check', lastTracker)
    // console.log('enabler', lastEnabler)
    setTracker(lastTracker)
    setEnabler(lastEnabler)
    e.preventDefault()
    
    setIsLoading(true)

    const form = e.target
    const idx = parseInt(form.index.value)
    const obtainedMarks = parseFloat(form.obtMarks.value).toFixed(2)
    console.log(singleResult.marksPerQuestion[idx], obtainedMarks)
    // setError("Please Check the marking")
    //   return;
    if (
      parseFloat(obtainedMarks) > singleResult.marksPerQuestion[idx]
    ) {
      setError("Please Check the marking")
      return;
    }
    let answer
    // setIsLoading(true)
    // console.log(source.length)
    if (source.length === 0) {
      answer = {
        questionNo: idx + 1,
        obtainedMarks,
        studentId: params.studentId,
        examId: params.examId,
        uploadImages: [],
      }
    } else {
      answer = {
        questionNo: idx + 1,
        obtainedMarks,
        studentId: params.studentId,
        examId: params.examId,
        uploadImages: source,
      }
    }
    //console.log(answer)
    await axios
      .post('/api/teacher/bothcheckscriptsingle', answer)
      .then((data) => {
        setAnsTracker((prev) => prev + 1)
        setSendButtonEnabler(true)
        toast.success('Successfully updated')
        setError("");
        setSource([])
        setIsLoading(false)
      })
      .catch((e) => console.log(e))
  }
  const finalSave = async () => {
    setIsLoading(true)
    const marksCalculation = {
      studentId: params.studentId,
      examId: params.examId,
    }
    const scriptCount = {
      teacherId: teacherId,
      examId: params.examId,
      noq: totalAnsweredQuestion,
      examName: singleResult.examName
    }
    let answer
    for (let k = 0; k < vacantAnswerSubmitter.length; k++) {
      answer = {
        questionNo: vacantAnswerSubmitter[k],
        obtainedMarks: 0.0,
        studentId: params.studentId,
        examId: params.examId,
        uploadImages: [],
      }
      await axios
        .post('/api/teacher/bothcheckscriptsingle', answer)
        .then((data) => {
          if (k + 1 === vacantAnswerSubmitter.length) {
            toast.success('Vacant Script checked')
            axios
              .post('/api/teacher/bothmarkscalculation', marksCalculation)
              .then((data) => {
                axios.post('/api/scripts/add', scriptCount).then((data) => {
                  toast.success('successfully updated the result')
                  setIsLoading(false)
                  navigate('/dashboard/scripts/both/view')
                })
              })
              .catch((e) => console.log(e))
          }
          setSource([])
        })
        .catch((e) => console.log(e))
    }
    if (vacantAnswerSubmitter.length < 1) {
      axios
        .post('/api/teacher/bothmarkscalculation', marksCalculation)
        .then((data) => {
          axios.post('/api/scripts/add', scriptCount).then((data) => {
            toast.success('successfully updated the result')
            setIsLoading(false)
            navigate('/dashboard/scripts/both/view')
          })
        })
        .catch((e) => console.log(e))
    }
  }
  const checkNumber = (marks, id) => {
    //console.log(id)
    if (
      isNaN(marks) === false &&
      parseFloat(marks) <= singleResult.marksPerQuestion[id] &&
      source.length === answerScripts[id].length
    ) {
      // setButtonDisabler(false)
      setSendButtonEnabler(false)
    } else {
      setSendButtonEnabler(true)
    }
  }
  useEffect(() => {
    setIsLoading(true)
    const teacher = JSON.parse(localStorage.getItem('user'))
    setTeacherId(teacher._id)
    axios
      .get(
        `/api/student/bothGetWrittenStudentSingleByExam?examId=${params.examId}&studentId=${params.studentId}`
      )
      .then(({ data }) => {
        setSingleResult(data)
        setSubjectId(data.subjectId);
        // console.log('result', data)
        setAnswerScripts(data.answerScript)
        let count = 0
        for (let i = 0; i < data.answerScript.length; i++) {
          if (data.answerScript[i].length > 0) {
            count++
          }
        }
        // console.log('setTotalAnsweredQuestion', count)
        setTotalAnsweredQuestion(count)
        let answered = 0
        let vacantAnswer = []
        let checker = []
        let flag = 0
        let tr = []
        for (let i = 0; i < data.answerScript.length; i++) {
          if (
            data.answerScript[i] === null ||
            data.answerScript[i].length === 0
          ) {
            vacantAnswer.push(i + 1)
            tr.push(-1)
          } else {
            if (flag === 0) {
              tr.push(1)
              // flag=1;
            } else {
              tr.push(-1)
            }
            checker.push(i)
            answered++
          }
        }
        console.log(tr)
        console.log(checker)
        console.log(answered)
        setTracker(tr)
        setEnabler(checker)
        setNumberOfAnsweredQuestions(answered)
        setVacantAnswerSubmitter(vacantAnswer)
        setIsLoading(false)
      })
  }, [params])
  return isLoading ? (
    <Loader />
  ) : (
    <div>
      {/* {
        source.length>0 && source.map((sr)=><img key={sr} src={sr} alt='lhata'/>)
      } */}

      <div className="min-h-full mb-80 mx-0 px-0 lg:px-8 pe-8 lg:pe-0 ">
        {/* <h1 className='bg-[#00a9ff]'>ASDADA</h1> */}
        {ansTracker !== numberOfAnsweredQuestions &&
          answerScripts.map((answer, idx) => (
            <div key={idx}>
              {answer !== null && tracker[idx] === 1 && (
                <>
                  <p className=" my-4 text-4xl font-extrabold  border-4  border-color-one   w-10 h-10 flex justify-center items-center rounded-full">
                    {idx + 1}
                  </p>
                  <div className="grid grid-cols-1 px-2 py-1 border-4 border-color-one rounded-lg ">
                    {Array.isArray(answer) === true &&
                      answer.map((photo, index) => (
                        <div key={index}>
                          <CheckAnswerScript
                            key={index}
                            index={index}
                            photo={photo}
                            singleResult={singleResult}
                            idx={idx}
                            answer={answer}
                            source={source}
                            setSource={setSource}
                            setSendButtonEnabler={setSendButtonEnabler}
                            sendButtonEnabler={sendButtonEnabler}
                            prevSource={prevSource}
                          />

                          {index + 1 === answer.length && (
                            <>
                              <div className='flex justify-center items-center'>
                                <CommentAdder studentId={params.studentId} examId={params.examId} subjectId={subjectId} questionNo={idx} />

                              </div>
                              <form onSubmit={sendImage} className="my-4 ">
                                <input
                                  type="text"
                                  className="input input-bordered  border-black hidden"
                                  name="index"
                                  id=""
                                  defaultValue={idx}
                                />
                                <p className="ml-4 text-lg font-bold text-red">
                                  Marks out of {singleResult.marksPerQuestion[idx]}
                                </p>
                                <div className="flex flex-col lg:flex-row ">
                                  <input
                                    type="text"
                                    name="obtMarks"
                                    id="obtMarks"
                                    autoComplete="off"
                                    className="input input-bordered  border-black"
                                    onChange={(e) =>
                                      checkNumber(e.target.value, idx)
                                    }
                                    required
                                  />
                                  <input
                                    type="submit"
                                    className="ml-0 lg:ml-4 mt-2 lg:mt-0 btn"
                                    onClick={() => setSaveId(idx)}
                                    value="Save Marks"
                                    disabled={sendButtonEnabler}
                                  />
                                </div>
                              </form>
                            </>
                          )}
                        </div>
                      ))}
                  </div>
                </>
              )}
            </div>
          ))}

        <div className="grid grid-cols-1 ">
          {ansTracker === numberOfAnsweredQuestions && (
            <>
              <div className='flex justify-center items-center'>
                <button className="btn mt-5" onClick={() => finalSave()}>
                  Finish The Process
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* <div className="min-h-full mb-80 mx-0 px-0 lg:px-8 pe-8 lg:pe-0 ">
        {ansTracker !== numberOfAnsweredQuestions &&
          answerScripts.map((answer, idx) => (
            <div key={idx}>
              {answer !== null && tracker[idx] === 1 && (
                <>
                  <p className=" my-4 text-4xl font-extrabold  border-4  border-color-one   w-10 h-10 flex justify-center items-center rounded-full">
                    {idx + 1}
                  </p>
                  <div className="grid grid-cols-1 px-2 py-1 border-4 border-color-one rounded-lg ">
                    {Array.isArray(answer) === true &&
                      answer.map((photo, index) => (
                        <div key={index}>
                          <CheckAnswerScript
                            key={index}
                            index={index}
                            photo={photo}
                            singleResult={singleResult}
                            idx={idx}
                            answer={answer}
                            source={source}
                            setSource={setSource}
                            setSendButtonEnabler={setSendButtonEnabler}
                            sendButtonEnabler={sendButtonEnabler}
                            prevSource={prevSource}
                          />
                          {index + 1 === answer.length && (
                            <form onSubmit={sendImage} className="my-4 ">
                              <input
                                type="text"
                                className="input input-bordered  border-black hidden"
                                name="index"
                                id=""
                                defaultValue={idx}
                              />
                              <p className="ml-4 text-lg font-bold text-red">
                                Marks out of {singleResult.marksPerQuestion[idx]}
                              </p>
                              <div className="flex flex-col lg:flex-row ">
                                <input
                                  type="text"
                                  name="obtMarks"
                                  id="obtMarks"
                                  autoComplete="off"
                                  className="input input-bordered  border-black"
                                  onChange={(e) =>
                                    checkNumber(e.target.value, idx)
                                  }
                                  required
                                />
                                <p className='ml-0 lg:ml-4 text-red text-xl flex justify-center items-center font-bold'>{error}</p>
                                <input
                                  type="submit"
                                  className="ml-0 lg:ml-4 mt-2 lg:mt-0 btn"
                                  onClick={() => setSaveId(idx)}
                                  value="Save Marks"
                                  disabled={sendButtonEnabler}
                                />
                              </div>
                            </form>
                          )}
                        </div>
                      ))}
                  </div>
                </>
              )}
            </div>
          ))}

        <div className="grid grid-cols-1 ">
          {ansTracker === numberOfAnsweredQuestions && (
            <>
              <div className='flex justify-center items-center'>
                <CommentAdder studentId={params.studentId} examId={params.examId} subjectId={null} />

              </div>

              <div className='flex justify-center items-center'>
                <button className="btn mt-5" onClick={() => finalSave()}>
                  Finish The Process
                </button>
              </div>
            </>


          )}
        </div>
      </div> */}
    </div>
  )
}

export default SingleStudentBothWrittenAnswer

