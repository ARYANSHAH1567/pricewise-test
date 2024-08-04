'use client'
import React from 'react';
import { useSelector} from 'react-redux';
import { RootState } from '@/store/store';
import HeroCarousel from "@/components/HeroCarousel";
import Searchbar from "@/components/Searchbar";
import TrackedProd from '@/components/TrackedProd';
import useSetUserEmail from '@/hooks/useSetUserEmail';
import Loading from '@/components/Loading';


export default function Home() {

  useSetUserEmail();
  const userEmail = useSelector((state: RootState) => state.user.userEmail);

  // Render loading state while email is not set
  if (!userEmail) {
    return(
      <>
      <div className='flex justify-center items-center mt-40'>
        <div>
          <Loading/>
        </div>
      </div>
      </>
    ) 
  }

  return (
    <>
      <section className="px-6 md:px-20 py-24 border-2">
        <div className="flex max-xl:flex-col gap-16">
          <div className="flex flex-col justify-center">
            <p className="small-text">
              Smart Shopping Starts Here:
              <img
                src="/assets/icons/arrow-right.svg"
                alt="arrow-right"
                width={16}
                height={16}
              />
            </p>
            <h1 className="head-text">
              Unleash the Power of
              <span className="text-primary"> PriceWise</span>
            </h1>
            <p className="mt-6">
              Powerful, self-serve product and growth analytics to help you
              convert, engage, and retain more.
            </p>

            <Searchbar />
          </div>

          <HeroCarousel />
        </div>
      </section>
      <TrackedProd userEmail={userEmail} />
    </>
  );
}
