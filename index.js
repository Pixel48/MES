import MES from './mes.js';
import fs from 'fs';

fs.readdirSync('./.data/').forEach((filename) => {
  const datasetPath = `./.data/${filename}`;
  for (let degree = 2; degree < 5; degree++) {
    console.debug(`\n\n\t\t[[[ Całkowanie ${degree}-punktowe ]]]`);
    const outputPath = `./vtk/${degree}/${filename}`;
    const mes = new MES(datasetPath, false, degree);

    mes.bake(outputPath, false);
    // mes.test();
  }
});
