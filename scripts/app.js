const mynetwork = getTestData();
mynetwork.print();

const COLOR_BAR_NODE = '#6200EE';
const COLOR_BAR_LINK = '#26A69A';
const COLOR_BAR_AXIS = '#CECFD3';

// compare time by time
const timeSliderInfo = getTimeSliderInfo(mynetwork.subNetworks);
const bars = timeSliderInfo.bars
const maxSize = timeSliderInfo.maxSize;

// draw time slider
const timeSvg = d3.select('#vis-time');
drawTimeSlider(timeSvg, bars, maxSize);

function getTimeSliderInfo (networks) {
  const bars = [];
  let maxSize = 0;

  for (let i = 0; i < networks.length - 1; i++) {
    const comp = Network.compare(networks[i], networks[i + 1]);
    const adNodes = comp.nodes.postOnly.size;
    const rmNodes = comp.nodes.preOnly.size;
    const adLinks = comp.links.postOnly.size;
    const rmLinks = comp.links.preOnly.size;
    bars.push({ adNodes, rmNodes, adLinks, rmLinks, comp });
    maxSize = Math.max(...[maxSize, adNodes, rmNodes, adLinks, rmLinks]);
  }

  return { bars, maxSize };
}

function drawTimeSlider (svg, bars, max) {
  const svgBBox = svg.node().getBoundingClientRect();
  const svgW = svgBBox.width;
  const svgH = svgBBox.height;

  const paddingRight = 200;
  const paddingTop = 50;
  const paddingBottom = 15;

  const barInterval = (svgW - paddingRight) / (bars.length + 1);
  const barW = barInterval / 4;
  const barHRatio = (svgH - (paddingTop + paddingBottom)) / (Math.sqrt(max) * 2);
  const centerY = (svgH - (paddingTop + paddingBottom)) / 2 + paddingTop;

  // 제목을 그린다. 
  svg.append('text')
    .text('Network Change Timeline')
    .attrs({
      x: 10,
      y: 10,
      'text-anchor': 'start',
      'alignment-baseline': 'hanging',
      'font-size': 18
    });

  // 가로 보조선: 바의 높이를 설명한다.
  const numOfAxisHor = 3; // 3 => 가운데, 중간 위(아래), 맨 위(아래)
  for (let i = -numOfAxisHor + 1; i < numOfAxisHor; i++) {
    const nodeVal = (i * Math.sqrt(max)) / (numOfAxisHor - 1);

    // 가로 선
    const xStart = barInterval - barW;
    const xEnd = svgW - paddingRight;
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

    // 바 그리기
    const values = [bar['adNodes'], bar['rmNodes'], bar['adLinks'], bar['rmLinks']];

    // TODO: 텍스트 정렬: html / css 로 영역을 잡아버리자.
    const tooltipTxt = `
      Nodes: +${bar['adNodes']}  /  -${bar['rmNodes']} <br>
      Links: +${bar['adLinks']}  /  -${bar['rmLinks']}
    `
    console.log(bar);

    _.forEach(values, (value, j) => {
      const isAdded = j % 2 == 0;  // [added, removed, added, removed]
      const isNode = j < 1;        // [node, node, link, link]

      const barH = barHRatio * (isNode ? value : Math.sqrt(value))
      const barY = centerY - (isAdded ? barH : 0);
      const barX = isNode ? x : x + barW;
      const fill = isNode ? COLOR_BAR_NODE : COLOR_BAR_LINK;

      // TODO: SET 방식으로 그리기
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


// TODO: REACT 적용 

// TODO: Time Slider 코드 리펙토링 / 함수 분리 / 모듈화

// TODO: P-coord 그리기

// TODO: scatter plot 그리기

// TODO: Small Multiples 그리기

// TODO: Node Stats Table 그리기

// TODO: Interaction - 시간 합치고 분리하기

// TODO: Interaction - P-coord 영역 선택

// TODO: Interaction - Small Multiples Animation
