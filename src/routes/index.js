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
const BothExamDetails = lazy(()=>import('../pages/protected/BothExamDetails'));
const FreeExamDetails = lazy(()=>import('../pages/protected/FreeExamDetails'));
const ExamSolution= lazy(()=>import('../pages/protected/ExamSolution'));
const FreeExamSolution= lazy(()=>import('../pages/protected/FreeExamSolution'));
const ViewResult= lazy(()=>import('../pages/protected/ViewResult'));
const ViewPaidResult= lazy(()=>import('../pages/protected/ViewPaidResult'));
const StudentHistory = lazy(()=>import('./../pages/protected/StudentHistory'));
const SearchStudent = lazy(()=>import('./../pages/protected/SearchStudent'));
const ViewWrittenScripts = lazy(()=>import('./../pages/protected/ViewWrittenScripts'));
const ViewScriptBoth = lazy(()=>import('./../pages/protected/ViewScriptBoth'));
const ViewScriptSpecial = lazy(()=>import('./../pages/protected/ViewScriptSpecial'));
const AddBothExam = lazy(()=>import('./../pages/protected/AddBothExam'));
const AddSpecialExam = lazy(()=>import('./../pages/protected/AddSpecialExam'));
const ShowBothExam = lazy(()=>import('./../pages/protected/ShowBothExam'));
const ShowSpecialExam = lazy(()=>import('./../pages/protected/ShowSpecialExam'));
const AddQuestionSpecial = lazy(()=>import('./../pages/protected/AddQuestionSpecial'));
const ShowQuestionSpecial = lazy(()=>import('./../pages/protected/ShowQuestionSpecial'));
const ShowBothQuestions = lazy(()=>import('./../pages/protected/ShowBothQuestions'));
const Recheck = lazy(()=>import('./../pages/protected/Recheck'));
const RecheckBoth = lazy(()=>import('./../pages/protected/RecheckBoth'));
const RecheckSpecial = lazy(()=>import('./../pages/protected/RecheckSpecial'));
const SingleStudentWrittenANswer = lazy(()=>import('./../pages/protected/SingleStudentWrittenANswer'));
const SingleStudentBothWrittenAnswer = lazy(()=>import('./../pages/protected/SingleStudentBothWrittenAnswer'));
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
      path: '/scripts/both/view', // the url
      component: ViewScriptBoth, // view rendered
    },
    {
      path: '/scripts/special/view', // the url
      component: ViewScriptSpecial, // view rendered
    },
    {
      path: '/scripts/recheck', // the url
      component: Recheck, // view rendered
    },
    {
      path: '/scripts/both/recheck', // the url
      component: RecheckBoth, // view rendered
    },
    {
      path: '/scripts/special/recheck', // the url
      component: RecheckSpecial, // view rendered
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
    },
    {
      path:'/:examId/checkanswerboth/:studentId',
      component:SingleStudentBothWrittenAnswer
    }
  ]
}else{
  routes = [
    {
      path: '/', // the url
      component: Dashboard, // view rendered
    },
    {
      path: '/scripts/both/view', // the url
      component: ViewScriptBoth, // view rendered
    },
    {
      path: '/scripts/special/view', // the url
      component: ViewScriptSpecial, // view rendered
    },
    {
      path: '/scripts/both/recheck', // the url
      component: RecheckBoth, // view rendered
    },
    {
      path: '/scripts/special/recheck', // the url
      component: RecheckSpecial, // view rendered
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
      path:'/:examId/checkanswerboth/:studentId',
      component:SingleStudentBothWrittenAnswer
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
      path: '/exams/add-special-exam', // the url
      component: AddSpecialExam, // view rendered
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
      path: '/exams/bothexamdetailsbyexam', // the url
      component: BothExamDetails, // view rendered
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
      path: '/exam/special-addquestion', // the url
      component:AddQuestionSpecial , // view rendered
      
    },
    {
      path: '/exam/show-special-addquestion-mcq', // the url
      component:ShowQuestionSpecial , // view rendered
      
    },
    {
      path: '/exam/special', // the url
      component: ShowSpecialExam, // view rendered
      
    },
    {
      path: '/exam/show-both-exam', // the url
      component: ShowBothExam, // view rendered
      
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
      path: '/exam/show-both-questions', // the url
      component: ShowBothQuestions, // view rendered
      
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
