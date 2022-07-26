/* 链表 */
interface INode<T>{
    value: T
    next: LinkNode<T> | null
}
class LinkNode<T> implements INode<T> {
    public next: LinkNode<T> | null = null;
    constructor(public value: T){
    }
}

var node1 = new LinkNode(1);
var node2 = new LinkNode(2);
var node3 = new LinkNode(3);
var node4 = new LinkNode(4);
var node5 = new LinkNode(5);

node1.next = node2;
node2.next = node3;
node3.next = node4;
node4.next = node5;

function bianLink<T>(root: LinkNode<T>) {
    if(root == null) return;// 出口
    console.log(root.value);
    bianLink<T>(root.next!);
}

// bianLink(node1);

function nizhi<T>(root: LinkNode<T>) {
    if(root.next?.next == null){
        (root.next as LinkNode<T>).next = root;
        return root.next;
    }else{
        var result = nizhi(root.next);
        root.next.next = root;
        root.next = null;
        return result
    }
}

bianLink(nizhi(node1))