import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import axios from "../../utils/axios";
import Loader from "./../../Shared/Loader";
import { toast } from "react-hot-toast";
import DeactivateButton from "./../../features/common/components/DeactivateButton";
import PopUpModal from "./../../features/common/components/PopUpModal";
import { type } from "../../utils/globalVariables";
import Select from "react-select";
import moment from "moment/moment";

const ShowSpecialExam = () => {
  const [courses, setCourses] = useState([]);
  const [exams, setExams] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [singleExamId, setSingleExamId] = useState(null);
  const [singleExam, setsingleExam] = useState({});
  const [selectedExamId, setSelectedExamId] = useState("");
  const [ruleImg, setRuleImg] = useState("");
  const [teachers,setTeachers] = useState([]);
  const [ selectedTeachers, setSelectedTeachers ] = useState([]);
  const [examType, setExamType] = useState(-1);
 
  const generator = (id) => {
    axios
      .put(`/api/student/updatestudentexaminfo?examId=${id}`)
      .then((data) => {
        axios
          .post(`/api/student/updaterank?examId=${id}`)
          .then((data) => {
            toast.success("Rank Generated Successfully");
            window.location.reload(false);
          })
          .catch((e) => console.log(e));
      })
      .catch((e) => console.log(e));
  };
  const handleAssignRule = (id) => {
    axios
      .get(`/api/exam/examruleget?examId=${id}`)
      .then(({ data }) => {
        if (data !== null) {
          setRuleImg(data.ruleILink);
          return data.ruleILink;
        }
        console.log(data);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const handleAssignExamId = (id) => {
    console.log(id);
    setSingleExamId(id);
  };
  const handleAddRule = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    const form = e.target;
    const file = e.target.ruleILink.files[0];
    const formData = new FormData();
    formData.append("examId", singleExam._id);
    formData.append("ruleILink", file);
    try {
      await axios
        .post("/api/exam/examruleset", formData, {
          headers: {
            "Content-Type": "multipart/ form-data",
          },
        })
        .then(({ data }) => {
          toast.success("Rules Added Successfully");
          window.location.reload(false);
          form.reset();
          setIsLoading(false);
        })
        .catch((e) => console.log(e));
    } catch (e) {
      toast.error(`${e.response.data.message}`);
      console.log(e);
    }

    document.getElementById("my-modal-3").checked = false;
  };
  const deactivateExam = async (examId) => {
    await axios.put("/api/special/deactivatespecialexam", { examId }).then(({ data }) => {
      toast.success("Exam Deactivated");
      window.location.reload(false);
    });
  };

  const handleChangeCourse = (e) => {
    setSelectedCourse(e.target.value);
    setExams([]);
  };
  const examStopper = examId =>{
    axios.post("/api/student/updatedstudentwritteninfo",{examId})
    .then(data=>{
      toast.success("This exam is stopped now...")
      window.location.reload(false);
    }).catch(err=>toast.error(err));
  }
 
  const handleAssignTeacher = e =>{
      e.preventDefault();
      let steachers = [];
      for(let i = 0 ; i<selectedTeachers.length;i++){
            steachers.push(selectedTeachers[i].value);
      }
      const obj ={
        examId:singleExamId,
        teacherId:steachers
      }
      axios.post("/api/exam/assignstudenttoteacher",obj).then(({data})=>{
        console.log(data);
        toast.success("Assigned and Distributed");
      }).catch(err=>console.log(err))
  }
  useEffect(() => {
    setIsLoading(true);
    axios.get("/api/course/getallcourseadmin").then(({ data }) => {
      setCourses(data.courses);
      setIsLoading(false);
    });
    if (selectedCourse !== "" && examType!==-1) {
      axios
      .get(`/api/special/showspecialexambycourse?courseId=${selectedCourse}`)
      .then(({ data }) => {
        const sExams = data.filter(d=>d.examVariation===examType)
        setExams(sExams);
        if (data.length === 0) {
          toast.error("No Data");
        }
        setIsLoading(false);
      })
      .catch((e) => toast.error(e.response.data));

      axios
        .get(`/api/user/teacherlistbycourse?courseId=${selectedCourse}`)
        .then(({ data }) => {
          console.log(data);
          setTeachers(data)
          setIsLoading(false);
        }).catch(err=>console.log("teacher fetching error"));
    } else {
      setExams([]);
    }
    if (singleExamId !== null) {
      axios
        .get(`/api/exam/getExamById?examId=${singleExamId}`)
        .then(({ data }) => {
          setsingleExam(data);
        })
        .catch((e) => console.log(e));
    } else {
      setsingleExam({});
    }
  }, [selectedCourse, singleExamId,examType]);
  return (
    <div className="mx-auto">
      <div className="flex w-10/12 justify-center items-center py-5 px-2 my-5  ">
        <div className="bg-white  lg:w-1/2 py-2 flex flex-row justify-evenly items-center">
          <div className="form-control w-1/2 mr-2 ">
            <label className="label-text" htmlFor="">
              Select Course
            </label>
            <select
              name="course_list"
              id="course_list"
              className="input w-full border-black input-bordered"
              required
              onChange={(e) => handleChangeCourse(e)}
            >
              <option value=""></option>
              {courses.length > 0 &&
                courses.map(
                  (course) =>
                    course.name !== "Free" && (
                      <option key={course._id} value={course._id}>
                        {course.name}
                      </option>
                    )
                )}
            </select>
          </div>
          <div className="form-control w-2/6">
            <label className="label-text" htmlFor="">
              Select Type
            </label>
            <select
              name="exam_type"
              id="exam_type"
              className="input w-full border-black input-bordered"
              required
              onChange={(e) => setExamType(parseInt(e.target.value))}
            >
              <option value="">---Select---Type</option>
              <option value={1}>MCQ</option>
              <option value={2}>Written</option>
              <option value={3}>Both</option>
              
            </select>
          </div>
        </div>
      </div>
      {isLoading && <Loader></Loader>}
      {exams.length > 0 && (
        <div className="overflow-x-auto w-full">        
          <table className="mx-auto  w-full whitespace-nowrap rounded-lg  divide-y  overflow-hidden">
            <thead>
              <tr>
                <th className="bg-white font-semibold text-sm uppercase px-1 py-2">
                  SI No.
                </th>
                <th className="bg-white  font-semibold text-sm uppercase px-2 py-2">
                  Exam Name
                </th>
                <th className="bg-white font-semibold text-sm uppercase px-6 py-2">
                  Start Time - <br></br> End Time
                </th>
                <th className="bg-white font-semibold text-sm uppercase px-6 py-2">
                  Duration
                </th>
                <th className="bg-white font-semibold text-sm uppercase px-6 py-2">
                  SSC?/HSC?
                </th>
                <th className="bg-white font-semibold text-sm uppercase px-6 py-2">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {exams.length > 0 &&
                exams.map((exam, idx) => (
                  <tr
                    key={exam._id}
                    className="even:bg-table-row-even odd:bg-table-row-odd text-center"
                  >
                    <td className="px-1 py-2 text-center">{idx + 1}</td>
                    <td className="px-2 py-2 text-center">{exam.name}</td>
                    <td className="px-1 py-2 text-center">
                      {
                        (moment(exam.startTime).format('llll'))
                      } <br/> 
                      {
                        (moment(exam.endTime).format('llll'))
                      }
                    </td>
                    <td className="px-6 py-2 text-center">
                      {exam.totalDuration} Minutes
                    </td>
                    <td className="px-6 py-2 text-center">
                      {exam.sscStatus ? "Yes" : "No"} / {exam.hscStatus ? "Yes" : "No"}
                    </td>
                    <td className="px-6 py-2 text-center">
                      <div className="flex flex-col lg:flex-row justify-center">
                        {exam.RuleImage !== "0" ? (
                          <label
                            onClick={() => handleAssignRule(exam._id)}
                            htmlFor="my-modal-4"
                            className="btn bg-button hover:bg-gradient-to-r from-[#616161] from-0% to=[#353535] to-100% mr-2 mb-3 lg:mb-0 text-white"
                          >
                            Show Rule
                          </label>
                        ) : (
                          <label
                            onClick={() => handleAssignExamId(exam._id)}
                            htmlFor="my-modal-3"
                            className="btn bg-button hover:bg-gradient-to-r from-[#616161] from-0% to=[#353535] to-100% mr-2 mb-3 lg:mb-0 text-white"
                          >
                            Add Exam Rule
                          </label>
                        )}
                        <label
                          onClick={() => handleAssignExamId(exam._id)}
                          htmlFor="my-popup"
                          className="btn bg-button hover:bg-gradient-to-r from-[#616161] from-0% to=[#353535] to-100% mr-2 mb-3 lg:mb-0 text-white"
                        >
                          Generate Meritlist
                        </label>
                        <label
                          onClick={() => handleAssignExamId(exam._id)}
                          htmlFor="assign-teacher"
                          className="btn bg-button hover:bg-gradient-to-r from-[#616161] from-0% to=[#353535] to-100% mr-2 mb-3 lg:mb-0 text-white"
                        >
                          Assign Teachers
                          </label>
                          <label
                          onClick={() => handleAssignExamId(exam._id)}
                          htmlFor="my-popup-written"
                          className="btn bg-button hover:bg-gradient-to-r from-[#616161] from-0% to=[#353535] to-100% mr-2 mb-3 lg:mb-0 text-white"
                        >
                          Submit Exam
                        </label>
                        <label
                          onClick={() => handleAssignExamId(exam._id)}
                          htmlFor="my-modal"
                          className="btn bg-button hover:bg-gradient-to-r from-[#616161] from-0% to=[#353535] to-100% mr-2 mb-3 lg:mb-0 text-white"
                        >
                          Update
                        </label>
                        {
                          exam.examVariation===1 && <label
                          htmlFor="my-modal-2"
                          onClick={() => setSingleExamId(exam._id)}
                          className="btn bg-button hover:bg-gradient-to-r from-[#616161] from-0% to=[#353535] to-100% mr-2 mb-3 lg:mb-0 text-white"
                        >
                          Add  Question
                        </label>
                        }
                        {
                          exam.examVariation===2 && <label
                          htmlFor="written-modal"
                          onClick={() => setSingleExamId(exam._id)}
                          className="btn bg-button hover:bg-gradient-to-r from-[#616161] from-0% to=[#353535] to-100% mr-2 mb-3 lg:mb-0 text-white"
                        >
                          Add  Question
                        </label>
                        }
                        {
                          exam.examVariation===3 && <label
                          htmlFor="both-modal"
                          onClick={() => setSingleExamId(exam._id)}
                          className="btn bg-button hover:bg-gradient-to-r from-[#616161] from-0% to=[#353535] to-100% mr-2 mb-3 lg:mb-0 text-white"
                        >
                          Add  Question
                        </label>
                        }
                        
                        <DeactivateButton
                          setter={setSelectedExamId}
                          value={exam._id}
                        ></DeactivateButton>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
      <div>
        <input type="checkbox" id="my-popup-written" className="modal-toggle" />
        <div className="modal">
          <div className="modal-box">
            <h3 className="font-semibold text-lg text-center">
              {`Are you sure?`}
            </h3>

            <div className="modal-action flex justify-center items-center">
              <button
                className="btn mr-2"
                onClick={() => examStopper(singleExamId)}
              >
                Yes
              </button>
              <label htmlFor="my-popup-written" className="btn bg-[red]">
                No!
              </label>
            </div>
          </div>
        </div>
        <input type="checkbox" id="my-popup" className="modal-toggle" />
        <div className="modal">
          <div className="modal-box">
            <h3 className="font-semibold text-lg text-center">
              {`Are you sure?`}
            </h3>

            <div className="modal-action flex justify-center items-center">
              <button
                className="btn mr-2"
                onClick={() => generator(singleExamId)}
              >
                Yes
              </button>
              <label htmlFor="my-popup" className="btn bg-[red]">
                No!
              </label>
            </div>
          </div>
        </div>
        
        <input type="checkbox" id="my-modal-4" className="modal-toggle" />
        <div className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg text-center">Exam Rules</h3>
            <img
              src={process.env.REACT_APP_API_HOST + "/" + ruleImg}
              alt="exam-rules"
            />
            <div className="modal-action">
              <label htmlFor="my-modal-4" className="btn bg-[red] ">
                Close!
              </label>
            </div>
          </div>
        </div>
      </div>
      <div id="assignTeacher">
        <input type="checkbox" id="assign-teacher" className="modal-toggle" />
        <div className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg text-center">Add Rule</h3>
            <form className="add-form" onSubmit={handleAssignTeacher}>
              <div className="form-control">
                <label htmlFor="" className=" label">
                  <span className="label-text mb-2">Select Teachers </span>
                </label>
                <Select
                  options={teachers}
                  onChange={(choice) => setSelectedTeachers(choice)}
                  isMulti
                  
                  labelledBy="Select"
            />
              </div>
              <input type="submit" value="Add" className="btn w-32" />
            </form>
            <div className="modal-action">
              <label htmlFor="assign-teacher" className="btn bg-[red] ">
                Close!
              </label>
            </div>
          </div>
        </div>
      </div>
      <div id="add-modal">
        <input type="checkbox" id="my-modal-3" className="modal-toggle" />
        <div className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg text-center">Add Rule</h3>
            <form className="add-form" onSubmit={handleAddRule}>
              <div className="form-control">
                <label htmlFor="" className=" label">
                  <span className="label-text mb-2">Add Rule Image </span>
                </label>
                <input
                  type="file"
                  name="ruleILink"
                  id="ruleILink"
                  className="file-input w-full max-w-xs mb-2 input input-bordered border-black pl-0"
                />
              </div>
              <input type="submit" value="Add" className="btn w-32" />
            </form>
            <div className="modal-action">
              <label htmlFor="my-modal-3" className="btn bg-[red] ">
                Close!
              </label>
            </div>
          </div>
        </div>
      </div>
      <PopUpModal
        modalData={selectedExamId}
        remove={deactivateExam}
      ></PopUpModal>
    </div>
  );
};

export default ShowSpecialExam;
