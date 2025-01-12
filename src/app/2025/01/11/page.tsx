'use client'

import {Inter, Roboto} from "next/font/google"
import React from 'react'
import Image from "next/image"
import {twMerge} from "tailwind-merge"

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter'
})

const roboto = Roboto({
    weight: '500',
    subsets: ['latin'],
    variable: '--font-roboto'
})

export default function Page() {
    return (
        <div className={twMerge("absolute w-full top-0 z-10 bg-[#0b0c14] text-white", inter.variable)}>
            <div className="absolute w-full h-[55%] top-0 z-[-5] p-2
                bg-[radial-gradient(circle,_#38bdf9_0%,_#0b0c14_40%)]"/>
            <Image
                src="/grain.png"
                alt="grain overlay"
                width={1240}
                height={870}
                className="absolute w-full h-full opacity-[0.03] z-[-5]"/>
            <Image
                src="/grain.png"
                alt="grain overlay"
                width={1240}
                height={870}
                className="absolute w-full h-[-99%] opacity-[0.06] z-[-5]"/>
            <div className="absolute w-full h-[55%] z-[-4] p-2
                bg-[radial-gradient(circle,_#0b0c1429_0%,_#0b0c14_40%)]"/>
            <Header/>
            <HeroSection/>
            <section className="w-full flex items-center justify-center">
                <Image src="/hungerGames.webp" alt="Hero Image" width={1240} height={870}/>
            </section>
            <div className="w-full flex flex-col gap-4 justify-center items-center pt-24">
                <p className={twMerge("uppercase text-[#38BDF8] text-xs", roboto.className)}>
                    testimonials
                </p>
                <h2 className="p-2 text-center" style={{fontSize: '3rem', lineHeight: '62.4px'}}>
                    Supercharging thousands<br/>of Snowflake users
                </h2>
            </div>
            <Testimonials />
        </div>
    )
}

function Header() {
    return (
        <header className="w-full flex justify-center text-sm pt-4">
            <div
                className="flex justify-between items-center px-4 py-2 w-11/12 border-[1px] border-[#2f3440]/80 rounded-2xl">
                <img src="/hg-select.svg" alt="Logo" className="w-[100px] mr-4"/>
                <nav className="flex items-center gap-3">
                    <button className="bg-none border-none mx-2 flex items-center gap-1">
                        Features
                        <ChevronDown/>
                    </button>
                    <button className="bg-none border-none mx-2">
                        Pricing
                    </button>
                    <button className="bg-none border-none mx-2 flex items-center gap-1">
                        Resources
                        <ChevronDown/>
                    </button>
                    <button className="bg-none border-none mx-2">
                        About
                    </button>
                </nav>
                <div>
                    <button className="bg-none border-none mx-2 text-white/80 pr-4">Log In</button>
                    <button className="relative bg-gradient-to-b z-[-2] from-[#64C7F2] to-[#0B658C] px-3 py-2 rounded-lg">
                        <div
                            className="absolute w-[98%] h-[92%] z-[-1] p-2 rounded-md top-[2px] left-[2px] bg-[#38BDF8]"/>
                        Book a Demo
                    </button>
                </div>
            </div>
        </header>
    )
}

function HeroSection() {
    return (
        <section className="flex flex-col items-center px-8 pt-20 pb-10">
            <SpecialButton/>
            <h1 className="text-center my-4 text-6xl bg-clip-text text-transparent
                bg-gradient-to-b from-white to-[#999ea9] p-4">
                The Snowflake optimization<br/>and cost management platform
            </h1>
            <p className="text-center my-4 text-xl text-white/80">
                Gain deep visibility into Snowflake usage, optimize performance<br/>
                and automate savings with the click of a button.
            </p>
            <div className="flex justify-center gap-4 my-4">
                <button className="relative bg-gradient-to-b z-[-2] from-[#64C7F2] to-[#0B658C] px-6 py-3 rounded-xl overflow-hidden">
                    <div className="absolute w-[98%] h-[92%] z-[-1] p-2 rounded-xl top-[2px] left-[2px] bg-[#38BDF8]"/>
                    Book a Demo
                </button>
                <button className="flex gap-2 items-center px-4 py-2">
                    Start a Free Trial
                    <ChevronRight/>
                </button>
            </div>
        </section>
    )
}

function Testimonials() {
    return (
        <section className="relative flex justify-center items-center w-full px-8 pt-20 pb-10 z-0">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#0b0c14]
             from-10% to-transparent to-25% z-20"/>
            <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-[#0b0c14]
             from-10% to-transparent to-25% z-20"/>
            <div className="flex w-5/6 justify-between z-0 overflow-hidden max-h-[700px]">
                <div className="flex flex-col items-center gap-[2px] animate-scroll-down">
                    <Image src="/TestimonialCard.png" alt="Testimonial" width={400} height={320}/>
                    <Image src="/TestimonialCard.png" alt="Testimonial" width={400} height={320}/>
                    <Image src="/TestimonialCard.png" alt="Testimonial" width={400} height={320}/>
                    <Image src="/TestimonialCard.png" alt="Testimonial" width={400} height={320}/>
                    <Image src="/TestimonialCard.png" alt="Testimonial" width={400} height={320}/>
                </div>
                <div className="flex flex-col items-center gap-[2px] animate-scroll-up">
                    <Image src="/TestimonialCard.png" alt="Testimonial" width={400} height={320}/>
                    <Image src="/TestimonialCard.png" alt="Testimonial" width={400} height={320}/>
                    <Image src="/TestimonialCard.png" alt="Testimonial" width={400} height={320}/>
                    <Image src="/TestimonialCard.png" alt="Testimonial" width={400} height={320}/>
                    <Image src="/TestimonialCard.png" alt="Testimonial" width={400} height={320}/>
                </div>
                <div className="flex flex-col items-center gap-[2px] animate-scroll-down">
                    <Image src="/TestimonialCard.png" alt="Testimonial" width={400} height={320}/>
                    <Image src="/TestimonialCard.png" alt="Testimonial" width={400} height={320}/>
                    <Image src="/TestimonialCard.png" alt="Testimonial" width={400} height={320}/>
                    <Image src="/TestimonialCard.png" alt="Testimonial" width={400} height={320}/>
                    <Image src="/TestimonialCard.png" alt="Testimonial" width={400} height={320}/>
                </div>
            </div>
        </section>
    )
}

function SpecialButton() {
    return (
        <button className="relative flex justify-center items-center gap-2 rounded-full py-2 px-4 text-sm
            overflow-hidden">
            <div className="absolute w-full aspect-[1/4] -z-[3] p-2 rounded-full
                 bg-[conic-gradient(from_0deg,_#3b3f5a00,_#18182B00_60%,_#38BDF8)] animate-[spin_3s_linear_infinite]"/>
            <div className="absolute w-[98%] h-[94%] -z-[2] p-2 rounded-full
                bg-[radial-gradient(circle_at_top,_#3b3f5a_0%,_#18182B_100%)]"/>
            <Stars/>
            Introducing Insights
            <ChevronRight/>
        </button>
    )
}

function Stars() {
    return (
        <svg width="15" height="13" viewBox="0 0 15 13" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M0.929667 7.10566L4.11292 5.77974L5.43883 2.59649C5.52983 2.37891 5.88683 2.37891 5.97783 2.59649L7.30375 5.77974L10.487 7.10566C10.5961 7.15116 10.6667 7.25733 10.6667 7.37516C10.6667 7.49299 10.5961 7.59916 10.487 7.64466L7.30375 8.97058L5.97783 12.1538C5.93233 12.2629 5.82617 12.3335 5.70833 12.3335C5.5905 12.3335 5.48433 12.2629 5.43883 12.1538L4.11292 8.97058L0.929667 7.64466C0.820584 7.59916 0.75 7.49299 0.75 7.37516C0.75 7.25733 0.820584 7.15116 0.929667 7.10566ZM8.53283 3.01474L10.5815 2.33166L11.2646 0.282992C11.3445 0.0449922 11.7388 0.0449922 11.8182 0.282992L12.5018 2.33166L14.5505 3.01474C14.6695 3.05499 14.75 3.16641 14.75 3.29183C14.75 3.41724 14.6695 3.52866 14.5505 3.56891L12.5013 4.25199L11.8182 6.30124C11.7785 6.41966 11.6671 6.50016 11.5417 6.50016C11.4163 6.50016 11.3048 6.41966 11.2646 6.30066L10.5815 4.25141L8.53225 3.56833C8.41383 3.52866 8.33333 3.41724 8.33333 3.29183C8.33333 3.16641 8.41383 3.05499 8.53283 3.01474ZM9.6995 10.5981L10.8738 10.2067L11.2652 9.03241C11.3451 8.79441 11.7394 8.79441 11.8188 9.03241L12.2102 10.2067L13.3844 10.5981C13.5028 10.6383 13.5833 10.7497 13.5833 10.8752C13.5833 11.0006 13.5028 11.112 13.3838 11.1522L12.2096 11.5437L11.8182 12.7179C11.7785 12.8363 11.6671 12.9168 11.5417 12.9168C11.4163 12.9168 11.3048 12.8363 11.2646 12.7173L10.8732 11.5431L9.69892 11.1517C9.5805 11.112 9.5 11.0006 9.5 10.8752C9.5 10.7497 9.5805 10.6383 9.6995 10.5981Z"
                fill="#38BDF9"/>
        </svg>

    )
}

function ChevronRight() {
    return (
        <svg width="5" height="9" viewBox="0 0 5 9" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0.75 1L4.25 4.5L0.75 8" stroke="white" stroke-opacity="0.9" stroke-width="1.05"
                  stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    )
}

function ChevronDown() {
    return (
        <svg className="ml-1" width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 3L5 7L9 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                  strokeLinejoin="round"/>
        </svg>
    )
}
