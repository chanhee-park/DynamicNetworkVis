class App {
  // TODO: App을 최상위 리액트 컴포넌트로 사용하자.
  constructor() {
    const ts = testsets[3];
    this.data = new Dataset(ts.url, ts.idxs, ts.sep);

    // FIXME: 테스트 속도를 위하여 확률 값을 0.25로 하였음 => 1로 변경 필요.
    this.network = Dataset.getNetwork(this.data, 1);

    // React Visualization Objects
    this.visualizations = {

      // 1) timeline
      timeline: <Timeline
        title="Network Change Timeline"
        containerId='timeline-container'
        network={this.network}
      />,

      // 2) scatter plot
      scatter: < ScatterPlot
        title="Network Similarity Between The Time"
        containerId='scatter-container'
        network={this.network}
      />,

      // 3) parallel coordinate
      parallel: <PCoold
        title="Network Statistics by Time"
        containerId='parallel-container'
        network={this.network}
      />,

      // 4) small multiples of node-link diagram
      smalls: <Smalls
        title="Node-Link Diagrams by time"
        containerId='smalls-container'
        network={this.network}
      />,

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
