import React from 'react'
import { optionName } from '../../utils/globalVariables'

const QuestionAdder = ({
  singleExam,
  handleAddQuestion,
  setNameOfSet,
  setCorrectOption,
  setIsText,
  isText,
}) => {
  return (
    <div>
      <input type="checkbox" id="my-modal-2" className="modal-toggle" />
      <div className="modal modal-middle ml:0 lg:ml-56">
        <div className="modal-box w-11/12 max-w-5xl h-11/12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label htmlFor="" className="text-lg">
                Question Type
              </label>
              <select
                name="type"
                id="type"
                className="input border-black input-bordered w-full  "
                onChange={(e) => setIsText(!isText)}
                required
              >
                <option value={isText}>{isText ? 'Text' : 'Image'}</option>
                <option value={true}>Text</option>
                <option value={false}>Image</option>
              </select>
            </div>
            <div className="flex justify-center items-center">
              <label htmlFor="" className=" text-lg font-semibold">
                Number of Options:{' '}
                <span className="text-lg font-extrabold">
                  {singleExam.numberOfOptions}
                </span>
              </label>
              <br />
            </div>
          </div>
          {isText === false ? (
            <form className="add-form" onSubmit={handleAddQuestion}>
              <label htmlFor="" className=" label">
                <span className="text-lg">Select Question Image </span>
              </label>
              <input
                type="file"
                name="iLink"
                id="iLink"
                className="file-input w-full input-bordered  border-black "
                required
              />
              <label className="text-lg">Set Name</label>
              <select
                name="set_name"
                id="set_name"
                className="input border-black input-bordered w-full "
                onChange={(e) => setNameOfSet(parseInt(e.target.value))}
                required
              >
                <option>---</option>
                {[...Array(singleExam.numberOfSet).keys()].map((id) => (
                  <option key={id} value={id}>
                    {optionName[id]}
                  </option>
                ))}
              </select>

              <label className="text-lg">Correct Option</label>
              <select
                name="correc_option"
                id="correc_option"
                className="input border-black input-bordered w-full "
                onChange={(e) => setCorrectOption(e.target.value)}
                required
              >
                <option>---</option>
                {[...Array(singleExam.numberOfOptions).keys()].map((id) => (
                  <option key={id} value={id}>
                    {optionName[id]}
                  </option>
                ))}
              </select>

              <div className="form-control my-2">
                <input
                  type="submit"
                  value="Add Question"
                  className="btn w-32 "
                />
              </div>
            </form>
          ) : (
            <form className="add-form" onSubmit={handleAddQuestion}>
              <label htmlFor="" className=" label">
                <span className="text-lg">Write Down the question </span>
              </label>
              <textarea
                className="textarea textarea-info   border-black"
                name="question_text"
                id="question_text"
                cols={100}
                placeholder="Description"
              ></textarea>
              <br />
              <label className="text-lg">Set Name</label>
              <select
                name="set_name"
                id="set_name"
                className="input border-black input-bordered w-full "
                onChange={(e) => setNameOfSet(parseInt(e.target.value))}
                required
              >
                <option>---</option>
                {[...Array(singleExam.numberOfSet).keys()].map((id) => (
                  <option key={id} value={id}>
                    {optionName[id]}
                  </option>
                ))}
              </select>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-4">
                {singleExam.numberOfOptions > 0 &&
                  [...Array(singleExam.numberOfOptions).keys()].map((id) => {
                    return (
                      <div key={id}>
                        <div>
                          <label htmlFor="" className="text-lg">
                            {optionName[id] + ')'}
                          </label>
                          <input
                            type="text"
                            placeholder={`Option ${id + 1}`}
                            name={`option${id}`}
                            id={`option${id}`}
                            className="input w-full input-bordered border-black "
                            required
                          />
                        </div>
                      </div>
                    )
                  })}
              </div>

              {singleExam.numberOfOptions > 0 && (
                <>
                  <label className="text-lg">Correct Option</label>
                  <select
                    name="type"
                    id="type"
                    className="input border-black input-bordered w-full "
                    onChange={(e) => setCorrectOption(e.target.value)}
                    required
                  >
                    <option>---</option>
                    {[...Array(singleExam.numberOfOptions).keys()].map((id) => (
                      <option key={id} value={id}>
                        {optionName[id]}
                      </option>
                    ))}
                  </select>
                </>
              )}

              <div className="form-control my-2">
                <input
                  type="submit"
                  value="Add Question"
                  className="btn w-32 "
                />
              </div>
            </form>
          )}

          <div className="modal-action">
            <label htmlFor="my-modal-2" className="btn bg-red text-white">
              Close
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuestionAdder
