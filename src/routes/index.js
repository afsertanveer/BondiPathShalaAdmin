// All components mapping with path for internal routes

import { lazy } from 'react'

const Dashboard = lazy(() => import('../pages/protected/Dashboard'))
const Page404 = lazy(() => import('../pages/protected/404'))
const Blank = lazy(() => import('../pages/protected/Blank'))
const CreateCourse = lazy(()=>import('../pages/protected/CreateCourse'))
const ShowCourses = lazy(()=>import('../pages/protected/ShowCourses'))
const AddUser = lazy(()=>import('../pages/protected/AddUser'));
const ShowUsers = lazy(()=>import('../pages/protected/ShowUsers'));
const AddStudent = lazy(()=>import('../pages/protected/AddStudent'));
const ShowStudents = lazy(()=>import('../pages/protected/ShowStudents'));
const AssignCourse = lazy(()=>import('../pages/protected/AssignToCourse'));
const AddSubject = lazy(()=>import('../pages/protected/AddSubject'));
const ShowSubjects = lazy(()=>import('../pages/protected/ShowSubjects'));
const AddExam = lazy(()=>import('../pages/protected/AddExam'));
const AddFreeExam = lazy(()=>import('../pages/protected/AddFreeExam'));
const ShowExam = lazy(()=>import('../pages/protected/ShowExam'));
const ShowFreeExam = lazy(()=>import('../pages/protected/ShowFreeExam'));
const ShowQuestions = lazy(()=>import('../pages/protected/ShowQuestions'));
const ShowQuestionsWritten = lazy(()=>import('../pages/protected/ShowQuestionsWritten'));
const ExamDetails = lazy(()=>import('../pages/protected/ExamDetails'));
const WrittenExamDetails = lazy(()=>import('../pages/protected/WrittenExamDetails'));
const FreeExamDetails = lazy(()=>import('../pages/protected/FreeExamDetails'));
const ExamSolution= lazy(()=>import('../pages/protected/ExamSolution'));
const FreeExamSolution= lazy(()=>import('../pages/protected/FreeExamSolution'));
const ViewResult= lazy(()=>import('../pages/protected/ViewResult'));
const ViewPaidResult= lazy(()=>import('../pages/protected/ViewPaidResult'));
const StudentHistory = lazy(()=>import('./../pages/protected/StudentHistory'));
const SearchStudent = lazy(()=>import('./../pages/protected/SearchStudent'));
const ViewWrittenScripts = lazy(()=>import('./../pages/protected/ViewWrittenScripts'));
const AddBothExam = lazy(()=>import('./../pages/protected/AddBothExam'));
const Recheck = lazy(()=>import('./../pages/protected/Recheck'));
const SingleStudentWrittenANswer = lazy(()=>import('./../pages/protected/SingleStudentWrittenANswer'));
const user =JSON.parse(localStorage.getItem('user')) ;
const role = user.role;
let routes;
if(role===3){
  routes = [
    {
      path: '/', // the url
      component: Dashboard, // view rendered
    },    
    {
      path: '/scripts/view', // the url
      component: ViewWrittenScripts, // view rendered
    },
    {
      path: '/scripts/recheck', // the url
      component: Recheck, // view rendered
    },
    
    {
      path: '/404',
      component: Page404,
    },
    {
      path: '/blank',
      component: Blank,
    },
    {
      path:'/:examId/checkanswer/:studentId',
      component:SingleStudentWrittenANswer
    }
  ]
}else{
  routes = [
    {
      path: '/', // the url
      component: Dashboard, // view rendered
    },
    {
      path: '/scripts/view', // the url
      component: ViewWrittenScripts, // view rendered
    },
    {
      path: '/scripts/recheck', // the url
      component: Recheck, // view rendered
    },
    {
      path: '/courses/create-new', // the url
      component: CreateCourse, // view rendered
    },
    {
      path:'/:examId/checkanswer/:studentId',
      component:SingleStudentWrittenANswer
    },
    {
      path: '/exams/create-new', // the url
      component: AddExam, // view rendered
    },
    {
      path: '/exams/add-both-exam', // the url
      component: AddBothExam, // view rendered
    },
    {
      path: '/exams/create-free-new', // the url
      component: AddFreeExam, // view rendere
    },
    {
      path: '/exams/mcqexamdetailsbyexam', // the url
      component: ExamDetails, // view rendered
    },
    {
      path: '/exams/writtenexamdetailsbyexam', // the url
      component: WrittenExamDetails, // view rendered
    },
    {
      path: '/exams/examdetailsbyfreeexam', // the url
      component: FreeExamDetails, // view rendered
    },
    {
      path: '/exams/:studentId/:examId/solution', // the url
      component: ExamSolution, // view rendered
    },
    {
      path: '/exams/:studentId/:examId/freesolution', // the url
      component: FreeExamSolution, // view rendered
    },
    {
      path: '/courses/show', // the url
      component: ShowCourses, // view rendered
    },
    {
      path: '/exam/show', // the url
      component: ShowExam, // view rendered
      
    },
    {
      path: '/exam/viewresult', // the url
      component: ViewResult, // view rendered
      
    },
    {
      path: '/exam/view-paid-result', // the url
      component: ViewPaidResult, // view rendered
      
    },
    {
      path: '/exam/show-free', // the url
      component: ShowFreeExam, // view rendered
      
    },
    {
      path: '/exam/show-questions', // the url
      component: ShowQuestions, // view rendered
      
    },
    {
      path: '/exam/show-questions-written', // the url
      component: ShowQuestionsWritten, // view rendered
      
    },
    {
      path: '/subjects/create-new', // the url
      component: AddSubject, // view rendered
    },
    {
      path: '/subjects/show', // the url
      component: ShowSubjects, // view rendered
      
    },
    {
      path: '/users/create-new', // the url
      component: AddUser, // view rendered
    },
    {
      path: '/users/show', // the url
      component: ShowUsers, // view rendered
      
    },
    {
      path: '/students/create-new', // the url
      component: AddStudent, // view rendered
    },
    {
      path: '/students/show', // the url
      component: ShowStudents, // view rendered
      
    },
    {
      path: '/students/search', // the url
      component: SearchStudent, // view rendered
      
    },
    {
      path: '/students/assigncourse', // the url
      component: AssignCourse, // view rendered
      
    },
    {
      path: '/students/:studentId/history', // the url
      component: StudentHistory, // view rendered
      
    },
    {
      path: '/404',
      component: Page404,
    },
    {
      path: '/blank',
      component: Blank,
    },
  ]
}


export default routes
