// const fs = require('fs');
// const path = require('path');
import fs from 'fs';
import path from 'path';

class Element {
  constructor(nodes) {
    this.nodes = structuredClone(nodes);
    this.x_ = nodes.map((node) => node.x);
    this.y_ = nodes.map((node) => node.y);
  }

  show() {
    console.log(this);
  }
}

class Dataset {
  constructor(filepath) {
    this.loadFile(filepath);
  }
  loadFile(filepath) {
    const file = fs.readFileSync(path.join(filepath), 'utf8');

    let upNext = '';
    let nodeCount = null;
    let elementCount = null;

    const nodes = [];
    const frames = [];
    file.split('\n').forEach((line) => {
      const [variable, ...values] = line.trim().split(' ');
      const value = values.join(' ');

      switch (variable) {
        case 'SimulationTime':
          this.simulationTime = parseFloat(values[0]);
          break;
        case 'SimulationStepTime':
          this.simulationStepTime = parseFloat(values[0]);
          break;
        case 'Conductivity':
          this.conductivity = parseFloat(values[0]);
          break;
        case 'Alfa':
          this.alpha = parseFloat(values[0]);
          break;
        case 'Tot':
          this.tot = parseFloat(values[0]);
          break;
        case 'InitialTemp':
          this.initialTemp = parseFloat(values[0]);
          break;
        case 'Density':
          this.density = parseFloat(values[0]);
          break;
        case 'SpecificHeat':
          this.specificHeat = parseFloat(values[0]);
          break;
        case 'Nodes':
          nodeCount = parseInt(values[1]);
          break;
        case 'Elements':
          elementCount = parseInt(values[1]);
          break;
        case '*Node':
          upNext = 'node';
          break;
        case '*Element,':
          upNext = 'element';
          const elementType = value.split('=')[1].trim();
          this.elementType = elementType;
          break;
        case '*BC':
          upNext = 'bc';
          break;
        case '':
          break;
        default:
          switch (upNext) {
            case 'node':
              const [x, y] = value.split(',').map(parseFloat);
              const index = nodes.push({ x, y });
              if (index != parseInt(variable))
                throw new Error(`Node ${index} is missing`);
              break;
            case 'element':
              const [_, ...elements] = line
                .split(',')
                .map((v) => parseFloat(v.trim()));
              frames.push(elements);
              break;
            case 'bc':
              line
                .split(',')
                .map((v) => parseFloat(v.trim()))
                .forEach((tag) => (nodes[tag - 1].bc = true));
              break;
          }
          break;
      }
    });
    if (nodeCount != nodes.length)
      throw new Error(`${Math.abs(nodeCount - nodes.length)} nodes missing`);
    let elementIndex = 0;
    this.elements = frames.map(
      (frame) =>
        new Element(
          frame.map((node) => nodes[node - 1]),
          elementIndex++
        )
    );
  }
  show() {
    console.log(this);
  }
}

export default Dataset;

// const ds = new Dataset('./.data/test1.txt');
// ds.show();
// console.log(ds.elements[0].nodes[0]);
