import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const HUES = ['#ff5ca8', '#38e8ff', '#a78bfa', '#fbbf24', '#34d399']
const welcome = {
  id: 'welcome', title: 'Start here', color: HUES[1], updated: Date.now(),
  body: '# Welcome to Inkwell\n\nPick a note, or press **New note** to open the notebook.\n\n- Drag notes in the list to reorder them\n- Markdown is supported: `code`, lists, quotes\n- Everything saves to this browser automatically\n\n> Write the first line. The rest follows.',
}

export const useNotes = create(
  persist(
    (set, get) => ({
      notes: [welcome],
      activeId: null,
      open: false,
      query: '',
      setQuery: (query) => set({ query }),
      newNote: () => {
        const n = { id: crypto.randomUUID(), title: '', body: '', color: HUES[get().notes.length % HUES.length], updated: Date.now() }
        set((s) => ({ notes: [n, ...s.notes], activeId: n.id, open: true }))
      },
      select: (id) => set({ activeId: id, open: true }),
      close: () => set({ open: false }),
      update: (id, patch) => set((s) => ({ notes: s.notes.map((n) => (n.id === id ? { ...n, ...patch, updated: Date.now() } : n)) })),
      remove: (id) => set((s) => ({ notes: s.notes.filter((n) => n.id !== id), activeId: null, open: false })),
      reorder: (notes) => set({ notes }),
    }),
    { name: 'inkwell-notes', partialize: (s) => ({ notes: s.notes }) }
  )
)
