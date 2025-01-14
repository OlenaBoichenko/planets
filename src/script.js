import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

// Render
const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: false,
    depth: true 
});
renderer.setClearColor(0x000000, 1);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Scene initialization
const scene = new THREE.Scene();

// Camera setup
const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
)

const orbit = new OrbitControls(camera, renderer.domElement)

camera.position.set(-450, 100, 100);
orbit.update();


// Loading textures
const textureLoader = new THREE.TextureLoader();
const sunTexture = textureLoader.load('img/sun.jpg');
const mercuryTexture = textureLoader.load('img/mercury.jpg');
const venusTexture = textureLoader.load('img/venus.jpg');
const earthTexture = textureLoader.load('img/earth.jpg');
const moonTexture = textureLoader.load('img/moon.jpg');
const marsTexture = textureLoader.load('img/mars.jpg');
const jupiterTexture = textureLoader.load('img/jupiter.jpg');
const saturnTexture = textureLoader.load('img/saturn.jpg');
const neptuneTexture = textureLoader.load('img/neptune.jpg');


// Array for storing planets and information about them
const planets = [];
const planetInfo = {
    sun: 'The Sun is one of the stars in our galaxy and the only star in the Solar System. Other objects of this system revolve around the Sun: planets and their satellites, asteroids, meteoroids, comets and cosmic dust.',
    mercury: 'Mercury is the closest planet to the Sun. This is a small and hot planet.',
    venus: 'Venus is the second planet from the Sun. It is known for its thick clouds.',
    earth: 'The Earth is our home. The only planet known to life.',
    mars: 'Mars is the Red Planet, a possible location for future colonies.',
    jupiter: 'Jupiter is the largest planet in the solar system. It is a gas giant with powerful storms, the most famous of which is the Great Red Spot.',
    saturn: 'Saturn is the second largest planet in the solar system, known for its beautiful rings made of ice and rocks.',
    neptune: 'Neptune is the eighth planet from the Sun and is known for its strong winds and beautiful blue color. It is the most distant planet in the solar system.',
    moon: 'The Moon is the only natural satellite of the Earth. It has a significant influence on the tides on Earth and is the closest cosmic body to us.',
    saturnRings: `Saturn's rings are made up of particles of ice, rock and dust, and extend for thousands of kilometers. These rings are visible even with a small telescope.`
};

// Creating a Sun with Texture
const sunGeometry = new THREE.SphereGeometry(24*2, 32, 32); // Увеличили размер Солнца в 3 раза
const sunMaterial = new THREE.MeshBasicMaterial({ map: sunTexture });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
sun.userData = { info: planetInfo.sun};
scene.add(sun);

// Creation of the Moon
const moonGeometry = new THREE.SphereGeometry(1.5*3, 32, 32); // Moon size
const moonMaterial = new THREE.MeshStandardMaterial({ map: moonTexture });
const moon = new THREE.Mesh(moonGeometry, moonMaterial);
moon.userData = { distance: 30, speed: 0.05 / 3, angle: 0, info: planetInfo.moon }; // Параметры орбиты Луны
scene.add(moon);


// Creation of Saturn's rings
const innerRadius = 3 * 6;  // Inner radius of the ring 
const outerRadius = 5 * 6;    // Outer radius of the ring
const ringGeometry = new THREE.RingGeometry(innerRadius, outerRadius, 64);

// Ring texture
const ringTexture = new THREE.TextureLoader().load('img/saturn_ring.jpg');

// Ring material
const ringMaterial = new THREE.MeshBasicMaterial({
  map: ringTexture, 
  side: THREE.DoubleSide, // Кольца видны с обеих сторон
  transparent: true,
});

// Creating Mesh for the Rings
const saturnRings = new THREE.Mesh(ringGeometry, ringMaterial);
saturnRings.userData = {info: planetInfo.saturnRings}

// Installing the rings along the xz axis so that they lie on the “equator” of the planet
saturnRings.rotation.x = Math.PI / 2; // Поворот кольца на 90 градусов

// Creation of Saturn
const saturn = createPlanet('saturn', 1.8*2.5, saturnTexture, 280, 0.008 / 3, planetInfo.saturn);
saturn.castShadow = true;

// Adding rings to Saturn
saturn.add(saturnRings)
scene.add(saturn);


// Creating a planet with texture and information
function createPlanet(name, size, texture, distance, speed, info) {
    const planetGeometry = new THREE.SphereGeometry(size*2.5, 35, 35); // Increase in the size of planets by 3 times
    const planetMaterial = new THREE.MeshStandardMaterial({ 
        map: texture,
        roughness: 0.8,
        metalness: 0.1,  
        transparent: false,
        depthWrite: true, 
        depthTest: true,
     });
    const planet = new THREE.Mesh(planetGeometry, planetMaterial);
    planet.userData = { distance: distance, speed: speed / 3, angle: Math.random() * Math.PI * 2, info: info }; // Reduce speed by 3 times
    planets.push(planet);
    planet.renderOrder = 1;
    scene.add(planet);
    return planet;
}

