interface CommentAttribute {
  id: number;
  productId: number;
  userId: string;
  content: string;
  helpfulCount: number;
  createdAt: Date;
}

class Comment {
  declare id: number;
  declare productId: number;
  declare userId: string;
  declare content: string;
  declare likesCount: number;
  declare createdAt: Date;
}
