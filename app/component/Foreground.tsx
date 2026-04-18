"use client"
import React, { useRef } from 'react' // Added useRef import
import Card from './Card'

const Foreground = () => {
  const ref = useRef<HTMLDivElement>(null); // Added type for ref

  const data = [
    {
      description: 'Comprehensive project requirements document with detailed scope, milestones, and deliverables',
      filesize: '1.2 MB',
      CloseOrDownload: 'Download',
      tagdetails: 'Important',
      tag: {
        isOpen: true,
        title: 'Download Now',
        color: 'green'
      }
    },
    {
      description: 'Initial user interface wireframe notes covering layout ideas, navigation flow, and component structure',
      filesize: '860 KB',
      CloseOrDownload: 'Close',
      tagdetails: 'Draft',
      tag: {
        isOpen: false,
        title: 'Close',
        color: 'blue'
      }
    },
    {
      description: 'Step-by-step API integration checklist including authentication setup, endpoint mapping, and error handling',
      filesize: '540 KB',
      CloseOrDownload: 'Download',
      tagdetails: 'Review',
      tag: {
        isOpen: true,
        color: 'green'
      }
    },
    {
      description: 'Detailed meeting summary for Sprint 3 with action items, blockers discussed, and team decisions',
      filesize: '320 KB',
      CloseOrDownload: 'Close',
      tagdetails: 'Internal',
      tag: {
        isOpen: true,
        title: 'Meeting Notes',
        color: 'blue'
      }
    },
  ]

  return (
    <div ref={ref} className='fixed flex-shrink-0 top-0 left-0 z-3 w-full h-full flex gap-10 flex-wrap p-5'>
      {data.map((item, index) => (
        <div key={index}>
          <Card data={item} reference={ref} />
        </div>
      ))}
    </div>
  )
}

export default Foreground