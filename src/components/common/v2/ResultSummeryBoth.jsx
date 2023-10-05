import { CircularProgressbarWithChildren, CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import cross from "../../../assets/img/icons/cross.svg";
import 'react-circular-progressbar/dist/styles.css';

const ResultSummeryBoth = ({ title = 'Exam Result', result = {}, bgColor = 'warning', customWidth = '', hideCloseBtn = false }) => {

    return (
        <div>
            <input type="checkbox" id="my-modal-7" className="modal-toggle" />
            <div className="modal modal-middle">
                <div className={`modal-box rounded-2xl p-0 relative bg-${bgColor} ${customWidth}`}>
                    <h3 className="text-3xl font-bold py-1 text-center text-white bg-title-2">{title}</h3>
                    {!hideCloseBtn && (<label htmlFor="my-modal-7" className="btn btn-xs btn-circle absolute right-2 top-2"><img className="w-3 h-3" src={cross} /></label>)}
                    {result && <div className="relative md:min-h-[18rem] overflow-auto p-4">
                        <h2 className="text-3xl font-bold mb-2">{result.examName} ({result.subjectName})</h2>
                        {/* <div className="grid grid-cols-3 grid-flow-rows gap-x-4 tab-max:grid-cols-2 gap-y-4 place-content-center resultSummery md:grid-cols-1"> */}
                        <div className="grid grid-rows-1 grid-cols-3 md:grid-cols-2 gap-x-4 gap-y-4 place-content-center resultSummery">
                            <div className="resultSummery_col">
                                <span className="resultSummery_col_top">MCQ</span>
                                <span className="resultSummery_col_bottom">{result.totalMarksMcq}</span>
                                <div className='text-center text-md text-slate-700'>Obtained Marks:
                                    <span className='pl-1 font-bold text-title-2'>{result.totalObtainMarksMcq}</span>
                                </div>
                            </div>
                            <div className="resultSummery_col">
                                <span className="resultSummery_col_top">Written</span>
                                <span className="resultSummery_col_bottom">{result.totalMarksWritten}</span>
                                <div className='text-center text-md text-slate-700'>Obtained Marks:
                                    <span className='pl-1 font-bold text-title-2'>{result.obtainedMarksWritten}</span>
                                </div>
                            </div>

                            <div className="resultSummery_col_circle md:col-span-2">
                                <CircularProgressbarWithChildren
                                    value={result?.totalObtainMarksMcq}
                                    maxValue={result?.totalMarks}
                                    styles={buildStyles({
                                        // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
                                        strokeLinecap: 'butt',
                                        // How long animation takes to go from one percentage to another, in seconds
                                        pathTransitionDuration: 0.5,
                                        // Colors
                                        pathColor: '#00e500',
                                        textColor: '#000',
                                        trailColor: '#646464',
                                        border: 'none'
                                    })}
                                >
                                    <div className='marksContainer'>
                                        <span className='top'>{result.totalObtainedMarks}</span>
                                        <span className='bottom'>{result.totalMarks}</span>
                                    </div>
                                    <CircularProgressbar
                                        maxValue={result?.totalMarks}
                                        value={result?.obtainedMarksWritten}
                                        styles={buildStyles({
                                            rotation: result?.totalObtainMarksMcq / result?.totalMarks,
                                            trailColor: "transparent",
                                            pathColor: "#3e99df",
                                            strokeLinecap: "butt",
                                            border: 'none'
                                        })}
                                    />
                                </CircularProgressbarWithChildren>
                                <div className="text-3xl">Your Marks</div>
                            </div>
                        </div>
                        <div className='text-center p-2 text-white text-xl'>
                            <span className='py-1 px-3 btn-theme rounded-s-3xl'>Your Merit Position</span>
                            <span className='py-1 px-3  bg-[#203a4a] rounded-e-3xl'>{result?.rank === "-1" ? "Pending" : result?.rank}</span>
                        </div>
                    </div>}
                </div>
            </div>
        </div>
    )
}

export default ResultSummeryBoth