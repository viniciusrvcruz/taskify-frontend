<script setup>
</script>

<template>
    <footer class="mt-10 bottom-0 left-0 z-20 w-full p-4 bg-white border-t border-gray-200 shadow md:flex md:items-center md:justify-between md:p-6 dark:bg-gray-900 dark:border-gray-600">
        <span class="text-sm text-gray-500 sm:text-center dark:text-gray-400">© {{ new Date().getFullYear() }} <a href="https://flowbite.com/" class="hover:underline">Taskify™</a>. Todos os direitos reservados.
        </span>
        <ul class="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
            <li>
                <a href="#" class="hover:underline me-4 md:me-6">Sobre</a>
            </li>
            <li>
                <a href="#" class="hover:underline me-4 md:me-6">Políticas de privacidade</a>
            </li>
            <li>
                <a href="#" class="hover:underline me-4 md:me-6">Licença</a>
            </li>
            <li>
                <a href="#" class="hover:underline">Contato</a>
            </li>
        </ul>
    </footer>
</template>