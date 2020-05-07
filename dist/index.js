var mynetwork = getTestData();

var PADDING_FOR_SECTION = 3;
// TODO: 노드랑 엣지의 색상 밝기를 다르게 할까?
var COLOR_BAR_ADD_N = '#68C';
var COLOR_BAR_ADD_L = '#46B';
var COLOR_BAR_RMD_N = '#C68';
var COLOR_BAR_RMD_L = '#B64';
var COLOR_BAR_COM_N = '#CCC';
var COLOR_BAR_COM_L = '#AAA';
var COLOR_BAR_AXIS = '#CCC';

var containerId = '#timeline-container';
var element = React.createElement(Timeline, {
  title: 'Network Change Timeline',
  containerId: containerId,
  network: mynetwork
});
var container = document.querySelector(containerId);
ReactDOM.render(element, container);

// TODO: REACT 제대로 적용 

// TODO: Time Slider 코드 리펙토링 / 함수 분리 / 모듈화

// TODO: P-coord 그리기

// TODO: scatter plot 그리기

// TODO: Small Multiples 그리기

// TODO: Node Stats Table 그리기

// TODO: Interaction - 시간 합치고 분리하기

// TODO: Interaction - P-coord 영역 선택

// TODO: Interaction - Small Multiples Animation