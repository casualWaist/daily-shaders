'use client'

import {Canvas, extend, MaterialNode, useFrame, useThree} from "@react-three/fiber"
import {Float, Html, shaderMaterial, OrbitControls, useTexture} from "@react-three/drei"
import { Caveat } from "next/font/google"
import fragment from './fragment.glsl'
import vertex from './vertex.glsl'
import * as THREE from 'three'
import {forwardRef, useImperativeHandle, useRef} from "react"

const caveat = Caveat({
    subsets: ['latin'],
    variable: '--font-caveat'
})

const RainbowFireShaderImp = shaderMaterial({
    uTime: 0,
    uTexture: new THREE.Texture(),
    uColor: new THREE.Color(0xeeeeee),
    uInvModelMatrix: new THREE.Matrix4(),
    uScale: new THREE.Vector3( 2, 2, 2 ),
    uSeed: Math.random() * 19.19,
    uNoiseScale: new THREE.Vector4(0.75, 1.75, 4.25, 0.5),
    uCameraPos: new THREE.Vector3(),
    uMagnitude: 0.7,
    uLacunarity: 1.5,
    uGain: 0.9,
    uResolution: typeof window !== 'undefined' ? new THREE.Vector2(window.innerWidth, window.innerHeight) : new THREE.Vector2(1, 1),
}, vertex, fragment)

extend({ RainbowFireShaderImp })

declare global {
    namespace JSX {
        interface IntrinsicElements {
            rainbowFireShaderImp: MaterialNode<any, typeof THREE.MeshStandardMaterial>
        }
    }
}

type Props = {
    uTime: number,
    uColor: THREE.Color,
    uTexture: THREE.Texture,
    uInvModelMatrix?: THREE.Matrix4,
    uScale?: THREE.Vector3,
    uSeed?: number,
    uNoiseScale?: THREE.Vector4,
    uCameraPos?: THREE.Vector3,
    uMagnitude?: number,
    uLacunarity?: number,
    uGain?: number,
    uResolution?: THREE.Vector2
} & JSX.IntrinsicElements['meshStandardMaterial']

const RainbowFireShader = forwardRef(({...props}: Props, ref) => {
    const localRef = useRef<Props>(null!)
    useImperativeHandle(ref, () => ({ shaderImp: localRef.current }))
    useFrame((state, delta) => {
        localRef.current.uTime += delta
        localRef.current.uCameraPos = state.camera.position
    })
    return <rainbowFireShaderImp key={RainbowFireShaderImp.key} ref={localRef} attach="material" {...props} />
})
RainbowFireShader.displayName = 'RainbowFireShader'

export default function Page() {
    return <Canvas style={{position: "absolute", top: "0", zIndex: "-1", backgroundColor: "#000"}}>
        <Scene />
        <Float>
            <Html position={[0, -1.5, 1]}
                center
                transform
                as="h1"
                className={caveat.className}
                scale={0.25}>
                <div style={{transform: 'scale(4)', color: "#128"}}>
                    Searching for Nessie
                </div>
            </Html>
        </Float>
        <OrbitControls />
    </Canvas>
}

function Scene() {
    const view = useThree((state) => state.viewport)
    const texture = useTexture('/Fire.png')
    texture.magFilter = texture.minFilter = THREE.LinearFilter
    texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping
    const meshRef = useRef<THREE.Mesh>(null!)
    const shaderRef = useRef<MaterialNode<any, typeof THREE.MeshStandardMaterial>>(null!)

    useFrame(() => {
        if (shaderRef) {
            shaderRef.current.shaderImp.uInvModelMatrix.value = meshRef.current.matrix.invert();
        }
    })

    return <mesh ref={meshRef}>
        <planeGeometry args={[view.width * 0.5, view.width * 0.5]}/>
        <RainbowFireShader ref={shaderRef}
                         uTime={0}
                         uTexture={texture}
                         transparent
                         depthTest={false}
                         depthWrite={false}
                         uColor={new THREE.Color(0.75, 0.75, 0.75)} />
    </mesh>
}
