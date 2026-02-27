import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdFileUpload } from "react-icons/md";
import { BsSend } from "react-icons/bs";
import { useForm } from "react-hook-form";
import { X, LoaderCircle, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import useMessages from '../store/message.store';
import useGroups from '../store/group.store';
import useBearStore from '../store/store';

const SendMessages = () => {
    const { register, handleSubmit, setValue, watch } = useForm();
    const [showImage, setShowImage] = useState(null);
    const [isMessageSent, setIsMessageSent] = useState(false);
    const { sendMessages } = useMessages();
    const { selectedGroup } = useGroups(state => state);
    const { userAuth } = useBearStore(state => state);

    const sentMessage = async (data) => {
        const { text, image } = data;
        if (!text?.trim() && !image?.[0]) {
            return toast.error("Message field can't be empty!");
        }

        setValue("text", "");
        setShowImage(null);
        setIsMessageSent(true);

        try {
            if (image?.[0]) {
                const reader = new FileReader();
                reader.readAsDataURL(image[0]);
                reader.onload = async () => {
                    const base64Image = reader.result;
                    setValue("image", "");
                    await sendMessages({ text, image: base64Image });
                    setIsMessageSent(false);
                };
            } else {
                await sendMessages({ text, image: null });
                setIsMessageSent(false);
            }
        } catch (error) {
            toast.error(error.message);
            setIsMessageSent(false);
        }
    };

    const baseImage = watch('image');
    useEffect(() => {
        if (baseImage && baseImage?.length !== 0) {
            const reader = new FileReader();
            reader.readAsDataURL(baseImage[0]);
            reader.onload = () => setShowImage(reader.result);
        }
    }, [baseImage]);

    const isOnlyAdminCanMessage = selectedGroup?.people.includes(userAuth._id) && selectedGroup?.onlyAdminCanMessage;

    return (
        <div className='w-full px-4 py-3 bg-base-100/50 backdrop-blur-sm relative border-t border-base-content/5'>
            
            {/* 1. Image Preview Animation */}
            <AnimatePresence>
                {showImage && (
                    <motion.div 
                        initial={{ y: 50, opacity: 0, scale: 0.8 }}
                        animate={{ y: -10, opacity: 1, scale: 1 }}
                        exit={{ y: 50, opacity: 0, scale: 0.8 }}
                        className='absolute bottom-full left-4 mb-2 z-10'
                    >
                        <div className='relative p-1 bg-base-300 rounded-xl shadow-2xl border-2 border-primary'>
                            <button 
                                onClick={() => { setShowImage(null); setValue("image", ""); }}
                                className='absolute -top-2 -right-2 bg-error text-error-content rounded-full p-1 shadow-lg hover:scale-110 transition-transform'
                            >
                                <X size={14} />
                            </button>
                            <img src={showImage} alt="preview" className='w-24 h-24 object-cover rounded-lg' />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 2. Main Input Form */}
            <form className='flex items-center gap-2 max-w-7xl mx-auto' onSubmit={handleSubmit(sentMessage)}>
                
                <div className='relative flex-1 group'>
                    <input 
                        type="text" 
                        placeholder={isOnlyAdminCanMessage ? "Only admins can message..." : "Type a message..."}
                        disabled={isOnlyAdminCanMessage}
                        autoComplete='off'
                        className="input w-full bg-base-200 focus:bg-base-100 border-none focus:ring-2 focus:ring-primary/50 transition-all rounded-2xl pr-12" 
                        {...register("text")}
                    />
                    
                    {/* File Upload Icon Inside Input */}
                    <div className='absolute right-2 top-1/2 -translate-y-1/2'>
                        <label 
                            htmlFor="image" 
                            className={`p-2 rounded-xl flex items-center justify-center transition-colors cursor-pointer ${showImage ? 'text-primary' : 'text-base-content/40 hover:text-primary hover:bg-primary/10'}`}
                        >
                            <ImageIcon size={22} />
                            <input 
                                type="file" 
                                className='hidden'
                                id='image'
                                accept='image/*'
                                {...register('image')}
                            />
                        </label>
                    </div>
                </div>

                {/* 3. Send Button with Motion */}
                <motion.button
                    whileHover={!isMessageSent ? { scale: 1.1 } : {}}
                    whileTap={!isMessageSent ? { scale: 0.9 } : {}}
                    type={isMessageSent ? 'button' : 'submit'}
                    disabled={isOnlyAdminCanMessage}
                    className={`btn btn-circle ${isMessageSent ? 'btn-ghost' : 'btn-primary'} shadow-lg`}
                >
                    {isMessageSent ? (
                        <LoaderCircle className='animate-spin text-primary' />
                    ) : (
                        <BsSend className="ml-1" />
                    )}
                </motion.button>
            </form>
        </div>
    );
};

export default SendMessages;