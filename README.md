# AmaEcosystemComponent

<a alt="Nx logo" href="https://nx.dev" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="45"></a>

✨ **This workspace has been generated by [Nx, a Smart, fast and extensible build system.](https://nx.dev)** ✨


## Script

```bash
# create apps
- Which stack do you want to use?: react
- What framework would you like to use?: none
- Integrated monorepo
- Which bundler would you like to use? vite
- Test runner? playwright
- Stylesheet? css
- Enable distribute caching to make your CI faster? no

# run localhost:4200
$ npx nx run amanotes:serve 

# create react library
npx nx generate @nx/react:library --name=theme --unitTestRunner=none --bundler=rollup --directory=libs/theme --appProject=amanotes --importPath=@ama-ecosystem/theme --projectNameAndRootFormat=derived --publishable=true --no-interactive

# publish npm
## Go to libs/themes/piano/package.json
{
  ...
  "publishConfig": {
    "access": "public"
  }
}

## Build library piano
$ npx nx run theme:build

# Registry npm package
$ npm login (create Organizations ama-ecosystem)

# publish npm package
$ cd dist
$ npm publish --access=public
```

## Setup multiple points vite react libraray
```bash
# 1. create react library
npx nx generate @nx/react:library --name=theme --bundler=vite --directory=libs/theme --projectNameAndRootFormat=as-provided --no-interactive --dry-run  

# 2.edit tsconfig.lib.json
Go to libs/theme/tsconfig.lib.json
- "exclude": add "vite.config.ts"
- "include": delete text "src"

# 3. edit vite.config.ts
Go to libs/theme/vite.config.ts
- change fileName: 'index' to "[name]" in build/lib
- change './src' to '.' in entryRoot
- add input in rollupOptions:
  input: {
    index: 'libs/theme/src/index.ts',
    piano: 'libs/theme/piano/index.ts',
  }

# 4. edit tsconfig.base.json
"paths": {
  "@ama-ecosystem/theme": ["libs/theme/src/index.ts"],
  "@ama-ecosystem/theme/piano": ["libs/theme/piano/index.ts"]
}

```

## Temp

- Flag: --dry-run: chạy thử command, ko thực sự chạy command
- Ex: npm install -> tạo node_modules, tạo package-lock.json
- npm install —dry-run -> báo cho users biết là nó sẽ tạo node_modules, tạo package-lock.json

## Set up CI!

Nx comes with local caching already built-in (check your `nx.json`). On CI you might want to go a step further.

- [Set up remote caching](https://nx.dev/core-features/share-your-cache)
- [Set up task distribution across multiple machines](https://nx.dev/core-features/distribute-task-execution)
- [Learn more how to setup CI](https://nx.dev/recipes/ci)

## Connect with us!

- [Join the community](https://nx.dev/community)
- [Subscribe to the Nx Youtube Channel](https://www.youtube.com/@nxdevtools)
- [Follow us on Twitter](https://twitter.com/nxdevtools)
