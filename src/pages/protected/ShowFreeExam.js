import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import axios from "../../utils/axios";
import Loader from "./../../Shared/Loader";
import { toast } from "react-hot-toast";
import DeactivateButton from './../../features/common/components/DeactivateButton';
import PopUpModal from './../../features/common/components/PopUpModal';
import { subtractHours } from "../../utils/globalFunction";
import QuestionAdder from "../../components/QuestionAdder/QuestionAdder";
import ImageAdder from "../../components/ImageAdder/ImageAdder";

const ShowFreeExam = () => {
  
  const [exams, setExams] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [singleExamId, setSingleExamId] = useState(null);
  const [singleExam, setsingleExam] = useState({});
  const [isText, setIsText] = useState(true);
  const [correctOption, setCorrectOption] = useState(null);
  const [selectedExamId,setSelectedExamId] = useState("");
  const [ruleImg,setRuleImg] = useState("");
  const [pStatus,setPStatus] = useState("");
  const [curriculums, setCurriculums] = useState([])
  const [addmissionChecked, setAddmissionChecked] = useState(false)
  const [questionType, setQuestionType] = useState(0)
  const [updatenumberOfOptions, setUpdateNumberOfOptions] = useState(4)
  const [numberOfSet, setNumberOfSet] = useState(4)
  const [nameOfSet, setNameOfSet] = useState(0)
  const [selectedCurriculum,setSelectedCurriculum] = useState("");
 
  const refillQuestions = id =>{
    const sendingData = {
      examId:id
    };
    axios
    .post('/api/exam/refillquestion',sendingData)
    .then((data) => {
      console.log(data)
      toast.success('Questions added to all sets')
      window.location.reload(false)
    })
    .catch((err) => toast.error(err.response.data))
  }
  const assignIdstatus = (examId,status)=>{
    setSingleExamId(examId);
    setPStatus(status);
  }
  const generator = (id) =>{
    axios.put(`/api/freestudent/updatestudentexaminfofree?examId=${id}`).then(({data})=>{
      
      if(data.length===0){
          toast.error("Exam is running")
          window.location.reload(false);
      }else{        
      axios.post(`/api/freestudent/updaterankfree?examId=${id}`).then((rankData)=>{
        console.log(rankData);
        toast.success('Rank Generated Successfully');
        window.location.reload(false);
      }).catch(e=>console.log(e))
      }
    }).catch(e=>console.log(e))
  }
  const handleAssignRule = id =>{
    axios.get(`/api/exam/examruleget?examId=${id}`).then(({data})=>{
      if(data!==null){
        setRuleImg(data.ruleILink);
        return data.ruleILink;
      }
      console.log(data);
      
    }).catch(e=>{console.log(e);
    })
  }
  const  handleAssignExamId = id=>{
    console.log(id);
    setSingleExamId(id);
  }
  const handleAddRule = async(e) =>{
    e.preventDefault();

    setIsLoading(true);
    const form = e.target;
    const file = e.target.ruleILink.files[0];
    const formData = new FormData();
    formData.append("examId",singleExam._id);
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
  }
  const handleUpdateExam = async (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.exam.value;
    const startTime = form.start_time.value;
    const endTime = form.end_time.value;
    const totalQuestionMcq = form.total_questions.value;
    const marksPerMcq = form.marks_per_question.value;
    const duration = form.duration.value;
    const negativeMarks = form.negative_marking.value;
    const admission =
      document.getElementById('isAdmission').checked === true ? true : false
    const totalMarksMcq = (parseInt(totalQuestionMcq)*parseInt(marksPerMcq))
    
    const updatedExam = {
      examId:singleExam._id,
      name,
      examType:-1,
      subjectId:singleExam.subjectId._id,
      courseId:singleExam.courseId._id,
      examVariation:1,
      examFreeOrNot:true,
      startTime,endTime,
      totalQuestionMcq,marksPerMcq,totalMarksMcq,
      status:true,
      duration:duration,
      negativeMarks,
      isAdmission: admission,
      curriculumName: selectedCurriculum,
      numberOfRetakes:4,
      numberOfSet,
      questionType: questionType,
      numberOfOptions: updatenumberOfOptions,
    }
    console.log(updatedExam);
    await axios.put('/api/exam/updateexam',updatedExam).then(({data})=>{
      toast.success(data);     
      window.location.reload(false);
      form.reset();
    })
    document.getElementById("my-modal").checked = false;
  };
  const handleAddQuestion = async (e) => {
    e.preventDefault()
    const form = e.target
    let questionText = ''
    if (isText === true) {
      questionText = form.question_text.value
    }
    let options = []
    if (isText === true) {
      for (let i = 0; i < singleExam.numberOfOptions; i++) {
        options.push(document.getElementById(`option${i}`).value)
      }
    }
    let questionLink = ''
    const explanationILink = null
    const formdata = new FormData()
    if (isText === false) {
      questionLink = form.iLink.files[0]
      formdata.append('iLink', questionLink)
    } else {
      formdata.append('iLink', questionLink)
    }
    formdata.append('explanationILink', explanationILink)

    // const question = {
    //   questionText: questionText,
    //   type: isText,
    //   options,
    //   optionCount: numberOfOptions,
    //   correctOption: parseInt(correctOption),
    //   status: true,
    //   examId: singleExamId,
    // }
    formdata.append('questionText', questionText)
    formdata.append('type', isText)
    formdata.append('options', JSON.stringify(options))
    formdata.append('optionCount', singleExam.numberOfOptions)
    formdata.append('correctOption', parseInt(correctOption))
    formdata.append('status', true)
    formdata.append('examId', singleExamId)
    formdata.append('setName', nameOfSet)

    await axios
      .post(`/api/exam/addquestionmcq?examId=${singleExamId}`, formdata, {
        headers: {
          'Content-Type': 'multipart/ form-data',
        },
      })
      .then((data) => {
        toast.success('success')
        form.reset()
      })
      .catch((e) => {
        toast.error(e.response.data)
        if (e.response.status === 405) {
          form.reset()
        }
      })
    document.getElementById('my-modal-2').checked = false
  }
  const deactivateExam = async(examId) =>{
    await axios.put('/api/exam/deactivateexam',{examId}).then(({data})=>{
      toast.success("Exam Deactivated");
      window.location.reload(false);
    })
  }
  // const handleChangeNumberOfInput = e=>{
  //   setNumberOfOptions(parseInt(e.target.value))
  //   document.getElementById("num_of_options").disabled = true;
  // }
  const handleExam = examName =>{
    if(examName.length>4){
      axios.get(`/api/freestudent/getfreeexamall`)
    .then(({data} ) => {
      const curExam = data.filter(d=>d.name.includes(examName))
      setExams(curExam);      
      if(data.length===0){
        toast.error("No Data")
      }
      setIsLoading(false);
    }).catch(e=>toast.error(e.response.data))
    }else{
      axios.get(`/api/freestudent/getfreeexamall`)
    .then(({data} ) => {
      setExams(data);      
      if(data.length===0){
        toast.error("No Data")
      }
      setIsLoading(false);
    }).catch(e=>toast.error(e.response.data))
    }
  }
  const addPublish = examId=>{
    axios.post(`/api/freestudent/addpublishfree`,{examId})
    .then(({data} ) => {
      toast.success("Successfully publishied the exam");
      window.location.reload(false);
      setIsLoading(false);
    }).catch(e=>toast.error(e.response.data))
  }
  const changeStatus = (examId,status)=>{
    axios.post(`/api/freestudent/statusupdatepublishfree`,{examId,status:(status).toString()})
    .then(({data} ) => {
      toast.success(`Successfully changed the status to ${status} `);      
      window.location.reload(false);
      setIsLoading(false);
    }).catch(e=>toast.error(e.response.data))
  }
  useEffect(() => {
    setIsLoading(true);
    axios.get('/api/curriculum/getcurriculums').then(({ data }) => {
      // console.log(data);
      setCurriculums(data)
      setIsLoading(false)
    })
    axios.get(`/api/freestudent/getfreeexamall`)
    .then(({data} ) => {
      // console.log(data);
      setExams(data);      
      if(data.length===0){
        toast.error("No Data")
      }
      setIsLoading(false);
    }).catch(e=>toast.error(e.response.data))
    if (singleExamId !== null) {
      axios
        .get(`/api/exam/getExamById?examId=${singleExamId}`)
        .then(({ data }) => {
          setsingleExam(data);
          setUpdateNumberOfOptions(data.numberOfOptions)
          setNumberOfSet(data.numberOfSet)
          setQuestionType(data.questionType)
          setAddmissionChecked(data.isAdmission)
          setSelectedCurriculum(data.curriculumName)
          if (data.questionType === '0') {
            setIsText(false)
          } else {
            setIsText(true)
          }
        })
        .catch((e) => console.log(e));
    } else {
      setsingleExam({});
    }
  }, [singleExamId]);
  return (
    <div className="mx-auto">
      <div className="flex justify-center items-center py-4 px-2 my-3  ">
        <div className="bg-white w-full lg:w-1/2 py-4 flex flex-row justify-evenly items-center">
          <h2 className="text-center font-bold">Free Exams</h2>
        </div>
      </div>
      <div className="py-4 px-2 my-3">
      
       <div className="flex justify-center items-center">
       <div className="form-control w-1/3 ">
         <input
         className="input input-bordered  border-black font-bold" 
         type="text" 
         placeholder="Type Exam Name"
         onChange={(e)=>handleExam(e.target.value)}
         name="" 
         id="" 
         />
       </div>
       </div>
      
   </div>
      {isLoading && <Loader></Loader>}
      {exams.length > 0 && (
        <div className='overflow-x-auto w-full'>
        <table className='mx-auto w-full whitespace-nowrap rounded-lg  divide-y  overflow-hidden'>
            <thead>
              <tr>
                <th className="bg-white font-semibold text-sm uppercase px-6 py-4">SI No.</th>
                <th className="bg-white font-semibold text-sm uppercase px-6 py-4">Exam Name</th>
                <th className="bg-white font-semibold text-sm uppercase px-6 py-4">Start Time<br/>End Time</th>
                {/* <th className="bg-white font-semibold text-sm uppercase px-6 py-4">End Time</th> */}
                <th className="bg-white font-semibold text-sm uppercase px-6 py-4">Duration</th>
                <th className="bg-white font-semibold text-sm uppercase px-6 py-4">Curriculam</th>
                <th className="bg-white font-semibold text-sm uppercase px-6 py-4">Marks/Questions<br/>Total Questions<br/>Total Marks<br/></th>
                {/* <th className="bg-white font-semibold text-sm uppercase px-6 py-4">Total Questions</th>
                <th className="bg-white font-semibold text-sm uppercase px-6 py-4">Total Marks</th> */}
                <th className="bg-white font-semibold text-sm uppercase px-6 py-4">Pre Action</th>
                <th className="bg-white font-semibold text-sm uppercase px-6 py-4">Post Action</th>
              </tr>
            </thead>
            <tbody>
              {exams.length > 0 &&
                exams.map((exam,idx) => (
                  <tr key={exam._id} className="even:bg-table-row-even odd:bg-table-row-odd text-center"> 
                    <td className="px-6 py-4 text-center">{idx+1}</td>
                    <td className="px-6 py-4 text-center">{exam.name}</td>
                    <td className="px-1 py-4 text-center">{subtractHours(new Date(exam.startTime)).toString().split("GMT")[0]}<br/>
                    {subtractHours(new Date(exam.endTime)).toString().split("GMT")[0]}
                    </td>
                    {/* <td className="px-1 py-4 text-center">{subtractHours(new Date(exam.endTime)).toString().split("GMT")[0]}</td> */}
                    <td className="px-6 py-4 text-center">{exam.duration} Minutes</td>
                    <td className="px-6 py-4 text-center">{exam.curriculumName!==null?exam.curriculumName:"N/A" }</td>
                    <td className="px-6 py-4 text-center">{exam.marksPerMcq}<br/>{exam.totalQuestionMcq}<br/>{exam.totalMarksMcq}</td>
                    {/* <td className="px-6 py-4 text-center">{exam.totalQuestionMcq}</td>
                    <td className="px-6 py-4 text-center">{exam.totalMarksMcq}</td> */}
                    <td className="px-6 py-4 text-center">
                      <div className="flex flex-col lg:flex-row justify-center">
                      {
                        exam.RuleImage!=='0'? <label
                        onClick={() => handleAssignRule(exam._id)}
                        htmlFor="my-modal-4"
                        className="btn bg-button hover:bg-gradient-to-r from-[#616161] from-0% to=[#353535] to-100% mr-2 mb-3 lg:mb-0 text-white"
                      >Show Rule
                      </label> : <label
                      onClick={() => handleAssignExamId(exam._id)}
                      htmlFor="my-modal-3"
                      className="btn bg-button hover:bg-gradient-to-r from-[#616161] from-0% to=[#353535] to-100% mr-2 mb-3 lg:mb-0 text-white"
                    >
                      Add Exam Rule
                    </label>  
                      }
                      <label
                          onClick={() => handleAssignExamId(exam._id)}
                          htmlFor="imageAdder"
                          className="btn bg-button text-sm hover:bg-gradient-to-r from-[#616161] from-0% to=[#353535] to-100% mr-2 mb-3 lg:mb-0 text-white"
                        >
                          {exam.iLink === null ? 'Add Exam Image' : 'Update Exam Image'}
                        </label>
                      <label
                        onClick={() => handleAssignExamId(exam._id)}
                        htmlFor="my-modal"
                        className="btn bg-button hover:bg-gradient-to-r from-[#616161] from-0% to=[#353535] to-100% mr-2 mb-3 lg:mb-0 text-white"
                      >
                        Update
                      </label>
                      <label
                        htmlFor="my-modal-2"
                        onClick={()=>setSingleExamId(exam._id)}
                        className="btn bg-button hover:bg-gradient-to-r from-[#616161] from-0% to=[#353535] to-100% mr-2 mb-3 lg:mb-0 text-white"
                      >
                        Add Questions
                      </label>
                      <button
                          className="btn bg-button text-[12px] hover:bg-gradient-to-r from-[#616161] from-0% to=[#353535] to-100% mr-2 mb-3 lg:mb-0 text-white"
                          onClick={() => refillQuestions(exam._id)}
                        >
                          Refill MCQ Sets
                        </button>
                      <DeactivateButton setter={setSelectedExamId} value={exam._id}></DeactivateButton>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex flex-col lg:flex-row justify-center">
                      {
                        (exam.publishStatus===null || exam.publishStatus===false) && <label
                        onClick={() =>handleAssignExamId(exam._id)}
                        htmlFor="publish-popup"
                        className="btn bg-button hover:bg-gradient-to-r from-[#616161] from-0% to=[#353535] to-100% mr-2 mb-3 lg:mb-0 text-white"
                      >
                        Publish Exam
                      </label>
                      } 
                    <label
                    onClick={() => assignIdstatus(exam._id,!exam.publishStatus)}
                    htmlFor="status-popup"
                    className="btn bg-button hover:bg-gradient-to-r from-[#616161] from-0% to=[#353535] to-100% mr-2 mb-3 lg:mb-0 text-white"
                  >
                    Change Status
                  </label> 
                       <label
                      onClick={() => handleAssignExamId(exam._id)}
                      htmlFor="my-popup"
                      className="btn bg-button hover:bg-gradient-to-r from-[#616161] from-0% to=[#353535] to-100% mr-2 mb-3 lg:mb-0 text-white"
                    >
                      Generate Meritlist
                    </label>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
      <div>
      <input type="checkbox" id="publish-popup" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <h3 className="font-semibold text-lg text-center">
            {  `Are you sure?`}
          </h3>

          <div className="modal-action flex justify-center items-center">
            <button
              className="btn mr-2"
              onClick={() =>addPublish(singleExamId)}
            >
              Yes
            </button>
            <label htmlFor="publish-popup" className="btn bg-[red]">
              No!
            </label>
          </div>
        </div>
      </div>
      <input type="checkbox" id="status-popup" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <h3 className="font-semibold text-lg text-center">
            {  `Are you sure?`}
          </h3>

          <div className="modal-action flex justify-center items-center">
            <button
              className="btn mr-2"
              onClick={() =>changeStatus(singleExamId,pStatus)}
            >
              Yes
            </button>
            <label htmlFor="status-popup" className="btn bg-[red]">
              No!
            </label>
          </div>
        </div>
      </div>
      <input type="checkbox" id="my-popup" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <h3 className="font-semibold text-lg text-center">
            {  `Are you sure?`}
          </h3>

          <div className="modal-action flex justify-center items-center">
            <button
              className="btn mr-2"
              onClick={() =>generator(singleExamId)}
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
            <img src={process.env.REACT_APP_API_HOST+"/"+ruleImg} alt="exam-rules" />
            <div className="modal-action">
                  <label htmlFor="my-modal-4" className="btn bg-[red] ">
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
            <input type="submit" value="Add"  className="btn w-32"  />
            </form>
            <div className="modal-action">
                  <label htmlFor="my-modal-3" className="btn bg-[red] ">
                    Close!
                  </label>
                </div>
          </div>
        </div>
      </div>
      <div id="update-modal">
        <input type="checkbox" id="my-modal" className="modal-toggle" />
        <div className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg text-center">Update Exam</h3>
            <form className="add-form" onSubmit={handleUpdateExam}>
              <div className="form-control w-full">
                <label htmlFor="" className=" label">
                    <span className="label-text">Exam Name </span>
                    </label>
                    <input
                    className="input input-bordered  border-black"
                    type="text"
                    name="exam"
                    id="exam"
                    placeholder="Subject Name"
                    defaultValue={singleExam.name}
                    required
                    />
              </div>
              <div className="form-control"></div>
              <div className="form-control flex flex-col lg:flex-row justify-between items-start lg:items-center">
                <div className="w-full lg:w-1/2 mr-0 lg:mr-4">
                  <label className="label" htmlFor="">
                    Start Time
                  </label>
                  <input
                    type="datetime-local"
                    className="input input-bordered w-full  border-black "
                    name="start_time"
                    id="start_time"
                    defaultValue={singleExam?.startTime?.split(":00.000Z")[0]}
                    required
                  />
                </div>
                <div className="w-full lg:w-1/2">
                  <label className="label" htmlFor="">
                    End Time
                  </label>
                  <input
                    type="datetime-local"
                    className="input input-bordered w-full  border-black "
                    name="end_time"
                    id="end_time"
                    defaultValue={singleExam?.endTime?.split(":00.000Z")[0]}
                    required
                  />
                </div>
              </div>
              <div className="form-control flex flex-col lg:flex-row justify-between items-start lg:items-start">
                <div className="w-full lg:w-1/4">
                  <label htmlFor="" className="label">
                    Questions
                  </label>
                  <input
                    type="number"  step="0.01"
                    className="input w-full input-bordered  border-black "
                    name="total_questions"
                    id="total_questions"
                    defaultValue={singleExam.totalQuestionMcq}
                    onInput={(e) =>
                      e.target.value < 0
                        ? (e.target.value = "")
                        : e.target.value
                    }
                    required
                  />
                </div>
                <div className="w-full lg:w-1/4">
                  <label htmlFor="" className="label">
                    Marks/Question
                  </label>
                  <input
                    type="number"  step="0.01"
                    className="input w-full input-bordered  border-black "
                    name="marks_per_question"
                    id="marks_per_question"
                    defaultValue={singleExam.marksPerMcq}
                    onInput={(e) =>
                      e.target.value < 0
                        ? (e.target.value = "")
                        : e.target.value
                    }
                    required
                  />
                </div>
                <div className="w-full lg:w-1/3">
                  <label className="label" htmlFor="">
                    Duration
                  </label>
                  <input
                    type="mumber"
                    className="input w-full input-bordered border-black "
                    name="duration"
                    id="duration"
                    defaultValue={singleExam.duration}
                    min="1"
                    onInput={(e) =>
                      e.target.value < 0
                        ? (e.target.value = "")
                        : e.target.value
                    }
                    required
                  />
                  <span className="text-red text-sm ml-0 lg:ml-2">
                    (minutes)
                  </span>
                </div>
              </div>
              <div className="form-control grid grid-cols-1 lg:grid-cols-3 gap-3 mt-4 ">
                  <div>
                    <label htmlFor="" className="label">
                      Question Type
                    </label>
                    <select
                      name="questionType"
                      id="questionType"
                      className="input border-black input-bordered w-full "
                      onChange={(e) =>
                        setQuestionType(parseInt(e.target.value))
                      }
                      required
                    >
                      <option value={parseInt(questionType)}>
                        {questionType === '0' ? 'Image' : 'Text'}
                      </option>
                      <option value={1}>Text</option>
                      <option value={0}>Image</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="" className="label">
                      Options
                    </label>
                    <select
                      name="numberOfOptions"
                      id="numberOfOptions"
                      className="input border-black input-bordered w-full "
                      onChange={(e) =>
                        setUpdateNumberOfOptions(parseInt(e.target.value))
                      }
                      required
                    >
                      <option value={parseInt(updatenumberOfOptions)}>
                        {updatenumberOfOptions}
                      </option>
                      <option value={2}>2</option>
                      <option value={3}>3</option>
                      <option value={4}>4</option>
                      <option value={5}>5</option>
                      <option value={6}>6</option>
                      <option value={7}>7</option>
                      <option value={8}>8</option>
                      <option value={9}>9</option>
                      <option value={10}>10</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="" className="label">
                      Sets
                    </label>
                    <select
                      name="numberOfSets"
                      id="numberOfSets"
                      className="input border-black input-bordered w-full "
                      onChange={(e) => setNumberOfSet(parseInt(e.target.value))}
                      required
                    >
                      <option value={parseInt(numberOfSet)}>
                        {numberOfSet}
                      </option>
                      <option value={0}>0</option>
                      <option value={1}>1</option>
                      <option value={2}>2</option>
                      <option value={3}>3</option>
                      <option value={4}>4</option>
                    </select>
                  </div>
               
                </div>
              <div className="form-control grid grid-cols-1 lg:grid-cols-3 gap-x-2 gap-y-3">
                <div className="">
                  <label htmlFor="" className="label">
                    Negative
                  </label>
                  <input
                    type="number"  step="0.01"
                    className="input w-full input-bordered  border-black "
                    name="negative_marking"
                    id="negative_marking"
                    defaultValue={singleExam.negativeMarks}
                    
                    onChange={(e) =>
                      e.target.value < 0
                        ? (e.target.value = "")
                        : e.target.value
                    }
                    required
                  />
                </div>
                <div className="flex flex-col-reverse justify-center items-center">
                  <input
                    id="isAdmission"
                    type="checkbox"
                    name="isAdmission"
                    checked={addmissionChecked}
                    onChange={() => setAddmissionChecked(!addmissionChecked)}
                    className="w-4 h-4  border-black rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    htmlFor="disabled-checked-checkbox"
                    className="ml-2 text-lg"
                  >
                    Is Admission
                  </label>
                </div>
                <div className="flex flex-col ">
                  <label
                    htmlFor="disabled-checked-checkbox"
                    className="ml-2 text-lg"
                  >
                    Curriculum 
                  </label>
                  <select
                    name="curriculums"
                    id="curriculums"
                    className="input w-full  border-black input-bordered "
                    required
                    onChange={(e) => setSelectedCurriculum(e.target.value)}
                  >
                    <option value={singleExam.curriculumName}>{singleExam.curriculumName===null? "NONE" : singleExam.curriculumName}</option>
                    {singleExam.curriculumName!==null && <option value={null}>NONE</option>
                   }
                    {curriculums.length > 0 &&
                      curriculums.map((curriculum) => (
                        <option key={curriculum._id} value={curriculum.name}>
                          {curriculum.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
              <div className="form-control mt-2 flex flex-row justify-between">
                <input
                  type="submit"
                  value="Update Exam"
                  className="btn w-[150px] mt-4"
                />
                <div className="modal-action">
                  <label htmlFor="my-modal" className="btn bg-[red] ">
                    Close!
                  </label>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <ImageAdder
        title={`${singleExam.iLink === null ? 'Add Image' : 'Update Image'}`}
        apiEndPoint="/api/exam/updateExamPhoto"
        examId={singleExamId}
        setIsLoading={setIsLoading}
      />
      <QuestionAdder
        singleExam={singleExam}
        handleAddQuestion={handleAddQuestion}
        setNameOfSet={setNameOfSet}
        setCorrectOption={setCorrectOption}
        isText={isText}
        setIsText={setIsText}
      />
      <PopUpModal modalData={selectedExamId} remove={deactivateExam}></PopUpModal>
    </div>
  );
};

export default ShowFreeExam;
