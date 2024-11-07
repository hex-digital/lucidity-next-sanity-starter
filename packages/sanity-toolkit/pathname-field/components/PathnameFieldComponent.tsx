import React, { useMemo, useRef } from 'react';
import { Box, Button, Card, Flex, Stack, Text, TextInput } from '@sanity/ui';
import { useDebounce, useDebouncedCallback } from 'use-debounce';
import { FormFieldValidationStatus, useFormValue } from 'sanity';
import { useSafeNavigate, useSafePreview } from '../hooks';
import { GenerateButton, PreviewButton } from './parts';
import type { DocumentWithLocale, PathnameInputProps } from '../types';
import { EditIcon, FolderIcon, LockIcon } from '@sanity/icons';
import { getDocumentPath } from '../utilities/urls';
import { usePathnameOptions } from '../hooks/usePathnameOptions';
import { usePathnameState } from '../hooks/usePathnameState';
import { usePathnameHandlers } from '../hooks/usePathnameHandlers';

const pathnameDebounceTime = 1000;

export function PathnameFieldComponent(props: PathnameInputProps): JSX.Element {
  const {
    schemaType: _schemaType,
    inputProps: { onChange, value, readOnly },
    title,
    description,
    validation = [],
  } = props;
  const { prefix, folderOptions, i18nOptions, autoNavigate, sourceField } =
    usePathnameOptions(props);

  const { folder, slug, folderLocked, setFolderLocked, folderCanUnlock } = usePathnameState(
    value,
    folderOptions,
    readOnly ?? false,
  );

  const document = useFormValue([]) as DocumentWithLocale;
  const navigate = useSafeNavigate();
  const preview = useSafePreview();
  const debouncedNavigate = useDebouncedCallback((newPreview?: string) => {
    if (navigate) navigate(newPreview);
  }, pathnameDebounceTime);

  const localizedPathname = getDocumentPath(
    {
      ...document,
      locale: i18nOptions.enabled ? document.locale : undefined,
      pathname: value?.current,
    },
    i18nOptions.defaultLocaleId || '',
    i18nOptions.localizePathname,
  );
  const [debouncedLocalizedPathname] = useDebounce(localizedPathname, pathnameDebounceTime);

  const fullPathInputRef = useRef<HTMLInputElement>(null);
  const pathSegmentInputRef = useRef<HTMLInputElement>(null);

  const inputValidationProps = useMemo(
    () => (validation.length ? { customValidity: validation[0]?.message } : {}),
    [validation],
  );

  const { updateFinalSegment, updateFullPath, unlockFolder, handleBlur } = usePathnameHandlers(
    {
      onChange,
      document,
      i18nOptions,
      debouncedLocalizedPathname,
      preview,
      autoNavigate,
      debouncedNavigate,
      folder,
      setFolderLocked,
      fullPathInputRef,
    },
  );

  const pathInput = useMemo(() => {
    const commonProps = {
      document,
      onChange,
      folder,
      disabled: readOnly,
      localizedPathname,
      i18nOptions,
      preview,
      navigate: autoNavigate ? debouncedNavigate : undefined,
    };

    return folderLocked && folder ? (
      <Flex gap={1} align="center">
        <Card
          paddingLeft={2}
          paddingRight={1}
          paddingY={1}
          border
          radius={1}
          tone="transparent"
          style={{ position: 'relative' }}
        >
          <Flex gap={2} align="center">
            <Text muted>
              <FolderIcon />
            </Text>
            <Text
              muted
              style={{ whiteSpace: 'nowrap', overflowX: 'hidden', textOverflow: 'ellipsis' }}
            >
              {folder}
            </Text>
            <Button
              icon={folderCanUnlock ? EditIcon : LockIcon}
              onClick={unlockFolder}
              title={
                folderCanUnlock
                  ? "Edit path's folder"
                  : 'Folder is locked and cannot be changed'
              }
              mode="bleed"
              tone="primary"
              padding={2}
              fontSize={1}
              disabled={!folderCanUnlock}
            >
              <span />
            </Button>
          </Flex>
        </Card>
        <Text muted size={2}>
          /
        </Text>
        <Box flex={1}>
          <TextInput
            value={slug}
            onChange={updateFinalSegment}
            ref={pathSegmentInputRef}
            onBlur={handleBlur}
            disabled={readOnly}
            {...inputValidationProps}
          />
        </Box>
        {sourceField && <GenerateButton sourceField={sourceField} {...commonProps} />}
        {!autoNavigate && <PreviewButton localizedPathname={localizedPathname || ''} />}
      </Flex>
    ) : (
      <Flex gap={1} align="center">
        <Box flex={1}>
          <TextInput
            value={value?.current || ''}
            onChange={updateFullPath}
            ref={fullPathInputRef}
            onBlur={handleBlur}
            disabled={readOnly}
            style={{ flex: 1 }}
            {...inputValidationProps}
          />
        </Box>
        {sourceField && <GenerateButton sourceField={sourceField} {...commonProps} />}
        {!autoNavigate && <PreviewButton localizedPathname={localizedPathname || ''} />}
      </Flex>
    );
  }, [
    autoNavigate,
    debouncedNavigate,
    document,
    folder,
    folderCanUnlock,
    folderLocked,
    handleBlur,
    i18nOptions,
    inputValidationProps,
    localizedPathname,
    onChange,
    preview,
    readOnly,
    slug,
    sourceField,
    unlockFolder,
    updateFinalSegment,
    updateFullPath,
    value,
  ]);

  return (
    <Stack space={3}>
      <Stack space={2} flex={1}>
        <Flex align="center" paddingY={1}>
          <Text size={1} weight="semibold">
            {title}
          </Text>
          {validation.length > 0 && (
            <Box marginLeft={2}>
              <FormFieldValidationStatus
                fontSize={1}
                placement="top"
                validation={validation}
              />
            </Box>
          )}
        </Flex>
        {description && <Text size={1}>{description}</Text>}
      </Stack>

      {typeof value?.current === 'string' && (
        <Text muted>
          {prefix}
          {localizedPathname}
        </Text>
      )}

      {pathInput}
    </Stack>
  );
}
