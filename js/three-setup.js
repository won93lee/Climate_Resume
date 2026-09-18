/**
 * Custom Three.js Scene - Interactive Particle Globe
 * Inspired by modern 3D portfolio aesthetics
 */

class Portfolio3DScene {
    constructor() {
        this.container = document.querySelector('#webgl-canvas');
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.particles = [];
        this.geometries = [];
        this.mouse = { x: 0, y: 0 };
        this.targetMouse = { x: 0, y: 0 };
        this.clock = new THREE.Clock();
        
        this.init();
    }
    
    init() {
        // Scene setup
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.FogExp2(0x0b1524, 0.002);
        
        // Camera setup
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.z = 50;
        
        // Renderer setup
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.container,
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setClearColor(0x0b1524, 1);
        
        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0x10b981, 1);
        directionalLight.position.set(10, 10, 10);
        this.scene.add(directionalLight);
        
        const pointLight = new THREE.PointLight(0x14b8a6, 2, 100);
        pointLight.position.set(-10, -10, 5);
        this.scene.add(pointLight);
        
        // Create elements
        this.createParticleField();
        this.createFloatingShapes();
        this.createGlobeWireframe();
        
        // Event listeners
        this.addEventListeners();
        
        // Start animation loop
        this.animate();
    }
    
    createParticleField() {
        // Create thousands of floating particles
        const particleCount = 2000;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);
        const colors = new Float32Array(particleCount * 3);
        
        const colorPalette = [
            new THREE.Color(0x10b981),
            new THREE.Color(0x14b8a6),
            new THREE.Color(0x3b82f6)
        ];
        
        for (let i = 0; i < particleCount; i++) {
            // Position spread across scene
            positions[i * 3] = (Math.random() - 0.5) * 200;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 200;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 200;
            
            // Random sizes
            sizes[i] = Math.random() * 2;
            
            // Color assignment
            const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        // Custom shader material for particles
        const material = new THREE.PointsMaterial({
            size: 1,
            vertexColors: true,
            transparent: true,
            opacity: 0.7,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        
        const particleSystem = new THREE.Points(geometry, material);
        this.scene.add(particleSystem);
        this.particles.push(particleSystem);
    }
    
    createFloatingShapes() {
        // Create floating geometric shapes
        const shapes = [];
        const geometries = [
            new THREE.IcosahedronGeometry(3, 0),
            new THREE.OctahedronGeometry(3, 0),
            new THREE.TetrahedronGeometry(3, 0)
        ];
        
        const materials = [
            new THREE.MeshPhongMaterial({
                color: 0x10b981,
                wireframe: true,
                transparent: true,
                opacity: 0.3
            }),
            new THREE.MeshPhongMaterial({
                color: 0x14b8a6,
                wireframe: true,
                transparent: true,
                opacity: 0.3
            }),
            new THREE.MeshPhongMaterial({
                color: 0x3b82f6,
                wireframe: true,
                transparent: true,
                opacity: 0.3
            })
        ];
        
        for (let i = 0; i < 15; i++) {
            const geometry = geometries[Math.floor(Math.random() * geometries.length)];
            const material = materials[Math.floor(Math.random() * materials.length)];
            const mesh = new THREE.Mesh(geometry, material);
            
            mesh.position.set(
                (Math.random() - 0.5) * 80,
                (Math.random() - 0.5) * 80,
                (Math.random() - 0.5) * 50 - 20
            );
            
            mesh.rotation.set(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            );
            
            mesh.userData = {
                rotationSpeed: {
                    x: (Math.random() - 0.5) * 0.01,
                    y: (Math.random() - 0.5) * 0.01,
                    z: (Math.random() - 0.5) * 0.01
                },
                floatSpeed: Math.random() * 0.005 + 0.002,
                floatOffset: Math.random() * Math.PI * 2
            };
            
            this.scene.add(mesh);
            this.geometries.push(mesh);
        }
    }
    
    createGlobeWireframe() {
        // Create subtle globe wireframe in background
        const geometry = new THREE.SphereGeometry(35, 32, 32);
        const material = new THREE.MeshBasicMaterial({
            color: 0x10b981,
            wireframe: true,
            transparent: true,
            opacity: 0.05
        });
        
        const globe = new THREE.Mesh(geometry, material);
        globe.position.z = -30;
        this.scene.add(globe);
        this.geometries.push(globe);
    }
    
    addEventListeners() {
        // Mouse movement
        document.addEventListener('mousemove', (event) => {
            this.targetMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.targetMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        });
        
        // Window resize
        window.addEventListener('resize', () => {
            this.onWindowResize();
        });
        
        // Scroll for camera parallax
        document.addEventListener('scroll', () => {
            this.onScroll();
        });
    }
    
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    onScroll() {
        // Parallax effect based on scroll position
        const scrollPercent = window.scrollY / (document.body.scrollHeight - window.innerHeight);
        this.camera.position.y = scrollPercent * 20;
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        const delta = this.clock.getDelta();
        const elapsed = this.clock.getElapsedTime();
        
        // Smooth mouse following
        this.mouse.x += (this.targetMouse.x - this.mouse.x) * 0.05;
        this.mouse.y += (this.targetMouse.y - this.mouse.y) * 0.05;
        
        // Camera parallax based on mouse
        this.camera.position.x += (this.mouse.x * 5 - this.camera.position.x) * 0.02;
        this.camera.position.y += (this.mouse.y * 5 - this.camera.position.y) * 0.02;
        this.camera.lookAt(this.scene.position);
        
        // Animate particles
        this.particles.forEach(particle => {
            particle.rotation.y += delta * 0.02;
            particle.rotation.x += delta * 0.01;
        });
        
        // Animate floating shapes
        this.geometries.forEach((mesh, index) => {
            if (mesh.userData && mesh.userData.rotationSpeed) {
                mesh.rotation.x += mesh.userData.rotationSpeed.x;
                mesh.rotation.y += mesh.userData.rotationSpeed.y;
                mesh.rotation.z += mesh.userData.rotationSpeed.z;
            }
            
            // Float up and down
            if (mesh.userData && mesh.userData.floatSpeed) {
                mesh.position.y += Math.sin(elapsed * mesh.userData.floatSpeed * 1000 + mesh.userData.floatOffset) * 0.01;
            }
        });
        
        // Subtle globe rotation
        this.geometries.forEach((mesh) => {
            if (mesh.geometry && mesh.geometry.type === 'SphereGeometry') {
                mesh.rotation.y += delta * 0.005;
            }
        });
        
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize scene when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new Portfolio3DScene();
    });
} else {
    new Portfolio3DScene();
}