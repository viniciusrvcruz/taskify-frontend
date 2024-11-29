<script setup>
import { ChecklistService } from '@/services/ChecklistService';
import { Message } from '@/utils/helper';
import { Button } from 'primevue';
import { inject } from 'vue';

const findChecklists = inject('findChecklists')
const openMenuChecklist = inject('openMenuChecklist')

const props = defineProps({
    checklist: {
        type: Object,
        required: true
    },
    showTask: {
        type: Boolean,
        required: false,
        default: true
    }
})

const checkChecklist = () => {
    const checklistService = new ChecklistService()

    let checklistToggleIsCheck = { ...props.checklist }

    checklistToggleIsCheck.isChecked = !props.checklist.isChecked

    checklistService.update(checklistToggleIsCheck)
        .catch(() => Message(`Não foi possível marcar a checklist!`, 'error'))
        .finally(() => findChecklists())
}

</script>

<template>
    <button
        class="flex items-center justify-between p-5 rounded-lg group gap-y-6 gap-x-4 size-full hover:bg-gray-100 focus:outline-none dark:hover:bg-gray-800"
        @click="checkChecklist(checklist)">
        <input type="checkbox" class="cursor-pointer blue-800 size-7" :checked="checklist.isChecked" @click.stop
            @change="checkChecklist(checklist)">
        <div class="flex items-center justify-between flex-1 gap-5">
            <div>
                <h3 class="block font-bold text-gray-800 text-start break-all dark:text-white">
                    {{ checklist.title }}
                </h3>
                <p class="text-gray-600 text-start break-all dark:text-gray-400">
                    {{ checklist.description }}
                </p>
            </div>
            <div class="flex items-center">
                <span v-if="showTask && checklist.task" class="bg-gray-100 text-gray-800 text-xs font-medium me-5 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300">{{ checklist.task.title }}</span>
                <Button type="button" icon="pi pi-ellipsis-v" aria-haspopup="true" aria-controls="overlay_menu"
                    size="small"
                    class="text-white bg-gray-800 hover:bg-gray-900 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:border-gray-700"
                    @click.stop="openMenuChecklist($event, checklist)" />
            </div>
        </div>
    </button>
</template>