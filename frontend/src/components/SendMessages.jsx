import React, { useEffect, useState } from 'react'
import { MdFileUpload } from "react-icons/md";
import { BsSend } from "react-icons/bs";
import {useForm} from "react-hook-form"
import { X } from 'lucide-react';
import toast from 'react-hot-toast';
import useMessages from '../store/message.store';
import { Forward } from 'lucide-react';
import { LoaderCircle } from 'lucide-react';

const SendMessages = () => {
    const {register, handleSubmit,setValue,watch} = useForm();
    const [showImage, setShowImage] = useState(null)
    const [isMessageSent, setIsMessageSent] = useState(false)
    const {sendMessages} = useMessages()

    const sentMessage = async (data)=>{
        const {text, image} = data;
        setValue("text","")
        setShowImage(null)
        try {
            setIsMessageSent(true)
            console.log("image",image)
            if(text || image[0]){
            let base64Image;
            if(image[0]){
                const reader = new FileReader()
                reader.readAsDataURL(image[0])
                reader.onload = async()=>{
                    base64Image = reader.result;
                    setValue("image","");
                    await sendMessages({text,image:base64Image})
                }
            }else{
                // console.log(data)
                await sendMessages({text,image:null})
            }
            
        }else{
            toast.error("you don't have anything to send")
        }
        } catch (error) {
            toast(error.message)
        }finally{
            setIsMessageSent(false)
        }
    }
    const baseImage = watch('image')
    useEffect(()=>{
        if(baseImage && baseImage?.length!=0){
            (baseImage)
            const reader = new FileReader()
            reader.readAsDataURL(baseImage[0])
            reader.onload = async()=>{
                setShowImage(reader.result)
            }
        }
    },[baseImage])
    return (
    <div className=' w-full mb-1 px-2 relative'>
        
        {
            showImage && (
                <div className='absolute w-fit py-3 top-[-300%]'>
                    <div className='right-0 cursor-pointer flex w-full justify-end text-primary-content' onClick={()=>{
                        setShowImage(null)
                        setValue("image","")
                    }}><X /></div>
                    <img src={showImage} alt="" className='w-20 h-20 ' />
                </div>
            )
        }
        
        <form className='flex items-center gap-3' onSubmit={handleSubmit(sentMessage)}>
            <input 
                type="text" 
                placeholder="Type Messages..." 
                autoComplete='off'
                className="input w-[90%] focus:outline-none first-capital border border-green-400" 
                {...register("text")}
            />
            <div className=' '>
                <label htmlFor="image" className='text-3xl text-base-300 cursor-pointer'>
                    <MdFileUpload />
                    <input 
                        type="file" 
                        className='hidden'
                        id='image'
                        accept='image/*'
                        {...register('image')}
                    />
                </label>
                
            </div>
            <div>
                <button
                    type='submit'
                    className='text-2xl cursor-pointer text-base-300'
                >
                    {isMessageSent ?  <LoaderCircle className='animate-spin'/> : <BsSend />}
                </button>
            </div>
        </form>
    </div>
  )
}

export default SendMessages