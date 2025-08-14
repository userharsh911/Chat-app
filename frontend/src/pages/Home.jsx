import React from 'react'
import Sidebar from '../components/Sidebar'
import Chatbar from '../components/Chatbar'
import useBearStore from '../store/store'
import useMessages from '../store/message.store'
import RightSidebar from '../components/RightSidebar'
import useGroups from '../store/group.store'
const Home = () => {
  const {userAuth} = useBearStore(state =>state)
  const {selectedUser } = useMessages(state=>state)
  const {selectedGroup } = useGroups(state=>state)
  return (
    <div className='flex @container gap-5 w-full h-[80vh] bg-base-300'>
      {
        userAuth && <Sidebar/>
      }
      {
        ((selectedUser || selectedGroup) && <Chatbar/>) || <RightSidebar/>
      }
    </div>
  )
}

export default Home