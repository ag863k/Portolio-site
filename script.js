// Global variables
let scene, camera, renderer, controls;
let particles, particleSystem;
let geometryObjects = [];
let currentSection = 'home';
let animationId;
let isLowPerformanceMode = false;

const checkPerformance = () => {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
        isLowPerformanceMode = true;
        return;
    }
    
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile || (navigator.deviceMemory && navigator.deviceMemory < 4)) {
        isLowPerformanceMode = true;
    }
};

document.addEventListener('DOMContentLoaded', function() {
    checkPerformance();
    initThreeJS();
    initNavigation();
    initLoadingScreen();
    initContactForm();
    
    if (window.requestIdleCallback) {
        requestIdleCallback(() => animate());
    } else {
        setTimeout(() => animate(), 100);
    }
});

function initThreeJS() {
    const canvas = document.getElementById('three-canvas');
    
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x2D1810, 1, 1000);
    
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 50);
    
    renderer = new THREE.WebGLRenderer({ 
        canvas: canvas, 
        antialias: true, 
        alpha: true,
        powerPreference: "high-performance"
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x1A0F08, 1);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controls.enablePan = false;
    controls.minDistance = 10;
    controls.maxDistance = 100;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;
    
    createParticleSystem();
    createSectionObjects();
    addLighting();
    
    window.addEventListener('resize', onWindowResize, false);
}

function createParticleSystem() {
    const particleCount = isLowPerformanceMode ? 400 : 1000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 200;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 200;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 200;
        
        const brownShade = 0.08 + Math.random() * 0.15;
        const color = new THREE.Color();
        color.setHSL(brownShade, 0.6 + Math.random() * 0.4, 0.3 + Math.random() * 0.4);
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
    }
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({
        size: isLowPerformanceMode ? 2 : 3,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
    });
    
    particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);
}

function createSectionObjects() {
    createHomeObjects();
    createAboutObjects();
    createExperienceObjects();
    createProjectObjects();
    createSkillObjects();
    createContactObjects();
}

function createHomeObjects() {
    const group = new THREE.Group();
    group.name = 'home';
    
    const mainCube = new THREE.BoxGeometry(12, 12, 12);
    const cubeMaterial = new THREE.MeshPhongMaterial({
        color: 0xD4A574,
        transparent: true,
        opacity: 0.4,
        wireframe: true
    });
    const cube = new THREE.Mesh(mainCube, cubeMaterial);
    cube.rotation.x = Math.PI / 6;
    cube.rotation.y = Math.PI / 4;
    cube.userData = { rotationSpeed: 0.008 };
    group.add(cube);
    
    const shapes = [
        new THREE.BoxGeometry(2, 2, 2),
        new THREE.SphereGeometry(1.5, 16, 16),
        new THREE.ConeGeometry(1, 3, 8),
        new THREE.OctahedronGeometry(1.5),
        new THREE.TetrahedronGeometry(2),
        new THREE.DodecahedronGeometry(1.5)
    ];
    
    shapes.forEach((geometry, index) => {
        const material = new THREE.MeshPhongMaterial({
            color: new THREE.Color().setHSL(0.08 + (index * 0.02), 0.7, 0.5),
            transparent: true,
            opacity: 0.8,
            wireframe: Math.random() > 0.5
        });
        
        const mesh = new THREE.Mesh(geometry, material);
        const angle = (index / shapes.length) * Math.PI * 2;
        const radius = 18 + Math.random() * 5;
        
        mesh.position.set(
            Math.cos(angle) * radius,
            Math.sin(angle * 1.5) * 8,
            Math.sin(angle) * radius
        );
        
        mesh.userData = { 
            originalPosition: mesh.position.clone(),
            rotationSpeed: 0.01 + Math.random() * 0.02,
            floatSpeed: 0.5 + Math.random() * 0.5
        };
        
        group.add(mesh);
    });
    
    scene.add(group);
    geometryObjects.push(group);
}

function createAboutObjects() {
    const group = new THREE.Group();
    group.name = 'about';
    group.visible = false;
    
    const cubeGeometry = new THREE.BoxGeometry(8, 8, 8);
    const cubeMaterial = new THREE.MeshPhongMaterial({
        color: 0xCD853F,
        transparent: true,
        opacity: 0.6,
        wireframe: true
    });
    const mainCube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    mainCube.userData = { rotationSpeed: 0.01 };
    group.add(mainCube);
    
    for (let i = 0; i < 6; i++) {
        const smallCube = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshPhongMaterial({
            color: new THREE.Color().setHSL(0.08, 0.8, 0.4 + i * 0.1),
            transparent: true,
            opacity: 0.9
        });
        const cube = new THREE.Mesh(smallCube, material);
        
        const angle = (i / 6) * Math.PI * 2;
        cube.position.set(
            Math.cos(angle) * 15,
            Math.sin(angle * 2) * 4,
            Math.sin(angle) * 15
        );
        
        cube.userData = { 
            angle: angle,
            orbitRadius: 15,
            rotationSpeed: 0.02
        };
        
        group.add(cube);
    }
    
    scene.add(group);
    geometryObjects.push(group);
}

