class Network {
  constructor(nodes, links, times, typeInfo) {
    this.typeInfo = typeof typeInfo !== 'undefined' ? typeInfo : Network.typeTotal();
    this.nodes = typeof nodes !== 'undefined' ? nodes : new Set();
    this.links = typeof links !== 'undefined' ? links : new Set();
    this.times = typeof times !== 'undefined' ? times : this.setTimes();
    this.timeFirst = Util.min(this.times);
    this.timeLast = Util.max(this.times);

    this.subNetworks = undefined;
    this.compareInfo = undefined;
    this.subNetDistances = undefined;
    this.emptySubNets = undefined;
    if (this.typeInfo.type == Network.typeTotal().type && this.nodes.size > 0) {
      this.subNetworks = Network.splitByTime(this);
      this.emptySubNets = Network.getEmptyNetworksIdx(this.subNetworks);
      this.compareInfo = Network.compareSeveral(this.subNetworks);
      this.subNetDistances = Network.getDistances(this.compareInfo, 'rough', this.emptySubNets);
    } else {
      this.timeFirst = this.typeInfo.first;
      this.timeLast = this.typeInfo.last;
      this.timeAvg = this.typeInfo.avg;
    }
  }

  print () {
    console.log({
      type: this.typeInfo.type,
      nodes: this.nodes,
      links: this.links,
      timezone: [this.timeFirst, this.timeLast, this.times],
      subs: this.subNetworks
    });
  }

  // links로 부터 times를 지정한다. 
  setTimes () {
    this.times = new Set()
    _.forEach(this.links, (l) => {
      this.times.add(l.time);
    });
    return this.times;
  }

  static typeTotal () {
    return { type: 'TOTAL', numberOfSplits: 20 }
  }

  static typeSub (idx, numberOfSplits, first, last) {
    return {
      type: 'SUB',
      idx: idx,
      numberOfSplits: numberOfSplits,
      first: first,
      last: last,
      avg: (first + last) / 2
    }
  }

  static splitByTime (network, numberOfSplits = 39) {
    network.typeInfo.numberOfSplits = numberOfSplits;

    // get Time Interval
    const timeDiff = network.timeLast - network.timeFirst + 0.0001;
    const timeInterval = timeDiff / numberOfSplits;


    // get splited nodes, links, times
    const spNodes = [...Array(numberOfSplits)].map(e => new Set());
    const spLinks = [...Array(numberOfSplits)].map(e => new Set());
    const spTimes = [...Array(numberOfSplits)].map(e => new Set());

    for (let link of network.links) {
      const timeIdx = parseInt((link.time - network.timeFirst) / timeInterval);
      spNodes[timeIdx].add(link.from);
      spNodes[timeIdx].add(link.to);
      spLinks[timeIdx].add(link);
      spTimes[timeIdx].add(link.time);
    }

    // get splited networks
    const spNetworks = [Array(numberOfSplits), undefined];
    for (let idx = 0; idx < numberOfSplits; idx++) {
      spNetworks[idx] = new Network(
        spNodes[idx],
        spLinks[idx],
        spTimes[idx],
        Network.typeSub(
          idx,
          numberOfSplits,
          timeInterval * (idx + 0) + network.timeFirst,
          timeInterval * (idx + 1) + network.timeFirst,
        )
      );
    }

    // assign and return
    network.subNetworks = spNetworks;
    return network.subNetworks;
  }

  static getEmptyNetworksIdx (networks) {
    ret = [];
    _.forEach(networks, (n, i) => {
      if (n.nodes.size == 0) {
        ret.push(i);
      }
    });
    return ret;
  }

  static getDistances (compareInfo, similarityCriteria, emptyIdxs) {
    const N = compareInfo.length;
    const ret = [...Array(N)].map(x => Array(N).fill(0));
    for (let i = 0; i < compareInfo.length; i++) {
      ret[i][i] = 0;
      for (let j = i + 1; j < compareInfo.length; j++) {
        if (j in emptyIdxs) continue;
        const similarity = compareInfo[i][j].similarity[similarityCriteria];
        const disimilarity = (1 - similarity);
        ret[j][j] = disimilarity;
        ret[j][i] = disimilarity;
      }
    }
    return ret;
  }

  static compareSeveral (networks) {
    const N = networks.length;
    const ret = [...Array(N)].map(x => Array(N).fill(0));
    for (let i = 0; i < N; i++) {
      for (let j = i + 1; j < N; j++) {
        ret[i][j] = this.compare(networks[i], networks[j]);
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
    const roughN = (sizes.nc + 1) / (sizes.nc + sizes.n1 + sizes.n2 + 1);
    const roughL = (sizes.lc + 1) / (sizes.lc + sizes.l1 + sizes.l2 + 1);
    const similarity = {
      rough: 0.75 * roughN + 0.25 * roughL,
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

