<script setup>
import { Button, Menu, Paginator } from 'primevue';
import { onMounted, provide, ref } from 'vue';
import { TaskService } from '@/services/TaskService';
import { useRoute, useRouter } from 'vue-router';
import { Message, ConfirmMessage } from '@/utils/helper';
import { ChecklistService } from '@/services/ChecklistService';
import emptyStateChecklist from '@/assets/empty_state_checklists.png'
import ChecklistFormModal from '@/components/modals/ChecklistFormModal.vue';
import TaskFormModal from '@/components/modals/TaskFormModal.vue';
import ChecklistMenu from '@/components/menu/ChecklistMenu.vue';
import ChecklistCard from '@/components/cards/ChecklistCard.vue';
import ChecklistDetails from '@/components/modals/ChecklistDetails.vue';

const route = useRoute()
const router = useRouter()

const taskChecklistMenu = ref()

const checklistFormModalRef = ref('checklistFormModalRef')
const taskFormModalRef = ref('taskFormModalRef')
const checklistDetailsRef = ref('checklistDetailsRef')

const task = ref(null)
const checklists = ref([])
const totalRecords = ref(0)
const currentPage = ref(0)
const size = ref(10)

const findTask = () => {
    const taskService = new TaskService()
    taskService.findById(route.params.id)
        .then((data) => {
            task.value = data.task
            findChecklists()
        })
        .catch(() => {
            Message("Não foi possível encontrar a tarefa!", 'error')
            router.push('/')
        })
}

const findChecklists = () => {
    const checklistService = new ChecklistService()
    checklistService.findByTaskId(route.params.id, currentPage.value, size.value)
        .then((data) => {
            checklists.value = data.checklists
            totalRecords.value = data.page.totalElements
        })
        .catch(() => {
            Message("Não foi possível encontrar as checklists!", 'error')
        })
}

const deleteChecklist = async (taskId) => {
    const { isConfirmed } = await ConfirmMessage('Deseja mesmo deletar?', 'Não será possível reverter essa ação!')

    if (!isConfirmed) return

    const checklistService = new ChecklistService()
    checklistService.delete(taskId)
        .then(() => findChecklists())
        .catch(() => Message('Não foi possível excluir a checklist!', 'error'))
}

const onPaginatorPage = (event) => {
    size.value = event.rows
    currentPage.value = event.page
    findChecklists()
}

const openMenu = (event, checklist) => {
    taskChecklistMenu.value.show(event, checklist)
}

provide('openMenuChecklist', openMenu)
provide('findChecklists', findChecklists)

onMounted(() => {
    findTask()
})
</script>

<template>
    <div class="py-10">
        <div class="max-w-2xl mx-auto mb-10 text-center lg:mb-14">
            <h2 class="text-2xl font-bold md:text-4xl md:leading-tight dark:text-white">{{ task?.title }}</h2>
            <p class="mt-1 text-gray-600 dark:text-gray-400">{{ task?.description }}</p>
            <div class="flex justify-center gap-3 mt-4">
                <Button
                    class="inline-flex items-center justify-center px-4 py-3 text-sm font-medium text-center text-white border border-transparent rounded-full gap-x-3 bg-gradient-to-tl from-blue-600 to-violet-600 hover:from-violet-600 hover:to-blue-600 focus:outline-none focus:from-violet-600 focus:to-blue-600"
                    @click="checklistFormModalRef.show(null, task)">
                    Criar nova checklist
                </Button>
                <Button
                    class="inline-flex items-center justify-center px-4 py-3 text-sm font-medium text-center text-white border border-transparent rounded-full gap-x-3 dark:bg-gray-800 dark:hover:bg-gray-700 dark:border-gray-700"
                    @click="taskFormModalRef.show(task)">
                    Editar tarefa
                </Button>
            </div>
        </div>
        <div v-if="checklists.length" class="max-w-[85rem] px-4 sm:px-6 lg:px-8 mx-auto">
            <h3 class="mb-5 text-xl font-bold md:text-2xl md:leading-tight dark:text-white">Checklists</h3>
            <div class="grid items-center gap-6 sm:grid-cols-1 lg:grid-cols-1">
                <ChecklistCard v-for="checklist in checklists" :checklist="checklist" :key="checklist.id" :showTask="false" />
                <ChecklistMenu
                    ref="taskChecklistMenu"
                    @edit="checklistFormModalRef.show($event, task)"
                    @delete="deleteChecklist"
                    @view="checklistDetailsRef.show($event.id)"
                />
                <ChecklistDetails ref="checklistDetailsRef" />
            </div>
            <Paginator class="mt-5" :rows="10" :totalRecords="totalRecords" :rowsPerPageOptions="[10, 20, 30]"
                @page="onPaginatorPage">
            </Paginator>
        </div>
        <div v-else class="flex flex-col items-center justify-center">
            <h3 class="text-lg font-bold md:text-2xl md:leading-tight dark:text-white">Essa tarefa não possui nenhuma
                checklist</h3>
            <img :src="emptyStateChecklist" alt="No checklist" class="size-80">
            <p class="text-gray-600 text-start dark:text-gray-400">
                Adicione uma checklist para essa tarefa.
            </p>
        </div>
        <ChecklistFormModal ref="checklistFormModalRef" @submit="findChecklists" />
        <TaskFormModal ref="taskFormModalRef" @submit="findTask" />
    </div>
</template>