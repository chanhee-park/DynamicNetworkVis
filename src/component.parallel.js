class PCoold extends React.Component {
  constructor(props) {
    super(props);
    this.svg = Util.getSVG(this.props.containerId);
    this.networks = this.props.network.subNetworks;
    this.statsByNetwork = Network.getStatisticsFromNetworks(this.networks);
    this.statsByKey = Util.transposeCollection(this.statsByNetwork);
    console.log(this);
  }

  componentDidMount () {
    PCoold.drawPCoold(this.svg, this.stats);
  }

  componentDidUpdate () {
    PCoold.drawPCoold(this.svg, this.stats);
  }

  static drawPCoold (svg, stats) {
    return;
  }

  render () {
    return <div id={"#" + this.props.id}></div>
  }

}