function createExperienceObjects() {
    const group = new THREE.Group();
    group.name = 'experience';
    group.visible = false;
    
    const nodes = [];
    const nodeGeometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
    
    for (let i = 0; i < 8; i++) {
        const nodeMaterial = new THREE.MeshPhongMaterial({
            color: new THREE.Color().setHSL(0.08, 0.7, 0.3 + i * 0.08),
            transparent: true,
            opacity: 0.8
        });
        const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
        const angle = (i / 8) * Math.PI * 2;
        const radius = 12 + Math.random() * 6;
        
        node.position.set(
            Math.cos(angle) * radius,
            (Math.random() - 0.5) * 10,
            Math.sin(angle) * radius
        );
        
        node.userData = { rotationSpeed: 0.01 + i * 0.002 };
        nodes.push(node);
        group.add(node);
    }
    
    const lineMaterial = new THREE.LineBasicMaterial({ 
        color: 0xA0522D,
        transparent: true,
        opacity: 0.6
    });
    
    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            if (Math.random() > 0.5) {
                const geometry = new THREE.BufferGeometry();
                const positions = new Float32Array([
                    nodes[i].position.x, nodes[i].position.y, nodes[i].position.z,
                    nodes[j].position.x, nodes[j].position.y, nodes[j].position.z
                ]);
                geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
                
                const line = new THREE.Line(geometry, lineMaterial);
                group.add(line);
            }
        }
    }
    
    scene.add(group);
    geometryObjects.push(group);
}

function createProjectObjects() {
    const group = new THREE.Group();
    group.name = 'projects';
    group.visible = false;
    
    const projects = [
        { name: '[Project1]', color: 0xD2691E, url: 'https://[your-project1].netlify.app', description: '[Your Project 1]' },
        { name: '[Project2]', color: 0xCD853F, url: 'https://[your-project2].netlify.app', description: '[Your Project 2]' },
        { name: '[Project3]', color: 0xA0522D, url: 'https://[your-project3].streamlit.app', description: '[Your Project 3]' }
    ];
    
    projects.forEach((project, index) => {
        const cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
        const cubeMaterial = new THREE.MeshPhongMaterial({
            color: project.color,
            transparent: true,
            opacity: 0.8,
            wireframe: index % 2 === 0
        });
        const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        
        cube.position.set(
            (index - 1) * 10,
            Math.sin(index) * 4,
            0
        );
        
        cube.userData = {
            rotationSpeed: 0.008 + index * 0.004,
            project: project.name,
            originalY: cube.position.y,
            url: project.url,
            description: project.description
        };
        
        group.add(cube);
    });
    
    scene.add(group);
    geometryObjects.push(group);
}

function createSkillObjects() {
    const group = new THREE.Group();
    group.name = 'skills';
    group.visible = false;
    
    const skills = [
        '[Skill1]', '[Skill2]', '[Skill3]', '[Skill4]', 
        '[Skill5]', '[Skill6]', '[Skill7]', '[Skill8]'
    ];
    
    skills.forEach((skill, index) => {
        const cubeGeometry = new THREE.BoxGeometry(2, 2, 2);
        const cubeMaterial = new THREE.MeshPhongMaterial({
            color: new THREE.Color().setHSL(0.08 + (index * 0.01), 0.8, 0.4 + (index * 0.05)),
            transparent: true,
            opacity: 0.8,
            wireframe: index % 2 === 0
        });
        const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        
        const angle = (index / skills.length) * Math.PI * 2;
        const radius = 14;
        cube.position.set(
            Math.cos(angle) * radius,
            Math.sin(angle * 1.5) * 5,
            Math.sin(angle) * radius
        );
        
        cube.userData = {
            skill: skill,
            originalY: cube.position.y,
            floatSpeed: 0.02 + index * 0.002,
            rotationSpeed: 0.01 + index * 0.001
        };
        
        group.add(cube);
    });
    
    scene.add(group);
    geometryObjects.push(group);
}

