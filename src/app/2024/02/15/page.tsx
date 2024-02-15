'use client'

import {Canvas, MaterialNode} from "@react-three/fiber"
import * as THREE from 'three'
import { extend, useFrame } from '@react-three/fiber'
import {Float, Html, OrbitControls, shaderMaterial, useTexture} from '@react-three/drei'
import vertex from './vertex.glsl'
import fragment from './fragment.glsl'
import { forwardRef, useImperativeHandle, useRef } from 'react'
import {Caveat} from "next/font/google"

const caveat = Caveat({
    subsets: ['latin'],
    variable: '--font-caveat'
})

const TextureMarchImp = shaderMaterial({
        uTime: 0,
        vLastPos: new THREE.Vector3(1, 2, 3),
        uTexture: new THREE.Texture(),
        uColor: new THREE.Color(0.5, 0.0, 0.025),
        // this ternary is necessary because SSR
        uResolution: typeof window !== 'undefined' ? new THREE.Vector2(window.innerWidth, window.innerHeight) : new THREE.Vector2(1, 1),
    },
    vertex,
    fragment,
)

type Props = MaterialNode<any, any> & { uTime?: number, uTexture?: THREE.Texture, uColor?: THREE.Color, uResolution?: THREE.Vector2 }
extend({ TextureMarchImp })
declare module "@react-three/fiber" {
    interface ThreeElements {
        textureMarchImp: MaterialNode<THREE.Material, Props>
    }
}

const TextureMarch = forwardRef(({ ...props }: Props, ref) => {
    const localRef = useRef<THREE.ShaderMaterial & {uTime: number, uColor:THREE.Color, uResolution?: THREE.Vector2}>(null!)

    useImperativeHandle(ref, () => localRef.current)

    useFrame((_, delta) => (localRef.current.uTime += delta))
    return <textureMarchImp key={TextureMarchImp.key} ref={localRef} {...props} attach='material' />
})
TextureMarch.displayName = 'TextureMarch'

export default function Page() {
    return <Canvas style={{ position: "absolute", top: "0", zIndex: "-1"}}>
        <Scene />
        <Float>
            <Html position={[0, -1.5, 1]}
                  center transform as="h1" className={caveat.className} scale={0.25}>
                <div style={{ transform: 'scale(4)', textAlign: 'center' }}>
                    I don't know what<br/>I was expecting
                </div>
            </Html>
        </Float>
        <OrbitControls />
    </Canvas>
}

function Scene() {
    const texture = useTexture('/Fire.png')
    return <mesh position={[0, 1, 0]}>
        <boxGeometry args={[2.5, 2.5, 2.5]}/>
        <TextureMarch uTime={0} uTexture={texture} uColor={'#ff3bfb'}/>
    </mesh>
}
