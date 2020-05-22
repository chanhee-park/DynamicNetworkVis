class PCoold extends React.Component {
  // TODO: 마우스 호버 이벤트 (툴팁)
  // TODO: 마우스 클릭 이벤트 (노드링크 다이어그램)
  // TODO: Interaction - P-coord 영역 선택 -> scatter 와 연동
  constructor(props) {
    super(props);
    this.state = {
      svg: null,
      networks: this.props.network.subNetworks,
      statsMinMax: PCoold.minMaxStats(this.props.network.subNetworks),
    }
  }

  componentDidMount () {
    const containerId = Util.getParentIdOfReactComp(this);
    this.setState({
      svg: Util.generateSVG(containerId),
    });
  }

  componentDidUpdate () {
    PCoold.drawPCoold(this.state.svg, this.state.networks, this.state.statsMinMax);
  }

  static drawPCoold (svg, networks, statsMinMax) {
    svg.selectAll("*").remove();
    // data size 
    const networkLen = networks.length;
    const statsKeys = Object.keys(statsMinMax);
    const statLen = statsKeys.length;

    // get svg box 
    const svgBBox = svg.node().getBoundingClientRect();
    const svgW = svgBBox.width;
    const svgH = svgBBox.height;
    const paddingW = 50;
    const paddingH = 30;

    // set parallel coordinates graph size
    const drawBoxW = svgW - paddingW * 2;
    const drawBoxH = svgH - paddingH * 2;

    // Draw Axis and Legend
    const xInterval = drawBoxW / (statLen - 1);
    statsKeys.forEach((key, i) => {
      const x = i * xInterval + paddingW;

      // 세로 선
      svg.append('line').attrs({
        x1: x,
        x2: x,
        y1: paddingH,
        y2: paddingH + drawBoxH,
        stroke: COLOR_AXIS,
        'stroke-width': 2,
      });

      // 통계치 이름
      svg.append('text').text(key).attrs({
        x: x,
        y: paddingH + drawBoxH + 10,
        'text-anchor': 'middle',
        'alignment-baseline': 'hanging',
        'font-size': 14
      });

      // 가로선과 통계 수치
      const numOfHorLine = 4;
      const yInterval = drawBoxH / (numOfHorLine - 1);
      const statMin = statsMinMax[key].min;
      const statMax = statsMinMax[key].max;
      const valInterval = (statMax - statMin) / (numOfHorLine - 1);
      for (let j = 0; j < numOfHorLine; j++) {
        const y = j * yInterval + paddingH;
        const val = parseInt((numOfHorLine - j - 1) * valInterval + statMin);

        // 가로선
        svg.append('line').attrs({
          x1: x - 10,
          x2: x + 10,
          y1: y,
          y2: y,
          stroke: COLOR_AXIS
        });

        // 통계 수치
        svg.append('text').text(val).attrs({
          x: x + 15,
          y: y,
          'text-anchor': 'start',
          'alignment-baseline': 'centeral',
          'font-size': 9
        });
      }
    });


    // Draw Paths for each Network 
    const lineFunction = d3.line()
      .x(function (d) { return d.x; })
      .y(function (d) { return d.y; })
      .curve(d3.curveMonotoneX);
    // curveLinear, curveBasis, curveMonotoneX, curveCatmullRom.alpha(1)

    for (let i = 0; i < networkLen; i++) {
      const n = networks[i];
      if (n.nodes.size === 0) continue;

      // Set Line Data
      const lineData = [];
      statsKeys.forEach((k, j) => {
        const smin = statsMinMax[k].min;
        const smax = statsMinMax[k].max;
        const valRel = 1 - (n.stats[k] - smin) / (smax - smin + Number.MIN_VALUE);
        lineData.push({
          x: j * xInterval + paddingW,
          y: valRel * drawBoxH + paddingH
        });
      });

      // Draw Line
      svg.append("path")
        .attrs({
          d: lineFunction(lineData),
          stroke: d3.interpolateYlGnBu(
            // 0.25 ~ 1.00
            (i + 1 + networkLen / 4) / (networkLen + networkLen / 4)
          ),
          "stroke-width": 2,
          opacity: 0.5,
          fill: "none",
        });
    }

    return;
  }

  static minMaxStats (networks) {
    const stats = networks.map(n => n.stats);
    const statsByKey = Util.transposeCollection(stats);
    const ret = {};
    for (const [key, value] of Object.entries(statsByKey)) {
      const minmaxValue = Util.minmax(value);
      ret[key] = {
        min: minmaxValue[0],
        max: minmaxValue[1],
      };
    }
    return ret;
  }

  render () {
    return <div id={"#" + this.props.id}></div>
  }
}