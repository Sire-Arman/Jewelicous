import React from 'react'
import { FaAward } from 'react-icons/fa';
import { FaShieldAlt } from 'react-icons/fa';
import { FaExchangeAlt } from 'react-icons/fa';
import { FaClipboardCheck } from 'react-icons/fa';
import { FaTruck } from 'react-icons/fa';
import { FaHeadset } from 'react-icons/fa';

function Features() {
  return (
    <div className='mt-5 mb-4 flex gap-x-0 sm:gap-x-5 gap-y-2 justify-around sm:px-3 px-0 flex-wrap items-center'>
        <div className='flex flex-col items-center w-[110px] text-center'>
            <FaAward color='skyblue' className='sm:w-[60px] sm:h-[60px] w-[40px] h-[40px]'/>
            <span>10+ Year Legacy</span>
        </div>
        <div className='flex flex-col items-center w-[110px] text-center'>
            <FaShieldAlt color='skyblue'  className='sm:w-[60px] sm:h-[60px]  w-[40px] h-[40px]'/>
            <span>Trusted Product</span>
        </div>
        <div className='flex flex-col items-center w-[110px] text-center'>
            <FaExchangeAlt color='skyblue'  className='sm:w-[60px] sm:h-[60px]  w-[40px] h-[40px]'/>
            <span>Hassle Free Replacement</span>
        </div>
        <div className='flex flex-col items-center w-[110px] text-center'>
            <FaClipboardCheck color='skyblue'  className='sm:w-[60px] sm:h-[60px]  w-[40px] h-[40px]'/>
            <span>Assured Warranty</span>
        </div>
        <div className='flex flex-col items-center w-[110px] text-center'>
            <FaTruck color='skyblue' className='sm:w-[60px] sm:h-[60px]  w-[40px] h-[40px]' />
            <span>Fast & Free Delivery</span>
        </div>
        <div className='flex flex-col items-center w-[110px] text-center'>
            <FaHeadset color='skyblue'  className='sm:w-[60px] sm:h-[60px] w-[40px] h-[40px]'/>
            <span>Quick Support</span>
        </div>
    </div>
  )
}

export default Features