import React from 'react';
import axios from '../../utils/axios';
import toast from 'react-hot-toast';

const SolutionSheetAdder = ({examId,apiEndPoint,setIsLoading,type}) => {
    const solutionSheetAdd =async(e) =>{
        e.preventDefault();
        setIsLoading(true);
        console.log(e);
        const form = e.target;
        const solveSheet = e.target.solveSheet.value;
        const solve ={
            examId:examId,
            type,
            sollution:solveSheet
        }
        console.log(solve);
        try {
          await axios
            .post(apiEndPoint, solve, {
              headers: {
                "Content-Type": "application/json",
              },
            })
            .then(({ data }) => {
                toast.success("Solution Sheet Added Successfully");
                setIsLoading(false);
                form.reset();
                window.location.reload(false);
            })
            .catch((e) => console.log(e));
        } catch (e) {
          toast.error(`${e.response.data.message}`);
          console.log(e);
        }
    
        document.getElementById("solutionSheet").checked = false;
    }
    return (
        <div >
        <input type="checkbox" id="solutionSheet" className="modal-toggle" />
        <div className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg text-center">Add Solution Sheet</h3>
            <form className="add-form" onSubmit={solutionSheetAdd}>
              <div className="form-control">
                <label htmlFor="" className=" label">
                  <span className="label-text mb-2">Link </span>
                </label>
                <input
                  type="text"
                  name="solveSheet"
                  id="solveSheet"
                  placeholder='Please place the link here!'
                  className="file-input w-full max-w-xs mb-2 input input-bordered border-black px-2 font-extrabold"
                />
              </div>
              <input type="submit" value="Add" className="btn w-32" />
            </form>
            <div className="modal-action">
              <label htmlFor="solutionSheet" className="btn bg-[red] ">
                Close!
              </label>
            </div>
          </div>
        </div>
      </div>
    );
};

export default SolutionSheetAdder;