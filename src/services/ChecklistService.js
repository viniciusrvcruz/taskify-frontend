import api from "../utils/api";

export class ChecklistService {
    async create(checklist) {
        const response = await api.post('/checklists', checklist)
        return {
            checklist: response.data
        }
    }

    async findById(checklistId) {
        const response = await api.get(`/checklists/${checklistId}`)
        return {
            checklist: response.data
        }
    }

    async update(checklist) {
        const response = await api.put('/checklists', checklist)
        return {
            checklist: response.data
        }
    }

    async delete(checklistId) {
        return await api.delete(`/checklists/${checklistId}`)
    }

    async findAll(page = 0, size = 10) {
        const response = await api.get(`/checklists?page=${page}&size=${size}&direction=asc`)
        return {
            checklists: response.data._embedded?.checklistDtoList ?? [],
            page: response.data.page
        }
    }

    async findByTaskId(taskId, page = 0, size = 10) {
        const response = await api.get(`/checklists/find/task/${taskId}?page=${page}&size=${size}&direction=asc`)
        return {
            checklists: response.data._embedded?.checklistDtoList ?? [],
            page: response.data.page
        }
    }
}