// to be run in browser debug console of input data page

var pol = document.body.getElementsByTagName("pre")[0].innerText.split("\n")[0].split('');
var ins = document.body.getElementsByTagName("pre")[0].innerText.split("\n").slice(2).slice(0,-1);
var rules = ins.map(i => i.split(' -> ')).reduce((allR, e) => { allR[e[0]]=e[1]; return allR; }, {});
var countByDepthLookup;

function count(c1, c2, counts, depth) {
  if (depth==41) {    // for part one, condition should be depth==11
    counts[c1] = counts[c1] ? counts[c1] + 1 : 1;
    return;
  }
  var tmpCounts = {};
  if (countByDepthLookup[depth] && countByDepthLookup[depth][c1+c2]) {
    tmpCounts = countByDepthLookup[depth][c1+c2];
  } else {
	count(c1, rules[c1+c2], tmpCounts, depth+1);
	count(rules[c1+c2], c2, tmpCounts, depth+1);
	if (!countByDepthLookup[depth])
	  countByDepthLookup[depth] = {};
	countByDepthLookup[depth][c1+c2] = tmpCounts;
  }
  for (t in tmpCounts) {
    counts[t] = counts[t] ? counts[t] + tmpCounts[t] : tmpCounts[t];
  }
}

countByDepthLookup = {};
var counts = {};
for (n=0; n<pol.length-1;n++) {
  count(pol[n],pol[n+1], counts, 1);
}
counts[pol[pol.length-1]]++;
  
var maxmin = Object.values(counts).sort((a,b) => a<b ? -1:1);
var max=0, min=999999999999999;
for (elt in maxmin) {
  if (maxmin[elt] < min) { min = maxmin[elt]; }
  if (maxmin[elt] > max) { max = maxmin[elt]; }
}
console.log(`Answer ${max-min}`);