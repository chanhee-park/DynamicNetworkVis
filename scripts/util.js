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
  }

}

/**
 * 테스트 데이터를 불러온다.
 * from './dataset/copresence-InVS13/copresence-InVS13.edges'
 */
function getTestData () {
  const res = Util.loadFile(Data.testset);
  const lines = res.split('\n');

  let nodes = new Set();;
  let links = new Set();;
  let times = new Set();;

  _.forEach(lines, line => {
    let elems = line.split(' ');
    if (elems[0].length > 0
      && elems[1].length > 0
      && elems[2].length > 0
      && Math.random() > 0) {

      const from = parseInt(elems[0]);
      const to = parseInt(elems[1]);
      const time = parseInt(elems[2]);

      nodes.add(from).add(to);
      times.add(time);
      links.add(new Link(from, to, time));
    }
  });

  return new Network(nodes, links, times);
}
