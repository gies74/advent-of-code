// to be run in browser debug console of input data page

var lines = document.body.getElementsByTagName("pre")[0].innerText.split("\n").slice(0,-1);
var nodes = {};
function includesDouble(arr) {
  return arr.length !== new Set(arr).size;
}
class Node {
  constructor(name) {
    this.name = name;
    this.large = Boolean(name.match(/^[A-Z]+$/));
    this.edges = []
  }
  findPaths(smallNodesVisited=[]) {
    var paths = [];
    if (!this.large)
	  smallNodesVisited.push(this);
    for (var e of this.edges) {
      var no = e.getOppositeNode(this);
      if (no.name === "end") {
        paths.push([no.name]);
        continue;
      }
       /// extra condition:  && includesDouble(smallNodesVisited) )
      if (no.name === "start" || !no.large && smallNodesVisited.includes(no)  /* insert extra condition for part 2 here */  ) 
        continue;
      paths = paths.concat(no.findPaths(smallNodesVisited.slice(0)));
    }
	paths.forEach(p => p.unshift(this.name));
    return paths;
  }
}
class Edge {
  constructor(n1, n2) {
    this.n1 = n1;
    this.n2 = n2;
    n1.edges.push(this);
    n2.edges.push(this);
  }
  getOppositeNode(n) {
    if (n !== this.n1 && n !== this.n2)
      throw `${n} not connected to me, ${this.n1.name}-${this.n2.name}`;
    return (n === this.n2) ? this.n1 : this.n2;
  }
}
lines.forEach(l => {
  var nnames = l.split('-');
  if (!nodes[nnames[0]]) nodes[nnames[0]] = new Node(nnames[0]);
  if (!nodes[nnames[1]]) nodes[nnames[1]] = new Node(nnames[1]);
  new Edge(nodes[nnames[0]], nodes[nnames[1]]);
});

var paths = nodes["start"].findPaths();
console.log(`Found ${paths.length} paths`);