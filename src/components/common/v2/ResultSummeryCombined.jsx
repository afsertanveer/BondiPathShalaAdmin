import { CircularProgressbarWithChildren, CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import cross from "../../../assets/img/icons/cross.svg";
import 'react-circular-progressbar/dist/styles.css';

const ResultSummeryCombined = ({ title = 'Exam Result', result = {}, bgColor = 'warning', customWidth = '', hideCloseBtn = false }) => {
    const container = [];
    let mcqMarks = 0;
    let writtenMarks = 0;
    if (result.length > 0) {
        for (let i = 0; i < 4; i++) {
            mcqMarks += parseFloat(result[i].marksMcqPerSub);
            writtenMarks += parseFloat(result[i].marksWrittenPerSub);
            container.push(
                <div className="resultSummery_col" key={i}>
                    <span className="resultSummery_col_top">{result[i].subjectName}</span>
                    <span className="resultSummery_col_bottom !text-2xl">MCQ: {result[i].totalMarksMcqPerSub}<br />Written: {result[i].totalMarksWrittenPerSub}</span>
                    <div className='text-center text-md text-slate-700'>Obtained Marks<br />
                        MCQ: <span className='pl-1 font-bold text-title-2'>{result[i].marksMcqPerSub}</span><br />
                        Written: <span className='pl-1 font-bold text-title-2'>{result[i].marksWrittenPerSub}</span>
                    </div>
                </div>
            );
        }
    }
    return (
        <div>
            <input type="checkbox" id="my-modal-6" className="modal-toggle" />
            <div className="modal modal-middle">
                <div className={`modal-box rounded-2xl p-0 relative bg-${bgColor} ${customWidth}`}>
                    <h3 className="text-3xl font-bold py-1 text-center text-white bg-title-2">{title}</h3>
                    {!hideCloseBtn && (<label htmlFor="my-modal-6" className="btn btn-xs btn-circle absolute right-2 top-2"><img className="w-3 h-3" src={cross} /></label>)}
                    {result.length > 0 && <div className="relative md:min-h-[18rem] overflow-auto p-4">
                        <h2 className="text-3xl font-bold mb-2">{result[15].examName} ({result[14].examVariation})</h2>
                        <div className="grid tab:grid-cols-5 grid-flow-rows gap-x-4 tab-max:grid-cols-2 gap-y-4 place-content-center resultSummery sm:grid-cols-1">

                            {container}

                            <div className="resultSummery_col_circle tab-max:col-span-2">
                                <CircularProgressbarWithChildren
                                    value={writtenMarks}
                                    maxValue={result[4]?.totalMarks}
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
                                        <span className='top'>{result[5].totalObtainedMarks}</span>
                                        <span className='bottom'>{result[4].totalMarks}</span>
                                    </div>
                                    <CircularProgressbar
                                        maxValue={result[4]?.totalMarks}
                                        value={mcqMarks}
                                        styles={buildStyles({
                                            rotation: writtenMarks/result[4]?.totalMarks,
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
                            <span className='py-1 px-3  bg-[#203a4a] rounded-e-3xl'>{result[6]?.rank === "-1" ? "Pending" : result[6]?.rank}</span>
                        </div>
                    </div>}
                </div>
            </div>
        </div>
    )
}

export default ResultSummeryCombined