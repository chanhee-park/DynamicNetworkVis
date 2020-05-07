// 시각화 외적인 기능을 계산하고 처리하는 유틸리티
const Util = {
  /**
   * 파일을 불러온다.
   * @method loadFile
   * @param {string} filePath 불러올 파일의 파일명을 포함한 경로
   * @returns {string} 불러온 파일의 responseText
   */
  loadFile: (filePath) => {
    let result = null;
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", filePath, false);
    xmlhttp.send();
    if (xmlhttp.status == 200) {
      result = xmlhttp.responseText;
    }
    return result;
  },

  getSVG: (containerId) => {
    const container = d3.select(containerId);
    const containerBounding = container.node().getBoundingClientRect();
    const svgW = containerBounding.width - 2 * PADDING_FOR_SECTION;
    const svgH = containerBounding.height - 2 * PADDING_FOR_SECTION;

    const svg = container
      .append("svg")
      .attr("width", svgW)
      .attr("height", svgH);

    return svg;
  },

  min: (arrayLike) => {
    let min = +Infinity;
    for (let item of arrayLike) {
      min = Math.min(min, item)
    }
    return isFinite(min) ? min : -1
  },

  max: (arrayLike) => {
    let max = -Infinity;
    for (let item of arrayLike) {
      max = Math.max(max, item)
    }
    return isFinite(max) ? max : -1
  },

  compareSets: (pre, post) => {
    const union = new Set([...pre, ...post]);

    const common = new Set();
    const preOnly = new Set();
    const postOnly = new Set();

    for (let e of union) {
      if (pre.has(e) && post.has(e)) {
        common.add(e)
      } else if (pre.has(e)) {
        preOnly.add(e)
      } else if (post.has(e)) {
        postOnly.add(e)
      }
    }

    return { preOnly, postOnly, common }
  },

  pca: (arr2d, dimensions = 2) => {
    const pcaVal = PCA.getEigenVectors(arr2d);
    const ret = [];
    _.forEach(pcaVal, (v) => {
      const val = [];
      for (let i = 0; i < dimensions; i++) {
        val.push(v.vector[i]);
      }
      ret.push(val);
    });

    return ret;
  },

  mds: (distances, dimensions = 2) => {
    // square distances
    var M = numeric.mul(-.5, numeric.pow(distances, 2));

    // double centre the rows/columns
    function mean (A) { return numeric.div(numeric.add.apply(null, A), A.length); }
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
  },
}

/**
 * 테스트 데이터를 불러온다.
 * from './dataset/copresence-InVS13/copresence-InVS13.edges'
 */
function getTestData (testset) {
  console.log(testset);
  const res = Util.loadFile(testset.url);
  const lines = res.split('\n');

  let nodes = new Set();;
  let links = new Set();;
  let times = new Set();;

  _.forEach(lines, line => {
    let elems = line.split(' ');

    if (elems[testset.n1idx].length > 0 &&
      elems[testset.n2idx].length > 0 &&
      elems[testset.tidx].length > 0 &&
      Math.random() > 0.9) {

      const from = parseInt(elems[testset.n1idx]);
      const to = parseInt(elems[testset.n2idx]);
      const time = parseInt(elems[testset.tidx]);

      nodes.add(from).add(to);
      times.add(time);
      links.add(new Link(from, to, time));
    }
  });

  return new Network(nodes, links, times);
}
