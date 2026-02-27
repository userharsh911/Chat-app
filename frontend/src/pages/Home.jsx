import React from 'react'
import Sidebar from '../components/Sidebar'
import Chatbar from '../components/Chatbar'
import useBearStore from '../store/store'
import useMessages from '../store/message.store'
import RightSidebar from '../components/RightSidebar'
import useGroups from '../store/group.store'
import CreateGroupForm from '../components/CreateGroupForm'
import { SquareX } from 'lucide-react'
const Home = () => {
  const {userAuth} = useBearStore(state =>state)
  const {selectedUser } = useMessages(state=>state)
  const {selectedGroup } = useGroups(state=>state)
  return (
    <div className='flex @container gap-5 w-full h-[80vh] bg-base-300 overflow-hidden rounded-lg shadow-lg'>
      {
        userAuth && <Sidebar/>
      }
      {
        ((selectedUser || selectedGroup) && <Chatbar/>) || <RightSidebar/>
      }
      <input type="checkbox" id="create_group_modal" className="modal-toggle" />
      <div className="modal modal-middle">
        <div className="modal-box p-0 overflow-hidden rounded-2xl">
      <CreateGroupForm />
      <div className="modal-action absolute top-2 right-2 m-0">
            <label
              htmlFor="create_group_modal"
              className="btn btn-sm btn-circle btn-ghost"
            >
              <SquareX />
            </label>
          </div>
        </div>
        <label className="modal-backdrop" htmlFor="create_group_modal">
          Close
        </label>
      </div>

      <input type="checkbox" id="editModal" className="modal-toggle" />
      <div className="modal modal-bottom sm:modal-middle" role="dialog">
        <div className="modal-box bg-base-100 border border-base-content/10 shadow-2xl">
          <h3 className="font-bold text-lg mb-4">Edit Group Settings</h3>
          <CreateGroupForm
            groupName={selectedGroup?.groupName}
            onlyAdminCanMessage={selectedGroup?.onlyAdminCanMessage}
            grpId={selectedGroup?._id}
          />
          <div className="modal-action">
            <label htmlFor="editModal" className="btn btn-sm btn-ghost">Cancel</label>
          </div>
        </div>
        <label className="modal-backdrop" htmlFor="editModal">Close</label>
      </div>

    </div>
  )
}

export default Home