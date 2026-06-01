"use client"
import React, { useRef, useState } from 'react'
import { Plus } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import Card from './Card'
import CreateDocModal from './CreateDocModal'
import { useDocuments } from './DocumentContext'

const Foreground = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { documents } = useDocuments();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div ref={ref} className='fixed flex-shrink-0 top-0 left-0 z-[3] w-full h-full flex gap-10 flex-wrap p-5 pt-24 overflow-y-auto'>
        <AnimatePresence mode="popLayout">
          {documents.map((item) => (
            <Card key={item.id} data={item} reference={ref} />
          ))}
        </AnimatePresence>

        {documents.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className="text-zinc-500 font-medium">No documents yet. Click + to create one.</p>
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-10 right-10 z-[10] flex h-16 w-16 items-center justify-center rounded-full bg-purple-600 text-white shadow-xl shadow-purple-500/30 transition-colors hover:bg-purple-500"
      >
        <Plus size={32} />
      </motion.button>

      <CreateDocModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}

export default Foreground