import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import Dashboard from '../../features/dashboard/index'
import axios from '../../utils/axios'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Dashboard"}))
     
      }, [dispatch])


    return(
        <Dashboard />
    )
}

export default InternalPage