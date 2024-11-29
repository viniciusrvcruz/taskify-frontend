<script setup>
import { ref } from 'vue';
import { ChecklistService } from '@/services/ChecklistService';
import { Message, FormatDate } from '@/utils/helper';
import { Dialog } from 'primevue';

const visible = ref(false)
const checklist = ref(null)

const show = (checklistId) => {
    checklist.value = null

    const checklistService = new ChecklistService()
    checklistService.findById(checklistId)
        .then((data) => {
            checklist.value = data.checklist
            visible.value = true
        })
        .catch(() => Message('Não foi possível encontrar a checklist!', 'error'))
}

defineExpose({ show })
</script>

<template>
    <Dialog
        v-model:visible="visible"
        modal
        dismissableMask
        :header="'Informações da checklist'"
    >
        <div v-if="checklist" class="flex flex-col max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <div class="flex items-center gap-2 mb-2">
                <i :class="`pi pi-${checklist.isChecked ? 'check-square' : 'stop'} text-gray-500 dark:text-gray-400`"></i>
                {{ checklist.isChecked ? 'Marcada' : 'Desmarcada' }}
                <span v-if="checklist.isChecked">em {{ FormatDate(checklist.checkedAt) }}</span>
            </div>
            <h5 class="mb-2 text-2xl font-semibold tracking-tight text-gray-900 break-all dark:text-white">
                Título: {{ checklist.title }}
            </h5>
            
            <p class="mb-3 break-all">
                Descrição:<span class="font-normal text-gray-500 ms-2 dark:text-gray-400">{{ checklist.description ? checklist.description : 'Sem descrição' }}</span>
            </p>
            <p v-if="checklist.task">
                Tarefa:
                <RouterLink
                    :to="`/tasks/${checklist.task.id}`"
                    class="inline-flex items-center font-medium text-blue-600 hover:underline"
                >
                    {{ checklist.task.title }}
                    <svg class="w-3 h-3 ms-2 rtl:rotate-[270deg]" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                        fill="none" viewBox="0 0 18 18">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M15 11v4.833A1.166 1.166 0 0 1 13.833 17H2.167A1.167 1.167 0 0 1 1 15.833V4.167A1.166 1.166 0 0 1 2.167 3h4.618m4.447-2H17v5.768M9.111 8.889l7.778-7.778" />
                    </svg>
                </RouterLink>
            </p>
            <div v-else class="font-normal text-gray-500 dark:text-gray-400">
                Essa checklist não possui tarefa!
            </div>
        </div>
    </Dialog>
</template>