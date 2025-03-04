import { useState, useRef } from "react";
import { Canvas, useLoader, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";

import logo from './images/planet.jpg'; // Your Earth texture

const locations = [
  { lat: 35.7796, lon: -78.6382 }, // Raleigh, NC
  { lat: 33.4484, lon: -112.0740 }, // Phoenix, AZ
  { lat: 37.7749, lon: -122.4194 }, // San Francisco, CA
  { lat: 40.7128, lon: -74.0060 }, // New York, NY
];

function latLonToVector3(lat: number, lon: number, radius: number) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  return new THREE.Vector3(
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

const Globe = () => {
  const [index, setIndex] = useState(0);
  const groupRef = useRef<THREE.Group>(null);
  
  // Load the Earth texture
  const earthTexture = useLoader(THREE.TextureLoader, logo); // Replace with your texture file path

  // Handle the scroll event
  const handleScroll = (e: React.WheelEvent<HTMLDivElement>) => {
    if (e.deltaY > 0) {
      setIndex((prev) => (prev + 1) % locations.length); // Scroll down
    } else {
      setIndex((prev) => (prev - 1 + locations.length) % locations.length); // Scroll up
    }
  };

  // Update the globe's rotation every frame to look at the current location
  useFrame(() => {
    if (groupRef.current) {
      const target = latLonToVector3(locations[index].lat, locations[index].lon, 2);
      groupRef.current.lookAt(target); // Rotate the globe to the target location
    }
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <sphereGeometry args={[2, 64, 64]} />
        {/* Apply the texture to the material */}
        <meshStandardMaterial map={earthTexture} />
      </mesh>
    </group>
  );
};
