function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

// 시각화 외적인 기능을 계산하고 처리하는 유틸리티
var Util = {
  /**
   * 파일을 불러온다.
   * @method loadFile
   * @param {string} filePath 불러올 파일의 파일명을 포함한 경로
   * @returns {string} 불러온 파일의 responseText
   */
  loadFile: function loadFile(filePath) {
    var result = null;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", filePath, false);
    xmlhttp.send();
    if (xmlhttp.status == 200) {
      result = xmlhttp.responseText;
    }
    return result;
  },

  min: function min(arrayLike) {
    var min = +Infinity;
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = arrayLike[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var item = _step.value;

        min = Math.min(min, item);
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

    return isFinite(min) ? min : -1;
  },

  max: function max(arrayLike) {
    var max = -Infinity;
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = arrayLike[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var item = _step2.value;

        max = Math.max(max, item);
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

    return isFinite(max) ? max : -1;
  },

  compareSets: function compareSets(pre, post) {
    var union = new Set([].concat(_toConsumableArray(pre), _toConsumableArray(post)));

    var common = new Set();
    var preOnly = new Set();
    var postOnly = new Set();

    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
      for (var _iterator3 = union[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
        var e = _step3.value;

        if (pre.has(e) && post.has(e)) {
          common.add(e);
        } else if (pre.has(e)) {
          preOnly.add(e);
        } else if (post.has(e)) {
          postOnly.add(e);
        }
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

    return { preOnly: preOnly, postOnly: postOnly, common: common };
  }

  /**
   * 테스트 데이터를 불러온다.
   * from './dataset/copresence-InVS13/copresence-InVS13.edges'
   */
};function getTestData() {
  var res = Util.loadFile(Data.testset);
  var lines = res.split('\n');

  var nodes = new Set();;
  var links = new Set();;
  var times = new Set();;

  _.forEach(lines, function (line) {
    var elems = line.split(' ');
    if (elems[0].length > 0 && elems[1].length > 0 && elems[2].length > 0) {

      var from = parseInt(elems[0]);
      var to = parseInt(elems[1]);
      var time = parseInt(elems[2]);

      nodes.add(from).add(to);
      times.add(time);
      links.add(new Link(from, to, time));
    }
  });

  return new Network(nodes, links, times);
}