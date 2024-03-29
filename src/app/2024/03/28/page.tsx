'use client'

import {Canvas, extend, MaterialNode, MaterialProps, useFrame, useThree} from "@react-three/fiber"
import {Float, Html, shaderMaterial, OrbitControls, useTexture} from "@react-three/drei"
import { Caveat } from "next/font/google"
import fragment from './fragment.glsl'
import vertex from './vertex.glsl'
import * as THREE from 'three'
import {forwardRef, useEffect, useImperativeHandle, useRef} from "react"

const caveat = Caveat({
    subsets: ['latin'],
    variable: '--font-caveat'
})

const MorphShaderImp = shaderMaterial({
    uTime: 0,
    uProgress: 0,
    uSize: 50,
    uTexture: new THREE.Texture(),
    uRayOrigin: new THREE.Vector3(0, 0, 0),
    uColor: new THREE.Color(0.5, 0.0, 0.025),
    uResolution: typeof window !== 'undefined' ? new THREE.Vector2(window.innerWidth, window.innerHeight) : new THREE.Vector2(1, 1),
}, vertex, fragment)

extend({ MorphShaderImp })

declare global {
    namespace JSX {
        interface IntrinsicElements {
            morphShaderImp: MaterialNode<any, typeof THREE.PointsMaterial>
        }
    }
}

export type MorphShaderUniforms = {
    uTime: number,
    uProgress: number,
    uSize: number,
    uTexture: THREE.Texture,
    uRayOrigin?: THREE.Vector3,
    uResolution?: THREE.Vector2
    uColor?: THREE.Color
}

type Props = MorphShaderUniforms & MaterialProps

const MorphShader = forwardRef<MorphShaderUniforms, Props>(
    ({...props}: Props, ref) => {
    const localRef = useRef<Props>(null!)
    const size = useThree((state) => state.size)
    useImperativeHandle(ref, () => localRef.current)

    useEffect(() => {
        localRef.current.uResolution = new THREE.Vector2(size.width, size.height)
    }, [size])

    useFrame((state, delta) => {
        localRef.current.uTime += delta
        localRef.current.uRayOrigin = state.camera.position
        if (localRef.current && localRef.current.uProgress < 1) localRef.current.uProgress += delta
    })

    return <morphShaderImp key={MorphShaderImp.key} ref={localRef} attach="material" {...props} />
})
MorphShader.displayName = 'MorphShader'

export default function Page() {

    return <Canvas style={{position: "absolute", top: "0", zIndex: "-1"}} className="bg-slate-950">
        <Scene />
        <Float>
            <Html position={[0, -2, 0]}
                  center
                  transform
                  as="h1"
                  className={caveat.className}
                  scale={0.25}
            >
                <div style={{transform: 'scale(4)', textAlign: 'center', color: "white"}}>
                    It's Morphin' Time!
                </div>
            </Html>
        </Float>
        <OrbitControls/>
    </Canvas>
}
function Scene() {
    const faceTex = useTexture('/7.png')
    faceTex.flipY = false
    const faceRef = useRef<THREE.Points>(null!)
    const faceShaderRef = useRef<MorphShaderUniforms>(null!)
    const count = 1000
    const cubeN = 1
    const positions = new Float32Array(count * 3)
    const bPositions = new Float32Array(count * 3)
    const sizes = new Float32Array(count)
    const times = new Float32Array(count)
    for (let i = 0; i < count; i++) {

        const i3 = i * 3
        const dir = ['x', 'y', 'z'][i % 3]

        const randX = Math.random() * cubeN * 2 - cubeN
        const randY = Math.random() * cubeN * 2 - cubeN
        const randZ = Math.random() * cubeN * 2 - cubeN
        switch (dir) {
            case 'x':
                bPositions[i3] = i > count * 0.5 ? cubeN : -cubeN
                bPositions[i3 + 1] = randY
                bPositions[i3 + 2] = randZ
                break
            case 'y':
                bPositions[i3] = randX
                bPositions[i3 + 1] = i > count * 0.5 ? cubeN : -cubeN
                bPositions[i3 + 2] = randZ
                break
            case 'z':
                bPositions[i3] = randX
                bPositions[i3 + 1] = randY
                bPositions[i3 + 2] = i > count * 0.5 ? cubeN : -cubeN
                break
        }

        const spherical = new THREE.Spherical(
            2.75 + Math.random() * 0.25, Math.random() * Math.PI, 2 * Math.PI * Math.random()
        )
        const position = new THREE.Vector3()
        position.setFromSpherical(spherical)
        positions[i3] = position.x
        positions[i3 + 1] = position.y
        positions[i3 + 2] = position.z

        sizes[i] = Math.random() * 0.5
        times[i] = 1 + Math.random()
    }

    useEffect(() => {
        window.addEventListener('click', () => {
            if (faceShaderRef.current) faceShaderRef.current.uProgress = 0
        })
    }, [])

    return <points ref={faceRef}>
        <bufferGeometry>
            <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3}/>
            <bufferAttribute attach="attributes-bPosition" count={count} array={bPositions} itemSize={3}/>
            <bufferAttribute attach="attributes-aSize" count={count} array={sizes} itemSize={1}/>
            <bufferAttribute attach="attributes-aTime" count={count} array={times} itemSize={1}/>
        </bufferGeometry>
        <MorphShader
            ref={faceShaderRef}
            uSize={0.5}
            uTime={0}
            uProgress={0}
            uColor={new THREE.Color(0.3, 0.7, 1)}
            transparent
            depthTest={false}
            blending={THREE.AdditiveBlending}
            uTexture={faceTex}
        />
    </points>
}
