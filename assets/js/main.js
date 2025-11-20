// --- Configuration ---
const CONFIG = {
    particleCount: 1500,
    connectionDistance: 1.5,
    coreSize: 20,
    rotationSpeed: 0.001
};

// --- Setup Scene ---
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
// Fog for depth
scene.fog = new THREE.FogExp2(0x050505, 0.02);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 35;

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);

// --- Particles (Data Cloud) ---
const particlesGeo = new THREE.BufferGeometry();
const particlesCount = 1500;
const posArray = new Float32Array(particlesCount * 3);

for(let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 80; // Spread
}

particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const particlesMat = new THREE.PointsMaterial({
    size: 0.08,
    color: 0x00ff41, // Terminal Green
    transparent: true,
    opacity: 0.7,
    blending: THREE.AdditiveBlending
});
const particlesMesh = new THREE.Points(particlesGeo, particlesMat);
scene.add(particlesMesh);

// --- Interaction State ---
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (event) => {
    // Normalize mouse position (-1 to 1)
    mouseX = (event.clientX - window.innerWidth / 2) * 0.001;
    mouseY = (event.clientY - window.innerHeight / 2) * 0.001;
});

// --- Animation Loop ---
const clock = new THREE.Clock();

function animate() {
    const elapsedTime = clock.getElapsedTime();

    // Constant background drift
    particlesMesh.rotation.y = -elapsedTime * 0.03;

    // Interactive Mouse Follow (Parallax Tilt)
    particlesMesh.rotation.x += (mouseY - particlesMesh.rotation.x) * 0.05;
    particlesMesh.rotation.z += (mouseX - particlesMesh.rotation.z) * 0.05;

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

animate();

// --- Resize Handling ---
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// --- GSAP Scroll Animations ---
gsap.registerPlugin(ScrollTrigger);

gsap.from(".hero-h1", {
    duration: 1.5,
    y: 50,
    opacity: 0,
    ease: "power3.out",
    delay: 0.2
});

gsap.utils.toArray('section').forEach(section => {
    gsap.fromTo(section.children, 
        { y: 30, opacity: 0 },
        { 
            y: 0, 
            opacity: 1, 
            duration: 1, 
            stagger: 0.2,
            scrollTrigger: {
                trigger: section,
                start: "top 80%",
            }
        }
    );
});
