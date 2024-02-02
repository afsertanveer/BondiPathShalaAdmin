import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import axios from "../../utils/axios";
import Loader from "./../../Shared/Loader";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import Pagination from "../../components/common/Pagination";

const ViewScriptSpecial = () => {
  const [courses, setCourses] = useState([]);
  const [exams, setExams] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedExam, setSelectedExam] = useState("");
  const [writtenData, setWrittenData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagiNationData, setPagiNationData] = useState({});
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user.role;
  const handleChangeCourse = (e) => {
    setSelectedSubject("");
    setExams("");
    setExams([]);
    setSelectedCourse(e.target.value);
  };

  const handlePageClick = (event) => {
    let clickedPage = parseInt(event.selected) + 1;
    let url;
    if (role === 3) {
      url = "/api/special/getstudentdata";
    } else {
      url = `/api/special/getstudentdataadmin`;
    }
    if (event.selected > 0) {
      axios
        .get(`${url}?examId=${selectedExam}&page=${clickedPage}`)
        .then(({ data }) => {
          setWrittenData(data.data1);
          setPagiNationData(data.paginateData);
        })
        .catch((e) => {
          console.log(e);
          setPagiNationData({});
          setWrittenData([]);
          toast.error(e.response.data);
        });
    } else {
      axios
        .get(`${url}?examId=${selectedExam}&page=${1}`)
        .then(({ data }) => {
          setWrittenData(data.data1);
          setPagiNationData(data.paginateData);
        })
        .catch((e) => {
          console.log(e);
          setPagiNationData({});
          setWrittenData([]);
          toast.error(e.response.data);
        });
    }
  };

  useEffect(() => {
    setIsLoading(true);
    axios.get("/api/course/getallcourseadmin").then(({ data }) => {
      setCourses(data.courses);
      setIsLoading(false);
    });
    if (selectedCourse !== "") {
      axios
        .get(`/api/special/showspecialexambycourse?courseId=${selectedCourse}`)
        .then(({ data }) => {
          setExams(data);
          if (data.length === 0) {
            toast.error("No Data");
          }
          setIsLoading(false);
        })
        .catch((e) => toast.error(e.response.data));
    } else {
      setExams([]);
    }

    if (selectedExam !== "") {
      if (role === 3) {
        axios
          .get(`/api/special/getstudentdata?examId=${selectedExam}`)
          .then(({ data }) => {
            setWrittenData(data.data1);
            setPagiNationData(data.paginateData);
            setIsLoading(false);
          })
          .catch((e) => {
            setWrittenData([]);
            setPagiNationData({});
            toast.error(e.response.data);
          });
      } else {
        axios
          .get(`/api/special/getstudentdataadmin?examId=${selectedExam}`)
          .then(({ data }) => {
            console.log(data);
            setWrittenData(data.data1);
            setPagiNationData(data.paginateData);
            setIsLoading(false);
          })
          .catch((e) => {
            setWrittenData([]);
            setPagiNationData({});
            toast.error(e.response.data);
          });
      }
    }
  }, [selectedCourse, selectedSubject, selectedExam, role]);
  return (
    <div className="mx-auto">
      <div className="bg-white py-4 px-2 my-3 ">
        <div className="w-full  mx-auto grid grid-cols-1 lg:grid-cols-2 gap-4">
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
                  <option className="text-center" key={course._id} value={course._id}>
                    {course.name}
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
              onChange={(e) => setSelectedExam(e.target.value)}
            >
              <option value=""></option>
              {exams.length > 0 &&
                exams.map((exam) => (
                  <option className="text-center" key={exam._id} value={exam._id}>
                    {exam.name}
                  </option>
                ))}
            </select>
          </div>
        </div>
      </div>
      {isLoading && <Loader></Loader>}
      {writtenData.length > 0 && (
        <div className="overflow-x-auto w-full">
          <table className="mx-auto w-full whitespace-nowrap rounded-lg  divide-y  overflow-hidden">
            <thead>
              <tr>
                <th className="bg-white font-semibold text-sm uppercase px-6 py-4">
                  SI No.
                </th>
                <th className="bg-white font-semibold text-sm uppercase px-6 py-4">
                  Student Name
                </th>
                {role === 3 && (
                  <th className="bg-white font-semibold text-sm uppercase px-6 py-4">
                    Total Marks
                  </th>
                )}
                {role === 3 && (
                  <th className="bg-white font-semibold text-sm uppercase px-6 py-4">
                    Total Questions
                  </th>
                )}
                <th className="bg-white font-semibold text-sm uppercase px-6 py-4">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {writtenData.length > 0 &&
                writtenData.map((wd, idx) => {
                  return (
                    <tr key={idx} className="bg-white">
                      <td>{idx + 1}</td>
                      <td>{wd.studentName}</td>
                      {role === 3 && <td>{wd.totalMarks}</td>}
                      {role === 3 && <td>{wd.totalQuestions}</td>}
                      <td>
                        {role === 3 && (
                          <Link
                            to={`/dashboard/${selectedExam}/checkanswerspecial/${wd.studentId}`}
                            className="text-red font-bold mr-2"
                          >
                            Check{" "}
                          </Link>
                        )}
                        {role !== 3 && (
                          <>
                            {wd.subject1.status === true ? (
                              <span className="mr-2 font-semibold text-color-eleven">
                                {wd.subject1.name}
                              </span>
                            ) : (
                              <span className="mr-2 font-semibold text-red">
                                {wd.subject1.name}
                              </span>
                            )}
                            {wd.subject2.status === true ? (
                              <span className="mr-2 font-semibold text-color-eleven">
                                {wd.subject2.name}
                              </span>
                            ) : (
                              <span className="mr-2 font-semibold text-red">
                                {wd.subject2.name}
                              </span>
                            )}
                            {wd.subject3.status === true ? (
                              <span className="mr-2 font-semibold text-color-eleven">
                                {wd.subject3.name}
                              </span>
                            ) : (
                              <span className="mr-2 font-semibold text-red">
                                {wd.subject3.name}
                              </span>
                            )}
                            {wd.subject4.status === true ? (
                              <span className="mr-2 font-semibold text-color-eleven">
                                {wd.subject4.name}
                              </span>
                            ) : (
                              <span className="mr-2 font-semibold text-red">
                                {wd.subject4.name}
                              </span>
                            )}
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      )}
      <div className="mb-6">
        {pagiNationData.totalPages > 1 && (
          <Pagination
            pageCount={pagiNationData.totalPages}
            currentPage={pagiNationData.currentPage}
            handlePageClick={(e) => handlePageClick(e)}
          />
        )}
      </div>
    </div>
  );
};

export default ViewScriptSpecial;
