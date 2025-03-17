import { Category } from "../models/category.model";

export const CategoryResource = {
    formatResource(category: Category) {
        return {
            id: category.id,
            created_at: category.created_at,
            name: category.name,
            code: category.code
        }
    },

    formatCategory(categories: Category[]) {
        return categories.map(category => CategoryResource.formatResource(category))
    }
}