'use client'

import {Canvas, extend, MaterialNode, MaterialProps, useFrame} from "@react-three/fiber"
import {
    Float,
    Html,
    OrbitControls,
    useGLTF,
    Outlines, Instances, Instance, shaderMaterial, OrthographicCamera, Lightformer, Environment, useTexture
} from "@react-three/drei"
import { Caveat } from "next/font/google"
import * as THREE from 'three'
import {GLTF} from "three-stdlib"
import React, {forwardRef, useImperativeHandle, useRef} from "react"
import vertex from "@/app/2024/12/06/vertex.glsl"
import fragment from "@/app/2024/12/06/fragment.glsl"

const caveat = Caveat({
    subsets: ['latin'],
    variable: '--font-caveat'
})

const CustomMatcapGlassImp = shaderMaterial({
    uTime: 0,
    uPositions: new THREE.DataTexture(),
    uMouse: new THREE.Vector2(0, 0),
    uPoints: [0.5, 0.5, 0.5],
    uCamera: new THREE.Vector3(0, 0, 5),
    uFocus: 5.0,
    uSize: new THREE.Vector2(1, 1),
    matcap: new THREE.Texture(),
    uColor: new THREE.Color(0.83, 0.74, 0.55),
    uResolution: typeof window !== 'undefined' ? new THREE.Vector2(window.innerWidth, window.innerHeight) : new THREE.Vector2(1, 1),
}, vertex, fragment, (imp) => { if (imp) {
    //imp.wireframe = true
    //imp.side = THREE.DoubleSide
    //imp.depthWrite = false
    //imp.blending = THREE.AdditiveBlending
} })

extend({ CustomMatcapGlassImp })

declare global {
    namespace JSX {
        interface IntrinsicElements {
            customMatcapGlassImp: MaterialNode<any, typeof THREE.MeshStandardMaterial>
        }
    }
}

export type CustomMatcapGlassUniforms = {
    uTime?: number
    uPositions?: THREE.DataTexture
    uMouse?: THREE.Vector2
    uPoints?: number[]
    uCamera?: THREE.Vector3
    uFocus?: number
    uSize?: THREE.Vector2
    matcap?: THREE.Texture
    uResolution?: THREE.Vector2
    uColor?: THREE.Color
}

type Props = CustomMatcapGlassUniforms & MaterialProps

const CustomMatcapGlass = forwardRef(({ ...props }: Props, ref) => {
    const localRef = useRef<THREE.ShaderMaterial & {
        uTime: number, uMouse: THREE.Vector2, uColor:THREE.Color, uResolution?: THREE.Vector2}>(null!)

    useImperativeHandle(ref, () => localRef.current)

    useFrame((_, delta) => {
        localRef.current.uTime += delta
    })
    return <customMatcapGlassImp key={CustomMatcapGlassImp.key} ref={localRef} {...props} attach='material' />
})
CustomMatcapGlass.displayName = 'CustomMatcapGlass'

export default function Page() {
    const positions = [2, 0, 2, 0, 2, 0, 2, 0]

    return <Canvas style={{position: "absolute", top: "0", zIndex: "-1", backgroundColor: '#03232C'}}>
        <Omnia/>
        {/*<directionalLight intensity={15.5} position={[1, 10, 1]} />
        <directionalLight intensity={4.5} position={[3, -5, -4]} color={'#bd9962'} />*/}
        <spotLight intensity={10} position={[0, 0.5, 0]} angle={0.5} penumbra={0.9} rotation={[Math.PI * 0.25, 0, 0]} color={'#00ffda'} />
            <Float>
            <Html position={[0, -2, 0]}
                  center
                  transform
                  as="h1"
                  className={caveat.className}
                  scale={0.25}
            >
                <div style={{transform: 'scale(4)', textAlign: 'center', pointerEvents: 'none'}}>
                    Pointer Light
                </div>
            </Html>
        </Float>
        <Environment>
            <Lightformer intensity={1.75} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={[10, 10, 1]} />
            <group rotation={[0, 0.5, 0]}>
                <group>
                    {positions.map((x, i) => (
                        <Lightformer key={i} form="circle" color={'#001f27'} intensity={2} rotation={[Math.PI / 2, 0, 0]} position={[x, 4, i * 4]} scale={[3, 1, 1]} />
                    ))}
                </group>
            </group>
            <Lightformer intensity={4} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={[20, 0.1, 1]} />
            <Lightformer rotation-y={Math.PI / 2} position={[-5, -1, -1]} scale={[20, 0.5, 1]} />
            <Lightformer rotation-y={-Math.PI / 2} position={[10, 1, 0]} scale={[20, 1, 1]} />
            <Float speed={5} floatIntensity={2} rotationIntensity={2}>
                <Lightformer form="ring" color="#00ffda" intensity={10} scale={10} position={[-15, 4, -18]} target={[0, 0, 0]} />
            </Float>
        </Environment>
        <OrbitControls />
    </Canvas>
}


