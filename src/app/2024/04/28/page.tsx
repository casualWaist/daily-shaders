 'use client'

import {Canvas, extend, MaterialNode, MaterialProps, useFrame, useThree} from "@react-three/fiber"
import {
    Float,
    Html,
    shaderMaterial,
    OrbitControls,
    useTexture,
    Instance,
    Instances,
    Environment
} from "@react-three/drei"
import { Caveat } from "next/font/google"
import fragment from './fragment.glsl'
import vertex from './vertex.glsl'
import * as THREE from 'three'
import React, {forwardRef, useImperativeHandle, useMemo, useRef} from "react"
 import {
    AdditiveBlending,
    DynamicDrawUsage, LineSegments, PerspectiveCamera, Points,
    Spherical,
    Vector3
} from "three"

const caveat = Caveat({
    subsets: ['latin'],
    variable: '--font-caveat'
})

const NotAShaderImp = shaderMaterial({
    uTime: 0,
    uMouse: new THREE.Vector2(0, 0),
    uSize: new THREE.Vector2(1, 1),
    uTexture: new THREE.Texture(),
    uRayOrigin: new THREE.Vector3(0, 0, 0),
    uColor: new THREE.Color(0.125, 0.0, 0.5),
    uResolution: typeof window !== 'undefined' ? new THREE.Vector2(window.innerWidth, window.innerHeight) : new THREE.Vector2(1, 1),
}, vertex, fragment, (imp) => { if (imp) {
    //imp.wireframe = true
} })

extend({ NotAShaderImp })

declare global {
    namespace JSX {
        interface IntrinsicElements {
            notAShaderImp: MaterialNode<any, typeof THREE.MeshStandardMaterial>
        }
    }
}

export type NotAShaderUniforms = {
    uTime: number
    uMouse?: THREE.Vector2
    uSize?: THREE.Vector2
    uTexture?: THREE.Texture
    uRayOrigin?: THREE.Vector3
    uResolution?: THREE.Vector2
    uColor?: THREE.Color
}

type Props = NotAShaderUniforms & MaterialProps

const NotAShader = forwardRef<NotAShaderUniforms, Props>(({...props}: Props, ref) => {
    const localRef = useRef<Props>(null!)
    useImperativeHandle(ref, () => localRef.current)
    useFrame((state, delta) => {
        localRef.current.uTime += delta
        localRef.current.uMouse = state.pointer
        localRef.current.uRayOrigin = state.camera.position
    })
    return <notAShaderImp key={NotAShaderImp.key} ref={localRef} attach="material" {...props} />
})
NotAShader.displayName = 'NotAShader'

