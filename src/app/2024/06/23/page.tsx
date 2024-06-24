'use client'

import {Canvas, extend, MaterialNode, MaterialProps, useFrame, useThree} from "@react-three/fiber"
import {Float, Html, shaderMaterial, OrbitControls} from "@react-three/drei"
import { Caveat } from "next/font/google"
import fragment from './fragment.glsl'
import vertex from './vertex.glsl'
import * as THREE from 'three'
import React, {forwardRef, useImperativeHandle, useRef} from "react"

const caveat = Caveat({
    subsets: ['latin'],
    variable: '--font-caveat'
})

const GridBubbleShaderImp = shaderMaterial({
    uTime: 0,
    uMouse: new THREE.Vector2(0, 0),
    uSize: new THREE.Vector2(1, 1),
    uColor: new THREE.Color(0.125, 0.0, 0.5),
    uResolution: typeof window !== 'undefined' ? new THREE.Vector2(window.innerWidth, window.innerHeight) : new THREE.Vector2(1, 1),
}, vertex, fragment, (imp) => { if (imp) {
} })

extend({ GridBubbleShaderImp })

declare global {
    namespace JSX {
        interface IntrinsicElements {
            gridBubbleShaderImp: MaterialNode<any, typeof THREE.MeshStandardMaterial>
        }
    }
}

export type GridBubbleShaderUniforms = {
    uTime: number
    uMouse?: THREE.Vector2
    uSize?: THREE.Vector2
    uTexture?: THREE.Texture
    uResolution?: THREE.Vector2
    uColor?: THREE.Color
}

type Props = GridBubbleShaderUniforms & MaterialProps

const GridBubbleShader = forwardRef<GridBubbleShaderUniforms, Props>(({...props}: Props, ref) => {
    const localRef = useRef<Props>(null!)
    useImperativeHandle(ref, () => localRef.current)
    useFrame((state, delta) => {
        localRef.current.uTime += delta
        localRef.current.uMouse = state.pointer
    })
    return <gridBubbleShaderImp key={GridBubbleShaderImp.key} ref={localRef} attach="material" {...props} />
})
GridBubbleShader.displayName = 'GridBubbleShader'

export default function Page() {

    return <>
        <Canvas style={{position: "absolute", top: "0", zIndex: "-1", backgroundColor: '#003f88'}}>
            <Scene />
            <Float>
                <Html position={[0, -2.5, 0]}
                      center
                      transform
                      as="h1"
                      className={caveat.className}
                      scale={0.25}
                >
                    <div style={{
                        transform: 'scale(4)',
                        textAlign: 'center',
                        pointerEvents: 'none',
                        color: '#f58e00',
                        textShadow: '0 0 1px #000'
                    }}>
                        Marblous
                    </div>
                </Html>
            </Float>
            <OrbitControls/>
        </Canvas>
    </>
}

function Scene({props}: {props?: JSX.IntrinsicElements['mesh']}) {
    const view = useThree((state) => state.viewport)

    return <mesh position={[0, 0, 0]} {...props}>
        <planeGeometry args={[view.width, view.height]}/>
        <GridBubbleShader
            uTime={0}
            uColor={new THREE.Color(0.5, 0.0, 0.125)}
            uSize={new THREE.Vector2(view.width, view.height)}
            transparent
        />
    </mesh>
}
