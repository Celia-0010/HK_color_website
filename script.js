// 全局变量
let scene, camera, renderer, particles;
let mouseX = 0, mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;
let hasUserScrolled = false;
let hasTitleAnimated = false;

// 获取实际显示尺寸的函数
function getDisplaySize() {
    return {
        width: window.innerWidth,
        height: window.innerHeight
    };
}

// 初始化Three.js背景
function initThreeJS() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    // 创建场景
    scene = new THREE.Scene();

    // 获取显示尺寸
    const displaySize = getDisplaySize();
    
    // 创建相机
    camera = new THREE.PerspectiveCamera(75, displaySize.width / displaySize.height, 1, 1000);
    camera.position.z = 500;

    // 创建渲染器
    renderer = new THREE.WebGLRenderer({ 
        canvas: canvas,
        alpha: true,
        antialias: true 
    });
    renderer.setSize(displaySize.width, displaySize.height);
    renderer.setPixelRatio(window.devicePixelRatio);

    // 创建粒子系统
    createParticles();

    // 添加鼠标移动监听
    document.addEventListener('mousemove', onDocumentMouseMove, false);

    // 开始动画循环
    animate();
}

// 创建粒子系统
function createParticles() {
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    const colors = [];

    // 创建粒子位置和颜色
    for (let i = 0; i < 1000; i++) {
        vertices.push(
            Math.random() * 2000 - 1000,
            Math.random() * 2000 - 1000,
            Math.random() * 2000 - 1000
        );

        // 创建渐变色
        const color = new THREE.Color();
        color.setHSL(Math.random() * 0.3 + 0.5, 0.8, 0.5);
        colors.push(color.r, color.g, color.b);
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    // 创建材质
    const material = new THREE.PointsMaterial({
        size: 3,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    // 创建粒子系统
    particles = new THREE.Points(geometry, material);
    scene.add(particles);
}

// 鼠标移动事件
function onDocumentMouseMove(event) {
    mouseX = (event.clientX - windowHalfX) * 0.1;
    mouseY = (event.clientY - windowHalfY) * 0.1;
}

// 动画循环
function animate() {
    requestAnimationFrame(animate);

    // 旋转粒子系统
    if (particles) {
        particles.rotation.x += 0.001;
        particles.rotation.y += 0.002;

        // 根据鼠标位置调整旋转
        particles.rotation.x += mouseY * 0.0001;
        particles.rotation.y += mouseX * 0.0001;
    }

    renderer.render(scene, camera);
}

// 窗口大小调整
function onWindowResize() {
    const displaySize = getDisplaySize();
    windowHalfX = displaySize.width / 2;
    windowHalfY = displaySize.height / 2;

    if (camera && renderer) {
        camera.aspect = displaySize.width / displaySize.height;
        camera.updateProjectionMatrix();
        renderer.setSize(displaySize.width, displaySize.height);
    }
}



// 滚动动画
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // 观察需要动画的元素
    const animatedElements = document.querySelectorAll('[data-animate]');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// 数字计数动画
function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number');
    if (!counters || counters.length === 0) return;
    
    const animateCounter = (counter) => {
        const target = parseInt(counter.textContent.replace(/[^\d]/g, ''));
        const suffix = counter.textContent.replace(/[\d]/g, '');
        let current = 0;
        const increment = target / 100;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            counter.textContent = Math.floor(current) + suffix;
        }, 20);
    };

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

// 视差滚动效果
function initParallaxEffect() {
    const parallaxElements = document.querySelectorAll('.hero-background, .color-cube');
    if (!parallaxElements || parallaxElements.length === 0) return;
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            const yPos = -(scrolled * speed);
            if (element && element.style) {
                element.style.transform = `translateY(${yPos}px)`;
            }
        });
    });
}

// 色彩立方体交互
function initColorCubeInteraction() {
    const cube = document.querySelector('.color-cube');
    if (!cube) return;
    
    cube.addEventListener('mouseenter', () => {
        cube.style.animationPlayState = 'paused';
    });
        
    cube.addEventListener('mouseleave', () => {
        cube.style.animationPlayState = 'running';
    });
        
    cube.addEventListener('click', () => {
        cube.style.transform = 'scale(1.1) rotateX(360deg) rotateY(360deg)';
        setTimeout(() => {
            cube.style.transform = '';
        }, 1000);
    });
}

