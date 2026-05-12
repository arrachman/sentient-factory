'use client';

import { Play, RefreshCw } from 'lucide-react';
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle,
} from '@/components/layouts/app/components/toolbar';
import { Button } from '@/components/ui/button';
import { useAdministratorTestWorkflowState } from '@/features/administrator-test-workflow/hooks/use-administrator-test-workflow-state';
import { WorkflowProgressCard } from './workflow-progress-card';
import { WorkflowRawResponseCard } from './workflow-raw-response-card';
import { WorkflowRequestCard } from './workflow-request-card';
import { WorkflowResponseCard } from './workflow-response-card';
import { WorkflowSqlCard } from './workflow-sql-card';

export default function AdministratorTestWorkflowPage() {
  const {
    prompt,
    setPrompt,
    schemaKey,
    setSchemaKey,
    messagesJson,
    setMessagesJson,
    includeSchema,
    setIncludeSchema,
    includeSamples,
    setIncludeSamples,
    executeReadOnlyQuery,
    setExecuteReadOnlyQuery,
    fastMode,
    setFastMode,
    submitting,
    response,
    responseStatus,
    requestId,
    progressEvents,
    lastRequest,
    progressViewportRef,
    isRawCopied,
    isSqlCopied,
    copyRaw,
    copySql,
    responseData,
    rawResponseText,
    latestProgress,
    handleSubmit,
    handleReplayLastRequest,
    handleReset,
  } = useAdministratorTestWorkflowState();

  return (
    <div className="container">
      <Toolbar>
        <ToolbarHeading>
          <ToolbarPageTitle>Administrator Test Workflow</ToolbarPageTitle>
          <ToolbarDescription>
            Uji endpoint workflow AI dengan prompt, schema, sample rows, dan opsi query read-only.
          </ToolbarDescription>
        </ToolbarHeading>
        <ToolbarActions>
          <Button onClick={() => void handleSubmit()} disabled={submitting}>
            {submitting ? <RefreshCw className="animate-spin" /> : <Play />}
            {submitting ? 'Running...' : 'Run Workflow'}
          </Button>
          <Button
            variant="outline"
            onClick={() => void handleReplayLastRequest()}
            disabled={submitting || !lastRequest}
          >
            <Play />
            Replay Last Request
          </Button>
          <Button variant="outline" onClick={handleReset} disabled={submitting}>
            <RefreshCw />
            Reset
          </Button>
        </ToolbarActions>
      </Toolbar>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <WorkflowRequestCard
          prompt={prompt}
          setPrompt={setPrompt}
          schemaKey={schemaKey}
          setSchemaKey={setSchemaKey}
          messagesJson={messagesJson}
          setMessagesJson={setMessagesJson}
          fastMode={fastMode}
          setFastMode={setFastMode}
          includeSchema={includeSchema}
          setIncludeSchema={setIncludeSchema}
          includeSamples={includeSamples}
          setIncludeSamples={setIncludeSamples}
          executeReadOnlyQuery={executeReadOnlyQuery}
          setExecuteReadOnlyQuery={setExecuteReadOnlyQuery}
          onSubmit={(event) => void handleSubmit(event)}
        />

        <div className="space-y-5">
          <WorkflowResponseCard
            response={response}
            responseStatus={responseStatus}
            schemaKey={schemaKey}
          />

          <WorkflowProgressCard
            requestId={requestId}
            submitting={submitting}
            progressEvents={progressEvents}
            latestProgress={latestProgress}
            progressViewportRef={progressViewportRef}
          />

          <WorkflowSqlCard
            responseData={responseData}
            isSqlCopied={isSqlCopied}
            onCopySql={copySql}
          />

          <WorkflowRawResponseCard
            response={response}
            rawResponseText={rawResponseText}
            isRawCopied={isRawCopied}
            onCopyRaw={copyRaw}
          />
        </div>
      </div>
    </div>
  );
}
