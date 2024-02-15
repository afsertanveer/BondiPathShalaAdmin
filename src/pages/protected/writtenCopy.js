import React, { Fragment, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from '../../utils/axios'
import { LoaderIcon, toast } from 'react-hot-toast'
import 'tui-color-picker/dist/tui-color-picker.css'
import 'tui-image-editor/dist/tui-image-editor.css'
import ImageEditor from '@toast-ui/react-image-editor'
import { whiteTheme } from '../../utils/globalVariables'
import Loader from '../../Shared/Loader'

const SingleStudentWrittenANswer = () => {
  const params = useParams()
  const [singleResult, setSingleResult] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [source, setSource] = useState([])
  const [sendButtonEnabler, setSendButtonEnabler] = useState(true)
  const [ansTracker, setAnsTracker] = useState(0)
  const [answerScripts, setAnswerScripts] = useState([])
  const [vacantAnswerSubmitter, setVacantAnswerSubmitter] = useState([])
  const [numberOfAnsweredQuestions, setNumberOfAnsweredQuestions] = useState(-1)
  const [enabler,setEnabler] = useState([]);
  const [tracker,setTracker] = useState([]);
  const [saveId,setSaveId] = useState(-1);

  const navigate = useNavigate()
  let prevSource = []
  const imageEditor = React.createRef()
  const logImageContent = () => {
    const imageEditorInst = imageEditor.current.imageEditorInst
    const data = imageEditorInst.toDataURL()
    let bigImage = document.createElement('img')
    bigImage.src = data
    bigImage.onload = (e2) => {
      let canvas = document.createElement('canvas')
      let ratio = 600 / e2.target.width
      canvas.width = 600
      canvas.height = e2.target.height * ratio

      const context = canvas.getContext('2d')
      context.drawImage(bigImage, 0, 0, canvas.width, canvas.height)
      let newImageUrl = context.canvas.toDataURL('image/jpeg', 100)
      prevSource = [...source]
      prevSource.push(newImageUrl)
      setSource(prevSource)
      setSendButtonEnabler(false)
    }
    toast.success('Image Saved')
  }
  const checkNext = (i, j) => {
    // //console.log(source)
    const imageEditorInst = imageEditor.current.imageEditorInst
    const data = imageEditorInst.toDataURL()
    // //console.log('imageData: ', data)

    let bigImage = document.createElement('img')
    bigImage.src = data
    bigImage.onload = (e2) => {
      let canvas = document.createElement('canvas')
      let ratio = 600 / e2.target.width
      canvas.width = 600
      canvas.height = e2.target.height * ratio

      const context = canvas.getContext('2d')
      context.drawImage(bigImage, 0, 0, canvas.width, canvas.height)
      let newImageUrl = context.canvas.toDataURL('image/jpeg', 100)
      prevSource = [...source]
      prevSource.push(newImageUrl)
      setSource(prevSource)
    }

    toast.success('Image Saved')
  }
  const sendImage = async (e) => {
    let lastTracker = tracker;
    lastTracker[saveId] = -1 ;
    let lastEnabler = enabler;
    lastEnabler[saveId] = -1;
    for( let i = 0 ; i<lastEnabler.length ; i++ ){
      if(lastTracker[lastEnabler[i]]===-1 && enabler[i]!==saveId){
          lastTracker[lastEnabler[i]] = 1 ;
          break;
      }
    }
    setTracker(lastTracker);
    setEnabler(lastEnabler);
    e.preventDefault()
    setIsLoading(true)

    const form = e.target
    const idx = parseInt(form.index.value)
    const obtainedMarks = parseFloat(form.obtMarks.value).toFixed(2)

    let answer
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
      .post('/api/teacher/checkscriptsingle', answer)
      .then((data) => {
        setAnsTracker((prev) => prev + 1)
        setSendButtonEnabler(true);
        toast.success('Successfully updated')
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
    const statusUpdate = {
      studentId: params.studentId,
      examId: params.examId,
      status: true,
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
        .post('/api/teacher/checkscriptsingle', answer)
        .then((data) => {
          if (k + 1 === vacantAnswerSubmitter.length) {
            toast.success('Vacant Script checked')
            axios
              .post('/api/teacher/markscalculation', marksCalculation)
              .then((data) => {
                axios
                  .post('/api/teacher/checkstatusupdate', statusUpdate)
                  .then((data) => {
                    toast.success('successfully updated the result')
                    setIsLoading(false)
                    navigate('/dashboard/scripts/view')
                  })
                  .catch((e) => console.log(e))
              })
              .catch((e) => console.log(e))
          }
          setSource([])
        })
        .catch((e) => console.log(e))
    }
    if (vacantAnswerSubmitter.length < 1) {
      axios
        .post('/api/teacher/markscalculation', marksCalculation)
        .then((data) => {
          axios
            .post('/api/teacher/checkstatusupdate', statusUpdate)
            .then((data) => {
              toast.success('successfully updated the result')
              setIsLoading(false)
              navigate('/dashboard/scripts/view')
            })
            .catch((e) => console.log(e))
        })
        .catch((e) => console.log(e))
    }
  }
  const checkNumber = (marks, id) => {
    //console.log(id)
    if (
      isNaN(marks) === false &&
      parseFloat(marks) <= singleResult.marksPerQuestion[id] && source.length === answerScripts[id].length
    ) {
      // setButtonDisabler(false)
      setSendButtonEnabler(false);
    } else {
      setSendButtonEnabler(true);
    }
  }
  useEffect(() => {
    setIsLoading(true)
    axios
      .get(
        `/api/student/getwrittenstudentsinglebyexam?examId=${params.examId}&&studentId=${params.studentId}`
      )
      .then(({ data }) => {
        setSingleResult(data)
        console.log('result', data)
        setAnswerScripts(data.answerScript)
        let answered = 0
        let vacantAnswer = []
        let checker =[];
        let flag = 0;
        let tr=[]
        for (let i = 0; i < data.answerScript.length; i++) {
          if (data.answerScript[i] === null) {
            vacantAnswer.push(i + 1)
            tr.push(-1);
          } else {
            if(flag === 0){
              tr.push(1);
              flag=1;
            }else{
              tr.push(-1);
            }
            checker.push(i);
            answered++
          }
        }
        console.log(tr)
        console.log(checker)
        setTracker(tr);
        setEnabler(checker)
        setNumberOfAnsweredQuestions(answered)
        setVacantAnswerSubmitter(vacantAnswer)
        setIsLoading(false)
      })
  }, [params])
  return isLoading ? (
    <Loader />
  ) : (
    <div className="min-h-full mb-80 mx-0 px-0 lg:px-8 pe-8 lg:pe-0 ">
      {ansTracker !== numberOfAnsweredQuestions &&
        answerScripts.map((answer, idx) => (
          <div key={idx} >
            {answer !== null && tracker[idx]===1 && (
              <>
                <p className=" my-4 text-4xl font-extrabold  border-4  border-color-one   w-10 h-10 flex justify-center items-center rounded-full">
                  {idx + 1}
                </p>
                <div className='grid grid-cols-1 px-2 py-1 border-4 border-color-one rounded-lg '>
                  {Array.isArray(answer) === true &&
                    answer.map((photo, index) => (
                      <div key={index}>
                        <div >
                          <div className="grid grid-cols-1 mt-4">
                            <ImageEditor
                              includeUI={{
                                loadImage: {
                                  path:
                                    process.env.REACT_APP_API_HOST +
                                    '/' +
                                    photo,
                                  name: 'SampleImage',
                                },
                                menu: ['draw', 'rotate'],
                                initMenu: 'draw',
                                theme: whiteTheme,
                                draw: {
                                  color: '#ff0000',
                                },
                                uiSize: {
                                  width: '100%',
                                  height: '942px',
                                },
                                menuBarPosition: 'bottom',
                              }}
                              cssMaxHeight={942}
                              cssMaxWidth={414}
                              selectionStyle={{
                                cornerSize: 50,
                                rotatingPointOffset: 100,
                              }}
                              usageStatistics={true}
                              ref={imageEditor}
                            />
                          </div>

                          <div>
                            {index + 1 === answer.length ? (
                              <button
                                className="btn mt-4 justify-center"
                                onClick={logImageContent}
                              >
                                Final Save
                              </button>
                            ) : (
                              <button
                                className="btn my-2 justify-center"
                                onClick={() => checkNext(idx, index)}
                              >
                                Save This Image
                              </button>
                            )}
                          </div>
                        </div>
                        {
                          index + 1 === answer.length &&
                        
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
                              onChange={(e) => checkNumber(e.target.value, idx)}
                              required
                            />
                            <input
                              type="submit"
                              className="ml-0 lg:ml-4 mt-2 lg:mt-0 btn"
                              onClick={()=>setSaveId(idx)}
                              value="Save Marks"
                              disabled={sendButtonEnabler}
                            />
                          </div>
                        </form>
                        }
                      </div>
                    ))}
                </div>
              </>
            )}
          </div>
        ))}

      <div className="flex justify-center items-center">
        {ansTracker === numberOfAnsweredQuestions && (
          <button className="btn" onClick={() => finalSave()}>
            Finish The Process
          </button>
        )}
      </div>
    </div>
  )
}

export default SingleStudentWrittenANswer
