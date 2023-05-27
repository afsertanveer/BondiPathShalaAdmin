/** Icons are imported separatly to reduce build time */
import Squares2X2Icon from '@heroicons/react/24/outline/Squares2X2Icon'
import WalletIcon from '@heroicons/react/24/outline/WalletIcon'
import UserIcon from '@heroicons/react/24/outline/UserIcon'
import Cog6ToothIcon from '@heroicons/react/24/outline/Cog6ToothIcon'
import BoltIcon from '@heroicons/react/24/outline/BoltIcon'
import ChartBarIcon from '@heroicons/react/24/outline/ChartBarIcon'
import InboxArrowDownIcon from '@heroicons/react/24/outline/InboxArrowDownIcon'
import UsersIcon from '@heroicons/react/24/outline/UsersIcon'
import MoonIcon from '@heroicons/react/24/outline/MoonIcon'

const iconClasses = `h-6 w-6`
const submenuIconClasses = `h-5 w-5`

const routes = [

  {
    path: '/dashboard',
    icon: <Squares2X2Icon className={iconClasses}/>, 
    name: 'Dashboard',
  },
  {
    path: '', //no url needed as this has submenu
    icon: <Cog6ToothIcon className={`${iconClasses} inline` }/>, // icon component
    name: 'Courses', // name that appear in Sidebar
    submenu : [
      {
        path: '/dashboard/courses/create-new', //url
        icon: <UserIcon className={submenuIconClasses}/>, // icon component
        name: 'Create Courses', // name that appear in Sidebar
      },
      {
        path: '/dashboard/courses/show',
        icon: <WalletIcon className={submenuIconClasses}/>,
        name: 'Show Courses',
      },
    ]
  }, 
  {
    path: '', //no url needed as this has submenu
    icon: <MoonIcon className={`${iconClasses} inline` }/>, // icon component
    name: 'Subject', // name that appear in Sidebar
    submenu : [
      {
        path: '/dashboard/subjects/create-new', //url
        icon: <UserIcon className={submenuIconClasses}/>, // icon component
        name: 'Add Subject', // name that appear in Sidebar
      },
      {
        path: '/dashboard/subjects/show',
        icon: <WalletIcon className={submenuIconClasses}/>,
        name: 'Show Subjects',
      },
    ]
  }, 
  
  {
    path: '', //no url needed as this has submenu
    icon: <UserIcon className={`${iconClasses} inline` }/>, // icon component
    name: ' User', // name that appear in Sidebar
    submenu : [
      {
        path: '/dashboard/users/create-new', //url
        icon: <UserIcon className={submenuIconClasses}/>, // icon component
        name: 'Add Users', // name that appear in Sidebar
      },
      {
        path: '/dashboard/users/show',
        icon: <MoonIcon className={submenuIconClasses}/>,
        name: 'Show Users',
      },
    ]
  }, 
  {
    path: '', //no url needed as this has submenu
    icon: <UserIcon className={`${iconClasses} inline` }/>, // icon component
    name: 'Students', // name that appear in Sidebar
    submenu : [
      {
        path: '/dashboard/students/create-new', //url
        icon: <UserIcon className={submenuIconClasses}/>, // icon component
        name: 'Add Student', // name that appear in Sidebar
      },
      {
        path: '/dashboard/students/show',
        icon: <MoonIcon className={submenuIconClasses}/>,
        name: 'Show Students',
      },
      {
        path: '/dashboard/students/assigncourse',
        icon: <MoonIcon className={submenuIconClasses}/>,
        name: 'Assign Students',
      }
    ]
  }, 
  {
    path: '', //no url needed as this has submenu
    icon: <UserIcon className={`${iconClasses} inline` }/>, // icon component
    name: 'Exam', // name that appear in Sidebar
    submenu : [
      {
        path: '/dashboard/exams/create-new', //url
        icon: <UserIcon className={submenuIconClasses}/>, // icon component
        name: 'Add Exam', // name that appear in Sidebar
      },
      {
        path: '/dashboard/exam/show',
        icon: <MoonIcon className={submenuIconClasses}/>,
        name: 'Show Exam',
      },
      {
        path: '/dashboard/students/assigncourse',
        icon: <MoonIcon className={submenuIconClasses}/>,
        name: 'Show Question',
      },
    ]
  }, 

  // {
  //   path: '', //no url needed as this has submenu
  //   icon: <Cog6ToothIcon className={`${iconClasses} inline` }/>, // icon component
  //   name: 'Settings', // name that appear in Sidebar
  //   submenu : [
  //     {
  //       path: '/dashboard/settings-profile', //url
  //       icon: <UserIcon className={submenuIconClasses}/>, // icon component
  //       name: 'Profile', // name that appear in Sidebar
  //     },
  //     {
  //       path: '/dashboard/settings-billing',
  //       icon: <WalletIcon className={submenuIconClasses}/>,
  //       name: 'Billing',
  //     },
  //     {
  //       path: '/dashboard/settings-team', // url
  //       icon: <UsersIcon className={submenuIconClasses}/>, // icon component
  //       name: 'Team Members', // name that appear in Sidebar
  //     },
  //   ]
  // },  
]

export default routes


