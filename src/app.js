class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedNodes: []
    }
    this.addSelectedNode = this.addSelectedNode.bind(this);
  }

  addSelectedNode (selectedNode) {
    const addedList = [...this.state.selectedNodes, selectedNode];
    this.setState({
      selectedNodes: addedList
    });
  }

  print () {
    console.log('-- APP --');
    console.log('data:', this.data);
    console.log('netw:', this.network);
    console.log('visu:', this.visualizations);
  }

  render () {
    return (
      <div className="app">
        <div className="container-group top">
          <div className="container"
            id='timeline-container'>
            <Timeline network={this.props.network} />
          </div>
        </div>
        <Tooltip text="Network is Changed"></Tooltip>

        <div className="container-group body">
          <div className="container"
            id='scatter-container'>
            < ScatterPlot network={this.props.network} />
          </div>
          <div className="container"
            id='parallel-container'>
            <PCoold network={this.props.network} />
          </div>
        </div>

        <div className="container-group bottom">
          <div className="container-wrapper"
            id='smalls-container-wrapper'>
            <div className="container"
              id='smalls-container'>
              <Smalls network={this.props.network}
                nodeClickHandler={this.addSelectedNode} />
            </div>
          </div>

          <div className="container-wrapper"
            id='table-container-wrapper'>
            <div className="container"
              id='table-container'>
              <NodeTable nodes={this.state.selectedNodes} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const ts = testsets[3];
const data = new Dataset(ts.url, ts.idxs, ts.sep);
const network = Dataset.getNetwork(data, 1);

ReactDOM.render(
  <App network={network} />,
  document.getElementById('root')
);
