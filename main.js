document.addEventListener('DOMContentLoaded', () => {
    const terminalOutput = document.getElementById('terminalOutput');
    const terminalInput = document.getElementById('terminalInput');
    const inputDisplay = document.getElementById('inputDisplay');
    const inputLine = document.getElementById('inputLine');
    const serviceModal = document.getElementById('serviceModal');
    const modalServiceName = document.getElementById('modalServiceName');
    const modalBody = document.getElementById('modalBody');

    let commandHistory = [];
    let historyIndex = -1;
    let isAnimating = false;

    // Update display when input changes
    terminalInput.addEventListener('input', () => {
        inputDisplay.textContent = terminalInput.value;
    });

    const serviceInfo = {
        'taxi': {
            name: 'taxi',
            description: 'Taxi service optimized for Yakutsk conditions. Real-time routing, demand analysis, and cold-start algorithms for -50°C operations.'
        },
        'booking': {
            name: 'booking',
            description: 'Smart booking system with automated scheduling, resource allocation, and analytics for seamless reservations.'
        },
        'masters': {
            name: 'masters',
            description: 'Instant service matching platform. Connect with verified professionals in seconds. Optimized for local market.'
        },
        'ai-business': {
            name: 'ai-business',
            description: 'Custom software solutions for business automation. Process optimization and intelligent decision support systems.'
        },
        'dev': {
            name: 'dev',
            description: 'Full-stack development services. 1C integrations, Bitrix solutions, custom websites. Built for Siberian infrastructure.'
        },
        'widgets': {
            name: 'widgets',
            description: 'Embeddable widgets for any platform. Lightweight, fast, and designed for extreme conditions. Plug-and-play integration.'
        }
    };

    async function fetchWeather() {
        try {
            const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=62.0355&longitude=129.6755&current_weather=true');
            const data = await response.json();
            const temp = Math.round(data.current_weather.temperature);
            return `${temp}°C`;
        } catch (error) {
            return '—71°C';
        }
    }

    function addLine(content, className = '') {
        const line = document.createElement('div');
        line.className = `terminal-line ${className}`;
        line.innerHTML = content;
        terminalOutput.appendChild(line);
        scrollToBottom();
        return line;
    }

    function scrollToBottom() {
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
        });
    }

    async function typeCommand(command, speed = 50) {
        isAnimating = true;
        terminalInput.disabled = true;
        
        for (let i = 0; i < command.length; i++) {
            terminalInput.value += command[i];
            inputDisplay.textContent = terminalInput.value;
            await new Promise(r => setTimeout(r, speed));
        }
        
        await new Promise(r => setTimeout(r, 300));
        await executeCommand(command, true);
        
        terminalInput.value = '';
        inputDisplay.textContent = '';
        terminalInput.disabled = false;
        isAnimating = false;
        terminalInput.focus();
    }

    async function executeCommand(input, isAuto = false) {
        const parts = input.trim().split(/\s+/);
        const cmd = parts[0].toLowerCase();
        const args = parts.slice(1);

        if (!isAuto) {
            addLine(`<span class="prompt">user@iindev:~$</span> <span class="command">${input}</span>`);
            commandHistory.push(input);
            historyIndex = commandHistory.length;
        }

        if (cmd === '') return;

        const commands = {
            'help': () => {
                addLine(`<span class="output">Available commands:</span>`);
                addLine(``);
                addLine(`<span class="help-line"><span class="help-cmd">help</span><span class="help-desc">show this help</span></span>`);
                addLine(`<span class="help-line"><span class="help-cmd">about</span><span class="help-desc">about iindev studio</span></span>`);
                addLine(`<span class="help-line"><span class="help-cmd">services</span><span class="help-desc">list all services</span></span>`);
                addLine(`<span class="help-line"><span class="help-cmd">open &lt;service&gt;</span><span class="help-desc">open service details</span></span>`);
                addLine(`<span class="help-line"><span class="help-cmd">contact</span><span class="help-desc">show contact info</span></span>`);
                addLine(`<span class="help-line"><span class="help-cmd">metrics</span><span class="help-desc">show performance metrics</span></span>`);
                addLine(`<span class="help-line"><span class="help-cmd">weather</span><span class="help-desc">current Yakutsk weather</span></span>`);
                addLine(`<span class="help-line"><span class="help-cmd">clear</span><span class="help-desc">clear terminal</span></span>`);
            },
            'about': () => {
                addLine(`<span class="brand-inline"><span style="color: #A0F0E2;">iind</span>ev.</span>`);
                addLine(`<span class="output-muted">Development Studio — Yakutsk, Russia</span>`);
                addLine(``);
                addLine(`<span class="output">We build software that works in extreme conditions.</span>`);
                addLine(`<span class="output">From -71°C to 24/7 operations.</span>`);
                addLine(``);
                addLine(`<span class="output-muted">Specialization:</span>`);
                addLine(`<span class="output">  • Web Development</span>`);
                addLine(`<span class="output">  • AI Solutions</span>`);
                addLine(`<span class="output">  • Business Automation</span>`);
                addLine(`<span class="output">  • 1C/Bitrix Integration</span>`);
                addLine(`<span class="output">  • Custom Software</span>`);
            },
            'services': () => {
                addLine(`<span class="output-muted">iindev@yakutsk:~/services$ ls -la</span>`);
                addLine(``);
                Object.entries(serviceInfo).forEach(([key, info]) => {
                    const line = addLine(`<span class="service-item" data-service="${key}"><span class="arrow">→</span> <span class="service-name">${key}/</span></span>`);
                    line.querySelector('.service-item').addEventListener('click', () => {
                        openServiceModal(key);
                    });
                });
                addLine(``);
                addLine(`<span class="output-muted">Type 'open &lt;service&gt;' for details</span>`);
            },
            'open': (args) => {
                const service = args[0];
                if (service && serviceInfo[service]) {
                    openServiceModal(service);
                    addLine(`<span class="output-success">→ opened: ${service}</span>`);
                } else {
                    addLine(`<span class="output-error">service not found: ${service || '(none)'}</span>`);
                    addLine(`<span class="output-muted">Available: ${Object.keys(serviceInfo).join(', ')}</span>`);
                }
            },
            'contact': () => {
                addLine(`<span class="output-muted">iindev@yakutsk:~/contact$ cat info.txt</span>`);
                addLine(``);
                const tgLine = addLine(`<span class="contact-item" data-copy="@iindev"><span class="contact-label">telegram:</span> <span class="contact-value">@iindev</span></span>`);
                const emailLine = addLine(`<span class="contact-item" data-copy="iindev@tuta.io"><span class="contact-label">email:</span> <span class="contact-value">iindev@tuta.io</span></span>`);
                
                [tgLine, emailLine].forEach(line => {
                    const item = line.querySelector('.contact-item');
                    item.addEventListener('click', async () => {
                        const text = item.dataset.copy;
                        try {
                            await navigator.clipboard.writeText(text);
                            addLine(`<span class="output-success">→ copied: ${text}</span>`);
                        } catch {
                            addLine(`<span class="output-error">→ copy failed</span>`);
                        }
                    });
                });
            },
            'metrics': () => {
                addLine(`<span class="output-muted">System Performance Metrics</span>`);
                addLine(``);
                addLine(`<span class="metric-line"><span class="metric-label">QUALITY:</span> <span class="metric-bar-text">[████████████████████] 100%</span></span>`);
                addLine(`<span class="metric-line"><span class="metric-label">SPEED:</span>   <span class="metric-bar-text">[████████████████████] 100%</span></span>`);
                addLine(`<span class="metric-line"><span class="metric-label">UPTIME:</span>  <span class="metric-bar-text">[████████████████████] 99.9%</span></span>`);
                addLine(``);
                addLine(`<span class="output-muted">iindev.core v2.6 — stable kernel</span>`);
            },
            'weather': async () => {
                addLine(`<span class="output-muted">Fetching Yakutsk weather...</span>`);
                const temp = await fetchWeather();
                addLine(`<span class="output">→ YAKUTSK ${temp}</span>`);
            },
            'clear': () => {
                terminalOutput.innerHTML = '';
            }
        };

        if (commands[cmd]) {
            await commands[cmd](args);
        } else {
            addLine(`<span class="output-error">command not found: ${cmd}</span>`);
            addLine(`<span class="output-muted">Type 'help' for available commands</span>`);
        }

        scrollToBottom();
    }

    function openServiceModal(service) {
        const info = serviceInfo[service];
        if (info) {
            modalServiceName.textContent = `./${info.name}`;
            modalBody.textContent = info.description;
            serviceModal.classList.add('visible');
        }
    }

    // Terminal input handler
    terminalInput.addEventListener('keydown', async (e) => {
        if (isAnimating) {
            e.preventDefault();
            return;
        }

        if (e.key === 'Enter') {
            const input = terminalInput.value.trim();
            terminalInput.value = '';
            inputDisplay.textContent = '';
            if (input) {
                await executeCommand(input);
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (historyIndex > 0) {
                historyIndex--;
                terminalInput.value = commandHistory[historyIndex];
                inputDisplay.textContent = terminalInput.value;
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                terminalInput.value = commandHistory[historyIndex];
                inputDisplay.textContent = terminalInput.value;
            } else {
                historyIndex = commandHistory.length;
                terminalInput.value = '';
                inputDisplay.textContent = '';
            }
        }
    });

    // Modal close handlers
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && serviceModal.classList.contains('visible')) {
            serviceModal.classList.remove('visible');
        }
    });

    serviceModal.addEventListener('click', (e) => {
        if (e.target === serviceModal) {
            serviceModal.classList.remove('visible');
        }
    });

    // Focus input on click anywhere
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.service-modal') && !isAnimating) {
            terminalInput.focus();
        }
    });

    // Boot sequence
    async function bootSequence() {
        await new Promise(r => setTimeout(r, 300));
        
        addLine(`<span class="output-muted">iindev@yakutsk:~$ ./boot --cold-start</span>`);
        await new Promise(r => setTimeout(r, 400));
        
        const weatherLine = addLine(`<span class="output">→ YAKUTSK <span class="temp-loader"><span class="loader-dot"></span><span class="loader-dot"></span><span class="loader-dot"></span></span></span>`);
        
        fetchWeather().then(temp => {
            weatherLine.innerHTML = `<span class="output">→ YAKUTSK ${temp}</span>`;
        });
        
        await new Promise(r => setTimeout(r, 800));
        addLine(`<span class="output-success">→ system ready</span>`);
        addLine(``);
        
        await new Promise(r => setTimeout(r, 400));
        await typeCommand('about', 40);
        
        await new Promise(r => setTimeout(r, 600));
        addLine(``);
        await typeCommand('services', 40);
        
        await new Promise(r => setTimeout(r, 600));
        addLine(``);
        await typeCommand('contact', 40);
        
        await new Promise(r => setTimeout(r, 600));
        addLine(``);
        addLine(`<span class="output-muted">Type 'help' for available commands</span>`);
        addLine(``);
        
        terminalInput.focus();
    }

    bootSequence();
});
