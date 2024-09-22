import {useState, useRef} from 'react'
import {Link} from 'react-router-dom'
import LandingIntro from './LandingIntro'
import ErrorText from  '../../components/Typography/ErrorText'
import InputText from '../../components/Input/InputText'
import axios from '../../utils/axios';
import { toast } from 'react-hot-toast'

function Login(){

    const INITIAL_LOGIN_OBJ = {
        password : "",
        userName : ""
    }

    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [loginObj, setLoginObj] = useState(INITIAL_LOGIN_OBJ)

    const submitForm = (e) =>{
        e.preventDefault()
        setErrorMessage("")

        if(loginObj.userName.trim() === "")return setErrorMessage("Username is required!")
        if(loginObj.password.trim() === "")return setErrorMessage("Password is required!")
        else{
            setLoading(true)
            axios.post('/api/user/login',{...loginObj},{
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                withCredentials: true
            })
            .then(({data}) => {
                console.log(data)
                if(data.role===3){
                    console.log("TEACHER")
                    localStorage.setItem("writtenData",JSON.stringify([]))
                    localStorage.setItem("writtenDataPagination",JSON.stringify({}))
                    localStorage.setItem("bothData",JSON.stringify([]))
                    localStorage.setItem("bothDataPagination",JSON.stringify({}))
                    localStorage.setItem("specialData",JSON.stringify([]))
                    localStorage.setItem("specialDataPagination",JSON.stringify({}))
                }
                localStorage.setItem("token",data.token);
                localStorage.setItem('user', JSON.stringify(data));
                toast.success("Successful Login");
                window.location.href = '/dashboard'
                
            })
            .catch(err => {
                let errMsg = err.response?.data || "Login failed"
                setErrorMessage(errMsg);
            })
            setLoading(false)
            // window.location.href = '/dashboard'
        }
    }

    const updateFormValue = ({updateType, value}) => {
        setErrorMessage("")
        setLoginObj({...loginObj, [updateType] : value})
    }

    return(
        <div className="min-h-screen bg-base-200 flex items-center">
            <div className="card mx-auto w-full max-w-5xl  shadow-xl">
                <div className="grid  md:grid-cols-2 grid-cols-1  bg-base-100 rounded-xl">
                <div className=''>
                        <LandingIntro />
                </div>
                <div className='py-24 px-10'>
                    <h2 className='text-2xl font-semibold mb-2 text-center'>Login</h2>
                    <form onSubmit={(e) => submitForm(e)}>

                        <div className="mb-4">

                            <InputText type="text" defaultValue={loginObj.userName} updateType="userName" containerStyle="mt-4" labelTitle="Username" updateFormValue={updateFormValue}/>

                            <InputText defaultValue={loginObj.password} type="password" updateType="password" containerStyle="mt-4" labelTitle="Password" updateFormValue={updateFormValue}/>

                        </div>

                        <div className='text-right text-primary'><Link to="/forgot-password"><span className="text-sm  inline-block  hover:text-primary hover:underline hover:cursor-pointer transition duration-200">Forgot Password?</span></Link>
                        </div>

                        <ErrorText styleclassName="mt-8">{errorMessage}</ErrorText>
                        <button type="submit" className={"btn mt-2 w-full btn-primary" + (loading ? " loading" : "")}>Login</button>
                    </form>
                </div>
            </div>
            </div>
        </div>
    )
}

export default Login