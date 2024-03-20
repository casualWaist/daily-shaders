'use client'

import {Canvas, extend, MaterialNode, MaterialProps, useFrame, useThree} from "@react-three/fiber"
import {Float, Html, shaderMaterial, OrbitControls, useTexture} from "@react-three/drei"
import { Caveat } from "next/font/google"
import fragment from './fragment.glsl'
import vertex from './vertex.glsl'
import * as THREE from 'three'
import React, {forwardRef, useImperativeHandle, useRef} from "react"

const caveat = Caveat({
    subsets: ['latin'],
    variable: '--font-caveat'
})

const InkDripShaderImp = shaderMaterial({
    uTime: 0,
    uMouse: new THREE.Vector2(0, 0),
    uSize: new THREE.Vector2(1, 1),
    uTexture: new THREE.Texture(),
    uNoise: new THREE.Texture(),
    uColor: new THREE.Color(0.125, 0.0, 0.5),
    uResolution: typeof window !== 'undefined' ? new THREE.Vector2(window.innerWidth, window.innerHeight) : new THREE.Vector2(1, 1),
}, vertex, fragment, (imp) => { if (imp) {
    //imp.wireframe = true
} })

extend({ InkDripShaderImp })

declare global {
    namespace JSX {
        interface IntrinsicElements {
            inkDripShaderImp: MaterialNode<any, typeof THREE.MeshStandardMaterial>
        }
    }
}

export type InkDripShaderUniforms = {
    uTime: number
    uMouse?: THREE.Vector2
    uSize?: THREE.Vector2
    uTexture?: THREE.Texture
    uNoise?: THREE.Texture
    uResolution?: THREE.Vector2
    uColor?: THREE.Color
}

type Props = InkDripShaderUniforms & MaterialProps

const InkDripShader = forwardRef<InkDripShaderUniforms, Props>(({...props}: Props, ref) => {
    const localRef = useRef<Props>(null!)
    useImperativeHandle(ref, () => localRef.current)
    useFrame((state, delta) => {
        localRef.current.uTime += delta
        localRef.current.uMouse = state.pointer
    })
    return <inkDripShaderImp key={InkDripShaderImp.key} ref={localRef} attach="material" {...props} />
})
InkDripShader.displayName = 'InkDripShader'

export default function Page() {

    return <>
        <Canvas style={{position: "absolute", top: "0", zIndex: "-1"}}>
            <Scene />
            <Float>
                <Html position={[0, -2.5, 0]}
                      center
                      transform
                      as="h1"
                      className={caveat.className}
                      scale={0.25}
                >
                    <div style={{transform: 'scale(4)', textAlign: 'center', pointerEvents: 'none'}}>
                        Transitioning
                    </div>
                </Html>
            </Float>
            <OrbitControls/>
        </Canvas>
    </>
}

function Scene() {
    const view = useThree((state) => state.viewport)
    const mesh = useRef<THREE.Mesh>(null!)
    const texture = useTexture('/bubbles.png')
    texture.wrapT = THREE.RepeatWrapping
    texture.wrapS = THREE.RepeatWrapping
    const noise = useTexture('/noise.png')
    noise.wrapT = THREE.RepeatWrapping
    noise.wrapS = THREE.RepeatWrapping
    const count = 100
    const points = new Float32Array(count * 2)

    for (let i = 0; i < count; i++) {
        points[i * 2] = (Math.random() - 0.5) * view.width
        points[i * 2 + 1] = (Math.random() - 0.5) * view.height
    }

    return <>
        <mesh ref={mesh}>
            <planeGeometry args={[view.width, view.height, 9, 9]}>
                <bufferAttribute attach="attributes-points" count={count} array={points} itemSize={2}/>
            </planeGeometry>
            <InkDripShader
                uTime={0}
                uSize={new THREE.Vector2(view.width, view.height)}
                uTexture={texture}
                uNoise={noise}
            />
        </mesh>
        {/*<points position={[0, 0, 0.005]}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" count={count} array={points} itemSize={2}/>
            </bufferGeometry>
            <pointsMaterial size={0.1} sizeAttenuation={true} color={'#545454'}/>
        </points>*/}
    </>
}
