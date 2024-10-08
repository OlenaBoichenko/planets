// Инициализация сцены
const scene = new THREE.Scene();

// Настройка камеры
const aspect = window.innerWidth / window.innerHeight;
const frustumSize = 450;
const camera = new THREE.OrthographicCamera(
    frustumSize * aspect / -2, 
    frustumSize * aspect / 2, 
    frustumSize / 2, 
    frustumSize / -2, 
    0.1, 
    1000
);
camera.position.z = 450;


// Рендерер
const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: false
});
renderer.setClearColor(0x000000, 1);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Загрузка текстур
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
// const moonTexture = textureLoader.load('img/moon.jpg');

// Создание Солнца с текстурой
const sunGeometry = new THREE.SphereGeometry(24 * 3, 32, 32); // Увеличили размер Солнца в 3 раза
const sunMaterial = new THREE.MeshBasicMaterial({ map: sunTexture });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Массив для хранения планет и информации о них
const planets = [];
const planetInfo = {
    mercury: 'Меркурий - самая близкая планета к Солнцу. Это маленькая и горячая планета.',
    venus: 'Венера - вторая планета от Солнца. Она известна своими густыми облаками.',
    earth: 'Земля - наш дом. Единственная планета, известная наличием жизни.',
    mars: 'Марс - Красная планета, возможное место для будущих колоний.',
    jupiter: 'Юпитер - самая большая планета Солнечной системы. Это газовый гигант с мощными штормами, самым известным из которых является Большое красное пятно.',
    saturn: 'Сатурн - вторая по величине планета в Солнечной системе, известная своими красивыми кольцами, состоящими из льда и камней.',
    neptune: 'Нептун - восьмая планета от Солнца, известная своими сильными ветрами и красивым голубым цветом. Это самая дальняя планета в Солнечной системе.',
    moon: 'Луна - единственный естественный спутник Земли. Она оказывает значительное влияние на приливы и отливы на Земле и является ближайшим космическим телом к нам.'
};

// Создаем Луну отдельно
const moonGeometry = new THREE.SphereGeometry(1.5 * 6, 32, 32); // Размер Луны
const moonMaterial = new THREE.MeshStandardMaterial({ map: moonTexture });
const moon = new THREE.Mesh(moonGeometry, moonMaterial);
moon.userData = { distance: 30, speed: 0.05 / 3, angle: 0, info: planetInfo.moon }; // Параметры орбиты Луны
scene.add(moon);


// Создаем геометрию колец Сатурна
const innerRadius = 2.9 * 6;  // Внутренний радиус кольца (чуть больше радиуса планеты)
const outerRadius = 4 * 6;    // Внешний радиус кольца
const ringGeometry = new THREE.RingGeometry(innerRadius, outerRadius, 64);

// Опционально: Загружаем текстуру для колец, если есть
const ringTexture = new THREE.TextureLoader().load('img/saturn_ring.jpg');

// Материал для колец
const ringMaterial = new THREE.MeshBasicMaterial({
  map: ringTexture,  // Если у вас есть текстура колец
  side: THREE.DoubleSide, // Кольца видны с обеих сторон
  
});

// Создаем меш для колец
const saturnRings = new THREE.Mesh(ringGeometry, ringMaterial);

// Устанавливаем кольца по оси xz, чтобы они лежали на "экваторе" планеты
saturnRings.rotation.x = Math.PI / 2; // Поворот кольца на 90 градусов



// Создаем Сатурн отдельно
const saturn = createPlanet('saturn', 1.8 * 6, saturnTexture, 315, 0.008 / 3, planetInfo.saturn);

// Добавляем кольца к Сатурну
saturn.add(saturnRings)

// Добавляем Сатурн с кольцами в сцену
scene.add(saturn);





// Функция для создания планеты с текстурой и информацией
function createPlanet(name, size, texture, distance, speed, info) {
    const planetGeometry = new THREE.SphereGeometry(size * 3, 32, 32); // Увеличили размер планет в 3 раза
    const planetMaterial = new THREE.MeshStandardMaterial({ 
        map: texture,
        roughness: 0.8,  // Делает поверхность менее блестящей
        metalness: 0.1   // Добавляет небольшой эффект металлического блеска
     });
    const planet = new THREE.Mesh(planetGeometry, planetMaterial);
    planet.userData = { distance: distance, speed: speed / 3, angle: Math.random() * Math.PI * 2, info: info }; // Уменьшаем скорость в 3 раза
    planets.push(planet);
    scene.add(planet);
    return planet;
}



// Создание планет с текстурами, физическими параметрами и информацией
createPlanet('mercury', 6, mercuryTexture, 90, 0.04/3, planetInfo.mercury); // Меркурий
createPlanet('venus', 1.1*6, venusTexture, 135, 0.03/3, planetInfo.venus); // Венера
createPlanet('earth', 1.3*6, earthTexture, 180, 0.02/3, planetInfo.earth); // Земля
createPlanet('mars', 1.5*6, marsTexture, 225, 0.015/3, planetInfo.mars); // Марс
createPlanet('jupiter', 1.7*6, jupiterTexture, 270, 0.012/3, planetInfo.jupiter);
createPlanet('neptune', 2*6, neptuneTexture, 360, 0.006/3, planetInfo.neptune);


// Освещение
const pointLight = new THREE.PointLight(0xffffff, 1, 1000);
pointLight.position.set(0, 0, 0);
scene.add(pointLight);

// Добавляем окружающий свет
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3); // Мягкий свет с интенсивностью 0.3
scene.add(ambientLight);

// Второй источник света
const pointLight2 = new THREE.PointLight(0xffffff, 0.5, 500); // Более слабый свет
pointLight2.position.set(-200, 200, 300); // Светит с другой стороны
scene.add(pointLight2);

// Raycaster для отслеживания наведения на планеты
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const infoBox = document.getElementById('info');

// Анимация
function animate() {
    requestAnimationFrame(animate);

    // Вращение Солнца
    sun.rotation.y += 0.002 / 3; // Уменьшаем скорость вращения в 3 раза

    // Вращение планет вокруг Солнца и вокруг своей оси
    planets.forEach(planet => {
        // Вращение вокруг оси
        planet.rotation.y += 0.01 / 3; // Уменьшаем скорость вращения в 3 раза

        // Вращение по орбите
        planet.userData.angle += planet.userData.speed;
        planet.position.x = planet.userData.distance * Math.cos(planet.userData.angle);
        planet.position.z = planet.userData.distance * Math.sin(planet.userData.angle);
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
