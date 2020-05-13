var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PCoold = function (_React$Component) {
  _inherits(PCoold, _React$Component);

  function PCoold(props) {
    _classCallCheck(this, PCoold);

    var _this = _possibleConstructorReturn(this, (PCoold.__proto__ || Object.getPrototypeOf(PCoold)).call(this, props));

    _this.svg = Util.getSVG(_this.props.containerId);
    _this.networks = _this.props.network.subNetworks;
    _this.statsMinMax = PCoold.minMaxStats(_this.networks);
    return _this;
  }

  _createClass(PCoold, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      PCoold.drawPCoold(this.svg, this.networks, this.statsMinMax);
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      PCoold.drawPCoold(this.svg, this.networks, this.statsMinMax);
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement('div', { id: "#" + this.props.id });
    }
  }], [{
    key: 'drawPCoold',
    value: function drawPCoold(svg, networks, statsMinMax) {
      // data size 
      var networkLen = networks.length;
      var statsKeys = Object.keys(statsMinMax);
      var statLen = statsKeys.length;

      // get svg box 
      var svgBBox = svg.node().getBoundingClientRect();
      var svgW = svgBBox.width;
      var svgH = svgBBox.height;
      var paddingW = 50;
      var paddingH = 30;

      // set parallel coordinates graph size
      var drawBoxW = svgW - paddingW * 2;
      var drawBoxH = svgH - paddingH * 2;

      // Draw Axis and Legend
      var xInterval = drawBoxW / (statLen - 1);
      statsKeys.forEach(function (key, i) {
        var x = i * xInterval + paddingW;

        // 세로 선
        svg.append('line').attrs({
          x1: x,
          x2: x,
          y1: paddingH,
          y2: paddingH + drawBoxH,
          stroke: COLOR_AXIS,
          'stroke-width': 2
        });

        // 통계치 이름
        svg.append('text').text(key).attrs({
          x: x,
          y: paddingH + drawBoxH + 10,
          'text-anchor': 'middle',
          'alignment-baseline': 'hanging',
          'font-size': 14
        });

        // 가로선과 통계 수치
        var numOfHorLine = 4;
        var yInterval = drawBoxH / (numOfHorLine - 1);
        var statMin = statsMinMax[key].min;
        var statMax = statsMinMax[key].max;
        var valInterval = (statMax - statMin) / (numOfHorLine - 1);
        for (var j = 0; j < numOfHorLine; j++) {
          var y = j * yInterval + paddingH;
          var val = parseInt((numOfHorLine - j - 1) * valInterval + statMin);

          // 가로선
          svg.append('line').attrs({
            x1: x - 10,
            x2: x + 10,
            y1: y,
            y2: y,
            stroke: COLOR_AXIS
          });

          // 통계 수치
          svg.append('text').text(val).attrs({
            x: x + 15,
            y: y,
            'text-anchor': 'start',
            'alignment-baseline': 'centeral',
            'font-size': 9
          });
        }
      });

      // Draw Paths for each Network 
      var lineFunction = d3.line().x(function (d) {
        return d.x;
      }).y(function (d) {
        return d.y;
      }).curve(d3.curveMonotoneX);
      // curveLinear, curveBasis, curveMonotoneX, curveCatmullRom.alpha(1)

      var _loop = function _loop(i) {
        var n = networks[i];
        if (n.nodes.size === 0) return 'continue';

        // Set Line Data
        var lineData = [];
        statsKeys.forEach(function (k, j) {
          var smin = statsMinMax[k].min;
          var smax = statsMinMax[k].max;
          var valRel = 1 - (n.stats[k] - smin) / (smax - smin + Number.MIN_VALUE);
          lineData.push({
            x: j * xInterval + paddingW,
            y: valRel * drawBoxH + paddingH
          });
        });

        // Draw Line
        svg.append("path").attrs({
          d: lineFunction(lineData),
          stroke: d3.interpolateYlGnBu(
          // 0.25 ~ 1.00
          (i + 1 + networkLen / 4) / (networkLen + networkLen / 4)),
          "stroke-width": 2,
          opacity: 0.5,
          fill: "none"
        });
      };

      for (var i = 0; i < networkLen; i++) {
        var _ret = _loop(i);

        if (_ret === 'continue') continue;
      }

      return;
    }
  }, {
    key: 'minMaxStats',
    value: function minMaxStats(networks) {
      var stats = networks.map(function (n) {
        return n.stats;
      });
      var statsByKey = Util.transposeCollection(stats);
      var ret = {};
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = Object.entries(statsByKey)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _ref = _step.value;

          var _ref2 = _slicedToArray(_ref, 2);

          var key = _ref2[0];
          var value = _ref2[1];

          var minmaxValue = Util.minmax(value);
          ret[key] = {
            min: minmaxValue[0],
            max: minmaxValue[1]
          };
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

      return ret;
    }
  }]);

  return PCoold;
}(React.Component);