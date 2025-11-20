import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

function LandingPage({ onStart }) {
  const { t, language, setLanguage } = useLanguage();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-sans transition-colors">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-xl font-bold tracking-tight">Math Assistant</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                <button 
                  onClick={() => setLanguage('fr')}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${language === 'fr' ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
                >
                  FR
                </button>
                <button 
                  onClick={() => setLanguage('en')}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${language === 'en' ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
                >
                  EN
                </button>
              </div>
              <button
                onClick={onStart}
                className="hidden sm:flex px-5 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                {language === 'fr' ? 'Commencer' : 'Get Started'}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-b from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
            {language === 'fr' ? 'Maîtrisez les maths.' : 'Master Math.'} <br />
            <span className="text-blue-600">{language === 'fr' ? 'Sans effort.' : 'Effortlessly.'}</span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400 mb-10">
            {language === 'fr' 
              ? "L'intelligence artificielle qui résout vos problèmes mathématiques et vous explique chaque étape comme un professeur particulier."
              : "The artificial intelligence that solves your math problems and explains every step like a personal tutor."}
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={onStart}
              className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg shadow-xl shadow-blue-500/30 hover:bg-blue-700 hover:scale-105 transition-all"
            >
              {language === 'fr' ? 'Essayer gratuitement' : 'Try for free'}
            </button>
            <a
              href="#features"
              className="px-8 py-4 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl font-bold text-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
            >
              {language === 'fr' ? 'En savoir plus' : 'Learn more'}
            </a>
          </div>
        </div>
        
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-gradient-to-tr from-blue-500/20 to-purple-500/20 rounded-full blur-3xl -z-10 opacity-50 animate-pulse"></div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">{language === 'fr' ? 'Scan Intelligent' : 'Smart Scan'}</h3>
              <p className="text-gray-500 dark:text-gray-400">
                {language === 'fr' 
                  ? "Prenez une photo de n'importe quel problème, manuscrit ou imprimé. Notre IA le comprend instantanément."
                  : "Snap a photo of any problem, handwritten or printed. Our AI understands it instantly."}
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">{language === 'fr' ? 'Explications Pas à Pas' : 'Step-by-Step'}</h3>
              <p className="text-gray-500 dark:text-gray-400">
                {language === 'fr'
                  ? "Ne recevez pas juste la réponse. Comprenez le 'pourquoi' et le 'comment' avec des explications détaillées."
                  : "Don't just get the answer. Understand the 'why' and 'how' with detailed explanations."}
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">{language === 'fr' ? 'Chat Interactif' : 'Interactive Chat'}</h3>
              <p className="text-gray-500 dark:text-gray-400">
                {language === 'fr'
                  ? "Bloqué sur une étape ? Posez des questions à l'IA comme à un vrai tuteur pour clarifier vos doutes."
                  : "Stuck on a step? Ask the AI questions just like a real tutor to clarify your doubts."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 py-12 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-500">
            &copy; 2025 Math Assistant. {language === 'fr' ? 'Tous droits réservés.' : 'All rights reserved.'}
          </p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;

