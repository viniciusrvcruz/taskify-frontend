<script setup>
import { Button, Paginator } from 'primevue';
import { computed, onBeforeMount, ref, watch } from 'vue';
import { TaskService } from '@/services/TaskService';
import TaskFormModal from '@/components/modals/TaskFormModal.vue';
import { Message, ConfirmMessage } from '@/utils/helper';
import TaskMenu from '@/components/menu/TaskMenu.vue';
import emptyStateTasks from '@/assets/empty_state_tasks.png'

const taskFormModalRef = ref('taskFormModalRef')
const tasks = ref([])
const totalRecords = ref(0)
const currentPage = ref(0)
const size = ref(10)
const searchTask = ref('')
const timeoutId = ref(null)
const pendingRequest = ref(true)

const taskMenuList = ref('taskMenuList')

const findAllTasks = () => {
    pendingRequest.value = true

    const taskService = new TaskService()
    taskService.findByTitle(searchTask.value, currentPage.value, size.value)
        .then((data) => {
            tasks.value = data.tasks
            totalRecords.value = data.page.totalElements
        })
        .catch(() => Message('Algo deu errado ao buscar as tarefas!', 'error'))
        .finally(() => pendingRequest.value = false)
}

watch(() => searchTask.value, () => {
    clearTimeout(timeoutId.value)
    timeoutId.value = setTimeout(() => {
        findAllTasks()
    }, 500)
})

const onPaginatorPage = (event) => {
    size.value = event.rows
    currentPage.value = event.page
    findAllTasks()
}

const deleteTask = async (taskId) => {
    const { isConfirmed } = await ConfirmMessage('Deseja mesmo deletar está tarefa?', 'Não será possível reverter essa ação!')

    if (!isConfirmed) return
    
    const taskService = new TaskService()
    taskService.delete(taskId)
        .then(() => findAllTasks())
        .catch(() => Message('Não foi possível excluir a tarefa!', 'error'))
}

const showEmptyState = computed(() => (!searchTask.value && !timeoutId.value) && !tasks.value.length && !pendingRequest.value)

onBeforeMount(() => {
    findAllTasks()
})
</script>

<template>
    <div
        class="before:absolute before:top-0 before:start-1/2 before:bg-[url('https://preline.co/assets/svg/examples/squared-bg-element.svg')] dark:before:bg-[url('https://preline.co/assets/svg/examples-dark/squared-bg-element.svg')] before:bg-no-repeat before:bg-top before:size-full before:-z-[1] before:transform before:-translate-x-1/2">
        <div class="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-5">

            <div class="max-w-xl mx-auto mt-5 text-center">
                <h1 class="block text-4xl font-bold text-gray-800 md:text-5xl lg:text-6xl dark:text-gray-200">
                    Tarefas
                </h1>
            </div>

            <div class="max-w-3xl mx-auto mt-5 text-center">
                <p class="text-lg text-gray-600 dark:text-gray-400">Organize suas atividades diárias com facilidade! Adicione e gerencie suas tarefas de forma prática e rápida.</p>
            </div>

            <div class="flex flex-col items-center gap-3 mt-4">
                <Button
                    class="inline-flex items-center justify-center px-4 py-3 text-sm font-medium text-center text-white border border-transparent rounded-full gap-x-3 bg-gradient-to-tl from-blue-600 to-violet-600 hover:from-violet-600 hover:to-blue-600 focus:outline-none focus:from-violet-600 focus:to-blue-600"
                    @click="taskFormModalRef.show()">
                    Criar nova tarefa
                </Button>

                <form v-if="!showEmptyState" class="w-full flex justify-center mt-4">
                    <div class="relative w-1/2 flex justify-center">
                        <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                            <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                            </svg>
                        </div>
                        <input
                            v-model="searchTask"
                            type="search"
                            class="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                            placeholder="Pesquise uma tarefa"
                            required
                        />
                    </div>
                </form>
            </div>
        </div>
    </div>
    <div v-if="showEmptyState" class="flex flex-col items-center justify-center">
        <h3 class="text-lg font-bold md:text-2xl md:leading-tight dark:text-white">
            Você ainda não possui nenhuma tarefa!
        </h3>
        <img :src="emptyStateTasks" alt="Empty state tasks" class="size-80">
        <p class="text-gray-600 text-start dark:text-gray-400">
            Adicione uma tarefa para se organizar melhor.
        </p>
    </div>
    <div v-else class="max-w-[90rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-10 mx-auto">
        <div v-if="tasks.length" class="grid grid-cols-2 gap-5 lg:grid-cols-4 sm:grid-cols-3">
            <RouterLink v-for="task in tasks" :to="`/tasks/${task.id}`" :key="task.id"
                class="flex flex-col justify-center p-4 group hover:bg-gray-50 focus:outline-none focus:bg-gray-50 rounded-xl md:p-7 dark:hover:bg-gray-800 dark:focus:bg-gray-800">
                <div>
                    <div class="flex items-start justify-between">
                        <h3
                            class="flex-1 text-lg font-semibold text-gray-800 truncate group-hover:text-gray-600 dark:text-white dark:group-hover:text-gray-400">
                            {{ task.title }}
                        </h3>
                        <button class="px-1 rounded" @click.stop.prevent="taskMenuList.show($event, task)">
                            <i class="pi pi-ellipsis-v"></i>
                        </button>
                    </div>
                    <p class="mt-1 text-gray-600 truncate dark:text-gray-400">{{ task.description ? task.description : 'Sem descrição' }}</p>
                    <span
                        class="mt-2 inline-flex items-center gap-x-1.5 text-sm text-blue-600 decoration-2 group-hover:underline group-focus:underline font-medium">
                        Visualizar tarefa
                        <svg class="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                            stroke-linecap="round" stroke-linejoin="round">
                            <path d="m9 18 6-6-6-6" />
                        </svg>
                    </span>
                </div>
            </RouterLink>
            <TaskMenu ref="taskMenuList" @edit="taskFormModalRef.show" @delete="deleteTask" />
        </div>
        <div v-else-if="pendingRequest" class="grid grid-cols-2 gap-5 lg:grid-cols-4 sm:grid-cols-3">
            <div v-for="index in 5" class="shadow p-4 w-56 mx-auto" :key="index">
                <div class="animate-pulse flex space-x-4">
                    <div class="flex-1 space-y-6 py-1">
                    <div class="h-2 bg-slate-700 rounded"></div>
                    <div class="space-y-3">
                        <div class="grid grid-cols-3 gap-4">
                        <div class="h-2 bg-slate-700 rounded col-span-2"></div>
                        <div class="h-2 bg-slate-700 rounded col-span-1"></div>
                        </div>
                        <div class="h-2 bg-slate-700 rounded"></div>
                    </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-else>
            Nenhuma tarefa foi encontrada!
        </div>
        <Paginator
            class="mt-5"
            :rows="10"
            :totalRecords="totalRecords"
            :rowsPerPageOptions="[10, 20, 30]"
            @page="onPaginatorPage"
        >
        </Paginator>
    </div>
    <TaskFormModal ref="taskFormModalRef" @submit="findAllTasks" />
</template>