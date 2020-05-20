var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Smalls = function (_React$Component) {
  _inherits(Smalls, _React$Component);

  function Smalls(props) {
    _classCallCheck(this, Smalls);

    var _this = _possibleConstructorReturn(this, (Smalls.__proto__ || Object.getPrototypeOf(Smalls)).call(this, props));

    _this.state = {
      container: null,
      networks: _this.props.network.subNetworks
    };
    return _this;
  }

  _createClass(Smalls, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var containerId = Util.getParentIdOfReactComp(this);
      this.setState({
        container: document.getElementById(containerId)
      });
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      Smalls.drawSmalls(this.state.container, this.state.networks);
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement('div', { id: "#" + this.props.id });
    }
  }], [{
    key: 'drawSmalls',
    value: function drawSmalls(container, networks) {
      var cnt = 0;
      networks.forEach(function (network, i) {
        if (network.nodes.size > 0) {
          // set svg
          var padNum = ('000' + i).slice(-3); // pad with 0 (eg. 003, 072)
          var diagramId = 'diagram' + padNum;
          var diagramDiv = document.createElement('div');
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
  }]);

  return Smalls;
}(React.Component);

var NodeLinkDiagram = function () {
  function NodeLinkDiagram() {
    _classCallCheck(this, NodeLinkDiagram);
  }

  _createClass(NodeLinkDiagram, null, [{
    key: 'draw',
    value: function draw(containerId, network) {
      var container = document.getElementById(containerId);
      var data = {
        nodes: NodeLinkDiagram.getVisNodes(network),
        edges: NodeLinkDiagram.getVisEdges(network)
      };
      var options = {};

      var network = new vis.Network(container, data, options);
    }
  }, {
    key: 'getVisNodes',
    value: function getVisNodes(network) {
      var nodes = [].concat(_toConsumableArray(network.nodes)).map(function (node) {
        return { id: node, label: node };
      });
      return new vis.DataSet(nodes);
    }
  }, {
    key: 'getVisEdges',
    value: function getVisEdges(network) {
      var edgeMap = {};
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = network.links[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var link = _step.value;

          var from = Math.min(link.from, link.to);
          var to = Math.max(link.from, link.to);
          var key = from + '-' + to;
          if (key in edgeMap) {
            edgeMap[key].value += 1;
          } else {
            edgeMap[key] = { from: from, to: to, value: 1 };
          }
        }
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

      var edges = Object.values(edgeMap);
      return new vis.DataSet(edges);
    }
  }]);

  return NodeLinkDiagram;
}();