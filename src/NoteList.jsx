import { Reorder, motion } from 'framer-motion'
import { Plus, Search, GripVertical } from 'lucide-react'
import { useNotes } from './store'

export default function NoteList() {
  const { notes, activeId, query, setQuery, newNote, select, reorder } = useNotes()
  const q = query.trim().toLowerCase()
  const shown = q ? notes.filter((n) => (n.title + n.body).toLowerCase().includes(q)) : notes

  return (
    <motion.aside
      initial={{ x: -60, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 120, damping: 18 }}
      className="glass absolute left-4 top-4 bottom-4 z-10 flex w-[min(320px,calc(100vw-2rem))] flex-col rounded-3xl p-4 md:left-6 md:top-6 md:bottom-6"
    >
      <h1 className="font-display text-2xl font-bold tracking-tight">Inkwell</h1>
      <p className="mb-4 text-sm text-white/50">{notes.length} {notes.length === 1 ? 'note' : 'notes'}</p>

      <motion.button
        whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={newNote}
        className="mb-3 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-ember to-plum px-4 py-3 font-medium text-white shadow-[0_0_30px_rgba(255,92,168,.35)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-ion"
      >
        <Plus size={18} /> New note
      </motion.button>

      <label className="mb-3 flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 text-sm focus-within:ring-1 focus-within:ring-ion">
        <Search size={15} className="text-white/40" />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search notes"
          className="w-full bg-transparent outline-none placeholder:text-white/30" />
      </label>

      <Reorder.Group axis="y" values={notes} onReorder={reorder} className="-mr-2 flex-1 space-y-2 overflow-y-auto pr-2">
        {shown.map((n) => (
          <Reorder.Item
            key={n.id} value={n} dragListener={!q}
            whileHover={{ x: 4 }} whileDrag={{ scale: 1.04, rotate: 1.5, zIndex: 20 }}
            onClick={() => select(n.id)}
            className={`glow group flex cursor-pointer items-center gap-2 rounded-2xl border p-3 transition-colors ${
              activeId === n.id ? 'border-white/30 bg-white/10' : 'border-white/5 bg-white/[0.03]'
            }`}
          >
            <GripVertical size={14} className="shrink-0 text-white/20 group-hover:text-white/60" />
            <span className="h-8 w-1 shrink-0 rounded-full" style={{ background: n.color, boxShadow: `0 0 10px ${n.color}` }} />
            <div className="min-w-0">
              <div className="truncate font-medium">{n.title || 'Untitled'}</div>
              <div className="truncate text-xs text-white/45">{n.body.replace(/[#>*`-]/g, '').slice(0, 48) || 'Empty note'}</div>
            </div>
          </Reorder.Item>
        ))}
        {shown.length === 0 && <p className="py-6 text-center text-sm text-white/40">No notes match “{query}”.</p>}
      </Reorder.Group>
    </motion.aside>
  )
}
