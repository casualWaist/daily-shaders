 'use client'

import {Canvas, extend, MaterialNode, MaterialProps, useFrame, useThree} from "@react-three/fiber"
import {Float, Html, shaderMaterial, OrbitControls} from "@react-three/drei"
import { Caveat } from "next/font/google"
import fragment from './fragment.glsl'
import vertex from './vertex.glsl'
import * as THREE from 'three'
import React, {forwardRef, useEffect, useImperativeHandle, useMemo, useRef} from "react"
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
                <Html position={[0, 0, 950]}
                      center
                      transform
                      as="h1"
                      className={caveat.className}
                      scale={0.25}
                >
                    <div style={{transform: 'scale(32)', textAlign: 'center', pointerEvents: 'none'}}>
                        Form up!
                    </div>
                </Html>
            </Float>
            <OrbitControls/>
        </Canvas>
    </>
}
function Scene() {
    const count = 500;
    const connDist = 150;
    const maxConnections = 20;
    const pointsRef = useRef<Points>(null!);
    const camera = useThree((state) => state.camera as PerspectiveCamera);
    const cameraMoveTo = useRef(new Vector3(0, 0, 1300));
    const moveLerp = useRef(0.000001);
    const moveFinished = useRef(false);
    const fadeFinished = useRef(false);
    const [
        particleData,
        positions,
        segments,
        colors
    ] = useMemo(() => {
        const data = [];
        const poses = new Float32Array(count * 3)
        const segs = new Float32Array(count * count * 3)
        const cols = new Float32Array(count * count * 3)
        for (let i = 0; i < count; i++) {
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
            poses[i * 3] = pos.x;
            poses[i * 3 + 1] = pos.y;
            poses[i * 3 + 2] = pos.z;
        }
        return [data, poses, segs, cols];
    }, []);
    useEffect(() => {
        camera.position.set(0, 0, 1000);
        camera.far = 700;
        camera.fov = 15;
        camera.near = 1;
        camera.updateProjectionMatrix();
    }, [camera]);
    useFrame(() => {
        let vertexpos = 0;
        let colorpos = 0;
        let numConnected = 0;
        for (let a = 0; a < count; a++) particleData[a].numConnections = 0;
        for (let i = 0; i < count; i++) {
            const seekerData = particleData[i];
            const seeker = new Vector3(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);
            positions[i * 3] += seekerData.velocity.x;
            positions[i * 3 + 1] += seekerData.velocity.y;
            positions[i * 3 + 2] += seekerData.velocity.z;
            if (seeker.length() > 400) {
                const normal = seeker.clone().normalize();
                seekerData.velocity = seekerData.velocity.clone()
                    .sub(normal.multiplyScalar(2 * normal.dot(seekerData.velocity)));
            }
            for (let j = i + 1; j < count; j++) {
                const testData = particleData[j];
                if (testData.numConnections >= maxConnections || seekerData.numConnections >= maxConnections) continue;
                const test = new Vector3(positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2]);
                const dist = seeker.distanceTo(test);
                /*const dx = positions[ i * 3 ] - positions[ j * 3 ];
                const dy = positions[ i * 3 + 1 ] - positions[ j * 3 + 1 ];
                const dz = positions[ i * 3 + 2 ] - positions[ j * 3 + 2 ];
                const dist = Math.sqrt( dx * dx + dy * dy + dz * dz );*/
                if (dist < connDist) {
                    seekerData.numConnections++;
                    testData.numConnections++;
                    const alpha = dist / connDist + 0.1;
                    segments[vertexpos++] = positions[i * 3];
                    segments[vertexpos++] = positions[i * 3 + 1];
                    segments[vertexpos++] = positions[i * 3 + 2];
                    segments[vertexpos++] = positions[j * 3];
                    segments[vertexpos++] = positions[j * 3 + 1];
                    segments[vertexpos++] = positions[j * 3 + 2];
                    colors[colorpos++] = alpha * 0.7922;  // light .7922, default .6549, lighter .8275
                    colors[colorpos++] = alpha * 0.6666;  // light .6666, default .4431, lighter .7216
                    colors[colorpos++] = alpha * 0.6235;  // light .6235, default .3725, lighter .6863
                    colors[colorpos++] = alpha * 0.7922;
                    colors[colorpos++] = alpha * 0.6666;
                    colors[colorpos++] = alpha * 0.6235;
                    numConnected++;
                }
            }
        }
        pointsRef.current.geometry.attributes.position.needsUpdate = true;
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
        <points ref={pointsRef}>
            <bufferGeometry drawRange={{start: 0, count: count}}>
                <bufferAttribute
                    attach="attributes-position"
                    count={count}
                    array={positions}
                    itemSize={3}
                    usage={DynamicDrawUsage}
                />
            </bufferGeometry>
            <pointsMaterial
                color={"#a7715f"}
                size={3}
                blending={AdditiveBlending}
                transparent
                sizeAttenuation={false}
            />
        </points>
    </>
}
