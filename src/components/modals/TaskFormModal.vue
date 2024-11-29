<script setup>
import { Button, Dialog, InputText, Textarea } from 'primevue';
import { computed, ref } from 'vue';
import { required } from '@vuelidate/validators'
import { TaskService } from '@/services/TaskService';
import { Message } from '@/utils/helper';
import useVuelidate from '@vuelidate/core';

const FORM_LAYOUT = {
    title: null,
    description: null
}

const emits = defineEmits(['submit'])

const form = ref({ ...FORM_LAYOUT })
const visible = ref(false)

const rules = computed(() => ({
    title: {
        required
    },
}))

const v$ = useVuelidate(rules, form)

const show = (task = {}) => {
    form.value = { ...task }
    visible.value = true

    setTimeout(() => {
        document.getElementById('title_task').focus()
    }, 200)
}

const saveTask = () => {
    v$.value.$touch()

    if (v$.value.$invalid) return

    const taskService = new TaskService()
    const action = form.value.id ? taskService.update : taskService.create

    action(form.value)
        .then(() => {
            Message(`Tarefa ${form.value.id ? 'editada' : 'criada'} com sucesso!`)
            emits('submit')
        })
        .catch(() => Message(`Não foi possível ${form.value.id ? 'editar' : 'criar'} a tarefa!`, 'error'))
        .finally(() => visible.value = false)
}

const resetForm = () => {
    v$.value.$reset()
    form.value = { ...FORM_LAYOUT }
}

defineExpose({ show })

</script>

<template>
    <Dialog v-model:visible="visible" modal dismissableMask :header="`${form.id ? 'Editar tarefa' : 'Criar tarefa'}`"
        @hide="resetForm">
        <form>
            <div class="flex flex-col gap-2 mb-2">
                <label for="email" class="w-24 font-semibold">Título</label>
                <InputText type="text" v-model="form.title" class="focus:border-blue-600" id="title_task"
                    maxLength="50" :class="{ 'invalid-input': v$.title.$error}" />
                <p v-if="v$.title.$error" class="text-sm text-red-600 dark:text-red-500">
                    O título é obrigatório!
                </p>
            </div>
            <div class="flex flex-col gap-2 mb-2">
                <label for="email" class="w-24 font-semibold">Descrição</label>
                <Textarea v-model="form.description" maxLength="200" rows="3" cols="30" class="focus:border-blue-600" />
            </div>
            <div class="flex justify-end gap-2">
                <Button type="button" label="Cancelar" severity="secondary" @click="visible = false"></Button>
                <Button type="click" label="Salvar"
                    class="text-white border-none bg-gradient-to-tl from-blue-600 to-violet-600 hover:from-violet-600 hover:to-blue-600 focus:outline-none focus:from-violet-600 focus:to-blue-600"
                    @click.prevent="saveTask">
                </Button>
            </div>
        </form>
    </Dialog>
</template>