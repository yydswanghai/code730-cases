class TreeNode {
    constructor(
        public value: any,
        public childs: TreeNode[] = [],
    ){}
}

const A = new TreeNode('A');
const B = new TreeNode('B');
const C = new TreeNode('C');
const D = new TreeNode('D');
const E = new TreeNode('E');
const F = new TreeNode('F');

A.childs.push(C);
A.childs.push(F);
A.childs.push(B);
B.childs.push(D);
B.childs.push(E);

function deepSearch(root: TreeNode, target: any) {
    if(root == null) return false;
    if(root.value == target) return true;
    let result = false;
    for (let i = 0; i < root.childs.length; i++) {
        result = deepSearch(root.childs[i], target) || result;
    }
    return result ? true : false;
}

console.log(deepSearch(A, 'D'));
console.log(deepSearch(A, 'H'));

export default {}