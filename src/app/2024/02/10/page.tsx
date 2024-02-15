'use client'

import {Canvas, MaterialNode} from "@react-three/fiber"
import * as THREE from 'three'
import { extend, useFrame } from '@react-three/fiber'
import {Float, Html, OrbitControls, shaderMaterial, Sphere, useFBO} from '@react-three/drei'
import vertex from './vertex.glsl'
import fragment from './fragment.glsl'
import {forwardRef, useEffect, useImperativeHandle, useRef} from 'react'
import {Caveat} from "next/font/google"

const caveat = Caveat({
    subsets: ['latin'],
    variable: '--font-caveat'
})

const Wiper = shaderMaterial({
        uTime: 0,
        uTexture: new THREE.Texture(),
        vLastPos: new THREE.Vector3(4, -4, 3),
        uColor: new THREE.Color(0.5, 0.0, 0.025),
        // this ternary is necessary because SSR
        uResolution: typeof window !== 'undefined' ? new THREE.Vector2(window.innerWidth, window.innerHeight) : new THREE.Vector2(1, 1),
    },
    vertex,
    fragment,
)

type Props = MaterialNode<any, any> & {
    uTime?: number,
    uTexture?: THREE.Texture,
    uColor?: THREE.Color,
    uResolution?: THREE.Vector2
}
extend({ Wiper })

declare module "@react-three/fiber" {
    interface ThreeElements {
        wiper: MaterialNode<any, any>
    }
}

const WiperCube = forwardRef(({ ...props }: Props, ref) => {
    const localRef = useRef<THREE.ShaderMaterial &
        {uTime: number, uTexture: THREE.Texture, uColor:THREE.Color, uResolution?: THREE.Vector2}>(null!)
    const mainRenderTarget = useFBO()
    const meshRef = useRef<THREE.Mesh>(null!)

    useImperativeHandle(ref, () => localRef.current)

    useEffect(() => {
        localRef.current.transparent = true
    }, [])

    useFrame((state, delta) => {
        const { gl, scene, camera } = state
        localRef.current.uTime += delta
        meshRef.current.visible = false
        gl.setRenderTarget(mainRenderTarget)
        // Render into the FBO
        gl.render(scene, camera)

        // Pass the texture data to our shader material
        localRef.current.uTexture = mainRenderTarget.texture

        gl.setRenderTarget(null)
        // Show the mesh
        meshRef.current.visible = true
    })
    return <mesh ref={meshRef} position={[0, 1, 0]}>
        <sphereGeometry args={[2, 32, 32]}/>
        <wiper key={Wiper.key} ref={localRef} {...props} attach='material'/>
    </mesh>
})
WiperCube.displayName = 'Shader'

export default function Page() {
    return <Canvas style={{position: "absolute", top: "0", zIndex: "-1"}}>
        <WiperCube />
        <Background />
        <Float>
            <Html position={[0, -1.5, 1]}
                  center transform as="h1" className={caveat.className} scale={0.25}>
                <div style={{ transform: 'scale(4)', textAlign: 'center' }}>
                    TIL Glass is hard
                </div>
            </Html>
        </Float>
        <OrbitControls />
    </Canvas>
}

function Background() {
    const groupRef = useRef<THREE.Group>(null!)
    useFrame(() => {
        groupRef.current.rotation.y += 0.01
    })
    return <group ref={groupRef} position={[0, 0, -4]}>
        <Sphere args={[1, 32, 32]} position={[-1, 1, 0]}>
            <meshBasicMaterial color="#199474"/>
        </Sphere>
        <Sphere args={[1, 32, 32]} position={[1, 1, 0]}>
            <meshBasicMaterial color="#f3aa6e"/>
        </Sphere>
    </group>
}
