import React, { useState } from 'react';
import { 
  Lock, 
  Plus, 
  Trash, 
  Edit3, 
  Save, 
  FileText, 
  LogOut, 
  LayoutDashboard, 
  Settings, 
  ArrowLeft,
  Search,
  ChevronRight,
  Eye,
  Send,
  Copy,
  Check,
  Calendar,
  X,
  Smartphone,
  MapPin,
  LogIn
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Article, Event } from '../types';
import { cn } from '../lib/utils';
import ReactMarkdown from 'react-markdown';

export const AdminLogin = ({ onLogin }: { onLogin: () => void }) => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 border border-slate-100"
      >
        <div className="flex flex-col items-center gap-6 mb-8 text-center">
          <div className="p-4 bg-primary/10 rounded-2xl text-primary">
            <Lock size={40} />
          </div>
          <div>
            <h2 className="text-2xl font-black">Espace Admin</h2>
            <p className="text-slate-400 text-sm mt-1">Connectez-vous avec votre compte Google autorisé.</p>
          </div>
        </div>
        
        <button 
          onClick={onLogin}
          className="w-full bg-white border-2 border-slate-100 text-slate-900 font-black py-4 rounded-2xl hover:bg-slate-50 transition-all shadow-lg flex items-center justify-center gap-3"
        >
          <LogIn size={20} className="text-primary" />
          Se connecter avec Google
        </button>
      </motion.div>
    </div>
  );
};

