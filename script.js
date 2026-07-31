document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================================================
    // MOBILE NAVIGATION MENU
    // ==========================================================================
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const primaryNavigation = document.getElementById('primary-navigation');

    if (mobileNavToggle && primaryNavigation) {
        mobileNavToggle.addEventListener('click', () => {
            const isExpanded = mobileNavToggle.getAttribute('aria-expanded') === 'true';
            mobileNavToggle.setAttribute('aria-expanded', !isExpanded);
            primaryNavigation.classList.toggle('active');
        });

        // Close menu when clicking on nav links
        const navLinks = primaryNavigation.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileNavToggle.setAttribute('aria-expanded', 'false');
                primaryNavigation.classList.remove('active');
            });
        });
    }

    // ==========================================================================
    // SMART NAVBAR SHOW/HIDE ON SCROLL
    // ==========================================================================
    const header = document.getElementById('header');
    let lastScrollTop = 0;
    const scrollThreshold = 100;

    window.addEventListener('scroll', () => {
        let currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        
        if (currentScroll < 0) return; // For Safari bounce scroll
        
        if (currentScroll > lastScrollTop && currentScroll > scrollThreshold) {
            // Scrolling down - hide header
            header.classList.add('header-hidden');
        } else {
            // Scrolling up - show header
            header.classList.remove('header-hidden');
        }
        
        lastScrollTop = currentScroll;
    });

    // ==========================================================================
    // SCROLL REVEAL (INTERSECTION OBSERVER)
    // ==========================================================================
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target); // Reveal only once
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(element => {
            revealObserver.observe(element);
        });
    } else {
        // Fallback for older browsers
        revealElements.forEach(element => {
            element.classList.add('revealed');
        });
    }

    // ==========================================================================
    // FAQ ACCORDION
    // ==========================================================================
    const faqTriggers = document.querySelectorAll('.faq-trigger');

    faqTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
            const panelId = trigger.getAttribute('aria-controls');
            const panel = document.getElementById(panelId);
            
            // Close other open panels (optional, but keeps editorial style clean)
            faqTriggers.forEach(otherTrigger => {
                if (otherTrigger !== trigger && otherTrigger.getAttribute('aria-expanded') === 'true') {
                    otherTrigger.setAttribute('aria-expanded', 'false');
                    const otherPanelId = otherTrigger.getAttribute('aria-controls');
                    const otherPanel = document.getElementById(otherPanelId);
                    if (otherPanel) {
                        otherPanel.style.maxHeight = null;
                    }
                }
            });

            // Toggle current panel
            if (isExpanded) {
                trigger.setAttribute('aria-expanded', 'false');
                panel.style.maxHeight = null;
            } else {
                trigger.setAttribute('aria-expanded', 'true');
                // Calculate height dynamically for smooth CSS transition
                panel.style.maxHeight = panel.scrollHeight + 'px';
            }
        });
    });

    // ==========================================================================
    // EXIT INTENT & READING TIME POPUP
    // ==========================================================================
    const exitPopup = document.getElementById('exit-intent-popup');
    const closePopupBtn = document.getElementById('close-popup-btn');
    let popupShown = false;

    // Show popup helper
    const showPopup = () => {
        if (!popupShown) {
            exitPopup.classList.add('active');
            popupShown = true;
            localStorage.setItem('mapaLuzPopupShown', 'true');
        }
    };

    // Check if user already saw it in this session to be respectful
    const hasSeenPopup = localStorage.getItem('mapaLuzPopupShown') === 'true';

    if (exitPopup && !hasSeenPopup) {
        // 1. Exit Intent trigger (mouse leaves top of viewport)
        document.addEventListener('mouseleave', (e) => {
            if (e.clientY < 20) {
                showPopup();
            }
        });

        // 2. Reading time trigger (after 45 seconds of reading)
        setTimeout(() => {
            showPopup();
        }, 45000);
    }

    // Close Popup Actions
    if (closePopupBtn && exitPopup) {
        const closePopup = () => {
            exitPopup.classList.remove('active');
        };

        closePopupBtn.addEventListener('click', closePopup);
        
        // Close on clicking overlay background
        exitPopup.addEventListener('click', (e) => {
            if (e.target === exitPopup) {
                closePopup();
            }
        });

        // Close on Escape key press
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && exitPopup.classList.contains('active')) {
                closePopup();
            }
        });
    }

    // ==========================================================================
    // MODAL VIDEO SYSTEM (YOUTUBE INTEGRATION)
    // ==========================================================================
    const videoModal = document.getElementById('video-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const videoIframe = document.getElementById('modal-video-iframe');
    const videoCards = document.querySelectorAll('.video-card');

    if (videoModal && closeModalBtn && videoIframe) {
        const openModal = (videoId) => {
            const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
            videoIframe.setAttribute('src', embedUrl);
            videoModal.classList.add('active');
            videoModal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden'; // Stop page scrolling background
        };

        const closeModal = () => {
            videoModal.classList.remove('active');
            videoModal.setAttribute('aria-hidden', 'true');
            videoIframe.setAttribute('src', ''); // Clear src to stop video playback
            document.body.style.overflow = ''; // Re-enable scroll
        };

        videoCards.forEach(card => {
            card.addEventListener('click', () => {
                const videoId = card.getAttribute('data-video-id');
                if (videoId) {
                    openModal(videoId);
                }
            });
        });

        closeModalBtn.addEventListener('click', closeModal);
        
        // Close on clicking backdrop
        videoModal.addEventListener('click', (e) => {
            if (e.target === videoModal) {
                closeModal();
            }
        });

        // Close on Esc key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && videoModal.classList.contains('active')) {
                closeModal();
            }
        });
    }

    // ==========================================================================
    // SIMULATED CHECKOUT REDIRECTION
    // ==========================================================================
    const checkoutButtons = document.querySelectorAll('.simulated-checkout-btn');
    checkoutButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            alert('Você seria direcionado para a página de checkout seguro para adquirir a Jornada Mapa da Luz por R$ 559,90.');
        });
    });

    // ==========================================================================
    // SMOOTH INTERNAL ANCHOR SCROLLING
    // ==========================================================================
    const scrollButtons = document.querySelectorAll('.scroll-to-btn');
    scrollButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = btn.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = header.offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ==========================================================================
    // AMBIENT STARBURST BACKGROUND ANIMATION (VANILLA JS CONVERSION)
    // ==========================================================================
    class StarBurst {
        constructor(canvas, props = {}) {
            this.canvas = canvas;
            this.ctx = canvas.getContext('2d');
            if (!this.ctx) return;

            this.props = {
                speed: 10,
                starCount: 100,
                color: "#FFFFFF",
                centerX: 50,
                centerY: 100,
                starSize: 12,
                opacity: 50,
                flowerIntensity: 10,
                twinkleSpeed: 4,
                ...props
            };

            this.container = canvas.parentElement;
            this.size = { w: 0, h: 0, dpr: 1 };
            this.rafId = null;
            this.timeSec = 0;
            
            // Respect accessibility settings
            this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

            this.init();
        }

        parseColor(input) {
            if (!input) return [255, 255, 255];
            const s = input.trim();
            if (s.startsWith("#")) {
                let hex = s.slice(1);
                if (hex.length === 3) {
                    hex = hex.split("").map((c) => c + c).join("");
                }
                const num = parseInt(hex, 16);
                return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
            }
            return [255, 255, 255];
        }

        init() {
            const cStar = this.parseColor(this.props.color);
            
            this.safeSpeed = Math.max(0, this.props.speed / 10);
            this.safeCenterX = Math.max(0, Math.min(1, this.props.centerX / 100));
            this.safeCenterY = Math.max(0, Math.min(1, this.props.centerY / 100));
            this.safeStarSize = Math.max(0.01, this.props.starSize / 20);
            this.safeOpacity = Math.max(0, Math.min(1, this.props.opacity / 100));
            this.safeFlowerIntensity = Math.max(0, this.props.flowerIntensity / 20);
            this.safeTwinkleSpeed = Math.max(0, this.props.twinkleSpeed / 20);

            // Seeded Mulberry32 RNG
            const makeRng = (seed) => {
                let s = seed >>> 0;
                return () => {
                    s = (s + 0x6d2b79f5) >>> 0;
                    let t = s;
                    t = Math.imul(t ^ (t >>> 15), t | 1);
                    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
                    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
                };
            };
            const rng = makeRng(0xbadf00d);

            let sCount = Math.max(0, Math.floor(this.props.starCount));
            if (window.innerWidth < 768) {
                sCount = Math.min(30, sCount); // Optimize starburst rays for mobile performance
            }
            const pulsesPerSpoke = 15;
            const MAX_TOTAL = 3000;
            this.nSpokes = sCount;
            this.perSpoke = pulsesPerSpoke;
            if (this.nSpokes * this.perSpoke > MAX_TOTAL) {
                this.perSpoke = Math.max(1, Math.floor(MAX_TOTAL / Math.max(1, this.nSpokes)));
            }
            this.particleCount = this.nSpokes * this.perSpoke;

            this.spokeAngle = new Float32Array(this.nSpokes);
            this.spokeCos = new Float32Array(this.nSpokes);
            this.spokeSin = new Float32Array(this.nSpokes);
            for (let i = 0; i < this.nSpokes; i++) {
                const baseAngle = (i / Math.max(1, this.nSpokes)) * Math.PI * 2;
                const jitter = (rng() - 0.5) * 0.02;
                this.spokeAngle[i] = baseAngle + jitter;
                this.spokeCos[i] = Math.cos(this.spokeAngle[i]);
                this.spokeSin[i] = Math.sin(this.spokeAngle[i]);
            }

            this.pSpokeIdx = new Uint16Array(this.particleCount);
            this.pT = new Float32Array(this.particleCount);
            this.pSpeed = new Float32Array(this.particleCount);
            this.pSize = new Float32Array(this.particleCount);
            this.pPhase = new Float32Array(this.particleCount);

            for (let i = 0; i < this.particleCount; i++) {
                this.pSpokeIdx[i] = i % this.nSpokes;
                this.pT[i] = -0.05 + rng() * 1.1;
                this.pSpeed[i] = (0.5 + rng() * 1.0) * 0.25;
                this.pSize[i] = 0.7 + rng() * 0.8;
                this.pPhase[i] = rng() * Math.PI * 2;
            }

            // Pre-bake linear gradient streak onto offscreen canvas for top performance
            this.SPRITE_LEN = 64;
            this.streak = document.createElement("canvas");
            this.streak.width = this.SPRITE_LEN;
            this.streak.height = 2;
            const sctx = this.streak.getContext("2d");
            if (sctx) {
                const g = sctx.createLinearGradient(0, 0, this.SPRITE_LEN, 0);
                g.addColorStop(0, `rgba(${cStar[0]},${cStar[1]},${cStar[2]},0)`);
                g.addColorStop(0.7, `rgba(${cStar[0]},${cStar[1]},${cStar[2]},0.4)`);
                g.addColorStop(1, `rgba(${cStar[0]},${cStar[1]},${cStar[2]},0.8)`);
                sctx.fillStyle = g;
                sctx.fillRect(0, 0, this.SPRITE_LEN, 2);
            }

            this.resize();
            this.resizeObserver = new ResizeObserver(() => this.resize());
            this.resizeObserver.observe(this.container);

            if (!this.isReducedMotion) {
                this.lastT = performance.now();
                this.loop = (t) => {
                    const deltaSec = (t - this.lastT) / 1000;
                    this.lastT = t;
                    this.drawFrame(deltaSec);
                    this.rafId = requestAnimationFrame(this.loop);
                };
                this.rafId = requestAnimationFrame(this.loop);
            } else {
                this.drawFrame(0.016);
            }

            this.motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
            this.motionListener = (e) => {
                this.isReducedMotion = e.matches;
                if (this.isReducedMotion) {
                    if (this.rafId) cancelAnimationFrame(this.rafId);
                    this.drawFrame(0.016);
                } else {
                    this.lastT = performance.now();
                    this.rafId = requestAnimationFrame(this.loop);
                }
            };
            this.motionQuery.addEventListener('change', this.motionListener);
        }

        resize() {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            const rectW = this.container.clientWidth || window.innerWidth;
            const rectH = this.container.clientHeight || window.innerHeight;
            const w = Math.max(1, rectW);
            const h = Math.max(1, rectH);
            this.size = { w, h, dpr };
            this.canvas.width = Math.floor(w * dpr);
            this.canvas.height = Math.floor(h * dpr);
            this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }

        drawFrame(deltaSec) {
            const { w, h, dpr } = this.size;
            const dt = Math.max(0.001, Math.min(0.05, deltaSec));
            
            if (!this.isReducedMotion) {
                this.timeSec += dt;
            }

            if (w < 2 || h < 2) return;

            const cx = this.safeCenterX * w;
            const cy = this.safeCenterY * h;
            const R = Math.sqrt(w * w + h * h);

            this.ctx.globalCompositeOperation = "source-over";
            this.ctx.clearRect(0, 0, w, h);

            // Center Flower Bloom
            const bloomAlpha = this.safeFlowerIntensity * this.safeOpacity;
            const cStar = this.parseColor(this.props.color);
            
            if (bloomAlpha > 0.001) {
                const minDim = Math.min(w, h);
                const bloomR = Math.max(
                    8,
                    minDim *
                        0.15 *
                        (this.safeFlowerIntensity * 0.5 + 0.5) *
                        (0.6 + this.safeStarSize * 0.4)
                );
                const a = Math.min(1, bloomAlpha);
                const fGrad = this.ctx.createRadialGradient(cx, cy, 0, cx, cy, bloomR);
                fGrad.addColorStop(0, `rgba(${cStar[0]},${cStar[1]},${cStar[2]},${a})`);
                fGrad.addColorStop(0.3, `rgba(${cStar[0]},${cStar[1]},${cStar[2]},${a * 0.4})`);
                fGrad.addColorStop(0.7, `rgba(${cStar[0]},${cStar[1]},${cStar[2]},${a * 0.1})`);
                fGrad.addColorStop(1, `rgba(${cStar[0]},${cStar[1]},${cStar[2]},0)`);
                this.ctx.fillStyle = fGrad;
                this.ctx.fillRect(cx - bloomR, cy - bloomR, bloomR * 2, bloomR * 2);
            }

            // Draw Spoke Streaks
            for (let i = 0; i < this.particleCount; i++) {
                if (!this.isReducedMotion) {
                    this.pT[i] += this.pSpeed[i] * this.safeSpeed * dt;
                    if (this.pT[i] > 1.1) {
                        this.pT[i] = -0.05 - Math.random() * 0.05;
                    }
                }

                const t = this.pT[i];
                if (t < 0 || t >= 1.0) continue;

                const twinkle = this.isReducedMotion ? 0.95 : (0.7 + 0.3 * Math.sin(this.timeSec * this.safeTwinkleSpeed * 6 + this.pPhase[i]));
                
                let fade;
                if (t < 0.06) {
                    fade = t / 0.06;
                } else if (t < 0.85) {
                    fade = 1;
                } else {
                    fade = 1 - (t - 0.85) / 0.15;
                }

                const a = Math.min(1, twinkle * fade * (1 + 0.5 * t) * this.safeOpacity);
                if (a < 0.005) continue;

                const dist = t * R;
                const sIdx = this.pSpokeIdx[i];
                const cosA = this.spokeCos[sIdx];
                const sinA = this.spokeSin[sIdx];

                const px = cx + cosA * dist;
                const py = cy + sinA * dist;
                const speedFactor = this.pSpeed[i] / 0.25;
                const lineLen = (8 + 12 * speedFactor) * (0.7 + 0.6 * this.pSize[i] * this.safeStarSize);

                this.ctx.setTransform(
                    dpr * cosA,
                    dpr * sinA,
                    -dpr * sinA,
                    dpr * cosA,
                    dpr * px,
                    dpr * py
                );
                this.ctx.globalAlpha = a;
                this.ctx.drawImage(this.streak, -lineLen, -0.5, lineLen, 1);
            }

            this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            this.ctx.globalAlpha = 1;
        }

        destroy() {
            if (this.rafId) cancelAnimationFrame(this.rafId);
            if (this.resizeObserver) this.resizeObserver.disconnect();
            this.motionQuery.removeEventListener('change', this.motionListener);
        }
    }

    const starburstCanvas = document.getElementById('ambient-starburst-canvas');
    if (starburstCanvas) {
        new StarBurst(starburstCanvas, {
            speed: 2.0,          // Movimento sutil, porém visível
            starCount: 80,       // Maior número de feixes
            color: "#C5A880",    // Tom dourado da identidade visual
            centerX: 50,         // Centralizado horizontalmente
            centerY: 12,         // Próximo ao topo (emanando do cabeçalho)
            starSize: 10,        // Tamanho de feixes mais aparente
            opacity: 85,         // Alta opacidade interna das partículas
            flowerIntensity: 18, // Brilho radial central marcante
            twinkleSpeed: 3      // Velocidade do pulsar sereno
        });
    }
});
