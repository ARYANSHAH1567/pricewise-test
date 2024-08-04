"use client";

import { FormEvent, Fragment, useState } from "react";
import { Dialog, Transition, TransitionChild } from "@headlessui/react";
import React from "react";
import {
  addUserEmailToProduct,
  removeUserEmailFromProduct,
} from "@/lib/actions";
import { useUser } from "@clerk/nextjs";
import './Modal.css'

interface Props {
  productId: string,
  tracker:boolean;
}

const Modal = ({ productId,tracker }: Props) => {
  let [isStopTrack, setIsStopTrack] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState("");
  const [isTracked, setIsTracked] = useState(tracker);
  
  const { user } = useUser();

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const userEmail = user?.emailAddresses[0].emailAddress || "demo";
    await addUserEmailToProduct(productId, userEmail);

    setIsTracked(true);
    setIsSubmitting(false);
  };

  const StopTrack = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const userEmail = user?.emailAddresses[0].emailAddress || "demo";
    if (email !== userEmail) {
      alert(
        "Your email does not match with the tracking email so the product is still being tracked"
      );
    } else {
      const response = await removeUserEmailFromProduct(productId, userEmail);
    }

    setIsSubmitting(false);
    setEmail("");
    setIsTracked(false);
  };



  return (
    <>
      <div className="flex justify-evenly flex-wrap">
      { !(isTracked) && <button
          type="button"
          className={`btn px-10 py-10 inline-block w-60 ${isSubmitting && 'spinner'}`}
          onClick={handleSubmit}
          
        >
         {isSubmitting ? '':'Track'} 
        </button> }

       {isTracked && <button
          type="button"
          className={`btn px-10 py-10 inline-block w-60 ${isSubmitting && 'spinner'}`}
          onClick={() => {
            setIsStopTrack(true);
          }}
        >
          Stop Tracking
        </button> }
      </div>

      {/*To remove user from Tracking that product */}
      <Transition appear show={isStopTrack} as={Fragment}>
        <Dialog
          as="div"
          onClose={() => {
            setIsStopTrack(false);
          }}
          className="dialog-container"
        >
          <div className="min-h-screen px-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <span
                className="inline-block h-screen align-middle"
                aria-hidden="true"
              />
            </TransitionChild>

            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="dialog-content">
                <div className="flex flex-col">
                  <div className="flex justify-between">
                    <div className="p-3 border border-gray-200 rounded-10">
                      <img
                        src="/assets/icons/logo.svg"
                        alt="logo"
                        width={28}
                        height={28}
                      />
                    </div>
                    <img
                      src="/assets/icons/x-close.svg"
                      alt="close"
                      width={24}
                      height={24}
                      className="cursor-pointer"
                      onClick={() => {
                        setIsStopTrack(false);
                      }}
                    />
                  </div>

                  <h4 className="dialog-head_text">
                    Thank you for using PriceWise! To confirm, we'll stop
                    tracking your product once you enter your email. If you need
                    to track another item or have any questions, we're here to
                    help!
                  </h4>
                </div>
                <form className="flex flex-col mt-5" onSubmit={StopTrack}>
                  <label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-700"
                  >
                    Enter Email Address to stop tracking the Product
                  </label>
                  <div className="dialog-input_container">
                    <img
                      src="/assets/icons/mail.svg"
                      alt="mail"
                      width={18}
                      height={18}
                    />
                    <input
                      required
                      type="email"
                      id="email"
                      placeholder="Enter your Email Address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="dialog-input"
                    />
                  </div>
                  <button type="submit" className="dialog-btn">
                    {isSubmitting ? "Submitting" : "Submit"}
                  </button>
                </form>
              </div>
            </TransitionChild>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default Modal;
