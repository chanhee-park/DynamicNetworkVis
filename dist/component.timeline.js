var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Timeline = function (_React$Component) {
  _inherits(Timeline, _React$Component);

  function Timeline(props) {
    _classCallCheck(this, Timeline);

    var _this = _possibleConstructorReturn(this, (Timeline.__proto__ || Object.getPrototypeOf(Timeline)).call(this, props));

    _this.createTimeline = _this.createTimeline.bind(_this);
    return _this;
  }

  _createClass(Timeline, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.createTimeline();
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      this.createTimeline();
    }
  }, {
    key: 'createTimeline',
    value: function createTimeline() {
      // get time compared data
      var subNetworks = this.props.network.subNetworks;
      console.log(subNetworks);
      var timelineInfo = this.getTimelineInfo(subNetworks);
      var bars = timelineInfo.bars;
      var max = timelineInfo.maxSize;
      var avgTimes = timelineInfo.avgTimes;

      // set rendering size
      var svg = getSVG(this.props.containerId);

      var svgBBox = svg.node().getBoundingClientRect();
      var svgW = svgBBox.width;
      var svgH = svgBBox.height;

      var paddingRight = 200;
      var paddingTop = 50;
      var paddingBottom = 20;

      var barInterval = (svgW - paddingRight) / (bars.length + 1);
      var barW = barInterval / 4;
      var barHRatio = (svgH - (paddingTop + paddingBottom)) / (Math.sqrt(max) * 2);
      var centerY = (svgH - (paddingTop + paddingBottom)) / 2 + paddingTop;

      var xStart = barInterval - barW;
      var xEnd = svgW - paddingRight;

      // title
      svg.append('text').text('Network Change Timeline').attrs({
        x: 10,
        y: 10,
        'text-anchor': 'start',
        'alignment-baseline': 'hanging',
        'font-size': 18
      });

      // Legend - colors
      var colorLegendW = 120;
      var colorLegendXStart = xEnd - colorLegendW * 3;
      var colorLegendY = paddingTop - 30;

      svg.append('rect').attrs({
        x: colorLegendXStart,
        y: colorLegendY,
        width: barW,
        height: barW,
        fill: COLOR_BAR_COM
      });
      svg.append('text').text('Remained').attrs({
        x: colorLegendXStart + barW * 1.2,
        y: colorLegendY + barW / 2,
        'text-anchor': 'start',
        'alignment-baseline': 'central',
        'font-size': 14
      });

      svg.append('rect').attrs({
        x: colorLegendXStart + colorLegendW,
        y: colorLegendY,
        width: barW,
        height: barW,
        fill: COLOR_BAR_ADD
      });
      svg.append('text').text('Added').attrs({
        x: colorLegendXStart + colorLegendW + barW * 1.2,
        y: colorLegendY + barW / 2,
        'text-anchor': 'start',
        'alignment-baseline': 'central',
        'font-size': 14
      });

      svg.append('rect').attrs({
        x: colorLegendXStart + colorLegendW * 2,
        y: colorLegendY,
        width: barW,
        height: barW,
        fill: COLOR_BAR_RMD
      });
      svg.append('text').text('Disappeared').attrs({
        x: colorLegendXStart + colorLegendW * 2 + barW * 1.2,
        y: colorLegendY + barW / 2,
        'text-anchor': 'start',
        'alignment-baseline': 'central',
        'font-size': 14
      });

      // Legend - horizontal axis
      var numOfAxisHor = 3; // 3 => 가운데, 중간 위(아래), 맨 위(아래)
      for (var i = -numOfAxisHor + 1; i < numOfAxisHor; i++) {
        var nodeVal = i * Math.sqrt(max) / (numOfAxisHor - 1);

        // 가로 선
        var y = centerY - barHRatio * nodeVal;

        svg.append('line').attrs({
          x1: xStart,
          x2: xEnd,
          y1: y,
          y2: y,
          stroke: COLOR_BAR_AXIS,
          'stroke-width': i == 0 ? 3 : 1
        });

        if (i == numOfAxisHor - 1) {
          svg.append('text').text('Nodes').attrs({
            x: xEnd + 50,
            y: y - 20,
            'text-anchor': 'end',
            'alignment-baseline': 'middle'
          });
          svg.append('text').text('Links').attrs({
            x: xEnd + 150,
            y: y - 20,
            'text-anchor': 'end',
            'alignment-baseline': 'middle'
          });
        }
        // 노드 높이 설명
        svg.append('text').text(Math.round(nodeVal)).attrs({
          x: xEnd + 50,
          y: y,
          'text-anchor': 'end',
          'alignment-baseline': 'middle'
        });

        // 링크 높이 설명
        var linkVal = Math.round(i * max / (numOfAxisHor - 1));
        svg.append('text').text(linkVal).attrs({
          x: xEnd + 150,
          y: y,
          'text-anchor': 'end',
          'alignment-baseline': 'middle'
        });
      }

      // 시간을 순회하며 바를 그린다.
      var barLen = bars.length;
      _.forEach(bars, function (bar, i) {
        var x = (i + 1) * barInterval;

        // 세로 보조선: 노드바와 링크바 사이에 그린다.
        svg.append('line').attrs({
          x1: x + barW,
          x2: x + barW,
          y1: centerY - 10,
          y2: centerY + 10,
          stroke: COLOR_BAR_AXIS
        });

        // 시간 표시
        if (i == 0 || i == barLen - 1 || i == Math.round(barLen / 2)) {
          var timeString = Math.round(avgTimes[i]);
          svg.append('text').text(timeString).attrs({
            x: x + barW,
            y: svgH - paddingBottom + 5,
            'text-anchor': 'middle',
            'alignment-baseline': 'hanging'
          });
        }

        // 바 그리기
        var values = [bar.nodes.preOnly.size, // removed
        bar.nodes.postOnly.size, // added
        bar.nodes.common.size, // common
        bar.links.preOnly.size, // removed
        bar.links.postOnly.size, // added
        bar.links.common.size // common
        ];

        var tooltipTxt = '\n        Nodes: +' + values[1] + '  /  -' + values[0] + ' <br>\n        Links: +' + values[4] + '  /  -' + values[3] + '\n      ';

        _.forEach(values, function (value, j) {
          var type = j % 3; // [removed, added, common]
          var isNode = j < 3; // [node, node, link, link]

          var barH = barHRatio * (isNode ? value : Math.sqrt(value));
          var barX = isNode ? x : x + barW;
          var barY = 0;
          var fill = COLOR_BAR_COM;

          if (type == 0) {
            // removed
            barY = centerY;
            fill = COLOR_BAR_RMD;
          } else if (type == 1) {
            // added
            var comV = values[j + 1];
            var comBarH = barHRatio * (isNode ? comV : Math.sqrt(comV));
            barY = centerY - barH - comBarH;
            fill = COLOR_BAR_ADD;
          } else {
            // common
            barY = centerY - barH;
            fill = COLOR_BAR_COM;
          }

          svg.append('rect').attrs({
            x: barX,
            y: barY,
            width: barW,
            height: barH,
            fill: fill
          }).on("mouseover", function () {
            var xPosition = parseFloat(d3.select(this).attr("x")) + 50;
            var yPosition = parseFloat(d3.select(this).attr("y")) + 50;
            d3.select("#tooltip").style("left", xPosition + "px").style("top", yPosition + "px").select("#value").html(tooltipTxt);
            d3.select("#tooltip").classed("hidden", false);
          }).on("mouseout", function () {
            d3.select("#tooltip").classed("hidden", true);
          });
        });
      });
    }
  }, {
    key: 'getTimelineInfo',
    value: function getTimelineInfo(networks) {
      var ret = [Network.compare(new Network(), networks[0])];
      var avgTimes = [networks[0].timeAvg];
      var maxSize = Math.max(networks[0].nodes.size, networks[0].links.size);
      for (var i = 1; i < networks.length; i++) {
        var n0 = networks[i - 1];
        var n1 = networks[i];
        avgTimes.push((n1.timeFirst + n1.timeLast) / 2);
        ret.push(Network.compare(n0, n1));
        maxSize = Math.max.apply(Math, [maxSize, n1.nodes.size, n1.links.size]);
      }
      return { bars: ret, maxSize: maxSize, avgTimes: avgTimes };
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement('div', { id: "#" + this.props.id });
    }
  }]);

  return Timeline;
}(React.Component);

function getSVG(containerId) {
  var container = d3.select(containerId);
  var containerBounding = container.node().getBoundingClientRect();
  var svgW = containerBounding.width - 2 * PADDING_FOR_SECTION;
  var svgH = containerBounding.height - 2 * PADDING_FOR_SECTION;

  var svg = container.append("svg").attr("width", svgW).attr("height", svgH);

  return svg;
}