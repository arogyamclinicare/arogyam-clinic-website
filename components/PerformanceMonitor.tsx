import { useEffect, useState } from 'react';
import { useMobilePerformance } from './hooks/use-mobile-performance';

interface PerformanceMonitorProps {
  showOverlay?: boolean;
  showIndicator?: boolean;
  autoOptimize?: boolean;
}

export function PerformanceMonitor({ 
  showOverlay = false, 
  showIndicator = true, 
  autoOptimize = true 
}: PerformanceMonitorProps) {
  const {
    deviceCapabilities,
    performanceMetrics,
    performanceSettings,
    performanceClasses,
    updatePerformanceSettings,
  } = useMobilePerformance();

  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  // Auto-apply performance classes to body
  useEffect(() => {
    if (autoOptimize && performanceClasses) {
      const body = document.body;
      const classes = performanceClasses.split(' ');
      
      // Remove old performance classes
      body.classList.remove('no-animations', 'no-transitions', 'no-shadows', 'no-blur', 'reduce-motion');
      
      // Add new performance classes
      classes.forEach(className => {
        if (className) {
          body.classList.add(className);
        }
      });

      // Add device-specific classes
      if (deviceCapabilities) {
        if (deviceCapabilities.isLowEnd) {
          body.classList.add('low-end-optimized');
        } else if (deviceCapabilities.isMidRange) {
          body.classList.add('mobile-optimized');
        } else {
          body.classList.add('high-end-optimized');
        }

        if (deviceCapabilities.networkSpeed === 'slow') {
          body.classList.add('data-optimized');
        }

        if (deviceCapabilities.batteryLevel !== undefined && deviceCapabilities.batteryLevel < 0.2) {
          body.classList.add('battery-optimized');
        }
      }
    }
  }, [autoOptimize, performanceClasses, deviceCapabilities]);

  // Get performance rating
  const getPerformanceRating = (fps: number) => {
    if (fps >= 55) return { rating: 'High', class: 'high', color: 'text-green-600' };
    if (fps >= 45) return { rating: 'Medium', class: 'medium', color: 'text-yellow-600' };
    if (fps >= 30) return { rating: 'Low', class: 'low', color: 'text-orange-600' };
    return { rating: 'Poor', class: 'low', color: 'text-red-600' };
  };

  // Get device rating
  const getDeviceRating = () => {
    if (!deviceCapabilities) return { rating: 'Unknown', class: 'unknown', color: 'text-gray-600' };
    
    if (deviceCapabilities.isHighEnd) return { rating: 'High-End', class: 'high', color: 'text-green-600' };
    if (deviceCapabilities.isMidRange) return { rating: 'Mid-Range', class: 'medium', color: 'text-yellow-600' };
    if (deviceCapabilities.isLowEnd) return { rating: 'Low-End', class: 'low', color: 'text-red-600' };
    
    return { rating: 'Unknown', class: 'unknown', color: 'text-gray-600' };
  };

  if (!showIndicator && !showOverlay) {
    return null;
  }

  return (
    <>
      {/* Performance Indicator */}
      {showIndicator && performanceMetrics && (
        <div 
          className={`performance-indicator ${getPerformanceRating(performanceMetrics.fps).class}`}
          onMouseEnter={() => setIsVisible(true)}
          onMouseLeave={() => setIsVisible(false)}
        >
          <div className="flex items-center space-x-2">
            <span>FPS: {performanceMetrics.fps}</span>
            <span className="text-xs">({getPerformanceRating(performanceMetrics.fps).rating})</span>
          </div>
          
          {isVisible && (
            <div className="mt-2 text-xs">
              <div>Frame: {performanceMetrics.frameTime.toFixed(2)}ms</div>
              <div>Device: {getDeviceRating().rating}</div>
              {deviceCapabilities?.networkSpeed && (
                <div>Network: {deviceCapabilities.networkSpeed}</div>
              )}
              {deviceCapabilities?.batteryLevel !== undefined && (
                <div>Battery: {Math.round(deviceCapabilities.batteryLevel * 100)}%</div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Performance Overlay */}
      {showOverlay && (
        <div className="performance-overlay">
          {performanceMetrics && (
            <>
              <div className="metric fps">
                FPS: {performanceMetrics.fps}
              </div>
              <div className="metric memory">
                Frame: {performanceMetrics.frameTime.toFixed(2)}ms
              </div>
              {deviceCapabilities && (
                <div className="metric network">
                  {deviceCapabilities.networkSpeed} | {deviceCapabilities.isLowEnd ? 'Low' : deviceCapabilities.isMidRange ? 'Mid' : 'High'}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Performance Controls (Development Only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 left-4 z-[9999] bg-white rounded-lg shadow-xl border border-gray-200 p-4 max-w-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Performance Controls</h3>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              {showDetails ? 'Hide' : 'Show'} Details
            </button>
          </div>

          {/* Quick Controls */}
          <div className="flex space-x-2 mb-4">
            <button
              onClick={() => updatePerformanceSettings(deviceCapabilities!)}
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
            >
              Auto
            </button>
            <button
              onClick={() => {
                document.body.classList.add('no-animations', 'no-transitions', 'no-shadows', 'no-blur');
              }}
              className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
            >
              Disable All
            </button>
            <button
              onClick={() => {
                document.body.classList.remove('no-animations', 'no-transitions', 'no-shadows', 'no-blur');
              }}
              className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
            >
              Enable All
            </button>
          </div>

          {/* Detailed Information */}
          {showDetails && (
            <div className="space-y-3 text-sm">
              {deviceCapabilities && (
                <div className="bg-gray-50 p-3 rounded">
                  <div className="font-medium text-gray-700 mb-2">Device Capabilities</div>
                  <div className="space-y-1 text-xs text-gray-600">
                    <div>Memory: {deviceCapabilities.hasLimitedMemory ? 'Limited' : 'Adequate'}</div>
                    <div>GPU: {deviceCapabilities.hasWeakGPU ? 'Weak' : 'Capable'}</div>
                    <div>WebGL: {deviceCapabilities.supportsWebGL ? 'Yes' : 'No'}</div>
                    <div>Hardware Accel: {deviceCapabilities.supportsHardwareAcceleration ? 'Yes' : 'No'}</div>
                    <div>Network: {deviceCapabilities.networkSpeed}</div>
                    {deviceCapabilities.batteryLevel !== undefined && (
                      <div>Battery: {Math.round(deviceCapabilities.batteryLevel * 100)}%</div>
                    )}
                  </div>
                </div>
              )}

              {performanceSettings && (
                <div className="bg-gray-50 p-3 rounded">
                  <div className="font-medium text-gray-700 mb-2">Current Settings</div>
                  <div className="space-y-1 text-xs text-gray-600">
                    <div>Animations: {performanceSettings.enableAnimations ? 'On' : 'Off'}</div>
                    <div>Transitions: {performanceSettings.enableTransitions ? 'On' : 'Off'}</div>
                    <div>Shadows: {performanceSettings.enableShadows ? 'On' : 'Off'}</div>
                    <div>Blur: {performanceSettings.enableBlur ? 'On' : 'Off'}</div>
                    <div>Image Quality: {performanceSettings.imageQuality}</div>
                    <div>Animation Duration: {performanceSettings.animationDuration}ms</div>
                  </div>
                </div>
              )}

              <div className="bg-gray-50 p-3 rounded">
                <div className="font-medium text-gray-700 mb-2">Applied Classes</div>
                <div className="text-xs text-gray-600">
                  {performanceClasses ? performanceClasses.split(' ').map((cls, i) => (
                    <span key={i} className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded mr-1 mb-1">
                      {cls}
                    </span>
                  )) : 'None'}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
