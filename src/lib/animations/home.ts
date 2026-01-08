import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

let pluginRegistered = false;

function ensureScrollTriggerRegistered() {
	if (pluginRegistered) return;
	gsap.registerPlugin(ScrollTrigger);
	pluginRegistered = true;
}

export function setupHomeGsapAnimations() {
	ensureScrollTriggerRegistered();

	return gsap.context(() => {
		// Hero animations
		gsap.from('.hero-badge', {
			opacity: 0,
			y: -30,
			duration: 0.8,
			ease: 'power3.out'
		});

		gsap.from('.title-line', {
			opacity: 0,
			x: -100,
			stagger: 0.2,
			duration: 1,
			ease: 'power4.out',
			delay: 0.3
		});

		gsap.from('.hero-subtitle', {
			opacity: 0,
			y: 20,
			duration: 0.8,
			delay: 0.8
		});

		gsap.from('.hero-tagline', {
			opacity: 0,
			y: 20,
			duration: 0.8,
			delay: 1
		});

		gsap.from('.cta-button', {
			opacity: 0,
			y: 30,
			stagger: 0.15,
			duration: 0.6,
			delay: 1.2
		});

		// Floating hex animation
		gsap.to('.hex-item', {
			y: -15,
			rotation: 5,
			stagger: {
				each: 0.1,
				repeat: -1,
				yoyo: true
			},
			duration: 2,
			ease: 'sine.inOut'
		});

		// Slash accent animations
		gsap.from('.slash', {
			scaleY: 0,
			stagger: 0.2,
			duration: 1.5,
			ease: 'power2.out',
			delay: 0.5
		});

		// Nav bar slide in
		gsap.from('.nav-bar', {
			y: -100,
			duration: 0.8,
			ease: 'power3.out'
		});

		// Quickstart banner
		gsap.from('.quickstart-banner', {
			opacity: 0,
			x: -50,
			duration: 0.8,
			scrollTrigger: {
				trigger: '.quickstart-banner',
				start: 'top 90%'
			}
		});

		// Section headers with diagonal reveal
		gsap.utils.toArray('.diagonal-header').forEach((header) => {
			gsap.from(header as Element, {
				opacity: 0,
				x: -80,
				skewX: -10,
				duration: 0.8,
				ease: 'power3.out',
				scrollTrigger: {
					trigger: header as Element,
					start: 'top 85%'
				}
			});
		});

		// Feature cards stagger animation
		gsap.utils.toArray('.feature-card').forEach((card, i) => {
			gsap.from(card as Element, {
				opacity: 0,
				y: 60,
				rotateX: -15,
				duration: 0.7,
				delay: i * 0.1,
				ease: 'power3.out',
				scrollTrigger: {
					trigger: card as Element,
					start: 'top 90%'
				}
			});
		});

		// Glance cards slide in from alternating sides
		gsap.utils.toArray('.glance-card').forEach((card, i) => {
			gsap.from(card as Element, {
				opacity: 0,
				x: i % 2 === 0 ? -80 : 80,
				duration: 0.7,
				ease: 'power3.out',
				scrollTrigger: {
					trigger: card as Element,
					start: 'top 88%'
				}
			});
		});

		// Loop steps cascade
		gsap.utils.toArray('.loop-step').forEach((step, i) => {
			gsap.from(step as Element, {
				opacity: 0,
				x: -100,
				duration: 0.8,
				delay: i * 0.2,
				ease: 'power3.out',
				scrollTrigger: {
					trigger: step as Element,
					start: 'top 85%'
				}
			});

			gsap.from((step as Element).querySelector('.marker-num'), {
				scale: 0,
				rotation: -180,
				duration: 0.6,
				delay: i * 0.2 + 0.3,
				ease: 'back.out(1.7)',
				scrollTrigger: {
					trigger: step as Element,
					start: 'top 85%'
				}
			});
		});

		// Piece cards with 3D flip
		gsap.utils.toArray('.piece-card').forEach((card, i) => {
			gsap.from(card as Element, {
				opacity: 0,
				rotateY: -90,
				transformPerspective: 1000,
				duration: 0.8,
				delay: i * 0.1,
				ease: 'power3.out',
				scrollTrigger: {
					trigger: card as Element,
					start: 'top 88%'
				}
			});
		});

		// Combat steps pop in
		gsap.utils.toArray('.combat-step').forEach((step, i) => {
			gsap.from(step as Element, {
				opacity: 0,
				scale: 0.5,
				duration: 0.6,
				delay: i * 0.15,
				ease: 'back.out(1.7)',
				scrollTrigger: {
					trigger: '.combat-steps',
					start: 'top 80%'
				}
			});
		});

		// UI Map regions
		gsap.utils.toArray('.ui-region').forEach((region, i) => {
			gsap.from(region as Element, {
				opacity: 0,
				scale: 0.8,
				duration: 0.6,
				delay: i * 0.1,
				ease: 'power3.out',
				scrollTrigger: {
					trigger: '.ui-map',
					start: 'top 80%'
				}
			});
		});

		// Action cards
		gsap.utils.toArray('.action-card').forEach((card, i) => {
			gsap.from(card as Element, {
				opacity: 0,
				y: 50,
				skewY: 5,
				duration: 0.7,
				delay: i * 0.15,
				ease: 'power3.out',
				scrollTrigger: {
					trigger: card as Element,
					start: 'top 88%'
				}
			});
		});

		// Next read section
		gsap.from('.next-read', {
			opacity: 0,
			scale: 0.9,
			rotateX: -10,
			duration: 0.8,
			ease: 'power3.out',
			scrollTrigger: {
				trigger: '.next-read',
				start: 'top 85%'
			}
		});

		// Footer slide up
		gsap.from('.footer', {
			opacity: 0,
			y: 50,
			duration: 0.8,
			scrollTrigger: {
				trigger: '.footer',
				start: 'top 95%'
			}
		});
	});
}

