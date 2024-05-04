import React, { useEffect, useState } from 'react'
import axios from '../../utils/axios'
import { optionName } from '../../utils/globalVariables'
import Loader from '../../Shared/Loader'
import toast from 'react-hot-toast'

const McqSepcialBundleQuestion = () => {
  const [courses, setCourses] = useState([])
  const [subjects, setSubjects] = useState([])
  const [exams, setExams] = useState([])
  const [selectedCourse, setSelectedCourse] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('')
  const [selectedExam, setSelectedExam] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [singleExam, setSingleExam] = useState({})
  const [selectedSet, setSelectedSet] = useState(-1)
  const [slots, setSlots] = useState(-1)
  const [selectedImages, setSelectedIMages] = useState([])
  const [uploadImages,setUploadImages] = useState([]);
  const [correctOptions, setCorrectOptions] = useState([])
  const [disabler,setDisabler] = useState(false);

  const handleChangeCourse = (e) => {
    setSelectedSubject('')
    setSlots(-1)
    setSubjects([])
    setExams('')
    setExams([])
    setSelectedCourse(e.target.value)
  }

  const handleChangeSubject = (e) => {
    setSelectedSubject(e.target.value)
    
  }

 

  const handleChangeSet = (setName) => {
    setSelectedSet(parseInt(setName))
    if((parseInt(setName)!==-1)){
      axios
      .get(
        `/api/mcqspecialexam/slotAvailable?examId=${selectedExam}&setName=${parseInt(
          setName
        )}&subjectId=${selectedSubject}`
      )
      .then(({ data }) => {
        setSlots(data.slots)
        let arrayFiller = [];
        for( let i = 0 ; i<data.slots; i++ ){
            arrayFiller[i] = -1;
        }
        setCorrectOptions(arrayFiller)
      }).catch(e=>{
        setSlots(-1);
      })
    }else{
      setSlots(-1)
    }
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
    const correctAnswerList = correctOptions;
    correctAnswerList[id] = ca ;
    console.log(correctAnswerList);
    setCorrectOptions(correctAnswerList);
  }
  const addAllQuestions = async()=>{
    // document.getElementById("addButton").disabled =true;
    // setDisabler(true)
    setIsLoading(true);
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
        formdata.append('subjectId', selectedSubject)
        
    
        await axios
          .post(`/api/mcqspecialexam/addquestionmcq?examId=${selectedExam}`, formdata, {
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
  
  useEffect(() => {
    setIsLoading(true)
    axios.get('/api/course/getallcourseadmin').then(({ data }) => {
      setCourses(data.courses)
      setIsLoading(false)
    })
    if (selectedCourse !== '') {
        
      axios
      .get(`/api/mcqspecialexam/showmcqspecialexambycourse?courseId=${selectedCourse}`)
      .then(({ data }) => {
        setExams(data);
        if (data.length === 0) {
          toast.error("No Data");
        }
        setIsLoading(false);
      })
      .catch((e) => toast.error(e.response.data));
    } else {
      setSubjects([])
    }
    if(selectedExam!==''){
        axios
        .get(`/api/subject/getsubjectbycourse?courseId=${selectedCourse}`)
        .then(({ data }) => {
          setSubjects(data.data);
          setIsLoading(false);
        }).catch(err=>console.log("subject fetching error"));
    }
    if(selectedSubject!==''){
        axios
        .get(`/api/mcqspecialexam/showspecialexambyid?examId=${selectedExam}`)
        .then(({ data }) => {
          setSingleExam(data);
          
        })
        .catch((e) => console.log(e));
    } else {
      setSingleExam({});
    }
    
  }, [selectedCourse, selectedSubject,selectedExam])
  return (
    <div className="px-8 mb-40">
      {
        isLoading && <Loader/>
      }
      <div className="bg-white py-4 px-2 my-3 ">
        <div
          className={` w-full  mx-auto grid grid-cols-1 lg:${
            singleExam?.numberOfSet > 0 ? 'grid-cols-4' : 'grid-cols-3 '
          } gap-2`}
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
              Select Exam
            </label>
            <select
              name="exams"
              id="exams"
              className="input w-full border-black input-bordered text-center"
              required
              onChange={(e) =>setSelectedExam(e.target.value)}
            >
              <option value="">---Select Exam---</option>
              {
                exams.length>0 && exams.map(exam=><option key={exam._id} value={exam._id}>{exam.name}</option>)
                
                
                }
              
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
      {
         slots===0 && <div className='flex justify-center items-center border-4 rounded-lg bg-white border-color-one py-8 px-4 my-10 mx-8'>
          <p className='text-[32px] font-extrabold text-success'>You have already added the questions for this set!</p>
        </div>
      }
     
      {slots > 0 && (
        <div className='my-5'>
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
      {slots>0 && selectedImages.length > 0 &&
        selectedImages.map((image, id) =>(
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
                  <label htmlFor="" className="label font-semibold text-[16px] ">
                    Number of Options
                  </label>
                  <input
                    type="number"  step="0.01"
                    className="input  input-bordered border-black font-extrabold w-full h-9"
                    name="num_of_options"
                    id="num_of_options"
                    value={singleExam.numberOfOptions}
                    onChange={(e)=>{}}
                    disable
                    required
                  />
                </div>
                <div>
                  <label className="label font-semibold text-[16px] ">Correct Option</label>
                  <select
                    name="type"
                    id="type"
                    className="input border-black input-bordered w-full h-5 "
                    onChange={(e) => addBulkCorrectOption(parseInt(e.target.value),id)}
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

        {slots>1 && disabler===false && <button
        id='addButton'
        onClick={addAllQuestions}
        className={`btn btn-warning btn-sm rounded-tr-none rounded-bl-none hover:bg-orange-400 h-12`}> Add All Questions</button>}
    </div>
  )
}

export default McqSepcialBundleQuestion
