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
      Smalls.drawSmalls(this.state.container, this.state.networks, this.props.nodeClickHandler);
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement('div', { id: "#" + this.props.id });
    }
  }], [{
    key: 'drawSmalls',
    value: function drawSmalls(container, networks, nodeClickEvent) {
      var cnt = 0;
      networks.forEach(function (network, i) {
        if (network.nodes.size > 0) {
          var padNum = ('000' + i).slice(-3); // pad with 0 (eg. 003, 072)
          var diagramId = 'diagram' + padNum;
          var diagramDiv = document.createElement('div');
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
  }]);

  return Smalls;
}(React.Component);

var NodeLinkDiagram = function () {
  function NodeLinkDiagram() {
    _classCallCheck(this, NodeLinkDiagram);
  }

  _createClass(NodeLinkDiagram, null, [{
    key: 'draw',
    value: function draw(containerId, network, networkIdx, nodeClickEvent) {
      var container = document.getElementById(containerId);
      var nodes = NodeLinkDiagram.getVisNodes(network.nodes);
      var edges = NodeLinkDiagram.getVisEdges(network.links);
      var data = { nodes: nodes, edges: edges };
      var options = {};

      var visNetwork = new vis.Network(container, data, options);
      // TODO: 노드 위치 받아서/계산해서 직접 그리기
      // visNetwork.on("afterDrawing", function (properties) {
      //   console.log(nodes);
      // });
      visNetwork.on('click', function (properties) {
        if (properties.nodes.length > 0) {
          var nodeIdx = properties.nodes[0];
          // TODO: 실제 노트 통계치 계산해서 만들기 
          nodeClickEvent({
            'Node ID': nodeIdx,
            'Network Time Section': networkIdx,
            'Degree': parseInt(Math.random() * 100),
            'random(1)': parseInt(Math.random() * 48 + 8),
            'random(2)': parseInt(Math.random() * 39 + 27),
            'random(3)': parseInt(Math.random() * 50),
            'random(4)': parseInt(Math.random() * 123)
          });
        }
      });
    }
  }, {
    key: 'getVisNodes',
    value: function getVisNodes(nodes) {
      return new vis.DataSet([].concat(_toConsumableArray(nodes)).map(function (node) {
        return { id: node, label: node };
      }));
    }
  }, {
    key: 'getVisEdges',
    value: function getVisEdges(links) {
      var edgeMap = {};
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = links[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
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