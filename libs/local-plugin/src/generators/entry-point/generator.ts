import {
  formatFiles,
  generateFiles,
  names,
  readJson,
  readProjectConfiguration,
  Tree,
  updateJson,
} from '@nx/devkit';
import { EntryPointGeneratorSchema } from './schema';
import { join } from 'node:path';
import { tsquery } from '@phenomnomnominal/tsquery';
import { isPropertyAssignment } from 'typescript';

export async function entryPointGenerator(
  tree: Tree,
  options: EntryPointGeneratorSchema
) {
  // 1. grab the configuration of the main library (theme)
  const config = readProjectConfiguration(tree, options.library);

  if (!config) {
    throw new Error('no library');
  }

  // 2. generate the files for the entry
  const { fileName, className } = names(options.name);
  generateFiles(tree, join(__dirname, './files'), config.root, {
    tmpl: '',
    name: fileName,
    className,
  });

  // 3. add entry to package.json exports
  updateJson(tree, config.root + '/package.json', (json) => {
    json.exports[`./${options.name}`] = {
      import: `./${options.name}.mjs`,
      require: `./${options.name}.js`,
      types: `./${options.name}/index.d.ts`,
    };
    return json;
  });

  // 4. update tsconfig base
  const rootPackageJson = readJson(tree, config.root + '/package.json');
  updateJson(tree, 'tsconfig.base.json', (json) => {
    json.compilerOptions.paths[`${rootPackageJson.name}/${options.name}`] = [
      `libs/${config.name}/${options.name}/index.ts`,
    ];
    return json;
  });

  // 5. add entry to vite.config.ts
  const viteConfigContent = tree.read(config.root + '/vite.config.ts', 'utf8');

  const updatedContent = tsquery.replace(
    viteConfigContent,
    'PropertyAssignment:has(Identifier[name="input"]) > ObjectLiteralExpression',
    (node) => {
      const parent = node.parent;
      if (isPropertyAssignment(parent) && parent.name.getText() === 'input') {
        const nodeText = node.getFullText();
        const withoutBraces = nodeText.slice(2, -1);
        return `{
          ${withoutBraces}'${options.name}': 'libs/${options.library}/${options.name}/index.ts',
        }`;
      }
    }
  );

  tree.write(config.root + '/vite.config.ts', updatedContent);

  await formatFiles(tree);
}

export default entryPointGenerator;
