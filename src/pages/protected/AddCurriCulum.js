import React from 'react'
import { useState } from 'react'
import axios from '../../utils/axios'
import { toast } from 'react-hot-toast'

const AddCurriculum = () => {
  const [isAdmission, setIsAdmission] = useState(false)

  const handleAddCurriCulum = async (e) => {
    e.preventDefault()
  
    const form = e.target
    const name = form.exam.value;
    let curriculmData ={
        name,
        isAdmission
    }
    await axios
      .post(`/api/curriculum/createcurriculum`, curriculmData)
      .then(({ data }) => {
        toast.success('Curriculum Added Succesfully')
        window.location.reload(false)
      })
      .catch((e) => console.log(e))
  }
  return (
    <div className='flex justify-center items-center pt-8 lg:pt-32'>
      <div className="w-full lg:w-2/3 p-4 lg:p-16  bg-white flex flex-col mx-auto rounded-lg  shadow-lg ">
        <h1 className="text-3xl  font-bold text-center">
          Add Curriculum
        </h1>
        <div className="px-4 lg:px-10">
          <form className="add-form" onSubmit={handleAddCurriCulum}>
            <div className="form-control">
              <label htmlFor="" className=" label">
                <span className="text-lg">Name </span>
              </label>
              <input
                className="input input-bordered  border-black"
                type="text"
                name="exam"
                id="exam"
                placeholder="Curriculum Name"
                required
              />
            </div>
            <div className="form-control">
              <div className="grid grid-cols-1 gap-y-2 mt-0 lg:mt-5 ">
                <label
                  htmlFor="disabled-checked-checkbox"
                  className=" text-lg"
                >
                  Is it Admission Curriculum?
                </label>
                <select
                  name="variation"
                  id="variation"
                  className="input border-black input-bordered w-full "
                  onChange={(e) => setIsAdmission(e.target.value)}
                  required
                >
                  <option value="">Please Select</option>
                  <option value={true}>Yes</option>
                  <option value={false}>No</option>
                </select>
              </div>
            </div>
            <div className="form-control mt-2">
              <input
                type="submit"
                value="Add Exam"
                className="btn w-[150px] mt-4"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddCurriculum;
