import React from 'react'

import BackGround from './component/BackGround'
import Foreground from './component/Foreground'
import {ThemeToggle } from './component/themeToggle'

const page = () => {
  return (
    <div className='relative w-full h-screen bg-zinc-800'>

  <BackGround/>
   <Foreground/>
</div>
  )
}

export default page
