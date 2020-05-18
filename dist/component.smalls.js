var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Smalls = function (_React$Component) {
  _inherits(Smalls, _React$Component);

  function Smalls(props) {
    _classCallCheck(this, Smalls);

    var _this = _possibleConstructorReturn(this, (Smalls.__proto__ || Object.getPrototypeOf(Smalls)).call(this, props));

    _this.containerId = _this.props.containerId;
    _this.container = document.getElementById(_this.containerId);
    _this.networks = _this.props.network.subNetworks;
    // this.container.style.width = this.networks.length * 325;
    return _this;
  }

  _createClass(Smalls, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      Smalls.drawSmalls(this.container, this.networks);
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      Smalls.drawSmalls(this.container, this.networks);
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
          if (cnt < 6) {
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

      // set visNodes
      var nodes = [];
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = network.nodes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var node = _step.value;

          nodes.push({ id: node, label: node });
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

      var visNodes = new vis.DataSet(nodes);

      // set visEdges
      var adges = [];
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = network.links[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var link = _step2.value;

          adges.push({ from: link.from, to: link.to });
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

      var visEdges = new vis.DataSet(adges);

      // draw
      var container = document.getElementById(containerId);
      var data = {
        nodes: visNodes,
        edges: visEdges
      };
      var options = {};
      var network = new vis.Network(container, data, options);
    }
  }]);

  return NodeLinkDiagram;
}();