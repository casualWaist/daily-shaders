'use client'

import {Canvas, extend, MaterialNode, MaterialProps, useFrame, useThree} from "@react-three/fiber"
import {Float, Html, shaderMaterial, OrbitControls, useTexture} from "@react-three/drei"
import { Caveat } from "next/font/google"
import fragment from './fragment.glsl'
import vertex from './vertex.glsl'
import * as THREE from 'three'
import React, {forwardRef, useImperativeHandle, useRef, useState} from "react"
import ValueSlider from "@/components/ui/ValueSlider"

const caveat = Caveat({
    subsets: ['latin'],
    variable: '--font-caveat'
})

const DotPShaderImp = shaderMaterial({
    xS: 1.0,
    xSk: 0.0,
    ySk: 0.0,
    yS: 1.0,

    uTime: 0,
    uMouse: new THREE.Vector2(0, 0),
    uSize: new THREE.Vector2(1, 1),
    uTexture: new THREE.Texture(),
    uColor: new THREE.Color(0.125, 0.0, 0.5),
    uResolution: typeof window !== 'undefined' ? new THREE.Vector2(window.innerWidth, window.innerHeight) : new THREE.Vector2(1, 1),
}, vertex, fragment, (imp) => { if (imp) {
} })

extend({ DotPShaderImp })

declare global {
    namespace JSX {
        interface IntrinsicElements {
            dotPShaderImp: MaterialNode<any, typeof THREE.MeshStandardMaterial>
        }
    }
}

export type DotPShaderUniforms = {
    uTime: number
    uMouse?: THREE.Vector2
    uSize?: THREE.Vector2
    uTexture?: THREE.Texture
    uResolution?: THREE.Vector2
    uColor?: THREE.Color
} & MatrixState

type Props = DotPShaderUniforms & MaterialProps

const DotPShader = forwardRef<DotPShaderUniforms, Props>(({...props}: Props, ref) => {
    const localRef = useRef<Props>(null!)
    useImperativeHandle(ref, () => localRef.current)
    useFrame((state, delta) => {
        localRef.current.uTime += delta
        localRef.current.uMouse = state.pointer
    })
    return <dotPShaderImp key={DotPShaderImp.key} ref={localRef} attach="material" {...props} />
})
DotPShader.displayName = 'DotPShader'

type MatrixState = {
    xS: number
    xSk: number
    ySk: number
    yS: number
}

export default function Page() {
    const [ matrixState, _ ] = useState({
        xS: 1.0,
        xSk: 0.0,
        ySk: 0.0,
        yS: 1.0,
    })
    const setMatrixState = (state: Partial<MatrixState>) => {
        _((prev) => ({...prev, ...state}))
    }

    const updateXS = (value: number) => {
        setMatrixState({xS: value})
    }
    const updateXSk = (value: number) => {
        setMatrixState({xSk: value})
    }
    const updateYSk = (value: number) => {
        setMatrixState({ySk: value})
    }
    const updateYS = (value: number) => {
        setMatrixState({yS: value})
    }

    return <>
        <Canvas style={{position: "absolute", top: "0", zIndex: "-1"}}>
            <Scene matrix={matrixState}/>
            <Float>
                <Html position={[0, -2.5, 0]}
                      center
                      transform
                      as="h1"
                      className={caveat.className}
                      scale={0.25}
                >
                    <div style={{transform: 'scale(4)', textAlign: 'center', pointerEvents: 'none'}}>
                        "Laser"
                    </div>
                </Html>
            </Float>
            <OrbitControls/>
        </Canvas>
        <div className="absolute right-0 top-[40px] bg-blue-200 pointer-events-auto flex flex-col">
            <div className="flex flex-row">
                <ValueSlider containerClass="sm:flex-row" minValue={-5} maxValue={5} onChange={updateXS} value={matrixState.xS}/>
                <ValueSlider containerClass="sm:flex-row" minValue={-5} maxValue={5} onChange={updateXSk} value={matrixState.xSk}/>
            </div>
            <div className="flex flex-row">
                <ValueSlider containerClass="sm:flex-row" minValue={-5} maxValue={5} onChange={updateYSk} value={matrixState.ySk}/>
                <ValueSlider containerClass="sm:flex-row" minValue={-5} maxValue={5} onChange={updateYS} value={matrixState.yS}/>
            </div>
        </div>
    </>
}

function Scene({props, matrix}: {props?: JSX.IntrinsicElements['mesh'], matrix: MatrixState}) {
    const view = useThree((state) => state.viewport)
    const texture = useTexture('/bubbles.png')
    texture.wrapT = THREE.RepeatWrapping
    texture.wrapS = THREE.RepeatWrapping
    return <mesh position={[0, 0, 0]} {...props}>
        <planeGeometry args={[view.width, view.height]}/>
        <DotPShader
            uTime={0}
            uSize={new THREE.Vector2(view.width, view.height)}
            xS={matrix.xS}
            xSk={matrix.xSk}
            ySk={matrix.ySk}
            yS={matrix.yS}
            uTexture={texture}/>
    </mesh>
}
