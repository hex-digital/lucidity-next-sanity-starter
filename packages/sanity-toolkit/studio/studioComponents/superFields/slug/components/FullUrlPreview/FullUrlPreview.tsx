import styles from './styles.module.css';
import { Flex, Text } from '@sanity/ui';
import { FaExternalLinkAlt } from 'react-icons/fa';

export function FullUrlPreview({ fullPathname }: { fullPathname: string }) {
  return (
    <a href={fullPathname} target="_blank" rel="noopener noreferrer" className={styles.link}>
      <Text muted as="span">
        <Flex as="span" align="center" gap={2}>
          {fullPathname}
          <FaExternalLinkAlt size={10} />
        </Flex>
      </Text>
    </a>
  );
}
