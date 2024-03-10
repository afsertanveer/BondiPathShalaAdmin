import React, { useState } from 'react'
import { optionName } from '../../utils/globalVariables'
import axios from '../../utils/axios';
import toast from 'react-hot-toast';

const OptionChanger = ({
    numberOfOptions,questionId
}) => {
    // console.log(numberOfOptions)
    const [correctOption,setCorrectOption] = useState(-1);

    const  handleUpdateQuestion = async(e)=>{
        e.preventDefault();
        axios.post("/api/exam/changeanswer",{id:questionId,correctAnswer:correctOption})
        .then(({data})=>{
            toast.success(data);
            window.location.reload(false)
        }).catch(e=>{
            console.log(e);
            toast.error(e.respnse.data)
            
        })
        
    }

  return (
    <div>
      <input type="checkbox" id="option-changer" className="modal-toggle" />
      <div className="modal modal-middle ml:0 lg:ml-56">
        <div className="modal-box w-11/12 max-w-5xl h-11/12">
            <form className="add-form" onSubmit={handleUpdateQuestion}>
            

              <label className="text-lg">Correct Option</label>
              <select
                name="correct_option"
                id="correct_option"
                className="input border-black input-bordered w-full "
                onChange={(e) => setCorrectOption(e.target.value)}
                required
              >
                <option>---</option>
                {[...Array(parseInt(numberOfOptions)).keys()].map((id) => (
                  <option key={id} value={id}>
                    {optionName[id]}
                  </option>
                ))}
              </select>

              <div className="form-control my-2">
                <input
                  type="submit"
                  value="Change Answer"
                  className="btn w-32 "
                />
              </div>
            </form>
          

          <div className="modal-action">
            <label htmlFor="option-changer" className="btn bg-red text-white">
              Close
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OptionChanger
