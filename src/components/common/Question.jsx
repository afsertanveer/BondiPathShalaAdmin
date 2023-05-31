import { useState } from "react";
function Question({ question, index,handleQuestionSelect }) {
  const [counter, NULL] = useState(index + 1);

  return (
    <div className="mb-6">
      <div className="mb-2">
        {counter}.{" "}
        <span>{question.type && question.question}</span>
        {question.type == false && (
          <div>
            <img src={`${process.env.REACT_APP_FILES_HOST}/${question.question}`} />
          </div>
        )}
      </div>
      <ul>
        {
          question.options.map((opt, idx) => (
            <li className="mb-2" key={`opt.${idx}`}>
              <div className="form-control">
                <label className=" cursor-pointer flex items-center space-x-3">
                  <input
                    onChange={(e) => handleQuestionSelect(e,index)}
                    type="radio"
                    className="radio checked:bg-orange-500"
                    value={idx}
                    checked={question.answeredOption == idx}
                    disabled={question.answeredOption !== "-1"}
                  />
                  <span className="label-text"> {opt}</span>
                </label>
              </div>
            </li>
          ))
        }
      </ul>
    </div>
  );
}

export default Question;
