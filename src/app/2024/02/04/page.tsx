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

const MarchShimWave = shaderMaterial({
        time: 0,
        color: new THREE.Color(0.5, 0.0, 0.025),
        // this ternary is necessary because SSR
        resolution: typeof window !== 'undefined' ? new THREE.Vector2(window.innerWidth, window.innerHeight) : new THREE.Vector2(1, 1),
    },
    vertex,
    fragment,
)

type Props = MaterialNode<any, any> & { time?: number, color?: THREE.Color, resolution?: THREE.Vector2 }
extend({ MarchShimWave })
declare module "@react-three/fiber" {
    interface ThreeElements {
        marchShimWave: MaterialNode<any, any>
    }
}

const Shader = forwardRef(({ ...props }: Props, ref) => {
    const localRef = useRef<THREE.ShaderMaterial & {time: number, color:THREE.Color, resolution?: THREE.Vector2}>(null!)

    useImperativeHandle(ref, () => localRef.current)

    useFrame((_, delta) => (localRef.current.time += delta))
    return <marchShimWave key={MarchShimWave.key} ref={localRef} {...props} attach='material' />
})
Shader.displayName = 'Shader'

export default function Page() {
    return <Canvas>
        <mesh position={[0, 1, 0]}>
            <sphereGeometry args={[1.5, 128, 128]} />
            {/* @ts-ignore */}
            <Shader time={0} color={'grey'}/>
        </mesh>
        <OrbitControls />
        <Float>
            <Html position={[0, -1.5, 1]}
                  center transform as="h1" className={caveat.className} scale={0.25}>
                <div style={{ transform: 'scale(4)', textAlign: 'center' }}>
                    You aren't Kane...<br/>Are you?
                </div>
            </Html>
        </Float>
    </Canvas>
}
