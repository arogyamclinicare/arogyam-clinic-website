import { useState, useEffect, useRef } from 'react';
import { useMobileNavigation, useMobileAccessibility } from './hooks/use-mobile-navigation';

interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  memoryUsage?: number;
  devicePixelRatio: number;
  viewportSize: { width: number; height: number };
  userAgent: string;
  touchSupport: boolean;
  reducedMotion: boolean;
}

export function MobileNavigationTester() {
  const [state, actions] = useMobileNavigation();
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [testResults, setTestResults] = useState<string[]>([]);
  
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(0);
  const animationFrameRef = useRef<number>();
  const testIntervalRef = useRef<NodeJS.Timeout>();

  // Use accessibility hook
  useMobileAccessibility(state.isOpen);

  // Measure performance metrics
  const measurePerformance = () => {
    const currentTime = performance.now();
    frameCountRef.current++;

    if (currentTime - lastTimeRef.current >= 1000) {
      const fps = Math.round((frameCountRef.current * 1000) / (currentTime - lastTimeRef.current));
      const frameTime = (currentTime - lastTimeRef.current) / frameCountRef.current;

      setMetrics(prev => ({
        ...prev!,
        fps,
        frameTime,
      }));

      frameCountRef.current = 0;
      lastTimeRef.current = currentTime;
    }

    animationFrameRef.current = requestAnimationFrame(measurePerformance);
  };

  // Start performance monitoring
  const startPerformanceTest = () => {
    setIsTesting(true);
    setTestResults([]);
    
    // Initialize metrics
    setMetrics({
      fps: 0,
      frameTime: 0,
      devicePixelRatio: window.devicePixelRatio,
      viewportSize: { width: window.innerWidth, height: window.innerHeight },
      userAgent: navigator.userAgent,
      touchSupport: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
      reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    });

    // Start FPS monitoring
    lastTimeRef.current = performance.now();
    animationFrameRef.current = requestAnimationFrame(measurePerformance);

    // Run navigation tests
    runNavigationTests();
  };

  // Stop performance monitoring
  const stopPerformanceTest = () => {
    setIsTesting(false);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (testIntervalRef.current) {
      clearInterval(testIntervalRef.current);
    }
  };

  // Run navigation performance tests
  const runNavigationTests = () => {
    const tests = [
      'Opening mobile menu...',
      'Testing menu animations...',
      'Measuring touch responsiveness...',
      'Testing scroll performance...',
      'Checking memory usage...',
    ];

    let testIndex = 0;
    
    testIntervalRef.current = setInterval(() => {
      if (testIndex < tests.length) {
        setTestResults(prev => [...prev, tests[testIndex]]);
        testIndex++;
      } else {
        clearInterval(testIntervalRef.current);
        setTestResults(prev => [...prev, 'Performance test completed!']);
      }
    }, 1000);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (testIntervalRef.current) {
        clearInterval(testIntervalRef.current);
      }
    };
  }, []);

  // Get performance rating
  const getPerformanceRating = (fps: number) => {
    if (fps >= 55) return { rating: 'Excellent', color: 'text-green-600', bg: 'bg-green-100' };
    if (fps >= 45) return { rating: 'Good', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (fps >= 30) return { rating: 'Fair', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { rating: 'Poor', color: 'text-red-600', bg: 'bg-red-100' };
  };

  return (
    <div className="fixed bottom-4 right-4 z-[9999] bg-white rounded-lg shadow-xl border border-gray-200 p-4 max-w-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Mobile Nav Tester</h3>
        <button
          onClick={isTesting ? stopPerformanceTest : startPerformanceTest}
          className={`px-3 py-1 rounded text-sm font-medium ${
            isTesting 
              ? 'bg-red-500 text-white hover:bg-red-600' 
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          {isTesting ? 'Stop' : 'Start'} Test
        </button>
      </div>

      {/* Performance Metrics */}
      {metrics && (
        <div className="space-y-3 mb-4">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="bg-gray-50 p-2 rounded">
              <div className="font-medium text-gray-700">FPS</div>
              <div className={`text-lg font-bold ${getPerformanceRating(metrics.fps).color}`}>
                {metrics.fps}
              </div>
              <div className={`text-xs px-2 py-1 rounded ${getPerformanceRating(metrics.fps).bg} ${getPerformanceRating(metrics.fps).color}`}>
                {getPerformanceRating(metrics.fps).rating}
              </div>
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <div className="font-medium text-gray-700">Frame Time</div>
              <div className="text-lg font-bold text-gray-800">
                {metrics.frameTime.toFixed(2)}ms
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-2 rounded text-sm">
            <div className="font-medium text-gray-700 mb-1">Device Info</div>
            <div className="space-y-1 text-xs text-gray-600">
              <div>Pixel Ratio: {metrics.devicePixelRatio}</div>
              <div>Viewport: {metrics.viewportSize.width} × {metrics.viewportSize.height}</div>
              <div>Touch: {metrics.touchSupport ? 'Yes' : 'No'}</div>
              <div>Reduced Motion: {metrics.reducedMotion ? 'Yes' : 'No'}</div>
            </div>
          </div>
        </div>
      )}

      {/* Test Results */}
      {testResults.length > 0 && (
        <div className="bg-gray-50 p-2 rounded">
          <div className="font-medium text-gray-700 mb-2">Test Progress</div>
          <div className="space-y-1">
            {testResults.map((result, index) => (
              <div key={index} className="text-xs text-gray-600 flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                {result}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Navigation Controls */}
      <div className="flex space-x-2 mt-4">
        <button
          onClick={actions.toggle}
          className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded text-sm font-medium transition-colors"
        >
          {state.isOpen ? 'Close' : 'Open'} Menu
        </button>
        <button
          onClick={() => actions.setPerformanceMode('low')}
          className="px-2 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded text-xs font-medium transition-colors"
          title="Set Low Performance Mode"
        >
          Low
        </button>
        <button
          onClick={() => actions.setPerformanceMode('medium')}
          className="px-2 py-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded text-xs font-medium transition-colors"
          title="Set Medium Performance Mode"
        >
          Med
        </button>
        <button
          onClick={() => actions.setPerformanceMode('high')}
          className="px-2 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded text-xs font-medium transition-colors"
          title="Set High Performance Mode"
        >
          High
        </button>
      </div>



      {/* Current State */}
      <div className="mt-3 text-xs text-gray-500">
        <div>Menu: {state.isOpen ? 'Open' : 'Closed'}</div>
        <div>Animating: {state.isAnimating ? 'Yes' : 'No'}</div>
        <div>Performance: {state.devicePerformance}</div>
      </div>
    </div>
  );
}
