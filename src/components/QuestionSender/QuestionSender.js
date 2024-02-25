import React from 'react'
import { optionName } from '../../utils/globalVariables'

const QuestionSender = ({
  sendQuestions,
  handleChangeSecondCourse,
  courses,
  setQuestionSubject,
  secondsubjects,
  handleChangeBothStatus,
  handleSecondExam,
  secondexams,
  singleSecondExam,
  questionExam,
  setSecondSet,
}) => {
  return (
    <div>
      <input type="checkbox" id="my-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <form
            onSubmit={sendQuestions}
            className="mt-4 w-full  mx-auto flex flex-col "
          >
            <div className="form-control">
              <label className="label-text text-center" htmlFor="">
                Select Course
              </label>
              <select
                className="input border-black input-bordered w-full"
                required
                onChange={(e) => handleChangeSecondCourse(e)}
              >
                <option value=""></option>
                {courses.length > 0 &&
                  courses.map((course) => (
                    <option key={course._id} value={course._id}>
                      {course.name}
                    </option>
                  ))}
              </select>
            </div>
            <div className="form-control mr-3">
              <label className="label-text text-center" htmlFor="">
                Select Subject
              </label>
              <select
                className="input  border-black input-bordered w-full"
                required
                onChange={(e) => setQuestionSubject(e.target.value)}
              >
                <option value=""></option>
                {secondsubjects.length > 0 &&
                  secondsubjects.map((subject) => (
                    <option key={subject._id} value={subject._id}>
                      {subject.name}
                    </option>
                  ))}
              </select>
            </div>
            <div className="form-control mr-3">
              <label className="label-text text-center" htmlFor="">
                Both Exam?
              </label>
              <select
                className="input  border-black input-bordered w-full"
                required
                onChange={(e) => handleChangeBothStatus(e.target.value)}
              >
                <option>---Select---</option>
                <option value="0">No</option>
                <option value="1">Yes</option>
              </select>
            </div>
            <div className="form-control mr-3">
              <label className="label-text text-center" htmlFor="">
                Select Exam Name
              </label>
              <select
                className="input  border-black input-bordered w-full"
                required
                onChange={(e) => handleSecondExam(e.target.value)}
              >
                <option value=""></option>
                {secondexams.length > 0 &&
                  secondexams.map((exam) => (
                    <option key={exam._id} value={exam._id}>
                      {exam.name}
                    </option>
                  ))}
              </select>
              {singleSecondExam?.numberOfSet > 0 && questionExam !== '' && (
                <div className="form-control">
                  <label className="label-text text-center" htmlFor="">
                    Select Set Name
                  </label>
                  <select
                    name="set_name"
                    id="set_name"
                    className="input w-full border-black input-bordered"
                    required
                    onChange={(e) => setSecondSet(parseInt(e.target.value))}
                  >
                    <option value={-1}></option>
                    {[...Array(singleSecondExam?.numberOfSet).keys()].map(
                      (id) => (
                        <option key={id} value={id}>
                          {optionName[id]}
                        </option>
                      )
                    )}
                  </select>
                </div>
              )}
            </div>
            <div className="form-control mt-4  flext justify-center items-center">
              <input type="submit" value="Add Questions" className="btn" />
            </div>
          </form>
          <div className="modal-action">
            <label htmlFor="my-modal" className="btn bg-red w-[80px]">
              Close!
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuestionSender
