
class Network {
  constructor(nodes, links, times, typeInfo) {
    this.typeInfo = typeof typeInfo !== 'undefined' ? typeInfo : Network.typeTotal();
    this.nodes = typeof nodes !== 'undefined' ? nodes : new Set();
    this.links = typeof links !== 'undefined' ? links : new Set();
    this.times = typeof times !== 'undefined' ? times : this.setTimes();
    this.timeFirst = Util.min(this.times);
    this.timeLast = Util.max(this.times);

    this.subNetworks = undefined;
    if (this.typeInfo.type == Network.typeTotal().type) {
      this.subNetworks = Network.splitByTime(this);
    } else {
      this.timeFirst = this.typeInfo.start;
      this.timeLast = this.typeInfo.end;
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

  static typeSub (idx, numberOfSplits, start, end) {
    return {
      type: 'SUB',
      idx: idx,
      numberOfSplits: numberOfSplits,
      start: start,
      end: end,
      avg: (start + end) / 2
    }
  }

  static splitByTime (network, numberOfSplits = 30) {
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
          idx * timeInterval + network.timeFirst,
          idx * (timeInterval + 1) + network.timeFirst,
        )
      );
    }

    // assign and return
    network.subNetworks = spNetworks;
    return network.subNetworks;
  }

  static compare (a, b) {
    const nodes = Network.compareNodes(a.nodes, b.nodes);
    const links = Network.compareLinks(a.links, b.links);
    return { nodes, links };
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

