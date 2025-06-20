import { Mail } from 'lucide-react'
import React from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'

const Newsletter = () => {
  return (
    <div>
         <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-white">Stay in the Loop</h2>
              <p className="text-blue-100 text-lg">
                Get the latest articles and insights delivered straight to your inbox. No spam, just quality content.
              </p>
            </div>
            <div className="max-w-md mx-auto">
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/20"
                  />
                </div>
                <Button className="bg-white text-blue-600 hover:bg-gray-100">Subscribe</Button>
              </div>
              <p className="text-blue-100 text-sm mt-3">Join 10,000+ subscribers. Unsubscribe at any time.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Newsletter