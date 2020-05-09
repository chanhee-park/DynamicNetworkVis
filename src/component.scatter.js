class ScatterPlot extends React.Component {
  constructor(props) {
    super(props);
    this.svg = Util.getSVG(this.props.containerId);
    this.distances = this.props.network.subNetDistances.matrix;
    this.networkIdxs = this.props.network.subNetDistances.idxs;
    this.networks = this.props.network.subNetworks;
    this.points = ScatterPlot.getScatterData(this.distances, this.networks);
    this.points.normalize();
  }

  componentDidMount () {
    ScatterPlot.drawScatterPlot(this.svg, this.points, this.networkIdxs);
  }

  componentDidUpdate () {
    ScatterPlot.drawScatterPlot(this.svg, this.points, this.networkIdxs);
  }

  static drawScatterPlot (svg, normPoints, networkIdxs) {
    // get svg box 
    const svgBBox = svg.node().getBoundingClientRect();
    const svgW = svgBBox.width;
    const svgH = svgBBox.height;
    const paddingGraph = 50;

    // set scatter plot graph size
    const drawBoxW = svgW - paddingGraph * 2;
    const drawBoxH = svgH - paddingGraph * 2;
    const minRadius = 10;
    const maxRadius = 25;

    // Define position, size, and color of  circles on the scatter plot 
    const getCircle = p => {
      return {
        cx: paddingGraph + (drawBoxW * p.x),
        cy: paddingGraph + (drawBoxH * p.y),
        r: p.r * (maxRadius - minRadius) + minRadius,
        fill: p.c,
        opacity: p.a,
      }
    }

    // draw circles on the scatter plot
    normPoints.pointArr.forEach((p, i) => {
      const attrs = getCircle(p)
      svg.append('circle').attrs(attrs);
      svg.append('text').text(networkIdxs[i]).attrs({
        x: attrs.cx,
        y: attrs.cy,
        'text-anchor': 'middle',
        'alignment-baseline': 'middle',
        fill: '#333',
      });
    });

    // Draw Axis and Legend
    const numberOfAxis = 5;
    const axisW = svgW / (numberOfAxis + 1);
    const axisH = svgH / (numberOfAxis + 1);
    for (let i = 1; i <= numberOfAxis; i++) {
      // 가로 선
      svg.append('line').attrs({
        x1: 0,
        x2: svgW,
        y1: i * axisH,
        y2: i * axisH,
        stroke: COLOR_AXIS
      });
      // 세로 선 
      svg.append('line').attrs({
        x1: i * axisW,
        x2: i * axisW,
        y1: 0,
        y2: svgH,
        stroke: COLOR_AXIS
      });
    }
    // 가로 선 


    // TODO: 확대 축소 클릭 호버 인터랙션

    return;
  }

  static getScatterData (distanceMatrix, networks) {
    // const vector = Util.pca(distanceMatrix);
    const vector = Util.mds(distanceMatrix);
    const N = networks.length;
    const pointArr = vector.map((v, i) => new Point({
      x: v[0],
      y: v[1],
      r: Math.sqrt(networks[i].nodes.size),
      c: d3.interpolateGnBu((i + N / 4) / (N - 1 + N / 4)),
      a: 0.5
    }));

    return new Points(pointArr);
  }

  render () {
    return <div id={"#" + this.props.id}></div>
  }
}

class Points {
  constructor(pointArr) {
    const isEmpty = typeof pointArr !== 'undefined';
    this.pointArr = isEmpty ? pointArr : [];
    this.minX = isEmpty ? _.minBy(pointArr, 'x').x : +Infinity;
    this.maxX = isEmpty ? _.maxBy(pointArr, 'x').x : -Infinity;
    this.minY = isEmpty ? _.minBy(pointArr, 'y').y : +Infinity;
    this.maxY = isEmpty ? _.maxBy(pointArr, 'y').y : -Infinity;
    this.minR = isEmpty ? _.minBy(pointArr, 'r').r : +Infinity;
    this.maxR = isEmpty ? _.maxBy(pointArr, 'r').r : 0;
  }

  add (point) {
    this.pointArr.push(point);
    this.minX = Math.min(this.minX, point.x);
    this.maxX = Math.max(this.maxX, point.x);
    this.minY = Math.min(this.minY, point.y);
    this.maxY = Math.max(this.maxY, point.y);
    this.minR = Math.min(this.minR, point.r);
    this.maxR = Math.max(this.maxR, point.r);
  }

  show () {
    console.log('minX:', this.minX, ', maxX:', this.maxX);
    console.log('minY:', this.minY, ', maxY:', this.maxY);
    console.log('minR:', this.minR, ', maxR:', this.maxR);
    this.pointArr.forEach(p => console.log({ x: p.x, y: p.y, r: p.r }));
  }

  normalize () {
    this.pointArr = this.pointArr.map(p => new Point({
      x: (p.x - this.minX) / (this.maxX - this.minX),
      y: (p.y - this.minY) / (this.maxY - this.minY),
      r: (p.r - this.minR) / (this.maxR - this.minR),
      c: p.c,
      a: p.a
    }));
    this.minX = 0;
    this.minY = 0;
    this.minR = 0;
    this.maxX = 1;
    this.maxY = 1;
    this.maxR = 1;
  }

}

class Point {
  constructor(props) {
    this.x = props.x;
    this.y = props.y;
    this.r = typeof props.r !== undefined ? props.r : 5;
    this.c = typeof props.c !== undefined ? props.c : '#aaa';
    this.a = typeof props.a !== undefined ? props.a : 0.5;
  }

  print () {
    console.log({ x: p.x, y: p.y, r: p.r });
  }
}
