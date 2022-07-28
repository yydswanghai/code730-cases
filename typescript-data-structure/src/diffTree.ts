class TreeNode {
    constructor(
        public value: any,
        public left: TreeNode | null = null,
        public right: TreeNode | null = null
    ){}
}

var A = new TreeNode('A');
var B = new TreeNode('B');
var C = new TreeNode('C');
var D = new TreeNode('D');
var E = new TreeNode('E');
var F = new TreeNode('F');
var G = new TreeNode('G');

A.left = C;
A.right = B;
C.left = F;
C.right = G;
B.left = D;
B.right = E;

var A1 = new TreeNode('A');
var B1 = new TreeNode('B');
var C1 = new TreeNode('C');
var D1 = new TreeNode('D');
var E1 = new TreeNode('E');
var F1 = new TreeNode('modify');
var G1 = new TreeNode('G');
var add = new TreeNode('add')

A1.left = C1;
A1.right = B1;
C1.left = F1;
// C1.right = G1;
B1.left = D1;
B1.right = E1;

E1.left = add;

function diffTree(root1, root2, diffList) {
    if(root1 == root2) return diffList;
    if(root1 == null && root2 != null){// 新增了节点
        diffList.push({ type: '新增', origin: null, now: root2 });
    }else if(root1 != null && root2 == null){// 删除了节点
        diffList.push({ type: '删除', origin: root1, now: null });
    }else if(root1.value != root2.value){// 相同位置的节点值不同，修改了节点
        diffList.push({ type: '修改', origin: root1, now: root2 });
        // 当前节点变了不代表其子节点也变了，还得继续向下对比
        diffTree(root1.left, root2.left, diffList);
        diffTree(root1.right, root2.right, diffList);
    }else{
        diffTree(root1.left, root2.left, diffList);
        diffTree(root1.right, root2.right, diffList);
    }
}
var diffList = [];
diffTree(A, A1, diffList);
console.log(diffList);

export default {}