import React, { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../utils/axios";
import { LoaderIcon, toast } from "react-hot-toast";
import "tui-color-picker/dist/tui-color-picker.css";
import 'tui-image-editor/dist/tui-image-editor.css';
import ImageEditor from '@toast-ui/react-image-editor';
import { whiteTheme } from "../../utils/globalVariables";

const SingleStudentSpecialWritten = () => {
  const params = useParams();
  const [singleResult, setSingleResult] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [source, setSource] = useState([]);
  const [disabler, setDisabler] = useState([]);
  const [buttonDisabler,setButtonDisabler] = useState(true);
  const [finalbuttonDisabler,setFinalButtonDisabler] = useState(false);
  const [counter,setCounter] = useState(1);
  console.log(useParams.studentId);
  let prevSource = [];
  let changer = [];
  const imageEditor = React.createRef();
  const logImageContent = ()  =>{
    const imageEditorInst = imageEditor.current.imageEditorInst;
    const data = imageEditorInst.toDataURL();
    prevSource = [...source];
    prevSource.push(data);
    setSource(prevSource);
    toast.success("Image Saved");  
   }
  const sendImage = async (e) => {
    e.preventDefault();
    setCounter(prev=>prev+1);
    if(counter===singleResult.totalQuestions){
      setFinalButtonDisabler(true)
    }
    const form = e.target;
    const idx = parseInt(form.index.value);
    const obtainedMarks = parseInt(form.obtMarks.value);
    console.log(source);
    changer = [...disabler];
    for (let i = 0; i < changer.length; i++) {
      changer[idx] = 0;
      if (idx + 1 !== changer.length) {
        changer[idx + 1] = 1;
      }
    }
    let answer;
    if(source.length===0){
       answer = {
        questionNo: idx + 1,
        obtainedMarks,
        studentId: params.studentId,
        examId: params.examId,
        uploadImages: [],
      };
    }else{
       answer = {
        questionNo: idx + 1,
        obtainedMarks,
        studentId: params.studentId,
        examId: params.examId,
        uploadImages: source,
      };
    }
    console.log(answer);
    await axios.post("/api/special/checkscriptsingle", answer).then((data) => {
      toast.success("Successfully updated");
      setSource([]);
    });
    console.log(answer);
    setDisabler(changer);
  };
  const finalSave = async () => {
    const marksCalculation = {
      studentId: params.studentId,
      examId: params.examId,
    };
    
    await axios
      .post("/api/special/markscalculation", marksCalculation)
      .then((data) => {
        toast.success("successfully updated the result");
      });
  };
  const checkNumber = (marks,id)=>{
    if(isNaN(marks)===false && (parseFloat(marks))<=singleResult.marksPerQuestion[id]){
      setButtonDisabler(false)
    }else{
      setButtonDisabler(true);
    }
  }
  useEffect(() => {
    setIsLoading(true);
    axios
      .get(
        `/api/special/getWrittenStudentSingleByExam?examId=${params.examId}&&studentId=${params.studentId}`
      )
      .then(({ data }) => {
        console.log(data);
        setSingleResult(data);
        let dis = [];
        for (let i = 0; i < data.totalQuestions; i++) {
          if (i === 0) {
            dis[i] = 1;
          } else {
            dis[i] = 0;
          }
        }
        setDisabler(dis);
        setIsLoading(false);
        // setAnswerScript(data.answerScript)
      });
  }, [params]);
  return isLoading ? (
    <LoaderIcon></LoaderIcon>
  ) : (
    <div>
      {typeof singleResult.answerScript !== "undefined" &&
        singleResult.answerScript.length > 0 && 
        singleResult.answerScript.map((ans, idx) => {
          return (
            <div key={idx} className="my-10">
              {disabler[idx] === 1 && (
                <>
                  <p>{idx + 1}</p>
                  <div className="grid grid-cols-1">
                    {typeof ans !== "undefined" &&
                      ans!==null &&
                      ans.length > 0 &&
                      ans.map((photo, index) => {
                        return (
                          <Fragment
                          key={index}
                          >
                            { <ImageEditor
                              includeUI={{
                                loadImage: {
                                  path:process.env.REACT_APP_API_HOST +'/' +photo,
                                  name: "SampleImage"
                                },
                                menu: ['draw'],
                                initMenu: 'draw',
                                theme:whiteTheme,
                                uiSize: {
                                  width: '100%',
                                  height: '800px',
                                },
                                menuBarPosition: 'top',
                              }}
                              cssMaxHeight={700}
                              cssMaxWidth={1500}
                              selectionStyle={{
                                cornerSize: 20,
                                rotatingPointOffset: 70,
                              }}
                              usageStatistics={true}
                              ref={imageEditor}
                              />}
                              <button class="btn mt-4 justify-center" onClick={logImageContent}>Save Image</button>
                          </Fragment>
                        );
                      })}
                      {
                        typeof ans !== "undefined" &&
                      ans===null && <p className="text-red-500 font-bold text-center mt-5">No answer for this question</p>
                      }
                      
                      <form onSubmit={sendImage} className="mt-4 ">
                      <input
                        type="text"
                        className="input input-bordered  border-black hidden"
                        name="index"
                        id=""
                        defaultValue={idx}
                      />
                      <p className="ml-4 text-lg font-bold text-red">Marks out of {singleResult.marksPerQuestion[idx]}</p>
                      <div className="flex ">
                      <input
                        type="text"
                        name="obtMarks"
                        id="obtMarks"
                        autoComplete="off"
                        className="input input-bordered  border-black"
                        onChange={e=>checkNumber(e.target.value,idx)}
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
          );
        })
      }
        
      <div className="flex justify-center items-center">
      {
        finalbuttonDisabler && <button className="btn" onClick={() => finalSave()}>
        Update and save 
      </button>
      }
      </div>
    </div>
  );
};

export default SingleStudentSpecialWritten;
