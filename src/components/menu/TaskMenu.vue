<script setup>
import { Menu } from 'primevue';
import { ref } from 'vue';

const emits = defineEmits(['edit', 'delete'])

const currentTask = ref(null)
const taskMenu = ref('taskMenu')
const taskMenuItems = ref([
    {
        label: 'Editar',
        icon: 'pi pi-pencil',
        command: () => emits('edit', currentTask.value)
    },
    {
        label: 'Excluir',
        icon: 'pi pi-trash',
        command: () => emits('delete', currentTask.value.id)
    },
]);

const show = (event, task) => {
    currentTask.value = { ...task }
    taskMenu.value.toggle(event)
}

defineExpose({ show })

</script>

<template>
    <Menu ref="taskMenu" id="overlay_menu" :model="taskMenuItems" :popup="true" />
</template>