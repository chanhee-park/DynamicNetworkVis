var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ScatterPlot = function (_React$Component) {
  _inherits(ScatterPlot, _React$Component);

  function ScatterPlot(props) {
    _classCallCheck(this, ScatterPlot);

    var _this = _possibleConstructorReturn(this, (ScatterPlot.__proto__ || Object.getPrototypeOf(ScatterPlot)).call(this, props));

    _this.createScatterPlot = _this.createScatterPlot.bind(_this);
    return _this;
  }

  _createClass(ScatterPlot, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.createScatterPlot();
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      this.createScatterPlot();
    }
  }, {
    key: 'createScatterPlot',
    value: function createScatterPlot() {
      // get scatter plot data
      var data = this.getScatterPlotData(this.props.network.subNetDistances);

      var subNetworks = this.props.network.subNetworks;
      var maximumNodes = _.maxBy(subNetworks, function (n) {
        return n.nodes.size;
      }).nodes.size;

      // set redering size
      var svg = Util.getSVG(this.props.containerId);
      var svgBBox = svg.node().getBoundingClientRect();
      var svgW = svgBBox.width;
      var svgH = svgBBox.height;

      var paddingTop = 100;
      var paddingBottom = 50;
      var paddingLeft = 100;
      var paddingRight = 50;
      var graphPdding = 5;

      var drawBoxW = svgW - paddingRight - paddingLeft;
      var drawBoxH = svgH - paddingTop - paddingBottom;
      var drawBoxMinLen = Math.min(drawBoxW, drawBoxH) - graphPdding;

      var pointPosXRatio = drawBoxMinLen / (data.maxX - data.minX);
      var pointPosYRatio = drawBoxMinLen / (data.maxY - data.minY);
      var maximumRadius = 25;
      var getPoint = function getPoint(pos, i) {
        return {
          x: (pos.x - data.minX) * pointPosXRatio + paddingLeft + graphPdding,
          y: (pos.y - data.minY) * pointPosYRatio + paddingTop + graphPdding,
          r: Math.sqrt(subNetworks[i].nodes.size / maximumNodes) * maximumRadius
        };
      };

      // draw circles on the scatter plot
      var N = data.pos.length;
      _.forEach(data.pos, function (p, i) {
        var point = getPoint(p, i);
        svg.append('circle').attrs({
          cx: point.x,
          cy: point.y,
          r: point.r,
          fill: d3.interpolateGnBu((i + N / 4) / (N - 1 + N / 4)),
          opacity: 0.5
        });
        svg.append('text').text(i).attrs({
          x: point.x,
          y: point.y,
          'text-anchor': 'middle',
          'alignment-baseline': 'middle',
          fill: '#333'
        });
      });
    }
  }, {
    key: 'getScatterPlotData',
    value: function getScatterPlotData(subNetDistances) {
      // const vector = Util.pca(subNetDistances);
      var vector = Util.mds(subNetDistances);

      var pos = [];
      var minX = +Infinity,
          minY = +Infinity,
          maxX = -Infinity,
          maxY = -Infinity;

      _.forEach(vector, function (v) {
        pos.push({ x: v[0], y: v[1] });
        minX = Math.min(minX, v[0]);
        maxX = Math.max(maxX, v[0]);
        minY = Math.min(minY, v[1]);
        maxY = Math.max(maxY, v[1]);
      });

      return { pos: pos, minX: minX, minY: minY, maxX: maxX, maxY: maxY };
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement('div', { id: "#" + this.props.id });
    }
  }]);

  return ScatterPlot;
}(React.Component);