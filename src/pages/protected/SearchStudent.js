import React, { useEffect, useState } from "react";
import axios from "../../utils/axios";
import Loader from "../../Shared/Loader";
import { Link } from "react-router-dom";

const SearchStudent = () => {
    const [selectedOption,setSelectedOption] = useState("0");
    const [isLoading,setIsLoading] = useState(false);
    const [students,setStudents] = useState([]);

    const handleOptionChange = e=>{
      setSelectedOption(e.target.value);
      setStudents([]);
      document.getElementById("rgn_number").value = "";

    }
  const handleSearch = e => {
    const searched =e.target.value;

    if(searched.length>2 ){
      let flag =0;      
      setIsLoading(true);
        if(selectedOption==="1"){
          axios.get(`api/student/getstudentregsearch?regNo=${searched}`).then(({data})=>{
            setIsLoading(false)
            setStudents(data);
            flag = 1;
          }).catch(e=>console.log(e))
        }
        if(selectedOption==="2"){
          axios.get(`api/student/getstudentnamesearch?name=${searched}`).then(({data})=>{
            setIsLoading(false)
            setStudents(data);
            flag = 1;
          }).catch(e=>console.log(e))
        } 
        if(flag===0){
          setStudents([])
        }
        setIsLoading(false)      
    }
    if(searched.length>4){
      if(selectedOption==="3"){
        axios.get(`api/student/getstudentmobilesearch?mobileNo=${searched}`).then(({data})=>{
          setIsLoading(false)
          setStudents(data);
        }).catch(e=>console.log(e))
      } 
    }
  };
  
  useEffect(()=>{
    if(selectedOption!=="0"){
        document.getElementById("rgn_number").disabled = false;
        document.getElementById("rgn_number").placeholder = "please type";
    }else{
        document.getElementById("rgn_number").disabled = true;
        document.getElementById("rgn_number").placeholder = "Select Option First";
    }
  })

  return (
    <div>
      <div className="flex justify-center items-center mb-10" >
        <form  className="flex flex-row justify-center items-center bg-white w-1/2" >
          <div className=" flex items-center ">
            <label className="label-text font-semibold ml-3" htmlFor="">
              Search
            </label>
            <input
              name="rgn_number"
              id="rgn_number"
              className="input w-2/3 border-black input-bordered mx-3 font-bold"
              placeholder="please type"
              disabled
              onChange={handleSearch}
              required
            />
          </div>
          <div className="flex items-center">
            <label className="label-text" htmlFor="">
              Select Option
            </label>
            <select
              name="opt"
              id="opt"
              className="input border-black input-bordered my-5 ml-4"
              onChange={e=>handleOptionChange(e)}
              required
            >
              <option value="0"></option>
              <option value="1">Register Number</option>
              <option value="2">Name</option>
              <option value="3">Mobile Number</option>
            </select>
          </div>
        </form>
      </div>
      {isLoading && <Loader></Loader>}
      {students?.length > 0 && (
        <div className="overflow-x-auto">
          <table className="table w-full compact customTable">
            <thead>
              <tr>
                <th className="bg-white">Subject Name</th>
                <th className="bg-white">Registration Number</th>
                <th className="bg-white">Mobile Number</th>
                <th className="bg-white">Action</th>
              </tr>
            </thead>
            <tbody>
              {students.length > 0 &&
                students.map((student) => (
                  <tr key={student._id}>
                    <td>{student.name}</td>
                    <td>{student.regNo}</td>
                    <td>{student.mobileNo}</td>
                    <td>
                      <Link
                        to={`/dashboard/students/${student._id}/history`}
                        className="btn bg-button text-white"
                      >
                        Exam History
                      </Link>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SearchStudent;
