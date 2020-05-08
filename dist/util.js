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

  /**
   * svg를 생성하고 리턴한다. 
   * @param {string} selector 선택자 스트링 (eg. '#my_container')
   */
  getSVG: function getSVG(selector) {
    var container = d3.select(selector);
    var containerBBox = container.node().getBoundingClientRect();
    var svgW = containerBBox.width - 2 * PADDING_FOR_SECTION;
    var svgH = containerBBox.height - 2 * PADDING_FOR_SECTION;

    return container.append("svg").attr("width", svgW).attr("height", svgH);
  },

  /**
   * 최소 값을 찾는다. 
   * @param {Iterable<number>} arrayLike 순회할 Iterable 객체 (eg. Array, Set, ..)
   */
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

  /**
  * 최대 값을 찾는다.
  * @param {Iterable<number>} arrayLike 순회할 Iterable 객체 (eg. Array, Set, ..)
  */
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

  /**
  * 두개의 Set 객체를 비교한다.
  * @param {Set} pre 
  * @param {Set} post
  */
  compareSets: function compareSets(pre, post) {
    var common = new Set(); // It will be a intersection of two sets.
    var preOnly = new Set();
    var postOnly = new Set();

    var union = new Set([].concat(_toConsumableArray(pre), _toConsumableArray(post))); // Get Union of two sets.
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
  },

  /**
   * PCA 차원축소
   * @param {number[]} arr2d row에 instances, colunm에 attributes 값을 담는 2차원 배열
   * @param {number} dimensions 기본 값이 2로 설정된 축소하여 반환할 차원의 수
   */
  pca: function pca(arr2d) {
    var dimensions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;

    // package: https://cdn.jsdelivr.net/npm/pca-js@1.0.0/pca.min.js
    var pcaRes = PCA.getEigenVectors(arr2d);
    return pcaRes.map(function (e) {
      return e.vector.slice(0, dimensions);
    });
  },

  /**
   * MDS 차원축소
   * @param {number[]} distances 2차원 인접행렬
   * @param {number} dimensions 기본 값이 2로 설정된 축소하여 반환할 차원의 수
   */
  mds: function mds(distances) {
    var dimensions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;

    // square distances
    var M = numeric.mul(-.5, numeric.pow(distances, 2));

    // double centre the rows/columns
    function mean(A) {
      return numeric.div(numeric.add.apply(null, A), A.length);
    }
    var rowMeans = mean(M),
        colMeans = mean(numeric.transpose(M)),
        totalMean = mean(rowMeans);

    for (var i = 0; i < M.length; ++i) {
      for (var j = 0; j < M[0].length; ++j) {
        M[i][j] += totalMean - rowMeans[i] - colMeans[j];
      }
    }

    // take the SVD of the double centred matrix, and return the points from it
    var ret = numeric.svd(M),
        eigenValues = numeric.sqrt(ret.S);

    return ret.U.map(function (row) {
      return numeric.mul(row, eigenValues).splice(0, dimensions);
    });
  }
};