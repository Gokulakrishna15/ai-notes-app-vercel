"use client"
import { useState, useEffect } from "react"
import { Button } from "@/app/sign-in/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/sign-in/ui/card"
import { Textarea } from "@/app/sign-in/ui/textarea"
import { Input } from "@/app/sign-in/ui/input"
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs"
import { Sparkles, Save, Loader2, Wand2, Tags, Search, Pencil, Trash2, Moon, Sun, Plus } from "lucide-react"

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
  
  // Notes management
  const [notes, setNotes] = useState<Note[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showNewNote, setShowNewNote] = useState(false)
  
  // Theme
  const [darkMode, setDarkMode] = useState(false)

  // Fetch all notes on load
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

  // AI Summary
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

  // AI Improve
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

  // AI Tags
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

  // Save or Update Note
  const handleSave = async () => {
    if (!title || !content) return
    
    const allTags = [...new Set([...aiTags, summary].filter(Boolean))]
    
    try {
      if (editingId) {
        // Update existing note
        await fetch('/api/notes', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingId, title, content, tags: allTags })
        })
        alert("✅ Note Updated!")
      } else {
        // Create new note
        await fetch('/api/notes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, content, tags: allTags })
        })
        alert("✅ Note Saved!")
      }
      
      // Reset form
      setTitle("")
      setContent("")
      setSummary("")
      setAiTags([])
      setEditingId(null)
      setShowNewNote(false)
      
      // Refresh notes list
      fetchNotes()
    } catch (error) {
      alert("Failed to save note")
    }
  }

  // Edit Note
  const handleEdit = (note: Note) => {
    setTitle(note.title)
    setContent(note.content)
    setAiTags(note.tags)
    setEditingId(note._id)
    setShowNewNote(true)
  }

  // Delete Note
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this note?")) return
    
    try {
      await fetch(`/api/notes?id=${id}`, { method: 'DELETE' })
      fetchNotes()
    } catch (error) {
      alert("Failed to delete note")
    }
  }

  // Search filter
  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} p-8`}>
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">AI Notes App</h1>
          <div className="flex gap-3 items-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDarkMode(!darkMode)}
              className="gap-2"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            <SignedOut><SignInButton /></SignedOut>
            <SignedIn><UserButton /></SignedIn>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search notes by title, content, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* New Note Button */}
        <SignedIn>
          {!showNewNote && (
            <Button onClick={() => setShowNewNote(true)} className="gap-2">
              <Plus className="w-4 h-4" /> New Note
            </Button>
          )}
        </SignedIn>

        {/* Note Editor (shown when creating/editing) */}
        {showNewNote && (
          <Card className={`shadow-lg ${darkMode ? 'bg-gray-800' : ''}`}>
            <CardHeader>
              <CardTitle>{editingId ? 'Edit Note' : 'New Note'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input 
                placeholder="Title" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)}
                className="text-lg font-semibold"
              />
              <Textarea 
                placeholder="Write your thoughts..." 
                className="h-48 resize-none"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              
              {/* AI Buttons */}
              <div className="flex gap-2 flex-wrap">
                <Button 
                  onClick={handleSummary} 
                  disabled={loading || !content} 
                  variant="secondary" 
                  size="sm"
                >
                  {loading && loadingType === 'summary' ? 
                    <Loader2 className="w-4 h-4 animate-spin" /> : 
                    <Sparkles className="w-4 h-4" />
                  }
                  <span className="ml-2">Summary</span>
                </Button>
                
                <Button 
                  onClick={handleImprove} 
                  disabled={loading || !content} 
                  variant="secondary"
                  size="sm"
                >
                  {loading && loadingType === 'improve' ? 
                    <Loader2 className="w-4 h-4 animate-spin" /> : 
                    <Wand2 className="w-4 h-4" />
                  }
                  <span className="ml-2">Improve</span>
                </Button>
                
                <Button 
                  onClick={handleTags} 
                  disabled={loading || !content} 
                  variant="secondary"
                  size="sm"
                >
                  {loading && loadingType === 'tags' ? 
                    <Loader2 className="w-4 h-4 animate-spin" /> : 
                    <Tags className="w-4 h-4" />
                  }
                  <span className="ml-2">Tags</span>
                </Button>
                
                <Button 
                  onClick={handleSave} 
                  disabled={!title || !content} 
                  className="ml-auto"
                  size="sm"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {editingId ? 'Update' : 'Save'}
                </Button>
                
                <Button 
                  onClick={() => {
                    setShowNewNote(false)
                    setTitle("")
                    setContent("")
                    setSummary("")
                    setAiTags([])
                    setEditingId(null)
                  }} 
                  variant="outline"
                  size="sm"
                >
                  Cancel
                </Button>
              </div>

              {/* AI Results */}
              {summary && (
                <div className="bg-purple-50 border border-purple-200 p-3 rounded-lg">
                  <p className="text-sm font-semibold text-purple-900 mb-1">Summary</p>
                  <p className="text-purple-800 italic">{summary}</p>
                </div>
              )}
              
              {aiTags.length > 0 && (
                <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
                  <p className="text-sm font-semibold text-green-900 mb-2">Tags</p>
                  <div className="flex gap-2 flex-wrap">
                    {aiTags.map((tag, i) => (
                      <span key={i} className="bg-green-200 text-green-900 px-2 py-1 rounded-full text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Notes List */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredNotes.map((note) => (
            <Card key={note._id} className={`${darkMode ? 'bg-gray-800' : ''} hover:shadow-lg transition`}>
              <CardHeader>
                <CardTitle className="text-lg">{note.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm line-clamp-3">{note.content}</p>
                
                {note.tags.length > 0 && (
                  <div className="flex gap-1 flex-wrap">
                    {note.tags.map((tag, i) => (
                      <span key={i} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                
                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={() => handleEdit(note)}
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    <Pencil className="w-3 h-3 mr-1" /> Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(note._id)}
                    variant="outline"
                    size="sm"
                    className="flex-1 text-red-600"
                  >
                    <Trash2 className="w-3 h-3 mr-1" /> Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredNotes.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p>No notes found. Create your first note!</p>
          </div>
        )}

      </div>
    </div>
  )
}