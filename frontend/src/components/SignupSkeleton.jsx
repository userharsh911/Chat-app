import React from 'react'
const SignupSkeleton = () => {
    const skeletonsArr = [1,2,3,4,5,6,7,8,9]
  return (
    <div className=' grid grid-cols-3 gap-3  '>
        {
            skeletonsArr.map((item)=>(
                <div key={item} className="skeleton h-24 w-24 lg:h-32 lg:w-32 "></div>
            ))
        }
    </div>
  )
}

export default SignupSkeleton