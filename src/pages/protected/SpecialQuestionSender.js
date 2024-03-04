import React from 'react';

const SpecialQuestionSender = ({sendQuestionSpecial,handleChangeSecondCourse,courses,setQuestionExam,specialExams,setQuestionSubject,secondsubjects}) => {
    return (
        <div>
            <input type="checkbox" id="my-modal-special" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <form
            onSubmit={sendQuestionSpecial}
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
                Select Exam Name
              </label>
              <select
                className="input  border-black input-bordered w-full"
                required
                onChange={(e) => setQuestionExam(e.target.value)}
              >
                <option value=""></option>
                {specialExams.length > 0 &&
                  specialExams.map((exam) => (
                    <option key={exam._id} value={exam._id}>
                      {exam.name}
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

            <div className="form-control mt-4  flext justify-center items-center">
              <input type="submit" value="Add Questions" className="btn" />
            </div>
          </form>
          <div className="modal-action">
            <label htmlFor="my-modal-special" className="btn bg-red w-[80px]">
              Close!
            </label>
          </div>
        </div>
      </div>
        </div>
    );
};

export default SpecialQuestionSender;