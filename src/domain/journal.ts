export class Journal{
    id: number | null;
    userId: string;
    content: string[];
    createdAt: Date;
  
    constructor(userId: string, content: string[]) {
      this.id = null;  
      this.userId = userId;
      this.content = content;
      this.createdAt = new Date();
    }
}