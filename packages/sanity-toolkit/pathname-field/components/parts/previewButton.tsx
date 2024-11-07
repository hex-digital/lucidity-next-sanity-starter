import React, { useCallback } from 'react';
import { Button } from '@sanity/ui';
import { EyeOpenIcon } from '@sanity/icons';
import { useSafeNavigate, useSafePreview } from '../../hooks';

export function PreviewButton({ localizedPathname }: { localizedPathname: string }) {
  const navigate = useSafeNavigate();
  const preview = useSafePreview();

  const handleClick = useCallback(() => {
    if (!navigate) {
      return;
    }

    navigate(localizedPathname);
  }, [navigate, localizedPathname]);

  return (
    !!navigate && (
      <Button
        text="Preview"
        fontSize={1}
        height={'100%'}
        mode="default"
        tone="default"
        icon={EyeOpenIcon}
        disabled={preview === localizedPathname}
        title="Preview page"
        onClick={handleClick}
      />
    )
  );
}