type GLTFResult = GLTF & {
    nodes: {
        belt: THREE.Mesh
        floor: THREE.Mesh
        roller: THREE.Mesh
        screen: THREE.Mesh
        lasers: THREE.Mesh
        glow: THREE.Mesh
        decor: THREE.Mesh
        green: THREE.Mesh
        white: THREE.Mesh
        token: THREE.Mesh
    }
    materials: {}
}

function Omnia( props: JSX.IntrinsicElements['group']) {
    const { nodes } = useGLTF('/Omnia1.glb') as GLTFResult
    const matCap = useTexture('/glass.png')
    const points = [];
    const radius = 1;
    const height = 0.1;
    const edgeRadius = 0.05;

    // Create the profile of the coin with rounded edges
    points.push(new THREE.Vector2(radius, 0));
    points.push(new THREE.Vector2(radius, height - edgeRadius));
    points.push(new THREE.Vector2(radius - edgeRadius, height));
    points.push(new THREE.Vector2(edgeRadius, height));
    points.push(new THREE.Vector2(0, height - edgeRadius));
    points.push(new THREE.Vector2(0, edgeRadius));
    points.push(new THREE.Vector2(edgeRadius, 0));

    const geometry = new THREE.LatheGeometry(points, 32);

    return <group {...props} dispose={null}>
        <OrthographicCamera makeDefault zoom={200} position={[5.211, 5.66, 5.341]}
                            rotation={[-0.794, 0.6, 0.521]}/>

        <mesh geometry={nodes.belt.geometry} position={[1.175, 0, 0]}>
            <meshPhysicalMaterial
                color={'#2b2b2b'}
                reflectivity={0.5}
                roughness={0.3}
                metalness={0.7}
                envMapIntensity={1}
                specularIntensity={1}/>
        </mesh>
        {/*<mesh geometry={nodes.floor.geometry} position={[0, -0.102, 0]}>
            <meshPhysicalMaterial
                reflectivity={1}
                specularIntensity={1}
                roughness={0.1}
                transmission={10}
                ior={1.75}
                color={'#034a40'}/>
        </mesh>*/}

        <Instances geometry={nodes.roller.geometry} dispose={null}>
            <meshPhysicalMaterial color={'#4a4a4a'} />
            {Array.from({length: 250}, (_, i) =>
                <Instance key={i} position={[1.308, 0.12, -5.798 + i * 0.04]} rotation={[0, 0, -Math.PI / 2]}/>)}
        </Instances>

        <mesh geometry={nodes.screen.geometry} position={[1.346, -0.016, 0]}>
            <meshPhysicalMaterial
                color={'#ffffff'}
                ior={1.1}
                transmission={0.9}
                transparent
                side={THREE.DoubleSide}/>
        </mesh>
        <mesh geometry={nodes.lasers.geometry} material={nodes.lasers.material} position={[0.496, -0.099, 0]}
              rotation={[0, 0, -Math.PI / 2]}/>
        <mesh geometry={nodes.glow.geometry} position={[1.175, 0, 0]}>
            <meshBasicMaterial color={'#00ffda'}/>
        </mesh>

        <mesh geometry={nodes.decor.geometry} material={nodes.decor.material} position={[1.175, 0.117, 0]}/>
        <mesh geometry={nodes.green.geometry} material={nodes.green.material} position={[1.31, 0.164, 0.882]}/>
        <mesh geometry={nodes.white.geometry} material={nodes.white.material} position={[1.31, 0.226, 0.882]}/>
        <mesh geometry={nodes.token.geometry} position={[1.31, 0.48, 0.882]} rotation={[-Math.PI / 2, 0, 0]}>
            <CustomMatcapGlass matcap={matCap} transparent/>
        </mesh>
    </group>

}

useGLTF.preload('/coin.glb')
