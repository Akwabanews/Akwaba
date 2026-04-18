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
  articleId: string;
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

export interface SiteSettings {
  aboutText: string;
  email: string;
  phone: string;
  address: string;
  facebookUrl?: string;
  twitterUrl?: string;
  instagramUrl?: string;
}

export interface SiteStats {
  views: number;
}
