'use client'

import {Canvas, MaterialNode} from "@react-three/fiber"
import * as THREE from 'three'
import { extend, useFrame } from '@react-three/fiber'
import {Float, Html, shaderMaterial} from '@react-three/drei'
import vertex from './vertex.glsl'
import fragment from './fragment.glsl'
import { forwardRef, useImperativeHandle, useRef } from 'react'
import {Caveat} from "next/font/google"

const caveat = Caveat({
    subsets: ['latin'],
    variable: '--font-caveat'
})

const MarchCross = shaderMaterial({
        time: 0,
        // this ternary is necessary because SSR
        resolution: typeof window !== 'undefined' ? new THREE.Vector2(window.innerWidth, window.innerHeight) : new THREE.Vector2(1, 1),
    },
    vertex,
    fragment,
)

type Props = MaterialNode<any, any> & { time?: number, resolution?: THREE.Vector2 }
extend({ MarchCross })
declare module "@react-three/fiber" {
    interface ThreeElements {
        marchCross: MaterialNode<any, any>;
    }
}

const Shader = forwardRef(({ ...props }: Props, ref) => {
    const localRef = useRef<THREE.ShaderMaterial & {time: number, resolution?: THREE.Vector2}>(null!)

    useImperativeHandle(ref, () => localRef.current)

    useFrame((_, delta) => (localRef.current.time += delta))
    return <marchCross key={MarchCross.key} ref={localRef} {...props} attach='material' />
})
Shader.displayName = 'Shader'

export default function Page() {
    return <Canvas>
        <mesh position={[0, 1, 0]}>
            <planeGeometry args={[3, 3, 1, 1]} />
            {/* @ts-ignore */}
            <Shader time={0}/>
        </mesh>
        <Float>
            <Html position={[0, -1.5, 1]}
                  center transform as="h1" className={caveat.className} scale={0.25}>
                <div style={{ transform: 'scale(4)' }}>
                    2001: A Space Cross
                </div>
            </Html>
        </Float>
    </Canvas>
}