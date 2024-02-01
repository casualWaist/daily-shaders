// @ts-nocheck
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

const ShaderImpl = shaderMaterial(
    {
        time: 0,
        color: new THREE.Color(0.5, 0.0, 0.025),
    },
    vertex,
    fragment,
)

extend({ ShaderImpl })

type Props = MaterialNode<any, any> & { time?: number, color?: THREE.Color }

const Shader = forwardRef(({ ...props }: Props, ref) => {
    const localRef = useRef<THREE.ShaderMaterial & {time: number, color: THREE.Color}>(null!)

    useImperativeHandle(ref, () => localRef.current)

    useFrame((_, delta) => (localRef.current.time += delta))
    return <shaderImpl key={ShaderImpl.key} ref={localRef} glsl={THREE.GLSL3} {...props} attach='material' />
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
                <div style={{ transform: 'scale(4)' }}>
                    Give me a break,<br/>it's my first day.
                </div>
            </Html>
        </Float>
    </Canvas>
}
