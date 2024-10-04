import React, { useEffect, useState } from 'react'
import axios from '../../utils/axios'
import { optionName } from '../../utils/globalVariables'
import Loader from '../../Shared/Loader'
import toast from 'react-hot-toast'
// import GetData from './GetData'
import 'katex/dist/katex.min.css'
import Latex from 'react-latex-next'

const AddBundleQuestionBoth = () => {
  const [courses, setCourses] = useState([])
  const [subjects, setSubjects] = useState([])
  const [exams, setExams] = useState([])
  const [selectedCourse, setSelectedCourse] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('')
  const [selectedExam, setSelectedExam] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [singleExam, setSingleExam] = useState({})
  const [selectedSet, setSelectedSet] = useState(-1)
  const [slots, setSlots] = useState(0)
  const [selectedImages, setSelectedIMages] = useState([])
  const [uploadImages, setUploadImages] = useState([])
  const [correctOptions, setCorrectOptions] = useState([])
  const [disabler, setDisabler] = useState(false)
  const [quesType, setQuesType] = useState(null)
  const [questionDetails, setQuestionDetails] = useState([{}])
  const [enabler, setEnabler] = useState([])
  const [previewData,setPreviewData] = useState("question");

  const addDetails = (id) => {

    let prevEnabler = enabler;
    
    axios.post('/api/both/addTextQuestion',questionDetails[id]).then(({data})=>{
      prevEnabler[id] =  0;
      setEnabler(prevEnabler);
      setSingleExam(singleExam);
      toast.success("Question added Successfully");
      addData(id)
    }).catch(err=>console.log(err))

  }
  const addData = (id) => {
    setIsLoading(true)
    // setPreviewData("");
    // console.log(questionDetails)
    let prevDetails = questionDetails
    const question = document.getElementById(`ques${id}`).value
    prevDetails[id].question = question;
    prevDetails[id].setName = selectedSet;
    setPreviewData(question);
    setQuestionDetails(prevDetails)
    toast.success("Added")

    setIsLoading(false)
  }
  
  const handleChangeCourse = (e) => {
    setSelectedSubject('')
    setSlots(0)
    setSubjects([])
    setExams('')
    setExams([])
    setSelectedCourse(e.target.value)
  }

  const handleChangeSubject = (e) => {
    setSelectedSubject(e.target.value)
    setSelectedExam('')
    setExams([])
    setSlots(0);
  }

  const handleChangeExam = (e) => {
    setSelectedExam('')
    setSlots(-1)
    if (e.target.value !== '') {
      axios
        .get(`/api/both/getbothexambyid?examId=${e.target.value}`)
        .then(({ data }) => {
          setSingleExam(data)
          console.log(data)
          let emptyArray = []
          let numberArray = []
          for (let i = 0; i < data.totalQuestionMcq; i++) {
            const obj = {}
            obj.question = ''
            obj.options = []
            for (let j = 0; j<data.numberOfOptions; j++) {
              obj.options[j] = ''
            }
            obj.optionCount = data.numberOfOptions
            obj.explanationILink = null
            obj.status = true
            obj.type = true
            obj.correctOption = -1;
            obj.setName = selectedSet;
            obj.examId = e.target.value;
            emptyArray[i] = obj
            numberArray[i] = 1
          }
          setEnabler(numberArray)
          setQuestionDetails(emptyArray)
          setQuesType(data.questionType)
          setSelectedExam(e.target.value)
        })
        .catch((e) => console.log(e))
    } else {
      setSelectedExam('')
      setSingleExam({})
    }
  }

  const handleChangeSet = (setName) => {
    setSelectedSet(parseInt(setName))
    axios
      .get(
        `/api/both/slotAvailable?examId=${selectedExam}&setName=${parseInt(
          setName
        )}`
      )
      .then(({ data }) => {
        setSlots(data.slots)
        let arrayFiller = [];
        for( let i = 0 ; i<data.slots; i++ ){
            arrayFiller[i] = -1;
        }
        setCorrectOptions(arrayFiller)
      }).catch(e=>{
        setSlots(0);
      })
  }

  async function onFileSelected(e) {
    console.log()
    const imgList = []
    const savImg = [];
    if(e.target.files.length<=slots){
        for (let i = 0; i < e.target.files.length; i++) {
            imgList.push(URL.createObjectURL(e.target.files[i]))
            savImg[i] = e.target.files[i];
          }    
          setUploadImages(savImg)
          setSelectedIMages(imgList)
    }else{
        toast.error(`You can maximum select ${slots} `)
    }
  }

  const addBulkCorrectOption = (ca,id) =>{
    setIsLoading(true);
    const correctAnswerList = correctOptions;
    correctAnswerList[id] = ca ;
    console.log(correctAnswerList);
    setCorrectOptions(correctAnswerList);
  }
  const addAllQuestions = async()=>{
    // document.getElementById("addButton").disabled =true;
    // setDisabler(true)
    const curQtype = 0;
    let questionText = ''
    let options = []
    setIsLoading(true)
    
    let questionLink = ''
    const explanationILink = null;
    const iImages = uploadImages;
    for(let i = 0 ; i<iImages.length ;i++ ){
        console.log(iImages[i]);
        const optAnswer = correctOptions[i];
        const formdata = new FormData()
        questionLink =iImages[i];
        formdata.append('iLink', questionLink)
        formdata.append('explanationILink', explanationILink)
    
        formdata.append('questionText', questionText)
        formdata.append('type', curQtype)
        formdata.append('options', JSON.stringify(options))
        formdata.append('optionCount', singleExam.numberOfOptions)
        formdata.append('correctOption', parseInt(optAnswer))
        formdata.append('status', true)
        formdata.append('examId', selectedExam)
        formdata.append('setName', selectedSet)
        
    
        await axios
          .post(`/api/both/bothaddquestionmcq?examId=${selectedExam}`, formdata, {
            headers: {
              'Content-Type': 'multipart/ form-data',
            },
          })
          .then((data) => {
            if(i+1===uploadImages.length){
                toast.success('successfully added all the questions')
                setUploadImages([]);
                setSelectedExam([]);
                setSlots(-1);
                setIsLoading(false);
                window.location.reload(false);
            }
            // toast.success("Uploaded")
          })
          .catch((e) =>{
            toast.error(e.response.data);
          })
    }
  

  }
  const addOptionValue = (questionNo, optionNo) => {
    setIsLoading(true)
    let prevData = questionDetails
    const optionvalue = document.getElementById(
      `option${optionNo}`
    ).value;
    prevData[questionNo].options[optionNo] = optionvalue
    setPreviewData(optionvalue)
    setQuestionDetails(prevData)
    setIsLoading(false)
    toast.success("Option Added")
  }
  const changCorrectOption = (answer ,id) =>{
    let prevData = questionDetails; 
    prevData[id].correctOption  = answer;
    setQuestionDetails(prevData);
  }
  useEffect(() => {
    setIsLoading(true)
    axios.get('/api/course/getallcourseadmin').then(({ data }) => {
      setCourses(data.courses)
      setIsLoading(false)
    })
    if (selectedCourse !== '') {
      axios
        .get(`/api/subject/getsubjectbycourse?courseId=${selectedCourse}`)
        .then(({ data }) => {
          setSubjects(data.data)
          setIsLoading(false)
        })
        .catch((e) => console.log(e))
    } else {
      setSubjects([])
    }
    if (selectedSubject !== '') {
        axios
        .get(`/api/both/getbothexambysubject?subjectId=${selectedSubject}`)
        .then(({ data }) => {
          setExams(data.examPage.exam);
          if (data.examPage.exam.length === 0) {
            toast.error("No Data");
          }
          setIsLoading(false);
        })
        .catch((e) =>{
          toast.error(e.response.data)
          setExams([]);
        });
    } else {
      setExams([])
    }
  }, [selectedCourse, selectedSubject])
  return (
    <div className="px-8 mb-40">
      <div className="bg-white py-4 px-2 my-3 ">
        <div
          className={` w-full  mx-auto grid grid-cols-1 lg:${
            singleExam?.numberOfSet > 0 ? 'grid-cols-4' : 'grid-cols-3 '
          } gap-4`}
        >
          <div className="form-control">
            <label className="label-text text-center" htmlFor="">
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
                courses.map((course) => (
                  <option
                    className="text-center"
                    key={course._id}
                    value={course._id}
                  >
                    {course.name}
                  </option>
                ))}
            </select>
          </div>
          <div className="form-control">
            <label className="label-text text-center" htmlFor="">
              Select Subject
            </label>
            <select
              name="course_list"
              id="course_list"
              className="input w-full border-black input-bordered"
              required
              onChange={(e) => handleChangeSubject(e)}
            >
              <option value=""></option>
              {subjects?.length > 0 &&
                subjects.map((subject) => (
                  <option
                    className="text-center"
                    key={subject._id}
                    value={subject._id}
                  >
                    {subject.name}
                  </option>
                ))}
            </select>
          </div>
          <div className="form-control">
            <label className="label-text text-center" htmlFor="">
              Select Exam Name
            </label>
            <select
              name="exam_list"
              id="exam_list"
              className="input w-full border-black input-bordered"
              required
              onChange={(e) => handleChangeExam(e)}
            >
              <option value=""></option>
              {exams.length > 0 &&
                exams.map((exam) => (
                  <option
                    className="text-center"
                    key={exam._id}
                    value={exam._id}
                  >
                    {exam.name}
                  </option>
                ))}
            </select>
          </div>
          {singleExam?.numberOfSet > 0 && selectedExam !== '' && (
            <div className="form-control">
              <label className="label-text text-center" htmlFor="">
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
                {[...Array(singleExam?.numberOfSet).keys()].map((id) => (
                  <option key={id} value={id}>
                    {optionName[id]}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>
      {isLoading && <Loader />}
      {selectedExam !== '' && slots === 0 && (
        <div className="flex justify-center items-center border-4 rounded-lg bg-white border-color-one py-8 px-4 my-10 mx-8">
          <p className="text-[32px] font-extrabold text-success">
            You have already added the questions for this set!
          </p>
        </div>
      )}
      {slots > 1 && quesType === '0' && (
        <div className="my-5">
          <label htmlFor="" className=" label">
            <span className="label-text">Select Multiple Question Image </span>
          </label>
          <input
            type="file"
            name="iLink"
            id="iLink"
            onChange={(e) => onFileSelected(e)}
            className="file-input w-full input-bordered  border-black "
            multiple
            required
          />
        </div>
      )}
      {slots > 0 &&
        quesType === '0' &&
        selectedImages.length > 0 &&
        selectedImages.map((image, id) => (
          <div key={id} className="grid grid-cols-1 my-8 ">
            <div className="w-full px-2 py-2 lg:px-8 border border-color-one bg-white rounded-lg ">
              <label className="text-[32px] font-bold">
                Question: {id + 1}
              </label>
              <div className="flex justify-center items-center my-6">
                <img src={image} alt="question" />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-10">
                <div className="my-4 px-4 lg:my-0">
                  <label
                    htmlFor=""
                    className="label font-semibold text-[16px] "
                  >
                    Number of Options
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className="input  input-bordered border-black font-extrabold w-full h-9"
                    name="num_of_options"
                    id="num_of_options"
                    value={singleExam.numberOfOptions}
                    onChange={(e) => {}}
                    disable
                    required
                  />
                </div>
                <div>
                  <label className="label font-semibold text-[16px] ">
                    Correct Option
                  </label>
                  <select
                    name="type"
                    id="type"
                    className="input border-black input-bordered w-full h-5 "
                    onChange={(e) =>
                      addBulkCorrectOption(parseInt(e.target.value), id)
                    }
                    required
                  >
                    <option value={-1}>---</option>
                    {[...Array(singleExam.numberOfOptions).keys()].map((id) => (
                      <option key={id} value={id}>
                        {optionName[id]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        ))}

      {slots > 0 &&
        quesType === '1' &&
        [...Array(slots
          ).keys()].map(
          (id) =>
            !isLoading && (
              <div key={id} className={`grid grid-cols-1 my-2  ${enabler[id]===0 && 'pointer-events-none bg-color-five'}`}>
                <div className="w-full px-2 py-2 lg:px-8 border border-color-one bg-white rounded-lg ">
                  <label className="text-[32px] font-bold">
                    Question: {id + 1}
                  </label>
                  {
                    enabler[id]===1? <>
                    <div className="flex justify-start items-center my-6">
                    <textarea
                      className="textarea textarea-info text-2xl font-bold border-black"
                      name={`ques${id}`}
                      id={`ques${id}`}
                      cols={400}
                      rows={5}
                      // enterKey={(e)=>addData(id)}
                      placeholder="Description"
                    ></textarea>
                    <button className="btn btn-lg" onClick={(e) => addData(id)}>
                      Check
                    </button>
                  </div>
                  <hr />
                  <div className="text-2xl font-bold">
                    {previewData && previewData!== '' && (
                      <>
                        <Latex>{previewData}</Latex>
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
                            <>
                            <div key={idx} className='my-2'>
                              <div>
                                <label htmlFor="" className="text-lg">
                                  {optionName[idx] + ')'}
                                </label>
                                <input
                                  type="text"
                                  placeholder={`Option ${idx + 1}`}
                                  name={`option${idx}`}
                                  id={`option${idx}`}
                                  className="input w-full text-2xl font-bold input-bordered border-black "
                                  required
                                />
                              </div>
                              <button
                                className="btn mt-2"
                                onClick={()=>addOptionValue(id, idx)}
                              >
                                {' '}
                                Check {optionName[idx]}
                              </button>
                            </div>
                            {previewData && previewData!== '' && (
                              <>
                                <Latex>{previewData}</Latex>
                              </>
                            )}
                            </>
                            
                           
                          )
                        }
                      )}
                  </div>
                  <div className="flex justify-start items-center">
                    <label className="label font-semibold text-[16px] ">
                      Correct Option
                    </label>
                    <select
                      name="type"
                      id="type"
                      className="input border-black input-bordered w-full h-5 "
                      onChange={(e) =>
                        changCorrectOption(parseInt(e.target.value), id)
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
                  <div className="flex justify-center items-center">
                    <button
                      id="addButton"
                      onClick={() => addDetails(id)}
                      className={`btn btn-warning rounded-tr-none rounded-bl-none hover:bg-orange-400 h-12`}
                    >
                      {' '}
                      Add{' '}
                    </button>
                  </div>
                    </>
                    :
                    <p className='text-2xl text-success font-bold'>Question Added Successfully</p>
                  }
                </div>
              </div>
            )
        )}

      {slots > 1 && quesType==="0" && disabler === false && (
        <button
          id="addButton"
          onClick={addAllQuestions}
          className={`btn btn-warning btn-sm rounded-tr-none rounded-bl-none hover:bg-orange-400 h-12`}
        >
          {' '}
          Add All Questions
        </button>
      )}
    </div>
  )
}

export default AddBundleQuestionBoth


// const AddBunduestionBoth = () => {
  
//   {const [courses, setCourses] = useState([])
//   const [subjects, setSubjects] = useState([])
//   const [exams, setExams] = useState([])
//   const [selectedCourse, setSelectedCourse] = useState('')
//   const [selectedSubject, setSelectedSubject] = useState('')
//   const [selectedExam, setSelectedExam] = useState('')
//   const [isLoading, setIsLoading] = useState(false)
//   const [singleExam, setSingleExam] = useState({})
//   const [selectedSet, setSelectedSet] = useState(-1)
//   const [slots, setSlots] = useState(0)
//   const [selectedImages, setSelectedIMages] = useState([])
//   const [uploadImages,setUploadImages] = useState([]);
//   const [correctOptions, setCorrectOptions] = useState([])
//   const [disabler,setDisabler] = useState(false);}

//   const handleChangeCourse = (e) => {
//     setSelectedSubject('')
//     setSlots(0)
//     setSubjects([])
//     setExams('')
//     setExams([])
//     setSelectedCourse(e.target.value)
//   }

//   const handleChangeSubject = (e) => {
//     setSelectedSubject(e.target.value)
//     setSelectedExam('')
//     setExams([])
//     setSlots(0);
//   }

//   const handleChangeExam = (e) => {
//     setSelectedExam('')
//     setSlots(-1)
//     if (e.target.value !== '') {
//       axios
//         .get(`/api/both/getbothexambyid?examId=${e.target.value}`)
//         .then(({ data }) => {
//           setSingleExam(data)
//           setSelectedExam(e.target.value)
//         })
//         .catch((e) => console.log(e))
//     } else {
//       setSelectedExam('')
//       setSingleExam({})
//     }
//   }

//   const handleChangeSet = (setName) => {
//     setSelectedSet(parseInt(setName))
//     axios
//       .get(
//         `/api/both/slotAvailable?examId=${selectedExam}&setName=${parseInt(
//           setName
//         )}`
//       )
//       .then(({ data }) => {
//         setSlots(data.slots)
//         let arrayFiller = [];
//         for( let i = 0 ; i<data.slots; i++ ){
//             arrayFiller[i] = -1;
//         }
//         setCorrectOptions(arrayFiller)
//       }).catch(e=>{
//         setSlots(0);
//       })
//   }

//   async function onFileSelected(e) {
//     console.log()
//     const imgList = []
//     const savImg = [];
//     if(e.target.files.length<=slots){
//         for (let i = 0; i < e.target.files.length; i++) {
//             imgList.push(URL.createObjectURL(e.target.files[i]))
//             savImg[i] = e.target.files[i];
//           }    
//           setUploadImages(savImg)
//           setSelectedIMages(imgList)
//     }else{
//         toast.error(`You can maximum select ${slots} `)
//     }
//   }

//   const addBulkCorrectOption = (ca,id) =>{
//     setIsLoading(true);
//     const correctAnswerList = correctOptions;
//     correctAnswerList[id] = ca ;
//     console.log(correctAnswerList);
//     setCorrectOptions(correctAnswerList);
//   }
//   const addAllQuestions = async()=>{
//     // document.getElementById("addButton").disabled =true;
//     // setDisabler(true)
//     const curQtype = 0;
//     let questionText = ''
//     let options = []
//     setIsLoading(true)
    
//     let questionLink = ''
//     const explanationILink = null;
//     const iImages = uploadImages;
//     for(let i = 0 ; i<iImages.length ;i++ ){
//         console.log(iImages[i]);
//         const optAnswer = correctOptions[i];
//         const formdata = new FormData()
//         questionLink =iImages[i];
//         formdata.append('iLink', questionLink)
//         formdata.append('explanationILink', explanationILink)
    
//         formdata.append('questionText', questionText)
//         formdata.append('type', curQtype)
//         formdata.append('options', JSON.stringify(options))
//         formdata.append('optionCount', singleExam.numberOfOptions)
//         formdata.append('correctOption', parseInt(optAnswer))
//         formdata.append('status', true)
//         formdata.append('examId', selectedExam)
//         formdata.append('setName', selectedSet)
        
    
//         await axios
//           .post(`/api/both/bothaddquestionmcq?examId=${selectedExam}`, formdata, {
//             headers: {
//               'Content-Type': 'multipart/ form-data',
//             },
//           })
//           .then((data) => {
//             if(i+1===uploadImages.length){
//                 toast.success('successfully added all the questions')
//                 setUploadImages([]);
//                 setSelectedExam([]);
//                 setSlots(-1);
//                 setIsLoading(false);
//                 window.location.reload(false);
//             }
//             // toast.success("Uploaded")
//           })
//           .catch((e) =>{
//             toast.error(e.response.data);
//           })
//     }
  

//   }
  
  // useEffect(() => {
  //   setIsLoading(true)
  //   axios.get('/api/course/getallcourseadmin').then(({ data }) => {
  //     setCourses(data.courses)
  //     setIsLoading(false)
  //   })
  //   if (selectedCourse !== '') {
  //     axios
  //       .get(`/api/subject/getsubjectbycourse?courseId=${selectedCourse}`)
  //       .then(({ data }) => {
  //         setSubjects(data.data)
  //         setIsLoading(false)
  //       })
  //       .catch((e) => console.log(e))
  //   } else {
  //     setSubjects([])
  //   }
  //   if (selectedSubject !== '') {
  //       axios
  //       .get(`/api/both/getbothexambysubject?subjectId=${selectedSubject}`)
  //       .then(({ data }) => {
  //         setExams(data.examPage.exam);
  //         if (data.examPage.exam.length === 0) {
  //           toast.error("No Data");
  //         }
  //         setIsLoading(false);
  //       })
  //       .catch((e) =>{
  //         toast.error(e.response.data)
  //         setExams([]);
  //       });
  //   } else {
  //     setExams([])
  //   }
  // }, [selectedCourse, selectedSubject])
//   return (
//     <div className="px-8 mb-40">
//     {isLoading && <Loader/>}
//       <div className="bg-white py-4 px-2 my-3 ">
//         <div
//           className={` w-full  mx-auto grid grid-cols-1 lg:${
//             singleExam?.numberOfSet > 0 ? 'grid-cols-4' : 'grid-cols-3 '
//           } gap-4`}
//         >
//           <div className="form-control">
//             <label className="label-text text-center" htmlFor="">
//               Select Course
//             </label>
//             <select
//               name="course_list"
//               id="course_list"
//               className="input w-full border-black input-bordered"
//               required
//               onChange={(e) => handleChangeCourse(e)}
//             >
//               <option value=""></option>
//               {courses.length > 0 &&
//                 courses.map((course) => (
//                   <option
//                     className="text-center"
//                     key={course._id}
//                     value={course._id}
//                   >
//                     {course.name}
//                   </option>
//                 ))}
//             </select>
//           </div>
//           <div className="form-control">
//             <label className="label-text text-center" htmlFor="">
//               Select Subject
//             </label>
//             <select
//               name="course_list"
//               id="course_list"
//               className="input w-full border-black input-bordered"
//               required
//               onChange={(e) => handleChangeSubject(e)}
//             >
//               <option value=""></option>
//               {subjects?.length > 0 &&
//                 subjects.map((subject) => (
//                   <option
//                     className="text-center"
//                     key={subject._id}
//                     value={subject._id}
//                   >
//                     {subject.name}
//                   </option>
//                 ))}
//             </select>
//           </div>
//           <div className="form-control">
//             <label className="label-text text-center" htmlFor="">
//               Select Exam Name
//             </label>
//             <select
//               name="exam_list"
//               id="exam_list"
//               className="input w-full border-black input-bordered"
//               required
//               onChange={(e) => handleChangeExam(e)}
//             >
//               <option value=""></option>
//               {exams.length > 0 &&
//                 exams.map((exam) => (
//                   <option
//                     className="text-center"
//                     key={exam._id}
//                     value={exam._id}
//                   >
//                     {exam.name}
//                   </option>
//                 ))}
//             </select>
//           </div>
//           {singleExam?.numberOfSet > 0 && selectedExam !== '' && (
//             <div className="form-control">
//               <label className="label-text text-center" htmlFor="">
//                 Select Set Name
//               </label>
//               <select
//                 name="set_name"
//                 id="set_name"
//                 className="input w-full border-black input-bordered"
//                 required
//                 onChange={(e) => handleChangeSet(parseInt(e.target.value))}
//               >
//                 <option value={-1}></option>
//                 {[...Array(singleExam?.numberOfSet).keys()].map((id) => (
//                   <option key={id} value={id}>
//                     {optionName[id]}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           )}
//         </div>
//       </div>
//       {isLoading && <Loader />}
//       {
//         selectedExam!=='' && slots===0 && <div className='flex justify-center items-center border-4 rounded-lg bg-white border-color-one py-8 px-4 my-10 mx-8'>
//           <p className='text-[32px] font-extrabold text-success'>You have already added the questions for this set!</p>
//         </div>
//       }
//       {
//         slots===1 && <div className='flex justify-center items-center border-4 rounded-lg bg-white border-color-one py-8 px-4 my-10 mx-8'>
//         <p className='text-[32px] font-extrabold text-success'>Only 1 Question to be added! Add question from Menu's show both exam section</p>
//       </div>
//       }
//       {slots > 1 && (
//         <div className='my-5'>
//           <label htmlFor="" className=" label">
//             <span className="label-text">Select Multiple Question Image </span>
//           </label>
//           <input
//             type="file"
//             name="iLink"
//             id="iLink"
//             onChange={(e) => onFileSelected(e)}
//             className="file-input w-full input-bordered  border-black "
//             multiple
//             required
//           />
//         </div>
//       )}
//       {slots>0 && selectedImages.length > 0 &&
//         selectedImages.map((image, id) =>(
//           <div key={id} className="grid grid-cols-1 my-8 ">
//             <div className="w-full px-2 py-2 lg:px-8 border border-color-one bg-white rounded-lg ">
//               <label className="text-[32px] font-bold">
//                 Question: {id + 1}
//               </label>
//               <div className="flex justify-center items-center my-6">
//                 <img src={image} alt="question" />
//               </div>
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-10">
//                 <div className="my-4 px-4 lg:my-0">
//                   <label htmlFor="" className="label font-semibold text-[16px] ">
//                     Number of Options
//                   </label>
//                   <input
//                     type="number"  step="0.01"
//                     className="input  input-bordered border-black font-extrabold w-full h-9"
//                     name="num_of_options"
//                     id="num_of_options"
//                     value={singleExam.numberOfOptions}
//                     onChange={(e)=>{}}
//                     disable
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="label font-semibold text-[16px] ">Correct Option</label>
//                   <select
//                     name="type"
//                     id="type"
//                     className="input border-black input-bordered w-full h-5 "
//                     onChange={(e) => addBulkCorrectOption(parseInt(e.target.value),id)}
//                     required
//                   >
//                     <option value={-1}>---</option>
//                     {[...Array(singleExam.numberOfOptions).keys()].map((id) => (
//                       <option key={id} value={id}>
//                         {optionName[id]}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}

//         {slots>1 && disabler===false && <button
//         id='addButton'
//         onClick={addAllQuestions}
//         className={`btn btn-warning btn-sm rounded-tr-none rounded-bl-none hover:bg-orange-400 h-12`}> Add All Questions</button>}
//     </div>
//   )
// }

// export default AddBundleQuestionBoth
