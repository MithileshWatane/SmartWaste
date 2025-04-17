import React from 'react'

export default function hero() {
  return (
    <div>
      <section
  id="hero"
  className="relative bg-neutral-900 text-white min-h-[70vh] flex items-center"
>
  {/* Background pattern */}
  <div className="absolute inset-0 overflow-hidden z-0">
    <div className="absolute h-64 w-64 rounded-full bg-[#1E8449]/10 -top-20 -left-20 animate__animated animate__pulse animate__infinite animate__slow" />
    <div className="absolute h-96 w-96 rounded-full bg-[#3498DB]/10 -bottom-32 -right-32 animate__animated animate__pulse animate__infinite animate__slower" />
    <div className="grid grid-cols-12 gap-4 opacity-5 absolute inset-0">
      <div className="col-span-1 bg-[#F39C12]/20" />
      <div className="col-span-1 bg-[#1E8449]/20" />
      <div className="col-span-1 bg-[#3498DB]/20" />
      <div className="col-span-1 bg-[#F39C12]/20" />
      <div className="col-span-1 bg-[#1E8449]/20" />
      <div className="col-span-1 bg-[#3498DB]/20" />
      <div className="col-span-1 bg-[#F39C12]/20" />
      <div className="col-span-1 bg-[#1E8449]/20" />
      <div className="col-span-1 bg-[#3498DB]/20" />
      <div className="col-span-1 bg-[#F39C12]/20" />
      <div className="col-span-1 bg-[#1E8449]/20" />
      <div className="col-span-1 bg-[#3498DB]/20" />
    </div>
  </div>
  <div className="container mx-auto px-4 py-16 pt-32 md:pt-24 relative z-10">
    <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
      <div className="w-full md:w-1/2 animate__animated animate__fadeInLeft">
        <a href="/">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
          <span className="text-[#1E8449]">Smart</span> Garbage{" "}
          <span className="text-[#3498DB]">Detection</span> &amp; Mapping
        </h1>
        </a>
        <p className="text-xl md:text-2xl mb-6 text-gray-300">
          Revolutionizing urban cleanliness with AI-powered waste management
          solutions
        </p>
        <p className="text-gray-400 mb-8 max-w-xl">
          Our system leverages computer vision, and real-time data
          analytics to transform how cities manage waste collection, making
          environments cleaner and operations more efficient.
        </p>
        <div className="flex flex-wrap gap-4">
          <a
            href="#map-interface"
            className="px-6 py-3 bg-[#1E8449] hover:bg-[#1E8449]/90 text-white font-medium rounded-md transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 animate__animated animate__pulse animate__infinite animate__slower"
          >
            How It Works
          </a>
          <a
            href="#footer"
            className="px-6 py-3 bg-transparent border-2 border-[#3498DB] hover:bg-[#3498DB]/10 text-white font-medium rounded-md transition-all duration-300"
          >
            Contact Us
          </a>
        </div>
      </div>
      <div className="w-full md:w-1/2 mt-8 md:mt-0 animate__animated animate__fadeInRight">
        <div className="relative bg-neutral-800 p-4 rounded-2xl shadow-2xl border border-neutral-700 overflow-hidden">
          <div className="absolute top-2 left-2 flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          {/* Map visualization mockup */}
          <div className="mt-4 rounded-lg overflow-hidden bg-neutral-900 h-72 flex items-center justify-center relative">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDIwIDAgTCAwIDAgMCAyMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMWYyOTM3IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')]" />
            {/* Hotspots */}
            <div className="absolute left-1/4 top-1/3 h-3 w-3 rounded-full bg-red-500 animate-ping" />
            <div className="absolute left-1/4 top-1/3 h-4 w-4 rounded-full bg-red-500/50" />
            <div className="absolute right-1/3 top-1/2 h-3 w-3 rounded-full bg-yellow-500 animate-ping" />
            <div className="absolute right-1/3 top-1/2 h-4 w-4 rounded-full bg-yellow-500/50" />
            <div className="absolute left-1/2 bottom-1/4 h-3 w-3 rounded-full bg-orange-500 animate-ping" />
            <div className="absolute left-1/2 bottom-1/4 h-4 w-4 rounded-full bg-orange-500/50" />
            {/* Vehicle path */}
            <div className="absolute inset-0 overflow-hidden">
              <svg viewBox="0 0 400 300" className="w-full h-full">
                <path
                  d="M50,150 C100,50 150,250 200,100 S300,150 350,120"
                  fill="none"
                  stroke="#3498DB"
                  strokeWidth={3}
                  strokeDasharray="10,5"
                  className="animate-dash"
                ></path>
                <circle
                  cx={350}
                  cy={120}
                  r={8}
                  fill="#1E8449"
                  className="animate-pulse"
                >
                  <animate
                    attributeName="cx"
                    from={50}
                    to={350}
                    dur="10s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="cy"
                    values="150;50;250;100;150;120"
                    dur="10s"
                    repeatCount="indefinite"
                  />
                </circle>
              </svg>
            </div>
            {/* Legend */}
            <div className="absolute bottom-2 right-2 bg-neutral-800/70 p-2 rounded-md text-xs">
              <div className="flex items-center mb-1">
                <span className="h-3 w-3 bg-red-500 rounded-full mr-2" />
                <span>Critical</span>
              </div>
              <div className="flex items-center mb-1">
                <span className="h-3 w-3 bg-yellow-500 rounded-full mr-2" />
                <span>Moderate</span>
              </div>
              <div className="flex items-center">
                <span className="h-3 w-3 bg-green-500 rounded-full mr-2" />
                <span>Clean</span>
              </div>
            </div>
          </div>
          {/* Dashboard stats */}
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            <div className="bg-neutral-800 p-2 rounded-lg">
              <div className="text-[#F39C12] text-xl font-bold">14</div>
              <div className="text-xs text-gray-400">Hotspots</div>
            </div>
            <div className="bg-neutral-800 p-2 rounded-lg">
              <div className="text-[#1E8449] text-xl font-bold">86%</div>
              <div className="text-xs text-gray-400">Coverage</div>
            </div>
            <div className="bg-neutral-800 p-2 rounded-lg">
              <div className="text-[#3498DB] text-xl font-bold">41</div>
              <div className="text-xs text-gray-400">Active Vehicles</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    {/* Stats */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 text-center">
      <div className="bg-neutral-800/50 p-4 rounded-lg transform transition-transform hover:scale-105">
        <div className="text-3xl font-bold text-[#F39C12]">88%</div>
        <div className="text-gray-400 mt-2">Accuracy Rate</div>
      </div>
      <div className="bg-neutral-800/50 p-4 rounded-lg transform transition-transform hover:scale-105">
        <div className="text-3xl font-bold text-[#1E8449]">40%</div>
        <div className="text-gray-400 mt-2">Monitored waste</div>
      </div>
      <div className="bg-neutral-800/50 p-4 rounded-lg transform transition-transform hover:scale-105">
        <div className="text-3xl font-bold text-[#3498DB]">24/7</div>
        <div className="text-gray-400 mt-2">Real-time Monitoring</div>
      </div>
      <div className="bg-neutral-800/50 p-4 rounded-lg transform transition-transform hover:scale-105">
        <div className="text-3xl font-bold text-[#F39C12]">8+</div>
        <div className="text-gray-400 mt-2">Cities Implemented</div>
      </div>
    </div>
  </div>
</section>

    </div>
  )
}
