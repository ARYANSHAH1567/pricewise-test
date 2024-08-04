'use client'
import Link from 'next/link'
import React from 'react'
import { UserButton } from '@clerk/nextjs'
import { useUser } from '@clerk/nextjs'
import useSetUserEmail from '@/hooks/useSetUserEmail'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'



const navIcons = [
  {src: '/assets/icons/home.png', alt:'home',navLink:'/'},
    {src: '/assets/icons/history.png', alt:'history',navLink:'/api/PastProd'},
    {src: '/assets/icons/heart.png', alt:'heart',navLink:'/api/LikedProd'},
]

const Navbar = () => {

 

  return (
    <header className='w-full'>
        <nav className='nav'>
         <Link href="/" className='flex items-center gap-1'>
            <img src="/assets/icons/logo.svg" width={27} height={27} alt="logo"/>
            <p className='nav-logo'>
                 Price <span className="text-primary">Wise</span>
            </p>
         </Link>
         <div className="flex items-center gap-6">
            {navIcons.map((icon)=>(
              <a href={icon.navLink}><img 
              key={icon.alt}
              src={icon.src}
              alt={icon.alt}
              
              width={28}
              height={28}
              className="object-contain"
              /></a>
            ))}
            <UserButton  />
           
         </div>
        </nav>
    </header>
  )
}

export default Navbar