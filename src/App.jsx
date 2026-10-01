import React, { useState, useEffect } from 'react';
import { 
  Menu, X, ArrowRight, Briefcase, Calculator, Scale, Users, 
  LineChart, Building, MapPin, Mail, Phone, ChevronRight, 
  Landmark, ShieldCheck, CheckCircle2, Factory, HandHeart,
  FileText, TrendingUp, BookOpen, Settings, Search
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Safe dummy config to prevent the app from crashing before you add real Firebase keys
const firebaseConfig = {
  apiKey: "dummy-key-replace-me",
  authDomain: "dummy.firebaseapp.com",
  projectId: "dummy-project",
  storageBucket: "dummy.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456:web:123456"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = 'advisor-business-consulting-fr';

const NAV_LINKS = [
  { label: 'Accueil', href: '#accueil' },
  { label: 'À Propos', href: '#apropos' },
  { label: 'Expertise', href: '#expertise' },
  { label: 'Services', href: '#services' },
  { label: 'Contact', href: '#contact' },
];

const EXPERTISE = [
  { icon: <Calculator className="w-5 h-5" />, title: 'Comptabilité' },
  { icon: <Landmark className="w-5 h-5" />, title: 'Fiscalité' },
  { icon: <Users className="w-5 h-5" />, title: 'Social / Ressources Humaines' },
  { icon: <Scale className="w-5 h-5" />, title: 'Juridique' },
  { icon: <LineChart className="w-5 h-5" />, title: 'Conseil en gestion' }
];

const METIERS = [
  { title: 'Les métiers du chiffre', desc: 'Finance, Fiscalité, comptabilité & contrôle de gestion' },
  { title: 'Les métiers juridiques', desc: 'Accompagnement légal et secrétariat juridique' },
  { title: 'Les métiers des RH', desc: 'Gestion sociale et développement du capital humain' },
  { title: 'Le conseil en investissement', desc: 'Stratégie financière et accompagnement des investisseurs' }
];

const SECTEURS = [
  { icon: <Factory className="w-6 h-6 mb-4 text-slate-700" />, title: 'Activités industrielles, commerciales et artisanales' },
  { icon: <Briefcase className="w-6 h-6 mb-4 text-slate-700" />, title: 'Activités libérales' },
  { icon: <HandHeart className="w-6 h-6 mb-4 text-slate-700" />, title: 'Économie solidaire et organismes sans but lucratif' },
  { icon: <Building className="w-6 h-6 mb-4 text-slate-700" />, title: 'Organismes publiques' },
];

const SERVICES = [
  { icon: <TrendingUp />, title: 'Conseil et assistance aux investisseurs' },
  { icon: <Settings />, title: 'Optimisation des coûts' },
  { icon: <LineChart />, title: 'Contrôle de gestion' },
  { icon: <Landmark />, title: 'Conseil et assistance en Fiscalité' },
  { icon: <Calculator />, title: 'Gestion comptable et financière' },
  { icon: <Scale />, title: 'Affaires juridiques' },
  { icon: <Users />, title: 'Ressources humaines' },
  { icon: <Briefcase />, title: 'Organisation' },
  { icon: <Search />, title: 'Audit' },
  { icon: <ShieldCheck />, title: 'Assurance' },
  { icon: <BookOpen />, title: 'Formation' },
];

export default function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  
  const [formData, setFormData] = useState({ nom: '', email: '', sujet: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });

  useEffect(() => {
    const initAuth = async () => {
      try {
        await signInAnonymously(auth);
      } catch (error) {
        console.warn("Authentication skipped due to dummy config. Contact form won't save yet.");
      }
    };
    initAuth();

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus({ type: '', message: '' });
    
    if (firebaseConfig.apiKey === "dummy-key-replace-me") {
      setSubmitStatus({ type: 'error', message: "Veuillez configurer vos clés Firebase pour envoyer un message." });
      return;
    }

    if (!formData.nom || !formData.email || !formData.message) {
      setSubmitStatus({ type: 'error', message: 'Veuillez remplir tous les champs obligatoires.' });
      return;
    }

    setIsSubmitting(true);

    try {
      const contactCollectionRef = collection(db, 'artifacts', appId, 'public', 'data', 'contact_inquiries');
      await addDoc(contactCollectionRef, {
        ...formData,
        senderId: user?.uid || 'anonymous',
        createdAt: serverTimestamp()
      });
      
      setSubmitStatus({ type: 'success', message: 'Votre message a été envoyé avec succès. Nous vous contacterons très prochainement.' });
      setFormData({ nom: '', email: '', sujet: '', message: '' });
    } catch (error) {
      setSubmitStatus({ type: 'error', message: "Une erreur s'est produite lors de l'envoi. Veuillez réessayer." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-slate-200 selection:text-slate-900">
      <style>{`
        html { scroll-behavior: smooth; }
        body { margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }
      `}</style>

      {/* Header */}
      <header className="fixed w-full top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex-shrink-0 flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo(0,0)}>
              <div className="w-10 h-10 bg-slate-900 text-white flex items-center justify-center font-bold text-xl rounded-sm">
                ABC
              </div>
              <div className="hidden sm:block">
                <h1 className="text-base font-bold leading-none text-slate-900 uppercase tracking-widest">Advisor Business</h1>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500 mt-1">Consulting</p>
              </div>
            </div>

            <nav className="hidden md:flex space-x-10">
              {NAV_LINKS.map((link) => (
                <a 
                  key={link.label} 
                  href={link.href}
                  className="text-xs font-semibold uppercase tracking-wider text-slate-500 hover:text-slate-900 transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="md:hidden flex items-center">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-slate-900 p-2"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100">
            <div className="px-4 py-6 space-y-4">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-sm font-semibold uppercase tracking-wider text-slate-900"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </header>

      <main className="pt-20">
        <section id="accueil" className="relative pt-32 pb-40 lg:pt-48 lg:pb-56 overflow-hidden bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 mb-8">
                <div className="w-8 h-[1px] bg-slate-900"></div>
                <span className="text-xs font-bold uppercase tracking-widest text-slate-900">Cabinet de Conseil</span>
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.05] mb-8">
                Bienvenue sur le site internet d'Advisor Business Consulting.
              </h1>
              <p className="text-xl sm:text-2xl text-slate-500 font-light mb-12">
                Besoin d'un partenaire ?
              </p>
              <div>
                <a 
                  href="#contact" 
                  className="inline-flex justify-center items-center gap-2 px-8 py-4 text-sm font-bold uppercase tracking-wider text-white bg-slate-900 hover:bg-slate-800 transition-colors rounded-sm"
                >
                  Nous Contacter
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </section>

        <section id="apropos" className="py-24 lg:py-32 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-8">À Propos</h2>
                <div className="prose prose-slate prose-lg">
                  <p className="text-slate-600 leading-relaxed font-light">
                    Nous sommes organisés pour accompagner le chef d'entreprise sur toute la vie de son entreprise. 
                  </p>
                  <p className="text-slate-600 leading-relaxed font-light mt-6">
                    La qualité de services que notre cabinet propose repose sur des principes fondamentaux et une déontologie que chacun de nos collaborateurs s'engage à respecter.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-8 border-b border-slate-200 pb-4">Nos Principaux Métiers</h3>
                <ul className="space-y-6">
                  {METIERS.map((metier, idx) => (
                    <li key={idx} className="flex flex-col">
                      <span className="text-lg font-bold text-slate-900">{metier.title}</span>
                      <span className="text-sm text-slate-500 mt-1">{metier.desc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section id="expertise" className="py-24 lg:py-32 bg-slate-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-6">Domaines d'Expertise</h2>
              <div className="w-24 h-1 bg-blue-600"></div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-px bg-slate-700 border border-slate-700">
              {EXPERTISE.map((exp, idx) => (
                <div key={idx} className="bg-slate-900 p-8 hover:bg-slate-800 transition-colors flex flex-col items-start">
                  <div className="text-slate-400 mb-6">{exp.icon}</div>
                  <h4 className="text-lg font-semibold text-white leading-tight">{exp.title}</h4>
                </div>
              ))}
            </div>

            <div className="mt-32">
              <h3 className="text-2xl font-bold tracking-tight mb-12">Secteurs d'activités</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {SECTEURS.map((secteur, idx) => (
                  <div key={idx} className="border-t border-slate-700 pt-6">
                    {secteur.icon}
                    <h4 className="text-base font-medium text-slate-300 leading-snug">{secteur.title}</h4>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="services" className="py-24 lg:py-32 bg-slate-50 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">Nos Services</h2>
              <p className="mt-4 text-lg text-slate-500 font-light max-w-2xl">
                Un accompagnement complet et sur-mesure pour répondre aux exigences spécifiques de votre organisation.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {SERVICES.map((service, idx) => (
                <div key={idx} className="bg-white p-6 border border-slate-200 rounded-sm hover:border-slate-900 hover:shadow-lg transition-all duration-300 group">
                  <div className="w-10 h-10 flex items-center justify-center bg-slate-50 text-slate-600 mb-4 group-hover:bg-slate-900 group-hover:text-white transition-colors rounded-sm">
                    {React.cloneElement(service.icon, { className: "w-5 h-5" })}
                  </div>
                  <h4 className="text-base font-bold text-slate-900 leading-snug">{service.title}</h4>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="py-24 lg:py-32 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-5 gap-16">
              
              <div className="lg:col-span-2">
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-6">Contact</h2>
                <p className="text-slate-500 font-light mb-12 text-lg">
                  Prenez contact avec nos experts pour échanger sur vos besoins et découvrir notre approche.
                </p>

                <div className="space-y-8">
                  <div className="flex items-start">
                    <MapPin className="w-6 h-6 text-slate-400 mt-1 mr-4" />
                    <div>
                      <h4 className="font-bold text-slate-900 uppercase tracking-wide text-sm mb-1">Siège Social</h4>
                      <p className="text-slate-600">Casablanca, Maroc</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Mail className="w-6 h-6 text-slate-400 mt-1 mr-4" />
                    <div>
                      <h4 className="font-bold text-slate-900 uppercase tracking-wide text-sm mb-1">Email</h4>
                      <p className="text-slate-600">contact@advisor-bc.com</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-3">
                <div className="bg-slate-50 p-8 sm:p-10 border border-slate-200 rounded-sm">
                  <h3 className="text-xl font-bold text-slate-900 mb-8">Envoyer un message</h3>
                  
                  {submitStatus.message && (
                    <div className={`mb-8 p-4 rounded-sm border ${submitStatus.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                      <div className="flex items-center gap-3">
                        {submitStatus.type === 'success' && <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />}
                        <p className="text-sm font-medium">{submitStatus.message}</p>
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleContactSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="nom" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Nom *</label>
                        <input
                          type="text"
                          id="nom"
                          name="nom"
                          value={formData.nom}
                          onChange={handleInputChange}
                          className="block w-full border-0 border-b-2 border-slate-200 bg-transparent py-2 px-0 text-slate-900 focus:border-slate-900 focus:ring-0 sm:text-sm transition-colors"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Email *</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="block w-full border-0 border-b-2 border-slate-200 bg-transparent py-2 px-0 text-slate-900 focus:border-slate-900 focus:ring-0 sm:text-sm transition-colors"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="sujet" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Sujet</label>
                      <input
                        type="text"
                        id="sujet"
                        name="sujet"
                        value={formData.sujet}
                        onChange={handleInputChange}
                        className="block w-full border-0 border-b-2 border-slate-200 bg-transparent py-2 px-0 text-slate-900 focus:border-slate-900 focus:ring-0 sm:text-sm transition-colors"
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Message *</label>
                      <textarea
                        id="message"
                        name="message"
                        rows={4}
                        value={formData.message}
                        onChange={handleInputChange}
                        className="block w-full border-0 border-b-2 border-slate-200 bg-transparent py-2 px-0 text-slate-900 focus:border-slate-900 focus:ring-0 sm:text-sm transition-colors resize-none"
                        required
                      />
                    </div>

                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`inline-flex justify-center items-center px-8 py-4 text-sm font-bold uppercase tracking-wider text-white bg-slate-900 hover:bg-slate-800 transition-colors rounded-sm ${isSubmitting ? 'opacity-70 cursor-wait' : ''}`}
                      >
                        {isSubmitting ? 'Envoi en cours...' : 'Envoyer le message'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>

            </div>
          </div>
        </section>
      </main>

      <footer className="bg-slate-950 py-12 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-slate-800 text-white flex items-center justify-center font-bold text-xs rounded-sm">
                ABC
              </div>
              <span className="text-slate-300 font-semibold tracking-widest text-sm uppercase">Advisor Business Consulting</span>
            </div>
            <div className="text-slate-500 text-sm font-light">
              &copy; {new Date().getFullYear()} Advisor Business Consulting. Tous droits réservés.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}