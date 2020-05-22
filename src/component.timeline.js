class Timeline extends React.Component {
  // TODO: 클릭 이벤트 (노드링크 다이어그램)
  // TODO: Time Slider 코드 리펙토링 / 함수 분리 / 모듈화
  // TODO: Interaction - 시간 합치고 분리하기

  constructor(props) {
    super(props);
    this.state = {
      svg: null,
      timelineInfo: Timeline.getTimelineInfo(this.props.network),
    }
    // this.createTimeline = this.createTimeline.bind(this);
  }

  componentDidMount () {
    const containerId = Util.getParentIdOfReactComp(this);
    this.setState({
      svg: Util.generateSVG(containerId)
    });
  }

  componentDidUpdate () {
    this.createTimeline(this.state.svg, this.state.timelineInfo);
  }

  createTimeline (svg, timelineInfo) {
    svg.selectAll("*").remove();
    // get time compared data
    const bars = timelineInfo.bars;
    const max = timelineInfo.maxSize;
    const avgTimes = timelineInfo.avgTimes;

    // set rendering size
    const svgBBox = svg.node().getBoundingClientRect();
    const svgW = svgBBox.width;
    const svgH = svgBBox.height;

    const paddingRight = 180;
    const paddingTop = 40;
    const paddingBottom = 25;

    const barInterval = (svgW - paddingRight) / (bars.length + 1);
    const barW = barInterval / 4;
    const barHRatio = (svgH - (paddingTop + paddingBottom)) / (max * 2);
    const centerY = (svgH - (paddingTop + paddingBottom)) / 2 + paddingTop;

    const xStart = barInterval - barW;
    const xEnd = svgW - paddingRight;

    // Legend - colors
    const colorLegendW = 100;
    const colorLegendXStart = xEnd - colorLegendW * 3.5;
    const colorLegendY = paddingTop - 30;

    // Common Nodes & Links Color Legend
    svg.append('rect').attrs({
      x: colorLegendXStart,
      y: colorLegendY,
      width: 15,
      height: 15,
      fill: COLOR_COM_NODE
    });
    svg.append('rect').attrs({
      x: colorLegendXStart + 15 - 1,
      y: colorLegendY,
      width: 15,
      height: 15,
      fill: COLOR_COM_LINK
    });
    svg.append('text').text('Remained').attrs({
      x: colorLegendXStart + 15 * 2.2,
      y: colorLegendY + 15 / 2,
      'text-anchor': 'start',
      'alignment-baseline': 'central',
      'font-size': 14
    });

    // Added Nodes & Links Color Legend
    svg.append('rect').attrs({
      x: colorLegendXStart + colorLegendW,
      y: colorLegendY,
      width: 15,
      height: 15,
      fill: COLOR_ADD_NODE
    });
    svg.append('rect').attrs({
      x: colorLegendXStart + colorLegendW + 15 - 1,
      y: colorLegendY,
      width: 15,
      height: 15,
      fill: COLOR_ADD_LINK
    });
    svg.append('text')
      .text('Added')
      .attrs({
        x: colorLegendXStart + colorLegendW + 15 * 2.2,
        y: colorLegendY + 15 / 2,
        'text-anchor': 'start',
        'alignment-baseline': 'central',
        'font-size': 14
      });

    // Disappeared Nodes & Links Color Legend
    svg.append('rect').attrs({
      x: colorLegendXStart + colorLegendW * 2,
      y: colorLegendY,
      width: 15,
      height: 15,
      fill: COLOR_RMD_NODE
    });
    svg.append('rect').attrs({
      x: colorLegendXStart + colorLegendW * 2 + 15 - 1,
      y: colorLegendY,
      width: 15,
      height: 15,
      fill: COLOR_RMD_LINK
    });
    svg.append('text')
      .text('Disappeared')
      .attrs({
        x: colorLegendXStart + colorLegendW * 2 + 15 * 2.2,
        y: colorLegendY + 15 / 2,
        'text-anchor': 'start',
        'alignment-baseline': 'central',
        'font-size': 14
      });


    // Legend - horizontal axis
    const numOfAxisHor = 3; // 3 => 가운데, 중간 위(아래), 맨 위(아래)
    for (let i = -numOfAxisHor + 1; i < numOfAxisHor; i++) {
      const nodeVal = (i * max) / (numOfAxisHor - 1);

      // 가로 선
      const y = centerY - barHRatio * nodeVal;

      svg.append('line').attrs({
        x1: xStart,
        x2: xEnd,
        y1: y,
        y2: y,
        stroke: COLOR_AXIS,
        'stroke-width': i == 0 ? 3 : 1
      });

      if (i == numOfAxisHor - 1) {
        svg.append('text')
          .text('Nodes')
          .attrs({
            x: xEnd + 50,
            y: y - 20,
            'text-anchor': 'end',
            'alignment-baseline': 'middle'
          });
        svg.append('text')
          .text('Links')
          .attrs({
            x: xEnd + 150,
            y: y - 20,
            'text-anchor': 'end',
            'alignment-baseline': 'middle'
          });
      }
      // 노드 높이 설명
      svg.append('text')
        .text(Math.round(nodeVal))
        .attrs({
          x: xEnd + 50,
          y: y,
          'text-anchor': 'end',
          'alignment-baseline': 'middle'
        });

      // 링크 높이 설명
      const linkVal = Math.round((i * max) / (numOfAxisHor - 1));
      svg.append('text')
        .text(linkVal)
        .attrs({
          x: xEnd + 150,
          y: y,
          'text-anchor': 'end',
          'alignment-baseline': 'middle'
        });
    }

    // 시간을 순회하며 바를 그린다.
    const barLen = bars.length;
    _.forEach(bars, (bar, i) => {
      const x = (i + 1) * barInterval;

      // 세로 보조선: 노드바와 링크바 사이에 그린다.
      svg.append('line').attrs({
        x1: x + barW,
        x2: x + barW,
        y1: centerY - 10,
        y2: centerY + 10,
        stroke: COLOR_AXIS
      });

      // 시간 표시
      if (i == 0 || i == barLen - 1 || i == Math.round(barLen / 2)) {
        const timeString = Math.round(avgTimes[i]);
        svg.append('text').text(timeString).attrs({
          x: x + barW,
          y: svgH - paddingBottom + 10,
          'text-anchor': 'middle',
          'alignment-baseline': 'hanging',
        });
      }

      // 바 그리기
      // TODO: 노드 링크 높이 따로따로
      const values = [
        bar.nodes.preOnly.size,  // removed
        bar.nodes.postOnly.size, // added
        bar.nodes.common.size,   // common
        bar.links.preOnly.size,  // removed
        bar.links.postOnly.size, // added
        bar.links.common.size    // common
      ];

      const tooltipTxt = `
        Nodes: +${values[1]}  /  -${values[0]} <br>
        Links: +${values[4]}  /  -${values[3]}
      `

      _.forEach(values, (value, j) => {
        const type = j % 3;     // [removed, added, common]
        const isNode = j < 3;   // [node, node, link, link]

        const barH = barHRatio * value;
        const barX = isNode ? x : x + barW;
        let barY = 0;
        let fill = COLOR_COM_NODE;

        if (type == 0) {  // removed
          barY = centerY;
          fill = isNode ? COLOR_RMD_NODE : COLOR_RMD_LINK;
        } else if (type == 1) { // added
          const comV = values[j + 1];
          const comBarH = barHRatio * comV;
          barY = centerY - barH - comBarH;
          fill = isNode ? COLOR_ADD_NODE : COLOR_ADD_LINK;
        } else {  // common
          barY = centerY - barH;
          fill = isNode ? COLOR_COM_NODE : COLOR_COM_LINK;
        }

        svg.append('rect').attrs({
          x: barX,
          y: barY,
          width: barW,
          height: barH,
          fill: fill
        }).on("mouseover", function () {
          var xPosition = parseFloat(d3.select(this).attr("x")) + 50;
          var yPosition = parseFloat(d3.select(this).attr("y")) + 50;
          d3.select("#tooltip")
            .style("left", xPosition + "px")
            .style("top", yPosition + "px")
            .select("#value")
            .html(tooltipTxt);
          d3.select("#tooltip").classed("hidden", false);
        }).on("mouseout", function () {
          d3.select("#tooltip").classed("hidden", true);
        })
      });
    });
  }

  static getTimelineInfo (totalNetwork) {
    const subNetworks = totalNetwork.subNetworks;
    const ret = [Network.compare(new Network(), subNetworks[0])];
    const sizes = [subNetworks[0].nodes.size, subNetworks[0].links.size];
    const avgTimes = [subNetworks[0].timeAvg];

    for (let i = 1; i < subNetworks.length; i++) {
      ret.push(totalNetwork.compareInfo[i - 1][i]);
      sizes.push(subNetworks[i].nodes.size);
      sizes.push(subNetworks[i].links.size);
      avgTimes.push(subNetworks[i].timeAvg);
    }

    return { bars: ret, maxSize: Util.max(sizes), avgTimes };
  }

  render () {
    return <div id={"#" + this.props.id}></div>
  }
}


