import type { ElementType } from 'react';
import styled from 'styled-components';
import { CiBoxList } from 'react-icons/ci';
import { Flex } from '@sanity/ui';

const StyledItemAssetWrapper = styled.div`
  border: 1px solid var(--card-border-color);
  min-height: 50px;
  max-height: 400px;
  height: 100%;
  width: 100%;

  & img,
  video {
    width: 100%;
    max-height: 100%;
    object-fit: contain;
    object-position: top left;
    overflow: hidden;
  }
`;

export function ItemAssetWrapper({
  assetUrl,
  icon,
}: Readonly<{ assetUrl?: string; icon?: ElementType }>) {
  const FinalIcon = icon ?? CiBoxList;

  return (
    <StyledItemAssetWrapper>
      {assetUrl &&
        (/\.mp4$|\.mov$|\.avi$|\.wmv$|\.flv$|\.mkv$/.test(assetUrl) ? (
          <video muted={true} loop={true} autoPlay={true} src={assetUrl} />
        ) : (
          <img src={assetUrl} alt="" />
        ))}
      {!assetUrl && (
        <Flex align="center" justify="center" style={{ height: '100%' }}>
          <FinalIcon />
        </Flex>
      )}
    </StyledItemAssetWrapper>
  );
}
