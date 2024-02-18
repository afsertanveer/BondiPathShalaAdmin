import React from 'react';
import axios from '../../utils/axios';
import toast from 'react-hot-toast';

const ImageAdder = ({examId,title,apiEndPoint,setIsLoading}) => {
    const handleAddImage =async(e) =>{
        e.preventDefault();
        setIsLoading(true);
        const form = e.target;
        const file = e.target.imageLink.files[0];
        const formData = new FormData();
        console.log(examId,apiEndPoint,title);
        formData.append("examId", examId);
        formData.append("imageLink", file);
        try {
          await axios
            .post(apiEndPoint, formData, {
              headers: {
                "Content-Type": "multipart/ form-data",
              },
            })
            .then(({ data }) => {
                toast.success("Image Added Successfully");
                setIsLoading(false);
                form.reset();
            })
            .catch((e) => console.log(e));
        } catch (e) {
          toast.error(`${e.response.data.message}`);
          console.log(e);
        }
    
        document.getElementById("imageAdder").checked = false;
    }
    return (
        <div >
        <input type="checkbox" id="imageAdder" className="modal-toggle" />
        <div className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg text-center">{title}</h3>
            <form className="add-form" onSubmit={handleAddImage}>
              <div className="form-control">
                <label htmlFor="" className=" label">
                  <span className="label-text mb-2">Select Image </span>
                </label>
                <input
                  type="file"
                  name="imageLink"
                  id="imageLink"
                  className="file-input w-full max-w-xs mb-2 input input-bordered border-black pl-0"
                />
              </div>
              <input type="submit" value="Add" className="btn w-32" />
            </form>
            <div className="modal-action">
              <label htmlFor="imageAdder" className="btn bg-[red] ">
                Close!
              </label>
            </div>
          </div>
        </div>
      </div>
    );
};

export default ImageAdder;