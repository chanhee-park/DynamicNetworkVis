var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Network = function () {
  function Network(nodes, links, times, typeInfo) {
    _classCallCheck(this, Network);

    this.typeInfo = typeof typeInfo !== 'undefined' ? typeInfo : Network.typeTotal();
    this.nodes = typeof nodes !== 'undefined' ? nodes : new Set();
    this.links = typeof links !== 'undefined' ? links : new Set();
    this.times = typeof times !== 'undefined' ? times : new Set();
    this.matrixNotation = Network.getMatrix(this);

    if (Network.isTotal(this) && !Network.isEmpty(this)) {
      // 비어있지 않은 Total Network에만 적용
      this.subNetworks = Network.splitByTime(this);
      this.compareInfo = Network.compareSeveral(this.subNetworks);
      this.subNetDistances = Network.getDistances(this.compareInfo, 'rough', this.subNetworks);
    } else if (this.typeInfo.type != Network.typeTotal().type) {
      // Sub Netwokr에만 적용
      this.timeAvg = this.typeInfo.timeAvg;
      this.stats = Network.getStatistics(this);
    }
  }

  _createClass(Network, [{
    key: 'print',
    value: function print() {
      console.log('- Network Print - ');
      console.log({
        nodes: this.nodes,
        links: this.links,
        times: this.times,
        subs: this.subNetworks
      });
    }
  }], [{
    key: 'isEmpty',
    value: function isEmpty(network) {
      return network.nodes.size === 0 && network.links.size === 0;
    }
  }, {
    key: 'isTotal',
    value: function isTotal(network) {
      return network.typeInfo.type == Network.typeTotal().type;
    }
  }, {
    key: 'typeTotal',
    value: function typeTotal() {
      return { type: 'TOTAL' };
    }
  }, {
    key: 'typeSub',
    value: function typeSub(idx, timeAvg) {
      return {
        type: 'SUB',
        idx: idx,
        timeAvg: timeAvg
      };
    }
  }, {
    key: 'splitByTime',
    value: function splitByTime(network) {
      var numberOfSplits = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 100;

      // Get Time Interval
      var timeFirstAndLast = Util.minmax(network.times);
      var timeFirst = timeFirstAndLast[0];
      var timeLast = timeFirstAndLast[1];
      var timeDiff = timeLast - timeFirst + 0.00001;
      var timeInterval = timeDiff / numberOfSplits;

      // Split nodes, links, and times
      var spNodes = [].concat(_toConsumableArray(Array(numberOfSplits))).map(function (e) {
        return new Set();
      });
      var spLinks = [].concat(_toConsumableArray(Array(numberOfSplits))).map(function (e) {
        return new Set();
      });
      var spTimes = [].concat(_toConsumableArray(Array(numberOfSplits))).map(function (e) {
        return new Set();
      });
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = network.links[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var link = _step.value;

          var timeIdx = parseInt((link.time - timeFirst) / timeInterval);
          spNodes[timeIdx].add(link.from).add(link.to);
          spLinks[timeIdx].add(link);
          spTimes[timeIdx].add(link.time);
        }

        // Merge splited nodes, links, and times as splited networks  
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      var spNetworks = [Array(numberOfSplits), undefined];
      for (var idx = 0; idx < numberOfSplits; idx++) {
        var subTimeFirst = timeInterval * (idx + 0) + timeFirst;
        var subTimeLast = timeInterval * (idx + 1) + timeFirst;
        var subTimeAvg = (subTimeFirst + subTimeLast) / 2;
        spNetworks[idx] = new Network(spNodes[idx], spLinks[idx], spTimes[idx], Network.typeSub(idx, subTimeAvg));
      }

      // assign and return
      network.subNetworks = spNetworks;
      return network.subNetworks;
    }
  }, {
    key: 'getDistances',
    value: function getDistances(compareInfo, similarityCriteria, networks) {
      var N = compareInfo.length;
      var ret = [].concat(_toConsumableArray(Array(N))).map(function (x) {
        return Array(N).fill(0);
      });
      for (var i = 0; i < N; i++) {
        for (var j = i + 1; j < N; j++) {
          var similarity = compareInfo[i][j].similarity[similarityCriteria];
          var disimilarity = 1 - similarity;
          ret[i][j] = disimilarity;
          ret[j][i] = disimilarity;
        }
      }
      var trimed = this.trimDistanceMatrix(ret, networks);
      return {
        matrix: Util.normalize2d(trimed.matrix),
        idxs: trimed.idxs
      };
    }
  }, {
    key: 'trimDistanceMatrix',
    value: function trimDistanceMatrix(distances, networks) {
      var matrix = [];
      var idxs = [];
      for (var i = 0; i < distances.length; i++) {
        if (networks[i].nodes.size == 0) continue;
        var retRow = [];
        for (var j = 0; j < distances[i].length; j++) {
          if (networks[j].nodes.size == 0) continue;
          retRow.push(distances[i][j]);
        }
        matrix.push(retRow);
        idxs.push(i);
      }
      return { matrix: matrix, idxs: idxs };
    }
  }, {
    key: 'compareSeveral',
    value: function compareSeveral(networks) {
      var N = networks.length;
      var ret = [].concat(_toConsumableArray(Array(N))).map(function (x) {
        return Array(N).fill(0);
      });
      for (var i = 0; i < N; i++) {
        for (var j = i + 1; j < N; j++) {
          ret[i][j] = Network.compare(networks[i], networks[j]);
        }
      }
      return ret;
    }
  }, {
    key: 'compare',
    value: function compare(n1, n2) {
      var nodes = Network.compareNodes(n1.nodes, n2.nodes);
      var links = Network.compareLinks(n1.links, n2.links);

      var sizes = {
        nc: nodes.common.size,
        n1: nodes.preOnly.size,
        n2: nodes.postOnly.size,
        lc: links.common.size,
        l1: links.preOnly.size,
        l2: links.postOnly.size
      };
      var roughN = sizes.nc / (sizes.nc + sizes.n1 + sizes.n2 + Number.MIN_VALUE);
      var roughL = sizes.lc / (sizes.lc + sizes.l1 + sizes.l2 + Number.MIN_VALUE);
      var similarity = {
        roughNode: roughN,
        roughLink: roughL,
        rough: (roughN + roughL) / 2 // 산술평균 ( 0 <= value <= 1 )
      };

      return { nodes: nodes, links: links, similarity: similarity };
    }
  }, {
    key: 'compareNodes',
    value: function compareNodes(nodes, otherNodes) {
      return Util.compareSets(nodes, otherNodes);
    }
  }, {
    key: 'compareLinks',
    value: function compareLinks(links, otherLinks) {
      var linksNoTime = new Set();
      var otherLinksNoTime = new Set();
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = links[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var e = _step2.value;

          linksNoTime.add(Link.withoutTime(e));
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = otherLinks[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var _e = _step3.value;

          otherLinksNoTime.add(Link.withoutTime(_e));
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      return Util.compareSets(linksNoTime, otherLinksNoTime);
    }
  }, {
    key: 'getMatrix',
    value: function getMatrix(network) {
      // 노드별 인덱스 지정
      var nodeIdxs = {};
      var nodeIdx = 0;
      network.nodes.forEach(function (node) {
        return nodeIdxs[node] = nodeIdx++;
      });

      // 행렬 타입으로 네트워크를 저장
      var D = network.nodes.size;
      var matrix = [].concat(_toConsumableArray(Array(D))).map(function (e) {
        return Array(D).fill(0);
      });
      network.links.forEach(function (link) {
        var from = link.from;
        var to = link.to;
        var fromIdx = from in nodeIdxs ? nodeIdxs[from] : nodeIdx++;
        var toIdx = to in nodeIdxs ? nodeIdxs[to] : nodeIdx++;
        matrix[fromIdx][toIdx] += 1;
      });
      return matrix;
    }
  }, {
    key: 'getStatistics',
    value: function getStatistics(network) {
      var V = network.nodes.size; // number of nodes
      var E = network.links.size; // number of links
      var degrees = Network.getDegrees(network.matrixNotation); // node degrees
      var D_MAX = Math.max.apply(Math, _toConsumableArray(Object.values(degrees)).concat([0])); // Maximum degree
      var D_AVG = E / (V + Number.MIN_VALUE); // Average degree
      var T = Network.countTriangle(network.matrixNotation); // Number Of triangles
      var T_AVG = T / (E + Number.MIN_VALUE); // Average triangles formed by a edge

      // TODO: 여러 statistics 추가
      var T_MAX = 0; // Maximum number of triangles formed by a edge
      var R = 0; // Assort. Coeff.
      var K = 0; // Global clustering coefficient 
      var K_AVG = 0; // Average local clustering coefficient
      var K_MAX = 0; //  Maximum k-core number
      var W_B = 0; // Lower bound on the size of the maximum clique

      return {
        TIME: typeof network.timeAvg !== 'undefined' ? network.timeAvg : 0,
        V: V,
        E: E,
        D_MAX: D_MAX,
        D_AVG: D_AVG,
        T: T,
        T_AVG: T_AVG
      };
    }
  }, {
    key: 'getStatisticsFromNetworks',
    value: function getStatisticsFromNetworks(networks) {
      return networks.map(function (n) {
        return Network.getStatistics(n);
      });
    }
  }, {
    key: 'getDegrees',
    value: function getDegrees(networkMatrix) {
      var degrees = {};
      networkMatrix.forEach(function (row, from) {
        row.forEach(function (link, to) {
          if (link > 0) {
            degrees[from] = from in degrees ? degrees[from] + 1 : 1;
            degrees[to] = to in degrees ? degrees[to] + 1 : 1;
          }
        });
      });
      return degrees;
    }
  }, {
    key: 'countTriangle',
    value: function countTriangle(g) {
      var N = g.length;
      var countTriangle = 0; // Initialize result

      // Consider every possible triplet of edges in graph
      for (var i = 0; i < N; i++) {
        for (var j = 0; j < N; j++) {
          for (var k = 0; k < N; k++) {
            if (i != j && i != k && j != k && g[i][j] > 0 && g[j][k] && g[k][i]) {
              countTriangle += 1;
            }
          }
        }
      }

      // if graph is directed, division is done by 3 else division by 6 is done
      return countTriangle / 3;
    }
  }]);

  return Network;
}();

/**
 * @class Link
 * @param {number} fromId 
 * @param {number} toId 
 * @param {number} time
 */


var Link = function () {
  function Link(fromId, toId) {
    var time = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

    _classCallCheck(this, Link);

    this.from = fromId;
    this.to = toId;
    this.time = time;
  }

  _createClass(Link, [{
    key: 'print',
    value: function print() {
      console.log(this.from, this.to, this.time);
    }
  }], [{
    key: 'withoutTime',
    value: function withoutTime(link) {
      return new Link(link.from, link.to);
    }
  }]);

  return Link;
}();