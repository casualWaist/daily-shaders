'use client'

import {Canvas, extend, MaterialNode, MaterialProps, useFrame, useThree} from "@react-three/fiber"
import {Float, Html, shaderMaterial, OrbitControls} from "@react-three/drei"
import { Caveat } from "next/font/google"
import fragment from './fragment.glsl'
import vertex from './vertex.glsl'
import * as THREE from 'three'
import React, {forwardRef, useImperativeHandle, useMemo, useRef} from "react"
import {mergeVertices} from "three-stdlib"

const caveat = Caveat({
    subsets: ['latin'],
    variable: '--font-caveat'
})

const SoapBubbleShaderImp = shaderMaterial({
    uTime: 0,
    uMouse: new THREE.Vector2(0, 0),
    uSize: new THREE.Vector2(1, 1),
    uCamera: new THREE.Vector3(0, 0, 0),
    uColor: new THREE.Color(0.125, 0.0, 0.5),
    uResolution: typeof window !== 'undefined' ? new THREE.Vector2(window.innerWidth, window.innerHeight) : new THREE.Vector2(1, 1),
}, vertex, fragment, (imp) => { if (imp) {
} })

extend({ SoapBubbleShaderImp })

declare global {
    namespace JSX {
        interface IntrinsicElements {
            soapBubbleShaderImp: MaterialNode<any, typeof THREE.MeshStandardMaterial>
        }
    }
}

export type SoapBubbleShaderUniforms = {
    uTime: number
    uMouse?: THREE.Vector2
    uSize?: THREE.Vector2
    uCamera?: THREE.Vector3
    uTexture?: THREE.Texture
    uResolution?: THREE.Vector2
    uColor?: THREE.Color
}

type Props = SoapBubbleShaderUniforms & MaterialProps

const SoapBubbleShader = forwardRef<SoapBubbleShaderUniforms, Props>(({...props}: Props, ref) => {
    const localRef = useRef<Props>(null!)
    const camera = useThree((state) => state.camera)
    useImperativeHandle(ref, () => localRef.current)
    useFrame((state, delta) => {
        localRef.current.uTime += delta
        localRef.current.uMouse = state.pointer
        localRef.current.uCamera = camera.position
    })
    return <soapBubbleShaderImp key={SoapBubbleShaderImp.key} ref={localRef} attach="material" {...props} />
})
SoapBubbleShader.displayName = 'SoapBubbleShader'

export default function Page() {

    return <>
        <Canvas style={{position: "absolute",
                        top: "0",
                        zIndex: "-1",
                        background: 'linear-gradient(to bottom, #def, #14b)'}}>
            <Scene />
            <Float>
                <Html position={[0, -2.5, 0]}
                      center
                      transform
                      as="h1"
                      className={caveat.className}
                      scale={0.25}
                >
                    <div style={{transform: 'scale(4)', textAlign: 'center',
                        pointerEvents: 'none', color: '#fff'}}>
                        crapsnel
                    </div>
                </Html>
            </Float>
            <OrbitControls/>
        </Canvas>
    </>
}

function Scene({props}: {props?: JSX.IntrinsicElements['mesh']}) {
    const view = useThree((state) => state.viewport)
    const geo = useMemo(() => {
        const geo = new THREE.SphereGeometry(2, 128, 128)
        const merged = mergeVertices(geo)
        merged.computeTangents()
        return merged
    }, [])

    return <mesh position={[0, 0, 0]} geometry={geo} {...props}>
        <SoapBubbleShader
            uTime={0}
            uSize={new THREE.Vector2(view.width, view.height)}
            side={THREE.DoubleSide}
            transparent
        />
    </mesh>
}
