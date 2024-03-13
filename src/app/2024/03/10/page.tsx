'use client'

import {Canvas, extend, MaterialNode, MaterialProps, useFrame, useThree} from "@react-three/fiber"
import {Float, Html, shaderMaterial, OrbitControls, useTexture, useGLTF} from "@react-three/drei"
import { Caveat } from "next/font/google"
import fragment from './fragment.glsl'
import vertex from './vertex.glsl'
import * as THREE from 'three'
import React, {forwardRef, useEffect, useImperativeHandle, useRef, useState} from "react"
import ValueSlider from "@/components/ui/ValueSlider"

const caveat = Caveat({
    subsets: ['latin'],
    variable: '--font-caveat'
})

const HoverShaderImp = shaderMaterial({
    xS: 1.0,
    xSk: 0.0,
    xSk3: 0.0,
    xT: 0.0,

    ySk: 0.0,
    yS: 1.0,
    ySk3: 0.0,
    yT: 0.0,

    zSk: 0.0,
    zSk3: 0.0,
    zS: 1.0,
    zT: 0.0,

    skY: 0.0,
    skX: 0.0,
    skZ: 0.0,
    wS: 1.0,

    uTime: 0,
    uMouse: new THREE.Vector2(0, 0),
    uTexture: new THREE.Texture(),
    uColor: new THREE.Color(0.5, 0.0, 0.025),
    uRayOrigin: new THREE.Vector3(0, 0, 0),
    uResolution: typeof window !== 'undefined' ? new THREE.Vector2(window.innerWidth, window.innerHeight) : new THREE.Vector2(1, 1),
}, vertex, fragment, (imp) => { if (imp) {
} })

extend({ HoverShaderImp })

declare global {
    namespace JSX {
        interface IntrinsicElements {
            hoverShaderImp: MaterialNode<any, typeof THREE.MeshStandardMaterial>
        }
    }
}

export type HoverShaderUniforms = {
    uTime: number
    uMouse?: THREE.Vector2
    uTexture?: THREE.Texture
    uRayOrigin?: THREE.Vector3
    uResolution?: THREE.Vector2
    uColor?: THREE.Color
} & MatrixState

type Props = HoverShaderUniforms & MaterialProps

const HoverShader = forwardRef<HoverShaderUniforms, Props>(({...props}: Props, ref) => {
    const localRef = useRef<Props>(null!)
    const { viewport, camera } = useThree((state) => state)
    useImperativeHandle(ref, () => localRef.current)
    useEffect(() => {
        localRef.current.uResolution = new THREE.Vector2(viewport.width - viewport.width * 0.5, viewport.height - viewport.height * 0.5)
        localRef.current.uRayOrigin = camera.position
    }, [viewport, camera])
    useFrame((state, delta) => {
        localRef.current.uTime += delta
        localRef.current.uMouse = state.pointer
    })
    return <hoverShaderImp key={HoverShaderImp.key} ref={localRef} attach="material" {...props} />
})
HoverShader.displayName = 'HoverShader'

type MatrixState = {
    xS: number
    xSk: number
    xSk3: number
    xT: number

    ySk: number
    yS: number
    ySk3: number
    yT: number

    zSk: number
    zSk3: number
    zS: number
    zT: number

    skY: number
    skX: number
    skZ: number
    wS: number
}

