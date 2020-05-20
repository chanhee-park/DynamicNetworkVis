class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render () {
    return (
      <div class="app">
        <div class="container-group top">
          <div class="container"
            id='timeline-container'>
            <Timeline network={this.props.network} />
          </div>
          <div id="tooltip"
            class="hidden">
            <p><strong>Network is changed</strong></p>
            <p><span id="value">-</span></p>
          </div>
        </div>

        <div class="container-group body">
          <div class="container"
            id='scatter-container'>
            < ScatterPlot network={this.props.network} />
          </div>
          <div class="container"
            id='parallel-container'>
            <PCoold network={this.props.network} />
          </div>
        </div>

        <div class="container-group bottom">
          <div class="container-wrapper"
            id='smalls-container-wrapper'>
            <div class="container"
              id='smalls-container'>
              <Smalls network={this.props.network} />
            </div>
          </div>
          <div class="container"
            id='table-container'></div>
        </div>
      </div>
    );
  }

  print () {
    console.log('-- APP --');
    console.log('data:', this.data);
    console.log('netw:', this.network);
    console.log('visu:', this.visualizations);
  }

  // start () {
  //   this.updateVis();
  // }

  // updateVis () {
  //   Object.entries(this.visualizations).forEach(([key, vis]) => {
  //     const container = document.querySelector(`#${key}-container`);
  //     ReactDOM.render(vis, container);
  //   });
  // }
}

const ts = testsets[3];
const data = new Dataset(ts.url, ts.idxs, ts.sep);
const network = Dataset.getNetwork(data, 1);

ReactDOM.render(
  <App network={network} />,
  document.getElementById('root')
);
