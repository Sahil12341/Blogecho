import Navbar from '@/components/home/header/Navbar'
import React from 'react'

const layout = ({children}: {children: React.ReactNode}) => {
  return (
    <div>
        <div>
            <Navbar />
            {children}
        </div>
    </div>
  )
}

export default layout