// 按钮点击效果
function initButtonEffects() {
    const buttons = document.querySelectorAll('.cta-button, .submit-button');
    if (!buttons || buttons.length === 0) return;
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // 创建涟漪效果
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// 打字机动画
function typeWriterEffect(element, text, speed = 35, callback) {
    let i = 0;
    function type() {
        if (i <= text.length) {
            element.innerHTML = text.slice(0, i).replace(/\n/g, '<br>');
            i++;
            setTimeout(type, speed);
        } else if (callback) {
            callback();
        }
    }
    type();
}

// 逐行显示 about section
function showAboutLinesSequentially() {
    const lines = document.querySelectorAll('[data-animate="about-line"]');
    let i = 0;
    function showNext() {
        if (i < lines.length) {
            lines[i].style.opacity = '1';
            lines[i].style.transform = 'translateY(0)';
            i++;
            setTimeout(showNext, 700); // 每行间隔，可调整
        }
    }
    showNext();
}

// 第二个 section 介绍内容随滚动逐行淡入
function showAboutLinesOnScroll() {
    const lines = document.querySelectorAll('[data-animate="about-line"]');
    if (!lines.length) return;

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    lines.forEach(line => observer.observe(line));
}





// 初始化联系表单
function initContactForm() {
    const contactForm = document.querySelector('#contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // 这里可以添加表单提交逻辑
            alert('感谢您的留言！我们会尽快回复。');
        });
    }
}

// 生成22种颜色
function generateColorPalette() {
    const colorContainer = document.querySelector('#colors .flex.flex-wrap');
    if (!colorContainer) return;

    for (let i = 1; i <= 22; i++) {
        const colorItem = document.createElement('div');
        colorItem.className = 'w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 transition-transform duration-200 hover:scale-110 cursor-pointer';
        
        const img = document.createElement('img');
        img.src = `22colors/${i}.svg`;
        img.alt = `Color ${i}`;
        img.className = 'w-full h-full object-cover opacity-0 transform translate-y-8 transition-all duration-700';
        
        colorItem.appendChild(img);
        colorContainer.appendChild(colorItem);
    }
    
    // 使用Intersection Observer触发颜色动画
    const colorsSection = document.querySelector('#colors');
    if (colorsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const colorImages = colorContainer.querySelectorAll('img');
                    colorImages.forEach((img, index) => {
                        setTimeout(() => {
                            img.style.opacity = '1';
                            img.style.transform = 'translateY(0)';
                        }, index * 120); // 每120ms触发一个
                    });
                    observer.disconnect(); // 只触发一次
                }
            });
        }, { threshold: 0.3 });
        
        observer.observe(colorsSection);
    }
}

