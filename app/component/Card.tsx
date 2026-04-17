import { Download, FileText } from 'lucide-react'
import React from 'react'




const Card = () => {

  return (
    <div>
           <div className='relative w-60 h-72 rounded-[40px] bg-zinc-900/90 py-8 px-5 overflow-hidden' >
           <FileText className='text-5xl text-zinc-300' /> 
           <p className='text-sm leading-tight mt-3 font-semibold '>Lorem ipsum, dolor sit amet consectetur adipisicing elit. e.</p>
           <div className='footer absolute  bottom-0 w-full left-0 bg-sky-300 h-10 py-3 px-8 '>1
           <div>
            <h5 className='text-amber-400'>.5mb</h5>
            <Download className='text-2xl text-zinc-300' />
           </div>
           </div>
              </div>
    </div>
  )
}

export default Card
