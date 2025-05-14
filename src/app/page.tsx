'use client';

import {Navigation} from '@/components/home/navigation';
import {UnifiedLegalAssistant} from '@/components/home/unified-legal-assistant';
import {SidebarProvider} from '@/components/ui/sidebar';
import React from 'react';

export default function Home() {
  return (
    <SidebarProvider>
      <div className="flex h-screen bg-background">
        <Navigation />
        <UnifiedLegalAssistant />
      </div>
    </SidebarProvider>
  );
}