export default function Page() {

    return <>
        <Canvas style={{position: "absolute", top: "0", zIndex: "-1"}}>
            <Scene />
            <Float>
                <Html position={[0, -2.5, 0]}
                      center
                      transform
                      as="h1"
                      className={caveat.className}
                      scale={0.25}
                >
                    <div style={{transform: 'scale(4)', textAlign: 'center', pointerEvents: 'none'}}>
                        Network of<br/>Shhhhh...
                    </div>
                </Html>
            </Float>
            <OrbitControls/>
            <Environment preset="warehouse" />
        </Canvas>
    </>
}

 function Scene() {

    const count = useRef(500);
    const connDist = useRef(150);
    const maxConnections = useRef(20);
    const segsRef = useRef<LineSegments>(null!);
    const instancesRef = useRef<THREE.InstancedMesh>(null!);
    const instanceRefs = useRef<THREE.Mesh[]>([]);
    const instances = useRef<React.ReactNode[]>([]);
    const brandColors = useRef(["#744f42", "#a7715f", "#c19b8f", "#d3b8af", "#ede2df"]);

    const [
        particleData,
        positions,
        segments,
        colors
    ] = useMemo(() => {
        const data = [];
        const poses = new Float32Array(count.current * 3)
        const segs = new Float32Array(count.current * count.current * 3)
        const cols = new Float32Array(count.current * count.current * 3)
        for (let i = 0; i < count.current; i++) {
            const spherical = new Spherical(
                -400 + Math.random() * 800,
                Math.random() * Math.PI,
                2 * Math.PI * Math.random()
            )
            const pos = new Vector3().setFromSpherical(spherical);
            const velocity = new Vector3(
                -1 + Math.random() * 2,
                -1 + Math.random() * 2,
                -1 + Math.random() * 2
            );
            data.push({velocity, numConnections: 0});
            instances.current.push(
                <Instance // @ts-ignore
                    ref={(ref) => instanceRefs.current[i] = ref as THREE.Mesh}
                    key={`Instance-${i}`}
                    color={brandColors.current[i % 5]}
                    rotation={[Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI]}
                    position={pos}
                />)
            poses[i * 3] = pos.x;
            poses[i * 3 + 1] = pos.y;
            poses[i * 3 + 2] = pos.z;
        }
        return [data, poses, segs, cols];
    }, []);

    useFrame(() => {
        let vertexpos = 0;
        let colorpos = 0;
        let numConnected = 0;

        for (let a = 0; a < count.current; a++) particleData[a].numConnections = 0;

        for (let i = 0; i < count.current; i++) {

            const seekerData = particleData[i];
            const seeker = new Vector3(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);

            positions[i * 3] += seekerData.velocity.x;
            positions[i * 3 + 1] += seekerData.velocity.y;
            positions[i * 3 + 2] += seekerData.velocity.z;

            instanceRefs.current[i].position.set(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2])

            if (seeker.length() > 400) {
                const normal = seeker.clone().normalize();
                seekerData.velocity = seekerData.velocity.clone()
                    .sub(normal.multiplyScalar(normal.dot(seekerData.velocity)));
            }

            for (let j = i + 1; j < count.current; j++) {

                const testData = particleData[j];
                if (testData.numConnections >= maxConnections.current || seekerData.numConnections >= maxConnections.current) continue;
                const test = new Vector3(positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2]);
                const dist = seeker.distanceTo(test);

                if (dist < connDist.current) {
                    seekerData.numConnections++;
                    testData.numConnections++;
                    const alpha = dist / connDist.current + 0.1;
                    segments[vertexpos++] = positions[i * 3];
                    segments[vertexpos++] = positions[i * 3 + 1];
                    segments[vertexpos++] = positions[i * 3 + 2];
                    segments[vertexpos++] = positions[j * 3];
                    segments[vertexpos++] = positions[j * 3 + 1];
                    segments[vertexpos++] = positions[j * 3 + 2];

                    colors[colorpos++] = alpha + 0.6549;  // light .7922, default .6549, lighter .8275
                    colors[colorpos++] = alpha + 0.4431;  // light .6666, default .4431, lighter .7216
                    colors[colorpos++] = alpha + 0.3725;  // light .6235, default .3725, lighter .6863

                    colors[colorpos++] = alpha - 0.5137;
                    colors[colorpos++] = alpha - 0.5216;
                    colors[colorpos++] = alpha - 0.651;
                    numConnected++;
                }
            }
        }

        segsRef.current.geometry.setDrawRange(0, numConnected * 2);
        segsRef.current.geometry.attributes.position.needsUpdate = true;
        segsRef.current.geometry.attributes.color.needsUpdate = true;

    })

    return <>

        {/* @ts-ignore */}
        <Instances ref={instancesRef} limit={500} range={500}>
            <torusKnotGeometry args={[4, 2, 64, 12]} />
            <meshPhysicalMaterial
                roughness={1}
                metalness={1}
                clearcoat={0.08}
                clearcoatRoughness={0.25}
                /*emissive={"#c19b8f"}*/
            />
            {...instances.current}
        </Instances>

        <lineSegments ref={segsRef}>
            <bufferGeometry drawRange={{start: 0, count: 0}}>
                <bufferAttribute
                    attach="attributes-position"
                    count={segments.length / 3}
                    array={segments}
                    itemSize={3}
                    usage={DynamicDrawUsage}
                />
                <bufferAttribute
                    attach="attributes-color"
                    count={segments.length / 3}
                    array={colors}
                    itemSize={3}
                    usage={DynamicDrawUsage}
                />
            </bufferGeometry>
            <lineBasicMaterial
                blending={AdditiveBlending}
                transparent
                vertexColors
            />
        </lineSegments>
    </>
}
