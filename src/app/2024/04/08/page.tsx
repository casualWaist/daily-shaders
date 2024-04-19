 'use client'

import {Canvas, extend, MaterialNode, MaterialProps, useFrame, useThree} from "@react-three/fiber"
import {Float, Html, shaderMaterial, OrbitControls, useTexture} from "@react-three/drei"
import { Caveat } from "next/font/google"
import fragment from './fragment.glsl'
import vertex from './vertex.glsl'
import * as THREE from 'three'
import React, {forwardRef, useEffect, useImperativeHandle, useRef} from "react"


 const caveat = Caveat({
    subsets: ['latin'],
    variable: '--font-caveat'
})

const EarthHoloShaderImp = shaderMaterial({
    uTime: 0,
    uMouse: new THREE.Vector2(0, 0),
    uSize: new THREE.Vector2(1, 1),
    uDayTexture: new THREE.Texture(),
    uNightTexture: new THREE.Texture(),
    uSpecularCloudsTexture: new THREE.Texture(),
    uSunDirection: new THREE.Vector3(0, 0, 1),
    uAtmosphereDayColor: new THREE.Color(),
    uAtmosphereTwilightColor: new THREE.Color(),
    uRayOrigin: new THREE.Vector3(0, 0, 0),
    uColor: new THREE.Color(0.125, 0.0, 0.5),
    uResolution: typeof window !== 'undefined' ? new THREE.Vector2(window.innerWidth, window.innerHeight) : new THREE.Vector2(1, 1),
}, vertex, fragment, (imp) => { if (imp) {
    //imp.wireframe = true
} })

extend({ EarthHoloShaderImp })

declare global {
    namespace JSX {
        interface IntrinsicElements {
            earthHoloShaderImp: MaterialNode<any, typeof THREE.MeshStandardMaterial>
        }
    }
}

export type EarthHoloShaderUniforms = {
    uTime: number
    uMouse?: THREE.Vector2
    uSize?: THREE.Vector2
    uDayTexture?: THREE.Texture
    uNightTexture?: THREE.Texture
    uSpecularCloudsTexture?: THREE.Texture
    uSunDirection?: THREE.Vector3
    uAtmosphereDayColor?: THREE.Color
    uAtmosphereTwilightColor?: THREE.Color
    uRayOrigin?: THREE.Vector3
    uResolution?: THREE.Vector2
    uColor?: THREE.Color
}

type Props = EarthHoloShaderUniforms & MaterialProps

const EarthHoloShader = forwardRef<EarthHoloShaderUniforms, Props>(({...props}: Props, ref) => {
    const localRef = useRef<Props>(null!)
    useImperativeHandle(ref, () => localRef.current)
    useFrame((state, delta) => {
        localRef.current.uTime += delta
        localRef.current.uMouse = state.pointer
        localRef.current.uRayOrigin = state.camera.position
    })
    return <earthHoloShaderImp key={EarthHoloShaderImp.key} ref={localRef} attach="material" {...props} />
})
EarthHoloShader.displayName = 'EarthHoloShader'

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
                        HoloHomie
                    </div>
                </Html>
            </Float>
            <OrbitControls/>
        </Canvas>
    </>
}

function Scene({props}: {props?: JSX.IntrinsicElements['mesh']}) {
    const view = useThree((state) => state.viewport)
    const shader = useRef<EarthHoloShaderUniforms>(null!)
    const day = useTexture('/day.jpg')
    const night = useTexture('/night.jpg')
    const specularClouds = useTexture('/specularClouds.jpg')

    useEffect(() => {
        shader.current.uResolution = new THREE.Vector2(window.innerWidth, window.innerHeight)
    }, [view])

    return <>
        <mesh {...props}>
            <sphereGeometry args={[2, 128, 128]}/>
            <EarthHoloShader
                ref={shader}
                transparent
                side={THREE.DoubleSide}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
                uTime={0}
                uSize={new THREE.Vector2(view.width, view.height)}
                uDayTexture={day}
                uNightTexture={night}
                uSpecularCloudsTexture={specularClouds}
                uAtmosphereTwilightColor={new THREE.Color(1, 0.35, 0.0)}
                uAtmosphereDayColor={new THREE.Color(0.0, 0.3, 1)}
            />
        </mesh>
    </>
}
