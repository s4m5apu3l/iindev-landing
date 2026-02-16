document.addEventListener('DOMContentLoaded', () => {
    const loadingScreen = document.getElementById('loadingScreen');
    const loadingLine = document.getElementById('loadingLine');
    const mainContent = document.getElementById('mainContent');
    const contactBlock = document.getElementById('contactBlock');
    const telegramContact = document.getElementById('telegramContact');
    const emailContact = document.getElementById('emailContact');
    const copyNotification = document.getElementById('copyNotification');
    const serviceModal = document.getElementById('serviceModal');
    const modalServiceName = document.getElementById('modalServiceName');
    const modalBody = document.getElementById('modalBody');
    const serviceLines = document.querySelectorAll('.service-line');
    const metricFills = document.querySelectorAll('.metric-fill');

    const serviceInfo = {
        'taxi': {
            name: './taxi',
            description: 'Taxi service optimized for Yakutsk conditions. Real-time routing, demand analysis, and cold-start algorithms for -50°C operations.'
        },
        'booking': {
            name: './booking',
            description: 'Smart booking system with automated scheduling, resource allocation, and analytics for seamless reservations.'
        },
        'masters': {
            name: './masters',
            description: 'Instant service matching platform. Connect with verified professionals in seconds. Optimized for local market.'
        },
        'ai-business': {
            description: 'Custom software solutions for business automation. Process optimization and intelligent decision support systems.',
            name: './ai-business'
        },
        'dev': {
            name: './dev',
            description: 'Full-stack development services. 1C integrations, Bitrix solutions, custom websites. Built for Siberian infrastructure.'
        },
        'widgets': {
            name: './widgets',
            description: 'Embeddable widgets for any platform. Lightweight, fast, and designed for extreme conditions. Plug-and-play integration.'
        }
    };

    function typeText(element, text, speed = 80) {
        return new Promise(resolve => {
            let i = 0;
            element.textContent = '';
            const interval = setInterval(() => {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                } else {
                    clearInterval(interval);
                    resolve();
                }
            }, speed);
        });
    }

    async function fetchWeather() {
        try {
            const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=62.0355&longitude=129.6755&current_weather=true');
            const data = await response.json();
            const temp = Math.round(data.current_weather.temperature);
            return `${temp}°C`;
        } catch (error) {
            console.log('Weather fetch failed, using default');
            return '—71°C';
        }
    }

    async function initLoading() {
        await typeText(loadingLine, 'iindev@yakutsk:~$ ./boot --cold-start', 80);
        // await new Promise(r => setTimeout(r, 200));
        
        // Загружаем погоду асинхронно в фоне
        fetchWeather().then(temp => {
            const weatherOutput = document.getElementById('weatherOutput');
            if (weatherOutput) {
                weatherOutput.innerHTML = `> YAKUTSK ${temp}`;
            }
        });
        
        // Сразу показываем экран, не ждем погоду
        gsap.to(loadingScreen, {
            opacity: 0,
            duration: 0.5,
            onComplete: () => {
                loadingScreen.classList.add('hidden');
                animateContent();
            }
        });
    }

    function animateContent() {
        mainContent.classList.add('visible');
        
        gsap.fromTo(mainContent, 
            { opacity: 0 },
            { opacity: 1, duration: 0.8, ease: 'power2.out' }
        );

        gsap.fromTo('.hero .terminal-line', 
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.4, stagger: 0.15, delay: 0.2 }
        );

        gsap.fromTo('.brand',
            { opacity: 0, y: 20 },
            { opacity: 0.95, y: 0, duration: 0.8, delay: 0.5 }
        );

        gsap.fromTo('.services .prompt-line',
            { opacity: 0 },
            { opacity: 1, duration: 0.4, delay: 0.8 }
        );

        gsap.fromTo('.service-line',
            { opacity: 0, x: -10 },
            { opacity: 1, x: 0, duration: 0.3, stagger: 0.05, delay: 0.9 }
        );

        metricFills.forEach(fill => {
            const value = parseInt(fill.dataset.value) || 100;
            gsap.to(fill, {
                width: `${value}%`,
                duration: 1,
                delay: 1.2,
                ease: 'power2.out'
            });
        });

        gsap.fromTo('.contact',
            { opacity: 0 },
            { opacity: 1, duration: 0.5, delay: 1.5 }
        );
    }

    serviceLines.forEach(line => {
        line.addEventListener('click', () => {
            const service = line.dataset.service;
            const info = serviceInfo[service];
            
            if (info) {
                modalServiceName.textContent = info.name;
                modalBody.textContent = info.description;
                serviceModal.classList.add('visible');
            }
        });
    });

    document.addEventListener('keydown', () => {
        if (serviceModal.classList.contains('visible')) {
            serviceModal.classList.remove('visible');
        }
    });

    serviceModal.addEventListener('click', (e) => {
        if (e.target === serviceModal) {
            serviceModal.classList.remove('visible');
        }
    });

    // Старый блок контактов - копирует t.me/iindev
    if (contactBlock) {
        contactBlock.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText('t.me/iindev');
                const notification = contactBlock.querySelector('.copy-notification');
                if (!notification) {
                    const notif = document.createElement('div');
                    notif.className = 'copy-notification visible';
                    notif.textContent = '> link copied';
                    contactBlock.appendChild(notif);
                    
                    setTimeout(() => {
                        notif.remove();
                    }, 2000);
                }
            } catch (err) {
                console.log('Copy failed');
            }
        });
    }

    // Копирование telegram при клике
    if (telegramContact) {
        telegramContact.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText('@iindev');
                copyNotification.classList.add('visible');
                
                setTimeout(() => {
                    copyNotification.classList.remove('visible');
                }, 2000);
            } catch (err) {
                console.log('Copy failed');
            }
        });
    }

    // Копирование email при клике
    if (emailContact) {
        emailContact.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText('iindev@tuta.io');
                copyNotification.classList.add('visible');
                
                setTimeout(() => {
                    copyNotification.classList.remove('visible');
                }, 2000);
            } catch (err) {
                console.log('Copy failed');
            }
        });
    }

    initLoading();
});
