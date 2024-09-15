import React, { useEffect, useState } from 'react'
import { optionName } from '../../utils/globalVariables'
import Latex from 'react-latex-next'
import Loader from '../../Shared/Loader'
import axios from '../../utils/axios'
import toast from 'react-hot-toast'
import 'katex/dist/katex.min.css'

const QuestionAdderBoth = ({
  singleExam,
  handleAddQuestion,
  setNameOfSet,
  setCorrectOption,
  setIsText,
  isText,
}) => {
  const [question, setQuestion] = useState('')
  const [preview, setPreview] = useState('preview')
  const [options, setOptions] = useState([])
  const [setName, setSetName] = useState(-1)
  const [correctOptionAns, setCorrectOptionAns] = useState(-1)
  const addData = () => {
    let getQues = document.getElementById('ques').value
    setQuestion(getQues)
    setPreview(getQues)
    toast.success("Question Checked")
  }
  const addOptionValue = (id) => {
    let getData = document.getElementById(`option${id}`).value
    let prevOptions = options
    prevOptions[id] = getData
    setOptions(prevOptions)
    setPreview(getData)
    toast.success("Option Checked")
  }
  const addDetails = () => {
    let data = {
      question,
      options: options,
      setName,
      optionCount: singleExam.numberOfOptions,
      explanationILink: null,
      status: true,
      type: true,
      correctOption: correctOptionAns,
      examId: singleExam._id,
    }
    console.log(data)
    axios
      .post('/api/both/addTextQuestion', data)
      .then(({ data }) => {
        toast.success('Question added Successfully')
        document.getElementById('ques').value = ''
        for (let i = 0; i < singleExam.numberOfOptions; i++) {
          document.getElementById(`option${i}`).value = ''
        }
      })
      .catch((err) => console.log(err))
  }

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
            <div className={`grid grid-cols-1 my-2`}>
              <div className="w-full px-2 py-2 lg:px-8 border border-color-one bg-white rounded-lg ">
                <label className="text-[16px] font-bold">
                  Write Down The Question
                </label>
                <>
                  <div className="grid grid-cols-1 gap-4">
                    <textarea
                      className="textarea textarea-info text-xl font-bold border-black"
                      name={`ques`}
                      id={`ques`}
                      cols={400}
                      rows={5}
                      // enterKey={(e)=>addData(id)}
                      placeholder="Description"
                    ></textarea>
                    <button className="btn " onClick={(e) => addData()}>
                      Check Question
                    </button>
                  </div>
                  {/* <hr /> */}
                  <div className="text-xl font-bold">
                    {preview && preview !== '' && (
                      <>
                        <Latex>{preview}</Latex>
                      </>
                    )}
                  </div>

                  <div className="flex justify-start items-center">
                    <label
                      htmlFor=""
                      className="label font-semibold text-[16px] "
                    >
                      Number of Options : {singleExam.numberOfOptions}
                    </label>
                  </div>
                  <div className="grid grid-cols-1  gap-0 lg:gap-2">
                    {singleExam.numberOfOptions > 0 &&
                      [...Array(singleExam.numberOfOptions).keys()].map(
                        (idx) => {
                          return (
                            <div key={idx} className="my-2">
                              <div>
                                <label htmlFor="" className="text-lg">
                                  {optionName[idx] + ')'}
                                </label>
                                <input
                                  type="text"
                                  placeholder={`Option ${idx + 1}`}
                                  name={`option${idx}`}
                                  id={`option${idx}`}
                                  className="input w-full text-xl font-bold input-bordered border-black "
                                  required
                                />
                              </div>
                              <button
                                className="btn mt-2"
                                onClick={() => addOptionValue(idx)}
                              >
                                {' '}
                                Check {optionName[idx]}
                              </button>
                              <div className="text-2xl font-bold">
                                {preview && preview !== '' && (
                                  <>
                                    <Latex>{preview}</Latex>
                                  </>
                                )}
                              </div>
                            </div>
                          )
                        }
                      )}
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    <div>
                      <label className="label font-semibold text-[16px] ">
                        Correct Option
                      </label>
                      <select
                        name="type"
                        id="type"
                        className="input border-black input-bordered w-full h-5 "
                        onChange={(e) =>
                          setCorrectOptionAns(parseInt(e.target.value))
                        }
                        required
                      >
                        <option value={-1}>---</option>
                        {[...Array(singleExam.numberOfOptions).keys()].map(
                          (id) => (
                            <option key={id} value={id}>
                              {optionName[id]}
                            </option>
                          )
                        )}
                      </select>
                    </div>
                    <div>
                      <label className="text-lg">Set Name</label>
                      <select
                        name="set_name"
                        id="set_name"
                        className="input border-black input-bordered w-full "
                        onChange={(e) => setSetName(parseInt(e.target.value))}
                        required
                      >
                        <option>---</option>
                        {[...Array(singleExam.numberOfSet).keys()].map((id) => (
                          <option key={id} value={id}>
                            {optionName[id]}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-center items-center">
                    <button
                      id="addButton"
                      onClick={() => addDetails()}
                      className={`btn btn-warning rounded-tr-none rounded-bl-none hover:bg-orange-400 h-12`}
                    >
                      {' '}
                      Add{' '}
                    </button>
                  </div>
                </>
              </div>
            </div>
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

export default QuestionAdderBoth
