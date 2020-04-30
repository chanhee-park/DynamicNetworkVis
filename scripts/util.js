const Util = {
  loadFile: (filePath) => {
    let result = null;
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", filePath, false);
    xmlhttp.send();
    if (xmlhttp.status == 200) {
      result = xmlhttp.responseText;
    }
    return result;
  },
}

function getTestData () {
  const res = Util.loadFile(Data.dataset);
  const lines = res.split('\n');

  const network = {
    nodes: [],
    edges: [],
    times: [],
  }

  _.forEach(lines, line => {
    let elems = line.split(' ');
    if (elems[0].length > 0
      && elems[1].length > 0
      && elems[2].length > 0
      && Math.random() > 0.99) {
      const from = parseInt(elems[0]);
      const to = parseInt(elems[1]);
      const time = parseInt(parseInt(elems[2]) / 10000);
      network.nodes.push(from);
      network.nodes.push(to);
      network.times.push(time);
      network.edges.push({ from, to, time });
    }
  });

  network.nodes = _.uniq(network.nodes).sort((a, b) => { return a - b });
  network.times = _.uniq(network.times).sort((a, b) => { return a - b });
  network.edges = _.sortBy(network.edges, ['time', 'from', 'to']);
  return network;
}
