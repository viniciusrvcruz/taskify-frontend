import { createWebHistory, createRouter } from 'vue-router'

import TaskList from '@/views/task/TaskList.vue'
import TaskDetails from '@/views/task/TaskDetails.vue'
import ChecklistList from '@/views/checklist/ChecklistList.vue'
import ChecklistDetails from '@/views/checklist/ChecklistDetails.vue'

const routes = [
  // Task
  { path: '/tasks', component: TaskList },
  { path: '/tasks/:id', component: TaskDetails },
  // Checklist
  { path: '/checklists', component: ChecklistList },
  { path: '/checklists/:id', component: ChecklistDetails },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})