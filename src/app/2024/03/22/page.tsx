 'use client'

import {Canvas, extend, MaterialNode, MaterialProps, useFrame, useThree} from "@react-three/fiber"
import {Float, Html, shaderMaterial, OrbitControls, useTexture} from "@react-three/drei"
import { Caveat } from "next/font/google"
import fragment from './fragment.glsl'
import vertex from './vertex.glsl'
import atmosFragment from '../23/fragment.glsl'
import atmosVertex from '../23/vertex.glsl'
import * as THREE from 'three'
import React, {forwardRef, useEffect, useImperativeHandle, useRef} from "react"


 const AtmosphereShaderImp = shaderMaterial({
     uTime: 0,
     uMouse: new THREE.Vector2(0, 0),
     uSize: new THREE.Vector2(1, 1),
     uSunDirection: new THREE.Vector3(0, 0, 1),
     uAtmosphereDayColor: new THREE.Color(),
     uAtmosphereTwilightColor: new THREE.Color(),
     uRayOrigin: new THREE.Vector3(0, 0, 0),
     uColor: new THREE.Color(0.125, 0.0, 0.5),
     uResolution: typeof window !== 'undefined' ? new THREE.Vector2(window.innerWidth, window.innerHeight) : new THREE.Vector2(1, 1),
 }, atmosVertex, atmosFragment, (imp) => { if (imp) {
     //imp.wireframe = true
 } })

 extend({ AtmosphereShaderImp })

 declare global {
     namespace JSX {
         interface IntrinsicElements {
             atmosphereShaderImp: MaterialNode<any, typeof THREE.MeshStandardMaterial>
         }
     }
 }

 export type AtmosphereShaderUniforms = {
     uTime: number
     uMouse?: THREE.Vector2
     uSize?: THREE.Vector2
     uSunDirection?: THREE.Vector3
     uAtmosphereDayColor?: THREE.Color
     uAtmosphereTwilightColor?: THREE.Color
     uRayOrigin?: THREE.Vector3
     uResolution?: THREE.Vector2
     uColor?: THREE.Color
 }

 type AProps = AtmosphereShaderUniforms & MaterialProps

 const AtmosphereShader = forwardRef<AtmosphereShaderUniforms, AProps>(({...props}: AProps, ref) => {
     const localRef = useRef<AProps>(null!)
     useImperativeHandle(ref, () => localRef.current)
     useFrame((state, delta) => {
         localRef.current.uTime += delta
         localRef.current.uMouse = state.pointer
         localRef.current.uRayOrigin = state.camera.position
     })
     return <atmosphereShaderImp key={AtmosphereShaderImp.key} ref={localRef} attach="material" {...props} />
 })
 AtmosphereShader.displayName = 'AtmosphereShader'


 const caveat = Caveat({
    subsets: ['latin'],
    variable: '--font-caveat'
})

const EarthShaderImp = shaderMaterial({
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

extend({ EarthShaderImp })

declare global {
    namespace JSX {
        interface IntrinsicElements {
            earthShaderImp: MaterialNode<any, typeof THREE.MeshStandardMaterial>
        }
    }
}

export type EarthShaderUniforms = {
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

type Props = EarthShaderUniforms & MaterialProps

const EarthShader = forwardRef<EarthShaderUniforms, Props>(({...props}: Props, ref) => {
    const localRef = useRef<Props>(null!)
    useImperativeHandle(ref, () => localRef.current)
    useFrame((state, delta) => {
        localRef.current.uTime += delta
        localRef.current.uMouse = state.pointer
        localRef.current.uRayOrigin = state.camera.position
    })
    return <earthShaderImp key={EarthShaderImp.key} ref={localRef} attach="material" {...props} />
})
EarthShader.displayName = 'EarthShader'

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
                        Homie
                    </div>
                </Html>
            </Float>
            <OrbitControls/>
        </Canvas>
    </>
}

function Scene({props}: {props?: JSX.IntrinsicElements['mesh']}) {
    const view = useThree((state) => state.viewport)
    const shader = useRef<EarthShaderUniforms>(null!)
    const day = useTexture('/day.jpg')
    const night = useTexture('/night.jpg')
    const specularClouds = useTexture('/specularClouds.jpg')

    useEffect(() => {
        shader.current.uResolution = new THREE.Vector2(window.innerWidth, window.innerHeight)
    }, [view])

    return <>
        <mesh {...props}>
            <sphereGeometry args={[1, 32, 32]}/>
            <EarthShader
                ref={shader}
                uTime={0}
                uSize={new THREE.Vector2(view.width, view.height)}
                uDayTexture={day}
                uNightTexture={night}
                uSpecularCloudsTexture={specularClouds}
                uAtmosphereTwilightColor={new THREE.Color(1, 0.35, 0.0)}
                uAtmosphereDayColor={new THREE.Color(0.0, 0.3, 1)}
            />
        </mesh>
        <mesh {...props}>
            <sphereGeometry args={[1.05, 64, 64]}/>
            <AtmosphereShader
                ref={shader}
                side={THREE.BackSide}
                transparent
                uTime={0}
                uSize={new THREE.Vector2(view.width, view.height)}
                uAtmosphereTwilightColor={new THREE.Color(1, 0.35, 0.0)}
                uAtmosphereDayColor={new THREE.Color(0.0, 0.3, 1)}
            />
        </mesh>
    </>
}
