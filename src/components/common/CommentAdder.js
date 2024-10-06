import React from 'react'
import axios from './../../utils/axios';
import toast from 'react-hot-toast';

export default function CommentAdder({ examId, studentId,subjectId }) {
    console.log(examId,studentId);
    const addComment = async(e) =>{
        e.preventDefault();
        const comment = document.getElementById("comment").value;
        const data = {
            examId:examId,
            studentId:studentId,
            subjectId:subjectId,
            comment:comment
        }
        console.log(data);
        await axios.post('/api/remark/add',data)
        .then(({data})=>{
            toast.success("Comment Added")
        }).catch(e=>console.log(e))
    }
    return (
        <div className="flex justify-start items-center mt-4 px-4 lg:px-10">
            {/* <form  onSubmit={addComment}>
            <div className='grid grid-cols-1'>
            <textarea
                className="textarea textarea-info text-2xl font-bold border-black"
                name="comment"
                id="comment"
                cols={50}
                rows={5}
                // enterKey={(e)=>addData(id)}
                placeholder="Description"
            ></textarea>
            </div>
            <div className='flex justify-center items-center'>
            <button className="btn btn-lg mt-4" type="submit">
                Add Comment
            </button>
            </div>
            </form> */}
        </div>
    )
}
