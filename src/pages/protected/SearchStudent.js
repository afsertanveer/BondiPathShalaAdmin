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
          axios.get(`/apistudent/getstudentregsearch?regNo=${searched}`).then(({data})=>{
            setIsLoading(false)
            setStudents(data);
            flag = 1;
          }).catch(e=>console.log(e))
        }
        if(selectedOption==="2"){
          axios.get(`/apistudent/getstudentnamesearch?name=${searched}`).then(({data})=>{
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
        axios.get(`/apistudent/getstudentmobilesearch?mobileNo=${searched}`).then(({data})=>{
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
        <form  className="flex flex-col-reverse lg:flex-row md:flex-row justify-center items-center bg-white w-full lg:w-1/2" >
          <div className=" flex items-center justify-center py-3">
            <label className="label-text font-semibold mt-3" htmlFor="">
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
          <div className="flex items-center justify-center">
            <label className="label-text font-semibold" htmlFor="">
              Option
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
        <div className='overflow-x-auto w-full'>
        <table className='mx-auto   w-full whitespace-nowrap rounded-lg bg-white divide-y  overflow-hidden'>
            <thead>
              <tr>
                <th className="bg-white font-semibold text-sm uppercase px-6 py-4"> Name</th>
                <th className="bg-white font-semibold text-sm uppercase px-6 py-4">Registration Number</th>
                <th className="bg-white font-semibold text-sm uppercase px-6 py-4">Mobile Number</th>
                <th className="bg-white font-semibold text-sm uppercase px-6 py-4">Institution</th>
                <th className="bg-white font-semibold text-sm uppercase px-6 py-4">SSC Roll</th>
                <th className="bg-white font-semibold text-sm uppercase px-6 py-4">HSC Roll</th>
                <th className="bg-white font-semibold text-sm uppercase px-6 py-4">Action</th>
              </tr>
            </thead>
                <tbody>
              {students.length > 0 &&
                students.map((student) => (
                  <tr key={student._id} className="even:bg-table-row-even odd:bg-table-row-odd text-center">
                    <td className="px-6 py-4 text-center">{student.name}</td>
                    <td className="px-6 py-4 text-center">{student.regNo}</td>
                    <td className="px-6 py-4 text-center">{student.mobileNo}</td>
                    <td className="px-6 py-4 text-center">{student.institution===null? "N/A" : student.institution }</td>
                    <td className="px-6 py-4 text-center">{student.hscRoll===null? "N/A" :student.hscRoll}</td>
                    <td className="px-6 py-4 text-center">{student.sscRoll===null? "N/A" :student.sscRoll }</td>
                    <td className="px-6 py-4 text-center">
                      <Link
                        to={`/dashboard/students/${student._id}/history`}  target="_blank"
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
