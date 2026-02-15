"use client"
import { useState, useEffect } from "react"
import { Button } from "@/app/sign-in/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/sign-in/ui/card"
import { Textarea } from "@/app/sign-in/ui/textarea"
import { Input } from "@/app/sign-in/ui/input"
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs"
import { Sparkles, Save, Loader2, Wand2, Tags, Search, Pencil, Trash2, Moon, Sun, Plus, X, Calendar, Clock } from "lucide-react"

interface Note {
  _id: string
  title: string
  content: string
  tags: string[]
  createdAt: string
}

export default function Home() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [summary, setSummary] = useState("")
  const [aiTags, setAiTags] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingType, setLoadingType] = useState<'summary' | 'improve' | 'tags' | null>(null)
  
  const [notes, setNotes] = useState<Note[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showNewNote, setShowNewNote] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  useEffect(() => {
    fetchNotes()
  }, [])

  const fetchNotes = async () => {
    try {
      const res = await fetch('/api/notes')
      const data = await res.json()
      setNotes(data)
    } catch (error) {
      console.error("Failed to fetch notes:", error)
    }
  }

  const handleSummary = async () => {
    if (!content) return
    setLoading(true)
    setLoadingType('summary')
    
    try {
      const res = await fetch('/api/ai/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      })
      
      const data = await res.json()
      if (res.ok) setSummary(data.summary)
      else alert(data.error)
    } catch (error) {
      alert("Failed to generate summary")
    } finally {
      setLoading(false)
      setLoadingType(null)
    }
  }

  const handleImprove = async () => {
    if (!content) return
    setLoading(true)
    setLoadingType('improve')
    
    try {
      const res = await fetch('/api/ai/improve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      })
      
      const data = await res.json()
      if (res.ok) setContent(data.improved)
      else alert(data.error)
    } catch (error) {
      alert("Failed to improve content")
    } finally {
      setLoading(false)
      setLoadingType(null)
    }
  }

  const handleTags = async () => {
    if (!content) return
    setLoading(true)
    setLoadingType('tags')
    
    try {
      const res = await fetch('/api/ai/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, title })
      })
      
      const data = await res.json()
      if (res.ok) setAiTags(data.tags)
      else alert(data.error)
    } catch (error) {
      alert("Failed to generate tags")
    } finally {
      setLoading(false)
      setLoadingType(null)
    }
  }

  const handleSave = async () => {
    if (!title || !content) return
    
    const allTags = [...new Set([...aiTags, summary].filter(Boolean))]
    
    try {
      if (editingId) {
        await fetch('/api/notes', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingId, title, content, tags: allTags })
        })
      } else {
        await fetch('/api/notes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, content, tags: allTags })
        })
      }
      
      setTitle("")
      setContent("")
      setSummary("")
      setAiTags([])
      setEditingId(null)
      setShowNewNote(false)
      fetchNotes()
    } catch (error) {
      alert("Failed to save note")
    }
  }

  const handleEdit = (note: Note) => {
    setTitle(note.title)
    setContent(note.content)
    setAiTags(note.tags)
    setEditingId(note._id)
    setShowNewNote(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this note?")) return
    
    try {
      await fetch(`/api/notes?id=${id}`, { method: 'DELETE' })
      fetchNotes()
    } catch (error) {
      alert("Failed to delete note")
    }
  }

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    }).format(date)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-900 transition-all duration-700">
      
      {/* Decorative gradient blobs */}
      <div className="fixed top-0 left-0 w-96 h-96 bg-purple-300 dark:bg-purple-900/30 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl opacity-20 animate-blob" />
      <div className="fixed top-0 right-0 w-96 h-96 bg-blue-300 dark:bg-blue-900/30 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
      <div className="fixed bottom-0 left-1/2 w-96 h-96 bg-pink-300 dark:bg-pink-900/30 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <header className="mb-10 sm:mb-16">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div className="space-y-2">
              <h1 className="text-5xl sm:text-6xl font-black bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600 dark:from-violet-400 dark:to-blue-400 bg-clip-text text-transparent">
                AI Notes
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base font-medium">
                ✨ Supercharge your notes with AI-powered intelligence
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="w-11 h-11 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center shadow-lg"
              >
                {darkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-slate-700" />}
              </button>
              
              <SignedOut>
                <SignInButton mode="modal">
                  <Button className="h-11 px-6 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
                    Get Started
                  </Button>
                </SignInButton>
              </SignedOut>
              
              <SignedIn>
                <div className="scale-110">
                  <UserButton afterSignOutUrl="/" />
                </div>
              </SignedIn>
            </div>
          </div>
        </header>

        <SignedIn>
          {/* Search & New Note */}
          <div className="mb-8 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
              <Input
                placeholder="Search notes, tags, content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg focus:shadow-xl focus:border-violet-400 dark:focus:border-violet-600 transition-all duration-200"
              />
            </div>
            
            {!showNewNote && (
              <Button 
                onClick={() => setShowNewNote(true)} 
                className="h-14 px-8 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold rounded-2xl gap-2 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95"
              >
                <Plus className="w-5 h-5" /> Create Note
              </Button>
            )}
          </div>

          {/* Note Editor */}
          {showNewNote && (
            <div className="mb-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl border-2 border-gray-200 dark:border-gray-700 shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950/50 dark:to-purple-950/50 border-b border-gray-200 dark:border-gray-700 p-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    {editingId ? <><Pencil className="w-6 h-6 text-violet-600" /> Edit Note</> : <><Sparkles className="w-6 h-6 text-violet-600" /> New Note</>}
                  </h2>
                  <button
                    onClick={() => {
                      setShowNewNote(false)
                      setTitle("")
                      setContent("")
                      setSummary("")
                      setAiTags([])
                      setEditingId(null)
                    }}
                    className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center"
                  >
                    <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                <Input 
                  placeholder="✍️ Give your note a title..." 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-2xl font-bold border-2 border-gray-200 dark:border-gray-700 h-14 rounded-2xl focus:border-violet-400 dark:focus:border-violet-600 transition-all"
                />
                
                <Textarea 
                  placeholder="📝 Start writing your thoughts..." 
                  className="min-h-[240px] resize-none border-2 border-gray-200 dark:border-gray-700 rounded-2xl text-base leading-relaxed focus:border-violet-400 dark:focus:border-violet-600 transition-all"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
                
                {/* AI Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  <button 
                    onClick={handleSummary} 
                    disabled={loading || !content} 
                    className="px-5 py-3 rounded-xl border-2 border-violet-200 dark:border-violet-800 bg-violet-50 dark:bg-violet-950/30 hover:bg-violet-100 dark:hover:bg-violet-900/40 text-violet-700 dark:text-violet-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                  >
                    {loading && loadingType === 'summary' ? 
                      <Loader2 className="w-4 h-4 animate-spin" /> : 
                      <Sparkles className="w-4 h-4" />
                    }
                    AI Summary
                  </button>
                  
                  <button 
                    onClick={handleImprove} 
                    disabled={loading || !content} 
                    className="px-5 py-3 rounded-xl border-2 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                  >
                    {loading && loadingType === 'improve' ? 
                      <Loader2 className="w-4 h-4 animate-spin" /> : 
                      <Wand2 className="w-4 h-4" />
                    }
                    AI Improve
                  </button>
                  
                  <button 
                    onClick={handleTags} 
                    disabled={loading || !content} 
                    className="px-5 py-3 rounded-xl border-2 border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                  >
                    {loading && loadingType === 'tags' ? 
                      <Loader2 className="w-4 h-4 animate-spin" /> : 
                      <Tags className="w-4 h-4" />
                    }
                    AI Tags
                  </button>
                  
                  <div className="flex-1" />
                  
                  <Button 
                    onClick={handleSave} 
                    disabled={!title || !content} 
                    className="px-8 py-6 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
                  >
                    <Save className="w-5 h-5 mr-2" />
                    {editingId ? 'Update Note' : 'Save Note'}
                  </Button>
                </div>

                {/* AI Results */}
                {summary && (
                  <div className="p-5 rounded-2xl bg-gradient-to-r from-violet-100 to-purple-100 dark:from-violet-950/50 dark:to-purple-950/50 border-2 border-violet-200 dark:border-violet-800">
                    <div className="flex items-start gap-3">
                      <Sparkles className="w-5 h-5 text-violet-600 dark:text-violet-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-bold text-violet-900 dark:text-violet-300 mb-1">AI Summary</p>
                        <p className="text-violet-800 dark:text-violet-200 font-medium italic">&quot;{summary}&quot;</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {aiTags.length > 0 && (
                  <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-950/50 dark:to-teal-950/50 border-2 border-emerald-200 dark:border-emerald-800">
                    <div className="flex items-start gap-3">
                      <Tags className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-bold text-emerald-900 dark:text-emerald-300 mb-2">AI Tags</p>
                        <div className="flex gap-2 flex-wrap">
                          {aiTags.map((tag, i) => (
                            <span key={i} className="px-3 py-1.5 rounded-lg bg-emerald-200 dark:bg-emerald-900/50 text-emerald-900 dark:text-emerald-200 text-sm font-semibold">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Notes Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredNotes.map((note) => (
              <div 
                key={note._id} 
                className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border-2 border-gray-200 dark:border-gray-700 hover:border-violet-300 dark:hover:border-violet-700 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              >
                <div className="p-6 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-2 flex-1">
                      {note.title}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                      <Calendar className="w-3 h-3" />
                      <span className="font-medium">{formatDate(note.createdAt)}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-4">
                    {note.content}
                  </p>
                  
                  {note.tags.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                      {note.tags.slice(0, 3).map((tag, i) => (
                        <span key={i} className="px-3 py-1 rounded-lg bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 text-xs font-semibold">
                          #{tag}
                        </span>
                      ))}
                      {note.tags.length > 3 && (
                        <span className="px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-semibold">
                          +{note.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                  
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => handleEdit(note)}
                      className="flex-1 px-4 py-2.5 rounded-xl bg-violet-100 dark:bg-violet-900/30 hover:bg-violet-200 dark:hover:bg-violet-800/40 text-violet-700 dark:text-violet-300 font-semibold transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                    >
                      <Pencil className="w-4 h-4" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(note._id)}
                      className="flex-1 px-4 py-2.5 rounded-xl bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-800/40 text-red-700 dark:text-red-300 font-semibold transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredNotes.length === 0 && (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 mb-6">
                <Sparkles className="w-10 h-10 text-violet-600 dark:text-violet-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                No notes yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Create your first AI-powered note to get started!
              </p>
              {!showNewNote && (
                <Button 
                  onClick={() => setShowNewNote(true)} 
                  className="h-12 px-6 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                >
                  <Plus className="w-5 h-5 mr-2" /> Create Your First Note
                </Button>
              )}
            </div>
          )}
        </SignedIn>

        {/* Sign Out State */}
        <SignedOut>
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 mb-8">
              <Sparkles className="w-12 h-12 text-violet-600 dark:text-violet-400" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Welcome to AI Notes
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              Transform your note-taking with the power of AI. Summarize, improve, and organize your thoughts effortlessly.
            </p>
            <SignInButton mode="modal">
              <Button className="h-14 px-8 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-200 hover:scale-105">
                Get Started Free
              </Button>
            </SignInButton>
          </div>
        </SignedOut>

      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -50px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(50px, 50px) scale(1.05); }
        }
        .animate-blob {
          animation: blob 20s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}
