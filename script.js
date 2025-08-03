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

// 平滑滚动
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70; // 考虑导航栏高度
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
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

// 移动端菜单功能
function initMobileMenu() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuLinks = mobileMenu?.querySelectorAll('a');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            // 切换菜单状态
            mobileMenu.classList.toggle('hidden');
            
            // 汉堡菜单动画
            const bars = this.querySelectorAll('span');
            bars.forEach((bar, index) => {
                if (mobileMenu.classList.contains('hidden')) {
                    // 恢复原始状态
                    bar.style.transform = '';
                    bar.style.opacity = '';
                } else {
                    // 动画到X状态
                    if (index === 0) {
                        bar.style.transform = 'rotate(45deg) translate(5px, 5px)';
                    } else if (index === 1) {
                        bar.style.opacity = '0';
                    } else if (index === 2) {
                        bar.style.transform = 'rotate(-45deg) translate(7px, -6px)';
                    }
                }
            });
        });

        // 点击菜单链接时关闭菜单
        mobileMenuLinks?.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                const bars = mobileMenuButton.querySelectorAll('span');
                bars.forEach(bar => {
                    bar.style.transform = '';
                    bar.style.opacity = '';
                });
            });
        });
    }
}

// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('a[href^="#"]');

    console.log('Navigation elements found:', {
        navLinks: navLinks.length
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            console.log('Scrolling to:', targetId, 'found:', !!targetSection);
            
            if (targetSection) {
                // 使用scrollIntoView方法，这是最可靠的方法
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // 手动调整位置以考虑固定导航栏
                setTimeout(() => {
                    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
                    const navbarHeight = 64; // 导航栏高度
                    window.scrollTo(0, currentScroll - navbarHeight);
                }, 100);
            }
        });
    });
});

// 初始化导航栏滚动效果
function initNavbarScroll() {
    const navbar = document.querySelector('nav');
    if (!navbar) return;
    
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // 添加/移除背景色
        if (scrollTop > 50) {
            navbar.classList.add('bg-white/95');
            navbar.classList.remove('bg-white/80');
        } else {
            navbar.classList.remove('bg-white/95');
            navbar.classList.add('bg-white/80');
        }
        
        lastScrollTop = scrollTop;
    });
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
        colorItem.className = 'w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 transition-transform duration-200 hover:scale-110 cursor-pointer';
        
        const img = document.createElement('img');
        img.src = `22colors/${i}.svg`;
        img.alt = `Color ${i}`;
        img.className = 'w-full h-full object-cover opacity-0 transform translate-y-8 transition-all duration-700';
        img.style.animationDelay = `${i * 0.12}s`;
        
        colorItem.appendChild(img);
        colorContainer.appendChild(colorItem);
    }
}

// Cluster image switcher with percentage display
function initClusterSwitcher() {
    const clusterImg = document.getElementById('cluster-image');
    const clusterBtns = document.querySelectorAll('.cluster-btn');
    const gsvA = document.getElementById('gsv-img-a');
    const gsvB = document.getElementById('gsv-img-b');
    
    if (!clusterImg || !clusterBtns.length) return;
    
    clusterBtns.forEach((btn, idx) => {
        btn.addEventListener('click', function() {
            const imgName = this.getAttribute('data-img');
            const percentage = this.getAttribute('data-percentage');
            const n = idx + 1;
            
            // Update images
            clusterImg.src = 'cluster/' + imgName;
            if (gsvA && gsvB) {
                gsvA.src = `GSVimages/${n}a.jpg`;
                gsvB.src = `GSVimages/${n}b.jpg`;
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
    // 初始化所有功能
    initThreeJS();
    initScrollAnimations();
    initNavbarScroll();
    initCounterAnimation();
    initContactForm();
    initParallaxEffect();
    initColorCubeInteraction();
    initButtonEffects();
    initMobileMenu();
    generateColorPalette();
    initClusterSwitcher();
    initWeatherSwitcher();
    
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



 