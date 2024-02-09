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

const VertLines = shaderMaterial({
        uTime: 0,
        vLastPos: new THREE.Vector3(1, 2, 3),
        uColor: new THREE.Color(0.5, 0.0, 0.025),
        // this ternary is necessary because SSR
        uResolution: typeof window !== 'undefined' ? new THREE.Vector2(window.innerWidth, window.innerHeight) : new THREE.Vector2(1, 1),
    },
    vertex,
    fragment,
)

type Props = MaterialNode<any, any> & { uTime?: number, uColor?: THREE.Color, uResolution?: THREE.Vector2 }
extend({ VertLines })
declare module "@react-three/fiber" {
    interface ThreeElements {
        vertLines: MaterialNode<any, any>
    }
}

const Shader = forwardRef(({ ...props }: Props, ref) => {
    const localRef = useRef<THREE.ShaderMaterial & {uTime: number, uColor:THREE.Color, uResolution?: THREE.Vector2}>(null!)

    useImperativeHandle(ref, () => localRef.current)

    useFrame((_, delta) => (localRef.current.uTime += delta))
    return <vertLines key={VertLines.key} ref={localRef} {...props} attach='material' />
})
Shader.displayName = 'Shader'

export default function Page() {
    return <Canvas style={{ position: "absolute", top: "0", zIndex: "-1"}}>
        <mesh position={[0, 1, 0]}>
            <boxGeometry args={[2.5, 2.5, 2.5]}/>
            {/* @ts-ignore */}
            <Shader uTime={0} uColor={'#ff3bfb'}/>
        </mesh>
        <Float>
            <Html position={[0, -1.5, 1]}
                  center transform as="h1" className={caveat.className} scale={0.25}>
                <div style={{ transform: 'scale(4)', textAlign: 'center' }}>
                    Cubism is a lie
                </div>
            </Html>
        </Float>
        <OrbitControls />
    </Canvas>
}
