import React from 'react'

const SidebarSkeleton = () => {
    const arr = [1,2,3,4,5,6,7,8]
  return (
    <>
        {
            arr.map((i)=>(
                <div key={i}>
                    <div className="w-full flex flex-col mb-7 mt-3">
                        <div className={`flex items-center  gap-7`}>
                            <div className="skeleton h-11 w-11 shrink-0 rounded-full"></div>
                            <div className="flex flex-col gap-1">
                                <div className="skeleton h-2 min-w-20 w-28"></div>
                                <div className="skeleton h-2 min-w-28 w-44"></div>
                            </div>
                        </div>
                    </div>
                </div>
            ))
        }
    </>
  )
}

export default SidebarSkeleton