export const AdminDashboard = ({ 
  articles, 
  events,
  onEditArticle,
  onEditEvent, 
  onCreateArticle,
  onCreateEvent, 
  onDeleteArticle,
  onDeleteEvent, 
  onLogout,
  onGenerateCode 
}: { 
  articles: Article[], 
  events: Event[],
  onEditArticle: (a: Article) => void,
  onEditEvent: (e: Event) => void,
  onCreateArticle: () => void,
  onCreateEvent: () => void,
  onDeleteArticle: (id: string) => void,
  onDeleteEvent: (id: string) => void,
  onLogout: () => void,
  onGenerateCode: () => void
}) => {
  const [activeTab, setActiveTab] = useState<'articles' | 'events'>('articles');
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredArticles = articles.filter(a => 
    a.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredEvents = events.filter(e => 
    e.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    e.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary rounded-2xl text-white shadow-lg shadow-primary/20">
            <LayoutDashboard size={24} />
          </div>
          <div>
            <h2 className="text-4xl font-black tracking-tight">Tableau de Bord</h2>
            <p className="text-slate-400 text-sm">Gérez vos articles et événements culturels.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={onGenerateCode}
            className="px-5 py-3 bg-slate-800 text-white font-bold rounded-2xl hover:bg-slate-700 transition-all flex items-center gap-2 text-sm"
          >
            <Copy size={18} /> Export Code
          </button>
          <button 
            onClick={activeTab === 'articles' ? onCreateArticle : onCreateEvent}
            className="px-5 py-3 bg-primary text-white font-bold rounded-2xl hover:bg-primary/90 transition-all flex items-center gap-2 text-sm shadow-lg shadow-primary/20"
          >
            <Plus size={18} /> {activeTab === 'articles' ? 'Nouvel Article' : 'Nouvel Événement'}
          </button>
          <button 
            onClick={onLogout}
            className="p-3 bg-slate-100 text-slate-500 rounded-2xl hover:bg-red-50 hover:text-red-500 transition-all"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>

      <div className="flex border-b border-slate-100">
        <button 
          onClick={() => setActiveTab('articles')}
          className={cn(
            "px-8 py-4 font-black transition-all border-b-2",
            activeTab === 'articles' ? "border-primary text-primary" : "border-transparent text-slate-400 hover:text-slate-600"
          )}
        >
          Articles
        </button>
        <button 
          onClick={() => setActiveTab('events')}
          className={cn(
            "px-8 py-4 font-black transition-all border-b-2",
            activeTab === 'events' ? "border-primary text-primary" : "border-transparent text-slate-400 hover:text-slate-600"
          )}
        >
          Événements & Culture
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-3 space-y-6">
          <div className="relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder={activeTab === 'articles' ? "Rechercher parmi les articles..." : "Rechercher parmi les événements..."}
              className="w-full bg-white border border-slate-100 rounded-2xl pl-14 pr-6 py-4 shadow-sm focus:ring-2 focus:ring-primary/20 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
            <div className="grid grid-cols-12 px-6 py-4 bg-slate-50/50 border-bottom border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400">
              <div className="col-span-6">{activeTab === 'articles' ? 'Article' : 'Événement'}</div>
              <div className="col-span-2">{activeTab === 'articles' ? 'Catégorie' : 'Lieu'}</div>
              <div className="col-span-2">Date</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>
            <div className="divide-y divide-slate-100">
              {activeTab === 'articles' ? (
                filteredArticles.map(article => (
                  <div key={article.id} className="grid grid-cols-12 px-6 py-4 items-center hover:bg-slate-50/50 transition-colors group">
                    <div className="col-span-6 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100">
                        {article.image && <img src={article.image} className="w-full h-full object-cover" referrerPolicy="no-referrer" />}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 leading-tight line-clamp-1">{article.title}</h4>
                        <p className="text-[10px] text-slate-400 font-medium">Par {article.author}</p>
                      </div>
                    </div>
                    <div className="col-span-2">
                      <span className="text-xs font-bold px-2 py-1 bg-slate-100 rounded-lg text-slate-600 italic line-clamp-1">
                        {article.category}
                      </span>
                    </div>
                    <div className="col-span-2 text-xs text-slate-500 font-mono">
                      {article.date}
                    </div>
                    <div className="col-span-2 flex justify-end gap-2 pr-2">
                      <button 
                        onClick={() => onEditArticle(article)}
                        className="p-2 bg-slate-50 text-slate-400 rounded-lg hover:bg-primary/10 hover:text-primary transition-all"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button 
                        onClick={() => onDeleteArticle(article.id)}
                        className="p-2 bg-slate-50 text-slate-400 rounded-lg hover:bg-red-50 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                filteredEvents.map(event => (
                  <div key={event.id} className="grid grid-cols-12 px-6 py-4 items-center hover:bg-slate-50/50 transition-colors group">
                    <div className="col-span-6 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100">
                        {event.image && <img src={event.image} className="w-full h-full object-cover" referrerPolicy="no-referrer" />}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 leading-tight line-clamp-1">{event.title}</h4>
                        <p className="text-[10px] text-slate-400 font-medium">{event.category}</p>
                      </div>
                    </div>
                    <div className="col-span-2">
                      <span className="text-xs font-bold text-slate-600 line-clamp-1 flex items-center gap-1">
                        <MapPin size={10} /> {event.location}
                      </span>
                    </div>
                    <div className="col-span-2 text-xs text-slate-500 font-mono">
                      {event.date}
                    </div>
                    <div className="col-span-2 flex justify-end gap-2 pr-2">
                      <button 
                        onClick={() => onEditEvent(event)}
                        className="p-2 bg-slate-50 text-slate-400 rounded-lg hover:bg-primary/10 hover:text-primary transition-all"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button 
                        onClick={() => onDeleteEvent(event.id)}
                        className="p-2 bg-slate-50 text-slate-400 rounded-lg hover:bg-red-50 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
              {((activeTab === 'articles' && filteredArticles.length === 0) || (activeTab === 'events' && filteredEvents.length === 0)) && (
                <div className="py-20 text-center space-y-4">
                  <div className="p-4 bg-slate-50 w-20 h-20 rounded-full mx-auto flex items-center justify-center text-slate-200">
                    <FileText size={40} />
                  </div>
                  <p className="text-slate-400 font-medium italic">Aucun contenu trouvé.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl space-y-6">
            <h4 className="font-black text-sm uppercase tracking-widest text-slate-400">Statistiques</h4>
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-white/5 p-4 rounded-2xl">
                <p className="text-[10px] font-bold uppercase text-slate-400">Total Articles</p>
                <p className="text-3xl font-black mt-1 font-mono tracking-tighter">{articles.length}</p>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl">
                <p className="text-[10px] font-bold uppercase text-slate-400">Total Événements</p>
                <p className="text-3xl font-black mt-1 font-mono tracking-tighter">{events.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-lg space-y-4">
            <div className="flex items-center gap-3 text-slate-900">
              <Settings size={20} />
              <h4 className="font-bold">Paramètres</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed italic">
              Vous êtes actuellement en mode <strong>"Static Publisher"</strong>. Les changements sont sauvegardés dans votre navigateur.
            </p>
            <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
              <p className="text-[10px] text-emerald-700 font-bold leading-tight uppercase mb-1 flex items-center gap-1">
                ✅ Connecté au Cloud
              </p>
              <p className="text-[10px] text-emerald-600 leading-tight">
                Vos modifications sont désormais publiées en temps réel sur le site.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const AdminEditor = ({ 
  type,
  data, 
  onSave, 
  onCancel 
}: { 
  type: 'article' | 'event',
  data: any, 
  onSave: (d: any) => void, 
  onCancel: () => void 
}) => {
  const [formData, setFormData] = useState<any>({
    id: data.id || Date.now().toString(),
    slug: data.slug || '',
    title: data.title || '',
    date: data.date || new Date().toISOString().split('T')[0],
    image: data.image || '',
    excerpt: data.excerpt || '',
    content: data.content || '',
    // Article specific
    ...(type === 'article' ? {
      category: data.category || 'Afrique',
      author: data.author || 'Équipe Akwaba Info',
      readingTime: data.readingTime || '4 min',
      views: data.views || 0,
      likes: data.likes || 0,
    } : {
      // Event specific
      location: data.location || '',
      category: data.category || 'Événement Culturel',
    }),
    ...data
  });
  
  const [previewMode, setPreviewMode] = useState(false);

  const categories = type === 'article' 
    ? ['Afrique', 'Monde', 'Économie', 'Politique', 'Tech', 'Culture', 'Urgent']
    : ['Concert', 'Conférence', 'Exposition', 'Festival', 'Sport', 'Événement Culturel'];

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 space-y-8">
      <div className="flex items-center justify-between">
        <button 
          onClick={onCancel}
          className="flex items-center gap-2 text-slate-400 hover:text-slate-900 font-bold transition-all text-sm"
        >
          <ArrowLeft size={18} /> Revenir au tableau de bord
        </button>
        <div className="flex gap-3">
          <button 
            onClick={() => setPreviewMode(!previewMode)}
            className={cn(
              "px-5 py-2 rounded-xl flex items-center gap-2 font-bold text-sm transition-all",
              previewMode ? "bg-slate-200 text-slate-700" : "bg-white border border-slate-200 text-slate-500"
            )}
          >
            {previewMode ? <Edit3 size={18} /> : <Eye size={18} />}
            {previewMode ? "Éditer" : "Aperçu"}
          </button>
          <button 
            onClick={() => onSave(formData)}
            className="px-6 py-2 bg-primary text-white rounded-xl flex items-center gap-2 font-black shadow-lg shadow-primary/20 hover:scale-105 transition-all text-sm"
          >
            <Check size={18} /> Enregistrer {type === 'article' ? "l'article" : "l'événement"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          {previewMode ? (
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl min-h-[600px] animate-in fade-in slide-in-from-bottom-2">
              <h1 className="text-4xl font-black mb-6">{formData.title || "Titre de l'élément"}</h1>
              {formData.image && (
                <div className="aspect-video rounded-2xl overflow-hidden mb-8">
                  <img src={formData.image} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
              )}
              {type === 'event' && (
                <div className="flex items-center gap-4 mb-6 text-primary font-bold">
                  <span className="flex items-center gap-1"><Calendar size={18} /> {formData.date}</span>
                  <span className="flex items-center gap-1"><MapPin size={18} /> {formData.location}</span>
                </div>
              )}
              <div className="markdown-body">
                <ReactMarkdown>{formData.content || "*Aucun contenu pour le moment...*"}</ReactMarkdown>
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Titre {type === 'article' ? "de l'article" : "de l'événement"}</label>
                <input 
                  type="text" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Entrez un titre percutant..."
                  className="w-full bg-white border border-slate-100 rounded-2xl px-6 py-5 text-2xl font-black outline-none focus:ring-2 focus:ring-primary/20 shadow-sm"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Description / Contenu (Markdown)</label>
                  <span className="text-[10px] text-primary font-bold">Le Markdown est activé</span>
                </div>
                <textarea 
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  placeholder="Décrivez votre contenu ici..."
                  className="w-full bg-white border border-slate-100 rounded-3xl px-6 py-6 min-h-[500px] font-mono text-sm leading-relaxed outline-none focus:ring-2 focus:ring-primary/20 shadow-sm resize-y"
                />
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-lg space-y-6">
            <h4 className="font-black text-sm uppercase tracking-widest">Métadonnées</h4>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Slug (URL)</label>
                <input 
                  type="text" 
                  value={formData.slug}
                  onChange={(e) => setFormData({...formData, slug: e.target.value})}
                  className="w-full bg-slate-50 rounded-xl px-4 py-3 text-xs outline-none focus:ring-2 focus:ring-primary/10"
                  placeholder="titre-de-l-element"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Catégorie</label>
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value as any})}
                  className="w-full bg-slate-50 rounded-xl px-4 py-3 text-xs outline-none focus:ring-2 focus:ring-primary/10 appearance-none font-bold italic"
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {type === 'event' && (
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Lieu</label>
                  <div className="relative">
                    <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="text" 
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      className="w-full bg-slate-50 rounded-xl pl-9 pr-4 py-3 text-xs outline-none focus:ring-2 focus:ring-primary/10"
                      placeholder="Ex: Cotonou, Bénin"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">URL de l'image</label>
                <div className="relative">
                  <Smartphone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    value={formData.image}
                    onChange={(e) => setFormData({...formData, image: e.target.value})}
                    className="w-full bg-slate-50 rounded-xl pl-9 pr-4 py-3 text-[10px] outline-none focus:ring-2 focus:ring-primary/10"
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>
              </div>

              {type === 'article' && (
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Auteur</label>
                  <input 
                    type="text" 
                    value={formData.author}
                    onChange={(e) => setFormData({...formData, author: e.target.value})}
                    className="w-full bg-slate-50 rounded-xl px-4 py-3 text-xs outline-none focus:ring-2 focus:ring-primary/10"
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Date {type === 'article' ? "de publication" : "de l'événement"}</label>
                <input 
                  type="date" 
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="w-full bg-slate-50 rounded-xl px-4 py-3 text-xs outline-none focus:ring-2 focus:ring-primary/10"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Résumé (Extrait)</label>
                <textarea 
                  value={formData.excerpt}
                  onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                  className="w-full bg-slate-50 rounded-xl px-4 py-3 text-xs outline-none focus:ring-2 focus:ring-primary/10 min-h-[100px] resize-none"
                  placeholder="Un court résumé..."
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ExportModal = ({ articles, events, onClose }: { articles: Article[], events: Event[], onClose: () => void }) => {
  const [copied, setCopied] = useState(false);
  const [activeExport, setActiveExport] = useState<'articles' | 'events'>('articles');
  
  const articleCode = `export const MOCK_ARTICLES: Article[] = ${JSON.stringify(articles, null, 2)};`;
  const eventCode = `export const MOCK_EVENTS: Event[] = ${JSON.stringify(events, null, 2)};`;

  const code = activeExport === 'articles' ? articleCode : eventCode;

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h3 className="text-xl font-black italic">Code d'Exportation</h3>
            <p className="text-xs text-slate-400 font-medium">Copiez ce code et collez-le dans constants.ts</p>
          </div>
          <button onClick={onClose} className="p-2 bg-white border border-slate-200 rounded-full hover:bg-slate-50 transition-all">
            <X size={20} />
          </button>
        </div>
        
        <div className="flex bg-slate-100 p-1 m-4 rounded-xl w-fit">
          <button 
            onClick={() => setActiveExport('articles')}
            className={cn(
              "px-6 py-2 rounded-lg text-xs font-black transition-all",
              activeExport === 'articles' ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-slate-700"
            )}
          >
            Articles
          </button>
          <button 
            onClick={() => setActiveExport('events')}
            className={cn(
              "px-6 py-2 rounded-lg text-xs font-black transition-all",
              activeExport === 'events' ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-slate-700"
            )}
          >
            Événements
          </button>
        </div>

        <div className="p-8 pt-2">
          <div className="relative">
            <textarea 
              readOnly
              className="w-full h-[350px] bg-slate-900 text-emerald-400 font-mono text-[10px] p-6 rounded-2xl outline-none"
              value={code}
            />
            <button 
              onClick={handleCopy}
              className={cn(
                "absolute top-4 right-4 px-4 py-2 rounded-xl flex items-center gap-2 font-black text-xs transition-all shadow-xl",
                copied ? "bg-emerald-500 text-white" : "bg-white text-slate-900 border border-slate-200"
              )}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? "Copié !" : "Copier le code"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