export function startFloatingSpirits() {
	ensureScrollTriggerRegistered();

	const allSpirits = gsap.utils.toArray('.floating-spirit') as HTMLElement[];
	if (allSpirits.length === 0) return;

	const spiritQueue = [...allSpirits].sort(() => Math.random() - 0.5);
	let queueIndex = 0;
	const activeSpirits = new Set<HTMLElement>();
	const maxActive = 10 + Math.floor(Math.random() * 5);

	function getNextSpirit(): HTMLElement {
		const spirit = spiritQueue[queueIndex];
		queueIndex = (queueIndex + 1) % spiritQueue.length;
		return spirit;
	}

	function activateNextSpirit() {
		if (activeSpirits.size < maxActive) {
			let attempts = 0;
			let nextSpirit = getNextSpirit();
			while (activeSpirits.has(nextSpirit) && attempts < spiritQueue.length) {
				nextSpirit = getNextSpirit();
				attempts++;
			}
			if (!activeSpirits.has(nextSpirit)) {
				gsap.delayedCall(Math.random(), () => animateSpirit(nextSpirit));
			}
		}
	}

	function animateSpirit(el: HTMLElement) {
		if (activeSpirits.has(el)) return;
		activeSpirits.add(el);

		const randomScale = 0.3 + Math.random() * 1.7;
		const displayDuration = 5 + Math.random() * 4;

		const entryEdge = Math.floor(Math.random() * 4);
		const exitEdge = (entryEdge + 1 + Math.floor(Math.random() * 3)) % 4;

		let startX = 0,
			startY = 0;
		switch (entryEdge) {
			case 0:
				startX = -200;
				startY = Math.random() * 400 - 100;
				break;
			case 1:
				startX = window.innerWidth + 100;
				startY = Math.random() * 400 - 100;
				break;
			case 2:
				startX = Math.random() * window.innerWidth - 200;
				startY = -200;
				break;
			case 3:
				startX = Math.random() * window.innerWidth - 200;
				startY = 500;
				break;
		}

		let endX = 0,
			endY = 0;
		switch (exitEdge) {
			case 0:
				endX = -200;
				endY = Math.random() * 400 - 100;
				break;
			case 1:
				endX = window.innerWidth + 100;
				endY = Math.random() * 400 - 100;
				break;
			case 2:
				endX = Math.random() * window.innerWidth - 200;
				endY = -200;
				break;
			case 3:
				endX = Math.random() * window.innerWidth - 200;
				endY = 500;
				break;
		}

		const midX1 = startX + (endX - startX) * 0.3 + (Math.random() * 200 - 100);
		const midY1 = startY + (endY - startY) * 0.3 + (Math.random() * 150 - 75);
		const midX2 = startX + (endX - startX) * 0.6 + (Math.random() * 200 - 100);
		const midY2 = startY + (endY - startY) * 0.6 + (Math.random() * 150 - 75);

		gsap.set(el, {
			x: startX,
			y: startY,
			scale: randomScale * 0.5,
			opacity: 0,
			rotation: Math.random() * 20 - 10
		});

		const tl = gsap.timeline({
			onComplete: () => {
				activeSpirits.delete(el);
				activateNextSpirit();
			}
		});

		tl.to(el, {
			x: midX1,
			y: midY1,
			opacity: 0.5 + Math.random() * 0.4,
			scale: randomScale,
			rotation: Math.random() * 15 - 7,
			duration: displayDuration * 0.3,
			ease: 'power2.out'
		});

		tl.to(el, {
			x: midX2,
			y: midY2,
			rotation: Math.random() * 15 - 7,
			duration: displayDuration * 0.4,
			ease: 'power1.inOut'
		});

		tl.to(el, {
			x: endX,
			y: endY,
			opacity: 0,
			scale: randomScale * 0.5,
			rotation: Math.random() * 20 - 10,
			duration: displayDuration * 0.3,
			ease: 'power2.in'
		});
	}

	for (let i = 0; i < maxActive; i++) {
		gsap.delayedCall((i * 800 + Math.random() * 500) / 1000, activateNextSpirit);
	}
}

