'use client';

import {Icons} from '@/components/icons';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarTrigger,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import React from 'react';

export function Navigation() {
  return (
    <Sidebar className="glass">
      <SidebarTrigger />
      <SidebarContent>
        <SidebarHeader className="text-center">
          <Icons.bookOpenCheck className="mx-auto h-12 w-12 text-primary" />
          <h1 className="font-semibold text-xl mt-2">NyayaMitra</h1>
          <p className="text-sm text-muted-foreground">Your AI Legal Assistant</p>
        </SidebarHeader>
        <SidebarSeparator />
         <div className="p-4 text-center">
          <p className="text-xs text-muted-foreground">
            Enter your legal query or upload a document to get started.
          </p>
        </div>
      </SidebarContent>
      <SidebarFooter className="text-center">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} NyayaMitra
        </p>
      </SidebarFooter>
    </Sidebar>
  );
}
