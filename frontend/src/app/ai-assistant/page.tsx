'use client';

import React from 'react';
import { PromptInputPanel } from '../../features/ai-assistant/components/PromptInputPanel';
import { PreviewContainer } from '../../features/ai-assistant/components/PreviewContainer';
import { InterpretationCard } from '../../features/ai-assistant/components/InterpretationCard';

export default function AiAssistantPage() {
  return (
    <div className="flex h-[calc(100vh-72px)] bg-ink-950 overflow-hidden">
      <PromptInputPanel />
      <PreviewContainer />
      <InterpretationCard />
    </div>
  );
}
