import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Brain,
  Cpu,
  AudioWaveform as Waveform,
  ChevronRight,
  Users,
  Send,
} from 'lucide-react';

const LandingPage = () => {
  const [userQuestion, setUserQuestion] = useState('');
  const [questions, setQuestions] = useState<
    { question: string; answer: string }[]
  >([
    {
      question: 'What is the basic formula for Z-transform?',
      answer:
        'The basic formula is X(z) = Σ x[n]z⁻ⁿ, where n goes from -∞ to ∞',
    },
    {
      question: 'How is Z-transform used in digital filters?',
      answer:
        'Z-transform converts difference equations into algebraic equations, making it easier to analyze and design digital filters',
    },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuestion.trim()) return;

    setQuestions((prev) => [
      ...prev,
      {
        question: userQuestion,
        answer: 'Thank you for your question! Our team will respond shortly.',
      },
    ]);
    setUserQuestion('');
  };

  const teamMembers = [
    { name: 'Prof. Aakash Darade ', role: 'Subject Incharge' },
    { name: 'Smiti Patil ', role: ' ' },
    { name: 'Uday Patil', role: 'Full Stack Developer ' },
    { name: 'Shreya Pawar', role: ' ' },
    { name: 'Renuka Pokharkar', role: ' ' },
    { name: 'Shivam Prajapati', role: ' ' },
  ];

  const applications = [
    {
      title: 'Digital Filters',
      icon: <Waveform className="w-8 h-8" />,
      description:
        'Design and analysis of digital filters in signal processing',
    },
    {
      title: 'Control Systems',
      icon: <Cpu className="w-8 h-8" />,
      description:
        'Stability analysis and controller design in discrete-time systems',
    },
    {
      title: 'Signal Analysis',
      icon: <Brain className="w-8 h-8" />,
      description: 'Analysis of discrete-time signals and systems',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="text-center mb-8 md:mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 md:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Z-Transform Explorer
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-6 md:mb-8 px-4">
            Discover the power of Z-transform in digital signal processing and
            control systems
          </p>
          <Link
            to="/demo"
            className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-lg font-semibold transition-all"
          >
            Try Interactive Demo <ChevronRight className="ml-2" />
          </Link>
        </div>

        {/* What is Z-Transform */}
        <div className="max-w-4xl mx-auto bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 md:p-8 mb-8 md:mb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            What is Z-Transform?
          </h2>
          <p className="text-gray-300 leading-relaxed">
            The Z-transform converts a discrete-time signal into a complex
            frequency-domain representation. It's a powerful tool in digital
            signal processing that transforms difference equations into
            algebraic equations, making it easier to analyze and design digital
            systems.
          </p>
          <div className="mt-4 p-4 bg-gray-700/50 rounded-lg overflow-x-auto">
            <code className="text-blue-300 whitespace-nowrap">
              X(z) = Σ x[n]z⁻ⁿ, n = -∞ to ∞
            </code>
          </div>
        </div>

        {/* Applications */}
        <div className="mb-8 md:mb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-center">
            Real-world Applications
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
            {applications.map((app, index) => (
              <div
                key={index}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 hover:transform hover:-translate-y-1 transition-all"
              >
                <div className="mb-4 text-blue-400">{app.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{app.title}</h3>
                <p className="text-gray-300">{app.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-center flex items-center justify-center">
            <Users className="mr-2" /> Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 text-center"
              >
                <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                  <span className="text-xl md:text-2xl font-bold">
                    {member.name[0]}
                  </span>
                </div>
                <h3 className="text-lg md:text-xl font-semibold mb-2">
                  {member.name}
                </h3>
                <p className="text-gray-300">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
