import {
  formatFiles,
  generateFiles,
  names,
  Tree,
  updateJson,
} from '@nx/devkit';
import { LibraryGeneratorSchema } from './schema';
import { libraryGenerator as reactLibraryGenerator } from '@nx/react';
import { join } from 'node:path/posix';

export async function libraryGenerator(
  tree: Tree,
  options: LibraryGeneratorSchema
) {
  const { fileName } = names(options.name);
  const projectRoot = `libs/${options.name}`;

  if (!options.importPath) {
    options.importPath = `@ama-ecosystem/${options.name}`;
  }

  // 1. generate react library with default options
  await reactLibraryGenerator(tree, {
    name: options.name,
    directory: projectRoot,
    projectNameAndRootFormat: 'as-provided',
    style: options.style,
    bundler: 'vite',
    publishable: true,
    linter: options.linter,
    inSourceTests: options.inSourceTests,
    unitTestRunner: options.unitTestRunner,
    importPath: options.importPath,
  });

  // 2. delete vite.config.ts
  tree.delete(projectRoot + '/vite.config.ts');

  // 3. re-generate vite.config.ts
  generateFiles(tree, join(__dirname, 'files/vite'), projectRoot, {
    tmpl: '',
    fileName,
  });

  // 4. update tsconfig.lib.json
  updateJson(tree, projectRoot + '/tsconfig.lib.json', (json) => {
    json.exclude.push('vite.config.ts');
    json.include = json.include.map((entry: string) => {
      if (entry.startsWith('src/')) {
        return entry.replace('src/', '');
      }
      return entry;
    });
    return json;
  });

  // 5. update package.json
  updateJson(tree, projectRoot + '/package.json', (json) => {
    json.types = `./src/index.d.ts`;
    json.exports['.']['types'] = './src/index.d.ts';
    return json;
  });

  await formatFiles(tree);
}

export default libraryGenerator;
