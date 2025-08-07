import React from "react";
import MessageNav from "./MessageNav";
import SendMessages from "./SendMessages";

import useBearStore from "../store/store";
import MessagesToShow from "./MessagesToShow";
import { Minimize2 } from "lucide-react";
import useMessages from "../store/message.store";


const Chatbar = () => {
  
  const {showUserSideBar} = useBearStore(state=>state)
  const {imagePreview,setShowFullImage,setImagePreview} = useMessages(state=>state)

  return (
    <div
      className={` ${
        showUserSideBar ? "block" : ""
      } w-full pb-4 bg-base-content overflow-hidden relative`}
    >
      <MessageNav />

      <MessagesToShow/>
      {
        imagePreview && (
          <div className="w-full h-full bg-base-200 absolute z-20 top-0 overflow-auto text-base-300">
            <div className="flex w-full justify-end pe-3 pt-3">
              <Minimize2
                onClick={() => {
                  setShowFullImage(false);
                  setImagePreview(false);
                }}
                className="cursor-pointer text-base-content"
              />
            </div>
            <div className=" flex w-full h-full justify-center py-4">
              <img
                onClick={() => {
                  setShowFullImage(false);
                  setImagePreview(false);
                }}
                src={imagePreview}
                alt="image"
                className="cursor-zoom-out object-contain"
              />
            </div>
          </div>
        )
      }
      <SendMessages />

    </div>
  );
};

export default Chatbar;
