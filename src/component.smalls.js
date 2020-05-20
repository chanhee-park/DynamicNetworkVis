class Smalls extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      container: null,
      networks: this.props.network.subNetworks,
    }
  }

  componentDidMount () {
    const containerId = Util.getParentIdOfReactComp(this);
    this.setState({
      container: document.getElementById(containerId),
    });
  }

  componentDidUpdate () {
    Smalls.drawSmalls(this.state.container, this.state.networks);
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
        if (cnt < 2) {
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
  static draw (containerId, network) {
    var container = document.getElementById(containerId);
    var data = {
      nodes: NodeLinkDiagram.getVisNodes(network),
      edges: NodeLinkDiagram.getVisEdges(network)
    };
    var options = {};

    var network = new vis.Network(container, data, options);
  }

  static getVisNodes (network) {
    const nodes = [...network.nodes].map(node => (
      { id: node, label: node }
    ));
    return new vis.DataSet(nodes);
  }

  static getVisEdges (network) {
    const edgeMap = {};
    for (let link of network.links) {
      const from = Math.min(link.from, link.to);
      const to = Math.max(link.from, link.to);
      const key = `${from}-${to}`;
      if (key in edgeMap) {
        edgeMap[key].value += 1;
      } else {
        edgeMap[key] = { from, to, value: 1 };
      }
    }
    const edges = Object.values(edgeMap);
    return new vis.DataSet(edges);
  }
}
