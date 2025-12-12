interface CommentAttribute {
  id: number;
  productId: number;
  userId: number;
  content: string;
  helpfulCount: number;
  createdAt: Date;
}

class Comment {
  public id!: number;
  public productId!: number;
  public userId!: number;
  public content!: string;
  public helpfulCount!: number;
  public createdAt!: Date;
}
