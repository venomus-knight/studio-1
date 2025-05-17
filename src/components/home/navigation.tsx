// src/components/home/navigation.tsx
'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarTrigger,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import Link from 'next/link'; // Import Link
import React from 'react';
import { PenTool } from 'lucide-react';

export function Navigation() {
  return (
    <Sidebar>
      <SidebarTrigger />
      <SidebarContent>
        <SidebarHeader className="text-center p-4">
          <Link href="/" className="flex flex-col items-center space-y-1 group">
            <PenTool className="h-12 w-12 text-sidebar-primary group-hover:text-accent" />
            <h1 className="font-semibold text-lg mt-2 font-lora text-sidebar-foreground group-hover:text-accent">
              NYAI
            </h1>
          </Link>
          <p className="text-xs text-muted-foreground">AI Legal Assistant</p>
        </SidebarHeader>
        <SidebarSeparator />
         <div className="p-4 text-center">
          <p className="text-xs text-muted-foreground">
            Enter your legal query or upload a document to get started.
          </p>
        </div>
      </SidebarContent>
      <SidebarFooter className="text-center p-4">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} NYAI
        </p>
      </SidebarFooter>
    </Sidebar>
  );
}
