export default {
  'backend/src/**/*.ts': files => {
    const relativePaths = files.map(f => f.replace(/\\/g, '/'));
    return [
      `eslint --config backend/eslint.config.mjs --fix ${relativePaths.join(' ')}`,
      `prettier --config backend/.prettierrc --write ${relativePaths.join(' ')}`,
    ];
  },
  'frontend/src/**/*.{ts,vue}': files => {
    const relativePaths = files.map(f => f.replace(/\\/g, '/'));
    return [
      `eslint --config frontend/eslint.config.mjs --fix ${relativePaths.join(' ')}`,
      `prettier --config frontend/.prettierrc --write ${relativePaths.join(' ')}`,
    ];
  },
  'frontend/src/**/*.{scss,css}': files => {
    const relativePaths = files.map(f => f.replace(/\\/g, '/'));
    return [`prettier --config frontend/.prettierrc --write ${relativePaths.join(' ')}`];
  },
};
