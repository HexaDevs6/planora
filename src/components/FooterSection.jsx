import React from 'react'
import { Mail } from 'lucide-react';
import { Phone } from 'lucide-react';

export default function FooterSection() {
  return (
    <footer className='py-16 overflow-hidden'>
        <div className="container">
            <div className="footer__content py-16 grid grid-cols-2 md:grid-cols-5  md:gap-0 gap-10">
        <div className="col-span-2 flex flex-col gap-7">
            <img src="/LogoBasic.png" className="w-50" alt="Logo" />
            <p className='font-medium text-[#8A817C]'>Where great events begin.</p>
        </div>
        <div className='flex flex-col gap-3'>
            <h4 className='font-semibold text-violet text-xl'>Platform</h4>
            <ul className='flex flex-col gap-4'>
                <li className='transition-all duration-500 hover:translate-x-3 hover:scale-105 py-1 cursor-pointer'><a className='text-[#8A817C] ' href="#">Features</a></li>
                <li className='transition-all duration-500 hover:translate-x-3 hover:scale-105 py-1 cursor-pointer'><a className='text-[#8A817C]' href="#">Events</a></li>
                <li className='transition-all duration-500 hover:translate-x-3 hover:scale-105 py-1 cursor-pointer'><a className='text-[#8A817C]' href="#">Sign up</a></li>
            </ul>
        </div>
        <div className='flex flex-col gap-5'>
            <h4 className='font-semibold text-violet text-xl'>Company</h4>
            <ul className='flex flex-col gap-4'>
                <li className='transition-all duration-500 hover:translate-x-3 hover:scale-105 py-1 cursor-pointer'><a className='text-[#8A817C]' href="#">About</a></li>
                <li className='transition-all duration-500 hover:translate-x-3 hover:scale-105 py-1 cursor-pointer'><a className='text-[#8A817C]' href="#">Blog</a></li>
                <li className='transition-all duration-500 hover:translate-x-3 hover:scale-105 py-1 cursor-pointer'><a className='text-[#8A817C]' href="#">Careers</a></li>
            </ul>
        </div>
        <div className='flex flex-col gap-5'>
            <h4 className='font-semibold text-violet text-xl'>Platform</h4>
            <ul className='flex flex-col gap-4'>
                <li className='transition-all duration-500 hover:translate-x-3 hover:scale-105 py-1 cursor-pointer'><a className='text-[#8A817C] flex items-center gap-2' href="#"> <Mail/> service@planora.com</a></li>
                <li className='transition-all duration-500 hover:translate-x-3 hover:scale-105 py-1 cursor-pointer'><a className='text-[#8A817C] flex items-center gap-2' href="#"> <Phone/> 01112345678</a></li>
            </ul>
        </div>
      </div>
        </div>
        <div className="text-center border-t pt-12">
            <p className='text-xl text-[#8A817C]'>© 2025 Planora. All rights reserved.</p>
        </div>
    </footer>
  )
}
