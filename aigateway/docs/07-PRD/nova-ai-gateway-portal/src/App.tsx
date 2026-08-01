import React, { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { FeatureGrid } from './components/FeatureGrid';
import { ModelWall } from './components/ModelWall';
import { Infrastructure } from './components/Infrastructure';
import { CostCalculator } from './components/CostCalculator';
import { Pricing } from './components/Pricing';
import { CtaBanner } from './components/CtaBanner';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { PlaygroundModal } from './components/PlaygroundModal';
import { ConsoleModal } from './components/ConsoleModal';

export default function App() {
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const [isPlaygroundOpen, setIsPlaygroundOpen] = useState(false);
  const [testModelId, setTestModelId] = useState<string>('deepseek-r1');

  const handleOpenConsole = () => setIsConsoleOpen(true);
  const handleOpenPlayground = (modelId?: string) => {
    if (modelId) setTestModelId(modelId);
    setIsPlaygroundOpen(true);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-600 selection:text-white antialiased">
      {/* Top Fixed Header */}
      <Header onOpenConsole={handleOpenConsole} />

      {/* Main Single-Page Content Stack */}
      <main>
        {/* Hero Section */}
        <Hero
          onOpenConsole={handleOpenConsole}
          onOpenPlayground={() => handleOpenPlayground()}
        />

        {/* Feature Grid (6 Cards) */}
        <FeatureGrid onOpenPlayground={() => handleOpenPlayground()} />

        {/* Supported Models Wall & Interactive Selector */}
        <ModelWall
          onSelectModelForTest={(modelId) => handleOpenPlayground(modelId)}
        />

        {/* Global Infrastructure (4 Cards) */}
        <Infrastructure />

        {/* Interactive Cost & Cache Savings Calculator */}
        <CostCalculator />

        {/* Transparent Pricing Plans */}
        <Pricing onOpenConsole={handleOpenConsole} />

        {/* CTA Banner */}
        <CtaBanner
          onOpenConsole={handleOpenConsole}
          onOpenPlayground={() => handleOpenPlayground()}
        />

        {/* FAQ Accordion Section */}
        <FaqSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Interactive Modals */}
      <ConsoleModal
        isOpen={isConsoleOpen}
        onClose={() => setIsConsoleOpen(false)}
      />

      <PlaygroundModal
        isOpen={isPlaygroundOpen}
        onClose={() => setIsPlaygroundOpen(false)}
        defaultModelId={testModelId}
      />
    </div>
  );
}
