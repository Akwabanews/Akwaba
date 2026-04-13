export interface Article {
  id: string;
  slug: string;
  title: string;
  date: string;
  category: 'Afrique' | 'Monde' | 'Économie' | 'Politique' | 'Tech' | 'Culture' | 'Urgent';
  image?: string;
  video?: string;
  author: string;
  authorRole?: string;
  excerpt: string;
  content: string;
  readingTime: string;
  views: number;
  likes: number;
  commentsCount?: number;
  tags?: string[];
}

export interface Comment {
  id: string;
  username: string;
  date: string;
  content: string;
  likes: number;
  replies: Comment[];
}

export interface Event {
  id: string;
  slug: string;
  title: string;
  date: string;
  location: string;
  category: string;
  image?: string;
  video?: string;
  excerpt: string;
  content: string;
}
