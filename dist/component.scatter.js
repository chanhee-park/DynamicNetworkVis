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
    value: function drawScatterPlot(svg, points) {
      // get svg box 
      var svgBBox = svg.node().getBoundingClientRect();

      // set render zone size
      var svgW = svgBBox.width,
          svgH = svgBBox.height,
          paddingTop = 100,
          paddingBottom = 50,
          paddingLeft = 100,
          paddingRight = 50,
          graphPdding = 5;

      // set scatter plot graph size
      var drawBoxW = svgW - paddingRight - paddingLeft,
          drawBoxH = svgH - paddingTop - paddingBottom,
          maximumRadius = 25;

      // define sizing variable for circles on the scatter plot.
      var pointPosXRatio = drawBoxW / (points.maxX - points.minX);
      var pointPosYRatio = drawBoxH / (points.maxY - points.minY);
      var pointRadiusRatio = maximumRadius / points.maxR;

      // Define position, size, and color of  circles on the scatter plot 
      var getCircle = function getCircle(p) {
        return {
          cx: (p.x - points.minX) * pointPosXRatio + paddingLeft + graphPdding,
          cy: (p.y - points.minY) * pointPosYRatio + paddingTop + graphPdding,
          r: p.r * pointRadiusRatio,
          fill: p.c,
          opacity: p.a
        };
      };

      // draw circles on the scatter plot
      _.forEach(points.pointArr, function (p, i) {
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

      // Draw Title 

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
      var N = networks.length;

      // const vector = Util.pca(subNetDistances);
      var vector = Util.mds(distanceMatrix);
      var points = new Points();
      vector.forEach(function (v, i) {
        points.add(new Point({
          x: v[0],
          y: v[1],
          r: Math.sqrt(networks[i].nodes.size),
          c: d3.interpolateGnBu((i + N / 4) / (N - 1 + N / 4)),
          a: 0.5
        }));
      });

      return points;
    }
  }]);

  return ScatterPlot;
}(React.Component);

var Points = function () {
  function Points(pointArr) {
    _classCallCheck(this, Points);

    var isEmpty = typeof pointArr !== 'undefined';
    this.pointArr = isEmpty ? pointArr : [];
    this.minX = isEmpty ? _.minBy(pointArr, 'x') : +Infinity;
    this.maxX = isEmpty ? _.maxBy(pointArr, 'x') : -Infinity;
    this.minY = isEmpty ? _.minBy(pointArr, 'y') : +Infinity;
    this.maxY = isEmpty ? _.maxBy(pointArr, 'y') : -Infinity;
    this.minR = isEmpty ? _.minBy(pointArr, 'r') : +Infinity;
    this.maxR = isEmpty ? _.maxBy(pointArr, 'r') : 0;
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