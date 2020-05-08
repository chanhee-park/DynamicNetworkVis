var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var testsets = [{
  url: './dataset/copresence-InVS13/copresence-InVS13.edges',
  idxs: [0, 1, 2]
}, {
  url: './dataset/insecta-ant-colony6/insecta-ant-colony6.edges',
  idxs: [0, 1, 3]
}];

var Dataset = function () {
  /**
   * Dataset 객체를 생성한다.
   * @param {boolean} isUrlFile 두번째 매개변수인 파일이 URL 형식으로 주어젔는지 표시
   * @param {string} file 스트링으로 구성된 파일(eg. csv, tsv, ssv) 또는 URL
   * @param {string} sep 주어진 파일의 구분자(Separator)
   * @param {number[]} idxs 주어진 파일에서 [노드1, 노드2, 시간]에 대한 컬럼 인덱스
   */
  function Dataset(file) {
    var idxs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [0, 1, 2];
    var sep = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ' ';
    var isUrlFile = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

    _classCallCheck(this, Dataset);

    this.txt = isUrlFile ? Util.loadFile(file) : file;
    this.sep = sep;
    this.node1Idx = (typeof idxs === 'undefined' ? 'undefined' : _typeof(idxs)) !== undefined ? idxs[0] : 0;
    this.node2Idx = (typeof idxs === 'undefined' ? 'undefined' : _typeof(idxs)) !== undefined ? idxs[1] : 1;
    this.timeIdx = (typeof idxs === 'undefined' ? 'undefined' : _typeof(idxs)) !== undefined ? idxs[2] : 2;
  }

  _createClass(Dataset, [{
    key: 'print',
    value: function print() {
      console.log('-- Dataset --');
      console.log('txt: ', this.txt);
      console.log('sep: \'' + this.sep + '\'');
      console.log('idx: ', this.node1Idx, this.node2Idx, this.timeIdx);
    }

    /**
     * 
     * @param {Dataset} dataset 네트워크를 생성할 데이터셋
     * @param {number} probability 링크가 필터링 될 확률 (0 < p < 1)
     */

  }], [{
    key: 'getNetwork',
    value: function getNetwork(dataset) {
      var probability = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

      var txt = dataset.txt;
      var sep = dataset.sep;
      var n1Idx = dataset.node1Idx;
      var n2Idx = dataset.node2Idx;
      var tiIdx = dataset.timeIdx;

      var nodes = new Set();
      var links = new Set();
      var times = new Set();
      var lines = txt.split('\n');
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = lines[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var line = _step.value;

          // probability 확률로 링크를 필터링 합니다.
          if (Math.random() > probability) continue;

          var elems = line.split(sep);
          var from = parseInt(elems[n1Idx]);
          var to = parseInt(elems[n2Idx]);
          var time = parseInt(elems[tiIdx]);

          // from_node, to_node, 그리고 time 중 하나라도 NaN인 경우 패스합니다.
          if (isNaN(from + to + time)) continue;

          nodes.add(from).add(to);
          times.add(time);
          links.add(new Link(from, to, time));
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

      return new Network(nodes, links, times);
    }
  }]);

  return Dataset;
}();