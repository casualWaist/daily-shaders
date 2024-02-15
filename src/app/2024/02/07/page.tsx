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

const size = 512

const data = new Float32Array(size * size * 4)

for (let i = 0; i < size * size; i++) {
    for (let j = 0; j < 3; j++) {
        let index = (i + j * size) * 4
        let theta = Math.random() * Math.PI * 2
        let r = 0.5 + 0.5 * Math.random()
        data[index] = r * Math.cos(theta)
        data[index + 1] = r * Math.sin(theta)
        data[index + 2] = 1
        data[index + 3] = 1
    }
}

// #particleTexture #dataParticles #particles
const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat, THREE.FloatType)

const count = size ** 2
const geometry = new THREE.BufferGeometry()
let positions = new Float32Array(count * 3)
let uv = new Float32Array(count * 2)
for (let i = 0; i < size * size; i++) {
    for (let j = 0; j < 3; j++) {
        let index = (i + j * size)
        positions[index * 3] = Math.random()
        positions[index * 3 + 1] = Math.random()
        positions[index * 3 + 2] = 0
        uv[index * 2] = i / size
        uv[index * 2 + 1] = j / size
    }
}
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
geometry.setAttribute('uv', new THREE.BufferAttribute(uv, 2))

const CircleParticles = shaderMaterial({
        time: 0,
        uPositions: texture,
        color: new THREE.Color(0.5, 0.0, 0.025),
        mouse: new THREE.Vector2(0.5, 0.5),
        points: [0.5, 0.5, 0.5],
        // this ternary is necessary because SSR
        resolution: typeof window !== 'undefined' ? new THREE.Vector2(window.innerWidth, window.innerHeight) : new THREE.Vector2(1, 1),
    },
    vertex,
    fragment,
)

type Props = MaterialNode<any, any> & { time?: number, color?: THREE.Color, resolution?: THREE.Vector2 }
extend({ CircleParticles })
declare module "@react-three/fiber" {
    interface ThreeElements {
        circleParticles: MaterialNode<any, any>
    }
}

const Shader = forwardRef(({ ...props }: Props, ref) => {
    const localRef = useRef<THREE.ShaderMaterial & {
        time: number, mouse: THREE.Vector2, color:THREE.Color, resolution?: THREE.Vector2}>(null!)

    useImperativeHandle(ref, () => localRef.current)

    useFrame((_, delta) => (localRef.current.time += delta))
    return <circleParticles key={CircleParticles.key} ref={localRef} {...props} attach='material' />
})
Shader.displayName = 'Shader'

export default function Page() {
    return <Canvas>
        <points position={[0, 1, 0]} geometry={geometry}>
            {/* @ts-ignore */}
            <Shader time={0} color={'grey'}/>
        </points>
        <OrbitControls />
        <Float>
            <Html position={[0, -1.5, 1]}
                  center transform as="h1" className={caveat.className} scale={0.25}>
                <div style={{ transform: 'scale(4)', textAlign: 'center' }}>
                    bang!
                </div>
            </Html>
        </Float>
    </Canvas>
}
