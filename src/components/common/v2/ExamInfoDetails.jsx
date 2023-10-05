
const types = {
  1: "daily",
  2: "weekly",
  3: "monthly",
};
function ExamInfoDetails({ examInfos, variationType = "single", hide = "", page = "ongoing" }) {
  {
    return variationType !== "special" ? (
      <div className={`py-2 mx-6 text-white`}>
        <div className="btn-theme rounded-xl grid grid-rows-1 md:grid-rows-2 md:grid-rows-none grid-flow-col md:grid-flow-col divide-x">
          <div className="px-2 py-1">
            <span>Exam name & Code: </span>
            <span className="font-bold">{examInfos.name}</span>
          </div>
          {variationType === "single" && (
            <><div className="px-2 py-1">
              <span>Full Marks: </span>
              <span className="font-bold">{examInfos.totalMarksMcq}</span>
            </div>
              <div className="px-2 py-1">
                <span>Time: </span>
                <span className="font-bold">{examInfos.duration} min</span>
              </div>
              <div className="px-2 py-1">
                <span>Negative Marks: </span>
                <span className="font-bold">{examInfos.negativeMarks}%</span>
              </div></>
          )}
          {variationType === "mcq" && (
            <><div className="px-2 py-1">
              <span>Full Marks: </span>
              <span className="font-bold">{examInfos.totalMarksMcq}</span>
            </div>
              <div className="px-2 py-1">
                <span>Time: </span>
                <span className="font-bold">{examInfos.mcqDuration} min</span>
              </div>
              <div className="px-2 py-1">
                <span>Negative Marks: </span>
                <span className="font-bold">{examInfos.negativeMarksMcq}%</span>
              </div></>
          )}
          {variationType === "written" && (
            <><div className="px-2 py-1">
              <span>Full Marks: </span>
              <span className="font-bold">{examInfos.totalMarksMcq}</span>
            </div>
              <div className="px-2 py-1">
                <span>Time: </span>
                <span className="font-bold">{examInfos.duration} min</span>
              </div>
              <div className="px-2 py-1">
                <span>Negative Marks: </span>
                <span className="font-bold">{examInfos.negativeMarks}%</span>
              </div></>
          )}
        </div>
      </div>
    ) : (
      <>
        {(hide !== "mcq" || hide === "") && <>
          <h2 className="!mb-0 btn-theme text-3xl font-bold mb-2 text-center text-white rounded-t-md uppercase">mcq exam</h2>
          <div className="border border-color-six p-4 rounded-b-md bg-white">
            <div className="relative md:min-h-[18rem] overflow-auto p-1">
              <div className="grid lg:grid-cols-4 grid-flow-rows gap-x-4 gap-y-4 place-content-center grid-cols-2">
                {examInfos?.data?.questionMcq.map((mcq, index) => (
                  <div className="exam_info_item" key={index}>
                    <span className="exam_info_item_top text-lg text-white">{mcq.subjectId.name}</span>
                    <span className="exam_info_item_bottom text-xl">{mcq.mcqMarksPerSub}/{examInfos?.mcqObj?.marksPerSub}</span>
                  </div>
                ))}
              </div>
              <div className="bg-[#ffffefff] mt-2 rounded-md exam_summery grid lg:grid-cols-5 gap-x-4 grid-flow-rows text-center place-content-center grid-cols-2">
                <div className="exam_summery_single">
                  <div className="top">Total Questions</div>
                  <div className="bottom place-self-end">{examInfos?.mcqObj?.totalQuestion}</div>
                </div>
                <div className="exam_summery_single">
                  <div className="top">Marks per question</div>
                  <div className="bottom place-self-end">{examInfos?.mcqObj?.marksPerMcq}</div>
                </div>
                <div className="exam_summery_single">
                  <div className="top">Full Marks</div>
                  <div className="bottom place-self-end">{examInfos?.data?.totalMarksMcq}/{examInfos?.mcqObj?.totalMcqMarks}</div>
                </div>
                <div className="exam_summery_single">
                  <div className="top">Time (Minutes)</div>
                  <div className="bottom place-self-end">{page !== "rules" ? examInfos?.data?.mcqDuration.toFixed(2) + '/' : ''}{examInfos?.mcqObj?.mcqDuration}</div>
                </div>
                <div className="exam_summery_single">
                  <div className="top">Negative Marks</div>
                  <div className="bottom place-self-end">{examInfos?.mcqObj.negativeMarks}%</div>
                </div>
              </div>
            </div>
          </div>
        </>}
        {(hide !== "written" || hide === "") && <>
          <h2 className="!mb-0 btn-theme text-3xl mt-4 font-bold mb-2 text-center text-white rounded-t-md uppercase">written exam</h2>
          <div className="border border-color-six p-4 rounded-b-md bg-white">
            <div className="relative md:min-h-[18rem] overflow-auto p-1">
              <div className="grid lg:grid-cols-4 grid-flow-rows gap-x-4 gap-y-4 place-content-center grid-cols-2">
                {examInfos?.data?.questionWritten.map((written, index) => (
                  <div className="exam_info_item" key={index}>
                    <span className="exam_info_item_top text-lg text-white">{written.subjectId.name}</span>
                    <span className="exam_info_item_bottom text-xl">{written.totalObtainedMarksWritten}/{examInfos?.writtenObj?.marksPerSub}</span>
                  </div>
                ))}
              </div>
              <div className="bg-[#ffffefff] mt-2 rounded-md exam_summery grid grid-flow-rows text-center justify-items-center place-content-center grid-cols-2">

                <div className="exam_summery_single ml-16 tab-max:ml-4">
                  <div className="top">Full Marks</div>
                  <div className="bottom">{examInfos?.data?.totalMarksWritten}/{examInfos?.writtenObj?.totalWrittenMarks}</div>
                </div>
                <div className="exam_summery_single mr-16 tab-max:mr-4">
                  <div className="top">Time (Minutes)</div>
                  <div className="bottom">{page !== "rules" ? examInfos?.data?.writtenDuration.toFixed(2) + '/' : ''}{examInfos?.writtenObj?.writtenDuration}</div>
                </div>
              </div>
            </div>
          </div>
        </>}
      </>
    )
  }
}
export default ExamInfoDetails;
