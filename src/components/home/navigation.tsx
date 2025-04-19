'use client';

import {Icons} from '@/components/icons';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import React from 'react';

interface NavigationProps {
  setSelectedMode: React.Dispatch<React.SetStateAction<'client' | 'lawyer'>>;
}

export function Navigation({setSelectedMode}: NavigationProps) {
  return (
    <Sidebar className="glass">
      <SidebarTrigger />
      <SidebarContent>
        <SidebarHeader className="text-center">
          <Icons.bookOpenCheck className="mx-auto h-10 w-10" />
          <h1 className="font-semibold text-lg">NyayaMitra</h1>
          <p className="text-muted-foreground">Your AI Legal Assistant</p>
        </SidebarHeader>
        <SidebarSeparator />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => setSelectedMode('client')}
              className="justify-start"
            >
              <Icons.clientAdvice className="mr-2 h-4 w-4" />
              Client Advice
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => setSelectedMode('lawyer')}
              className="justify-start"
            >
              <Icons.documentSummarizer className="mr-2 h-4 w-4" />
              Lawyer Assistant
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="text-center">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} NyayaMitra
        </p>
      </SidebarFooter>
    </Sidebar>
  );
}
