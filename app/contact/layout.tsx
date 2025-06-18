import Navbar from '@/components/home/header/Navbar'
import React, { Suspense } from 'react'

const layout = ({children} : {children : React.ReactNode}) => {
  return (
    <div>
        <Suspense fallback={<div />}>
        <Navbar />
        </Suspense>
        {children}
    </div>
  )
}

export default layout