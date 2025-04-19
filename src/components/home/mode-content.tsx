import React from 'react';

interface ModeContentProps {
  children: React.ReactNode;
}

export function ModeContent({children}: ModeContentProps) {
  return <div className="flex-1 p-4">{children}</div>;
}
