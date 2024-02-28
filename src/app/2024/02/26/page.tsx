'use client'

import {Canvas, extend, MaterialNode, MaterialProps, useFrame, useThree} from "@react-three/fiber"
import {Float, Html, shaderMaterial, OrbitControls, useTexture} from "@react-three/drei"
import { Caveat } from "next/font/google"
import fragment from './fragment.glsl'
import vertex from './vertex.glsl'
import * as THREE from 'three'
import {forwardRef, useEffect, useImperativeHandle, useRef} from "react"
import {Mesh, Vector2} from "three"

const caveat = Caveat({
    subsets: ['latin'],
    variable: '--font-caveat'
})

const PopShaderImp = shaderMaterial({
    uTime: 0,
    uTexture: new THREE.Texture(),
    uColor: new THREE.Color(0.5, 0.0, 0.025),
    uWorld: new THREE.Vector2(0, 0),
}, vertex, fragment)

extend({ PopShaderImp })

declare global {
    namespace JSX {
        interface IntrinsicElements {
            popShaderImp: MaterialNode<any, typeof THREE.MeshStandardMaterial>
        }
    }
}

export type PopShaderUniforms = {
    uTime: number
    uTexture: THREE.Texture
    uWorld?: THREE.Vector2
    uColor?: THREE.Color
}

type Props = PopShaderUniforms & MaterialProps

const PopShader = forwardRef<PopShaderUniforms, Props>(({...props}: Props, ref) => {
    const localRef = useRef<Props>(null!)
    const view = useThree((state) => state.viewport)

    useEffect(() => {
        localRef.current.uWorld = new Vector2(view.width * 0.5, view.height * 0.5)
    }, [view])

    useImperativeHandle(ref, () => localRef.current)
    useFrame((state, delta) => {
        localRef.current.uTime += delta
    })
    return <popShaderImp key={PopShaderImp.key} ref={localRef} attach="material" {...props} />
})
PopShader.displayName = 'PopShader'

export default function Page() {

    return <Canvas style={{position: "absolute", top: "0", zIndex: "-1"}}>
        <Scene />
        <Float>
            <Html position={[0, -2, 0]}
                  center
                  transform
                  as="h1"
                  className={caveat.className}
                  scale={0.25}
            >
                <div style={{transform: 'scale(4)', textAlign: 'center'}}>
                    Welcome to<br/>the FunHouse
                </div>
            </Html>
        </Float>
        <OrbitControls/>
    </Canvas>
}
function Scene() {
    const faceTex = useTexture('/bubbles.png')
    faceTex.wrapT = THREE.RepeatWrapping
    faceTex.wrapS = THREE.RepeatWrapping
    const faceRef = useRef<Mesh>(null!)
    const faceShaderRef = useRef<PopShaderUniforms>(null!)

    return <mesh ref={faceRef}>
        <planeGeometry args={[1, 1, 100, 100]}/>
        <PopShader ref={faceShaderRef} uTime={0} transparent uTexture={faceTex}/>
    </mesh>
}
