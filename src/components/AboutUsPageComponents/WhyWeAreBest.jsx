import React from 'react'
import { FaHammer } from 'react-icons/fa';
import { FaGem } from 'react-icons/fa';
import { MdWatch } from 'react-icons/md';
import { FaHandsHelping } from 'react-icons/fa';
import styles from "./style.module.css"

function WhyWeAreBest() {
  return (
    <div className='mt-4'>
        <h1 className='sm:text-[28px] text-[24px] font-bold text-center'>Why We Are The Best ?</h1>
        <p className='text-[gray] text-[17.5px] pt-1 text-center'>We are the best because we deliver Unmatched Craftsmanship and Unparalleled Quality</p>
        <div className={`flex gap-x-10 gap-y-5 justify-center bg-[#F6F6F6] my-4 px-3 py-3 flex-wrap`}>
            <div className={`${styles.bestcard} bg-white pl-1 pr-2 py-4 w-[200px] rounded-[10px] text-center`}>
                <div className='mx-auto bg-[#335C62] w-fit rounded-full p-2 mb-1'>
                    <FaHammer color='white' size={25} />
                </div>
                <p className='text-[16px]  font-semibold'>Exquisite Craftsmanship</p>
                <p className='text-[15px] mt-2'>Handcrafted with precision by our skilled artisans.</p>
            </div>
            <div className={`${styles.bestcard} bg-white pl-1 pr-2 py-4 w-[200px] rounded-[10px] text-center`}>
                <div className='mx-auto bg-[#FCB03F] w-fit rounded-full p-2 mb-1'>
                    <FaGem color='white' size={25} />
                </div>
                <p className='text-[16px] font-semibold'>Premium Materials</p>
                <p className='text-[15px] mt-2'>We use only the finest gold, diamonds, and gemstones.</p>
            </div>
            <div className={`${styles.bestcard} bg-white pl-1 pr-2 py-4 w-[200px] rounded-[10px] text-center`}>
                <div className='mx-auto bg-[#335C62] w-fit rounded-full p-2 mb-1'>
                    <MdWatch color='white' size={25} />
                </div>
                <p className='text-[16px] font-semibold'>Timeless Designs</p>
                <p className='text-[15px] mt-2'>Elegant pieces that blend classic and modern styles.</p>
            </div>
            <div className={`${styles.bestcard} bg-white pl-1 pr-2 py-4 w-[200px] rounded-[10px] text-center`}>
                <div className='mx-auto bg-[#FCB03F] w-fit rounded-full p-2 mb-1'>
                    <FaHandsHelping color='white' size={25} />
                </div>
                <p className='text-[16px] font-semibold'>Personalized Service</p>
                <p className='text-[15px] mt-2'>Tailored guidance to help you find or create the perfect piece.</p>
            </div>
        </div>
    </div>
  )
}

export default WhyWeAreBest