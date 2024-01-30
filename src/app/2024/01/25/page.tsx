// @ts-nocheck
'use client'

import { Canvas } from "@react-three/fiber"
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

const Rings = shaderMaterial(
    {
        time: 0,
        resolution: typeof window !== 'undefined' ? new THREE.Vector2(window.innerWidth, window.innerHeight) : new THREE.Vector2(1, 1),
    },
    vertex,
    fragment,
)

extend({ Rings })

type Props = typeof THREE.ShaderMaterial & { time?: number, resolution }

const Shader = forwardRef(({ ...props }: Props, ref) => {
    const localRef = useRef<THREE.ShaderMaterial & {time: number, resolution: THREE.Vector2}>(null!)

    useImperativeHandle(ref, () => localRef.current)

    useFrame((_, delta) => (localRef.current.time += delta))
    return <rings key={Rings.key} ref={localRef} glsl={THREE.GLSL3} {...props} attach='material' />
})
Shader.displayName = 'Shader'

export default function Page() {
    return <Canvas>
        <mesh>
            <sphereGeometry args={[1, 32, 32]} />
            <Shader />
        </mesh>
        <Float>
            <Html position={[0, -1.5, 1]}
                  center transform as="h1" className={caveat.className} scale={0.25}>
                <div style={{ transform: 'scale(4)', textAlign: 'center' }}>
                    If you guessed...<br/>Bullseye
                </div>
            </Html>
        </Float>
    </Canvas>
}
