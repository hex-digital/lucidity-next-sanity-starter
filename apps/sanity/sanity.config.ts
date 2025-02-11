import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schema/types';
import { codeInput } from '@sanity/code-input';
import { structure } from '@/structure';
import { defaultDocumentNode } from '@/structure/defaultDocumentNode';
import { appConfig } from './config/app';
import { setupSingletons } from '@pkg/sanity-toolkit/studio/singletons';
import { LOCKED_DOCUMENT_TYPES } from '@pkg/common/config/schemaTypes';
import { noteField } from '@pkg/sanity-toolkit/studio/studioComponents/noteField/plugin';
import { documentActions } from '@/actions';

export default defineConfig({
  name: 'default',
  title: appConfig.title,

  projectId: appConfig.projectId,
  dataset: appConfig.dataset,

  plugins: [
    noteField(),
    codeInput(),
    // Set up UI and logic for managing and editing Singleton documents
    setupSingletons(LOCKED_DOCUMENT_TYPES),
    // Add the Structure Tool
    structureTool({
      name: 'content',
      title: 'Content',
      structure,
      defaultDocumentNode,
    }),
    visionTool(),
  ],

  document: {
    actions: documentActions,
  },

  schema: {
    types: schemaTypes,
  },
});
