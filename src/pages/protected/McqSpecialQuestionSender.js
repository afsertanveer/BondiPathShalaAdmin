import React, { useState } from 'react';
import { optionName } from '../../utils/globalVariables';
import axios from '../../utils/axios';
import toast from 'react-hot-toast';

const McqSpecialQuestionSender = ({sendQuestionMcqSpecial,setIsLoading,setSecondSet,questionExam,courses,setQuestionSubject,setQuestionExam,questionSubject}) => {
  const [exams,setExams] = useState([]);
  const [subjects,setSubjects] = useState([]);
  const [singleSecondExam,setSingleSecondExam] = useState("");
  const handleChangeSpecialCourse = course => {
    if (course !== '') {
    axios
        .get(`/api/mcqspecialexam/showmcqspecialexambycourse?courseId=${course}`)
        .then(({ data }) => {
          setExams(data);
          if (data.lengdh === 0) {
            toast.error("No Data");
          }
        setIsLoading(false);
        }).catch(e=>console.log(e))
        axios
        .get(`/api/subject/getsubjectbycourse?courseId=${course}`)
        .then(({ data }) => {
          console.log(data.data);
          setSubjects(data.data);
          setIsLoading(false);
        }).catch(err=>console.log("subject fetching error"));
    }
  }
  const handleSpecialExam = exam =>{
    if(exam!==''){
      setQuestionExam(exam);
      axios
        .get(`/api/mcqspecialexam/showspecialexambyid?examId=${exam}`)
        .then(({ data }) => {
          setSingleSecondExam(data);          
        })
        .catch((e) => console.log(e));
    }
  }
  const handleChangeSet = setName =>{
    if(setName!==-1){
      setSecondSet(setName);
    }
  }  
  return (
        <div>
            <input type="checkbox" id="my-modal-mcq-special" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <form
            onSubmit={sendQuestionMcqSpecial}
            className="mt-4 w-full  mx-auto flex flex-col "
          >
            <div className="form-control">
              <label className="label-text text-center" htmlFor="">
                Select Course
              </label>
              <select
                className="input border-black input-bordered w-full"
                required
                onChange={(e) => handleChangeSpecialCourse(e.target.value)}
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
                onChange={(e) => handleSpecialExam(e.target.value)}
              >
                <option value=""></option>
                {exams.length > 0 &&
                  exams.map((exam) => (
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
                {subjects.length > 0 &&
                  subjects.map((subject) => (
                    <option key={subject._id} value={subject._id}>
                      {subject.name}
                    </option>
                  ))}
              </select>
              {singleSecondExam?.numberOfSet > 0 && questionExam !== '' && questionSubject!=='' && (
            <div className="form-control">
              <label className="label-text text-center font-semibold text-lg" htmlFor="">
                Select Set Name
              </label>
              <select
                name="set_name"
                id="set_name"
                className="input w-full border-black input-bordered"
                required
                onChange={(e) => handleChangeSet(parseInt(e.target.value))}
              >
                <option value={-1}></option>
                {[...Array(singleSecondExam?.numberOfSet).keys()].map((id) => (
                  <option key={id} value={id}>
                    {optionName[id]}
                  </option>
                ))}
              </select>
            </div>
          )}
            </div>

            <div className="form-control mt-4  flext justify-center items-center">
              <input type="submit" value="Add Questions" className="btn" />
            </div>
          </form>
          <div className="modal-action">
            <label htmlFor="my-modal-mcq-special" className="btn bg-red w-[80px]">
              Close!
            </label>
          </div>
        </div>
      </div>
        </div>
    );
};

export default McqSpecialQuestionSender;