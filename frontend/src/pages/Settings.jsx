import React from 'react'
import daisyThemes from '../constant'
import useTheme from '../store/userTheme'
import DummyChat from '../DummyChat/DummyChat'
const Settings = () => {
  const {changeTheme, theme} = useTheme(state=>state)
  return (
    <div>
      <h1 className='text-center text-4xl font-semibold mb-5'
      >Choose Theme</h1>
      <p className='text-center text-sm text-base-content/70 mb-5'>
        Select a theme for your chat interface.
      </p>
      <div className='w-full h-fit grid sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7  gap-1'>
        {daisyThemes.map(t=>(
          <div onClick={()=>changeTheme(t)} key={t} className={`${theme==t?'bg-base-content':'bg-base-100'}  border border-black cursor-pointer px-4 py-2 rounded-3xl`}>
            <div className=' flex gap-2 h-8 w-full px-4 py-2 rounded-2xl bg-white' data-theme={t}>
              <div className='h-full w-1/3 rounded-[2px] bg-base-content border border-base-content '></div>
              <div className='h-full w-1/3 rounded-[2px] bg-base-200 border-2 border-base-200'></div>
              <div className='h-full w-1/3 rounded-[2px] bg-base-300 border-2 border-base-300'></div>
              <div className='h-full w-1/3 rounded-[2px] bg-base-100 border-2 border-base-100'></div>
            </div>
            <div>
              <p className={`text-center ${theme==t ? 'text-base-100' : 'text-base-content'} `}>{t}</p>
            </div>
          </div>
        ))}
      </div>
      <div className='mt-5  w-5/6 mx-auto bg-base-300 py-5'>
        <h1 className='text-center text-3xl font-semibold mb-5'>Preview</h1>
        <DummyChat/>
      </div>
    </div>
  )
}

export default Settings