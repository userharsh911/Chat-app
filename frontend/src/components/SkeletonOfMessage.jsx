import React from 'react'

const SkeletonOfMessage = () => {
    const arr = [1,2,3,4,5,6,7]
  return (
    <>
        {
            arr.map((i)=>(
                <div key={i} className={`chat ${i%2 ? 'chat-end' : 'chat-start'}`}>
                    <div className="w-52 flex flex-col gap-2">
                        <div className={`flex ${i%2 ? 'flex-row-reverse' :''} items-center gap-4`}>
                            <div className="skeleton h-8 w-8 shrink-0 rounded-full"></div>
                            <div className="flex flex-col gap-1">
                                <div className="skeleton h-2 w-20"></div>
                                <div className="skeleton h-2 w-28"></div>
                            </div>
                        </div>
                        <div className="skeleton h-10 w-full"></div>
                    </div>
                </div>
            ))
        }
    </>
  )
}

export default SkeletonOfMessage