import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../utils/axios";
import { LoaderIcon } from "react-hot-toast";
import FilerobotImageEditor, {
  TABS,
  TOOLS,
} from "react-filerobot-image-editor";

const SingleStudentWrittenANswer = () => {
  const params = useParams();
  const [singleResult, setSingleResult] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [source, setSource] = useState([]);
  let prevSource = [];
  // const [answerScript,setAnswerScript] = useState()
  useEffect(() => {
    setIsLoading(true);
    axios
      .get(
        `/api/student/getwrittenstudentsinglebyexam?examId=${params.examId}&&studentId=${params.studentId}`
      )
      .then(({ data }) => {
        console.log(data);
        setSingleResult(data);
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
            <div key={idx}>
              {typeof ans !== "undefined" && ans.length > 0 && <p>{idx + 1}</p>}
              <div className="grid grid-cols-1">
                {typeof ans !== "undefined" &&
                  ans.length > 0 &&
                  ans.map((photo, index) => {                    
                    return (
                        <FilerobotImageEditor
                        source={process.env.REACT_APP_API_HOST + photo}
                        defaultSavedImageName="abswerScriots"
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
                        defaultToolId={TOOLS.ROTATE} // or 'Text'
                      />
                    );
                  })}
              </div>
            </div>
          );
        })}
        
        <p>Number of Edited Image: {source.length}</p>
        {
            source.length>0 && source.map((s,idx)=>(
                <img key={idx} src={s} alt ="edited" />
            ))
        }
    </div>
  );
};

export default SingleStudentWrittenANswer;
