import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import axios from "../../utils/axios";
import Loader from "./../../Shared/Loader";
import { toast } from "react-hot-toast";
import DeactivateButton from "../../features/common/components/DeactivateButton";
import PopUpModal from "../../features/common/components/PopUpModal";

const ShowCourses = () => {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [singleCourse, setSingleCourse] = useState({});
  const [singleCourseId,setSingleCourseId] = useState("");

  const handleSearch = e =>{
    const courseName = e.target.value;
    if(courseName.length>2){      
      setIsLoading(true);
      axios.get(`/api/course/getallcoursesearch?courseName=${courseName}`).then(({data})=>{
        setCourses(data.courses);
        setIsLoading(false);
      }).catch(e=>{
        console.log(e);
        setCourses([]);
      })
    }
    if(courseName.length===0){
      axios.get("/api/course/getallcourseadmin").then(({ data }) => {
        setCourses(data.courses);
        setIsLoading(false);
      }).catch(e=>{
        console.log(e);
        setCourses({});
      })
    }
  }

  const updateCourse = (id) => {
    console.log(id);
    axios
      .get(`/api/course/getcourse?courseId=${id}`)
      .then(({ data }) => {
        console.log(data);
        setSingleCourse(data);
      })
      .catch((e) => console.log(e));
  };
  const deactiveCourse = (id) => {
    axios.put(`/api/course/deactivatecourse?id=${id}`).then(({ data }) => {
      toast.success("Course Deactivation Successful");
      window.location.reload(false);
    }).catch(e=>console.log(e))
  };
  const handleUpdate = e =>{
    e.preventDefault();
    const form = e.target;
    const id = form.courseId.value;
    const name = form.name.value;
    const descr = form.description.value;
    console.log(id,name,descr);
    if(name===singleCourse.name && descr=== singleCourse.descr){
        toast.success("No Changes Made");
    }else{
        const updateCourse ={
            name,descr
        }
        axios.put(`/api/course/updatesingle?id=${id}`,updateCourse).then(({ data }) => {
            toast.success("Course Update Successful");
            window.location.reload(false);
          }).catch(e=>console.log(e))
    }
    document.getElementById('my-modal').checked = false;
  }
  useEffect(() => {
    setIsLoading(true);
    axios.get("/api/course/getallcourseadmin").then(({ data }) => {
      setCourses(data.courses);
      setIsLoading(false);
    }).catch(e=>{
      console.log(e);
      setCourses({});
    })
  }, []);
  return (
    <div className="">
      <div className="flex justify-center items-center mb-10" >
        <form  className="flex flex-row justify-center items-center bg-white w-full lg:w-1/4 py-5" >
          <div className=" flex items-center ">
            <label className="label-text font-semibold ml-3" htmlFor="">
              Search
            </label>
            <input
              name="course_search"
              id="course_search"
              className="input w-2/3 border-black input-bordered mx-3 font-bold"
              placeholder="please type"
              onChange={handleSearch}
              required
            />
          </div>
        </form>
      </div>
      <div className=" py-4 px-2 my-3">
        <h1 className="text-3xl text-center py-3  bg-white">
           Courses
        </h1>
      </div>
      {isLoading && <Loader></Loader>}
      <div className='overflow-x-auto w-full'>
            <table className=' mx-auto w-full whitespace-nowrap rounded-lg bg-white divide-y  overflow-hidden'>
          <thead>
            <tr>
              <th className="bg-white font-semibold text-sm uppercase px-6 py-4 ">Course Name</th>
              <th className="bg-white font-semibold text-sm uppercase px-6 py-4 ">Description</th>
              <th className="bg-white font-semibold text-sm uppercase px-6 py-4 ">Created Date</th>
              <th className="bg-white font-semibold text-sm uppercase px-6 py-4 ">Action</th>
            </tr>
          </thead>
          <tbody>
            {courses?.length > 0 &&
              courses.map((course) => (
                <tr key={course._id} className="even:bg-table-row-even odd:bg-table-row-odd text-center ">
                  <td className=" font-semibold text-sm uppercase px-6 py-4">{course.name}</td>
                  <td className=" font-semibold text-sm uppercase px-6 py-4">{course.descr}</td>
                  <td className=" font-semibold text-sm uppercase px-6 py-4">{course.createdAt.split("T")[0]}</td>
                  <td className=" font-semibold text-sm uppercase px-6 py-4">
                    <label
                      onClick={() => updateCourse(course._id)}
                      htmlFor="my-modal"
                      className="btn bg-button hover:bg-gradient-to-r from-[#616161] from-0% to=[#353535] to-100% mr-2 text-white"
                    >
                      Update
                    </label>
                    <DeactivateButton setter={setSingleCourseId} value={course._id}></DeactivateButton>
                   
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <input type="checkbox" id="my-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg text-center">Update Course</h3>
          <form onSubmit={e=>handleUpdate(e)}>
            <input type="text" name="courseId" id="courseId" defaultValue={singleCourse._id} className="hidden" />
            <div className="form-control">
              <label htmlFor="" className=" label">
                <span className="label-text">Course Name </span>
              </label>
              <input
                className="input input-bordered  border-black"
                type="text"
                name="name"
                id="course"
                placeholder="Course Name"
                defaultValue={singleCourse.name}
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
                defaultValue={singleCourse.descr}
              ></textarea>
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
      <PopUpModal remove={deactiveCourse} modalData={singleCourseId} ></PopUpModal>
    </div>
  );
};

export default ShowCourses;
