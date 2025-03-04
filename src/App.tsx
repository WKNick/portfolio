import { useState, useRef, useEffect } from "react";
import { Canvas, useLoader, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";

import logo from './images/planet.jpg'; // Your Earth texture

const locations = [
  { lat: -15, lon: -70, name: "Location 1" },
  { lat: 33.4484, lon: -112.0740, name: "Phoenix, AZ" },
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

const Globe = ({ index }: { index: number }) => {
  const groupRef = useRef<THREE.Group>(null);
  const [target, setTarget] = useState<THREE.Vector3>(latLonToVector3(locations[index].lat, locations[index].lon, 2));
  const [currentPosition, setCurrentPosition] = useState<THREE.Vector3>(new THREE.Vector3(0, 0, 2)); // Start from a default position
  
  // Load the Earth texture
  const earthTexture = useLoader(THREE.TextureLoader, logo); // Replace with your texture file path

  // Update the target position whenever index changes
  useEffect(() => {
    const newTarget = latLonToVector3(locations[index].lat, locations[index].lon, 2);
    setTarget(newTarget);
  }, [index]); // Effect runs whenever `index` changes

  // Update the globe's rotation every frame to gradually look at the current location
  useFrame(() => {
    if (groupRef.current) {
      // Smoothly interpolate towards the target position (a tenth of the distance)
      currentPosition.lerp(target, 0.04); // 0.1 controls the speed of transition
      groupRef.current.lookAt(currentPosition); // Rotate the globe to the target location
      setCurrentPosition(currentPosition); // Update current position for the next frame
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

const App = () => {
  const [index, setIndex] = useState(0);

  const handleScroll = (e: React.WheelEvent<HTMLDivElement>) => {
    if (e.deltaY > 0) {
      setIndex((prev) => (prev + 1) % locations.length); // Scroll down
    } else {
      setIndex((prev) => (prev - 1 + locations.length) % locations.length); // Scroll up
    }
  };

  return (
    <div>
      <Canvas onWheel={handleScroll} camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Stars />
        <Globe index={index} />
        <OrbitControls enableZoom={false} enableRotate={false} enablePan={false} />
      </Canvas>
    </div>
  );
};

export default App;
