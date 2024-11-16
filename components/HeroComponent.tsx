'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

const cityImages = [
  'https://images.pexels.com/photos/1308940/pexels-photo-1308940.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  'https://images.pexels.com/photos/27023262/pexels-photo-27023262/free-photo-of-jagannath-temple-in-puri-in-india.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', 
  'https://images.pexels.com/photos/1603650/pexels-photo-1603650.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
]

export default function ImageRotation() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % cityImages.length)
        setIsTransitioning(false)
      }, 500) // Half of the transition duration
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col md:flex-row items-center justify-center p-4 overflow-hidden md:mt-7 max-w-8xl">
      <div className="relative w-full md:w-1/2 h-[500px] mb-4 md:mb-0 mr-10">
        <div
          className={`absolute inset-0 transition-transform duration-1000 ease-in-out ${
            isTransitioning ? 'scale-110 opacity-0' : 'scale-100 opacity-100'
          }`}
        >
          <Image
            src={cityImages[currentImageIndex]}
            alt="City scene"
            layout="fill"
            objectFit="cover"
            className="rounded-lg"
          />
        </div>
        <div className="absolute -bottom-12 -right-12 w-100 h-60 transition-transform duration-300 hover:scale-105 overflow-hidden">
          <Image
            src="https://images.pexels.com/photos/1629212/pexels-photo-1629212.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            alt="Notebook"
            width={420}
            height={420}
            className="rounded-lg shadow-xl"
          />
        </div>
      </div>
      <div className="w-full md:w-1/2 md:ml-6">
        <h1 className="text-3xl font-bold mb-4">Tour Blogger</h1>
        <p className="text-gray-700">
        Discover the world through the eyes of fellow travelers! Dive into authentic reviews and insights on countries across the globe, curated to help you plan your perfect adventure. Whether you're dreaming of tropical beaches, historic cities, or hidden gems off the beaten path, simply select a country to explore detailed experiences, tips, and recommendations from those who've been there. Uncover the magic of each destination and find everything you need to make your travel dreams a reality.
        </p>
      </div>
    </div>
  )
}