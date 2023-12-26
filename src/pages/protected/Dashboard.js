import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import Dashboard from '../../features/dashboard/index'
import axios from '../../utils/axios'

function InternalPage(){
    const dispatch = useDispatch()
    const [courses,setCourses] = useSelector([])

    useEffect(() => {
        dispatch(setPageTitle({ title : "Dashboard"}))
        for(let i = 0 ; i < 50000; i++){
            axios.get("/api/course/getallcourseadmin").then(({ data }) => {
            setCourses(data.courses)
              }).catch(e=>{
                console.log(e);
                setCourses([]);
              })
        }
      }, [dispatch])


    return(
        <Dashboard />
    )
}

export default InternalPage