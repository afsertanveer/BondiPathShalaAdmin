import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import axios from "../../utils/axios";
import Loader from "./../../Shared/Loader";
import { toast } from "react-hot-toast";
import DeactivateButton from "../../features/common/components/DeactivateButton";
import PopUpModal from "../../features/common/components/PopUpModal";

const ShowCurriculum = () => {
  const [curriculums, setCurriculums] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [singleCurriculum, setsingleCurriculum] = useState({});
  const [isAdmission, setIsAdmission] = useState(false);
  const [singleCurriculumId,setsingleCurriculumId] = useState("");

 

  const updatecurriculum = (id) => {
    
    axios
      .get(`/api/curriculum/getcurriculumid?id=${id}`)
      .then(({ data }) => {
        setsingleCurriculum(data);
        setIsAdmission(data.isAdmission);
      })
      .catch((e) => toast.error(e.response.data));
  };
  const deactivecurriculum = (id) => {
    axios.post(`/api/curriculum/removecurriculum?id=${singleCurriculumId}`).then(({ data }) => {
      toast.success("curriculum Deactivation Successful");
      window.location.reload(false);
    }).catch(e=>console.log(e))
  };
  const handleUpdate = e =>{
    e.preventDefault();
    const form = e.target;
    const name = form.name.value;
    const updatecurriculum ={
        id:singleCurriculum._id,
        name,isAdmission
    }
    axios.post(`/api/curriculum/updatecurriculum`,updatecurriculum).then(({ data }) => {
        toast.success("curriculum Update Successful");
        window.location.reload(false);
      }).catch(e=>console.log(e))
    document.getElementById('my-modal').checked = false;
  }
  useEffect(() => {
    setIsLoading(true);
    axios.get("/api/curriculum/getcurriculums").then(({ data }) => {
      setCurriculums(data);
      setIsLoading(false);
    }).catch(e=>{
      console.log(e);
      setCurriculums([]);
    })
  }, []);
  return (
    <div className="">
      <div className=" py-4 px-2 my-3">
        <h1 className="text-3xl text-center py-3  bg-white">
           curriculums
        </h1>
      </div>
      {isLoading && <Loader></Loader>}
      <div className='overflow-x-auto w-full'>
            <table className=' mx-auto w-full whitespace-nowrap rounded-lg bg-white divide-y  overflow-hidden'>
          <thead>
            <tr>
              <th className="bg-white font-semibold text-sm uppercase px-6 py-4 ">Curriculum Name</th>
              <th className="bg-white font-semibold text-sm uppercase px-6 py-4 ">Admission Status</th>
              <th className="bg-white font-semibold text-sm uppercase px-6 py-4 ">Action</th>
            </tr>
          </thead>
          <tbody>
            {curriculums?.length > 0 &&
              curriculums.map((curriculum) => (
                <tr key={curriculum._id} className="even:bg-table-row-even odd:bg-table-row-odd text-center ">
                  <td className=" font-semibold text-sm uppercase px-6 py-4">{curriculum.name}</td>
                  <td className=" font-semibold text-sm uppercase px-6 py-4">{curriculum.isAdmission===true? "Yes": "No"}</td>
                  <td className=" font-semibold text-sm uppercase px-6 py-4">
                    <label
                      onClick={() => updatecurriculum(curriculum._id)}
                      htmlFor="my-modal"
                      className="btn bg-button hover:bg-gradient-to-r from-[#616161] from-0% to=[#353535] to-100% mr-2 text-white"
                    >
                      Update
                    </label>
                    <DeactivateButton setter={setsingleCurriculumId} value={curriculum._id}></DeactivateButton>
                   
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <input type="checkbox" id="my-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg text-center">Update curriculum</h3>
          <form onSubmit={e=>handleUpdate(e)}>
           <div className="form-control">
              <label htmlFor="" className=" label">
                <span className="label-text">curriculum Name </span>
              </label>
              <input
                className="input input-bordered  border-black"
                type="text"
                name="name"
                id="curriculum"
                placeholder="curriculum Name"
                defaultValue={singleCurriculum.name}
              />
            </div>
            <div className="form-control my-5 flex flex-row items-center">
            
                  <label
                    htmlFor="checked-checkbox"
                    className="ml-2 text-lg"
                  >
                    Is Admission
                  </label>
                  <select
                    name="curriculums"
                    id="curriculums"
                    className="input w-full  border-black input-bordered "
                    required
                    onChange={(e) => setIsAdmission(e.target.value)}
                  >
                    <option value={singleCurriculum.isAdmission}>
                      {singleCurriculum.isAdmission === true
                        ? 'Yes'
                        : 'No'}
                    </option>
                    <option value={singleCurriculum.isAdmission===true? false : true}>{singleCurriculum.isAdmission === true
                        ? 'No'
                        : 'Yes'}</option>
                    
                  </select>
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
      <PopUpModal remove={deactivecurriculum} modalData={singleCurriculumId} ></PopUpModal>
    </div>
  );
};

export default ShowCurriculum;
