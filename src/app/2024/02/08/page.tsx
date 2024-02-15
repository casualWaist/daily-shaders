'use client'

import {Canvas, MaterialNode, useThree} from "@react-three/fiber"
import * as THREE from 'three'
import { extend, useFrame } from '@react-three/fiber'
import {Float, Html, OrbitControls, shaderMaterial} from '@react-three/drei'
import vertex from './vertex.glsl'
import fragment from './fragment.glsl'
import {forwardRef, useEffect, useImperativeHandle, useRef} from 'react'
import {Caveat} from "next/font/google"

const caveat = Caveat({
    subsets: ['latin'],
    variable: '--font-caveat'
})

const People = shaderMaterial({
        uTime: 0,
        uColor: new THREE.Color(0.5, 0.0, 0.025),
        uMouse: new THREE.Vector2(0.5, 0.5),
        // this ternary is necessary because SSR
        uResolution: typeof window !== 'undefined' ? new THREE.Vector2(window.innerWidth, window.innerHeight) : new THREE.Vector2(1, 1),
    },
    vertex,
    fragment,
)

type Props = MaterialNode<any, any> & { uTime?: number, uColor?: THREE.Color, uResolution?: THREE.Vector2 }
extend({ People })
declare module "@react-three/fiber" {
    interface ThreeElements {
        people: MaterialNode<any, any>
    }
}

const Shader = forwardRef(({ ...props }: Props, ref) => {
    const localRef = useRef<THREE.ShaderMaterial & {
        uTime: number, uMouse: THREE.Vector2, uColor:THREE.Color, uResolution?: THREE.Vector2}>(null!)
    const {viewport, camera} = useThree((state) => state)

    useImperativeHandle(ref, () => localRef.current)
    let vec = new THREE.Vector3()
    let pos = new THREE.Vector3()

    // #transformMouseCoordinates #pointerCoordinates #mouseCoordinates
    const mouseMove = (e: MouseEvent) => {
        vec.set(
            ( e.clientX / window.innerWidth ) * 2 - 1,
            - ( e.clientY / window.innerHeight ) * 2 + 1,
            0.5,
        )
        vec.unproject( camera )
        vec.sub( camera.position ).normalize()

        const distance = - camera.position.z / vec.z
        pos.copy( camera.position ).add( vec.multiplyScalar( distance ) )
        localRef.current.uMouse = new THREE.Vector2(( e.clientX / window.innerWidth ) * 2, - ( e.clientY / window.innerHeight ) * 2 + 2)
    }

    useEffect(() => {
        window.addEventListener('mousemove', mouseMove)
        return () => window.removeEventListener('mousemove', mouseMove)
    }, [])

    useEffect(() => {
        localRef.current.uResolution = new THREE.Vector2(window.innerWidth, window.innerHeight)
    }, [viewport])

    useFrame((_, delta) => (localRef.current.uTime += delta))
    return <people key={People.key} ref={localRef} {...props} attach='material' />
})
Shader.displayName = 'Shader'

export default function Page() {
    return <Canvas style={{ position: "absolute", top: "0", zIndex: "-1"}}>
        <Scene />
    </Canvas>
}

function Scene(){
    const view = useThree((state) => state.viewport)
    return <>
        <mesh position={[0, 0, 0]}>
            <planeGeometry args={[view.width, view.height, 1, 1]}/>
            {/* @ts-ignore */}
            <Shader uTime={0} uColor={'grey'}/>
        </mesh>
        <OrbitControls/>
        <Float>
            <Html position={[0, -1.5, 1]}
                  center transform as="h1" className={caveat.className} scale={0.25}>
                <div style={{transform: 'scale(4)', textAlign: 'center'}}>
                    I liked it so...
                </div>
            </Html>
        </Float>
    </>
}