export function setupMatSpiritsAnimation() {
	ensureScrollTriggerRegistered();

	const matContainer = document.querySelector('.mat-container') as HTMLElement | null;
	const matSpiritsEls = gsap.utils.toArray('.mat-spirit') as HTMLElement[];
	if (!matContainer || matSpiritsEls.length === 0) return;

	let animationStarted = false;

	function animateSingleSpirit(el: HTMLElement) {
		gsap.set(el, {
			x: -350 + (Math.random() - 0.5) * 120,
			y: (Math.random() - 0.5) * 120,
			scale: 0.5,
			opacity: 0,
			rotation: -20 + Math.random() * 10
		});

		const tl = gsap.timeline();

		tl.to(el, {
			x: 0,
			y: 0,
			scale: 1,
			opacity: 1,
			rotation: 0,
			duration: 1.2 + Math.random() * 0.4,
			ease: 'power2.out'
		});

		tl.to(el, {
			y: -3 + Math.random() * 6,
			rotation: -2 + Math.random() * 4,
			duration: 1.5 + Math.random() * 0.5,
			ease: 'sine.inOut',
			yoyo: true,
			repeat: 3
		});

		tl.to(el, {
			x: 350 + (Math.random() - 0.5) * 120,
			y: (Math.random() - 0.5) * 120,
			scale: 0.5,
			opacity: 0,
			rotation: 20 + Math.random() * 10,
			duration: 1.2 + Math.random() * 0.4,
			ease: 'power2.in'
		});

		tl.call(() => {
			gsap.delayedCall(0.3 + Math.random() * 0.5, () => {
				animateSingleSpirit(el);
			});
		});
	}

	function animateAllSpirits() {
		if (animationStarted) return;
		animationStarted = true;

		matSpiritsEls.forEach((el, index) => {
			gsap.set(el, {
				x: -350 + (Math.random() - 0.5) * 120,
				y: (Math.random() - 0.5) * 120,
				scale: 0.5,
				opacity: 0,
				rotation: -20 + Math.random() * 10
			});

			const delay = index * 0.25 + Math.random() * 0.15;
			const tl = gsap.timeline({ delay });

			tl.to(el, {
				x: 0,
				y: 0,
				scale: 1,
				opacity: 1,
				rotation: 0,
				duration: 1.2 + Math.random() * 0.4,
				ease: 'power2.out'
			});

			tl.to(el, {
				y: -3 + Math.random() * 6,
				rotation: -2 + Math.random() * 4,
				duration: 1.5 + Math.random() * 0.5,
				ease: 'sine.inOut',
				yoyo: true,
				repeat: 3
			});

			tl.to(el, {
				x: 350 + (Math.random() - 0.5) * 120,
				y: (Math.random() - 0.5) * 120,
				scale: 0.5,
				opacity: 0,
				rotation: 20 + Math.random() * 10,
				duration: 1.2 + Math.random() * 0.4,
				ease: 'power2.in'
			});

			tl.call(() => {
				gsap.delayedCall(0.3 + Math.random() * 0.5, () => {
					animateSingleSpirit(el);
				});
			});
		});
	}

	ScrollTrigger.create({
		trigger: matContainer,
		start: 'top 80%',
		onEnter: () => animateAllSpirits()
	});
}
