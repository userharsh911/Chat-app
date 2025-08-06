import { Send } from 'lucide-react'
import React from 'react'
import { ImCross } from "react-icons/im";
const DummyChat = () => {
  return (
    <div className="max-w-sm mx-auto rounded-lg shadow-lg overflow-hidden bg-base-100">
      {/* Header */}
      <div className=" px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face&auto=format" 
              alt="John Doe" 
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
          </div>
          <div>
            <h3 className=" font-medium text-sm">John Doe</h3>
            <p className=" text-xs">online</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <ImCross />
        </div>
      </div>

      {/* Messages */}
      <div className=" px-4 py-6 space-y-4 bg-base-200" style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%23f0f0f0" fill-opacity="0.1"%3E%3Cpath d="M20 20c0 4.4-3.6 8-8 8s-8-3.6-8-8 3.6-8 8-8 8 3.6 8 8zm0-20c0 4.4-3.6 8-8 8s-8-3.6-8-8 3.6-8 8-8 8 3.6 8 8z"/%3E%3C/g%3E%3C/svg%3E")'}}>
        {/* Incoming message */}
        <div className="flex justify-start">
          <div className=" px-3 py-2 rounded-lg max-w-xs shadow-sm">
            <p className=" text-sm">Hey! How's your day going?</p>
            <span className="text-xs  mt-1 block">12:30 PM</span>
          </div>
        </div>

        {/* Outgoing message */}
        <div className="flex justify-end">
          <div className="px-3 py-2 rounded-lg max-w-xs shadow-sm">
            <p className=" text-sm">Pretty good, thanks for asking!</p>
            <span className="text-xs  mt-1 block text-right">12:32 PM ✓✓</span>
          </div>
        </div>

        
      </div>

      {/* Input */}
      <div className="px-4 py-3 flex items-center bg-base-200 border-t border-base-300 space-x-3">
        <input
          type="text"
          value={"Exploring the possiblities |"}
          disabled
          placeholder="Type a message..."
          className="flex-1 rounded-full px-4 py-2 text-sm outline-none border border-base-300"
        />
        <button
          disabled
          className={`p-2 rounded-full transition-colors duration-200`}
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

export default DummyChat