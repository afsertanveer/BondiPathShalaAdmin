
const types = {
  1:"daily",
  2:"weekly",
  3:"monthly",
};
function ExamInfoDetails({ examInfos }) {
  return (
    <div className=" px-0 md:px-4 lg:px-8 py-8 md:py-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">        
          <div>
            <span className="font-bold">Exam name & Code: </span>
            <span>{examInfos.name}</span>
          </div>
          <div>
            <span className="font-bold">Course: </span>
            <span>{examInfos.courseId?.name}</span>
          </div>
          <div>
            <span className="font-bold">Subject: </span>
            <span>{examInfos.subjectId?.name}</span>
          </div>
          <div>
            <span className="font-bold">Total Questions: </span>
            <span>{examInfos.totalQuestionMcq}</span>
          </div>
          <div>
            <span className="font-bold">Marks Per Question: </span>
            <span>{examInfos.marksPerMcq}</span>
          </div>
          <div>
            <span className="font-bold">Total Marks: </span>
            <span>{examInfos.totalMarksMcq}</span>
          </div>
          <div>
            <span className="font-bold">Negative Marks: </span>
            <span>{examInfos.negativeMarks}%</span>
          </div>
          <div>
            <span className="font-bold">Exam Type: </span>
            <span>{types[examInfos.examType]? types[examInfos.examType] : "FREE" }</span>
          </div>
      </div>
    </div>
  );
}

export default ExamInfoDetails;
