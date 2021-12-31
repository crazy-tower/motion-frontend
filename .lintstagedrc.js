module.exports = {
  '**/*.ts?(x)': (filenames) =>
    `next lint --fix --file ${filenames
      .map((file) => file.split(process.cwd())[1])
      .join(' --file ')}`,
  '**/*.{js,jsx,ts,tsx,json,css}': 'prettier --write --ignore-path .gitignore',
};
