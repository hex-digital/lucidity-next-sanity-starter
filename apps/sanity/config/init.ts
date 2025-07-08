import { spawn } from 'child_process';
import { copyFileSync, existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import inquirer from 'inquirer';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const rootDir = join(__dirname, '..');
const webDir = join(rootDir, '..', 'web');

/**
 * Check if environment files already exist and prompt user for action
 * Returns the user's choice: 'override', 'replace', or 'cancel'
 */
async function checkExistingEnvironmentFiles(): Promise<'override' | 'replace' | 'cancel'> {
  const sanityEnvLocalPath = join(rootDir, '.env.local');
  const webEnvLocalPath = join(webDir, '.env.local');

  const sanityExists = existsSync(sanityEnvLocalPath);
  const webExists = existsSync(webEnvLocalPath);

  /** If no existing files, proceed normally */
  if (!sanityExists && !webExists) {
    return 'replace';
  }

  /** If existing environment files, prompt user for action */
  console.log('\n⚠️  Environment files already exist:');
  if (sanityExists) console.log('  • Sanity: .env.local');
  if (webExists) console.log('  • Web: .env.local');
  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'How would you like to proceed?',
      choices: [
        {
          name: 'Override - Keep existing files, only update Sanity values',
          value: 'override',
        },
        {
          name: 'Replace - Replace existing environment files',
          value: 'replace',
        },
        {
          name: 'Cancel - Exit without making changes',
          value: 'cancel',
        },
      ],
    },
  ]);

  return action;
}

/**
 * Extracts a value from ANSI-coloured CLI output based on a given label.
 *
 * Example:
 * Project ID: \u001b[36mmy-project-id\u001b[39m
 *
 * Regex matches the label, skips ANSI colour codes, and captures the value.
 *
 * @param {string} label - The label to search for (e.g. "Project ID" or "Dataset").
 * @param {string} cliOutput - The full CLI output string to parse.
 * @returns {string} The captured value, or throws an error if not found.
 */
function extractSanityCliValue(label: string, cliOutput: string): string {
  const regex = new RegExp(`${label}:\\s*\\u001b\\[[0-9;]*m([^\\s]+)\\u001b\\[[0-9;]*m`);
  const match = cliOutput.match(regex);
  if (!match) {
    throw new Error(`Could not extract ${label} from Sanity CLI output.`);
  }
  return match[1].trim();
}

/**
 * Initialize the Sanity project by running the Sanity CLI initialization
 * This function handles the interactive setup process and captures the output
 * to extract project configuration details
 */
async function runSanityInitialization(): Promise<{ projectId: string; dataset: string }> {
  console.log('\n📦 Running Sanity initialization...');
  console.log('Please follow the prompts to set up your Sanity project...');

  /** Run the Sanity CLI initialization, capture the output and pipe to terminal */
  const sanityInit = spawn('npx', ['sanity', 'init', '--bare'], {
    stdio: ['inherit', 'pipe', 'inherit'],
    cwd: rootDir,
    env: {
      ...process.env,
      FORCE_COLOR: '1',
      CI: 'false',
      TERM: process.env.TERM || 'xterm-256color',
    },
  });

  let output = '';
  sanityInit.stdout.on('data', (data) => {
    const text = data.toString();
    output += text;
    /** Pipe to terminal for interactive use */
    process.stdout.write(text);
  });

  await new Promise((resolve, reject) => {
    sanityInit.on('close', (code) => {
      if (code === 0) {
        resolve(true);
      } else {
        reject(new Error(`Sanity init failed with code ${code}`));
      }
    });
  });

  /** Extract project details from CLI output */
  const projectId = extractSanityCliValue('Project ID', output);
  const dataset = extractSanityCliValue('Dataset', output);

  return { projectId, dataset };
}

/**
 * Set up environment files for both Sanity and Web applications
 * Copies .env.example files to .env.local and updates them with project configuration
 */
