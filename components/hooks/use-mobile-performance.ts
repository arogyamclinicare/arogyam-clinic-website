import { useState, useEffect, useCallback, useMemo } from 'react';

interface DeviceCapabilities {
  isLowEnd: boolean;
  isMidRange: boolean;
  isHighEnd: boolean;
  hasWeakGPU: boolean;
  hasLimitedMemory: boolean;
  supportsWebGL: boolean;
  supportsHardwareAcceleration: boolean;
  networkSpeed: 'slow' | 'medium' | 'fast';
  batteryLevel?: number;
  isCharging?: boolean;
}

interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  memoryUsage?: number;
  cpuUsage?: number;
  networkLatency?: number;
}

interface PerformanceSettings {
  enableAnimations: boolean;
  enableTransitions: boolean;
  enableShadows: boolean;
  enableBlur: boolean;
  imageQuality: 'low' | 'medium' | 'high';
  animationDuration: number;
  reduceMotion: boolean;
}

export function useMobilePerformance() {
  const [deviceCapabilities, setDeviceCapabilities] = useState<DeviceCapabilities | null>(null);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics | null>(null);
  const [performanceSettings, setPerformanceSettings] = useState<PerformanceSettings>({
    enableAnimations: true,
    enableTransitions: true,
    enableShadows: true,
    enableBlur: true,
    imageQuality: 'medium',
    animationDuration: 300,
    reduceMotion: false,
  });

  // Detect device capabilities
  const detectDeviceCapabilities = useCallback(async (): Promise<DeviceCapabilities> => {
    const capabilities: DeviceCapabilities = {
      isLowEnd: false,
      isMidRange: false,
      isHighEnd: false,
      hasWeakGPU: false,
      hasLimitedMemory: false,
      supportsWebGL: false,
      supportsHardwareAcceleration: false,
      networkSpeed: 'medium',
    };

    try {
      // Check device memory
      if ('deviceMemory' in navigator) {
        const memory = (navigator as any).deviceMemory;
        capabilities.hasLimitedMemory = memory < 4;
        capabilities.isLowEnd = memory < 2;
        capabilities.isMidRange = memory >= 2 && memory < 6;
        capabilities.isHighEnd = memory >= 6;
      }

      // Check hardware concurrency
      if ('hardwareConcurrency' in navigator) {
        const cores = navigator.hardwareConcurrency;
        if (cores < 4) capabilities.isLowEnd = true;
        else if (cores < 8) capabilities.isMidRange = true;
        else capabilities.isHighEnd = true;
      }

      // Check WebGL support
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') as WebGLRenderingContext | null;
      capabilities.supportsWebGL = !!gl;

      if (gl) {
        try {
          const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
          if (debugInfo) {
            const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) as string;
            capabilities.hasWeakGPU = renderer.includes('Intel') || renderer.includes('Mali') || renderer.includes('Adreno');
          }
        } catch (error) {
          // WebGL extension not supported
        }
      }

      // Check hardware acceleration support
      capabilities.supportsHardwareAcceleration = CSS.supports('transform', 'translate3d(0,0,0)');

      // Check network speed (basic estimation)
      if ('connection' in navigator) {
        const connection = (navigator as any).connection;
        if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
          capabilities.networkSpeed = 'slow';
        } else if (connection.effectiveType === '3g') {
          capabilities.networkSpeed = 'medium';
        } else {
          capabilities.networkSpeed = 'fast';
        }
      }

      // Check battery status
      if ('getBattery' in navigator) {
        try {
          const battery = await (navigator as any).getBattery();
          capabilities.batteryLevel = battery.level;
          capabilities.isCharging = battery.charging;
        } catch (error) {
          // Battery API not supported or permission denied
        }
      }

      // Check reduced motion preference
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) {
        capabilities.isLowEnd = true; // Treat as low-end for performance purposes
      }

    } catch (error) {
    // Empty block
  }

    return capabilities;
  }, []);

  // Monitor performance metrics
  const monitorPerformance = useCallback(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animationFrameId: number;

    const measureFrame = () => {
      frameCount++;
      const currentTime = performance.now();

      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        const frameTime = (currentTime - lastTime) / frameCount;

        setPerformanceMetrics(prev => ({
          ...prev,
          fps,
          frameTime,
        }));

        frameCount = 0;
        lastTime = currentTime;
      }

      animationFrameId = requestAnimationFrame(measureFrame);
    };

    animationFrameId = requestAnimationFrame(measureFrame);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  // Adaptive performance settings based on device capabilities
  const updatePerformanceSettings = useCallback((capabilities: DeviceCapabilities) => {
    const newSettings: PerformanceSettings = { ...performanceSettings };

    if (capabilities.isLowEnd || capabilities.hasWeakGPU) {
      newSettings.enableAnimations = false;
      newSettings.enableTransitions = false;
      newSettings.enableShadows = false;
      newSettings.enableBlur = false;
      newSettings.imageQuality = 'low';
      newSettings.animationDuration = 0;
      newSettings.reduceMotion = true;
    } else if (capabilities.isMidRange) {
      newSettings.enableAnimations = true;
      newSettings.enableTransitions = true;
      newSettings.enableShadows = false;
      newSettings.enableBlur = false;
      newSettings.imageQuality = 'medium';
      newSettings.animationDuration = 200;
      newSettings.reduceMotion = false;
    } else {
      newSettings.enableAnimations = true;
      newSettings.enableTransitions = true;
      newSettings.enableShadows = true;
      newSettings.enableBlur = true;
      newSettings.imageQuality = 'high';
      newSettings.animationDuration = 300;
      newSettings.reduceMotion = false;
    }

    // Network-based adjustments
    if (capabilities.networkSpeed === 'slow') {
      newSettings.imageQuality = 'low';
      newSettings.enableBlur = false;
    }

    // Battery-based adjustments
    if (capabilities.batteryLevel !== undefined && capabilities.batteryLevel < 0.2) {
      newSettings.enableAnimations = false;
      newSettings.enableTransitions = false;
      newSettings.animationDuration = 0;
    }

    setPerformanceSettings(newSettings);
  }, [performanceSettings]);

  // Initialize performance monitoring
  useEffect(() => {
    const initPerformance = async () => {
      const capabilities = await detectDeviceCapabilities();
      setDeviceCapabilities(capabilities);
      updatePerformanceSettings(capabilities);
    };

    initPerformance();
    const cleanup = monitorPerformance();

    return cleanup;
  }, [detectDeviceCapabilities, updatePerformanceSettings, monitorPerformance]);

  // Get CSS classes based on performance settings
  const performanceClasses = useMemo(() => {
    const classes: string[] = [];

    if (!performanceSettings.enableAnimations) {
      classes.push('no-animations');
    }
    if (!performanceSettings.enableTransitions) {
      classes.push('no-transitions');
    }
    if (!performanceSettings.enableShadows) {
      classes.push('no-shadows');
    }
    if (!performanceSettings.enableBlur) {
      classes.push('no-blur');
    }
    if (performanceSettings.reduceMotion) {
      classes.push('reduce-motion');
    }

    return classes.join(' ');
  }, [performanceSettings]);

  // Get optimized image quality
  const getImageQuality = useCallback(() => {
    return performanceSettings.imageQuality;
  }, [performanceSettings.imageQuality]);

  // Check if animations should be disabled
  const shouldDisableAnimations = useCallback(() => {
    return !performanceSettings.enableAnimations || performanceSettings.animationDuration === 0;
  }, [performanceSettings.enableAnimations, performanceSettings.animationDuration]);

  // Get animation duration
  const getAnimationDuration = useCallback(() => {
    return performanceSettings.animationDuration;
  }, [performanceSettings.animationDuration]);

  return {
    deviceCapabilities,
    performanceMetrics,
    performanceSettings,
    performanceClasses,
    getImageQuality,
    shouldDisableAnimations,
    getAnimationDuration,
    updatePerformanceSettings,
  };
}