// Cluster image switcher with percentage display
function initClusterSwitcher() {
    const clusterImg = document.getElementById('cluster-image');
    const clusterBarImg = document.getElementById('cluster-barplot-img');
    const clusterBtns = document.querySelectorAll('.cluster-btn');
    const gsvA = document.getElementById('gsv-img-a');
    const gsvB = document.getElementById('gsv-img-b');
    
    console.log('Cluster switcher elements found:', {
        clusterImg: !!clusterImg,
        clusterBarImg: !!clusterBarImg,
        clusterBtns: clusterBtns.length,
        gsvA: !!gsvA,
        gsvB: !!gsvB
    });
    
    if (!clusterImg || !clusterBtns.length) {
        console.error('Required cluster elements not found');
        return;
    }
    
    clusterBtns.forEach((btn, idx) => {
        btn.addEventListener('click', function() {
            const imgName = this.getAttribute('data-img');
            const percentage = this.getAttribute('data-percentage');
            const n = idx + 1;
            
            console.log('Cluster button clicked:', {
                buttonIndex: idx,
                imgName: imgName,
                percentage: percentage,
                clusterNumber: n
            });
            
            // Update cluster map image
            const newClusterSrc = 'cluster/' + imgName;
            clusterImg.src = newClusterSrc;
            console.log('Updated cluster map src:', newClusterSrc);
            
            // Update bar chart image
            if (clusterBarImg) {
                const newBarSrc = `cluster_bar/cluster_bar_plot_cluster${n}.svg`;
                clusterBarImg.src = newBarSrc;
                console.log('Updated bar chart src:', newBarSrc);
                
                // Add error handling for bar chart
                clusterBarImg.onerror = function() {
                    console.error('Failed to load bar chart:', newBarSrc);
                };
                clusterBarImg.onload = function() {
                    console.log('Bar chart loaded successfully:', newBarSrc);
                };
            } else {
                console.error('Cluster bar image element not found');
            }
            
            // Update GSV images
            if (gsvA && gsvB) {
                const gsvASrc = `GSVimages/${n}a.jpg`;
                const gsvBSrc = `GSVimages/${n}b.jpg`;
                gsvA.src = gsvASrc;
                gsvB.src = gsvBSrc;
                console.log('Updated GSV images:', gsvASrc, gsvBSrc);
            }
            
            // Update button states
            clusterBtns.forEach(b => {
                b.classList.remove('active', 'text-black', 'font-semibold');
                b.classList.add('text-gray-600');
                // Reset all buttons to their original text
                const originalBtnText = b.textContent === b.getAttribute('data-percentage') ? 
                    (b.getAttribute('data-img').includes('1') ? 'I' : 
                     b.getAttribute('data-img').includes('2') ? 'II' : 
                     b.getAttribute('data-img').includes('3') ? 'III' : 
                     b.getAttribute('data-img').includes('4') ? 'IV' : 
                     b.getAttribute('data-img').includes('5') ? 'V' : 'VI') : 
                    b.textContent;
                b.textContent = originalBtnText;
            });
            
            // Set active state and show percentage
            this.classList.add('active', 'text-black', 'font-semibold');
            this.classList.remove('text-gray-600');
            this.textContent = percentage;
        });
    });
    
    // 默认高亮第一个按钮
    if (clusterBtns[0]) {
        clusterBtns[0].classList.add('active', 'text-black', 'font-semibold');
        clusterBtns[0].classList.remove('text-gray-600');
    }
    
    // 测试文件是否存在
    testClusterFiles();
}

// 测试cluster文件是否存在
function testClusterFiles() {
    const testFiles = [
        'cluster/cluster_1_map.svg',
        'cluster/cluster_2_map.svg',
        'cluster/cluster_3_map.svg',
        'cluster/cluster_4_map.svg',
        'cluster/cluster_5_map.svg',
        'cluster/cluster_6_map.svg',
        'cluster_bar/cluster_bar_plot_cluster1.svg',
        'cluster_bar/cluster_bar_plot_cluster2.svg',
        'cluster_bar/cluster_bar_plot_cluster3.svg',
        'cluster_bar/cluster_bar_plot_cluster4.svg',
        'cluster_bar/cluster_bar_plot_cluster5.svg',
        'cluster_bar/cluster_bar_plot_cluster6.svg'
    ];
    
    testFiles.forEach(file => {
        fetch(file)
            .then(response => {
                if (response.ok) {
                    console.log(`✅ File exists: ${file}`);
                } else {
                    console.error(`❌ File not found: ${file}`);
                }
            })
            .catch(error => {
                console.error(`❌ Error loading file: ${file}`, error);
            });
    });
}

