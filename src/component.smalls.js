class Smalls extends React.Component {
  // TODO: t-sne로 네트워크 그리기 (빠름)
  // TODO: 네트워크간 연결선 그리기 
  // TODO: 선택된 노드에만 네트워크간 연결선이 나타나게 하기
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
    Smalls.drawSmalls(
      this.state.container,
      this.state.networks,
      this.props.nodeClickHandler
    );
  }

  static drawSmalls (container, networks, nodeClickEvent) {
    let cnt = 0;
    networks.forEach((network, i) => {
      if (network.nodes.size > 0) {
        const padNum = (('000' + i).slice(-3)); // pad with 0 (eg. 003, 072)
        const diagramId = `diagram${padNum}`;
        const diagramDiv = document.createElement('div');
        diagramDiv.setAttribute("class", "diagram");
        diagramDiv.setAttribute("id", diagramId);
        container.appendChild(diagramDiv);
        if (cnt < 5) {
          cnt++;
          NodeLinkDiagram.draw(diagramId, network, i, nodeClickEvent);
        }
      }
    });
  }

  render () {
    return <div id={"#" + this.props.id}></div>
  }
}

class NodeLinkDiagram {
  static draw (containerId, network, networkIdx, nodeClickEvent) {
    const container = document.getElementById(containerId);
    const nodes = NodeLinkDiagram.getVisNodes(network.nodes);
    const edges = NodeLinkDiagram.getVisEdges(network.links);
    const data = { nodes, edges };
    const options = {};

    const visNetwork = new vis.Network(container, data, options);
    // TODO: 노드 위치 받아서/계산해서 직접 그리기
    // visNetwork.on("afterDrawing", function (properties) {
    //   console.log(nodes);
    // });
    visNetwork.on('click', properties => {
      if (properties.nodes.length > 0) {
        const nodeIdx = properties.nodes[0];
        // TODO: 실제 노트 통계치 계산해서 만들기 
        nodeClickEvent({
          'Node ID': nodeIdx,
          'Network Time Section': networkIdx,
          'Degree': parseInt(Math.random() * 100),
          'random(1)': parseInt(Math.random() * 48 + 8),
          'random(2)': parseInt(Math.random() * 39 + 27),
          'random(3)': parseInt(Math.random() * 50),
          'random(4)': parseInt(Math.random() * 123),
        });
      }
    });

  }

  static getVisNodes (nodes) {
    return new vis.DataSet([...nodes].map(node => (
      { id: node, label: node }
    )));
  }

  static getVisEdges (links) {
    const edgeMap = {};
    for (let link of links) {
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
