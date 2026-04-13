import { Article } from './types';
import matter from 'gray-matter';
import { Buffer } from 'buffer';

// Polyfill Buffer for gray-matter in the browser environment
if (typeof window !== 'undefined' && !window.Buffer) {
  window.Buffer = Buffer;
}

// Import all markdown files from the articles directory recursively
const articleFiles = (import.meta as any).glob('./articles/**/*.md', { query: '?raw', eager: true });

export const MOCK_ARTICLES: Article[] = Object.entries(articleFiles).map(([path, content], index) => {
  try {
    const { data, content: body } = matter((content as any).default || content);
    const slug = path.split('/').pop()?.replace('.md', '') || `article-${index}`;
    
    return {
      id: String(index + 1),
      slug,
      title: data.title || 'Sans titre',
      date: data.date || new Date().toISOString(),
      category: data.category || 'Afrique',
      image: data.image || 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=2074&auto=format&fit=crop',
      author: data.author || 'Rédaction',
      authorRole: data.authorRole || 'Journaliste',
      excerpt: data.excerpt || '',
      content: body || '',
      readingTime: data.readingTime || '2 min',
      views: data.views || 0,
      likes: data.likes || 0,
      commentsCount: data.commentsCount || 0,
      tags: Array.isArray(data.tags) ? data.tags : (data.tags ? String(data.tags).split(',').map(t => t.trim()) : []),
    } as Article;
  } catch (error) {
    console.error(`Error parsing article at ${path}:`, error);
    return null;
  }
}).filter((a): a is Article => a !== null).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
