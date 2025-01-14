/**
 * We prefer the modular blocks to be able to be automatically imported via glob, i.e.:
 *
 *   const outerBlocksSchema = import.meta.glob<SanityBlockSchema>(
 *     '../blocks/outer/** /schema.{ts,tsx}',
 *     { eager: true },
 *   );
 *
 * However, when using Sanity's official type generation
 * (i.e. `npx sanity@latest typegen generate`), it will not work with a glob.
 * Therefore we must have a file that statically resolves each schema.
 *
 * To make this easier, this script allows us to automatically generate such a file,
 * easing the boilerplate and admin of creating new blocks.
 *
 * A similar script is provided for the web side of things (which is required because
 * Next's rust-based compiler does do handle globs).
 */

const fs = require('fs');
const path = require('path');

const generator = require('@pkg/modular-content-blocks/scripts/generate-imports-and-exports.cjs');

const outerBlocksPath = path.join(__dirname, '..', 'blocks', 'outer');
const innerBlocksPath = path.join(__dirname, '..', 'blocks', 'inner');
const outputDirectory = path.join(__dirname, '..', 'lib');
const outputPath = path.join(outputDirectory, 'blockSchemaGenerated.ts');

/**
 * Generate import statements and export them.
 */
function generateImportsAndExports() {
  const comment = generator.fileComment(__filename);

  const outers = generator.getImportsAndExports(
    outerBlocksPath,
    /schema\.ts$/,
    'schema',
    'outerSchema',
    'outerBlocksSchema',
    path.join(__dirname, '..', 'lib'),
  );
  const inners = generator.getImportsAndExports(
    innerBlocksPath,
    /schema\.ts$/,
    'schema',
    'innerSchema',
    'innerBlocksSchema',
    path.join(__dirname, '..', 'lib'),
  );

  fs.writeFileSync(
    outputPath,
    `${comment}\n\n${outers.imports}\n${inners.imports}\n${outers.exports}\n${inners.exports}`,
  );
}

generateImportsAndExports();