function createContactObjects() {
    const group = new THREE.Group();
    group.name = 'contact';
    group.visible = false;
    
    const cubeGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    
    for (let i = 0; i < 40; i++) {
        const material = new THREE.MeshPhongMaterial({
            color: new THREE.Color().setHSL(0.08, 0.7, 0.3 + (i * 0.015)),
            transparent: true,
            opacity: 0.7
        });
        const cube = new THREE.Mesh(cubeGeometry, material);
        const angle = i * 0.4;
        const radius = 3 + i * 0.3;
        const height = i * 0.6 - 15;
        
        cube.position.set(
            Math.cos(angle) * radius,
            height,
            Math.sin(angle) * radius
        );
        
        cube.userData = {
            originalPosition: cube.position.clone(),
            delay: i * 0.1,
            rotationSpeed: 0.02 + (i * 0.001)
        };
        
        group.add(cube);
    }
    
    scene.add(group);
    geometryObjects.push(group);
}

function addLighting() {
    const ambientLight = new THREE.AmbientLight(0x4A3728, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xFFE4B5, 1.2);
    directionalLight.position.set(15, 15, 10);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);
    
    const pointLight1 = new THREE.PointLight(0xD2691E, 0.8, 150);
    pointLight1.position.set(25, 25, 25);
    scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0xCD853F, 0.6, 150);
    pointLight2.position.set(-25, -25, 25);
    scene.add(pointLight2);
    
    const spotLight = new THREE.SpotLight(0xFFE4B5, 1);
    spotLight.position.set(0, 30, 30);
    spotLight.angle = Math.PI / 6;
    spotLight.penumbra = 0.1;
    spotLight.decay = 2;
    spotLight.distance = 200;
    scene.add(spotLight);
}

function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const logoLink = document.querySelector('.logo-link');
    
    if (logoLink) {
        logoLink.addEventListener('click', (e) => {
            e.preventDefault();
            const heroSection = document.getElementById('hero');
            if (heroSection) {
                heroSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                navLinks.forEach(l => l.classList.remove('active'));
                const homeLink = document.querySelector('[href="#hero"]');
                if (homeLink) homeLink.classList.add('active');
                switchSection('hero');
                
                // Clean URL without hash
                history.replaceState(null, null, window.location.pathname);
            }
        });
    }
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                switchSection(targetId);
                
                // Update URL without causing page reload
                history.replaceState(null, null, `#${targetId}`);
            }
        });
    });
    
    const observerOptions = { threshold: 0.3, rootMargin: '-20% 0px -20% 0px' };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
                switchSection(sectionId);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.section').forEach(section => observer.observe(section));
}

function switchSection(section) {
    if (currentSection === section) return;
    
    geometryObjects.forEach(group => {
        group.visible = group.name === section || group.name === 'home';
    });
    
    updateCameraPosition(section);
    currentSection = section;
}

function updateCameraPosition(section) {
    const positions = {
        hero: { x: 0, y: 0, z: 50 },
        about: { x: 15, y: 5, z: 40 },
        experience: { x: -10, y: 10, z: 45 },
        projects: { x: 20, y: 0, z: 35 },
        contact: { x: -15, y: -5, z: 45 }
    };
    
    const targetPosition = positions[section] || positions.hero;
    const startPosition = camera.position.clone();
    const endPosition = new THREE.Vector3(targetPosition.x, targetPosition.y, targetPosition.z);
    
    let progress = 0;
    const animateCamera = () => {
        progress += 0.02;
        if (progress >= 1) progress = 1;
        
        camera.position.lerpVectors(startPosition, endPosition, easeInOutCubic(progress));
        
        if (progress < 1) {
            requestAnimationFrame(animateCamera);
        }
    };
    
    animateCamera();
}

function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
}

function initContactForm() {
    const form = document.getElementById('contact-form');
    const successMessage = document.getElementById('form-success');
    const errorMessage = document.getElementById('form-error');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            const submitBtn = form.querySelector('.contact-submit');
            const submitText = document.getElementById('submit-text');
            const originalText = submitText.textContent;
            
            submitText.textContent = 'Sending...';
            submitBtn.style.opacity = '0.7';
            submitBtn.disabled = true;
            
            successMessage?.classList.add('hidden');
            errorMessage?.classList.add('hidden');
            
            // Let Netlify handle the form submission naturally
            // Don't prevent default - let it submit normally
            setTimeout(() => {
                submitText.textContent = originalText;
                submitBtn.style.opacity = '1'; 
                submitBtn.disabled = false;
            }, 2000);
        });
    }
}

