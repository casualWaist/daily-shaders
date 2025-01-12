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

const VolumeShaderImp = shaderMaterial({
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

extend({ VolumeShaderImp })

declare global {
    namespace JSX {
        interface IntrinsicElements {
            volumeShaderImp: MaterialNode<any, typeof THREE.MeshStandardMaterial>
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

const VolumeShader = forwardRef(({...props}: Props, ref) => {
    const localRef = useRef<Props>(null!)
    useImperativeHandle(ref, () => ({ shaderImp: localRef.current }))
    useFrame((state, delta) => {
        localRef.current.uTime += delta
        localRef.current.uCameraPos = state.camera.position
    })
    return <volumeShaderImp key={VolumeShaderImp.key} ref={localRef} attach="material" {...props} />
})
VolumeShader.displayName = 'VolumeShader'

export default function Page() {
    return <div className="flex items-center justify-center pt-32">
        <div className="flex justify-center items-center bg-amber-300"
             style={{clipPath: "path('M 0 0 L 377.1619873046875 283.802001953125 L 375.0469970703125 411.1820068359375 L 180.5659942626953 366.3609924316406 Z')"}}>
            <Canvas style={{position: "absolute", top: "0", zIndex: "-1", backgroundColor: "#b79b60"}}>
                <Scene/>
                <Float>
                    <Html position={[0, -1.5, 1]}
                          center
                          transform
                          as="h1"
                          className={caveat.className}
                          scale={0.25}>
                        <div style={{transform: 'scale(4)', color: "#b79b60"}}>
                            The Floor is...
                        </div>
                    </Html>
                </Float>
                <OrbitControls/>
            </Canvas>

            <div className="flex flex-col gap-4">
                <h1 className="text-4xl">The Floor is...</h1>
                <p className="text-2xl">A 3D shader effect using Three.js and React Three Fiber</p>
                <p className="text-2xl">Created by <a href="https://twitter.com/0xca0a"
                                                      className="text-blue-400">0xca0a</a></p>
            </div>
        </div>
    </div>
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
        <VolumeShader ref={shaderRef}
                         uTime={0}
                         uTexture={texture}
                         transparent
                         depthTest={false}
                         depthWrite={false}
                         uColor={new THREE.Color(0.75, 0.75, 0.75)} />
    </mesh>
}
