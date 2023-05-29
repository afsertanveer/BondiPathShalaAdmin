import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import axios from "../../utils/axios";
import Loader from "./../../Shared/Loader";
import { toast } from "react-hot-toast";

const ShowSubjects = () => {
  const [courses, setCourses] = useState([]);
  const [subjects,setSubjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [singleCourse, setSingleCourse] = useState("");
  const [singleSubject,setSingleSubject] = useState({});

  const updateSubject = (id) => {
    console.log(id);
    axios
      .get(`api/subject/getsubjectbyid?subjectId=${id}`)
      .then(({ data }) => {
        console.log(data);
        setSingleSubject(data);
      })
      .catch((e) => console.log(e));
  };
  

  const handleUpdate = async(e) =>{
    e.preventDefault();
    const form = e.target;
    const courseId = form.courseId.value;
    const subjectId = form.subjectId.value;
    const name = form.name.value;
    const descr = form.description.value;
    const iLink = form.image_path.value;
    const updatedSubject = {
      name,descr,iLink,courseId,subjectId
    }
    console.log(updatedSubject);

    await axios.put("api/subject/updatesubject",{name,descr,iLink,courseId,subjectId}).then(({data})=>{
      toast.success(data);
      form.reset();
      window.location.reload(false);
    }).catch(e=>toast.error(e.response.data))
    form.reset();
    document.getElementById('my-modal').checked = false;
  }
  const removeSubject = async(subjectId)=>{
    console.log(subjectId);
    await axios.put('api/subject/deactivatesubject',{subjectId}).then(({data})=>{
      toast.success("Subject Deactivated");
    })
  }
  useEffect(() => {
    setIsLoading(true);
    axios.get("api/course/getallcourse?status=true").then(({ data }) => {
      setCourses(data.courses);
      setIsLoading(false);
    });
    if(singleCourse!==""){
      axios.get(`api/subject/getsubjectbycourse?courseId=${singleCourse}`).then(({data})=>{
        setSubjects(data);
        setIsLoading(false);
    })  
    }else{
      setSubjects([]);
    }

}, [singleCourse]);
  return (
    <div className="">
      <div className=" py-4 px-2 my-3">
        <label className="label-text" htmlFor="">Select Course</label>
        <select
                name="course_list"
                id="course_list"
                className="input border-black input-bordered my-5"
                required
                onChange={e=>setSingleCourse(e.target.value)}
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
      {isLoading && <Loader></Loader>}
      {
        subjects.length>0 && <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th className="bg-white">Subject Name</th>
              <th className="bg-white">Action</th>
            </tr>
          </thead>
          <tbody>
            {subjects.length > 0 &&
              subjects.map((subject) => (
                <tr key={subject._id}>
                  <td>{subject.name}</td>
                  <td>
                    <label
                      onClick={() => updateSubject(subject._id)}
                      htmlFor="my-modal"
                      className="btn bg-button hover:bg-gradient-to-r from-[#616161] from-0% to=[#353535] to-100% mr-2 text-white"
                    >
                      Update
                    </label>
                    <button className="btn" onClick={()=>removeSubject(subject._id)}>Deactivate</button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      }
      <input type="checkbox" id="my-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg text-center">Update Subject</h3>
          <form onSubmit={e=>handleUpdate(e)}>
          <input type="text" name="subjectId" id="subjectId" defaultValue={singleSubject._id} className="hidden" />
          <input type="text" name="courseId" id="courseId" defaultValue={singleSubject.courseId} className="hidden" />
            <div className="form-control">
              <label htmlFor="" className=" label">
                <span className="label-text"> Name </span>
              </label>
              <input
                className="input input-bordered  border-black"
                type="text"
                name="name"
                id="course"
                placeholder="Course Name"
                defaultValue={singleSubject.name}
              />
            </div>
            <div className="form-control">
              <label htmlFor="" className=" label">
                <span className="label-text">Description </span>
              </label>
              <textarea
                className="textarea textarea-info  border-black"
                name="description"
                id="description"
                placeholder="Description"
                defaultValue={singleSubject.descr}
              ></textarea>
            </div>
            <div className="form-control">
              <input
                type="text"
                name="image_path"
                className="file-input mb-5 input input-bordered border-black pl-0"
                defaultValue={singleSubject.iLink}
                hidden
              />
            </div>
            
            <div className="form-control mt-6">
              <input type="submit" value="Update" className="btn " />
            </div>
          </form>
          <div className="modal-action">
            <label htmlFor="my-modal" className="btn bg-[red]">
              Close!
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowSubjects;
