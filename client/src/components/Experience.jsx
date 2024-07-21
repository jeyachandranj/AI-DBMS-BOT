import { Environment, OrbitControls, useTexture } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { Avatar } from "./Avatar";
import { Desk } from "./Desk";
import { useEffect, useRef, useState } from "react";

export const Experience = ({response}) => {
	const controls = useRef();
	const texture = useTexture("textures/home.jpeg");
	const viewport = useThree((state) => state.viewport);

	const newWidth = viewport.width * 3.5;
	const newHeight = viewport.height * 3;

	return (
		<>
			<OrbitControls
				enableZoom={false} 
				minPolarAngle={Math.PI / 2} 
				maxPolarAngle={Math.PI / 1.9} 
				minAzimuthAngle={-Math.PI / 8}
				maxAzimuthAngle={Math.PI / 8}
				target={[0, -0.9, 9]}
        ref={controls}
			/>
			<Avatar position={[0, -3, 5]} scale={2} response={response} />
			<Desk position={[-0.05, -3.05, 5]} scale={2.05} />
			<Environment preset="sunset" />
			<mesh>
				<planeGeometry args={[newWidth, newHeight]} />
				<meshBasicMaterial map={texture} />
			</mesh>
		</>
	);
};
