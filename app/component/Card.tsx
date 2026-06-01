"use client"
import { Download, FileText, CircleX, Trash2 } from 'lucide-react'
import React from 'react'
import { motion } from "framer-motion"
import { DocumentData, useDocuments } from './DocumentContext'

interface CardProps {
  data: DocumentData
  reference: React.RefObject<HTMLElement | null>
}

const Card = ({ data, reference }: CardProps) => {
  const { deleteDocument } = useDocuments();

  const getTagColorClass = (color?: string) => {
    switch (color) {
      case 'blue': return 'bg-sky-600';
      case 'purple': return 'bg-purple-600';
      case 'orange': return 'bg-orange-500';
      case 'red': return 'bg-red-500';
      case 'green':
      default: return 'bg-green-600';
    }
  }

  const handleDownload = () => {
    if (data.fileBlob) {
      // Create a blob URL and trigger download
      const url = URL.createObjectURL(data.fileBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = data.fileName || 'downloaded-file';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      // Mock download or alert if no real file is attached
      alert('This is a mock document with no real file attached.');
    }
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      drag 
      dragConstraints={reference}
      dragElastic={0.2}
      whileTap={{ cursor: "grabbing" }}
      whileDrag={{ scale: 1.05, zIndex: 50 }}
      whileHover={{ scale: 1.02 }}
    >
      <div className='relative w-60 h-72 rounded-[40px] bg-zinc-900/90 py-8 px-5 overflow-hidden border border-zinc-800 shadow-xl backdrop-blur-md group'>
        
        {/* Delete Button (appears on hover) */}
        <button 
          onClick={() => deleteDocument(data.id)}
          className='absolute top-6 right-5 text-zinc-500 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100'
          title="Delete Document"
        >
          <Trash2 size={20} />
        </button>

        <FileText className='text-5xl text-zinc-300' /> 
        <p className='text-sm leading-tight mt-3 font-semibold text-white/90'>{data.description}</p>
        
        <div className='footer absolute bottom-0 w-full left-0'>
          <div>
            <h5 className='flex items-center justify-between mb-3 py-3 px-8 text-white/90'>
              {data.filesize} 
              <span 
                onClick={data.CloseOrDownload === 'Download' ? handleDownload : undefined}
                className={`size-5.5 w-7 h-7 bg-zinc-800 rounded-full flex items-center justify-center border border-zinc-700/50 transition-colors ${data.CloseOrDownload === 'Download' ? 'cursor-pointer hover:bg-zinc-700 text-white' : 'text-zinc-500'}`}
                title={data.CloseOrDownload === 'Download' ? 'Download File' : 'Closed'}
              >
                {data.CloseOrDownload === 'Close' ? <CircleX size={16} /> : <Download size={16} />}
              </span>
            </h5>
          </div>
          
          {data.tag?.isOpen && (
            <div className={`tag w-full py-3 ${getTagColorClass(data.tag.color)} flex items-center justify-center`}>
              <h3 className='text-sm font-semibold text-white'>
                {data.tag.title || data.tagdetails || 'Download Now'}
              </h3>  
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default Card