class App {
  constructor() {
    this.data = new Dataset(testsets[0].url, testsets[0].idxs);

    // FIXME: 테스트 속도를 위하여 확률 값을 0.25로 하였음 => 1로 변경 필요.
    this.network = Dataset.getNetwork(this.data, 0.25);

    // React Visualization Objects
    this.visualizations = {

      // 1) timeline
      timeline: <Timeline
        title="Network Change Timeline"
        containerId='#timeline-container'
        network={this.network}
      />,

      // 2) scatter plot
      scatter: < ScatterPlot
        title="Network Similarity Between The Time"
        containerId='#scatter-container'
        network={this.network}
      />,

      // 3) parallel coordinate

      // 4) small multiples of node-link diagram

      // 5) node statistics table

    };

    this.start();
  }

  print () {
    console.log('-- APP --');
    console.log('data:', this.data);
    console.log('netw:', this.network);
    console.log('visu:', this.visualizations);
  }

  start () {
    this.updateVis();
  }

  updateVis () {
    Object.entries(this.visualizations).forEach(([key, vis]) => {
      const container = document.querySelector(`#${key}-container`);
      ReactDOM.render(vis, container);
    });
  }
}
