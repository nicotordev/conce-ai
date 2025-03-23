"use client";
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const AppNewConversationSkeleton = () => {
  return (
    <div className="text-center flex flex-col gap-4">
      <Skeleton height={30} width={300} className="mx-auto" /> {/* Título */}

      <div className="p-2 min-w-2xl rounded-lg shadow-md w-full max-w-4xl border border-gray-200">
        <div className="relative w-full max-w-full pb-3">
          <Skeleton
            count={3}
            height={20}
            className="w-full"
            containerClassName="p-3"
          /> 
        </div>

        <div className="flex items-center justify-end px-3">
          <Skeleton circle height={36} width={36} /> 
        </div>
      </div>
    </div>
  )
}

export default AppNewConversationSkeleton;
