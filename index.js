import MES from './mes.js';
import fs from 'fs';

fs.readdirSync('./.data/').forEach((filename) => {
  console.debug(`\t%%% ${filename} %%%`);
  const datasetPath = `./.data/${filename}`;
  const outputPath = `./vtk/${filename}`;
  const mes = new MES(datasetPath, false);
  mes.bake(outputPath, false);
});
