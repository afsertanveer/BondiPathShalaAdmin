// All components mapping with path for internal routes

import { lazy } from 'react'

const Dashboard = lazy(() => import('../pages/protected/Dashboard'))
const Welcome = lazy(() => import('../pages/protected/Welcome'))
const Page404 = lazy(() => import('../pages/protected/404'))
const Blank = lazy(() => import('../pages/protected/Blank'))
const Charts = lazy(() => import('../pages/protected/Charts'))
const Leads = lazy(() => import('../pages/protected/Leads'))
const Integration = lazy(() => import('../pages/protected/Integration'))
const Team = lazy(() => import('../pages/protected/Team'))
const Bills = lazy(() => import('../pages/protected/Bills'))
const ProfileSettings = lazy(() => import('../pages/protected/ProfileSettings'))
const GettingStarted = lazy(() => import('../pages/GettingStarted'))
const DocFeatures = lazy(() => import('../pages/DocFeatures'))
const DocComponents = lazy(() => import('../pages/DocComponents'))
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
const ShowExam = lazy(()=>import('../pages/protected/ShowExam'));


const routes = [
  {
    path: '/', // the url
    component: Dashboard, // view rendered
  },
  {
    path: '/courses/create-new', // the url
    component: CreateCourse, // view rendered
  },
  {
    path: '/exams/create-new', // the url
    component: AddExam, // view rendered
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
    path: '/students/assigncourse', // the url
    component: AssignCourse, // view rendered
    
  },
  {
    path: '/welcome', // the url
    component: Welcome, // view rendered
  },
  {
    path: '/leads',
    component: Leads,
  },
  {
    path: '/settings-team',
    component: Team,
  },
  {
    path: '/settings-profile',
    component: ProfileSettings,
  },
  {
    path: '/settings-billing',
    component: Bills,
  },
  {
    path: '/getting-started',
    component: GettingStarted,
  },
  {
    path: '/features',
    component: DocFeatures,
  },
  {
    path: '/components',
    component: DocComponents,
  },
  {
    path: '/integration',
    component: Integration,
  },
  {
    path: '/charts',
    component: Charts,
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

export default routes
