import { useEffect, useState } from "react";

function Question({ question, index }) {
const [options,setOptions] = useState(question.options);
  useEffect(()=>{
    if(question.type === false){
      let loopTill = typeof question.optionCount == "undefined" ?  4: question.optionCount;
      setOptions(Array.from(Array(loopTill)).map((e, i) => String.fromCharCode(65 + parseInt(i))));
    }
  },[question]);

  const openModal = () => {
    let checkedModal = document.getElementById('explanationModal')
    checkedModal.checked = true;
  }
  return (
    <div className="mb-6">
      <div className="mb-2">
       
        <span className="text-lg font-bold">{index}.{" "} {question.type && question.question}</span>
        {question.type === false && (
          <div>
            <img src={`${process.env.REACT_APP_API_HOST}/${question.question}`} alt="question" />
          </div>
        )}
        <button className="ml-4 tooltip" data-tip="View Explanation" onClick={openModal}>
          <div className="badge badge-md" dangerouslySetInnerHTML={{__html:"&ii;"}}></div>
        </button>
      </div>
      <ul>
        {
          options.map((opt, idx) => {

            let defaultTextColor = "text-black";
            if (parseInt(question.correctOptions) === idx) {
              defaultTextColor = "text-color-eleven font-semibold";
            }
            if (parseInt(question.answeredOption) === idx) {
              defaultTextColor = "text-success"
            }
            if (parseInt(question.answeredOption) !== parseInt(question.correctOptions) && parseInt(question.answeredOption) === idx) {
              defaultTextColor = "text-error line-through"
            }
            return (<li className="mb-0" key={`soln.${idx}`}>
              <div className={`font-semibold ${defaultTextColor}`}>
                {String.fromCharCode(65 + parseInt(idx))}. {opt}
              </div>
            </li>)
          })
        }
      </ul>
      <input type="checkbox" id="explanationModal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box relative bg-light w-11/12 max-w-5xl">
          <label htmlFor="explanationModal" className="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
          <h3 className="text-lg font-bold">Explanation!</h3>
          <p className="py-4">
            {question.explanationILink && (<img src={`${process.env.REACT_APP_API_HOST}/${question.explanationILink}`}  alt="explanation" />)}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Question;
