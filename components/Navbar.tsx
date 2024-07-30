import Link from 'next/link'
import React from 'react'
import { UserButton } from '@clerk/nextjs'

const navIcons = [
    {src: '/assets/icons/search.svg', alt:'search'},
    {src: '/assets/icons/black-heart.svg', alt:'heart'},
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
         <div className="flex items-center gap-5">
            {navIcons.map((icon)=>(
              icon.alt==='search'?<a href="/"><img 
              key={icon.alt}
              src={icon.src}
              alt={icon.alt}
              
              width={28}
              height={28}
              className="object-contain"
              /></a>: 
                <img 
                key={icon.alt}
                src={icon.src}
                alt={icon.alt}
                
                width={28}
                height={28}
                className="object-contain"
                />
            ))}
            <UserButton  />
         </div>
        </nav>
    </header>
  )
}

export default Navbar