function setupEnvironmentFiles(
  projectId: string,
  dataset: string,
  action: 'override' | 'replace',
): void {
  console.log('\n📝 Setting up environment variables...');

  /** Sanity app environment files */
  const sanityEnvExamplePath = join(rootDir, '.env.example');
  const sanityEnvLocalPath = join(rootDir, '.env.local');

  /** Web app environment files */
  const webEnvExamplePath = join(webDir, '.env.example');
  const webEnvLocalPath = join(webDir, '.env.local');

  /** Sanity app environment setup */
  if (action === 'replace' && existsSync(sanityEnvExamplePath)) {
    copyFileSync(sanityEnvExamplePath, sanityEnvLocalPath);
    console.log('✓ Copied Sanity .env.example to .env.local');
  } else if (action === 'replace') {
    console.log('⚠️ No Sanity .env.example found, creating new environment file');
  } else {
    console.log('✓ Keeping existing Sanity .env.local file');
  }

  /** Web app environment setup */
  if (action === 'replace' && existsSync(webEnvExamplePath)) {
    copyFileSync(webEnvExamplePath, webEnvLocalPath);
    console.log('✓ Copied Web .env.example to .env.local');
  } else if (action === 'replace') {
    console.log('⚠️ No Web .env.example found, creating new environment file');
  } else {
    console.log('✓ Keeping existing Web .env.local file');
  }

  /** Update Sanity app environment file */
  let sanityEnvLocalContent = readFileSync(sanityEnvLocalPath, 'utf-8');

  /** Update Sanity variables */
  sanityEnvLocalContent = sanityEnvLocalContent
    .replace(
      /SANITY_STUDIO_SANITY_PROJECT_ID=.*\n?/,
      `SANITY_STUDIO_SANITY_PROJECT_ID=${projectId}\n`,
    )
    .replace(
      /SANITY_STUDIO_SANITY_DATASET=.*\n?/,
      `SANITY_STUDIO_SANITY_DATASET=${dataset}\n`,
    );

  writeFileSync(sanityEnvLocalPath, sanityEnvLocalContent.trim() + '\n');

  /** Update Web app environment file */
  let webEnvLocalContent = readFileSync(webEnvLocalPath, 'utf-8');

  /** Update Web variables */
  webEnvLocalContent = webEnvLocalContent
    .replace(
      /NEXT_PUBLIC_SANITY_PROJECT_ID=.*\n?/,
      `NEXT_PUBLIC_SANITY_PROJECT_ID=${projectId}\n`,
    )
    .replace(/NEXT_PUBLIC_SANITY_DATASET=.*\n?/, `NEXT_PUBLIC_SANITY_DATASET=${dataset}\n`);

  writeFileSync(webEnvLocalPath, webEnvLocalContent.trim() + '\n');

  console.log('\n✅ Environment files updated successfully!');
}

/**
 * Prompt the user to import sample data if available
 * This function checks for sample data files and offers to import them into the dataset
 */
async function promptForSampleDataImport(dataset: string): Promise<void> {
  const sampleDataPath = join(rootDir, 'sample-data.tar.gz');
  if (!existsSync(sampleDataPath)) {
    return;
  }

  console.log('\n📦 Found sample data! Would you like to import it?');
  console.log('This will populate your Sanity dataset with sample content.');

  /** Prompt user for import */
  const { execSync } = await import('child_process');
  const readline = await import('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const answer = await new Promise<string>((resolve) => {
    rl.question('Import sample data? (y/N): ', resolve);
  });
  rl.close();

  if (answer.toLowerCase() === 'y') {
    console.log('\n📥 Importing sample data...');
    try {
      execSync(`npx sanity dataset import sample-data.tar.gz ${dataset}`, {
        stdio: 'inherit',
        cwd: rootDir,
      });
      console.log('✅ Sample data imported successfully!');
    } catch (error) {
      console.error('❌ Error importing sample data:', error);
    }
  }
}

/**
 * Display the final success message and next steps for the user
 * Provides clear instructions on how to proceed after initialization
 */
function displayNextSteps(): void {
  console.log('\n🎉 Sanity project initialized successfully!');
  console.log('\nNext steps:');
  console.log('1. Start the development server: pnpm g:dev');
  console.log('2. Open the Sanity Studio: http://localhost:3333');
  console.log('3. Open the Next.js app: http://localhost:3000');

  const sampleDataPath = join(rootDir, 'sample-data.tar.gz');
  if (existsSync(sampleDataPath)) {
    console.log('4. Optionally import sample data using the command above');
  }
}

/**
 * Main initialization function that orchestrates the entire setup process
 * This function coordinates all the initialization steps in the correct order
 */
async function main(): Promise<void> {
  try {
    console.log('🚀 Initializing Sanity project...');

    /** Check for existing environment files before proceeding */
    const action = await checkExistingEnvironmentFiles();
    if (action === 'cancel') {
      console.log('\n❌ Initialization cancelled by user.');
      process.exit(0);
    }

    const { projectId, dataset } = await runSanityInitialization();
    setupEnvironmentFiles(projectId, dataset, action);
    await promptForSampleDataImport(dataset);
    displayNextSteps();
  } catch (error) {
    console.error('❌ Error during initialization:', error);
    process.exit(1);
  }
}

main();
