import { BlogFooter } from '@/components/home/blog-footer'
import Navbar from '@/components/home/header/Navbar'
import React, { Suspense } from 'react'

const layout = ({children}: {children: React.ReactNode}) => {
  return (
    <div>
        <Suspense fallback={<div />}>
        <Navbar />
        </Suspense>
        {children}
        <BlogFooter />
    </div>
  )
}

export default layout