// Creating planets with textures, physics and information
createPlanet('mercury', 6, mercuryTexture, 80, 0.04/3, planetInfo.mercury); 
createPlanet('venus', 1.1*6, venusTexture, 120, 0.03/3, planetInfo.venus); 
createPlanet('earth', 1.3*6, earthTexture, 160, 0.02/3, planetInfo.earth); 
createPlanet('mars', 1.5*6, marsTexture, 200, 0.015/3, planetInfo.mars);
createPlanet('jupiter', 1.7*6, jupiterTexture, 240, 0.012/3, planetInfo.jupiter); 
createPlanet('neptune', 2*6, neptuneTexture, 320, 0.006/3, planetInfo.neptune); 

// Create stars
const starCount = 10000;
const stars = [];

function createStar() {
    const geometry = new THREE.SphereGeometry(0.4, 24, 24);
    const material = new THREE.MeshBasicMaterial({ 
        color: 0xffffff, 
        transparent: true,   
        depthWrite: false,
    });
    material.onBeforeCompile = (shader) => {
        shader.uniforms.time = { value: 0 };
        shader.fragmentShader = `
        uniform float time;
        ${shader.fragmentShader}
        `.replace(
            `void main() {`,
            `
            void main() {
                gl_FragColor = vec4(gl_FragColor.rgb, abs(sin(time)));
            `
        );
            material.userData.shader = shader;
        };
    
    const star = new THREE.Mesh(geometry, material);

    // Random star positioning
    const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(1000));
    star.position.set(x, y, z);

    // Adding a star to an array for subsequent twinkling
    stars.push({
        mesh: star,
        opacityDirection: 2.5, // Flicker direction (increase/decrease transparency)
        speed: Math.random() * 0.02 + 0.01, // random flicker speed
        maxOpacity: Math.random() * 0.8 + 0.5, // random maximum brightness
    });
    star.renderOrder = 0;
    scene.add(star);
}

for (let i = 0; i < starCount; i++) {
    createStar();
}


// Освещение
const pointLight = new THREE.PointLight(0xffffff, 2, 1000);
pointLight.position.set(0, 0, 0);
scene.add(pointLight);

// Добавление окружающего света
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4); // Мягкий свет с интенсивностью 0.3
scene.add(ambientLight);

// Второй источник света
const pointLight2 = new THREE.PointLight(0xffffff, 0.5, 500); // Более слабый свет
pointLight2.position.set(-200, 200, 300); // Светит с другой стороны
scene.add(pointLight2);

// Еще один источник света
const hemisphereLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
scene.add(hemisphereLight);


// Raycaster для отслеживания наведения на планеты
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const infoBox = document.getElementById('info');

// Анимация
function animate() {
    requestAnimationFrame(animate);

     // Обновление времени для мерцания звёзд
    stars.forEach((starData) => {
        if (starData.mesh.material.userData.shader) {
            starData.mesh.material.userData.shader.uniforms.time.value += 0.02;
        }
        const { mesh, opacityDirection, speed, maxOpacity } = starData;
        mesh.material.opacity += speed * opacityDirection;
        if (mesh.material.opacity >= maxOpacity || mesh.material.opacity <= 0) {
            starData.opacityDirection *= -1;
        }
    });



    //Рендер звезд
    stars.forEach((star) => {
        star.mesh.renderOrder = 0;
    });

    // Вращение Солнца
    sun.rotation.y += 0.002 / 3; // Уменьшение скорости вращения в 3 раза

    // Вращение планет вокруг Солнца и вокруг своей оси
    planets.forEach(planet => {
        // Вращение вокруг оси
        planet.rotation.y += 0.01 / 3; // Уменьшаем скорость вращения в 3 раза

        // Вращение по орбите
        planet.userData.angle += planet.userData.speed;
        planet.position.x = planet.userData.distance * Math.cos(planet.userData.angle);
        planet.position.z = planet.userData.distance * Math.sin(planet.userData.angle);
    });

    // Рендеринг планет
    planets.forEach((planet) => {
        planet.renderOrder = 1; // Планеты рендерятся после звезд
    });

    // Вращение Луны вокруг Земли
    const earth = planets.find(planet => planet.userData.info === planetInfo.earth); // Найти Землю
    if (earth) {
        moon.userData.angle += moon.userData.speed; // Обновление угла орбиты Луны
        moon.position.x = earth.position.x + moon.userData.distance * Math.cos(moon.userData.angle); // Луна вращается вокруг Земли по X
        moon.position.z = earth.position.z + moon.userData.distance * Math.sin(moon.userData.angle); // Луна вращается вокруг Земли по Z
    }

    // Отслеживание наведения мыши
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(planets.concat(moon));

    if (intersects.length > 0) {
        const planet = intersects[0].object;
        infoBox.style.display = 'block';
        infoBox.innerHTML = planet.userData.info;
        infoBox.style.left = `${mouse.x * (window.innerWidth / 2) + window.innerWidth / 2 + 20}px`;
        infoBox.style.top = `${-mouse.y * (window.innerHeight / 2) + window.innerHeight / 2 + 20}px`;
    } else {
        infoBox.style.display = 'none';
    }

    renderer.render(scene, camera);
}

animate();

// Обработчик движения мыши
window.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

// Адаптация рендеринга под изменение размеров окна
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});
