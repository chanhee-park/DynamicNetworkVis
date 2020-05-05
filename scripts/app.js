const mynetwork = getTestData();
mynetwork.print();

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

    // TODO: 링크 개수에 루트스케일 괜찮은가요?
    const adLinks = Math.sqrt(comp.links.postOnly.size);
    const rmLinks = Math.sqrt(comp.links.preOnly.size);

    bars.push({ adNodes, rmNodes, adLinks, rmLinks });
    maxSize = Math.max(...[maxSize, adNodes, rmNodes, adLinks, rmLinks]);
  }

  return { bars, maxSize };
}

function drawTimeSlider (svg, bars, max) {
  // TODO: 매직넘버 없애기
  const rectInterval = 1880 / (bars.length + 1);
  const rectWidth = rectInterval / 4;
  const centerY = 192 / 2;
  const rectHeightRatio = centerY / (max * 1.5);


  svg.append('line').attrs({
    x1: rectInterval / 4,
    x2: 1880 - rectInterval / 4,
    y1: centerY,
    y2: centerY,
    stroke: '#aaa'
  });

  for (let i = 0; i < bars.length; i++) {

    svg.append('line').attrs({
      x1: (i + 0.75) * rectInterval + rectWidth,
      x2: (i + 0.75) * rectInterval + rectWidth,
      y1: centerY - 10,
      y2: centerY + 10,
      stroke: '#aaa'
    })

    svg.append('rect').attrs({
      x: (i + 0.75) * rectInterval,
      y: centerY - bars[i].adNodes * rectHeightRatio,
      width: rectWidth,
      height: bars[i].adNodes * rectHeightRatio,
      fill: '#05A'
    });
    svg.append('rect').attrs({
      x: (i + 0.75) * rectInterval,
      y: centerY,
      width: rectWidth,
      height: bars[i].rmNodes * rectHeightRatio,
      fill: '#05A'
    });
    svg.append('rect').attrs({
      x: (i + 0.75) * rectInterval + rectWidth,
      y: centerY - bars[i].adLinks * rectHeightRatio,
      width: rectWidth,
      height: bars[i].adLinks * rectHeightRatio,
      fill: '#0A5'
    });
    svg.append('rect').attrs({
      x: (i + 0.75) * rectInterval + rectWidth,
      y: centerY,
      width: rectWidth,
      height: bars[i].rmLinks * rectHeightRatio,
      fill: '#0A5'
    });
  }
}



// TODO: Time Slider 그리기

// TODO: P-coord 그리기

// TODO: scatter plot 그리기

// TODO: Small Multiples 그리기

// TODO: Node Stats Table 그리기

// TODO: Interaction - 시간 합치고 분리하기

// TODO: Interaction - P-coord 영역 선택

// TODO: Interaction - Small Multiples Animation
