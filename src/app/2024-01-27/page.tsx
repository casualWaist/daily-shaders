'use client'

import {Canvas, MaterialNode} from "@react-three/fiber"
import * as THREE from 'three'
import { extend, useFrame } from '@react-three/fiber'
import {Float, Html, shaderMaterial} from '@react-three/drei'
import vertex from '@/app/2024-01-27/vertex.glsl'
import fragment from '../2024-01-27/fragment.glsl'
import { forwardRef, useImperativeHandle, useRef } from 'react'
import {Caveat} from "next/font/google"

const caveat = Caveat({
    subsets: ['latin'],
    variable: '--font-caveat'
})

const MarchReps = shaderMaterial({
        time: 0,
        // this ternary is necessary because SSR
        resolution: typeof window !== 'undefined' ? new THREE.Vector2(window.innerWidth, window.innerHeight) : new THREE.Vector2(1, 1),
    },
    vertex,
    fragment,
)

type Props = THREE.ShaderMaterial & { time?: number, resolution?: THREE.Vector2 }
extend({ MarchReps })
declare module "@react-three/fiber" {
    interface ThreeElements {
        marchReps: MaterialNode<Props, typeof MarchReps>;
    }
}

const Shader = forwardRef(({ ...props }: Props, ref) => {
    const localRef = useRef<THREE.ShaderMaterial & {time: number, resolution?: THREE.Vector2}>(null!)

    useImperativeHandle(ref, () => localRef.current)

    useFrame((_, delta) => (localRef.current.time += delta))
    return <marchReps key={MarchReps.key} ref={localRef} {...props} attach='material' />
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
                    I don't have<br/>time for a name
                </div>
            </Html>
        </Float>
    </Canvas>
}
