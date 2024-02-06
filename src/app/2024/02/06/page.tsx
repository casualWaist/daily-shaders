'use client'

import {Canvas, MaterialNode} from "@react-three/fiber"
import * as THREE from 'three'
import { extend, useFrame } from '@react-three/fiber'
import {Float, Html, OrbitControls, shaderMaterial} from '@react-three/drei'
import vertex from './vertex.glsl'
import fragment from './fragment.glsl'
import { forwardRef, useImperativeHandle, useRef } from 'react'
import {Caveat} from "next/font/google"

const caveat = Caveat({
    subsets: ['latin'],
    variable: '--font-caveat'
})

const MarchTexture = shaderMaterial({
        time: 0,
        color: new THREE.Color(0.5, 0.0, 0.025),
        mouse: new THREE.Vector2(0.5, 0.5),
        // this ternary is necessary because SSR
        resolution: typeof window !== 'undefined' ? new THREE.Vector2(window.innerWidth, window.innerHeight) : new THREE.Vector2(1, 1),
    },
    vertex,
    fragment,
)

type Props = MaterialNode<any, any> & { time?: number, color?: THREE.Color, resolution?: THREE.Vector2 }
extend({ MarchTexture })
declare module "@react-three/fiber" {
    interface ThreeElements {
        marchTexture: MaterialNode<any, any>
    }
}

const Shader = forwardRef(({ ...props }: Props, ref) => {
    const localRef = useRef<THREE.ShaderMaterial & {
        time: number, mouse: THREE.Vector2, color:THREE.Color, resolution?: THREE.Vector2}>(null!)

    useImperativeHandle(ref, () => localRef.current)

    useFrame((_, delta) => (localRef.current.time += delta))
    return <marchTexture key={MarchTexture.key} ref={localRef} {...props} attach='material' />
})
Shader.displayName = 'Shader'

export default function Page() {
    return <Canvas>
        <mesh position={[0, 1, 0]}>
            <planeGeometry args={[5.5, 5.5, 1, 1]} />
            {/* @ts-ignore */}
            <Shader time={0} color={'grey'}/>
        </mesh>
        <OrbitControls />
        <Float>
            <Html position={[0, -1.5, 1]}
                  center transform as="h1" className={caveat.className} scale={0.25}>
                <div style={{ transform: 'scale(4)', textAlign: 'center' }}>
                    Most boring<br/>window ever
                </div>
            </Html>
        </Float>
    </Canvas>
}
