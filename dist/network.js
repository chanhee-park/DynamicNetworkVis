var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Network = function () {
  function Network(nodes, links, times, typeInfo) {
    _classCallCheck(this, Network);

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

  _createClass(Network, [{
    key: 'print',
    value: function print() {
      console.log({
        type: this.typeInfo.type,
        nodes: this.nodes,
        links: this.links,
        timezone: [this.timeFirst, this.timeLast, this.times],
        subs: this.subNetworks
      });
    }

    // links로 부터 times를 지정한다. 

  }, {
    key: 'setTimes',
    value: function setTimes() {
      var _this = this;

      this.times = new Set();
      _.forEach(this.links, function (l) {
        _this.times.add(l.time);
      });
      return this.times;
    }
  }], [{
    key: 'typeTotal',
    value: function typeTotal() {
      return { type: 'TOTAL', numberOfSplits: 20 };
    }
  }, {
    key: 'typeSub',
    value: function typeSub(idx, numberOfSplits, start, end) {
      return {
        type: 'SUB',
        idx: idx,
        numberOfSplits: numberOfSplits,
        start: start,
        end: end,
        avg: (start + end) / 2
      };
    }
  }, {
    key: 'splitByTime',
    value: function splitByTime(network) {
      var numberOfSplits = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 30;

      network.typeInfo.numberOfSplits = numberOfSplits;

      // get Time Interval
      var timeDiff = network.timeLast - network.timeFirst + 0.0001;
      var timeInterval = timeDiff / numberOfSplits;

      // get splited nodes, links, times
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

          var timeIdx = parseInt((link.time - network.timeFirst) / timeInterval);
          spNodes[timeIdx].add(link.from);
          spNodes[timeIdx].add(link.to);
          spLinks[timeIdx].add(link);
          spTimes[timeIdx].add(link.time);
        }

        // get splited networks
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
        spNetworks[idx] = new Network(spNodes[idx], spLinks[idx], spTimes[idx], Network.typeSub(idx, numberOfSplits, idx * timeInterval + network.timeFirst, idx * (timeInterval + 1) + network.timeFirst));
      }

      // assign and return
      network.subNetworks = spNetworks;
      return network.subNetworks;
    }
  }, {
    key: 'compare',
    value: function compare(a, b) {
      var nodes = Network.compareNodes(a.nodes, b.nodes);
      var links = Network.compareLinks(a.links, b.links);
      return { nodes: nodes, links: links };
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