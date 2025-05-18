// src/app/assistant/layout.tsx
'use client';
import { Navigation } from '@/components/home/navigation';
import { SidebarProvider } from '@/components/ui/sidebar';
import React from 'react';

export default function AssistantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden bg-background">
        <Navigation />
        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </SidebarProvider>
  );
}
