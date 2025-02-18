import type { PropsWithChildren } from 'react';
import { Card, Flex, Stack, TextInput } from '@sanity/ui';
import { SearchIcon } from '@sanity/icons';
// import { Text, Tooltip } from '@sanity/ui';
// import { ViewButton } from './ViewButton';
// import { CiBoxList } from 'react-icons/ci';
// import { IoGridOutline } from 'react-icons/io5';

interface Props {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  gridView: boolean;
  setGridView: (value: boolean) => void;
}

export function ArrayItemDialogControls({
  searchQuery,
  setSearchQuery,
  // gridView,
  // setGridView,
}: Readonly<PropsWithChildren<Props>>) {
  return (
    <Stack space={2}>
      <Flex align="center" marginTop={4} marginBottom={2} paddingY={1} marginRight={2} gap={4}>
        <Card radius={4} tone="transparent" style={{ flexBasis: '100%' }}>
          <TextInput
            aria-label="Search by name"
            placeholder="Search by name"
            autoComplete="off"
            border={false}
            clearButton={false}
            fontSize={[2, 2, 1]}
            icon={SearchIcon}
            radius={2}
            value={searchQuery}
            onChange={(event) => {
              setSearchQuery(event.currentTarget.value);
            }}
            spellCheck={false}
          />
        </Card>
        {/* @todo turn list view back on once styled */}
        {/*{(*/}
        {/*  <Tooltip*/}
        {/*    content={<Text size={2}>{gridView ? 'List View' : 'Grid View'}</Text>}*/}
        {/*    placement="top"*/}
        {/*  >*/}
        {/*    <ViewButton*/}
        {/*      onClick={() => {*/}
        {/*        setGridView(!gridView);*/}
        {/*      }}*/}
        {/*    >*/}
        {/*      {gridView ? <CiBoxList /> : <IoGridOutline />}*/}
        {/*    </ViewButton>*/}
        {/*  </Tooltip>*/}
        {/*)}*/}
      </Flex>
    </Stack>
  );
}
