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

const WorldStripeShaderImp = shaderMaterial({
    uTime: 0,
    uTexture: new THREE.Texture(),
    uMouse: new THREE.Vector2(),
    uColor: new THREE.Color(0xeeeeee),
    uCameraPos: new THREE.Vector3(),
    uResolution: typeof window !== 'undefined' ? new THREE.Vector2(window.innerWidth, window.innerHeight) : new THREE.Vector2(1, 1),
}, vertex, fragment)

extend({ WorldStripeShaderImp })

declare global {
    namespace JSX {
        interface IntrinsicElements {
            worldStripeShaderImp: MaterialNode<any, typeof THREE.MeshStandardMaterial>
        }
    }
}

type Props = {
    uTime: number,
    uColor: THREE.Color,
    uMouse?: THREE.Vector2,
    uTexture: THREE.Texture,
    uCameraPos?: THREE.Vector3,
    uResolution?: THREE.Vector2
} & JSX.IntrinsicElements['meshStandardMaterial']

const WorldStripeShader = forwardRef(({...props}: Props, ref) => {
    const localRef = useRef<Props>(null!)
    useImperativeHandle(ref, () => ({ shaderImp: localRef.current }))
    useFrame((state, delta) => {
        localRef.current.uTime += delta
        localRef.current.uCameraPos = state.camera.position
        localRef.current.uMouse = state.pointer
    })
    return <worldStripeShaderImp key={WorldStripeShaderImp.key} ref={localRef} attach="material" {...props} />
})
WorldStripeShader.displayName = 'WorldStripeShader'

export default function Page() {
    return <Canvas style={{position: "absolute", top: "0", zIndex: "-1", backgroundColor: "rgb(58,191,203)"}}>
        <Scene />
        <Float>
            <Html position={[0, -1.5, 1]}
                center
                transform
                as="h1"
                className={caveat.className}
                scale={0.25}>
                <div style={{transform: 'scale(4)', color: "#128"}}>
                    Data World
                </div>
            </Html>
        </Float>
        <OrbitControls />
    </Canvas>
}

function Scene() {
    const view = useThree((state) => state.viewport)
    const texture = useTexture('/world_black_on_trans.png')
    texture.magFilter = texture.minFilter = THREE.LinearFilter
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping
    const meshRef = useRef<THREE.Mesh>(null!)
    const shaderRef = useRef<MaterialNode<any, typeof THREE.MeshStandardMaterial>>(null!)

    return <mesh ref={meshRef}>
        <sphereGeometry args={[view.width, 128, 128]}/>
        <WorldStripeShader ref={shaderRef}
                           uTime={0}
                           uTexture={texture}
                           transparent
                           depthTest={false}
                           depthWrite={false}
                           side={THREE.DoubleSide}
                           uColor={new THREE.Color(0.75, 0.75, 0.75)} />
    </mesh>
}
