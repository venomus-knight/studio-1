'use client';

import {
  Navigation,
  ModeContent,
  ClientAdviceMode,
  LawyerAssistantMode,
} from '@/components/home';
import {SidebarProvider} from '@/components/ui/sidebar';
import React, {useState} from 'react';

export default function Home() {
  const [selectedMode, setSelectedMode] = useState<'client' | 'lawyer'>(
    'client'
  );

  const renderModeContent = () => {
    switch (selectedMode) {
      case 'client':
        return <ClientAdviceMode />;
      case 'lawyer':
        return <LawyerAssistantMode />;
      default:
        return null;
    }
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <Navigation setSelectedMode={setSelectedMode} />
        <ModeContent>{renderModeContent()}</ModeContent>
      </div>
    </SidebarProvider>
  );
}
