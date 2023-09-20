import React, { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../utils/axios";
import { LoaderIcon, toast } from "react-hot-toast";
import FilerobotImageEditor, {
  TABS,
  TOOLS,
} from "react-filerobot-image-editor";

const SingleStudentWrittenANswer = () => {
  const params = useParams();
  const [singleResult, setSingleResult] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [source, setSource] = useState([]);
  const [disabler, setDisabler] = useState([]);
  console.log(useParams.studentId);
  let prevSource = [];
  let changer = [];
  // const [answerScript,setAnswerScript] = useState()
  const sendImage = async (e) => {
    e.preventDefault();
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
    await axios.post("/api/teacher/checkscriptsingle", answer).then((data) => {
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
    const statusUpdate = {
      studentId: params.studentId,
      examId: params.examId,
      status: true,
    };
    await axios
      .post("/api/teacher/markscalculation", marksCalculation)
      .then((data) => {
        axios
          .post("/api/teacher/checkstatusupdate", statusUpdate)
          .then((data) => {
            toast.success("successfully updated the result");
          });
      });
  };
  useEffect(() => {
    setIsLoading(true);
    axios
      .get(
        `/api/student/getwrittenstudentsinglebyexam?examId=${params.examId}&&studentId=${params.studentId}`
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
                            { <FilerobotImageEditor
                              
                              source={
                                process.env.REACT_APP_API_HOST + "/" + photo
                              }
                              defaultSavedImageName="answerscripts"
                              defaultSavedImageType="visited"
                              defaultSavedImageQuality={1}
                              onSave={(editedImageObject, designState) => {
                                prevSource = [...source];
                                prevSource.push(editedImageObject.imageBase64);
                                setSource(prevSource);
                              }}
                              savingPixelRatio={1}
                              previewPixelRatio={1}
                              annotationsCommon={{
                                fill: "#ff0000",
                              }}
                              Pen={{ stroke: "#ff0000" }}
                              tabsIds={TABS.ANNOTATE} // or {['Adjust', 'Annotate', 'Watermark']}
                              defaultTabId={TABS.ANNOTATE} // or 'Annotate'
                              defaultToolId={TOOLS.PEN} // or 'Text'
                            />}
                          </Fragment>
                        );
                      })}
                      {
                        typeof ans !== "undefined" &&
                      ans===null && <p className="text-red-500 font-bold text-center mt-5">No answer for this question</p>
                      }
                      
              <form onSubmit={sendImage} className="mt-4">
              <input
                type="text"
                className="input input-bordered  border-black hidden"
                name="index"
                id=""
                defaultValue={idx}
              />
              <p className="ml-4">Marks out of {singleResult.marksPerQuestion[idx]}</p>
              <input
                type="number"
                name="obtMarks"
                id="obtMarks"
                className="input input-bordered  border-black"
                min={0}
                max={singleResult.marksPerQuestion[idx]}
                required
              />
              <input
                type="submit"
                className="ml-4 btn"
                value="Save Marks"
              />
            </form>
                  </div>
                  
                </>
              )}
            </div>
          );
        })
      }
        
      <button className="btn" onClick={() => finalSave()}>
        Save
      </button>
    </div>
  );
};

export default SingleStudentWrittenANswer;
