<script setup>
import { Button, Paginator } from 'primevue';
import { onBeforeMount, provide, ref } from 'vue';
import { ChecklistService } from '@/services/ChecklistService';
import { Message, ConfirmMessage } from '@/utils/helper';
import ChecklistFormModal from '@/components/modals/ChecklistFormModal.vue';
import ChecklistCard from '@/components/cards/ChecklistCard.vue';
import ChecklistMenu from '@/components/menu/ChecklistMenu.vue';
import ChecklistDetails from '@/components/modals/ChecklistDetails.vue';

const checklistFormModalRef = ref('checklistFormModalRef')
const checklistMenu = ref('checklistMenu')
const checklistDetailsRef = ref('checklistDetailsRef')
const checklists = ref([])
const totalRecords = ref(0)
const currentPage = ref(0)
const size = ref(10)

const findAllChecklists = () => {
    const checklistService = new ChecklistService()
    checklistService.findAll(currentPage.value, size.value)
        .then((data) => {
            checklists.value = data.checklists
            totalRecords.value = data.page.totalElements
        })
        .catch(() => Message('Algo deu errado ao buscar as checklists!', 'error'))
}

const openMenu = (event, checklist) => {
    checklistMenu.value.show(event, checklist)
}

const onPaginatorPage = (event) => {
    size.value = event.rows
    currentPage.value = event.page
    findAllChecklists()
}

const deleteChecklist = async (taskId) => {
    const { isConfirmed } = await ConfirmMessage('Deseja mesmo deletar?', 'Não será possível reverter essa ação!')

    if (!isConfirmed) return

    const checklistService = new ChecklistService()
    checklistService.delete(taskId)
        .then(() => findAllChecklists())
        .catch(() => Message('Não foi possível excluir a checklist!', 'error'))
}

provide('openMenuChecklist', openMenu)
provide('findChecklists', findAllChecklists)

onBeforeMount(() => {
    findAllChecklists()
})

</script>

<template>
    <div
        class="before:absolute before:top-0 before:start-1/2 before:bg-[url('https://preline.co/assets/svg/examples/squared-bg-element.svg')] dark:before:bg-[url('https://preline.co/assets/svg/examples-dark/squared-bg-element.svg')] before:bg-no-repeat before:bg-top before:size-full before:-z-[1] before:transform before:-translate-x-1/2">
        <div class="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-5">

            <div class="max-w-xl mx-auto mt-5 text-center">
                <h1 class="block text-4xl font-bold text-gray-800 md:text-5xl lg:text-6xl dark:text-gray-200">
                    Checklists
                </h1>
            </div>

            <div class="max-w-3xl mx-auto mt-5 text-center">
                <p class="text-lg text-gray-600 dark:text-gray-400">Organize suas tarefas de forma eficiente com as checklists, garantindo produtividade e controle em cada etapa do seu dia.</p>
            </div>

            <div class="flex justify-center gap-3 mt-4">
                <Button
                    class="inline-flex items-center justify-center px-4 py-3 text-sm font-medium text-center text-white border border-transparent rounded-full gap-x-3 bg-gradient-to-tl from-blue-600 to-violet-600 hover:from-violet-600 hover:to-blue-600 focus:outline-none focus:from-violet-600 focus:to-blue-600"
                    @click="checklistFormModalRef.show()">
                    Criar nova checklist
                </Button>
            </div>
        </div>
    </div>
    <div class="max-w-[90rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-full">
        <div class="flex flex-col flex-1">
            <ChecklistCard v-for="checklist in checklists" :checklist="checklist" :key="checklist.id" />
            <ChecklistMenu
                ref="checklistMenu"
                @edit="checklistFormModalRef.show($event)"
                @delete="deleteChecklist"
                @view="checklistDetailsRef.show($event.id)"
            />
            <ChecklistDetails ref="checklistDetailsRef" />
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
    <ChecklistFormModal ref="checklistFormModalRef" @submit="findAllChecklists" />
</template>