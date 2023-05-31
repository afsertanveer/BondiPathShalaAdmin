import img from "../../assets/img/physics.png";

function Question({ question, index }) {
  const openModal = () => {
    let checkedModal = document.getElementById('explanationModal')
    checkedModal.checked = true;
  }
  return (
    <div className="mb-6">
      <div className="mb-2">
        {index}.{" "}
        <span>{question.type && question.question}</span>
        {question.type == false && (
          <div>
            <img src={img} />
          </div>
        )}
        <button className="ml-4 tooltip" data-tip="View Explanation" onClick={openModal}>
          <div className="badge badge-md" dangerouslySetInnerHTML={{__html:"&ii;"}}></div>
        </button>
      </div>
      <ul>
        {
          question.options.map((opt, idx) => {

            let defaultTextColor = "text-black";
            if (parseInt(question.correctOptions) === idx) {
              defaultTextColor = "text-color-eleven font-semibold";
            }
            if (parseInt(question.answeredOption) === idx) {
              defaultTextColor = "text-error line-through"
            }
            return (<li className="mb-0" key={`soln.${idx}`}>
              <div className={`${defaultTextColor}`}>
                {String.fromCharCode(65 + parseInt(idx))}. {opt}
              </div>
            </li>)
          })
        }
      </ul>
      <input type="checkbox" id="explanationModal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box relative bg-light">
          <label htmlFor="explanationModal" className="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
          <h3 className="text-lg font-bold">Explanation!</h3>
          <p className="py-4">
            {question.explanationILink && (<img src={`${process.env.REACT_APP_FILES_HOST}/${question.explanationILink}`} alt="explanation" />)}
          </p> 
        </div>
      </div>
    </div>
  );
}

export default Question;
