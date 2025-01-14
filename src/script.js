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


// Creating a Sun with Texture
const sunGeometry = new THREE.SphereGeometry(24*2, 32, 32); // Увеличили размер Солнца в 3 раза
const sunMaterial = new THREE.MeshBasicMaterial({ map: sunTexture });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Array for storing planets and information about them
const planets = [];
const planetInfo = {
    mercury: 'Mercury is the closest planet to the Sun. This is a small and hot planet.',
    venus: 'Venus is the second planet from the Sun. It is known for its thick clouds.',
    earth: 'The Earth is our home. The only planet known to harbor life.',
    mars: 'Марс - Красная планета, возможное место для будущих колоний.',
    jupiter: 'Юпитер - самая большая планета Солнечной системы. Это газовый гигант с мощными штормами, самым известным из которых является Большое красное пятно.',
    saturn: 'Сатурн - вторая по величине планета в Солнечной системе, известная своими красивыми кольцами, состоящими из льда и камней.',
    neptune: 'Нептун - восьмая планета от Солнца, известная своими сильными ветрами и красивым голубым цветом. Это самая дальняя планета в Солнечной системе.',
    moon: 'Луна - единственный естественный спутник Земли. Она оказывает значительное влияние на приливы и отливы на Земле и является ближайшим космическим телом к нам.',
    saturnRings: 'Кольца Сатурна состоят из частиц льда, камней и пыли, и простираются на тысячи километров. Эти кольца видны даже с помощью небольшого телескопа.'
};

// Создание Луны
const moonGeometry = new THREE.SphereGeometry(1.5*3, 32, 32); // Размер Луны
const moonMaterial = new THREE.MeshStandardMaterial({ map: moonTexture });
const moon = new THREE.Mesh(moonGeometry, moonMaterial);
moon.userData = { distance: 30, speed: 0.05 / 3, angle: 0, info: planetInfo.moon }; // Параметры орбиты Луны
scene.add(moon);


// Создание колец Сатурна
const innerRadius = 3 * 6;  // Внутренний радиус кольца 
const outerRadius = 5 * 6;    // Внешний радиус кольца
const ringGeometry = new THREE.RingGeometry(innerRadius, outerRadius, 64);

// Текстура колец
const ringTexture = new THREE.TextureLoader().load('img/saturn_ring.jpg');

// Материал для колец
const ringMaterial = new THREE.MeshBasicMaterial({
  map: ringTexture, 
  side: THREE.DoubleSide, // Кольца видны с обеих сторон
  transparent: true,
});

// Создание меш для колец
const saturnRings = new THREE.Mesh(ringGeometry, ringMaterial);
saturnRings.userData = {info: planetInfo.saturnRings}

// Установка колец по оси xz, чтобы они лежали на "экваторе" планеты
saturnRings.rotation.x = Math.PI / 2; // Поворот кольца на 90 градусов

// Создание Сатурна
const saturn = createPlanet('saturn', 1.8*2.5, saturnTexture, 280, 0.008 / 3, planetInfo.saturn);
saturn.castShadow = true;

// Добавление колец к Сатурну
saturn.add(saturnRings)
scene.add(saturn);


// Создание планеты с текстурой и информацией
function createPlanet(name, size, texture, distance, speed, info) {
    const planetGeometry = new THREE.SphereGeometry(size*2.5, 35, 35); // Увеличение размера планет в 3 раза
    const planetMaterial = new THREE.MeshStandardMaterial({ 
        map: texture,
        roughness: 0.8,
        metalness: 0.1,  
        transparent: false,
        depthWrite: true, // Перезапись буфера глубины
        depthTest: true,
     });
    const planet = new THREE.Mesh(planetGeometry, planetMaterial);
    planet.userData = { distance: distance, speed: speed / 3, angle: Math.random() * Math.PI * 2, info: info }; // Уменьшение скорости в 3 раза
    planets.push(planet);
    planet.renderOrder = 1;
    scene.add(planet);
    return planet;
}

// Создание планет с текстурами, физическими параметрами и информацией
createPlanet('mercury', 6, mercuryTexture, 80, 0.04/3, planetInfo.mercury); // Меркурий
createPlanet('venus', 1.1*6, venusTexture, 120, 0.03/3, planetInfo.venus); // Венера
createPlanet('earth', 1.3*6, earthTexture, 160, 0.02/3, planetInfo.earth); // Земля
createPlanet('mars', 1.5*6, marsTexture, 200, 0.015/3, planetInfo.mars); // Марс
createPlanet('jupiter', 1.7*6, jupiterTexture, 240, 0.012/3, planetInfo.jupiter); // Юпитер 
createPlanet('neptune', 2*6, neptuneTexture, 320, 0.006/3, planetInfo.neptune); // Нептун

// Создание звёзд
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

    // Случайное позиционирование звезды
    const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(1000));
    star.position.set(x, y, z);

    // Добавление звезды в массив для последующего мерцания
    stars.push({
        mesh: star,
        opacityDirection: 2.5, // направление мерцания (увеличение/уменьшение прозрачности)
        speed: Math.random() * 0.02 + 0.01, // случайная скорость мерцания
        maxOpacity: Math.random() * 0.8 + 0.5, // случайная максимальная яркость
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

// Добавляем окружающий свет
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
    // stars.forEach((starData) => {
    //     if (starData.mesh.material.userData.shader) {
    //         starData.mesh.material.userData.shader.uniforms.time.value += 0.02;
    //     }
    //     const { mesh, opacityDirection, speed, maxOpacity } = starData;
    //     mesh.material.opacity += speed * opacityDirection;
    //     if (mesh.material.opacity >= maxOpacity || mesh.material.opacity <= 0) {
    //         starData.opacityDirection *= -1;
    //     }
    // });



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
