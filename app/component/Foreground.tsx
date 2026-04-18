import React from 'react'
import Card from './Card'

const Foreground = () => {
  const data = [
    {
      description: 'Comprehensive project requirements document with detailed scope, milestones, and deliverables',
      filesize: '1.2 MB',
      CloseOrDownload: 'Download',
      tagdetails: 'Important',
    },
    {
      description: 'Initial user interface wireframe notes covering layout ideas, navigation flow, and component structure',
      filesize: '860 KB',
      CloseOrDownload: 'Close',
      tagdetails: 'Draft',
    },
    {
      description: 'Step-by-step API integration checklist including authentication setup, endpoint mapping, and error handling',
      filesize: '540 KB',
      CloseOrDownload: 'Download',
      tagdetails: 'Review',
    },
    {
      description: 'Detailed meeting summary for Sprint 3 with action items, blockers discussed, and team decisions',
      filesize: '320 KB',
      CloseOrDownload: 'Close',
      tagdetails: 'Internal',
    },
    {
      description: 'Complete testing report with test case results, bug findings, coverage insights, and quality notes',
      filesize: '2.1 MB',
      CloseOrDownload: 'Download',
      tagdetails: 'Final',
    },
    {
      description: 'Practical deployment guide describing build steps, environment configuration, and production release process',
      filesize: '780 KB',
      CloseOrDownload: 'Download',
      tagdetails: 'Release',
    },
  ]

  return (
    <div className='fixed top-0 left-0 z-3 w-full h-full '>
      {data.map((item, index) => ((
        <div key={index} className=''>
          <Card data={item} />
        </div>
      )))}
  
  
    </div>
  )
}

export default Foreground
