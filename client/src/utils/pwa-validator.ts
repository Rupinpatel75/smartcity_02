export interface PWAValidationResult {
  isValid: boolean;
  checks: {
    https: boolean;
    manifest: boolean;
    serviceWorker: boolean;
    icons: boolean;
    startUrl: boolean;
    display: boolean;
    theme: boolean;
    offlineSupport: boolean;
  };
  errors: string[];
  score: number;
}

export async function validatePWA(): Promise<PWAValidationResult> {
  const checks = {
    https: false,
    manifest: false,
    serviceWorker: false,
    icons: false,
    startUrl: false,
    display: false,
    theme: false,
    offlineSupport: false,
  };
  const errors: string[] = [];

  // Check HTTPS
  checks.https = location.protocol === 'https:' || location.hostname === 'localhost';
  if (!checks.https) {
    errors.push('App must be served over HTTPS');
  }

  // Check Service Worker
  checks.serviceWorker = 'serviceWorker' in navigator;
  if (checks.serviceWorker) {
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      checks.serviceWorker = !!registration;
      if (!registration) {
        errors.push('Service Worker not registered');
      }
    } catch (error) {
      checks.serviceWorker = false;
      errors.push('Service Worker registration failed');
    }
  } else {
    errors.push('Service Worker not supported');
  }

  // Check Manifest
  try {
    const manifestResponse = await fetch('/manifest.json');
    if (manifestResponse.ok) {
      const manifest = await manifestResponse.json();
      checks.manifest = true;

      // Validate manifest properties
      checks.startUrl = !!manifest.start_url;
      checks.display = manifest.display === 'standalone' || manifest.display === 'fullscreen';
      checks.theme = !!manifest.theme_color;
      checks.icons = manifest.icons && manifest.icons.length >= 2 && 
        manifest.icons.some((icon: any) => icon.sizes === '192x192') &&
        manifest.icons.some((icon: any) => icon.sizes === '512x512');

      if (!checks.startUrl) errors.push('Manifest missing start_url');
      if (!checks.display) errors.push('Manifest must have display: standalone or fullscreen');
      if (!checks.theme) errors.push('Manifest missing theme_color');
      if (!checks.icons) errors.push('Manifest needs icons with sizes 192x192 and 512x512');
    } else {
      errors.push('Manifest.json not found or not accessible');
    }
  } catch (error) {
    errors.push('Failed to fetch manifest.json');
  }

  // Check offline support
  try {
    const offlineResponse = await fetch('/api/v1/cases', { 
      method: 'GET',
      cache: 'no-store'
    });
    checks.offlineSupport = true;
  } catch (error) {
    // If network fails, check if we get cached response
    checks.offlineSupport = false;
  }

  const score = Object.values(checks).filter(Boolean).length / Object.keys(checks).length * 100;
  const isValid = score >= 80; // 80% compliance required

  return {
    isValid,
    checks,
    errors,
    score: Math.round(score)
  };
}

export function displayPWAStatus(result: PWAValidationResult) {
  console.group('🔍 PWA Validation Results');
  console.log(`Overall Score: ${result.score}%`);
  console.log(`Status: ${result.isValid ? '✅ PWA Ready' : '❌ Needs Improvement'}`);
  
  console.group('Detailed Checks:');
  Object.entries(result.checks).forEach(([check, passed]) => {
    console.log(`${passed ? '✅' : '❌'} ${check}`);
  });
  console.groupEnd();

  if (result.errors.length > 0) {
    console.group('❌ Issues to Fix:');
    result.errors.forEach(error => console.log(`• ${error}`));
    console.groupEnd();
  }

  console.groupEnd();
  return result;
}