export default function Page() {
    const [ matrixState, _ ] = useState({
        xS: 1.0,
        xSk: 0.0,
        xSk3: 0.0,
        xT: 0.0,

        ySk: 0.0,
        yS: 1.0,
        ySk3: 0.0,
        yT: 0.0,

        zSk: 0.0,
        zSk3: 0.0,
        zS: 1.0,
        zT: 0.0,

        skY: 0.0,
        skX: 0.0,
        skZ: 0.0,
        wS: 1.0
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
    const updateXSk3 = (value: number) => {
        setMatrixState({xSk3: value})
    }
    const updateXT = (value: number) => {
        setMatrixState({xT: value})
    }

    const updateYSk = (value: number) => {
        setMatrixState({ySk: value})
    }
    const updateYS = (value: number) => {
        setMatrixState({yS: value})
    }
    const updateYSk3 = (value: number) => {
        setMatrixState({ySk3: value})
    }
    const updateYT = (value: number) => {
        setMatrixState({yT: value})
    }

    const updateZSk = (value: number) => {
        setMatrixState({zSk: value})
    }
    const updateZSk3 = (value: number) => {
        setMatrixState({zSk3: value})
    }
    const updateZS = (value: number) => {
        setMatrixState({zS: value})
    }
    const updateZT = (value: number) => {
        setMatrixState({zT: value})
    }

    const updateSkY = (value: number) => {
        setMatrixState({skY: value})
    }
    const updateSkX = (value: number) => {
        setMatrixState({skX: value})
    }
    const updateSkZ = (value: number) => {
        setMatrixState({skZ: value})
    }
    const updateWS = (value: number) => {
        setMatrixState({wS: value})
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
                        What is<br/>the Matrix?
                    </div>
                </Html>
            </Float>
            <OrbitControls/>
        </Canvas>
        <div className="absolute right-0 top-[40px] bg-blue-200 pointer-events-auto flex flex-col">
            <div className="flex flex-row">
                <ValueSlider containerClass="sm:flex-row" minValue={-5} maxValue={5} onChange={updateXS} value={matrixState.xS}/>
                <ValueSlider containerClass="sm:flex-row" minValue={-5} maxValue={5} onChange={updateXSk} value={matrixState.xSk}/>
                <ValueSlider containerClass="sm:flex-row" minValue={-5} maxValue={5} onChange={updateXSk3} value={matrixState.xSk3}/>
                <ValueSlider containerClass="sm:flex-row" minValue={-5} maxValue={5} onChange={updateXT} value={matrixState.xT}/>
            </div>
            <div className="flex flex-row">
                <ValueSlider containerClass="sm:flex-row" minValue={-5} maxValue={5} onChange={updateYSk} value={matrixState.ySk}/>
                <ValueSlider containerClass="sm:flex-row" minValue={-5} maxValue={5} onChange={updateYS} value={matrixState.yS}/>
                <ValueSlider containerClass="sm:flex-row" minValue={-5} maxValue={5} onChange={updateYSk3} value={matrixState.ySk3}/>
                <ValueSlider containerClass="sm:flex-row" minValue={-5} maxValue={5} onChange={updateYT} value={matrixState.yT}/>
            </div>
            <div className="flex flex-row">
                <ValueSlider containerClass="sm:flex-row" minValue={-5} maxValue={5} onChange={updateZSk} value={matrixState.zSk}/>
                <ValueSlider containerClass="sm:flex-row" minValue={-5} maxValue={5} onChange={updateZSk3} value={matrixState.zSk3}/>
                <ValueSlider containerClass="sm:flex-row" minValue={-5} maxValue={5} onChange={updateZS} value={matrixState.zS}/>
                <ValueSlider containerClass="sm:flex-row" minValue={-5} maxValue={5} onChange={updateZT} value={matrixState.zT}/>
            </div>
            <div className="flex flex-row">
                <ValueSlider containerClass="sm:flex-row" minValue={-5} maxValue={5} onChange={updateSkY} value={matrixState.skY}/>
                <ValueSlider containerClass="sm:flex-row" minValue={-5} maxValue={5} onChange={updateSkX} value={matrixState.skX}/>
                <ValueSlider containerClass="sm:flex-row" minValue={-5} maxValue={5} onChange={updateSkZ} value={matrixState.skZ}/>
                <ValueSlider containerClass="sm:flex-row" minValue={-5} maxValue={5} onChange={updateWS} value={matrixState.wS}/>
            </div>
        </div>
    </>
}

function Scene({props, matrix}: {props?: JSX.IntrinsicElements['group'], matrix: MatrixState}) {
    const texture = useTexture('/bubbles.png')
    return <>
        <mesh position={[-1.5, -0.5, 0]}>
            <planeGeometry args={[2, 2]}/>
            <HoverShader
                uTime={0}
                xS={matrix.xS}
                xSk={matrix.xSk}
                xSk3={matrix.xSk3}
                xT={matrix.xT}
                ySk={matrix.ySk}
                yS={matrix.yS}
                ySk3={matrix.ySk3}
                yT={matrix.yT}
                zSk={matrix.zSk}
                zSk3={matrix.zSk3}
                zS={matrix.zS}
                zT={matrix.zT}
                skY={matrix.skY}
                skX={matrix.skX}
                skZ={matrix.skZ}
                wS={matrix.wS}
                uTexture={texture}/>
        </mesh>
        <mesh position={[1.5, -0.5, 0]}>
            <boxGeometry args={[2, 2, 2]}/>
            <HoverShader
                uTime={0}
                xS={matrix.xS}
                xSk={matrix.xSk}
                xSk3={matrix.xSk3}
                xT={matrix.xT}
                ySk={matrix.ySk}
                yS={matrix.yS}
                ySk3={matrix.ySk3}
                yT={matrix.yT}
                zSk={matrix.zSk}
                zSk3={matrix.zSk3}
                zS={matrix.zS}
                zT={matrix.zT}
                skY={matrix.skY}
                skX={matrix.skX}
                skZ={matrix.skZ}
                wS={matrix.wS}
                uTexture={texture}/>
        </mesh>
    </>
}
