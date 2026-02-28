interface CommentAttribute {
  id: number;
  productId: number;
  userId: string;
  content: string;
  helpfulCount: number;
  createdAt: Date;
}

class Comment {
  public id!: number;
  public productId!: number;
  public userId!: string;
  public content!: string;
  public helpfulCount!: number;
  public createdAt!: Date;
}
