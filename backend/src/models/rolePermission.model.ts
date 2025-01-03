export class RolePermission {
    id?: number|null;
    role_id: number | null;
    permission_id: number | null;
  
    constructor() {
      this.id =null;
      this.role_id = null;
      this.permission_id = null;
    }
  }