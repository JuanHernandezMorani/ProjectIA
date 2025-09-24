const fs = require('fs-extra');
const yaml = require('js-yaml');

export default async function formatYAML(filePath) {
  const content = await fs.readFile(filePath, 'utf-8');
  try {
    const parsed = yaml.load(content);
    return [yaml.dump(parsed)];
  } catch {
    return [content];
  }
}

module.exports = formatYAML;