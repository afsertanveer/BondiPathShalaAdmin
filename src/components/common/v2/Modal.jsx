

import cross from "../../../assets/img/icons/cross.svg";

const Modal = ({ title = 'Notice!', message, showHtml = false, bgColor = 'warning', customWidth = '', hideCloseBtn = false }) => {
    return (
        <>
            <input type="checkbox" id="my-modal-3" className="modal-toggle" />
            <div className="modal modal-middle modal-bottom">
                <div className={`modal-box rounded-2xl p-0 relative bg-${bgColor} ${customWidth}`}>
                    <h3 className="text-3xl font-bold py-1 text-center text-white md:mt-2 bg-title-2">{title}</h3>
                    {!hideCloseBtn && (<label htmlFor="my-modal-3" className="btn btn-xs btn-circle absolute right-2 top-2"><img className="w-3 h-3" src={cross}/></label>)}
                    {
                        showHtml ? (<div className="p-4" dangerouslySetInnerHTML={{ __html: message }}></div>) : (<p className="py-4">{message}</p>)
                    }

                </div>
            </div>
        </>
    )
}

export default Modal