class Timeline extends React.Component {
  constructor(props) {
    super(props)
    this.createTimeline = this.createTimeline.bind(this)
  }

  componentDidMount () {
    this.createTimeline();
  }

  componentDidUpdate () {
    this.createTimeline();
  }

  createTimeline () {
    // get time compared data
    const timelineInfo = this.getTimelineInfo(this.props.network);
    const bars = timelineInfo.bars;
    const max = timelineInfo.maxSize;
    const avgTimes = timelineInfo.avgTimes;

    // set rendering size
    const svg = Util.getSVG(this.props.containerId);

    const svgBBox = svg.node().getBoundingClientRect();
    const svgW = svgBBox.width;
    const svgH = svgBBox.height;

    const paddingRight = 200;
    const paddingTop = 50;
    const paddingBottom = 20;

    const barInterval = (svgW - paddingRight) / (bars.length + 1);
    const barW = barInterval / 4;
    const barHRatio = (svgH - (paddingTop + paddingBottom)) / (Math.sqrt(max) * 2);
    const centerY = (svgH - (paddingTop + paddingBottom)) / 2 + paddingTop;

    const xStart = barInterval - barW;
    const xEnd = svgW - paddingRight;

    // title
    svg.append('text')
      .text('Network Change Timeline')
      .attrs({
        x: 10,
        y: 10,
        'text-anchor': 'start',
        'alignment-baseline': 'hanging',
        'font-size': 18
      });

    // Legend - colors
    const colorLegendW = 100;
    const colorLegendXStart = xEnd - colorLegendW * 3.5;
    const colorLegendY = paddingTop - 30;

    // Common Nodes & Links Color Legend
    svg.append('rect').attrs({
      x: colorLegendXStart,
      y: colorLegendY,
      width: barW,
      height: barW,
      fill: COLOR_BAR_COM_N
    });
    svg.append('rect').attrs({
      x: colorLegendXStart + barW - 1,
      y: colorLegendY,
      width: barW,
      height: barW,
      fill: COLOR_BAR_COM_L
    });
    svg.append('text')
      .text('Remained')
      .attrs({
        x: colorLegendXStart + barW * 2.2,
        y: colorLegendY + barW / 2,
        'text-anchor': 'start',
        'alignment-baseline': 'central',
        'font-size': 14
      });

    // Added Nodes & Links Color Legend
    svg.append('rect').attrs({
      x: colorLegendXStart + colorLegendW,
      y: colorLegendY,
      width: barW,
      height: barW,
      fill: COLOR_BAR_ADD_N
    });
    svg.append('rect').attrs({
      x: colorLegendXStart + colorLegendW + barW - 1,
      y: colorLegendY,
      width: barW,
      height: barW,
      fill: COLOR_BAR_ADD_L
    });
    svg.append('text')
      .text('Added')
      .attrs({
        x: colorLegendXStart + colorLegendW + barW * 2.2,
        y: colorLegendY + barW / 2,
        'text-anchor': 'start',
        'alignment-baseline': 'central',
        'font-size': 14
      });

    // Disappeared Nodes & Links Color Legend
    svg.append('rect').attrs({
      x: colorLegendXStart + colorLegendW * 2,
      y: colorLegendY,
      width: barW,
      height: barW,
      fill: COLOR_BAR_RMD_N
    });
    svg.append('rect').attrs({
      x: colorLegendXStart + colorLegendW * 2 + barW - 1,
      y: colorLegendY,
      width: barW,
      height: barW,
      fill: COLOR_BAR_RMD_L
    });
    svg.append('text')
      .text('Disappeared')
      .attrs({
        x: colorLegendXStart + colorLegendW * 2 + barW * 2.2,
        y: colorLegendY + barW / 2,
        'text-anchor': 'start',
        'alignment-baseline': 'central',
        'font-size': 14
      });


    // Legend - horizontal axis
    const numOfAxisHor = 3; // 3 => 가운데, 중간 위(아래), 맨 위(아래)
    for (let i = -numOfAxisHor + 1; i < numOfAxisHor; i++) {
      const nodeVal = (i * Math.sqrt(max)) / (numOfAxisHor - 1);

      // 가로 선
      const y = centerY - barHRatio * nodeVal;

      svg.append('line').attrs({
        x1: xStart,
        x2: xEnd,
        y1: y,
        y2: y,
        stroke: COLOR_BAR_AXIS,
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
        stroke: COLOR_BAR_AXIS
      });

      // 시간 표시
      if (i == 0 || i == barLen - 1 || i == Math.round(barLen / 2)) {
        const timeString = Math.round(avgTimes[i]);
        svg.append('text').text(timeString).attrs({
          x: x + barW,
          y: svgH - paddingBottom + 5,
          'text-anchor': 'middle',
          'alignment-baseline': 'hanging',
        });
      }

      // 바 그리기
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

        const barH = barHRatio * (isNode ? value : Math.sqrt(value));
        const barX = isNode ? x : x + barW;
        let barY = 0;
        let fill = COLOR_BAR_COM_N;

        if (type == 0) {  // removed
          barY = centerY;
          fill = isNode ? COLOR_BAR_RMD_N : COLOR_BAR_RMD_L;
        } else if (type == 1) { // added
          const comV = values[j + 1];
          const comBarH = barHRatio * (isNode ? comV : Math.sqrt(comV));
          barY = centerY - barH - comBarH;
          fill = isNode ? COLOR_BAR_ADD_N : COLOR_BAR_ADD_L;
        } else {  // common
          barY = centerY - barH;
          fill = isNode ? COLOR_BAR_COM_N : COLOR_BAR_COM_L;
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

  getTimelineInfo (totalNetwork) {
    const subNetworks = totalNetwork.subNetworks;

    const ret = [Network.compare(new Network(), subNetworks[0])];
    const sizes = [subNetworks[0].nodes.size, subNetworks[0].links.size];
    const avgTimes = [subNetworks[0]];

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


