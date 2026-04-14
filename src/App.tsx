import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  Search, 
  Heart, 
  Share2, 
  Clock, 
  Eye, 
  ChevronRight, 
  ChevronLeft,
  ArrowLeft,
  Home,
  Globe,
  Map,
  User,
  MessageSquare,
  X,
  Send,
  CreditCard,
  Smartphone,
  Facebook,
  Twitter,
  Linkedin,
  TrendingUp,
  Filter,
  Bell,
  BellRing,
  Languages,
  Calendar
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useSpring } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { MOCK_ARTICLES, MOCK_EVENTS } from './constants';
import { Article, Comment, Event } from './types';
import { cn } from './lib/utils';

// --- Components ---

const Badge = ({ children, category }: { children: React.ReactNode; category?: string }) => {
  const colors: Record<string, string> = {
    'Afrique': 'bg-orange-500 text-white',
    'Monde': 'bg-blue-500 text-white',
    'Tech': 'bg-slate-500 text-white',
    'Économie': 'bg-emerald-600 text-white',
    'Politique': 'bg-red-600 text-white',
    'Culture': 'bg-amber-500 text-white',
    'Urgent': 'bg-red-700 text-white animate-pulse',
    'Science': 'bg-purple-600 text-white',
    'Santé': 'bg-teal-500 text-white',
    'Histoire': 'bg-stone-600 text-white',
    'Sport': 'bg-indigo-600 text-white',
  };

  return (
    <span className={cn(
      "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
      category ? colors[category] || 'bg-slate-200 text-slate-700' : 'bg-slate-200 text-slate-700'
    )}>
      {children}
    </span>
  );
};

