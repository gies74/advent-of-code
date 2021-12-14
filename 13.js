// to be run in browser debug console of input data page

var lines = document.body.getElementsByTagName("pre")[0].innerText.split("\n").slice(0,743);
function fold(x,y) {
  if (x > 0) {
    for (j=0; j<-1*y; j++) {
      for (i=0; i<x; i++) {
        paper[j][i] = (paper[j][i]==1 || paper[j][2*x - i]==1) ? 1 : 0;
      }
	  paper[j].length = x;
    }
  }
  if (y > 0) {
    for (j=0; j<y; j++) {
      for (i=0; i<-1*x; i++) {
        paper[j][i] = (paper[j][i]==1 || paper[2*y - j][i]==1) ? 1 : 0;
      }
    }
	paper.length = y;
  }
  console.log(`Paper currently has ${paper.flat().reduce((cum, e) => cum+e, 0)} dots`);
}

var folds = [655,447,327,223,163,111,81,55,40,27,13,6];
var dimY = 2*folds[1], dimX = 2*folds[0];

var paper = Array(dimY);
for(i=0;i<=dimY;i++) paper[i] = Array(dimX).fill(0);
lines.forEach(l => { 
  var coord =  l.split(',');
  paper[parseInt(coord[1])][parseInt(coord[0])] = 1;
});
// first 10 folds alternate, first along x (vertical) then y (horizontal)
for (var f=0; f<5; f++) {
  fold(folds[2*f], -1 * (f>0 ? folds[2*f-1] : dimY+1));
  fold(-1 * folds[2*f], folds[2*f+1]);
}
// last 2 folds only along y
fold(-1 * folds[8], folds[10]);
fold(-1 * folds[8], folds[11]);

paper.forEach(l => console.log(l.map(c => c==0 ? ' ' : '#').join('') + "\n"));
