 'use client'

import {Canvas, extend, MaterialNode, MaterialProps, useFrame} from "@react-three/fiber"
import {Float, Html, shaderMaterial, OrbitControls, Instances, Instance} from "@react-three/drei"
import { Caveat } from "next/font/google"
import fragment from './fragment.glsl'
import vertex from './vertex.glsl'
import * as THREE from 'three'
import React, {forwardRef, useEffect, useImperativeHandle, useMemo, useRef} from "react"

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
                        Electrons
                    </div>
                </Html>
            </Float>
            <OrbitControls/>
        </Canvas>
    </>
}

function Scene() {
    const positions = useMemo(() => {
        const positions: [number, number, number][] = []
        for (let i = 0; i < 100; i++) {
            positions[i] = [Math.random() * 6 - 3, Math.random() * 6 - 3, Math.random() * 6 - 3];
        }
        return positions
    }, []);

    const pos = useRef(new THREE.Vector3());
    const axis = useRef(new THREE.Vector3());
    const scale = useRef(new THREE.Vector3(0.2, 0.2, 0.2));
    const quart = useRef(new THREE.Quaternion());
    const rotMatrix = useRef(new THREE.Matrix4());
    const instances = useRef<THREE.InstancedMesh>(null!);
    const dotRefs = useRef<THREE.Mesh[]>([]);
    const lineRef = useRef<THREE.BufferGeometry>(null!);
    const boom = useRef(false);
    const lineArray = useMemo(() => {
        const lineArray = new Float32Array(positions.length * 2 * 3);
        for (let i = 0; i < positions.length; i++) {
            const x = i * 3 * 2;
            lineArray[x + 3] = positions[i][0];
            lineArray[x + 4] = positions[i][1];
            lineArray[x + 5] = positions[i][2];
        }
        return lineArray
    }, []);

    useEffect(() => {
        for (let i = 0; i < 100; i++) {
            const ref = dotRefs.current[i];
            ref.position.set(0, 0, 0);
            const x = i * 3 * 2;
            lineArray[x + 3] = 0;
            lineArray[x + 4] = 0;
            lineArray[x + 5] = 0;
        }
        boom.current = false
    }, []);

    useFrame((state) => {
        if (boom.current) {
            for (let i = 0; i < 100; i++) {
                const ref = dotRefs.current[i];
                instances.current.getMatrixAt(i, rotMatrix.current);
                rotMatrix.current.decompose(pos.current, quart.current, scale.current);
                const offset = state.clock.elapsedTime * 1e-4;
                axis.current.set(
                    Math.sin(i * 100 + offset),
                    Math.cos(-i * 10 + offset),
                    Math.sin(i + offset),
                ).normalize();
                pos.current.applyAxisAngle(axis.current, 0.001);
                rotMatrix.current.compose(pos.current, quart.current, scale.current);
                instances.current.setMatrixAt(i, rotMatrix.current);
                ref.position.set(pos.current.x, pos.current.y, pos.current.z);
                const x = i * 3 * 2;
                lineArray[x + 3] = pos.current.x;
                lineArray[x + 4] = pos.current.y;
                lineArray[x + 5] = pos.current.z;
            }
        } else {
            for (let i = 0; i < 100; i++) {
                const ref = dotRefs.current[i];
                ref.position.lerp(new THREE.Vector3(positions[i][0], positions[i][1], positions[i][2]), 0.1);
                const x = i * 3 * 2;
                lineArray[x + 3] = ref.position.x;
                lineArray[x + 4] = ref.position.y;
                lineArray[x + 5] = ref.position.z;
            }
        }
        if (state.clock.elapsedTime > 0.75) boom.current = true;
        instances.current.instanceMatrix.needsUpdate = true;
        lineRef.current.attributes.position.needsUpdate = true;
    });

    return <>

        {/* Network nodes */}
        {/* @ts-ignore */}
        <Instances ref={instances} limit={1000} range={1000}>
            <sphereGeometry args={[0.02, 16, 16]} />
            <meshBasicMaterial />

            {/* @ts-ignore */}
            { positions.map((value, index) =>
                // @ts-ignore
                <Instance ref={(ref) => dotRefs.current[index] = ref as THREE.Mesh}
                    key={index}
                    color="red"
                    position={value}
                />)}
        </Instances>

        {/* Connecting Lines */}
        <lineSegments>
            <bufferGeometry ref={lineRef}>
                <bufferAttribute
                    attach="attributes-position"
                    count={positions.length * 2}
                    array={lineArray}
                    itemSize={3}
                />
            </bufferGeometry>
            <lineBasicMaterial color="red" />
        </lineSegments>

        <mesh>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshBasicMaterial color="blue" />
        </mesh>
    </>
}
