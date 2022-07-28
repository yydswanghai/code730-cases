class ChartNode {
    constructor(
        public value: any,// 点的值
        public neighbor: ChartNode[] = [],// 与该点的连接的点
    ){}
}

const A = new ChartNode('A');
const B = new ChartNode('B');
const C = new ChartNode('C');
const D = new ChartNode('D');
const E = new ChartNode('E');

A.neighbor.push(B);
A.neighbor.push(C);
B.neighbor.push(A);
B.neighbor.push(C);
B.neighbor.push(D);
C.neighbor.push(A);
C.neighbor.push(B);
C.neighbor.push(D);
D.neighbor.push(B);
D.neighbor.push(C);
D.neighbor.push(E);
E.neighbor.push(D);

/**
 * @param node 当前节点
 * @param target 搜索的目标
 * @param paths 走过的路径数组
 */
function bfs(nodes: ChartNode[], target: any, paths: ChartNode[]) {
    if(nodes == null || nodes.length == 0) return false;
    let childs: any[] = [];
    for (let i = 0; i < nodes.length; i++) {
        if(paths.includes(nodes[i])) continue;
        paths.push(nodes[i]);
        if(nodes[i].value == target){
            return true;
        }else{
            childs = childs.concat(nodes[i].neighbor);
        }
    }
    return bfs(childs, target, paths);
}

console.log(bfs([B], 'C', []));// true
console.log(bfs([B, C], 'N', []));// false