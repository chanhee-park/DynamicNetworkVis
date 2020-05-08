// const values
const PADDING_FOR_SECTION = 3;
const COLOR_ADD_NODE = '#68C';
const COLOR_ADD_LINK = '#46B';
const COLOR_RMD_NODE = '#C68';
const COLOR_RMD_LINK = '#B53';
const COLOR_COM_NODE = '#CCC';
const COLOR_COM_LINK = '#BBB';
const COLOR_NETWORK = COLOR_COM_NODE;
const COLOR_AXIS = '#CCC';

// my test network dataset
const mydata = new Dataset(testsets[0].url, testsets[0].idxs);
const mynetwork = Dataset.getNetwork(mydata, 0.25);

// visualizations on my app
const visualizations = {
  timeline: {
    containerId: '#timeline-container',
    element: <Timeline
      title="Network Change Timeline"
      containerId='#timeline-container'
      network={mynetwork}
    />
  },
  scatter: {
    containerId: '#scatter-container',
    element: <ScatterPlot
      title="Network Similarity Between The Time"
      containerId='#scatter-container'
      network={mynetwork}
    />
  }
}

_.forEach(visualizations, (vis, key) => {
  const container = document.querySelector(vis.containerId);
  const element = vis.element;
  ReactDOM.render(element, container);
});


// TODO: REACT 제대로 적용

// TODO: Time Slider 코드 리펙토링 / 함수 분리 / 모듈화

// TODO: P-coord 그리기

// TODO: Small Multiples 그리기

// TODO: Node Stats Table 그리기

// TODO: Interaction - 시간 합치고 분리하기

// TODO: Interaction - P-coord 영역 선택

// TODO: Interaction - Small Multiples Animation
