import { Suspense } from 'react'
import { motion } from 'framer-motion'
import Scene from './Scene'
import NoteList from './NoteList'
import Editor from './Editor'
import { useNotes } from './store'

export default function App() {
  const open = useNotes((s) => s.open)
  return (
    <div className="relative h-full w-full overflow-hidden">
      <Suspense fallback={null}><Scene /></Suspense>
      <NoteList />
      <Editor />
      {!open && (
        <motion.p
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
          className="pointer-events-none absolute bottom-8 left-1/2 hidden -translate-x-1/2 text-sm text-white/50 md:block"
        >
          Select a note or press New note to open the notebook
        </motion.p>
      )}
    </div>
  )
}
