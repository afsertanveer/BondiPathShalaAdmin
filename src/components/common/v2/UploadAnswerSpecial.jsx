import { useRef, useState } from "react";
import axios from "../../../utils/axios";
import Toast from "../Toast";

function UploadAnswerSpecial({ index, token, exam_code, subjectId ,marksPerQuestion = 1,uploadEndpoint = '' }) {
    const [placeholder] = useState(`${index} নং প্রশ্নের উত্তর আপলোড করুন`);
    const [placeholderImg, setPlaceholderImg] = useState();
    const [message, setMessage] = useState(null);
    const [selectedImages, setSelectedIMages] = useState([]);
    const fileSelectorRef = useRef();

    function triggerFileSelector(e) {
        e.preventDefault();
        fileSelectorRef.current.click();
    }
    async function onFileSelected(e) {
        const files = e.target.files;
        if (files.length > 5) {
            window.alert("Maximum allowed files exceeded");
            return;
        }
        setSelectedIMages(files);
        const names = [];
        for (let index = 0; index < files.length; index++) {
            var url = URL.createObjectURL(files[index]);
            names.push(`<img class="inline h-12 w-12 pr-1" src="${url}" />`);
        }
        setPlaceholderImg(names);
    }
    async function uploadImages(e) {
        e.preventDefault();
        let result = window.confirm("Upload answer script?");
        if (result) {
            const form = new FormData();
            form.append("examId", exam_code);
            form.append("questionNo", index);
            form.append("subjectId", subjectId);
            for (let index = 0; index < selectedImages.length; index++) {
                form.append("questionILink", selectedImages[index]);
            }
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
            axios.post(uploadEndpoint, form, {
                headers: {
                    "Content-Type": "multipart/ form-data",
                },
            }).then(() => {
                setMessage({ message: 'Image uploaded', cssClass: 'success', position: 'bottom', alignment: 'end' });
                setTimeout(function () {
                    setMessage(null);
                }, 3000);
            });
        } else {
            setMessage({ message: 'Request cancelled', cssClass: 'error', position: 'bottom', alignment: 'end' });
            setTimeout(function () {
                setMessage(null);
            }, 3000);
        }

    }
    return (
        <>
            <Toast {...message} />
            <div className="w-full px-3 py-2 rounded-lg shadow-[0px_0px_2px_2px_rgba(275,75,0,0.75)] md:hidden ">
                {placeholder}
            </div>
            <div className="inline md:block my-4 w-2/3 md:w-full md:border-2 md:p-3 md:rounded-lg">
                <label className="label font-bold md:font-thin relative md:hidden">
                    <span className="absolute top-1 left-3 bg-white px-2 text-title-2 tab-max:text-sm">Submit Your Answer (Max. 5 Photos)</span>
                </label>
                <div className="flex flex-row flex-wrap w-full md:hidden">
                    <div className="grow md:w-full border-2 rounded-lg p-3 md:p-6 border-title-2 bg-white text-gray-500 overflow-x-auto"
                        dangerouslySetInnerHTML={{ __html: placeholderImg }}
                    ></div>
                    <input
                        type="file"
                        name={`file[${index}][]`}
                        ref={fileSelectorRef}
                        multiple
                        accept=".jpg,.png,.jpeg"
                        onChange={onFileSelected}
                        className="hidden"
                    />
                    <div className="mt-1">
                        <button className="bg-gray-300 rounded-full p-2 ml-2 md:hidden" title="ছবি সিলেক্ট কর" onClick={(e) => triggerFileSelector(e)}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                            </svg>
                        </button>
                        <button className="bg-title-2 text-white rounded-full p-2 ml-2 md:hidden disabled:bg-orange-300" title="ছবি আপলোড কর" disabled={selectedImages.length === 0} onClick={(e) => uploadImages(e)}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                            </svg>
                        </button>
                    </div>
                </div>
                {/* for mobile design */}
                <div className="text-center mt-2 hidden md:block md:w-full">
                    <div className="w-full p-1 mb-2 rounded-lg shadow-[0px_0px_2px_2px_rgba(275,75,0,0.75)]">
                        {placeholder}
                    </div>
                    <label className="label font-bold md:font-thin relative md:block">
                        <span className="absolute top-1 left-3 bg-white px-2 text-title-2 tab-max:text-sm">Submit Your Answer (Max. 5 Photos)</span>
                    </label>
                    <div className="flex flex-row flex-wrap w-full md:block">
                        <div className="grow md:w-full border-2 rounded-lg p-3 md:p-6 border-title-2 bg-white text-gray-500 overflow-x-auto"
                            dangerouslySetInnerHTML={{ __html: placeholderImg }}
                        ></div>
                        <input
                            type="file"
                            name={`file[${index}][]`}
                            ref={fileSelectorRef}
                            multiple
                            accept=".jpg,.png,.jpeg"
                            onChange={onFileSelected}
                            className="hidden"
                        />
                        <div className="mt-1">
                            <button className="bg-gray-300 rounded-full p-2 ml-2 md:hidden" title="ছবি সিলেক্ট কর" onClick={(e) => triggerFileSelector(e)}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                                </svg>
                            </button>
                            <button className="bg-title-2 text-white rounded-full p-2 ml-2 md:hidden" title="ছবি আপলোড কর">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    <button className="bg-gray-300 rounded-full p-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                        </svg>
                    </button>
                    <button className="bg-title-2 text-white rounded-full p-2 ml-2" title="ছবি আপলোড কর">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                        </svg>
                    </button>
                </div>
            </div>
        </>
    )
}

export default UploadAnswerSpecial