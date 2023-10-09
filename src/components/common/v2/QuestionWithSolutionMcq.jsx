import { useEffect, useState } from 'react'

const QuestionWithSolutionMcq = ({ question, counter = 1, type="mcq" }) => {
  const [options, setOptions] = useState(question.options);
  useEffect(() => {
    if (question.type === false) {
      let loopTill = typeof question.optionCount == "undefined" ? 4 : question.optionCount;
      setOptions(Array.from(Array(loopTill)).map((e, i) => String.fromCharCode(65 + parseInt(i))));
    }
  }, [question]);

  const openModal = () => {
    let checkedModal = document.getElementById('explanationModal')
    checkedModal.checked = true;
  }
  return (
    <div className="mb-8 pb-2 rounded-lg shadow-[0px_0px_6px_2px_rgba(0,0,0,0.5)] relative">

      <span className="questionNo">{counter}</span>
      <div className="mb-1">
        {question.type == false ? (
          <div className='p-4'>
            <img className="rounded-lg w-full" src={`${process.env.REACT_APP_FILES_HOST}/${type==="mcq-only"? question.question:question.iLink}`} alt='' />
          </div>
        ):(
          <div className="rounded-lg text-[1.5rem] font-bold p-4">{question.question}</div>
          )}
      </div>
      {(parseInt(question.answeredOption) === -1) && (
          <div className='text-center text-red  font-extrabold text-lg leading-6'>Not Answered</div>
        )}
      {question.type === false ? (<ul className="my-3 flex space-x-4 justify-center">
        {
          options.map((opt, idx) => {
            let defaultTextColor = "text-black";
            if (parseInt(question.answeredOption) !== -1) {
              if (parseInt(question.correctOptions) === idx) {
                defaultTextColor = "border-8 border-color-fifty ";
              }
              if (parseInt(question.answeredOption) === idx) {
                defaultTextColor = "border-8 border-color-fifty ";
              }
              if (parseInt(question.answeredOption) !== parseInt(question.correctOptions) && parseInt(question.answeredOption) === idx) {
                defaultTextColor = "border-red";
              }
            }else{
              if(parseInt(question.correctOptions) === idx){
                defaultTextColor = "border-8 border-color-fifty ";
              }
            }
            return (<li className={`mb-0 px-5 md:px-2 py-2 md:py-1 border-4 md:border-3 bg-[#262626] rounded-lg ${defaultTextColor}`} key={`soln.${idx}`}>
              <div className={`font-semibold text-white`}>
                {/* {String.fromCharCode(65 + parseInt(idx))}.&nbsp;&nbsp; */}
                {opt}
              </div>
            </li>)
          })
        }
      </ul>):(
        <ul className="my-3 mx-4 flex justify-center flex-col space-y-2">
        {
          options.map((opt, idx) => {
            let defaultTextColor = "text-black";
            if (parseInt(question.answeredOption) !== -1) {
              if (parseInt(question.correctOptions) === idx) {
                defaultTextColor = "border-green-500";
              }
              if (parseInt(question.answeredOption) === idx) {
                defaultTextColor = "border-green-500";
              }
              if (parseInt(question.answeredOption) !== parseInt(question.correctOptions) && parseInt(question.answeredOption) === idx) {
                defaultTextColor = "border-red-500";
              }
            }else{
              if(parseInt(question.correctOptions) === idx){
                defaultTextColor = "border-green-500";
              }
            }
            return (<li className={`mb-0 px-5 md:px-2 py-2 md:py-1 border-4 md:border-3 bg-[#262626] rounded-lg ${defaultTextColor}`} key={`soln.${idx}`}>
              <div className={`font-semibold text-white`}>
                {String.fromCharCode(65 + parseInt(idx))}.&nbsp;&nbsp;
                {opt}
              </div>
            </li>)
          })
        }
      </ul>
      )}
      {question.explanationILink && (<div className="mx-4 mt-6 mb-2 text-center">        
        <div className='p-2 relative rounded-md border-2 border-orange-500'>
          <div className="explanationTitle bg-color-one text-white font-bold  absolute rounded-md px-2 -top-[12px] left-[50%] -translate-x-[50%]">Explanation</div>
          <p className="p-2">
            <img className=' rounded-md' src={`${process.env.REACT_APP_FILES_HOST}/${question.explanationILink}`} />
          </p>
        </div>
      </div>)}
      {/* <div className="relative text-right">
        <button className="btn btn-warning btn-sm rounded-tr-none rounded-bl-none hover:bg-orange-400" onClick={openModal}>
          View Explanation
        </button>
      </div>
      <input type="checkbox" id="explanationModal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box relative bg-light w-11/12 max-w-5xl">
          <label htmlFor="explanationModal" className="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
          <h3 className="text-lg font-bold">Explanation!</h3>
          <p className="py-4">
            {question.explanationILink && (<img src={`${process.env.REACT_APP_FILES_HOST}/${question.explanationILink}`} />)}
          </p>
        </div>
      </div> */}
    </div>
  );
}

export default QuestionWithSolutionMcq