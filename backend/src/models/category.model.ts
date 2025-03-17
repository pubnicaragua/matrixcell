export class Category {
    id?: number | null;
    name: string | null;
    code: string | null;
    created_at:  string | Date | null;

    constructor () {
        this.name = null;
        this.code = null;
        this.created_at = null;
    }
}