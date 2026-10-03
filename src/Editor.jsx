import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import { X, Trash2, Eye, Pencil } from 'lucide-react'
import { useNotes } from './store'

export default function Editor() {
  const { notes, activeId, open, update, remove, close } = useNotes()
  const [preview, setPreview] = useState(false)
  const note = notes.find((n) => n.id === activeId)
  const words = note ? note.body.trim().split(/\s+/).filter(Boolean).length : 0

  return (
    <AnimatePresence>
      {open && note && (
        <motion.section
          key="editor"
          initial={{ x: 120, opacity: 0, rotateY: -12 }} animate={{ x: 0, opacity: 1, rotateY: 0 }} exit={{ x: 120, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 110, damping: 20, delay: 0.25 }}
          style={{ transformPerspective: 1200 }}
          className="glass absolute right-4 top-4 bottom-4 z-10 flex w-[min(620px,calc(100vw-2rem))] flex-col rounded-3xl p-5 md:right-6 md:top-6 md:bottom-6 md:p-7"
        >
          <div className="mb-4 flex items-center gap-2">
            <input
              value={note.title} onChange={(e) => update(note.id, { title: e.target.value })} placeholder="Untitled" autoFocus
              className="min-w-0 flex-1 bg-transparent font-display text-3xl font-bold tracking-tight outline-none placeholder:text-white/25"
            />
            <IconBtn label={preview ? 'Edit' : 'Preview'} onClick={() => setPreview(!preview)}>{preview ? <Pencil size={18} /> : <Eye size={18} />}</IconBtn>
            <IconBtn label="Delete note" onClick={() => remove(note.id)} danger><Trash2 size={18} /></IconBtn>
            <IconBtn label="Close notebook" onClick={close}><X size={18} /></IconBtn>
          </div>

          {preview ? (
            <div className="md flex-1 overflow-y-auto font-prose text-lg text-white/90"><ReactMarkdown>{note.body || '*Nothing to preview yet.*'}</ReactMarkdown></div>
          ) : (
            <textarea
              value={note.body} onChange={(e) => update(note.id, { body: e.target.value })}
              placeholder="Write in markdown…" spellCheck
              className="flex-1 resize-none bg-transparent font-prose text-lg leading-relaxed text-white/90 outline-none placeholder:text-white/25"
            />
          )}
          <div className="mt-3 flex justify-between text-xs text-white/40">
            <span>{words} {words === 1 ? 'word' : 'words'}</span>
            <span>Saved {new Date(note.updated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  )
}

function IconBtn({ children, label, onClick, danger }) {
  return (
    <motion.button
      whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.92 }} onClick={onClick} aria-label={label} title={label}
      className={`rounded-xl bg-white/5 p-2.5 text-white/70 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-ion ${danger ? 'hover:bg-red-500/25 hover:text-red-300' : 'hover:bg-white/15 hover:text-white'}`}
    >{children}</motion.button>
  )
}
