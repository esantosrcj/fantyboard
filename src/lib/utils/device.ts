/**
 * Device detection utilities for responsive design and touch optimization
 */

export function isMobilePhone(): boolean {
	if (typeof window === 'undefined') return false;

	// Check screen width - phones are typically under 768px, tablets 768px+
	const isSmallScreen = window.innerWidth < 768;

	// Check user agent for mobile indicators
	const userAgent = navigator.userAgent;
	const isMobileUA =
		/Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);

	// Exclude tablets from mobile detection
	const isTablet = /iPad|Android(?!.*Mobile)/i.test(userAgent);

	return isMobileUA && isSmallScreen && !isTablet;
}

export function isTablet(): boolean {
	if (typeof window === 'undefined') return false;

	const userAgent = navigator.userAgent;
	const isTabletUA = /iPad|Android(?!.*Mobile)/i.test(userAgent);
	const isMediumScreen = window.innerWidth >= 768 && window.innerWidth < 1200;

	return isTabletUA || isMediumScreen;
}

export function isDesktop(): boolean {
	if (typeof window === 'undefined') return false;

	return window.innerWidth >= 1200;
}

export function getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
	if (isMobilePhone()) return 'mobile';
	if (isTablet()) return 'tablet';
	return 'desktop';
}

export function isTouchDevice(): boolean {
	if (typeof window === 'undefined') return false;

	return (
		'ontouchstart' in window ||
		navigator.maxTouchPoints > 0 ||
		// @ts-expect-error - msMaxTouchPoints is legacy but still used
		navigator.msMaxTouchPoints > 0
	);
}

export function hasCoarsePointer(): boolean {
	if (typeof window === 'undefined') return false;

	// Check if the primary input mechanism has limited pointing accuracy
	return window.matchMedia('(pointer: coarse)').matches;
}

export function supportsHover(): boolean {
	if (typeof window === 'undefined') return false;

	// Check if the primary input mechanism can hover
	return window.matchMedia('(hover: hover)').matches;
}

export function getOptimalTouchTargetSize(): number {
	const deviceType = getDeviceType();

	switch (deviceType) {
		case 'mobile':
			return 44; // Apple's minimum recommendation
		case 'tablet':
			return 48; // Slightly larger for tablets
		default:
			return 32; // Standard for desktop
	}
}

export function shouldUseTouchOptimizations(): boolean {
	return isTouchDevice() && (isMobilePhone() || isTablet());
}
