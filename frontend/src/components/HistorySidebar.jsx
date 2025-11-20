import { useState, useEffect } from 'react'
import { BlockMath } from 'react-katex'
import 'katex/dist/katex.min.css'
import { getHistory, removeFromHistory, clearHistory } from '../utils/historyStorage'
import { useLanguage } from '../contexts/LanguageContext'

/**
 * Helper pour grouper l'historique par date
 */
const groupHistoryByDate = (history) => {
  const groups = {
    today: [],
    yesterday: [],
    lastWeek: [],
    older: []
  }

  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  const lastWeek = new Date(today)
  lastWeek.setDate(lastWeek.getDate() - 7)

  history.forEach(item => {
    const date = new Date(item.timestamp)
    const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate())

    if (dateOnly.getTime() === today.getTime()) {
      groups.today.push(item)
    } else if (dateOnly.getTime() === yesterday.getTime()) {
      groups.yesterday.push(item)
    } else if (dateOnly > lastWeek) {
      groups.lastWeek.push(item)
    } else {
      groups.older.push(item)
    }
  })

  return groups
}

function HistorySidebar({ onSelectProblem, onCollapseChange }) {
  const { t } = useLanguage()
  const [history, setHistory] = useState([])
  const [isCollapsed, setIsCollapsed] = useState(false) // Par défaut ouvert sur Desktop
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  useEffect(() => {
    loadHistory()
    const interval = setInterval(loadHistory, 2000)
    return () => clearInterval(interval)
  }, [])

  const loadHistory = () => {
    const historyData = getHistory()
    // Trier par date décroissante
    setHistory(historyData.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)))
  }

  const handleDelete = (id, e) => {
    e.stopPropagation()
    if (window.confirm(t('deleteConfirm'))) {
      removeFromHistory(id)
      loadHistory()
    }
  }

  const handleClearAll = () => {
    if (window.confirm(t('clearConfirm'))) {
      clearHistory()
      loadHistory()
    }
  }

  const handleSelectItem = (item) => {
    if (onSelectProblem) {
      onSelectProblem(item.problem, item.solution)
      // Sur mobile, fermer le menu après sélection
      if (window.innerWidth < 1024) {
        setIsMobileOpen(false)
      }
    }
  }

  useEffect(() => {
    if (onCollapseChange) {
      onCollapseChange(isCollapsed)
    }
  }, [isCollapsed, onCollapseChange])

  const groups = groupHistoryByDate(history)
  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          {!isCollapsed && (
            <h2 className="font-semibold text-gray-900 dark:text-white whitespace-nowrap">
              {t('history')}
            </h2>
          )}
        </div>
        
        {!isCollapsed && history.length > 0 && (
          <button
            onClick={handleClearAll}
            className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
            title={t('clearHistory')}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-2 space-y-6 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center px-4">
            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            {!isCollapsed && (
              <>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{t('emptyHistory')}</p>
                <p className="text-xs text-gray-500 mt-1">{t('emptyHistorySub')}</p>
              </>
            )}
          </div>
        ) : (
          Object.entries(groups).map(([key, items]) => (
            items.length > 0 && (
              <div key={key}>
                {!isCollapsed && (
                  <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    {key === 'today' ? t('today') || "Aujourd'hui" : 
                     key === 'yesterday' ? t('yesterday') || "Hier" :
                     key === 'lastWeek' ? t('lastWeek') || "7 derniers jours" : 
                     t('older') || "Plus ancien"}
                  </h3>
                )}
                <div className="space-y-1">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className={`
                        group relative flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all
                        hover:bg-gray-100 dark:hover:bg-gray-800
                        ${isCollapsed ? 'justify-center' : ''}
                      `}
                      onClick={() => handleSelectItem(item)}
                    >
                      {/* Icon / Preview */}
                      <div className="flex-shrink-0 w-8 h-8 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded flex items-center justify-center text-[10px] overflow-hidden">
                        {isCollapsed ? (
                          <div className="scale-50">
                            <BlockMath math={item.problem} />
                          </div>
                        ) : (
                          <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                        )}
                      </div>

                      {/* Content */}
                      {!isCollapsed && (
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                            {item.solution?.explanation?.summary || "Problème mathématique"}
                          </div>
                          <div className="text-xs text-gray-500 truncate flex items-center gap-2 h-5 overflow-hidden">
                            <div className="scale-75 origin-left opacity-70">
                              <BlockMath math={item.problem} />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Actions (Hover) */}
                      {!isCollapsed && (
                        <button
                          onClick={(e) => handleDelete(item.id, e)}
                          className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-red-600 hover:bg-white dark:hover:bg-gray-700 rounded shadow-sm transition-all"
                          title={t('delete')}
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
          ))
        )}
      </div>

      {/* Footer / Collapse Button */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-800">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          title={isCollapsed ? t('expandMenu') : t('collapseMenu')}
          className={`
            w-full flex items-center gap-3 p-2 rounded-lg text-sm font-medium
            text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors
            ${isCollapsed ? 'justify-center' : ''}
          `}
        >
          <svg 
            className={`w-5 h-5 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} 
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
          {!isCollapsed && <span>{t('collapseMenu')}</span>}
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700"
      >
        <svg className="w-6 h-6 text-gray-700 dark:text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-50 bg-gray-50 dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800
          transition-all duration-300 ease-in-out shadow-xl lg:shadow-none
          ${isMobileOpen ? 'translate-x-0 w-80' : '-translate-x-full lg:translate-x-0'}
          ${isCollapsed && !isMobileOpen ? 'lg:w-20' : 'lg:w-72'}
        `}
      >
        <SidebarContent />
      </aside>
    </>
  )
}

export default HistorySidebar
