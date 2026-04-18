export interface Article {
  id: string;
  slug: string;
  title: string;
  date: string;
  category: string;
  image?: string;
  video?: string;
  author: string;
  authorRole?: string;
  excerpt: string;
  content: string;
  readingTime: string;
  imageCredit?: string;
  source?: string;
  views: number;
  likes: number;
  commentsCount?: number;
  tags?: string[];
  // SEO & Social
  seoTitle?: string;
  seoDescription?: string;
  socialImage?: string;
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
  imageCredit?: string;
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
  // Ads
  adSlotHeader?: string;
  adSlotSidebar?: string;
  adSlotFooter?: string;
  // Breaking News
  urgentBannerText?: string;
  urgentBannerActive?: boolean;
  urgentBannerLink?: string;
  // Categories
  categories: string[];
  // Maintenance
  maintenanceMode: boolean;
}

export interface Subscriber {
  id: string;
  email: string;
  date: string;
}

export interface MediaAsset {
  id: string;
  url: string;
  type: 'image' | 'video';
  date: string;
  fileName?: string;
}

export interface SiteStats {
  views: number;
}
