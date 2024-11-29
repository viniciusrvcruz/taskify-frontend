<script setup>
import { Button, Dialog, InputText, Select, Textarea } from 'primevue';
import { computed, ref } from 'vue';
import { TaskService } from '@/services/TaskService';
import { required } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';
import { ChecklistService } from '@/services/ChecklistService';
import { Message } from '@/utils/helper';

const FORM_LAYOUT = {
    title: null,
    description: null,
    isChecked: false,
    task: null
}

const emits = defineEmits(['submit'])

const form = ref({ ...FORM_LAYOUT })
const visible = ref(false)
const tasks = ref([])
const totalPages = ref(10)
const currentPage = ref(0)
const saveWithTask = ref(false)

const rules = computed(() => ({
    title: {
        required
    },
}))

const v$ = useVuelidate(rules, form)

const show = (checklist = null, task = null) => {
    form.value = {
        ...FORM_LAYOUT,
        ...checklist
    }

    if(task) form.value.task = {...task}

    if (form.value.task) delete form.value.task._links

    findAllTasks()
    visible.value = true
    saveWithTask.value = Boolean(task)

    setTimeout(() => {
        document.getElementById('title_checklist').focus()
    }, 200)
}

const findAllTasks = (page) => {
    if (page >= totalPages.value) return

    const taskService = new TaskService()
    taskService.findAll(page)
        .then((data) => {
            totalPages.value = data.page.totalPages
            tasks.value.push(...data.tasks.map(task => ({
                id: task.id,
                title: task.title,
                description: task.description
            })))

            if (form.value.task?.id && !tasks.value.some(task => task.id === form.value.task.id)) {
                tasks.value.push(form.value.task)
            }
        })
}

const onLazyLoad = (event) => {
    if (!event.first) return

    currentPage.value = currentPage.value + 1
    findAllTasks(currentPage.value)
}

const saveChecklist = () => {
    v$.value.$touch()

    if (v$.value.$invalid) return

    const checklistService = new ChecklistService()
    const action = form.value.id ? checklistService.update : checklistService.create

    action(form.value)
        .then(() => {
            Message(`Checklist ${form.value.id ? 'editada' : 'criada'} com sucesso!`)
            emits('submit')
        })
        .catch(() => Message(`Não foi possível ${form.value.id ? 'editar' : 'criar'} a checklist!`, 'error'))
        .finally(() => visible.value = false)
}

const resetForm = () => {
    v$.value.$reset()
    form.value = { ...FORM_LAYOUT }
}

defineExpose({ show })

</script>

<template>
    <Dialog v-model:visible="visible" modal dismissableMask
        :header="`${form.id ? 'Editar checklist' : 'Criar checklist'}`" @hide="resetForm">
        <form @submit.prevent="saveChecklist">
            <div class="flex flex-col gap-3 mb-2">
                <label class="w-24 font-semibold">Título</label>
                <InputText v-model="form.title" type="text" id="title_checklist" class="focus:border-blue-600 truncate"
                    maxLength="50" :class="{ 'invalid-input': v$.title.$error }" />
                <p v-if="v$.title.$error" class="text-sm text-red-600 dark:text-red-500">
                    O título é obrigatório!
                </p>
            </div>
            <div class="flex flex-col gap-3 mb-2">
                <label class="w-24 font-semibold truncate">Descrição</label>
                <Textarea v-model="form.description" maxLength="200" rows="3" cols="30" class="focus:border-blue-600" />
            </div>
            <div v-if="!saveWithTask" class="flex flex-col gap-3 mb-8">
                <label class="w-24 font-semibold">Tarefa</label>
                <Select
                    v-model="form.task"
                    optionLabel="title"
                    placeholder="Selecione uma tarefa"
                    class="w-full"
                    showClear
                    :options="tasks"
                    :virtualScrollerOptions="{
                        lazy: true,
                        onLazyLoad: onLazyLoad,
                        itemSize: 40,
                        delay: 250,
                    }" />
            </div>
            <div class="flex justify-end gap-2">
                <Button type="button" label="Cancelar" severity="secondary" @click="visible = false"></Button>
                <Button type="button" label="Salvar"
                    class="text-white border-none bg-gradient-to-tl from-blue-600 to-violet-600 hover:from-violet-600 hover:to-blue-600 focus:outline-none focus:from-violet-600 focus:to-blue-600"
                    @click="saveChecklist"></Button>
            </div>
        </form>
    </Dialog>
</template>