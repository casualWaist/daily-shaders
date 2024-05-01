 'use client'

import {Canvas, extend, MaterialNode, MaterialProps, useFrame, useThree} from "@react-three/fiber"
import {
    Float,
    Html,
    shaderMaterial,
    OrbitControls,
    Instance,
    Instances,
    Environment
} from "@react-three/drei"
import { Caveat } from "next/font/google"
import fragment from './fragment.glsl'
import vertex from './vertex.glsl'
import * as THREE from 'three'
import React, {forwardRef, useEffect, useImperativeHandle, useMemo, useRef} from "react"
 import {
    DynamicDrawUsage,
    LineSegments,
    MeshPhysicalMaterial,
    NoBlending,
    PerspectiveCamera,
    Spherical,
    Vector3
} from "three"
 import CustomShaderMaterial from "three-custom-shader-material"
 import {Perf} from "r3f-perf"

const caveat = Caveat({
    subsets: ['latin'],
    variable: '--font-caveat'
})

const LineBasicShaderImp = shaderMaterial({
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

extend({ LineBasicShaderImp })

declare global {
    namespace JSX {
        interface IntrinsicElements {
            lineBasicShaderImp: MaterialNode<any, typeof THREE.MeshStandardMaterial>
        }
    }
}

export type LineBasicShaderUniforms = {
    uTime?: number
    uMouse?: THREE.Vector2
    uSize?: THREE.Vector2
    uTexture?: THREE.Texture
    uRayOrigin?: THREE.Vector3
    uResolution?: THREE.Vector2
    uColor?: THREE.Color
}

type Props = LineBasicShaderUniforms & MaterialProps

const LineBasicShader = forwardRef<LineBasicShaderUniforms, Props>(({...props}: Props, ref) => {
    const localRef = useRef<Props>(null!)
    useImperativeHandle(ref, () => localRef.current)
    useFrame((state, delta) => {
        localRef.current.uTime! += delta
        localRef.current.uMouse = state.pointer
        localRef.current.uRayOrigin = state.camera.position
    })
    return <lineBasicShaderImp key={LineBasicShaderImp.key} ref={localRef} attach="material" {...props} />
})
LineBasicShader.displayName = 'LineBasicShader'

export default function Page() {

    return <>
        <Canvas style={{position: "absolute", top: "0", zIndex: "-1"}}>
            <Scene/>
            <Float>
                <Html position={[0, -2.5, 0]}
                      center
                      transform
                      as="h1"
                      className={caveat.className}
                      scale={0.25}
                >
                    <div style={{transform: 'scale(4)', textAlign: 'center', pointerEvents: 'none'}}>
                        NoBlending
                    </div>
                </Html>
            </Float>
            <OrbitControls/>
            <Environment preset="warehouse"/>
        </Canvas>
    </>
}

 function Scene() {

    const count = useRef(500);
    const connDist = useRef(150);
    const maxConnections = useRef(20);
    const segsRef = useRef<LineSegments>(null!);
    const camera = useThree((state) => state.camera as PerspectiveCamera);
    const cameraMoveTo = useRef(new Vector3(-200, 0, 1300));
    const moveLerp = useRef(0.000001);
    const moveFinished = useRef(false);
    const fadeFinished = useRef(false);
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

     useEffect(() => {
         setTimeout(() => {
             console.log(segsRef.current.geometry.attributes)
         }, 1000)
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
                    const alpha = 1 - (dist / connDist.current) * 0.625 + .375;
                    segments[vertexpos++] = positions[i * 3];
                    segments[vertexpos++] = positions[i * 3 + 1];
                    segments[vertexpos++] = positions[i * 3 + 2];
                    segments[vertexpos++] = positions[j * 3];
                    segments[vertexpos++] = positions[j * 3 + 1];
                    segments[vertexpos++] = positions[j * 3 + 2];

                    colors[colorpos++] = alpha;  // light .7922, default .6549, lighter .8275
                    colors[colorpos++] = alpha;  // light .6666, default .4431, lighter .7216
                    colors[colorpos++] = alpha;  // light .6235, default .3725, lighter .6863

                    colors[colorpos++] = alpha;
                    colors[colorpos++] = alpha;
                    colors[colorpos++] = alpha;
                    numConnected++;
                }
            }
        }

        segsRef.current.geometry.setDrawRange(0, numConnected * 2);
        segsRef.current.geometry.attributes.position.needsUpdate = true;
        segsRef.current.geometry.attributes.col.needsUpdate = true;

        if (!moveFinished.current) {

            if (fadeFinished.current) {
                camera.position.lerp(cameraMoveTo.current, moveLerp.current);
                moveLerp.current *= 1.001;
                if (camera.fov < 45) camera.fov += 10 * moveLerp.current;
                if (camera.position.distanceTo(cameraMoveTo.current) < 1) moveFinished.current = true;
            } else {
                if (camera.far < 4000) camera.far += 1000 * moveLerp.current;
                else {
                    fadeFinished.current = true;
                    moveLerp.current = 0.000001;
                }
            }

            camera.updateProjectionMatrix();
            moveLerp.current += 0.00025;
        }
    })

    return <>

        {/* @ts-ignore */}
        <Instances ref={instancesRef} limit={500} range={500}>
            <tetrahedronGeometry args={[3, 5]} />
            <CustomShaderMaterial
                baseMaterial={MeshPhysicalMaterial}
                roughness={1}
                metalness={1}
                clearcoat={0.58}
                clearcoatRoughness={0.25}
                emissive={"#744f42"}
                silent
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
                    attach="attributes-col"
                    count={segments.length / 3}
                    array={colors}
                    itemSize={3}
                    usage={DynamicDrawUsage}
                />
            </bufferGeometry>
            <LineBasicShader
                uColor={new THREE.Color(0.6549, 0.4431, 0.3725)}
                blending={NoBlending}
                transparent
            />
        </lineSegments>
    </>
}
