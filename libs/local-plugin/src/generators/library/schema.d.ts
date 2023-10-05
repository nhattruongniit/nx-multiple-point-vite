export interface LibraryGeneratorSchema {
  importPath?: string;
  inSourceTests?: boolean;
  linter: Linter;
  name: string;
  style: SupportedStyles;
  unitTestRunner?: 'jest' | 'vitest' | 'none';
}
