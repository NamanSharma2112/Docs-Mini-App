import { Download, FileText } from 'lucide-react'
import React from 'react'

interface CardData {
  description: string,
  filesize: string,
  CloseOrDownload: string,
  tagdetails: string,
}

interface CardProps {
  data: CardData
}

const Card = ({ data }: CardProps) => {
  return (
    <div>
      <div className='relative w-60 h-72 rounded-[40px] bg-zinc-900/90 py-8 px-5 overflow-hidden'>
        <FileText className='text-5xl text-zinc-300' /> 
        <p className='text-sm leading-tight mt-3 font-semibold '>{data.description}</p>
        <div className='footer absolute bottom-0 w-full left-0  '>
          <div>
            <h5 className='flex items-center justify-between mb-3 py-3 px-8'>{data.filesize} <span className='size-5.5 w-7 bg-zinc-900/50 rounded-full flex items-center'>  <Download className='' />
            </span>
            </h5>
          </div>
        <div className='tag w-full py-4 bg-green-600 flex items-center justify-center '>
          <h3 className='text-sm font-semibold'> Download Now</h3>  
                       
        </div>
        </div>
      </div>
    </div>
  )
}
export default Card
