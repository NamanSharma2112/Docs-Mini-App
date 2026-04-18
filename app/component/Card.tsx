"use client"
import { Download, FileText, CircleX } from 'lucide-react'
import React from 'react'
import { motion, MotionProps } from "motion/react"

interface CardData {
  description: string,
  filesize: string,
  CloseOrDownload: string,
  tagdetails: string,
  tag: {
    isOpen: boolean,
    title?: string,
    color?: 'green' | 'blue'
  }
}

interface CardProps {
  data: CardData
  reference: React.RefObject<HTMLElement> // Type for drag constraints reference
}

const Card = ({ data, reference }: CardProps) => {
  return (
    <motion.div 
      drag 
      dragConstraints={reference}
      dragElastic={0.2} // Optional: adds some elasticity when dragging
      whileTap={{ cursor: "grabbing" }} // Optional: changes cursor while dragging
      whileDrag={{ scale: 1.02 }} // Optional: slight scale effect while dragging
    >
      <div className='relative w-60 h-72 rounded-[40px] bg-zinc-900/90 py-8 px-5 overflow-hidden'>
        <FileText className='text-5xl text-zinc-300' /> 
        <p className='text-sm leading-tight mt-3 font-semibold text-white'>{data.description}</p>
        <div className='footer absolute bottom-0 w-full left-0'>
          <div>
            <h5 className='flex items-center justify-between mb-3 py-3 px-8 text-white'>
              {data.filesize} 
              <span className='size-5.5 w-7 h-7 bg-zinc-900/50 rounded-full flex items-center justify-center'>
                {data.CloseOrDownload === 'Close' ? <CircleX size={16} /> : <Download size={16} />}
              </span>
            </h5>
          </div>
          
          {/* Conditional tag rendering based on tag.isOpen */}
          {data.tag?.isOpen && (
            <div className={`tag w-full py-3 ${data.tag.color === 'blue' ? 'bg-sky-600' : 'bg-green-600'} flex items-center justify-center`}>
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