import React, { Fragment, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from '../../utils/axios'
import { LoaderIcon, toast } from 'react-hot-toast'
import 'tui-color-picker/dist/tui-color-picker.css'
import 'tui-image-editor/dist/tui-image-editor.css'
import ImageEditor from '@toast-ui/react-image-editor'
import {  whiteTheme } from '../../utils/globalVariables'

const SingleStudentWrittenANswer = () => {
  const params = useParams()
  const [singleResult, setSingleResult] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [source, setSource] = useState([])
  const [disabler, setDisabler] = useState([])
  const [buttonDisabler, setButtonDisabler] = useState(true)
  const [finalbuttonDisabler, setFinalButtonDisabler] = useState(false)
  const [ansTracker, setAnsTracker] = useState([])
  const [counter, setCounter] = useState(1)
  // //console.log(params);
const navigate = useNavigate()
  let prevSource = []
  let changer = []
  const imageEditor = React.createRef()
  const logImageContent = () => {
    const imageEditorInst = imageEditor.current.imageEditorInst
    const data = imageEditorInst.toDataURL()
    let bigImage = document.createElement('img')
    bigImage.src = data
    bigImage.onload = (e2) => {
      let canvas = document.createElement('canvas')
      let ratio = 400 / e2.target.width
      canvas.width = 400
      canvas.height = e2.target.height * ratio

      const context = canvas.getContext('2d')
      context.drawImage(bigImage, 0, 0, canvas.width, canvas.height)
      let newImageUrl = context.canvas.toDataURL('image/jpeg', 80)
      prevSource = [...source]
      prevSource.push(newImageUrl)
      setSource(prevSource)
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
      let ratio = 400 / e2.target.width
      canvas.width = 400
      canvas.height = e2.target.height * ratio

      const context = canvas.getContext('2d')
      context.drawImage(bigImage, 0, 0, canvas.width, canvas.height)
      let newImageUrl = context.canvas.toDataURL('image/jpeg', 80)
      prevSource = [...source]
      prevSource.push(newImageUrl)
      setSource(prevSource)
    }

    toast.success('Image Saved')
    let prevTracker = ansTracker
    prevTracker[i][j] = 0
    prevTracker[i][j + 1] = 1
    //console.log(prevTracker, 'Checking')
    setAnsTracker(prevTracker)
  }
  const sendImage = async (e) => {
   
    e.preventDefault()
    setCounter((prev) => prev + 1)
    if (counter === singleResult.totalQuestions) {
      setFinalButtonDisabler(true)
    }
    const form = e.target
    const idx = parseInt(form.index.value)
    const obtainedMarks =(parseFloat(form.obtMarks.value)).toFixed(2);
    // //console.log(source)
    changer = [...disabler]
    for (let i = 0; i < changer.length; i++) {
      changer[idx] = 0
      if (idx + 1 !== changer.length) {
        changer[idx + 1] = 1
      }
    }
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
    await axios.post('/api/teacher/checkscriptsingle', answer).then((data) => {
      toast.success('Successfully updated')
      setButtonDisabler(true)
      setSource([])
    })
    setDisabler(changer)
  }
  const finalSave = async () => {
    const marksCalculation = {
      studentId: params.studentId,
      examId: params.examId,
    }
    const statusUpdate = {
      studentId: params.studentId,
      examId: params.examId,
      status: true,
    }
    await axios
      .post('/api/teacher/markscalculation', marksCalculation)
      .then((data) => {
        axios
          .post('/api/teacher/checkstatusupdate', statusUpdate)
          .then((data) => {
            toast.success('successfully updated the result')
            navigate('/dashboard/scripts/view')
          })
      })
  }
  const checkNumber = (marks, id) => {
    //console.log(id)
    if (
      isNaN(marks) === false &&
      parseFloat(marks) <= singleResult.marksPerQuestion[id]
    ) {
      setButtonDisabler(false)
    } else {
      //console.log('jhere')
      setButtonDisabler(true)
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
        let dis = []
        for (let i = 0; i < data.totalQuestions; i++) {
          if (i === 0) {
            dis[i] = 1
          } else {
            dis[i] = 0
          }
        }

        setDisabler(dis)
        let tracker = []
        for (let i = 0; i < data.answerScript.length; i++) {
          tracker[i] = []
          if (data.answerScript[i] === null) {
            tracker[i] = [1]
          } else {
            if (data.answerScript[i].length > 1) {
              for (let j = 0; j < data?.answerScript[i]?.length; j++) {
                if (j === 0) {
                  tracker[i][j] = 1
                } else {
                  tracker[i][j] = 0
                }
              }
            } else {
              tracker[i] = [1]
            }
          }
        }
        setAnsTracker(tracker)
        setIsLoading(false)
      })
  }, [params])
  return isLoading ? (
    <LoaderIcon></LoaderIcon>
  ) : (
    <div className="min-h-full">
      {typeof singleResult.answerScript !== 'undefined' &&
        singleResult.answerScript.length > 0 &&
        singleResult.answerScript.map((ans, idx) => {
          return (
            <div key={idx} className="my-1">
              {disabler[idx] === 1 && (
                <>
                  <p className="text-4xl font-extrabold  border-4  border-color-one   w-10 h-10 flex justify-center items-center rounded-full">
                    {idx + 1}
                  </p>
                  <div className="grid grid-cols-1 gap-x-0 sm:gap-x-4">
                    {typeof ans !== 'undefined' &&
                      ans !== null &&
                      ans.length > 0 &&
                      ans.map((photo, index) => {
                        return (
                          <div key={index}>
                            {ansTracker[idx][index] === 1 && (
                              <div>
                                <div className="flex justify-center items-center">
                                  <ImageEditor
                                    includeUI={{
                                      loadImage: {
                                        path:
                                          process.env.REACT_APP_API_HOST +
                                          "/" +
                                          photo,
                                        name: "SampleImage",
                                      },
                                      menu: ["draw"],
                                      initMenu: "draw",
                                      theme: whiteTheme,
                                      draw:{
                                        color:"red"
                                      },                                      
                                      uiSize: {
                                        width: "100%",
                                        height: "942px",
                                      },
                                      menuBarPosition: "bottom",
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
                                  {ansTracker[idx][ans.length - 1] === 1 ? (
                                    <button
                                      className="btn mt-4 justify-center"
                                      onClick={logImageContent}
                                    >
                                      Save Image
                                    </button>
                                  ) : (
                                    <button
                                      className="btn mt-4 justify-center"
                                      onClick={() => checkNext(idx, index)}
                                    >
                                      Next Image
                                    </button>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    {typeof ans !== 'undefined' && ans === null && (
                      <p className="text-red-500 font-bold text-center mt-5">
                        No answer for this question
                      </p>
                    )}

                    <form onSubmit={sendImage} className="mt-4 ">
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
                      <div className="flex ">
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
                          className="ml-4 btn "
                          value="Save Marks"
                          disabled={buttonDisabler}
                        />
                      </div>
                    </form>
                  </div>
                </>
              )}
            </div>
          )
        })}

      <div className="flex justify-center items-center">
        {finalbuttonDisabler && (
          <button className="btn" onClick={() => finalSave()}>
            Finish The Process
          </button>
        )}
      </div>
    </div>
  )
}

export default SingleStudentWrittenANswer
