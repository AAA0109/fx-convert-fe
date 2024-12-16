// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');
const packageJsonPath = './package.json';

const nextPackageVersion = process.env.NEXT_VERSION;
const netlifyPackageVersion = process.env.NETLIFY_VERSION;

if (netlifyPackageVersion) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  packageJson.dependencies['next'] = `${nextPackageVersion}`;
  packageJson.devDependencies[
    '@netlify/plugin-nextjs'
  ] = `${netlifyPackageVersion}`;
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
}
