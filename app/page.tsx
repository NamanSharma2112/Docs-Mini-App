import React from 'react'
import{ThemeToggle} from './component/themeToggle'


const page = () => {
  return (
    <div className=''>
      <div className='flex justify-end mt-4 mr-5' >
     <ThemeToggle/>
     </div>
  The background and text will change automatically!
</div>
  )
}

export default page
