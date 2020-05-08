class ScatterPlot extends React.Component {
  constructor(props) {
    super(props);
    this.createScatterPlot = this.createScatterPlot.bind(this);
  }

  componentDidMount () {
    this.createScatterPlot();
  }

  componentDidUpdate () {
    this.createScatterPlot();
  }

  createScatterPlot () {
    // get scatter plot data
    const data = this.getScatterPlotData(this.props.network.subNetDistances);

    const subNetworks = this.props.network.subNetworks;
    const maximumNodes = _.maxBy(subNetworks, (n) => n.nodes.size).nodes.size;

    // set redering size
    const svg = Util.getSVG(this.props.containerId);
    const svgBBox = svg.node().getBoundingClientRect();
    const svgW = svgBBox.width;
    const svgH = svgBBox.height;

    const paddingTop = 100;
    const paddingBottom = 50;
    const paddingLeft = 100;
    const paddingRight = 50;
    const graphPdding = 5;

    const drawBoxW = svgW - paddingRight - paddingLeft;
    const drawBoxH = svgH - paddingTop - paddingBottom;
    const drawBoxMinLen = Math.min(drawBoxW, drawBoxH) - graphPdding;

    const pointPosXRatio = drawBoxMinLen / (data.maxX - data.minX);
    const pointPosYRatio = drawBoxMinLen / (data.maxY - data.minY);
    const maximumRadius = 25;
    const getPoint = (pos, i) => {
      return {
        x: (pos.x - data.minX) * pointPosXRatio + paddingLeft + graphPdding,
        y: (pos.y - data.minY) * pointPosYRatio + paddingTop + graphPdding,
        r: Math.sqrt(subNetworks[i].nodes.size / maximumNodes) * maximumRadius,
      }
    }

    // draw circles on the scatter plot
    const N = data.pos.length;
    _.forEach(data.pos, (p, i) => {
      const point = getPoint(p, i);
      svg.append('circle').attrs({
        cx: point.x,
        cy: point.y,
        r: point.r,
        fill: d3.interpolateGnBu((i + N / 4) / (N - 1 + N / 4)),
        opacity: 0.5,
      });
      svg.append('text').text(i).attrs({
        x: point.x,
        y: point.y,
        'text-anchor': 'middle',
        'alignment-baseline': 'middle',
        fill: '#333',
      });
    });

  }

  getScatterPlotData (subNetDistances) {
    // const vector = Util.pca(subNetDistances);
    const vector = Util.mds(subNetDistances);

    const pos = [];
    let minX = +Infinity,
      minY = +Infinity,
      maxX = -Infinity,
      maxY = -Infinity;

    _.forEach(vector, v => {
      pos.push({ x: v[0], y: v[1] });
      minX = Math.min(minX, v[0]);
      maxX = Math.max(maxX, v[0]);
      minY = Math.min(minY, v[1]);
      maxY = Math.max(maxY, v[1]);
    });

    return { pos, minX, minY, maxX, maxY };
  }

  render () {
    return <div id={"#" + this.props.id}></div>
  }

}