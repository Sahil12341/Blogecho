import { BlogFooter } from '@/components/home/blog-footer'
import Navbar from '@/components/home/header/Navbar'
import React from 'react'

const layout = ({children}: {children: React.ReactNode}) => {
  return (
    <div>
        <Navbar />
        {children}
        <BlogFooter />
    </div>
  )
}

export default layout