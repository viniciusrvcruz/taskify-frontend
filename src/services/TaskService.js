import api from "../utils/api";

export class TaskService {
    async create(task) {
        const response = await api.post('/tasks', task)
        return {
            task: response.data
        }
    }

    async findById(taskId) {
        const response = await api.get(`/tasks/${taskId}`)
        return {
            task: response.data
        }
    }

    async update(task) {
        const response = await api.put('/tasks', task)
        return {
            task: response.data
        }
    }

    async delete(taskId) {
        return await api.delete(`/tasks/${taskId}`)
    }

    async findAll(page = 0, size = 10) {
        const response = await api.get(`/tasks?page=${page}&size=${size}&direction=asc`)
        return {
            tasks: response.data._embedded?.taskDtoList ?? [],
            page: response.data.page
        }
    }

    async findByTitle(title, page = 0, size = 10) {
        if(!title) return this.findAll(page, size)

        const response = await api.get(`/tasks/find/title/${title}?page=${page}&size=${size}&direction=asc`)
        return {
            tasks: response.data._embedded?.taskDtoList ?? [],
            page: response.data.page
        }
    }
}