<script setup>
import { Menu } from 'primevue';
import { ref } from 'vue';

const emits = defineEmits(['edit', 'delete', 'view'])

const currentChecklist = ref(null)
const menuChecklistRef = ref('menuChecklistRef')
const menuItems = ref([
    {
        label: 'Editar',
        icon: 'pi pi-pencil',
        command: () => emits('edit', currentChecklist.value)
    },
    {
        label: 'Ver mais informações',
        icon: 'pi pi-info-circle',
        command: () => emits('view', currentChecklist.value)
    },
    {
        label: 'Excluir',
        icon: 'pi pi-trash',
        command: () => emits('delete', currentChecklist.value.id)
    },
]);

const show = (event, checklist) => {
    currentChecklist.value = { ...checklist }
    menuChecklistRef.value.toggle(event)
}

defineExpose({ show })

</script>

<template>
    <Menu ref="menuChecklistRef" id="overlay_menu" :model="menuItems" :popup="true" />
</template>