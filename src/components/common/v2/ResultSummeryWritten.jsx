
import { CircularProgressbarWithChildren, CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import cross from "../../../assets/img/icons/cross.svg";
import 'react-circular-progressbar/dist/styles.css';

function ResultSummeryWritten({ title = 'Exam Result', result = {}, bgColor = 'warning', customWidth = '', hideCloseBtn = false }) {
    let percentage = (result.totalObtainedMarks / result.examTotalMarks) * 100;
    return (
        <>
            <input type="checkbox" id="my-modal-5" className="modal-toggle" />
            <div className="modal modal-middle">
                <div className={`modal-box rounded-2xl p-0 relative bg-${bgColor} ${customWidth}`}>
                    <h3 className="text-3xl font-bold py-1 text-center text-white bg-title-2">{title}</h3>
                    {!hideCloseBtn && (<label htmlFor="my-modal-5" className="btn btn-xs btn-circle absolute right-2 top-2"><img className="w-3 h-3" src={cross} /></label>)}
                    <div className="relative md:min-h-[18rem] overflow-auto p-4">
                        <h2 className="text-3xl font-bold mb-2">{result.examName} (Written Exam)</h2>
                        <div className="grid tab:grid-cols-4 grid-flow-rows gap-x-4 tab-max:grid-cols-2 gap-y-4 place-content-center resultSummery sm:grid-cols-1">
                            <div className="resultSummery_col">
                                <span className="resultSummery_col_top">Total Questions</span>
                                <span className="resultSummery_col_bottom">{result.examTotalQuestions}</span>
                                <div className='text-center text-xl text-slate-700'>Full Marks
                                    <span className='pl-1 font-bold text-title-2'>{result.examTotalMarks}</span>
                                </div>
                            </div>
                            <div className="resultSummery_col">
                                <span className="resultSummery_col_top">Obtained Marks</span>
                                <span className="resultSummery_col_bottom">{result.totalObtainedMarks}</span>
                                <div className='text-center text-2xl text-green-500 font-semibold'>
                                    {
                                        result?.obtainedMarks?.map((mark,index) =>(
                                            index < parseInt(result.examTotalQuestions-1) ? `${mark}+`:`${mark} = `
                                        ))
                                    }{result.totalObtainedMarks}
                                    <br/>
                                    {percentage.toFixed(2)} %
                                </div>
                            </div>
                            
                            <div className="resultSummery_col">
                                <span className="resultSummery_col_top">Not Answered</span>
                                <span className="resultSummery_col_bottom">{result.notSubmitted}</span>
                                <div className='text-center text-xl text-slate-800 font-bold'>{result.notSubmitted}</div>
                            </div>
                            <div className="resultSummery_col_circle">
                            <CircularProgressbarWithChildren value={percentage}
                            maxValue={100}
                                    styles={buildStyles({
                                        // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
                                        strokeLinecap: 'butt',
                                        // How long animation takes to go from one percentage to another, in seconds
                                        pathTransitionDuration: 0.5,
                                        // Colors
                                        pathColor: '#00e500',
                                        textColor: '#000',
                                        trailColor: '#FF0000',
                                        border: 'none'
                                    })}
                                >
                                    <div className='marksContainer'>
                                        <span className='top'>{result.totalObtainedMarks}</span>
                                        <span className='bottom'>{result.examTotalMarks}</span>
                                    </div>
                                </CircularProgressbarWithChildren>
                                <div className="text-3xl">Your Marks</div>
                            </div>
                        </div>
                        <div className='text-center p-2 text-white text-xl'>
                            <span className='py-1 px-3 btn-theme rounded-s-3xl'>Your Merit Position</span>
                            <span className='py-1 px-3  bg-[#203a4a] rounded-e-3xl'>{result?.rank === "-1" ? "Pending" : result?.rank}</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ResultSummeryWritten