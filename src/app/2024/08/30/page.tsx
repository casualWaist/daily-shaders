import { Caveat } from "next/font/google"
import React from "react"

const caveat = Caveat({
    subsets: ['latin'],
    variable: '--font-caveat'
})

export default function Page() {
    const color = {
        a: '#bd5a5a',
        b: '#358132',
        c: '#2c3e50',
    }
    const colors = {
        a: '#bd5a5a',
        aac: '#bd5a32',
        abc: '#bd8150',
        acc: '#bd3e50',
        b: '#358132',
        baa: '#355a5a',
        bbc: '#358150',
        c: '#2c3e50',
        cab: '#2c5a32',
        cba: '#2c815a',
    }

    return <div className="flex items-center justify-center">
        <style>
            {`
                @keyframes slideInFromLeft {
                    0% {
                        transform: translateX(-100%);
                    }
                    100% {
                        transform: translateX(0);
                    }
                }
                
                .animate-slide-in {
                    animation: slideInFromLeft 1s ease-out forwards;
                }
            `}
        </style>
        <SVG color={color.a}/>
    </div>
}

function SVG({color}: { color: string }) {
    return <svg xmlns="http://www.w3.org/2000/svg" width={500} height={500} viewBox="0 0 160 160"
         className="bg-amber-300">
        <path fill={color}
              className="animate-slide-in"
              fillRule="evenodd"
              d="M4.5 6.25a3.25 3.25 0 0 1 6.051-1.65a4.497 4.497 0 0 0-2.35 1.34A.75.75 0 0 0 9.3 6.96a2.99 2.99 0 0 1 2.3-.958A3 3 0 0 1 11.5 12H3.75a2.25 2.25 0 0 1-.002-4.5h.03a.75.75 0 0 0 .747-.843A3.289 3.289 0 0 1 4.5 6.25M7.75 1.5a4.75 4.75 0 0 0-4.747 4.574A3.751 3.751 0 0 0 3.75 13.5h7.75a4.5 4.5 0 0 0 .687-8.948A4.751 4.751 0 0 0 7.75 1.5"
              clipRule="evenodd"/>
    </svg>
}

