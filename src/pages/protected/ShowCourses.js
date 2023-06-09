import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import axios from "../../utils/axios";
import Loader from "./../../Shared/Loader";
import { toast } from "react-hot-toast";

const ShowCourses = () => {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [singleCourse, setSingleCourse] = useState({});
  const [currentPage,setCurrentPage] = useState(1);
  const [pagiNationData,setPagiNationData] = useState({});

  const handleSearch = e =>{
    const courseName = e.target.value;
    if(courseName.length>2){      
      setIsLoading(true);
      axios.get(`api/course/getallcoursesearch?courseName=${courseName}`).then(({data})=>{
        setCourses(data.courses);
        setPagiNationData({});
        setIsLoading(false);
      }).catch(e=>{
        console.log(e);
        setPagiNationData({});
        setCourses([]);
      })
    }
  }

  const updateCourse = (id) => {
    console.log(id);
    axios
      .get(`api/course/getcourse?courseId=${id}`)
      .then(({ data }) => {
        console.log(data);
        setSingleCourse(data);
      })
      .catch((e) => console.log(e));
  };
  const deactiveCourse = (id) => {

    axios.put(`api/course/deactivatecourse?id=${id}`).then(({ data }) => {
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
        axios.put(`api/course/updatesingle?id=${id}`,updateCourse).then(({ data }) => {
            toast.success("Course Update Successful");
            window.location.reload(false);
          }).catch(e=>console.log(e))
    }
    document.getElementById('my-modal').checked = false;
  }
  useEffect(() => {
    setIsLoading(true);
    axios.get("api/course/getallcourse?status=true&page="+currentPage).then(({ data }) => {
      setCourses(data.courses);
      setPagiNationData(data.paginateData);
      setIsLoading(false);
    }).catch(e=>{
      console.log(e);
      setPagiNationData({});
      setCourses({});
    })
  }, [currentPage]);
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
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th className="bg-white">Course Name</th>
              <th className="bg-white">Description</th>
              <th className="bg-white">Created Date</th>
              <th className="bg-white">Action</th>
            </tr>
          </thead>
          <tbody>
            {courses?.length > 0 &&
              courses.map((course) => (
                <tr key={course._id}>
                  <td>{course.name}</td>
                  <td>{course.descr}</td>
                  <td>{course.createdAt.split("T")[0]}</td>
                  <td>
                    <label
                      onClick={() => updateCourse(course._id)}
                      htmlFor="my-modal"
                      className="btn bg-button hover:bg-gradient-to-r from-[#616161] from-0% to=[#353535] to-100% mr-2 text-white"
                    >
                      Update
                    </label>
                    <button
                      onClick={(e) => deactiveCourse(course._id)}
                      className="btn"
                    >
                      Deactive
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center items-center mt-4 ">
        <div className="flex justify-center w-full px-4 lg:px-16">
          {pagiNationData?.totalPages > 1 &&
            [...Array(pagiNationData.totalPages).keys()].map((i) => {
              return (
                <button
                  key={i}
                  className="bg-button px-4 py-2 mr-2"
                  onClick={(e) => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              );
            })}
        </div>
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
    </div>
  );
};

export default ShowCourses;
