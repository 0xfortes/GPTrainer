import Head from 'next/head';
import Image from 'next/image';
import buildspaceLogo from '../assets/buildspace-logo.png';
import { useState } from 'react';

const useGenerateWorkout = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [apiOutput, setApiOutput] = useState([]);

  const formatOutput = (text) => {
    const sections = text.split('\n\n');
    return sections.map((section) => {
      const lines = section.split('\n');
      const title = lines[0];
      const content = lines.slice(1).map((line) => line.trim()).filter(Boolean);
      return { title, content };
    });
  };

  const generateWorkout = async (userInput) => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userInput }),
      });

      if (!response.ok) throw new Error('Failed to generate workout');

      const data = await response.json();
      const formattedOutput = formatOutput(data.output.text);
      setApiOutput(formattedOutput);
    } catch (error) {
      console.error('Error:', error);
      setApiOutput([{ title: 'Error', content: ['An error occurred while generating the workout. Please try again.'] }]);
    } finally {
      setIsGenerating(false);
    }
  };

  return { isGenerating, apiOutput, generateWorkout };
};

const Home = () => {
  const [userInput, setUserInput] = useState('');
  const { isGenerating, apiOutput, generateWorkout } = useGenerateWorkout();

  const handleSubmit = () => {
    if (!userInput.trim()) {
      alert('Please enter a description before generating.');
      return;
    }
    generateWorkout(userInput);
  };

  return (
    <div className="root">
      <Head>
        <title>Workout Routine Generator</title>
      </Head>
      <main className="container">
        <h1 className="header-title">Workout Planner</h1>
        <h2 className="header-subtitle">Generate a workout based on your sport and fitness goals!</h2>
        
        <div className="prompt-container">
          <textarea 
            placeholder="Briefly describe your sport and fitness goals" 
            className="prompt-box" 
            value={userInput} 
            onChange={(e) => setUserInput(e.target.value)}
            aria-label="Enter your sport and fitness goals"
          />
          <button 
            className={`generate-button ${isGenerating ? 'loading' : ''}`} 
            onClick={handleSubmit}
            disabled={isGenerating}
            aria-label="Generate workout"
          >
            {isGenerating ? <span className="loader" aria-hidden="true"></span> : 'Generate'}
          </button>
        </div>
        
        {apiOutput.length > 0 && (
          <div className='output'>
            <div className='output-content'>
              {apiOutput.map((section, index) => (
                <div key={index} className='output-section'>
                  <h4>{section.title}</h4>
                  <ul>
                    {section.content.map((item, itemIndex) => (
                      <li key={itemIndex}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
      
      <footer className="badge-container">
        <a href="https://buildspace.so/builds/ai-writer" target="_blank" rel="noreferrer">
          <div className="badge">
            <Image src={buildspaceLogo} alt="buildspace logo" />
            <p>built with buildspace</p>
          </div>
        </a>
      </footer>
    </div>
  );
};

export default Home;