import React from 'react'
import Hero from './hero'
import Map from './map'
export default function landingpage() {
  return (
    <div>
      <Hero />
       <Map />
       <section id="benefits" className="py-16 bg-white dark:bg-neutral-800">
  <div className="container mx-auto px-4">
    <div className="text-center mb-16">
      <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800 dark:text-white">
        Why Use Our System?
      </h2>
      <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
        Our Garbage Detection and Mapping System offers numerous benefits for
        communities, local governments, and the environment.
      </p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {/* Benefit 1 */}
      <div className="bg-gray-50 dark:bg-neutral-700 rounded-xl p-8 shadow-lg transform transition duration-500 hover:-translate-y-1 hover:shadow-xl">
        <div className="flex items-center justify-center h-16 w-16 bg-green-100 dark:bg-green-900/30 rounded-full mb-6 mx-auto">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-green-600 dark:text-green-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3 className="text-xl font-bold mb-3 text-center text-gray-800 dark:text-white">
          Easy to Use
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-center mb-4">
          Our interface is intuitive and requires no technical expertise. Simply
          open your camera, take a photo, and the system does the rest.
        </p>
        <ul className="space-y-2">
          <li className="flex items-start">
            <svg
              className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-gray-600 dark:text-gray-300">
              No account registration required
            </span>
          </li>
          <li className="flex items-start">
            <svg
              className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-gray-600 dark:text-gray-300">
              Works on any device with a camera
            </span>
          </li>
          <li className="flex items-start">
            <svg
              className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-gray-600 dark:text-gray-300">
              Simple, intuitive interface
            </span>
          </li>
        </ul>
      </div>
      {/* Benefit 2 */}
      <div className="bg-gray-50 dark:bg-neutral-700 rounded-xl p-8 shadow-lg transform transition duration-500 hover:-translate-y-1 hover:shadow-xl">
        <div className="flex items-center justify-center h-16 w-16 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-6 mx-auto">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-blue-600 dark:text-blue-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
            />
          </svg>
        </div>
        <h3 className="text-xl font-bold mb-3 text-center text-gray-800 dark:text-white">
          Community Empowerment
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-center mb-4">
          Empower citizens to take an active role in keeping their communities
          clean by easily reporting garbage locations.
        </p>
        <ul className="space-y-2">
          <li className="flex items-start">
            <svg
              className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-gray-600 dark:text-gray-300">
              Citizen participation in cleanup efforts
            </span>
          </li>
          <li className="flex items-start">
            <svg
              className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-gray-600 dark:text-gray-300">
              Creates awareness of waste issues
            </span>
          </li>
          <li className="flex items-start">
            <svg
              className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-gray-600 dark:text-gray-300">
              Promotes collective responsibility
            </span>
          </li>
        </ul>
      </div>
      {/* Benefit 3 */}
      <div className="bg-gray-50 dark:bg-neutral-700 rounded-xl p-8 shadow-lg transform transition duration-500 hover:-translate-y-1 hover:shadow-xl">
        <div className="flex items-center justify-center h-16 w-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-full mb-6 mx-auto">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-indigo-600 dark:text-indigo-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            />
          </svg>
        </div>
        <h3 className="text-xl font-bold mb-3 text-center text-gray-800 dark:text-white">
          Efficient Resource Allocation
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-center mb-4">
          Help local governments and waste management services optimize their
          resources by targeting areas that need cleaning.
        </p>
        <ul className="space-y-2">
          <li className="flex items-start">
            <svg
              className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-gray-600 dark:text-gray-300">
              Prioritize cleanup of high-need areas
            </span>
          </li>
          <li className="flex items-start">
            <svg
              className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-gray-600 dark:text-gray-300">
              Reduce wasted service trips
            </span>
          </li>
          <li className="flex items-start">
            <svg
              className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-gray-600 dark:text-gray-300">
              Cost-effective waste management
            </span>
          </li>
        </ul>
      </div>
      {/* Benefit 4 */}
      <div className="bg-gray-50 dark:bg-neutral-700 rounded-xl p-8 shadow-lg transform transition duration-500 hover:-translate-y-1 hover:shadow-xl">
        <div className="flex items-center justify-center h-16 w-16 bg-red-100 dark:bg-red-900/30 rounded-full mb-6 mx-auto">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-red-600 dark:text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-bold mb-3 text-center text-gray-800 dark:text-white">
          Environmental Impact
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-center mb-4">
          Contribute to a cleaner environment by helping identify and remove
          garbage before it causes ecological harm.
        </p>
        <ul className="space-y-2">
          <li className="flex items-start">
            <svg
              className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-gray-600 dark:text-gray-300">
              Prevent pollution of waterways
            </span>
          </li>
          <li className="flex items-start">
            <svg
              className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-gray-600 dark:text-gray-300">
              Protect wildlife from harmful waste
            </span>
          </li>
          <li className="flex items-start">
            <svg
              className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-gray-600 dark:text-gray-300">
              Reduce long-term environmental damage
            </span>
          </li>
        </ul>
      </div>
      {/* Benefit 5 */}
      <div className="bg-gray-50 dark:bg-neutral-700 rounded-xl p-8 shadow-lg transform transition duration-500 hover:-translate-y-1 hover:shadow-xl">
        <div className="flex items-center justify-center h-16 w-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-full mb-6 mx-auto">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-yellow-600 dark:text-yellow-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-bold mb-3 text-center text-gray-800 dark:text-white">
          Public Health Benefits
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-center mb-4">
          Improve public health by identifying garbage sites that could become
          breeding grounds for disease or attract pests.
        </p>
        <ul className="space-y-2">
          <li className="flex items-start">
            <svg
              className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-gray-600 dark:text-gray-300">
              Reduce disease transmission vectors
            </span>
          </li>
          <li className="flex items-start">
            <svg
              className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-gray-600 dark:text-gray-300">
              Prevent pest infestations
            </span>
          </li>
          <li className="flex items-start">
            <svg
              className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-gray-600 dark:text-gray-300">
              Improve community living conditions
            </span>
          </li>
        </ul>
      </div>
      {/* Benefit 6 */}
      <div className="bg-gray-50 dark:bg-neutral-700 rounded-xl p-8 shadow-lg transform transition duration-500 hover:-translate-y-1 hover:shadow-xl">
        <div className="flex items-center justify-center h-16 w-16 bg-purple-100 dark:bg-purple-900/30 rounded-full mb-6 mx-auto">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-purple-600 dark:text-purple-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-bold mb-3 text-center text-gray-800 dark:text-white">
          Data-Driven Decisions
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-center mb-4">
          Enable better decision-making through visualization of garbage
          hotspots and waste distribution patterns.
        </p>
        <ul className="space-y-2">
          <li className="flex items-start">
            <svg
              className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-gray-600 dark:text-gray-300">
              Identify recurring problem areas
            </span>
          </li>
          <li className="flex items-start">
            <svg
              className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-gray-600 dark:text-gray-300">
              Track cleanup progress over time
            </span>
          </li>
          <li className="flex items-start">
            <svg
              className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-gray-600 dark:text-gray-300">
              Plan prevention strategies
            </span>
          </li>
        </ul>
      </div>
    </div>
    {/* Call to Action */}
    <div className="mt-16 text-center">
      <a
        href="#map-interface"
        className="inline-block bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition duration-300 transform hover:scale-105"
      >
        Try it Now
      </a>
      <p className="mt-4 text-gray-600 dark:text-gray-400">
        No installation required. Works directly in your browser.
      </p>
    </div>
  </div>
</section>

    </div>
  )
}
