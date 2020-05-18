class Smalls extends React.Component {
  constructor(props) {
    super(props);
    this.containerId = this.props.containerId;
    this.container = document.getElementById(this.containerId);
    this.networks = this.props.network.subNetworks;
    // this.container.style.width = this.networks.length * 325;
  }

  componentDidMount () {
    Smalls.drawSmalls(this.container, this.networks);
  }

  componentDidUpdate () {
    Smalls.drawSmalls(this.container, this.networks);
  }

  static drawSmalls (container, networks) {
    let cnt = 0;
    networks.forEach((network, i) => {
      if (network.nodes.size > 0) {
        // set svg
        const padNum = (('000' + i).slice(-3)); // pad with 0 (eg. 003, 072)
        const diagramId = `diagram${padNum}`;
        const diagramDiv = document.createElement('div');
        diagramDiv.setAttribute("class", "diagram");
        diagramDiv.setAttribute("id", diagramId);
        container.appendChild(diagramDiv);
        if (cnt < 6) {
          cnt++;
          console.log(cnt, i, network);
          NodeLinkDiagram.draw(diagramId, network);
        }
      }
    });
  }

  render () {
    return <div id={"#" + this.props.id}></div>
  }
}

class NodeLinkDiagram {
  constructor() { }

  static draw (containerId, network) {

    // set visNodes
    const nodes = [];
    for (let node of network.nodes) {
      nodes.push({ id: node, label: node });
    }
    const visNodes = new vis.DataSet(nodes);

    // set visEdges
    const adges = [];
    for (let link of network.links) {
      adges.push({ from: link.from, to: link.to });
    }
    const visEdges = new vis.DataSet(adges);

    // draw
    var container = document.getElementById(containerId);
    var data = {
      nodes: visNodes,
      edges: visEdges
    };
    var options = {};
    var network = new vis.Network(container, data, options);
  }


}
