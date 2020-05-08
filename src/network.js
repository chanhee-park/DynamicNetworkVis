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
      this.subNetDistances = Network.getDistances(this.compareInfo, 'rough');
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

  static splitByTime (network, numberOfSplits = 39) {
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

  static getDistances (compareInfo, similarityCriteria) {
    const N = compareInfo.length;
    const ret = [...Array(N)].map(x => Array(N).fill(0));
    for (let i = 0; i < N; i++) {
      for (let j = i + 1; j < N; j++) {
        const similarity = compareInfo[i][j].similarity[similarityCriteria];
        const disimilarity = (1 - similarity);
        ret[i][j] = disimilarity;
        ret[j][i] = disimilarity;
      }

      /*
       * ret[i][i] = 0 이면, 이상치 혼자 너무 작아서 스캐터 플롯이 잘 안그려진다.
       * 따라서, 해당 행의 평균값을 값으로 사용한다. 
       */
      ret[i][i] = 0;
      let summ = ret[i].reduce((a, b) => a + b, 0);
      ret[i][i] = summ / (N - 1);
    }

    return Util.normalize2d(ret);
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
    const roughN = (sizes.nc + 1) / (sizes.nc + sizes.n1 + sizes.n2 + 1);
    const roughL = (sizes.lc + 1) / (sizes.lc + sizes.l1 + sizes.l2 + 1);
    const similarity = {
      roughNode: roughN,
      roughLink: roughL,
      rough: Math.sqrt(roughN * roughL), // 기하평균 ( 0 <= value <= 1 )
    }
    // console.log('---')
    // console.log(nodes, roughN.toPrecision(3));
    // console.log(links, roughL.toPrecision(3));
    // console.warn(similarity.rough.toPrecision(3));

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