// Weather button switching functionality with percentage display
function initWeatherSwitcher() {
    const weatherBtns = document.querySelectorAll('.weather-btn');
    const weatherImage = document.getElementById('weather-display-image');
    
    if (!weatherBtns.length || !weatherImage) return;
    
    weatherBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const weather = this.getAttribute('data-weather');
            const percentage = this.getAttribute('data-percentage');
            
            // Update button states and text
            weatherBtns.forEach(b => {
                b.classList.remove('active', 'text-black', 'font-semibold');
                b.classList.add('text-gray-600');
                // Reset all buttons to their original text
                const originalBtnText = b.textContent === b.getAttribute('data-percentage') ? 
                    (b.getAttribute('data-weather') === 'sunny' ? 'Sunny' : 'Cloudy') : 
                    b.textContent;
                b.textContent = originalBtnText;
            });
            
            // Set active state and show percentage
            this.classList.add('active', 'text-black', 'font-semibold');
            this.classList.remove('text-gray-600');
            this.textContent = percentage;
            
            // Update image
            if (weather === 'sunny') {
                weatherImage.src = 'two_weather/sunnycolor-01-01.svg';
            } else if (weather === 'cloudy') {
                weatherImage.src = 'two_weather/cloudycolor-01-01.svg';
            }
        });
    });
    
    // 默认高亮第一个按钮
    if (weatherBtns[0]) {
        weatherBtns[0].classList.add('active', 'text-black', 'font-semibold');
        weatherBtns[0].classList.remove('text-gray-600');
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded - Initializing all features');
    
    // 初始化所有功能
    try {
        initThreeJS();
        console.log('✅ ThreeJS initialized');
    } catch (e) {
        console.error('❌ ThreeJS initialization failed:', e);
    }
    
    try {
        initScrollAnimations();
        console.log('✅ Scroll animations initialized');
    } catch (e) {
        console.error('❌ Scroll animations initialization failed:', e);
    }
    

    
    try {
        initCounterAnimation();
        console.log('✅ Counter animation initialized');
    } catch (e) {
        console.error('❌ Counter animation initialization failed:', e);
    }
    
    try {
        initContactForm();
        console.log('✅ Contact form initialized');
    } catch (e) {
        console.error('❌ Contact form initialization failed:', e);
    }
    
    try {
        initParallaxEffect();
        console.log('✅ Parallax effect initialized');
    } catch (e) {
        console.error('❌ Parallax effect initialization failed:', e);
    }
    
    try {
        initColorCubeInteraction();
        console.log('✅ Color cube interaction initialized');
    } catch (e) {
        console.error('❌ Color cube interaction initialization failed:', e);
    }
    
    try {
        initButtonEffects();
        console.log('✅ Button effects initialized');
    } catch (e) {
        console.error('❌ Button effects initialization failed:', e);
    }
    

    
    try {
        generateColorPalette();
        console.log('✅ Color palette generated');
    } catch (e) {
        console.error('❌ Color palette generation failed:', e);
    }
    
    try {
        initClusterSwitcher();
        console.log('✅ Cluster switcher initialized');
    } catch (e) {
        console.error('❌ Cluster switcher initialization failed:', e);
    }
    
    try {
        initWeatherSwitcher();
        console.log('✅ Weather switcher initialized');
    } catch (e) {
        console.error('❌ Weather switcher initialization failed:', e);
    }
    
    console.log('✅ All features initialized successfully');
    
    // 启动打字机动画，动画结束后设置 hasTitleAnimated
    var titleText = "AUTOMATED URBAN COLOR PALETTE GENERATION\n";
    var titleElem = document.getElementById('hero-typing-title');
    if (titleElem) {
        typeWriterEffect(titleElem, titleText, 35, function() {
            hasTitleAnimated = true;
            // 如果第一行已在视口且已滚轮，立即显示
            const firstLine = document.querySelector('[data-animate="about-line"]');
            if (firstLine && firstLine._pendingShow && hasUserScrolled) {
                setTimeout(() => {
                    firstLine.style.opacity = '1';
                    firstLine.style.transform = 'translateY(0)';
                }, 400);
                firstLine._pendingShow = false;
            }
        });
    }

    // 逐行显示 about section
    showAboutLinesSequentially();
    showAboutLinesOnScroll();
});

// 性能优化：节流函数
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// 应用节流到滚动事件
window.addEventListener('scroll', throttle(() => {
    // 滚动相关的性能敏感操作
}, 16)); // 约60fps

// 窗口大小调整事件
window.addEventListener('resize', throttle(() => {
    onWindowResize();
}, 100));



 