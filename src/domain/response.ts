export class Response{
    id: number | null;
    userId: string;
    journalId:number | null | undefined;
    response: string;
    createdAt: Date;
  
    constructor(userId: string, journalId: number, response: string) {
      this.id = null;  
      this.userId = userId;
      this.journalId = journalId;
      this.response = response;
      this.createdAt = new Date();
    }
}