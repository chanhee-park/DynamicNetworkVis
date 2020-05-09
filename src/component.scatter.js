class ScatterPlot extends React.Component {
  constructor(props) {
    super(props);
    this.svg = Util.getSVG(this.props.containerId);
    this.distances = this.props.network.subNetDistances;
    this.networks = this.props.network.subNetworks;
    this.points = ScatterPlot.getScatterData(this.distances, this.networks);
  }

  componentDidMount () {
    this.drawScatterPlot(this.svg, this.points);
  }

  componentDidUpdate () {
    this.drawScatterPlot(this.svg, this.points);
  }

  drawScatterPlot (svg, points) {
    // get svg box 
    const svgBBox = svg.node().getBoundingClientRect();

    // set render zone size
    const svgW = svgBBox.width,
      svgH = svgBBox.height,
      paddingTop = 100,
      paddingBottom = 50,
      paddingLeft = 100,
      paddingRight = 50,
      graphPdding = 5;

    // set scatter plot graph size
    const drawBoxW = svgW - paddingRight - paddingLeft,
      drawBoxH = svgH - paddingTop - paddingBottom,
      maximumRadius = 25;

    // define sizing variable for circles on the scatter plot.
    const pointPosXRatio = drawBoxW / (points.maxX - points.minX);
    const pointPosYRatio = drawBoxH / (points.maxY - points.minY);
    const pointRadiusRatio = maximumRadius / points.maxR;

    // Define position, size, and color of  circles on the scatter plot 
    const getCircle = (p) => {
      return {
        cx: (p.x - points.minX) * pointPosXRatio + paddingLeft + graphPdding,
        cy: (p.y - points.minY) * pointPosYRatio + paddingTop + graphPdding,
        r: p.r * pointRadiusRatio,
        fill: p.c,
        opacity: p.a,
      }
    }

    // draw circles on the scatter plot
    _.forEach(points.pointArr, (p, i) => {
      const attrs = getCircle(p)
      svg.append('circle').attrs(attrs);
      svg.append('text').text(i).attrs({
        x: attrs.cx,
        y: attrs.cy,
        'text-anchor': 'middle',
        'alignment-baseline': 'middle',
        fill: '#333',
      });
    });

    // Draw Axis and Legend

    // Draw Title 

    return;
  }

  static getScatterData (distanceMatrix, networks) {
    const N = networks.length;

    // const vector = Util.pca(subNetDistances);
    const vector = Util.mds(distanceMatrix);
    const points = new Points();
    vector.forEach((v, i) => {
      points.add(new Point({
        x: v[0],
        y: v[1],
        r: Math.sqrt(networks[i].nodes.size),
        c: d3.interpolateGnBu((i + N / 4) / (N - 1 + N / 4)),
        a: 0.5
      }));
    });

    return points;
  }

  render () {
    return <div id={"#" + this.props.id}></div>
  }
}

class Points {
  constructor(pointArr) {
    const isEmpty = typeof pointArr !== 'undefined';
    this.pointArr = isEmpty ? pointArr : [];
    this.minX = isEmpty ? _.minBy(pointArr, 'x') : +Infinity;
    this.maxX = isEmpty ? _.maxBy(pointArr, 'x') : -Infinity;
    this.minY = isEmpty ? _.minBy(pointArr, 'y') : +Infinity;
    this.maxY = isEmpty ? _.maxBy(pointArr, 'y') : -Infinity;
    this.minR = isEmpty ? _.minBy(pointArr, 'r') : +Infinity;
    this.maxR = isEmpty ? _.maxBy(pointArr, 'r') : 0;
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
