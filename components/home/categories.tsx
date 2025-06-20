import React from 'react'
import { Card, CardContent } from '../ui/card'
import { Badge } from '../ui/badge'

const Categories = () => {
     const categories = [
    { name: "Technology", count: 24, color: "bg-blue-100 text-blue-800" },
    { name: "Design", count: 18, color: "bg-purple-100 text-purple-800" },
    { name: "Programming", count: 32, color: "bg-green-100 text-green-800" },
    { name: "React", count: 15, color: "bg-cyan-100 text-cyan-800" },
    { name: "CSS", count: 12, color: "bg-orange-100 text-orange-800" },
    { name: "JavaScript", count: 28, color: "bg-yellow-100 text-yellow-800" },
  ]
  return (
    <div>
         <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Explore Categories</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Browse articles by topic and discover content that interests you most.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Card key={category.name} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Badge className={`mb-2 ${category.color}`}>{category.name}</Badge>
                  <p className="text-sm text-gray-500">{category.count} articles</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Categories