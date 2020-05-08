// const values
var PADDING_FOR_SECTION = 3;
var COLOR_ADD_NODE = '#68C';
var COLOR_ADD_LINK = '#46B';
var COLOR_RMD_NODE = '#C68';
var COLOR_RMD_LINK = '#B53';
var COLOR_COM_NODE = '#CCC';
var COLOR_COM_LINK = '#BBB';
var COLOR_NETWORK = COLOR_COM_NODE;
var COLOR_AXIS = '#CCC';

// my test network dataset
var mydata = new Dataset(testsets[0].url, testsets[0].idxs);
var mynetwork = Dataset.getNetwork(mydata, 0.25);

// visualizations on my app
var visualizations = {
  timeline: {
    containerId: '#timeline-container',
    element: React.createElement(Timeline, {
      title: 'Network Change Timeline',
      containerId: '#timeline-container',
      network: mynetwork
    })
  },
  scatter: {
    containerId: '#scatter-container',
    element: React.createElement(ScatterPlot, {
      title: 'Network Similarity Between The Time',
      containerId: '#scatter-container',
      network: mynetwork
    })
  }
};

_.forEach(visualizations, function (vis, key) {
  var container = document.querySelector(vis.containerId);
  var element = vis.element;
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