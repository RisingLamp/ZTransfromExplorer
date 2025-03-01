import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Play, Pause, RefreshCw, Calculator, HelpCircle, ChevronRight } from 'lucide-react';

const DemoPage = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [frequency, setFrequency] = useState(1);
  const [amplitude, setAmplitude] = useState(1);
  const [time, setTime] = useState(0);
  const [points, setPoints] = useState<{ x: number; y: number }[]>([]);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [selectedQuestion, setSelectedQuestion] = useState<number | null>(null);

  // New state for difference equation
  const [coefficients, setCoefficients] = useState({
    a1: -1.5,
    a2: 0.5,
    b0: 1,
    b1: 0
  });
  const [inputSignal, setInputSignal] = useState<number[]>([]);
  const [outputSignal, setOutputSignal] = useState<number[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);

  const questions = [
    {
      q: "What is a Z-transform?",
      a: "The Z-transform converts a discrete-time signal into a complex frequency-domain representation, similar to how the Laplace transform works for continuous-time signals."
    },
    {
      q: "How does the difference equation relate to Z-transform?",
      a: "The difference equation in the time domain becomes an algebraic equation in the Z-domain, making it easier to analyze and solve complex signal processing problems."
    },
    {
      q: "What are the practical applications?",
      a: "Z-transforms are used in digital filters, control systems, audio processing, and image processing to analyze and manipulate discrete-time signals."
    }
  ];

  // Calculate difference equation output with animation
  const calculateOutput = () => {
    const { a1, a2, b0, b1 } = coefficients;
    const x = Array(50).fill(0).map((_, i) => Math.sin(2 * Math.PI * 0.1 * i));
    const y: number[] = Array(x.length).fill(0);

    for (let n = 2; n < x.length; n++) {
      y[n] = b0 * x[n] + b1 * x[n - 1] - a1 * y[n - 1] - a2 * y[n - 2];
    }

    // Animate the signal update
    let i = 0;
    const updateSignal = () => {
      if (i < x.length) {
        setInputSignal(x.slice(0, i + 1));
        setOutputSignal(y.slice(0, i + 1));
        i++;
        requestAnimationFrame(updateSignal);
      }
    };
    requestAnimationFrame(updateSignal);
  };

  useEffect(() => {
    let animationFrame: number;
    let lastTimestamp = 0;

    const animate = (timestamp: number) => {
      if (!lastTimestamp) lastTimestamp = timestamp;
      const delta = (timestamp - lastTimestamp) / 1000;
      lastTimestamp = timestamp;

      if (isPlaying) {
        setTime(prevTime => {
          const newTime = prevTime + delta;
          const newPoint = {
            x: newTime,
            y: amplitude * Math.sin(2 * Math.PI * frequency * newTime)
          };

          setPoints(prevPoints => {
            const newPoints = [...prevPoints, newPoint];
            if (newPoints.length > 100) newPoints.shift();
            return newPoints;
          });

          return newTime;
        });
      }

      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [isPlaying, frequency, amplitude]);

  useEffect(() => {
    calculateOutput();
  }, [coefficients]);

  const resetSimulation = () => {
    setTime(0);
    setPoints([]);
    setIsPlaying(false);
    calculateOutput();
  };

  const drawSignal = () => {
    const width = 800;
    const height = 300;
    const scaleY = height / 4;

    return points.map((point, i) => {
      const x = ((point.x % 4) / 4) * width;
      const y = height / 2 + point.y * scaleY;
      
      if (i === 0) return `M ${x} ${y}`;
      return `L ${x} ${y}`;
    }).join(' ');
  };

  const drawDifferenceEquation = (signal: number[]) => {
    const width = 800;
    const height = 150;
    const scaleY = height / 4;
    
    return signal.map((y, i) => {
      const x = (i / signal.length) * width;
      const yPos = height / 2 + y * scaleY;
      return i === 0 ? `M ${x} ${yPos}` : `L ${x} ${yPos}`;
    }).join(' ');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white p-4 md:p-8">
      <Link to="/" className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-6 md:mb-8">
        <ArrowLeft className="mr-2" /> Back to Home
      </Link>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 md:mb-8 animate-fade-in">Signal Generator & Z-Transform Demo</h1>
        
        {/* Signal Generator Section */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 md:p-8 mb-6 md:mb-8 transform transition-all hover:scale-[1.01]">
          <h2 className="text-xl md:text-2xl font-bold mb-4">Signal Generator</h2>
          <div className="mb-6 md:mb-8 relative">
            <svg width="800" height="300" className="w-full bg-gray-900/50 rounded-lg">
              <path
                d={drawSignal()}
                stroke="#60A5FA"
                strokeWidth="2"
                fill="none"
                className="animate-draw"
              />
            </svg>
            {showTooltip && (
              <div 
                className="absolute bg-gray-800 p-2 rounded text-sm"
                style={{ left: tooltipPosition.x, top: tooltipPosition.y }}
              >
                Time: {time.toFixed(2)}s
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mb-6 md:mb-8">
            <div className="transform transition-all hover:scale-105">
              <label className="block text-sm font-medium mb-2">Frequency (Hz)</label>
              <input
                type="range"
                min="0.1"
                max="5"
                step="0.1"
                value={frequency}
                onChange={(e) => setFrequency(parseFloat(e.target.value))}
                className="w-full"
              />
              <span className="text-sm text-gray-400">{frequency.toFixed(1)} Hz</span>
            </div>

            <div className="transform transition-all hover:scale-105">
              <label className="block text-sm font-medium mb-2">Amplitude</label>
              <input
                type="range"
                min="0.1"
                max="2"
                step="0.1"
                value={amplitude}
                onChange={(e) => setAmplitude(parseFloat(e.target.value))}
                className="w-full"
              />
              <span className="text-sm text-gray-400">{amplitude.toFixed(1)}</span>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center transform transition-all hover:scale-105"
            >
              {isPlaying ? <><Pause className="mr-2" /> Pause</> : <><Play className="mr-2" /> Play</>}
            </button>
            <button
              onClick={resetSimulation}
              className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center transform transition-all hover:scale-105"
            >
              <RefreshCw className="mr-2" /> Reset
            </button>
          </div>
        </div>

        {/* Linear Difference Equation Section */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 md:p-8 mb-6 md:mb-8 transform transition-all hover:scale-[1.01]">
          <h2 className="text-xl md:text-2xl font-bold mb-4">Linear Difference Equation</h2>
          <p className="text-gray-300 mb-4">
            Explore how Z-transform helps solve linear difference equations. The equation below represents:
            y[n] + a₁y[n-1] + a₂y[n-2] = b₀x[n] + b₁x[n-1]
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {Object.entries(coefficients).map(([key, value]) => (
              <div key={key} className="transform transition-all hover:scale-105">
                <label className="block text-sm font-medium mb-2">{key} coefficient</label>
                <input
                  type="number"
                  step="0.1"
                  value={value}
                  onChange={(e) => setCoefficients(prev => ({ ...prev, [key]: parseFloat(e.target.value) }))}
                  className="w-full px-4 py-2 rounded-lg bg-gray-700/50 text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <div className="transform transition-all hover:scale-[1.01]">
              <h3 className="text-lg font-semibold mb-2">Input Signal</h3>
              <svg width="800" height="150" className="w-full bg-gray-900/50 rounded-lg">
                <path
                  d={drawDifferenceEquation(inputSignal)}
                  stroke="#60A5FA"
                  strokeWidth="2"
                  fill="none"
                  className="animate-draw"
                />
              </svg>
            </div>
            <div className="transform transition-all hover:scale-[1.01]">
              <h3 className="text-lg font-semibold mb-2">Output Signal</h3>
              <svg width="800" height="150" className="w-full bg-gray-900/50 rounded-lg">
                <path
                  d={drawDifferenceEquation(outputSignal)}
                  stroke="#4ADE80"
                  strokeWidth="2"
                  fill="none"
                  className="animate-draw"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Q&A Section */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 md:p-8 mb-6 md:mb-8">
          <h2 className="text-xl md:text-2xl font-bold mb-4 flex items-center">
            <HelpCircle className="mr-2" /> Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {questions.map((q, index) => (
              <div
                key={index}
                className="transform transition-all hover:scale-[1.01]"
              >
                <button
                  onClick={() => setSelectedQuestion(selectedQuestion === index ? null : index)}
                  className="w-full text-left p-4 bg-gray-700/50 rounded-lg flex items-center justify-between hover:bg-gray-600/50"
                >
                  <span className="font-medium">{q.q}</span>
                  <ChevronRight
                    className={`transform transition-transform ${
                      selectedQuestion === index ? 'rotate-90' : ''
                    }`}
                  />
                </button>
                {selectedQuestion === index && (
                  <div className="p-4 bg-gray-600/30 rounded-lg mt-2 animate-fade-in">
                    {q.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Understanding Section */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 md:p-8 transform transition-all hover:scale-[1.01]">
          <h2 className="text-xl md:text-2xl font-bold mb-4">Understanding the Demo</h2>
          <p className="text-gray-300 leading-relaxed mb-4">
            This interactive demo shows how Z-transform helps solve linear difference equations.
            The top section shows a continuous-time signal, while the bottom section demonstrates
            how difference equations process discrete-time signals. By adjusting the coefficients,
            you can see how the system responds to different inputs and how the Z-transform
            helps analyze the system's behavior.
          </p>
          <div className="bg-gray-700/50 rounded-lg p-4">
            <p className="text-sm text-gray-300">
              Key concepts demonstrated:
              <br />
              • Linear difference equations
              <br />
              • System response to sinusoidal inputs
              <br />
              • Transfer function analysis
              <br />
              • Z-transform application in digital signal processing
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoPage;