import { Button } from '@sanity/ui';
import { useTranslation } from 'sanity';

export interface GenerateButtonProps {
  isGenerating: boolean;
  readOnly: boolean;
  onClick: () => void;
}

export function GenerateButton({ isGenerating, readOnly, onClick }: GenerateButtonProps) {
  const { t } = useTranslation();

  return (
    <Button
      mode="ghost"
      type="button"
      disabled={readOnly || isGenerating}
      onClick={onClick}
      text={
        isGenerating ? t('inputs.slug.action.generating') : t('inputs.slug.action.generate')
      }
    />
  );
}
