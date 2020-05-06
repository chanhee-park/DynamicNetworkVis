const mynetwork = getTestData();

const PADDING_FOR_SECTION = 3;
const COLOR_BAR_ADD = '#68C';
const COLOR_BAR_RMD = '#C77';
const COLOR_BAR_COM = '#CCC';
const COLOR_BAR_AXIS = '#CECFD3';



const containerId = `#timeline-container`;
const element = <Timeline
  title="Network Change Timeline"
  containerId={containerId}
  network={mynetwork}
/>;
const container = document.querySelector(containerId);
ReactDOM.render(element, container);


// draw time slider
function drawTimeSlider (svg, bars, max) {






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
