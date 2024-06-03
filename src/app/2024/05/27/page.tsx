'use client'

import {Canvas, extend, MaterialNode, MaterialProps, useFrame, useThree} from "@react-three/fiber"
import {Float, Html, shaderMaterial, OrbitControls, useTexture, Text3D} from "@react-three/drei"
import { Caveat } from "next/font/google"
import fragment from './fragment.glsl'
import vertex from './vertex.glsl'
import * as THREE from 'three'
import React, {forwardRef, useImperativeHandle, useRef} from "react"

const caveat = Caveat({
    subsets: ['latin'],
    variable: '--font-caveat'
})

const Text24ShaderImp = shaderMaterial({
    uTime: 0,
    uMouse: new THREE.Vector2(0, 0),
    uSize: new THREE.Vector2(1, 1),
    uTexture: new THREE.Texture(),
    uColor: new THREE.Color(0.83, 0.74, 0.55),
    uResolution: typeof window !== 'undefined' ? new THREE.Vector2(window.innerWidth, window.innerHeight) : new THREE.Vector2(1, 1),
}, vertex, fragment, (imp) => { if (imp) {
    //imp.wireframe = true
    imp.side = THREE.DoubleSide
    imp.depthWrite = false
    imp.blending = THREE.AdditiveBlending
} })

extend({ Text24ShaderImp })

declare global {
    namespace JSX {
        interface IntrinsicElements {
            text24ShaderImp: MaterialNode<any, typeof THREE.MeshStandardMaterial>
        }
    }
}

export type Text24ShaderUniforms = {
    uTime?: number
    uMouse?: THREE.Vector2
    uSize?: THREE.Vector2
    uTexture?: THREE.Texture
    uResolution?: THREE.Vector2
    uColor?: THREE.Color
}

type Props = Text24ShaderUniforms & MaterialProps

const Text24Shader = forwardRef<Text24ShaderUniforms, Props>(({...props}: Props, ref) => {
    const localRef = useRef<Props>(null!)
    useImperativeHandle(ref, () => localRef.current)
    useFrame((state, delta) => {
        localRef.current.uTime! += delta
        localRef.current.uMouse = state.pointer
    })
    return <text24ShaderImp key={Text24ShaderImp.key} ref={localRef} attach="material" {...props} />
})
Text24Shader.displayName = 'Text24Shader'

export default function Page() {

    return <>
        <Canvas style={{position: "absolute", top: "0", zIndex: "-1", backgroundColor: 'black'}}>
            <Scene />
            <Float>
                <Html position={[0, -2.5, 0]}
                      center
                      transform
                      as="h1"
                      className={caveat.className}
                      scale={0.25}
                >
                    <div style={{transform: 'scale(4)', textAlign: 'center', pointerEvents: 'none', color: 'white'}}>
                        🥳
                    </div>
                </Html>
            </Float>
            <OrbitControls/>
        </Canvas>
    </>
}

function Scene() {
    const view = useThree((state) => state.viewport)
    const camera = useThree((state) => state.camera)
    const camSeg = useRef(0)
    const count = useRef(0)
    const camPos = useRef([
        new THREE.Vector3(0, 0, 5),
        new THREE.Vector3(0, 5, 5),
        new THREE.Vector3(-5, 0, 2),
        new THREE.Vector3(5, 0, 2),
    ])
    const faceTex = useTexture('/noise.png')
    faceTex.wrapT = THREE.RepeatWrapping
    faceTex.wrapS = THREE.RepeatWrapping

    useFrame(() => {
        if (camera.position.distanceTo(camPos.current[camSeg.current]) < 0.1) {
            if (camSeg.current + 1 < camPos.current.length) {
                camSeg.current++
            } else {
                camSeg.current = 0
                count.current = 0
            }
        } else {
            count.current += 0.01
            camera.position.lerp(camPos.current[camSeg.current], 0.01 * count.current)
        }
    })

    return <Text3D scale={0.75}
                   position={[-view.width * 0.375, 0, 0]}
                   font="https://unpkg.com/three@0.77.0/examples/fonts/helvetiker_regular.typeface.json">
        ImmerseCon 2024
        <Text24Shader uTexture={faceTex} uColor={new THREE.Color(0.1, 0.4, 1)} transparent/>
    </Text3D>
}
