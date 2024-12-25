import { createRouter, createWebHistory } from 'vue-router';
import RegisterForm from '../components/RegisterForm';
import AuthForm from '../components/AuthForm.vue';
import PasswordReset from '../components/PasswordReset.vue';
import IndexPage from '../components/IndexPage.vue';
import PasswordResetConfirm from '../components/PasswordResetConfirm.vue';
import UserProfile from '@/components/UserProfile.vue';
import EditProfile from '@/components/EditProfile.vue';
import EditPassword from '@/components/EditPassword.vue';
import TasksList from '@/components/TasksList.vue';
import TaskDetail from '@/components/TaskDetail.vue';
import MyTasks from '@/components/MyTasks.vue';
import CreateTask from '@/components/CreateTask.vue';
import AssignTask from '@/components/AssignTask.vue';
import MyRewards from '@/components/MyRewards.vue';
import ReportsList from '@/components/ReportsList.vue';
import CreateReport from '@/components/CreateReport.vue';
import CreateReward from '@/components/CreateReward.vue';
import NotFound from '@/components/NotFound.vue';

function isAuthenticated() {
  const token = localStorage.getItem('access_token');
  return !!token;
}

function isManager() {
  return localStorage.getItem('is_manager') === 'true';  
}

const routes = [
  {
    path: '/',
    redirect: () => {
      return isAuthenticated() ? '/index' : '/auth';
    },
  },
  { 
    path: '/register', component: RegisterForm, beforeEnter: (to, from, next) => {
    if (isAuthenticated()) {
      next('/');
    } else {
      next();
    }
  }},
  { 
    path: '/auth', component: AuthForm, props: route => ({ registrationSuccess: route.query.success || false }), name: 'auth' , beforeEnter: (to, from, next) => {
    if (isAuthenticated()) {
      next('/');
    } else {
      next();
    }
  }},
  { 
    path: '/reset-password', component: PasswordReset, beforeEnter: (to, from, next) => {
    if (isAuthenticated()) {
      next('/');
    } else {
      next();
    }
  }},
  {
    path: '/password-reset-confirm/:uidb64/:token',
    component: PasswordResetConfirm,
    props: true,
  },
  { 
    path: '/index', component: IndexPage, name: 'index', beforeEnter: (to, from, next) => {
    if (isAuthenticated()) {
      next();
    } else {
      next('/auth');
    }
  }},
  {
    path: '/profile', component: UserProfile, name: 'profile', beforeEnter: (to, from, next) => {
      if (isAuthenticated()) {
        next();
      }
      else {
        next('/auth');
      }
    }
  },
  {
    path: '/edit-profile', component: EditProfile, name: 'edit-profile', beforeEnter: (to, from, next) => {
      if (isAuthenticated()) {
        next();
      }
      else {
        next('/auth');
      }
    }
  },
  {
    path: '/edit-password', component: EditPassword, name: 'edit-password', beforeEnter: (to, from, next) => {
      if (isAuthenticated()) {
        next();
      }
      else {
        next('/auth');
      }
    }
  },  
  {
    path: '/tasks-list', component: TasksList, name: 'tasks-list', beforeEnter: (to, from, next) => {
      if (isAuthenticated()) {
        next();
      }
      else {
        next('/auth');
      }
    }
  },  
  {
    path: '/tasks/:id', component: TaskDetail, name: 'task-detail', beforeEnter: (to, from, next) => {
      if (isAuthenticated()) {
        next();
      }
      else {
        next('/auth');
      }
    }
  },
  {
    path: '/my-tasks', component: MyTasks, name: 'my-tasks', beforeEnter: (to, from, next) => {
      if (isAuthenticated()) {
        if (!isManager()) {
          next();
        }
        else {
          next('/');
        }
      }
      else {
        next('/auth');
      }
    }
  },
  {
    path: '/create-task', component: CreateTask, name: 'create-task', beforeEnter: (to, from, next) => {
      if (isAuthenticated()) {
        if (isManager()) {
          next();
        }
        else {
          next('/');
        }
      }
      else {
        next('/auth');
      }
    }
  },
  {
    path: '/assign-task/:id', component: AssignTask, name: 'assign-task', beforeEnter: (to, from, next) => {
      if (isAuthenticated()) {
        if (isManager()) {
          next();
        }
        else {
          next('/');
        }
      }
      else {
        next('/auth');
      }
    }
  },
  {
    path: '/my-rewards', component: MyRewards, name: 'my-rewards', beforeEnter: (to, from, next) => {
      if (isAuthenticated()) {
        if (!isManager()) {
          next();
        }
        else {
          next('/');
        }
      }
      else {
        next('/auth');
      }
    }
  },
  {
    path: '/reports', component: ReportsList, name: 'reports', beforeEnter: (to, from, next) => {
      if (isAuthenticated()) {
        next();
      }
      else {
        next('/auth');
      }
    }
  },
  {
    path: '/create-report/:id', component: CreateReport, name: 'create-report', beforeEnter: (to, from, next) => {
      if (isAuthenticated()) {
        if (!isManager()) {
          next();
        }
        else {
          next('/');
        }
      }
      else {
        next('/auth');
      }
    }
  },
  {
    path: '/create-reward/:id', component: CreateReward, name: 'create-reward', beforeEnter: (to, from, next) => {
      if (isAuthenticated()) {
        if (isManager()) {
          next();
        }
        else {
          next('/');
        }
      }
      else {
        next('/auth');
      }
    }
  },
  {
    path: '/:pathMatch(.*)*', component: NotFound, name: 'not-found'
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

