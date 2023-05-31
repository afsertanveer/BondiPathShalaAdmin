

const Modal = ({ title = 'Notice!', message , showHtml = false, bgColor='warning' }) => {
    return (
        <>
            <input type="checkbox" id="my-modal-3" className="modal-toggle" />
            <div className="modal">
                <div className={`modal-box relative bg-${bgColor}`}>
                    <label htmlFor="my-modal-3" className="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
                    <h3 className="text-lg font-bold">{title}</h3>
                    {
                        showHtml ? (<p className="py-4" dangerouslySetInnerHTML={{__html:message}}></p>) :(<p className="py-4">{message}</p>)
                    }
                    
                </div>
            </div>
        </>
    )
}

export default Modal