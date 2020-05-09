class Network {
  constructor(nodes, links, times, typeInfo) {
    this.typeInfo = typeof typeInfo !== 'undefined' ? typeInfo : Network.typeTotal();
    this.nodes = typeof nodes !== 'undefined' ? nodes : new Set();
    this.links = typeof links !== 'undefined' ? links : new Set();
    this.times = typeof times !== 'undefined' ? times : new Set();

    if (Network.isTotal(this) && !Network.isEmpty(this)) {
      // 비어있지 않은 Total Network에만 적용
      this.subNetworks = Network.splitByTime(this);
      this.compareInfo = Network.compareSeveral(this.subNetworks);
      this.subNetDistances = Network.getDistances(this.compareInfo, 'rough', this.subNetworks);
      this.print();
    } else if (this.typeInfo.type != Network.typeTotal().type) {
      // Sub Netwokr에만 적용
      this.timeAvg = this.typeInfo.timeAvg;
    }
  }

  print () {
    console.log({
      type: this.typeInfo.type,
      nodes: this.nodes,
      links: this.links,
      times: this.times,
      subs: this.subNetworks
    });
  }

  static isEmpty (network) {
    return network.nodes.size === 0 && network.links.size === 0;
  }

  static isTotal (network) {
    return network.typeInfo.type == Network.typeTotal().type;
  }

  static typeTotal () {
    return { type: 'TOTAL' }
  }

  static typeSub (idx, timeAvg) {
    return {
      type: 'SUB',
      idx: idx,
      timeAvg: timeAvg
    }
  }

  static splitByTime (network, numberOfSplits = 100) {
    // Get Time Interval
    const timeFirstAndLast = Util.minmax(network.times);
    const timeFirst = timeFirstAndLast[0];
    const timeLast = timeFirstAndLast[1];
    const timeDiff = timeLast - timeFirst + 0.00001;
    const timeInterval = timeDiff / numberOfSplits;

    // Split nodes, links, and times
    const spNodes = [...Array(numberOfSplits)].map(e => new Set());
    const spLinks = [...Array(numberOfSplits)].map(e => new Set());
    const spTimes = [...Array(numberOfSplits)].map(e => new Set());
    for (let link of network.links) {
      const timeIdx = parseInt((link.time - timeFirst) / timeInterval);
      spNodes[timeIdx].add(link.from).add(link.to);
      spLinks[timeIdx].add(link);
      spTimes[timeIdx].add(link.time);
    }

    // Merge splited nodes, links, and times as splited networks  
    const spNetworks = [Array(numberOfSplits), undefined];
    for (let idx = 0; idx < numberOfSplits; idx++) {
      const subTimeFirst = timeInterval * (idx + 0) + timeFirst;
      const subTimeLast = timeInterval * (idx + 1) + timeFirst;
      const subTimeAvg = (subTimeFirst + subTimeLast) / 2;
      spNetworks[idx] = new Network(
        spNodes[idx],
        spLinks[idx],
        spTimes[idx],
        Network.typeSub(idx, subTimeAvg)
      );
    }

    // assign and return
    network.subNetworks = spNetworks;
    return network.subNetworks;
  }

  static getDistances (compareInfo, similarityCriteria, networks) {
    const N = compareInfo.length;
    const ret = [...Array(N)].map(x => Array(N).fill(0));
    for (let i = 0; i < N; i++) {
      for (let j = i + 1; j < N; j++) {
        const similarity = compareInfo[i][j].similarity[similarityCriteria];
        const disimilarity = (1 - similarity);
        ret[i][j] = disimilarity;
        ret[j][i] = disimilarity;
      }
    }
    const trimed = this.trimDistanceMatrix(ret, networks);
    return {
      matrix: Util.normalize2d(trimed.matrix),
      idxs: trimed.idxs
    };
  }

  static compareSeveral (networks) {
    const N = networks.length;
    const ret = [...Array(N)].map(x => Array(N).fill(0));
    for (let i = 0; i < N; i++) {
      for (let j = i + 1; j < N; j++) {
        ret[i][j] = Network.compare(networks[i], networks[j]);
      }
    }
    return ret;
  }

  static compare (n1, n2) {
    const nodes = Network.compareNodes(n1.nodes, n2.nodes);
    const links = Network.compareLinks(n1.links, n2.links);

    const sizes = {
      nc: nodes.common.size,
      n1: nodes.preOnly.size,
      n2: nodes.postOnly.size,
      lc: links.common.size,
      l1: links.preOnly.size,
      l2: links.postOnly.size,
    }
    const roughN = (sizes.nc) / (sizes.nc + sizes.n1 + sizes.n2 + Number.MIN_VALUE);
    const roughL = (sizes.lc) / (sizes.lc + sizes.l1 + sizes.l2 + Number.MIN_VALUE);
    const similarity = {
      roughNode: roughN,
      roughLink: roughL,
      rough: (roughN + roughL) / 2, // 산술평균 ( 0 <= value <= 1 )
    }

    return { nodes, links, similarity };
  }

  static compareNodes (nodes, otherNodes) {
    return Util.compareSets(nodes, otherNodes)
  }

  static compareLinks (links, otherLinks) {
    const linksNoTime = new Set();
    const otherLinksNoTime = new Set();
    for (let e of links) {
      linksNoTime.add(Link.withoutTime(e));
    }
    for (let e of otherLinks) {
      otherLinksNoTime.add(Link.withoutTime(e));
    }
    return Util.compareSets(linksNoTime, otherLinksNoTime);
  }

  static trimDistanceMatrix (distances, networks) {
    const matrix = [];
    const idxs = [];
    for (let i = 0; i < distances.length; i++) {
      if (networks[i].nodes.size == 0) continue;
      const retRow = [];
      for (let j = 0; j < distances[i].length; j++) {
        if (networks[j].nodes.size == 0) continue;
        retRow.push(distances[i][j]);
      }
      matrix.push(retRow);
      idxs.push(i);
    }
    return { matrix, idxs };
  }
}

/**
 * @class Link
 * @param {number} fromId 
 * @param {number} toId 
 * @param {number} time
 */
class Link {
  constructor(fromId, toId, time = 0) {
    this.from = fromId;
    this.to = toId;
    this.time = time;
  }

  print () {
    console.log(this.from, this.to, this.time);
  }

  static withoutTime (link) {
    return new Link(link.from, link.to);
  }
}

