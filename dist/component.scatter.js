var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ScatterPlot = function (_React$Component) {
  _inherits(ScatterPlot, _React$Component);

  function ScatterPlot(props) {
    _classCallCheck(this, ScatterPlot);

    var _this = _possibleConstructorReturn(this, (ScatterPlot.__proto__ || Object.getPrototypeOf(ScatterPlot)).call(this, props));

    _this.svg = Util.getSVG(_this.props.containerId);
    _this.distances = _this.props.network.subNetDistances;
    _this.networks = _this.props.network.subNetworks;
    _this.points = ScatterPlot.getScatterData(_this.distances, _this.networks);
    _this.points.normalize();
    return _this;
  }

  _createClass(ScatterPlot, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.drawScatterPlot(this.svg, this.points);
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      this.drawScatterPlot(this.svg, this.points);
    }
  }, {
    key: 'drawScatterPlot',
    value: function drawScatterPlot(svg, normPoints) {
      // get svg box 
      var svgBBox = svg.node().getBoundingClientRect();
      var svgW = svgBBox.width;
      var svgH = svgBBox.height;
      var paddingGraph = 50;

      // set scatter plot graph size
      var drawBoxW = svgW - paddingGraph * 2;
      var drawBoxH = svgH - paddingGraph * 2;
      var maximumRadius = paddingGraph / 2;

      // Define position, size, and color of  circles on the scatter plot 
      var getCircle = function getCircle(p) {
        return {
          cx: paddingGraph + drawBoxW * p.x,
          cy: paddingGraph + drawBoxH * p.y,
          r: p.r * maximumRadius,
          fill: p.c,
          opacity: p.a
        };
      };

      // draw circles on the scatter plot
      normPoints.pointArr.forEach(function (p, i) {
        var attrs = getCircle(p);
        svg.append('circle').attrs(attrs);
        svg.append('text').text(i).attrs({
          x: attrs.cx,
          y: attrs.cy,
          'text-anchor': 'middle',
          'alignment-baseline': 'middle',
          fill: '#333'
        });
      });

      // Draw Axis and Legend
      var numberOfAxis = 5;
      var axisW = svgW / (numberOfAxis + 1);
      var axisH = svgH / (numberOfAxis + 1);
      for (var i = 1; i <= numberOfAxis; i++) {
        // 가로 선
        svg.append('line').attrs({
          x1: 0,
          x2: svgW,
          y1: i * axisH,
          y2: i * axisH,
          stroke: COLOR_AXIS
        });
        // 세로 선 
        svg.append('line').attrs({
          x1: i * axisW,
          x2: i * axisW,
          y1: 0,
          y2: svgH,
          stroke: COLOR_AXIS
        });
      }
      // 가로 선 


      // TODO: 확대 축소 클릭 호버 인터랙션

      return;
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement('div', { id: "#" + this.props.id });
    }
  }], [{
    key: 'getScatterData',
    value: function getScatterData(distanceMatrix, networks) {
      // const vector = Util.pca(distanceMatrix);
      var vector = Util.mds(distanceMatrix);
      var N = networks.length;
      var pointArr = vector.map(function (v, i) {
        return new Point({
          x: v[0],
          y: v[1],
          r: Math.sqrt(networks[i].nodes.size),
          c: d3.interpolateGnBu((i + N / 4) / (N - 1 + N / 4)),
          a: 0.5
        });
      });

      return new Points(pointArr);
    }
  }]);

  return ScatterPlot;
}(React.Component);

var Points = function () {
  function Points(pointArr) {
    _classCallCheck(this, Points);

    var isEmpty = typeof pointArr !== 'undefined';
    this.pointArr = isEmpty ? pointArr : [];
    this.minX = isEmpty ? _.minBy(pointArr, 'x').x : +Infinity;
    this.maxX = isEmpty ? _.maxBy(pointArr, 'x').x : -Infinity;
    this.minY = isEmpty ? _.minBy(pointArr, 'y').y : +Infinity;
    this.maxY = isEmpty ? _.maxBy(pointArr, 'y').y : -Infinity;
    this.minR = isEmpty ? _.minBy(pointArr, 'r').r : +Infinity;
    this.maxR = isEmpty ? _.maxBy(pointArr, 'r').r : 0;
  }

  _createClass(Points, [{
    key: 'add',
    value: function add(point) {
      this.pointArr.push(point);
      this.minX = Math.min(this.minX, point.x);
      this.maxX = Math.max(this.maxX, point.x);
      this.minY = Math.min(this.minY, point.y);
      this.maxY = Math.max(this.maxY, point.y);
      this.minR = Math.min(this.minR, point.r);
      this.maxR = Math.max(this.maxR, point.r);
    }
  }, {
    key: 'show',
    value: function show() {
      console.log('minX:', this.minX, ', maxX:', this.maxX);
      console.log('minY:', this.minY, ', maxY:', this.maxY);
      console.log('minR:', this.minR, ', maxR:', this.maxR);
      this.pointArr.forEach(function (p) {
        return console.log({ x: p.x, y: p.y, r: p.r });
      });
    }
  }, {
    key: 'normalize',
    value: function normalize() {
      var _this2 = this;

      this.pointArr = this.pointArr.map(function (p) {
        return new Point({
          x: (p.x - _this2.minX) / (_this2.maxX - _this2.minX),
          y: (p.y - _this2.minY) / (_this2.maxY - _this2.minY),
          r: (p.r - _this2.minR) / (_this2.maxR - _this2.minR),
          c: p.c,
          a: p.a
        });
      });
      this.minX = 0;
      this.minY = 0;
      this.minR = 0;
      this.maxX = 1;
      this.maxY = 1;
      this.maxR = 1;
    }
  }]);

  return Points;
}();

var Point = function () {
  function Point(props) {
    _classCallCheck(this, Point);

    this.x = props.x;
    this.y = props.y;
    this.r = _typeof(props.r) !== undefined ? props.r : 5;
    this.c = _typeof(props.c) !== undefined ? props.c : '#aaa';
    this.a = _typeof(props.a) !== undefined ? props.a : 0.5;
  }

  _createClass(Point, [{
    key: 'print',
    value: function print() {
      console.log({ x: p.x, y: p.y, r: p.r });
    }
  }]);

  return Point;
}();