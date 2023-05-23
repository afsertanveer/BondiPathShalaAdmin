import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import axios from "../../utils/axios";
import Loader from "./../../Shared/Loader";

const ShowStudents = () => {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    setIsLoading(true);
    axios.get("api/course/getallcourse?status=true").then(({ data }) => {
      setCourses(data.courses);
      setIsLoading(false);
    });
  }, []);
  return (
    <div className="">
      <div className=" py-4 px-2 my-3">
        <h1 className="text-3xl text-center py-3  bg-white">
          Active Courses :{isLoading === false && courses.length}
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
            </tr>
          </thead>
          <tbody>
            {courses.length > 0 &&
              courses.map((course) => (
                <tr key={course._id}>
                  <td>{course.name}</td>
                  <td>{course.descr}</td>
                  <td>{course.createdAt.split("T")[0]}</td>
                 
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ShowStudents;