const HeroSlideshow = ({ articles, onArticleClick }: { articles: Article[]; onArticleClick: (a: Article) => void }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % articles.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [articles.length]);

  return (
    <div className="relative h-[300px] md:h-[450px] w-full rounded-3xl overflow-hidden shadow-2xl group">
      <AnimatePresence mode="wait">
        <motion.div
          key={articles[currentIndex].id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 cursor-pointer"
          onClick={() => onArticleClick(articles[currentIndex])}
        >
          {articles[currentIndex].image && (
            <img 
              src={articles[currentIndex].image} 
              alt={articles[currentIndex].title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6 md:p-10 w-full md:w-3/4">
            <Badge category={articles[currentIndex].category}>{articles[currentIndex].category}</Badge>
            <h2 className="text-white font-display font-black text-2xl md:text-4xl mt-4 leading-[1.1] tracking-tight">
              {articles[currentIndex].title}
            </h2>
            <div className="flex items-center gap-4 mt-4 text-white/70 text-sm font-medium">
              <span>{format(new Date(articles[currentIndex].date), 'dd MMM yyyy', { locale: fr })}</span>
              <span>•</span>
              <span>{articles[currentIndex].author}</span>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Dots */}
      <div className="absolute bottom-6 right-6 flex gap-2">
        {articles.map((_, idx) => (
          <button
            key={idx}
            onClick={(e) => { e.stopPropagation(); setCurrentIndex(idx); }}
            className={cn(
              "w-2 h-2 rounded-full transition-all",
              idx === currentIndex ? "bg-primary w-6" : "bg-white/30 hover:bg-white/50"
            )}
          />
        ))}
      </div>
    </div>
  );
};

const TrendingSection = ({ articles, onArticleClick }: { articles: Article[]; onArticleClick: (a: Article) => void }) => {
  return (
    <section className="space-y-6">
      <div className="flex items-center gap-2">
        <div className="p-2 bg-primary/10 rounded-lg text-primary">
          <TrendingUp size={20} />
        </div>
        <h2 className="font-black text-2xl">Tendances</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article, idx) => (
          <div 
            key={article.id} 
            onClick={() => onArticleClick(article)}
            className="flex gap-4 items-start cursor-pointer group"
          >
            <span className="text-4xl font-black text-slate-200 group-hover:text-primary transition-colors">
              0{idx + 1}
            </span>
            <div className="space-y-1">
              <Badge category={article.category}>{article.category}</Badge>
              <h3 className="font-display font-bold text-slate-900 group-hover:text-primary transition-colors leading-snug line-clamp-2">
                {article.title}
              </h3>
              <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                <span>{article.author}</span>
                <span>•</span>
                <span className="flex items-center gap-0.5"><Eye size={10} /> {article.views}</span>
                {article.commentsCount !== undefined && article.commentsCount > 0 && (
                  <span className="flex items-center gap-0.5"><MessageSquare size={10} /> {article.commentsCount}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const ArticleCard = ({ article, onClick, variant = 'horizontal' }: { article: Article; onClick: () => void; variant?: 'horizontal' | 'vertical' | 'hero' }) => {
  if (variant === 'hero') {
    return (
      <motion.div 
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className="relative h-[240px] w-full rounded-2xl overflow-hidden shadow-xl cursor-pointer group bg-slate-100"
      >
        {article.image && (
          <img 
            src={article.image} 
            alt={article.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 p-4 w-full">
          <Badge category={article.category}>{article.category}</Badge>
          <h2 className="text-white font-display font-bold text-xl mt-2 leading-tight line-clamp-2">
            {article.title}
          </h2>
          <div className="flex items-center gap-3 mt-2 text-white/70 text-xs">
            <span>{format(new Date(article.date), 'dd MMM yyyy', { locale: fr })}</span>
            <span>•</span>
            <span>{article.author}</span>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100 cursor-pointer flex",
        variant === 'vertical' ? 'flex-col' : 'flex-row'
      )}
    >
      {article.image && (
        <div className={cn(
          "relative",
          variant === 'vertical' ? 'w-full h-40' : 'w-24 h-24 shrink-0'
        )}>
          <img 
            src={article.image} 
            alt={article.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      )}
      <div className="p-3 flex flex-col justify-between flex-1">
        <div>
          <div className="flex justify-between items-start mb-1">
            <Badge category={article.category}>{article.category}</Badge>
            <span className="text-[10px] text-slate-400">{article.readingTime}</span>
          </div>
          <h3 className={cn(
            "font-display font-bold text-slate-900 leading-snug line-clamp-2",
            variant === 'vertical' ? 'text-base' : 'text-sm'
          )}>
            {article.title}
          </h3>
          {variant === 'vertical' && article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {article.tags.slice(0, 3).map(tag => (
                <span key={tag} className="text-[8px] font-bold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded uppercase tracking-wider">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center justify-between mt-2 text-[10px] text-slate-500">
          <span>{article.author}</span>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-0.5"><Eye size={10} /> {article.views}</span>
            <span className="flex items-center gap-0.5"><Heart size={10} /> {article.likes}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const ArticleCarousel = ({ articles, onArticleClick }: { articles: Article[], onArticleClick: (a: Article) => void }) => {
  const [scrollIndex, setScrollIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(4);
  
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setItemsPerPage(1);
      else if (window.innerWidth < 1024) setItemsPerPage(2);
      else setItemsPerPage(4);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, articles.length - itemsPerPage);
  const next = () => setScrollIndex(prev => Math.min(prev + 1, maxIndex));
  const prev = () => setScrollIndex(prev => Math.max(prev - 1, 0));

  return (
    <div className="mt-16 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-black">Continuer la lecture</h3>
        <div className="flex gap-2">
          <button 
            onClick={prev} 
            disabled={scrollIndex === 0}
            className="p-2 rounded-full bg-white border border-slate-200 disabled:opacity-30 hover:bg-slate-50 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={next} 
            disabled={scrollIndex === maxIndex}
            className="p-2 rounded-full bg-white border border-slate-200 disabled:opacity-30 hover:bg-slate-50 transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
      
      <div className="overflow-hidden -mx-4 px-4">
        <motion.div 
          animate={{ x: `-${scrollIndex * (100 / itemsPerPage)}%` }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="flex gap-6"
        >
          {articles.map((article) => (
            <div 
              key={article.id} 
              className={cn(
                "shrink-0",
                itemsPerPage === 1 ? "w-full" : 
                itemsPerPage === 2 ? "w-[calc(50%-12px)]" : 
                "w-[calc(25%-18px)]"
              )}
            >
              <ArticleCard 
                article={article} 
                variant="vertical" 
                onClick={() => onArticleClick(article)} 
              />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

const EventSection = ({ events, onEventClick }: { events: Event[], onEventClick: (e: Event) => void }) => {
  return (
    <section className="py-20 border-t border-slate-100">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="font-black text-3xl md:text-4xl tracking-tighter">Agenda Culturel</h2>
          <p className="text-slate-500 mt-2">Les événements à ne pas manquer</p>
        </div>
        <button className="text-primary font-bold flex items-center gap-2 group">
          Voir tout l'agenda <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {events.map((event) => (
          <motion.div 
            key={event.id}
            whileHover={{ y: -10 }}
            onClick={() => onEventClick(event)}
            className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 cursor-pointer group"
          >
            <div className="aspect-[4/5] relative overflow-hidden bg-slate-100">
              {event.image && (
                <img 
                  src={event.image} 
                  alt={event.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <span className="bg-primary text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-widest mb-2 inline-block">
                  {event.category}
                </span>
                <h3 className="text-white font-bold text-lg leading-tight">{event.title}</h3>
              </div>
            </div>
            <div className="p-5 space-y-3">
              <div className="flex items-center gap-2 text-xs text-slate-500 font-bold">
                <Calendar size={14} className="text-primary" />
                {format(new Date(event.date), 'dd MMM yyyy', { locale: fr })}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 font-bold">
                <Map size={14} className="text-primary" />
                {event.location}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

const EventDetailView = ({ event, onBack }: { event: Event, onBack: () => void }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      <button onClick={onBack} className="text-primary text-xs font-bold flex items-center gap-1 mb-4">
        <ArrowLeft size={14} /> Retour
      </button>
      
      <div className="space-y-4 text-center">
        <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
          {event.category}
        </span>
        <h1 className="text-3xl md:text-5xl font-black tracking-tighter leading-tight">
          {event.title}
        </h1>
        <div className="flex items-center justify-center gap-6 text-sm text-slate-500 font-bold">
          <div className="flex items-center gap-2">
            <Calendar size={18} className="text-primary" />
            {format(new Date(event.date), 'dd MMMM yyyy', { locale: fr })}
          </div>
          <div className="flex items-center gap-2">
            <Map size={18} className="text-primary" />
            {event.location}
          </div>
        </div>
      </div>

      {(event.image || event.video) && (
        <div className="space-y-6">
          {event.video && (
            <div className="w-full rounded-3xl overflow-hidden shadow-2xl bg-slate-900/5 aspect-video">
              <iframe 
                src={`https://www.youtube.com/embed/${event.video.split('v=')[1]?.split('&')[0] || event.video.split('/').pop()}`}
                title={event.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              />
            </div>
          )}
          {event.image && (
            <div className="w-full rounded-3xl overflow-hidden shadow-2xl bg-slate-900/5">
              <img 
                src={event.image} 
                alt={event.title}
                className="w-full h-auto max-h-[80vh] object-contain mx-auto block"
                referrerPolicy="no-referrer"
              />
            </div>
          )}
        </div>
      )}

      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100">
        <div className="markdown-body text-lg leading-relaxed">
          <ReactMarkdown>{event.content}</ReactMarkdown>
        </div>
      </div>
    </motion.div>
  );
};

const GoogleAd = ({ className, label = "Annonce Google" }: { className?: string, label?: string }) => (
  <div className={cn("bg-slate-100 border border-slate-200 rounded-2xl p-4 flex flex-col items-center justify-center text-center relative overflow-hidden group min-h-[100px]", className)}>
    <div className="absolute top-0 right-0 bg-slate-200 px-2 py-0.5 text-[8px] font-bold text-slate-500 uppercase">Ad</div>
    <span className="text-[9px] text-slate-400 uppercase font-bold mb-1">{label}</span>
    <div className="w-12 h-px bg-slate-200 mb-2" />
    <div className="text-slate-300 font-bold text-sm">Espace Publicitaire</div>
  </div>
);

const ReadAlso = ({ currentArticle, articles, onArticleClick }: { currentArticle: Article, articles: Article[], onArticleClick: (a: Article) => void }) => {
  const related = articles
    .filter(a => a.id !== currentArticle.id && a.category === currentArticle.category)
    .slice(0, 2);
  
  if (related.length === 0) return null;

  return (
    <div className="my-10 p-6 bg-slate-50 border-l-4 border-secondary rounded-r-2xl">
      <h4 className="font-display font-black text-secondary uppercase tracking-widest text-xs mb-4">Lire aussi</h4>
      <div className="space-y-4">
        {related.map(article => (
          <button 
            key={article.id}
            onClick={() => onArticleClick(article)}
            className="flex gap-4 group text-left w-full"
          >
            <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0">
              <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            </div>
            <div className="flex-1 py-1">
              <h5 className="font-display font-bold text-slate-900 group-hover:text-primary transition-colors leading-tight line-clamp-2">
                {article.title}
              </h5>
              <span className="text-[10px] text-slate-400 font-bold uppercase mt-1 block">{article.readingTime} de lecture</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

const FlashInfo = ({ articles }: { articles: string[] }) => {
  return (
    <div className="bg-slate-900 text-white overflow-hidden h-10 flex items-center relative z-[60]">
      <div className="bg-primary px-4 h-full flex items-center font-black text-[10px] uppercase tracking-widest shrink-0 relative z-10 shadow-[4px_0_10px_rgba(0,0,0,0.3)]">
        Flash Info
      </div>
      <div className="flex-1 overflow-hidden relative h-full flex items-center">
        <motion.div 
          animate={{ x: [0, -1000] }}
          transition={{ 
            duration: 30, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="flex whitespace-nowrap gap-12 items-center"
        >
          {articles.map((text, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span className="text-xs font-bold tracking-tight">{text}</span>
            </div>
          ))}
          {/* Duplicate for seamless loop */}
          {articles.map((text, i) => (
            <div key={`dup-${i}`} className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span className="text-xs font-bold tracking-tight">{text}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

// --- Main App ---

const SplashScreen = ({ isDarkMode }: { isDarkMode: boolean }) => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
      className={cn(
        "fixed inset-0 z-[1000] flex flex-col items-center justify-center p-6",
        isDarkMode ? "bg-slate-950" : "bg-[#F5F1EB]"
      )}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="flex flex-col items-center gap-8"
      >
        <img 
          src="https://raw.githubusercontent.com/Akwabanews/Sources/main/images/2DB685A1-EE6B-478E-B70B-58F490D2948A.jpeg" 
          alt="Akwaba Info Logo" 
          className="w-48 h-48 md:w-64 md:h-64 object-contain rounded-[40px] shadow-2xl border border-white/20"
          referrerPolicy="no-referrer"
        />
        
        <div className="text-center space-y-4">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-4xl md:text-6xl font-black tracking-tighter"
          >
            AKWABA <span className="text-primary">INFO</span>
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="text-slate-500 font-bold uppercase tracking-[0.3em] text-xs md:text-sm"
          >
            L’info du monde en un clic
          </motion.p>
        </div>

        <div className="relative mt-10">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full"
          />
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          </div>
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-12 text-slate-400 text-[10px] font-black uppercase tracking-widest"
        >
          Chargement de l'actualité...
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'article' | 'search' | 'category' | 'donate' | 'about' | 'privacy' | 'terms' | 'contact' | 'cookies' | 'event'>('home');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [activeCategory, setActiveCategory] = useState('À la une');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<string>('5000');
  const [selectedPayment, setSelectedPayment] = useState<'mobile' | 'card'>('mobile');
  const [donationSuccess, setDonationSuccess] = useState(false);
  const [showCookieBanner, setShowCookieBanner] = useState(false);
  
  // New features state
  const [showFilters, setShowFilters] = useState(false);
  const [filterAuthor, setFilterAuthor] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [showNotificationPrompt, setShowNotificationPrompt] = useState(false);
  const [activeNotification, setActiveNotification] = useState<string | null>(null);
  
  // Persistence Logic
  const [articleComments, setArticleComments] = useState<Record<string, Comment[]>>(() => {
    const saved = localStorage.getItem('akwaba_comments');
    return saved ? JSON.parse(saved) : {};
  });
  
  const [articleLikes, setArticleLikes] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('akwaba_likes');
    return saved ? JSON.parse(saved) : {};
  });

  const [userLikedArticles, setUserLikedArticles] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('akwaba_user_likes');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [replyingTo, setReplyingTo] = useState<{ commentId: string, username: string } | null>(null);
  const [newCommentText, setNewCommentText] = useState('');
  const [commentAuthorName, setCommentAuthorName] = useState('');

  useEffect(() => {
    localStorage.setItem('akwaba_comments', JSON.stringify(articleComments));
  }, [articleComments]);

  useEffect(() => {
    localStorage.setItem('akwaba_likes', JSON.stringify(articleLikes));
  }, [articleLikes]);

  useEffect(() => {
    localStorage.setItem('akwaba_user_likes', JSON.stringify(Array.from(userLikedArticles)));
  }, [userLikedArticles]);

  const handleAddComment = (articleId: string, parentCommentId?: string) => {
    if (!newCommentText.trim() || !commentAuthorName.trim()) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      username: commentAuthorName,
      date: new Date().toISOString(),
      content: newCommentText,
      likes: 0,
      replies: [],
    };

    setArticleComments(prev => {
      const currentComments = [...(prev[articleId] || [])];
      
      if (parentCommentId && parentCommentId !== 'mock') {
        // Find parent and add reply
        const addReply = (comments: Comment[]): Comment[] => {
          return comments.map(c => {
            if (c.id === parentCommentId) {
              return { ...c, replies: [...c.replies, newComment] };
            }
            if (c.replies.length > 0) {
              return { ...c, replies: addReply(c.replies) };
            }
            return c;
          });
        };
        return { ...prev, [articleId]: addReply(currentComments) };
      }

      return { ...prev, [articleId]: [newComment, ...currentComments] };
    });

    setNewCommentText('');
    setReplyingTo(null);
    setActiveNotification("Votre message a été publié !");
    setTimeout(() => setActiveNotification(null), 3000);
  };

  const handleLikeArticle = (articleId: string) => {
    if (userLikedArticles.has(articleId)) {
      setUserLikedArticles(prev => {
        const next = new Set(prev);
        next.delete(articleId);
        return next;
      });
      setArticleLikes(prev => ({
        ...prev,
        [articleId]: (prev[articleId] || 0) - 1
      }));
    } else {
      setUserLikedArticles(prev => new Set(prev).add(articleId));
      setArticleLikes(prev => ({
        ...prev,
        [articleId]: (prev[articleId] || 0) + 1
      }));
      setActiveNotification("Vous avez aimé cet article !");
      setTimeout(() => setActiveNotification(null), 2000);
    }
  };

  const handleLikeComment = (articleId: string, commentId: string) => {
    setArticleComments(prev => {
      const updateLikes = (comments: Comment[]): Comment[] => {
        return comments.map(c => {
          if (c.id === commentId) {
            return { ...c, likes: c.likes + 1 };
          }
          if (c.replies.length > 0) {
            return { ...c, replies: updateLikes(c.replies) };
          }
          return c;
        });
      };
      return { ...prev, [articleId]: updateLikes(prev[articleId] || []) };
    });
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setActiveNotification("Merci ! Vous êtes maintenant inscrit à la newsletter.");
    setNewsletterEmail('');
    setTimeout(() => setActiveNotification(null), 5000);
  };

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      const timer = setTimeout(() => setShowCookieBanner(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    const notifConsent = localStorage.getItem('notification-consent');
    if (!notifConsent) {
      const timer = setTimeout(() => setShowNotificationPrompt(true), 5000);
      return () => clearTimeout(timer);
    } else if (notifConsent === 'accepted') {
      setNotificationsEnabled(true);
    }
  }, []);

  // Simulate an urgent notification after 10 seconds
  useEffect(() => {
    if (notificationsEnabled) {
      const timer = setTimeout(() => {
        setActiveNotification("URGENT : Coupure d'électricité majeure annoncée à Abidjan pour demain.");
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [notificationsEnabled]);

  const handleNotificationConsent = (accepted: boolean) => {
    localStorage.setItem('notification-consent', accepted ? 'accepted' : 'declined');
    setNotificationsEnabled(accepted);
    setShowNotificationPrompt(false);
  };

  const handleCookieConsent = (accepted: boolean) => {
    localStorage.setItem('cookie-consent', accepted ? 'accepted' : 'declined');
    setShowCookieBanner(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Keep splash a bit longer for the "welcome" effect
      setTimeout(() => setShowSplash(false), 2000);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const categories = ['À la une', 'Urgent', 'Politique', 'Économie', 'Science', 'Santé', 'Culture', 'Histoire', 'Sport'];

  const filteredArticles = activeCategory === 'À la une' 
    ? MOCK_ARTICLES 
    : MOCK_ARTICLES.filter(a => a.category === activeCategory);

  const handleArticleClick = (article: Article) => {
    setSelectedArticle(article);
    setCurrentView('article');
    setIsMenuOpen(false);
    window.scrollTo(0, 0);
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setCurrentView('event');
    setIsMenuOpen(false);
    window.scrollTo(0, 0);
  };

  const handleCategoryClick = (cat: string) => {
    setActiveCategory(cat);
    setCurrentView('home');
    setSelectedArticle(null);
    setIsMenuOpen(false);
    window.scrollTo(0, 0);
  };

  const navigateTo = (view: typeof currentView) => {
    setCurrentView(view);
    setSelectedArticle(null);
    setSelectedEvent(null);
    setIsMenuOpen(false);
    window.scrollTo(0, 0);
  };

  const goHome = () => {
    setCurrentView('home');
    setSelectedArticle(null);
    setSelectedEvent(null);
    setIsMenuOpen(false);
    window.scrollTo(0, 0);
  };

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const FLASH_NEWS = [
    "Côte d'Ivoire : Lancement d'un nouveau programme de soutien aux startups technologiques à Abidjan.",
    "Économie : La ZLECAf annonce une progression record des échanges intra-africains pour le premier trimestre.",
    "Sport : Les préparatifs de la prochaine CAN avancent à grands pas, inspection des stades terminée.",
    "Culture : Le festival des musiques urbaines d'Anoumabo (FEMUA) dévoile sa programmation internationale.",
    "Monde : Sommet extraordinaire de l'Union Africaine sur la sécurité alimentaire prévu le mois prochain."
  ];

  const trendingArticles = [...MOCK_ARTICLES]
    .filter(article => {
      const articleDate = new Date(article.date);
      const now = new Date();
      const diffInHours = (now.getTime() - articleDate.getTime()) / (1000 * 60 * 60);
      return diffInHours <= 48; // Last 48 hours
    })
    .sort((a, b) => {
      const likesA = (a.likes || 0) + (articleLikes[a.id] || 0);
      const likesB = (b.likes || 0) + (articleLikes[b.id] || 0);
      const commentsA = (a.commentsCount || 0) + (articleComments[a.id]?.length || 0);
      const commentsB = (b.commentsCount || 0) + (articleComments[b.id]?.length || 0);
      
      const scoreA = (a.views || 0) + likesA * 2 + commentsA * 5;
      const scoreB = (b.views || 0) + likesB * 2 + commentsB * 5;
      return scoreB - scoreA;
    })
    .slice(0, 6);

  return (
    <>
      <AnimatePresence>
        {showSplash && <SplashScreen isDarkMode={isDarkMode} />}
      </AnimatePresence>

      <div className={cn(
        "min-h-screen transition-colors duration-300 african-pattern pb-16 lg:pb-0",
        isDarkMode ? "bg-slate-950 text-white" : "bg-[#F5F1EB] text-slate-900"
      )}>
      <FlashInfo articles={FLASH_NEWS} />
      {/* Notification Prompt */}
      <AnimatePresence>
        {showNotificationPrompt && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          >
            <div className={cn(
              "max-w-md w-full p-8 rounded-[40px] shadow-2xl border text-center space-y-6",
              isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"
            )}>
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                <BellRing size={40} className="animate-bounce" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black tracking-tight">Activer les notifications</h3>
                <p className="text-slate-500 text-sm leading-relaxed">Recevez les alertes urgentes directement sur votre appareil.</p>
              </div>
              <div className="flex gap-4 pt-4">
                <button 
                  onClick={() => handleNotificationConsent(false)}
                  className="flex-1 py-4 rounded-2xl font-bold text-slate-400 hover:bg-slate-100 transition-colors"
                >
                  Plus tard
                </button>
                <button 
                  onClick={() => handleNotificationConsent(true)}
                  className="flex-1 py-4 rounded-2xl font-bold bg-primary text-white shadow-lg shadow-primary/30 hover:scale-105 transition-transform"
                >
                  Activer
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Notification Toast */}
      <AnimatePresence>
        {activeNotification && (
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            className="fixed top-24 right-6 z-[150] max-w-sm w-full"
          >
            <div className="bg-red-600 text-white p-6 rounded-3xl shadow-2xl flex gap-4 items-start border-4 border-white/20">
              <div className="p-2 bg-white/20 rounded-xl shrink-0">
                <Bell size={24} />
              </div>
              <div className="flex-1 space-y-1">
                <div className="text-[10px] font-black uppercase tracking-widest opacity-80">ALERTE URGENTE</div>
                <p className="text-sm font-bold leading-tight">{activeNotification}</p>
              </div>
              <button onClick={() => setActiveNotification(null)} className="p-1 hover:bg-white/20 rounded-full transition-colors">
                <X size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cookie Consent Banner */}
      <AnimatePresence>
        {showCookieBanner && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-20 lg:bottom-6 left-4 right-4 lg:left-auto lg:right-6 lg:w-[400px] z-[120]"
          >
            <div className={cn(
              "p-6 rounded-3xl shadow-2xl border flex flex-col gap-4",
              isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
            )}>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-xl text-primary">
                  <Eye size={20} />
                </div>
                <h3 className="font-display font-bold text-lg">Respect de votre vie privée</h3>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">
                Nous utilisons des cookies pour améliorer votre expérience, analyser le trafic et vous proposer des contenus adaptés.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => handleCookieConsent(true)}
                  className="flex-1 bg-primary text-white py-3 rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors"
                >
                  Accepter tout
                </button>
                <button
                  onClick={() => handleCookieConsent(false)}
                  className="flex-1 bg-slate-100 text-slate-600 py-3 rounded-xl text-sm font-bold hover:bg-slate-200 transition-colors"
                >
                  Refuser
                </button>
              </div>
              <button 
                onClick={() => navigateTo('cookies')}
                className="text-[10px] text-slate-400 hover:text-primary transition-colors text-center uppercase font-bold tracking-widest"
              >
                En savoir plus sur notre politique
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reading Progress Bar */}
      {currentView === 'article' && (
        <motion.div
          className="fixed top-0 left-0 right-0 h-1 bg-primary origin-left z-[110]"
          style={{ scaleX }}
        />
      )}

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className={cn(
              "fixed inset-0 z-[100] p-6 lg:hidden flex flex-col overflow-y-auto",
              isDarkMode ? "bg-slate-950" : "bg-white"
            )}
          >
            <div className="flex justify-between items-center mb-10">
              <div className="flex flex-col items-center gap-4 w-full">
                <img 
                  src="https://raw.githubusercontent.com/Akwabanews/Sources/main/images/2DB685A1-EE6B-478E-B70B-58F490D2948A.jpeg" 
                  alt="Akwaba Info Logo" 
                  className="w-32 h-32 object-contain rounded-3xl shadow-lg border border-slate-100"
                  referrerPolicy="no-referrer"
                />
                <div className="flex justify-between items-center w-full">
                  <h2 className="text-2xl font-black">MENU</h2>
                  <button onClick={() => setIsMenuOpen(false)} className="p-2 bg-slate-100 rounded-full text-slate-900">
                    <X size={24} />
                  </button>
                </div>
              </div>
            </div>
            <nav className="flex flex-col gap-6">
              {categories.map(cat => (
                <button 
                  key={cat}
                  onClick={() => handleCategoryClick(cat)}
                  className={cn(
                    "text-2xl font-black text-left transition-colors",
                    activeCategory === cat && currentView === 'home' ? "text-primary" : "text-slate-400"
                  )}
                >
                  {cat}
                </button>
              ))}
              <div className="h-px bg-slate-100 my-4" />
              <button onClick={() => navigateTo('about')} className="text-lg font-bold text-left text-slate-500">À propos</button>
              <button onClick={() => navigateTo('contact')} className="text-lg font-bold text-left text-slate-500">Contact</button>
              <button onClick={() => navigateTo('donate')} className="text-lg font-bold text-left text-primary">Soutenir le journal</button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header / Navbar */}
      <header className={cn(
        "sticky top-0 z-50 backdrop-blur-xl border-b transition-colors",
        isDarkMode ? "bg-slate-950/80 border-slate-800" : "bg-white/80 border-slate-200"
      )}>
        <div className="max-w-7xl mx-auto px-4 h-24 md:h-28 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              <Menu size={24} />
            </button>
            <div onClick={goHome} className="cursor-pointer flex items-center gap-4">
              <img 
                src="https://raw.githubusercontent.com/Akwabanews/Sources/main/images/2DB685A1-EE6B-478E-B70B-58F490D2948A.jpeg" 
                alt="Akwaba Info Logo" 
                className="w-16 h-16 md:w-20 md:h-20 object-contain rounded-2xl shadow-md border border-slate-50"
                referrerPolicy="no-referrer"
              />
              <div>
                <h1 className="text-xl md:text-3xl font-black tracking-tighter">
                  AKWABA <span className="text-primary">INFO</span>
                </h1>
                <p className="hidden md:block text-xs font-bold text-slate-400 uppercase tracking-widest -mt-1">
                  L’info du monde en un clic
                </p>
              </div>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6 overflow-x-auto flex-nowrap no-scrollbar max-w-[50%]">
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                className={cn(
                  "text-sm font-bold transition-colors hover:text-primary whitespace-nowrap",
                  activeCategory === cat && currentView === 'home' ? "text-primary" : "text-slate-500"
                )}
              >
                {cat}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => navigateTo('search')}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              <Search size={22} />
            </button>
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>
            <button 
              onClick={() => navigateTo('donate')}
              className="hidden md:flex bg-primary text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
            >
              Soutenir
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 md:py-10">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div 
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20 space-y-4"
            >
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </motion.div>
          ) : currentView === 'home' ? (
            <motion.div 
              key="home"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-10"
            >
              {/* Category Tabs Mobile */}
              <div className="lg:hidden flex flex-nowrap gap-2 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4 touch-pan-x">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => handleCategoryClick(cat)}
                    className={cn(
                      "px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all shrink-0 shadow-sm",
                      activeCategory === cat 
                        ? "bg-primary text-white shadow-primary/20" 
                        : "bg-white text-slate-500 border border-slate-200"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Hero Section */}
              {activeCategory === 'À la une' && MOCK_ARTICLES.length > 0 && (
                <section className="space-y-10">
                  <HeroSlideshow 
                    articles={MOCK_ARTICLES.slice(0, 3)} 
                    onArticleClick={handleArticleClick} 
                  />
                  
                  <TrendingSection 
                    articles={trendingArticles}
                    onArticleClick={handleArticleClick}
                  />
                  <GoogleAd className="my-10" label="Annonce à la une" />
                </section>
              )}

              {/* Grid Section */}
              <section className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="font-black text-2xl md:text-3xl">
                    {activeCategory === 'À la une' ? 'Dernières Nouvelles' : activeCategory}
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredArticles.length > 0 ? filteredArticles.map((article) => (
                    <ArticleCard 
                      key={article.id} 
                      article={article} 
                      variant="vertical"
                      onClick={() => handleArticleClick(article)} 
                    />
                  )) : (
                    <div className="col-span-full py-20 text-center text-slate-400 italic">
                      Aucun article disponible dans cette catégorie pour le moment.
                    </div>
                  )}
                </div>
              </section>

              {/* Newsletter & Ad */}
              <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-primary/10 rounded-3xl p-8 space-y-4 border border-primary/20">
                  <h3 className="font-black text-2xl text-primary">La Newsletter Akwaba</h3>
                  <p className="text-slate-600">Rejoignez plus de 50,000 lecteurs et recevez l'essentiel de l'actualité africaine.</p>
                  <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3">
                    <input 
                      type="email" 
                      required
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      placeholder="votre@email.com" 
                      className="flex-1 bg-white rounded-xl px-4 py-3 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                    <button type="submit" className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary/90 transition-colors">
                      S'abonner
                    </button>
                  </form>
                </div>
                <div className="bg-slate-100 border border-slate-200 rounded-3xl p-8 flex flex-col items-center justify-center text-center relative overflow-hidden group">
                  <div className="absolute top-0 right-0 bg-slate-200 px-2 py-1 text-[8px] font-bold text-slate-500 uppercase">Ad</div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold mb-2">Publicité</span>
                  <div className="w-full h-px bg-slate-200 mb-4" />
                  <div className="text-slate-400 font-bold text-lg mb-2">Annonce Google</div>
                  <p className="text-xs text-slate-400 mb-4">Découvrez nos offres exclusives</p>
                  <button className="bg-blue-500 text-white px-6 py-2 rounded-full text-[10px] font-bold">En savoir plus</button>
                </div>
              </section>

              <EventSection 
                events={MOCK_EVENTS} 
                onEventClick={handleEventClick} 
              />
            </motion.div>
          ) : currentView === 'event' && selectedEvent ? (
            <EventDetailView 
              event={selectedEvent} 
              onBack={goHome} 
            />
          ) : currentView === 'article' && selectedArticle ? (
            <motion.div 
              key="article"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto space-y-8"
            >
              <div className="space-y-4 text-center">
                <button onClick={goHome} className="text-primary text-xs font-bold flex items-center gap-1 justify-center mb-4">
                  <ArrowLeft size={14} /> Retour à l'accueil
                </button>
                <Badge category={selectedArticle.category}>{selectedArticle.category}</Badge>
                <h1 className="text-2xl md:text-4xl font-display font-black leading-[1.1] tracking-tight text-slate-900">
                  {selectedArticle.title}
                </h1>
                {selectedArticle.tags && selectedArticle.tags.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-2 mt-2">
                    {selectedArticle.tags.map(tag => (
                      <button 
                        key={tag}
                        onClick={() => {
                          setSearchQuery(tag);
                          navigateTo('search');
                        }}
                        className="text-[10px] font-bold bg-slate-100 text-slate-500 hover:bg-primary/10 hover:text-primary px-3 py-1 rounded-full uppercase tracking-widest transition-colors"
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                )}
                <div className="flex items-center justify-center gap-4 text-sm text-slate-500 font-sans">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary text-xs">
                      {selectedArticle.author[0]}
                    </div>
                    <span className="font-bold text-slate-900">{selectedArticle.author}</span>
                  </div>
                  <span>•</span>
                  <span>{format(new Date(selectedArticle.date), 'dd MMMM yyyy', { locale: fr })}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><Clock size={14} /> {selectedArticle.readingTime}</span>
                </div>
              </div>

              {(selectedArticle.image || selectedArticle.video) && (
                <div className="space-y-6">
                  {selectedArticle.video && (
                    <div className="w-full rounded-3xl overflow-hidden shadow-2xl bg-slate-900/5 aspect-video">
                      <iframe 
                        src={`https://www.youtube.com/embed/${selectedArticle.video.split('v=')[1]?.split('&')[0] || selectedArticle.video.split('/').pop()}`}
                        title={selectedArticle.title}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen
                      />
                    </div>
                  )}
                  {selectedArticle.image && (
                    <div className="w-full rounded-3xl overflow-hidden shadow-2xl bg-slate-900/5">
                      <img 
                        src={selectedArticle.image} 
                        alt={selectedArticle.title}
                        className="w-full h-auto max-h-[80vh] object-contain mx-auto block"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10">
                <div className="space-y-8">
                  <GoogleAd className="mb-8" />
                  
                  <div className="markdown-body text-lg leading-relaxed">
                    {(() => {
                      const content = selectedArticle.content;
                      const paragraphs = content.split('\n\n');
                      if (paragraphs.length > 3) {
                        return (
                          <>
                            <ReactMarkdown>{paragraphs.slice(0, 2).join('\n\n')}</ReactMarkdown>
                            <GoogleAd className="my-10" label="Publicité contextuelle" />
                            <ReactMarkdown>{paragraphs.slice(2, 4).join('\n\n')}</ReactMarkdown>
                            <ReadAlso 
                              currentArticle={selectedArticle} 
                              articles={MOCK_ARTICLES} 
                              onArticleClick={handleArticleClick} 
                            />
                            <ReactMarkdown>{paragraphs.slice(4).join('\n\n')}</ReactMarkdown>
                          </>
                        );
                      }
                      return (
                        <>
                          <ReactMarkdown>{content}</ReactMarkdown>
                          <ReadAlso 
                            currentArticle={selectedArticle} 
                            articles={MOCK_ARTICLES} 
                            onArticleClick={handleArticleClick} 
                          />
                        </>
                      );
                    })()}
                  </div>

                  <GoogleAd className="my-8" label="Publicité ciblée" />
                  
                  {/* Engagement */}
                  <div className="mt-12 pt-8 border-t border-slate-100 flex flex-wrap items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                      <button 
                        onClick={() => handleLikeArticle(selectedArticle.id)}
                        className={cn(
                          "flex items-center gap-2 transition-colors group",
                          userLikedArticles.has(selectedArticle.id) ? "text-red-500" : "text-slate-500 hover:text-primary"
                        )}
                      >
                        <div className={cn(
                          "p-3 rounded-full transition-colors",
                          userLikedArticles.has(selectedArticle.id) ? "bg-red-50" : "bg-slate-100 group-hover:bg-primary/10"
                        )}>
                          <Heart size={24} fill={userLikedArticles.has(selectedArticle.id) ? "currentColor" : "none"} />
                        </div>
                        <span className="font-bold">{(selectedArticle.likes || 0) + (articleLikes[selectedArticle.id] || 0)}</span>
                      </button>
                      <button className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors group">
                        <div className="p-3 rounded-full bg-slate-100 group-hover:bg-primary/10 transition-colors">
                          <MessageSquare size={24} />
                        </div>
                        <span className="font-bold">{(selectedArticle.commentsCount || 0) + (articleComments[selectedArticle.id]?.length || 0)}</span>
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-slate-400 uppercase">Partager</span>
                      <button className="p-3 bg-slate-100 rounded-full text-slate-600 hover:bg-primary hover:text-white transition-all"><Twitter size={20} /></button>
                      <button className="p-3 bg-slate-100 rounded-full text-slate-600 hover:bg-primary hover:text-white transition-all"><Facebook size={20} /></button>
                      <button className="p-3 bg-slate-100 rounded-full text-slate-600 hover:bg-primary hover:text-white transition-all"><Share2 size={20} /></button>
                    </div>
                  </div>

                  <GoogleAd className="mt-12" label="Annonce sponsorisée" />

                  {/* Comments */}
                  <div className="mt-12 space-y-8">
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-black">Commentaires</h3>
                      <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-1 rounded font-bold uppercase">
                        Modération active
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 italic">
                      Les commentaires sont modérés avant publication.
                    </p>
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-6">
                      {/* Recursive Comment Component */}
                      {(() => {
                        const renderComments = (comments: Comment[], isReply = false) => {
                          if (comments.length === 0 && !isReply) {
                            return (
                              <div className="flex gap-4 opacity-50">
                                <div className="w-10 h-10 rounded-full bg-slate-200 shrink-0" />
                                <div className="flex-1 space-y-2">
                                  <div className="flex justify-between items-center">
                                    <span className="font-bold">Jean-Marc Koffi</span>
                                    <span className="text-xs text-slate-400">Exemple</span>
                                  </div>
                                  <p className="text-slate-600">Analyse très pertinente. Le potentiel est là, il manque juste l'accompagnement politique.</p>
                                  <button 
                                    onClick={() => {
                                      setReplyingTo({ commentId: 'mock', username: 'Jean-Marc Koffi' });
                                      document.getElementById('comment-form')?.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                    className="text-xs font-bold text-primary hover:underline"
                                  >
                                    Répondre
                                  </button>
                                </div>
                              </div>
                            );
                          }
                          return comments.map((comment) => (
                            <div key={comment.id} className={cn("space-y-4", isReply && "ml-10 mt-4")}>
                              <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex gap-4"
                              >
                                <div className={cn(
                                  "w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0",
                                  isReply ? "bg-slate-100 text-slate-400 w-8 h-8 text-xs" : "bg-primary/10 text-primary"
                                )}>
                                  {comment.username[0].toUpperCase()}
                                </div>
                                <div className="flex-1 space-y-2">
                                  <div className="flex justify-between items-center">
                                    <span className="font-bold text-sm">{comment.username}</span>
                                    <span className="text-[10px] text-slate-400">
                                      {format(new Date(comment.date), 'dd MMM yyyy HH:mm', { locale: fr })}
                                    </span>
                                  </div>
                                  <p className="text-sm text-slate-600 leading-relaxed">{comment.content}</p>
                                  <div className="flex items-center gap-4">
                                    <button 
                                      onClick={() => {
                                        setReplyingTo({ commentId: comment.id, username: comment.username });
                                        document.getElementById('comment-form')?.scrollIntoView({ behavior: 'smooth' });
                                      }}
                                      className="text-xs font-bold text-primary hover:underline"
                                    >
                                      Répondre
                                    </button>
                                    <button 
                                      onClick={() => handleLikeComment(selectedArticle.id, comment.id)}
                                      className="text-xs font-bold text-slate-400 flex items-center gap-1 hover:text-red-500 transition-colors"
                                    >
                                      <Heart size={12} /> {comment.likes}
                                    </button>
                                  </div>
                                </div>
                              </motion.div>
                              {comment.replies && comment.replies.length > 0 && (
                                <div className="border-l-2 border-slate-50">
                                  {renderComments(comment.replies, true)}
                                </div>
                              )}
                            </div>
                          ));
                        };
                        return renderComments(articleComments[selectedArticle.id] || []);
                      })()}

                      {/* Comment Form */}
                      <div id="comment-form" className="pt-6 border-t border-slate-100 space-y-4">
                        {replyingTo && (
                          <div className="flex items-center justify-between bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                            <span className="text-xs text-slate-500">
                              En réponse à <span className="font-bold text-primary">@{replyingTo.username}</span>
                            </span>
                            <button onClick={() => setReplyingTo(null)} className="text-slate-400 hover:text-slate-600">
                              <X size={14} />
                            </button>
                          </div>
                        )}
                        <div className="flex flex-col sm:flex-row gap-4">
                          <div className="flex-1 relative">
                            <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input 
                              type="text" 
                              placeholder="Votre nom..." 
                              value={commentAuthorName}
                              onChange={(e) => setCommentAuthorName(e.target.value)}
                              className="w-full bg-slate-50 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                            />
                          </div>
                        </div>
                        <div className="flex gap-3 items-end">
                          <textarea 
                            placeholder={replyingTo ? `Répondre à ${replyingTo.username}...` : "Ajouter un commentaire..."}
                            value={newCommentText}
                            onChange={(e) => setNewCommentText(e.target.value)}
                            rows={2}
                            className="flex-1 bg-slate-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                          />
                          <button 
                            onClick={() => handleAddComment(selectedArticle.id, replyingTo?.commentId)}
                            disabled={!newCommentText.trim() || !commentAuthorName.trim()}
                            className="bg-primary text-white p-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform"
                          >
                            <Send size={20} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <aside className="hidden lg:block space-y-8">
                  <div className="sticky top-24 space-y-8">
                    <GoogleAd className="h-[600px]" label="Publicité verticale" />
                    <div className="space-y-4">
                      <h4 className="font-black text-xs uppercase tracking-wider text-slate-400">Articles Similaires</h4>
                      {MOCK_ARTICLES.filter(a => a.id !== selectedArticle.id).slice(0, 3).map(article => (
                        <div key={article.id} onClick={() => handleArticleClick(article)} className="cursor-pointer group">
                          <div className="aspect-video rounded-xl overflow-hidden mb-2">
                            <img src={article.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform" referrerPolicy="no-referrer" />
                          </div>
                          <h5 className="font-bold text-sm leading-tight group-hover:text-primary transition-colors">{article.title}</h5>
                        </div>
                      ))}
                    </div>
                    <GoogleAd className="h-[250px]" label="Annonce" />
                  </div>
                </aside>
              </div>

              <ArticleCarousel 
                articles={MOCK_ARTICLES.filter(a => a.id !== selectedArticle.id)}
                onArticleClick={handleArticleClick}
              />
            </motion.div>
          ) : currentView === 'search' ? (
            <motion.div 
              key="search"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-3xl mx-auto space-y-10"
            >
              <button onClick={goHome} className="text-primary text-xs font-bold flex items-center gap-1 mb-4">
                <ArrowLeft size={14} /> Retour à l'accueil
              </button>
              
              <div className="space-y-4">
                <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100 flex items-center gap-4">
                  <Search size={28} className="text-primary" />
                  <input 
                    autoFocus
                    type="text" 
                    placeholder="Rechercher un article, un sujet..." 
                    className="flex-1 text-xl font-medium outline-none text-slate-900"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button 
                    onClick={() => setShowFilters(!showFilters)}
                    className={cn(
                      "p-2 rounded-xl transition-colors",
                      showFilters ? "bg-primary text-white" : "bg-slate-100 text-slate-500"
                    )}
                  >
                    <Filter size={20} />
                  </button>
                  {searchQuery && <button onClick={() => setSearchQuery('')} className="p-2 bg-slate-100 rounded-full text-slate-900"><X size={20} /></button>}
                </div>

                <AnimatePresence>
                  {showFilters && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-lg grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase text-slate-400">Auteur</label>
                          <div className="relative">
                            <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input 
                              type="text" 
                              placeholder="Nom de l'auteur..."
                              className="w-full bg-slate-50 rounded-xl pl-9 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 text-slate-900"
                              value={filterAuthor}
                              onChange={(e) => setFilterAuthor(e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase text-slate-400">Date</label>
                          <div className="relative">
                            <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input 
                              type="date" 
                              className="w-full bg-slate-50 rounded-xl pl-9 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 text-slate-900"
                              value={filterDate}
                              onChange={(e) => setFilterDate(e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase text-slate-400">Catégorie</label>
                          <select 
                            className="w-full bg-slate-50 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 text-slate-900 appearance-none"
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                          >
                            <option value="">Toutes les catégories</option>
                            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                          </select>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {searchQuery || filterAuthor || filterDate || filterCategory ? (
                <div className="space-y-6">
                  <h3 className="font-black text-xl text-slate-900">
                    Résultats pour "{searchQuery || '...'}"
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {MOCK_ARTICLES.filter(a => {
                      const matchesQuery = a.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                         a.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                         a.tags?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
                      const matchesAuthor = !filterAuthor || a.author.toLowerCase().includes(filterAuthor.toLowerCase());
                      const matchesCategory = !filterCategory || a.category === filterCategory;
                      const matchesDate = !filterDate || a.date.startsWith(filterDate);
                      return matchesQuery && matchesAuthor && matchesCategory && matchesDate;
                    }).map(article => (
                      <ArticleCard key={article.id} article={article} variant="vertical" onClick={() => handleArticleClick(article)} />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="space-y-4">
                    <h3 className="font-black text-xs uppercase tracking-wider text-slate-400">Tendances</h3>
                    <div className="flex flex-wrap gap-3">
                      {['ZLECAf', 'Innovation Abidjan', 'Afrobeat 2026', 'Climat Afrique', 'Économie Numérique'].map(tag => (
                        <button 
                          key={tag} 
                          onClick={() => setSearchQuery(tag)}
                          className="px-6 py-3 bg-white border border-slate-100 rounded-2xl text-sm font-bold hover:border-primary hover:text-primary transition-all shadow-sm text-slate-900"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ) : currentView === 'donate' ? (
            <motion.div 
              key="donate"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center py-10"
            >
              <div className="lg:col-span-2">
                <button onClick={goHome} className="text-primary text-xs font-bold flex items-center gap-1 mb-4">
                  <ArrowLeft size={14} /> Retour à l'accueil
                </button>
              </div>

              {donationSuccess ? (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="lg:col-span-2 bg-white rounded-[40px] p-12 text-center shadow-2xl border border-slate-100 space-y-6"
                >
                  <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Heart size={40} fill="currentColor" />
                  </div>
                  <h2 className="text-3xl font-black">Merci pour votre générosité !</h2>
                  <p className="text-slate-600 max-w-md mx-auto">
                    Votre don de <span className="font-bold text-slate-900">{selectedAmount} F</span> a été reçu avec succès. Vous recevrez un reçu par email sous peu.
                  </p>
                  <button 
                    onClick={() => { setDonationSuccess(false); goHome(); }}
                    className="bg-primary text-white px-8 py-3 rounded-xl font-bold"
                  >
                    Retour à l'accueil
                  </button>
                </motion.div>
              ) : (
                <>
                  <div className="space-y-6">
                    <h2 className="text-4xl md:text-6xl font-black leading-tight">
                      Soutenez le journalisme <span className="text-primary">indépendant</span>.
                    </h2>
                    <p className="text-lg text-slate-600 leading-relaxed">
                      Akwaba Info s'engage à fournir une information de qualité, vérifiée et sans compromis sur l'actualité du continent africain. Votre don nous aide à rester libres.
                    </p>
                  </div>

                  <div className="bg-white rounded-[40px] p-8 shadow-2xl border border-slate-100 space-y-8">
                    <div className="space-y-4">
                      <h4 className="font-bold text-sm">Choisissez un montant</h4>
                      <div className="grid grid-cols-3 gap-3">
                        {['2000', '5000', '10000'].map(amount => (
                          <button 
                            key={amount} 
                            onClick={() => setSelectedAmount(amount)}
                            className={cn(
                              "py-4 border-2 rounded-2xl text-sm font-black transition-all",
                              selectedAmount === amount 
                                ? "border-primary bg-primary/5 text-primary shadow-inner" 
                                : "border-slate-100 hover:border-primary/30"
                            )}
                          >
                            {amount} F
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="font-bold text-sm">Mode de paiement sécurisé</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <button 
                          onClick={() => setSelectedPayment('mobile')}
                          className={cn(
                            "flex flex-col items-center gap-2 p-4 border-2 rounded-2xl transition-all",
                            selectedPayment === 'mobile'
                              ? "border-orange-500 bg-orange-50 text-orange-600"
                              : "border-slate-100 hover:bg-orange-50/50"
                          )}
                        >
                          <Smartphone className={selectedPayment === 'mobile' ? "text-orange-600" : "text-orange-500"} />
                          <span className="text-xs font-bold">Mobile Money</span>
                        </button>
                        <button 
                          onClick={() => setSelectedPayment('card')}
                          className={cn(
                            "flex flex-col items-center gap-2 p-4 border-2 rounded-2xl transition-all",
                            selectedPayment === 'card'
                              ? "border-blue-500 bg-blue-50 text-blue-600"
                              : "border-slate-100 hover:bg-blue-50/50"
                          )}
                        >
                          <CreditCard className={selectedPayment === 'card' ? "text-blue-600" : "text-blue-500"} />
                          <span className="text-xs font-bold">Carte / PayPal</span>
                        </button>
                      </div>
                    </div>

                    <button 
                      onClick={() => setDonationSuccess(true)}
                      className="w-full bg-primary text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                      Confirmer mon don de {selectedAmount} F
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          ) : currentView === 'about' ? (
            <motion.div 
              key="about"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="max-w-3xl mx-auto py-10 space-y-8"
            >
              <button onClick={goHome} className="text-primary text-xs font-bold flex items-center gap-1 mb-4">
                <ArrowLeft size={14} /> Retour à l'accueil
              </button>
              <h2 className="text-4xl font-black">À propos d'Akwaba Info</h2>
              <div className="markdown-body space-y-6">
                <p className="text-lg leading-relaxed">
                  Akwaba Info est un site d’actualité proposant des articles variés et actualisés sur la politique, l’économie, la science, la santé, la culture, l’histoire et le sport. Il permet de suivre facilement l’actualité et d’obtenir des informations fiables en un seul clic.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-10">
                  <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                    <h3 className="text-xl font-black mb-4">Points forts</h3>
                    <ul className="space-y-2 text-slate-600">
                      <li>• Contenu diversifié et régulièrement mis à jour</li>
                      <li>• Navigation facile grâce aux rubriques thématiques</li>
                      <li>• Informations rédigées en français accessible à tous</li>
                    </ul>
                  </div>
                  <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                    <h3 className="text-xl font-black mb-4">Notre Objectif</h3>
                    <p className="text-slate-600">
                      Informer et sensibiliser le public sur les événements et actualités importantes dans différents domaines, rapidement et efficacement.
                    </p>
                  </div>
                </div>

                <h3 className="text-2xl font-black">Ce qui nous distingue</h3>
                <p>
                  Akwaba Info se démarque par un positionnement éditorial centré sur une lecture du monde à partir des réalités africaines, tout en restant ouvert à l’actualité internationale. Contrairement aux médias généralistes classiques, nous mettons en avant :
                </p>
                <ul className="space-y-4">
                  <li className="flex gap-4">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 font-bold text-xs">1</div>
                    <p><strong>Une priorité donnée aux contenus africains</strong> : actualité locale et régionale souvent peu représentée dans les grands médias internationaux.</p>
                  </li>
                  <li className="flex gap-4">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 font-bold text-xs">2</div>
                    <p><strong>Un traitement accessible et pédagogique</strong> : permettre à un large public de comprendre facilement des sujets complexes.</p>
                  </li>
                  <li className="flex gap-4">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 font-bold text-xs">3</div>
                    <p><strong>Une diversité thématique équilibrée</strong> : politique, économie, culture, histoire, etc., avec une attention particulière à l’impact concret sur les populations.</p>
                  </li>
                  <li className="flex gap-4">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 font-bold text-xs">4</div>
                    <p><strong>Une vision positive</strong> : valoriser les initiatives, les innovations et les cultures africaines, et pas uniquement les crises ou faits négatifs.</p>
                  </li>
                </ul>

                <div className="bg-primary text-white p-8 rounded-3xl mt-10">
                  <h3 className="text-xl font-black mb-4 text-white">En résumé</h3>
                  <p className="italic opacity-90">
                    Akwaba Info n’est pas seulement un site d’actualité généraliste ; c’est un média qui propose une vision du monde ancrée en Afrique, avec un regard accessible, positif et éducatif, ce qui constitue sa véritable identité et sa différence.
                  </p>
                </div>
              </div>
            </motion.div>
          ) : currentView === 'privacy' ? (
            <motion.div key="privacy" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto py-10 space-y-8">
              <button onClick={goHome} className="text-primary text-xs font-bold flex items-center gap-1 mb-4">
                <ArrowLeft size={14} /> Retour à l'accueil
              </button>
              <h2 className="text-3xl font-black">Politique de Confidentialité</h2>
              <div className="markdown-body">
                <p>Chez Akwaba Info, la protection de vos données est une priorité. Nous collectons uniquement les informations nécessaires au bon fonctionnement de nos services.</p>
              </div>
            </motion.div>
          ) : currentView === 'terms' ? (
            <motion.div key="terms" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto py-10 space-y-8">
              <button onClick={goHome} className="text-primary text-xs font-bold flex items-center gap-1 mb-4">
                <ArrowLeft size={14} /> Retour à l'accueil
              </button>
              <h2 className="text-4xl font-black">Conditions d'Utilisation</h2>
              <div className="markdown-body">
                <p>L'utilisation de ce site implique l'acceptation pleine et entière des conditions générales d'utilisation décrites ci-après.</p>
              </div>
            </motion.div>
          ) : currentView === 'contact' ? (
            <motion.div 
              key="contact"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto py-10 space-y-12"
            >
              <button onClick={goHome} className="text-primary text-xs font-bold flex items-center gap-1 mb-4">
                <ArrowLeft size={14} /> Retour à l'accueil
              </button>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <h2 className="text-4xl font-black">Contactez-nous</h2>
                  <p className="text-slate-600 leading-relaxed">
                    Une question ? Une suggestion ? Ou vous souhaitez simplement nous dire Akwaba ? Notre équipe est à votre écoute.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                        <Smartphone size={24} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Téléphone</p>
                        <p className="font-bold">06 23 94 00 97</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                        <Send size={24} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Email</p>
                        <p className="font-bold">akwabainfo229@gmail.com</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase">Nom complet</label>
                    <input type="text" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/50 outline-none" placeholder="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase">Email</label>
                    <input type="email" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/50 outline-none" placeholder="john@example.com" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase">Message</label>
                    <textarea rows={4} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/50 outline-none" placeholder="Votre message..."></textarea>
                  </div>
                  <button className="w-full bg-primary text-white py-4 rounded-xl font-black shadow-lg shadow-primary/20">ENVOYER</button>
                </div>
              </div>
            </motion.div>
          ) : currentView === 'cookies' ? (
            <motion.div key="cookies" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto py-10 space-y-8">
              <button onClick={goHome} className="text-primary text-xs font-bold flex items-center gap-1 mb-4">
                <ArrowLeft size={14} /> Retour à l'accueil
              </button>
              <h2 className="text-4xl font-black">Politique des Cookies</h2>
              <div className="markdown-body">
                <p>Nous utilisons des cookies pour améliorer votre expérience sur notre site. Certains sont essentiels, d'autres nous aident à analyser le trafic.</p>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className={cn(
        "border-t py-12 md:py-20 transition-colors",
        isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
      )}>
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="space-y-6">
            <div onClick={goHome} className="flex flex-col gap-6 cursor-pointer">
              <img 
                src="https://raw.githubusercontent.com/Akwabanews/Sources/main/images/2DB685A1-EE6B-478E-B70B-58F490D2948A.jpeg" 
                alt="Akwaba Info Logo" 
                className="w-40 h-40 md:w-56 md:h-56 object-contain rounded-[40px] shadow-2xl border border-slate-100"
                referrerPolicy="no-referrer"
              />
              <h2 className="text-3xl font-black tracking-tighter">
                AKWABA <span className="text-primary">INFO</span>
              </h2>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              Akwaba Info est un site d’actualité proposant des articles variés et actualisés sur la politique, l’économie, la science, la santé, la culture, l’histoire et le sport. L’info du monde en un clic.
            </p>
            <div className="flex gap-4">
              <button className="p-2 bg-slate-100 rounded-full text-slate-600 hover:bg-primary hover:text-white transition-all"><Twitter size={20} /></button>
              <button className="p-2 bg-slate-100 rounded-full text-slate-600 hover:bg-primary hover:text-white transition-all"><Facebook size={20} /></button>
              <button className="p-2 bg-slate-100 rounded-full text-slate-600 hover:bg-primary hover:text-white transition-all"><Linkedin size={20} /></button>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="font-black text-sm uppercase tracking-widest">Catégories</h4>
            <ul className="space-y-3 text-sm text-slate-500">
              {categories.slice(1).map(cat => (
                <li key={cat} onClick={() => handleCategoryClick(cat)} className="hover:text-primary cursor-pointer transition-colors">{cat}</li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
              <h4 className="font-black text-sm uppercase tracking-widest">À propos</h4>
              <ul className="space-y-3 text-sm text-slate-500">
                <li onClick={() => navigateTo('about')} className="hover:text-primary cursor-pointer transition-colors">À propos</li>
                <li onClick={() => navigateTo('privacy')} className="hover:text-primary cursor-pointer transition-colors">Confidentialité</li>
                <li onClick={() => navigateTo('cookies')} className="hover:text-primary cursor-pointer transition-colors">Cookies</li>
                <li onClick={() => navigateTo('terms')} className="hover:text-primary cursor-pointer transition-colors">Conditions</li>
              </ul>
          </div>

          <div className="space-y-6">
            <h4 className="font-black text-sm uppercase tracking-widest">Contact</h4>
            <p className="text-sm text-slate-500">Abidjan, Côte d'Ivoire<br />Plateau, Avenue Marchand</p>
            <p onClick={() => navigateTo('contact')} className="text-sm font-bold text-primary cursor-pointer hover:underline">akwabainfo229@gmail.com</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-slate-100 text-center text-xs text-slate-400">
          © 2026 Akwaba Info. Tous droits réservés. Développé avec passion en Afrique.
        </div>
      </footer>

      {/* Mobile Bottom Nav */}
      <nav className={cn(
        "lg:hidden fixed bottom-0 left-0 right-0 h-16 backdrop-blur-xl border-t flex items-center justify-around px-4 z-50",
        isDarkMode ? "bg-slate-950/90 border-slate-800" : "bg-white/90 border-slate-200"
      )}>
        <button onClick={goHome} className={cn("flex flex-col items-center gap-1", currentView === 'home' ? "text-primary" : "text-slate-400")}>
          <Home size={20} />
          <span className="text-[10px] font-bold">Accueil</span>
        </button>
        <button onClick={() => navigateTo('search')} className={cn("flex flex-col items-center gap-1", currentView === 'search' ? "text-primary" : "text-slate-400")}>
          <Search size={20} />
          <span className="text-[10px] font-bold">Explorer</span>
        </button>
        <button onClick={() => navigateTo('donate')} className={cn("flex flex-col items-center gap-1", currentView === 'donate' ? "text-primary" : "text-slate-400")}>
          <Heart size={20} />
          <span className="text-[10px] font-bold">Soutenir</span>
        </button>
        <button onClick={() => navigateTo('about')} className={cn("flex flex-col items-center gap-1", currentView === 'about' ? "text-primary" : "text-slate-400")}>
          <User size={20} />
          <span className="text-[10px] font-bold">À propos</span>
        </button>
      </nav>
    </div>
    </>
  );
}
