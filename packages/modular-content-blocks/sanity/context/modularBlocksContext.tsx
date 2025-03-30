import { createContext } from 'react';

export const ModularBlocksContext = createContext({
  state: {
    /**
     * Outer Modular Content Blocks show their inner blocks in an "overview preview" when viewing a Document.
     * However, this overview preview was also registering event handlers to handle closing the modals
     * on "click outside". This made it impossible to edit the inner fields content, without the modal closing.
     *
     * The `overviewPreview` state is used to wrap these overview preview components, storing whether the child
     * components are being rendered in an overview preview. The inner block custom components then check this context
     * and override the `onClose()` event handler if they are in an overview preview context, thus eliminating the issue.
     */
    overviewPreview: false,
  },
});
