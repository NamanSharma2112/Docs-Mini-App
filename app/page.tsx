import React from 'react'

import BackGround from './component/BackGround'
import Foreground from './component/Foreground'
import { ThemeToggle } from './component/themeToggle'
import { DocumentProvider } from './component/DocumentContext'

const page = () => {
  return (
    <div className='relative w-full h-screen bg-zinc-950 overflow-hidden'>
      <DocumentProvider>
        <BackGround/>
        <Foreground/>
      </DocumentProvider>
    </div>
  )
}

export default page