function initLoadingScreen() {
    let progress = 0;
    const progressBar = document.querySelector('.progress-bar');
    const percentage = document.querySelector('.loader-percentage');
    
    const loadingInterval = setInterval(() => {
        progress += Math.random() * 12 + 3;
        if (progress >= 100) {
            progress = 100;
            clearInterval(loadingInterval);
            
            setTimeout(() => {
                const loadingScreen = document.getElementById('loading-screen');
                loadingScreen?.classList.add('hidden');
                
                setTimeout(() => {
                    if (loadingScreen) loadingScreen.style.display = 'none';
                }, 800);
            }, 300);
        }
        
        if (progressBar) progressBar.style.transform = `translateX(-${100 - progress}%)`;
        if (percentage) percentage.textContent = `${Math.floor(progress)}%`;
    }, 60);
}

function animate() {
    animationId = requestAnimationFrame(animate);
    const time = Date.now() * 0.001;
    
    if (particleSystem) {
        particleSystem.rotation.y += 0.0008;
        particleSystem.rotation.x += 0.0004;
    }
    
    animateSectionObjects(time);
    controls.update();
    renderer.render(scene, camera);
}

function animateSectionObjects(time) {
    geometryObjects.forEach(group => {
        if (!group.visible) return;
        
        switch (group.name) {
            case 'home':
                group.children.forEach((mesh, index) => {
                    if (mesh.userData.rotationSpeed) {
                        mesh.rotation.x += mesh.userData.rotationSpeed;
                        mesh.rotation.y += mesh.userData.rotationSpeed * 0.8;
                        mesh.rotation.z += mesh.userData.rotationSpeed * 0.5;
                        
                        if (mesh.userData.originalPosition) {
                            mesh.position.y = mesh.userData.originalPosition.y + Math.sin(time * mesh.userData.floatSpeed + index) * 3;
                        }
                    }
                });
                break;
                
            case 'about':
                const mainCube = group.children[0];
                if (mainCube?.userData.rotationSpeed) {
                    mainCube.rotation.x += mainCube.userData.rotationSpeed;
                    mainCube.rotation.y += mainCube.userData.rotationSpeed * 1.2;
                }
                
                group.children.slice(1).forEach((cube, index) => {
                    if (cube.userData.angle !== undefined) {
                        cube.userData.angle += 0.015;
                        const radius = cube.userData.orbitRadius;
                        cube.position.x = Math.cos(cube.userData.angle) * radius;
                        cube.position.z = Math.sin(cube.userData.angle) * radius;
                        cube.position.y = Math.sin(cube.userData.angle * 2) * 4;
                        cube.rotation.x += cube.userData.rotationSpeed;
                        cube.rotation.y += cube.userData.rotationSpeed * 0.7;
                    }
                });
                break;
                
            case 'experience':
                group.children.forEach((mesh, index) => {
                    if (mesh.userData.rotationSpeed) {
                        mesh.rotation.x += mesh.userData.rotationSpeed;
                        mesh.rotation.y += mesh.userData.rotationSpeed * 1.5;
                        mesh.rotation.z += mesh.userData.rotationSpeed * 0.5;
                        
                        const scale = 1 + Math.sin(time * 1.5 + index) * 0.15;
                        mesh.scale.setScalar(scale);
                    }
                });
                break;
                
            case 'projects':
                group.children.forEach((cube, index) => {
                    if (cube.userData.rotationSpeed) {
                        cube.rotation.x += cube.userData.rotationSpeed;
                        cube.rotation.y += cube.userData.rotationSpeed * 1.8;
                        cube.rotation.z += cube.userData.rotationSpeed * 0.3;
                        cube.position.y = cube.userData.originalY + Math.sin(time * 0.8 + index) * 2;
                    }
                });
                break;
                
            case 'skills':
                group.children.forEach((cube, index) => {
                    if (cube.userData.floatSpeed) {
                        cube.position.y = cube.userData.originalY + Math.sin(time * cube.userData.floatSpeed + index) * 4;
                        cube.rotation.x += cube.userData.rotationSpeed;
                        cube.rotation.y += cube.userData.rotationSpeed * 1.3;
                    }
                });
                break;
                
            case 'contact':
                group.children.forEach((cube, index) => {
                    const offset = cube.userData.delay || 0;
                    cube.position.y = cube.userData.originalPosition.y + Math.sin(time * 0.5 + offset) * 1.5;
                    cube.rotation.x += cube.userData.rotationSpeed;
                    cube.rotation.y += cube.userData.rotationSpeed * 0.8;
                });
                break;
        }
    });
}

// Handle window resize
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Cleanup function
function cleanup() {
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
    
    if (renderer) {
        renderer.dispose();
    }
    
    geometryObjects.forEach(group => {
        group.children.forEach(child => {
            if (child.geometry) child.geometry.dispose();
            if (child.material) child.material.dispose();
        });
    });
}

// Handle page unload
window.addEventListener('beforeunload', cleanup);
