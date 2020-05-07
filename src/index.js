const mynetwork = getTestData();

const PADDING_FOR_SECTION = 3;
const COLOR_BAR_ADD_N = '#68C';
const COLOR_BAR_ADD_L = '#46B';
const COLOR_BAR_RMD_N = '#C68';
const COLOR_BAR_RMD_L = '#B53';
const COLOR_BAR_COM_N = '#CCC';
const COLOR_BAR_COM_L = '#BBB';
const COLOR_BAR_AXIS = '#CCC';

const containerId = `#timeline-container`;
const element = <Timeline
  title="Network Change Timeline"
  containerId={containerId}
  network={mynetwork}
/>;
const container = document.querySelector(containerId);
ReactDOM.render(element, container);


// TODO: scatter plot 그리기
const adjmtx = [
  [1, 1, 1, 0, 0, 0],
  [1, 1, 1, 0, 0, 0],
  [1, 1, 1, 0, 0, 0],
  [0, 0, 0, 1, 1, 0],
  [0, 0, 0, 1, 1, 1],
  [0, 0, 0, 0, 1, 1]
];
var vectors = PCA.getEigenVectors(adjmtx);
console.log(vectors);


// TODO: REACT 제대로 적용

// TODO: Time Slider 코드 리펙토링 / 함수 분리 / 모듈화

// TODO: P-coord 그리기

// TODO: Small Multiples 그리기

// TODO: Node Stats Table 그리기

// TODO: Interaction - 시간 합치고 분리하기

// TODO: Interaction - P-coord 영역 선택

// TODO: Interaction - Small Multiples Animation
