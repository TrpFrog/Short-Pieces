function hasInverseMatrix(matrix){
	return getDet(matrix)!=0
}

function getInverseMatrix(matrix){
	let det = getDet(matrix);

  //逆行列の初期化
  let inverse = new Array(3);
  for(i=0;i<inverse.length;i++){
   	inverse[i] = new Array(3).fill(0);
  }

  for(let i=0;i<3;i++){
		for(let j=0;j<3;j++){
 			inverse[i][j] = getCofactor(i,j,matrix);
    }
  }
  inverse = transpose(inverse);
	multiply(det,matrix)
  return inverse;
}

function createMatrix(aa,ab,ac,ba,bb,bc,ca,cb,cc){
	return [[aa, ab, ac],
    			[ba, bb, bc],
    			[ca, cb, cc]];
}

function multiply(scalar,matrix){
  for(let i=0;i<matrix.length;i++){
		for(let j=0;j<matrix.length;j++){
 			matrix[i][j] *= scalar;
    }
  }
  return matrix;
}

function getCofactor(i,j,matrix){
	let elements = [0,0,0,0];
  let x = 0; //カウンタ

  for(let p=0;p<3;p++){
    if (p==i) continue;
		for(let q=0;q<3;q++){
 			if (q==j) continue;
      elements[x] = matrix[p][q];
      x++;
    }
  }
  matrix =  [[elements[0],elements[1]],
    			[elements[2],elements[3]]];

	return getDet(matrix)*((i+j)%2==0 ? 1 : -1);
}

function transpose(matrix){
  //2次元配列の初期化
  let transposed = new Array(matrix.length);
  for(i=0;i<transposed.length;i++){
    transposed[i] = new Array(matrix.length).fill(0);
  }
  //転置
 	for(let i=0;i<3;i++){
		for(let j=0;j<3;j++){
      transposed[i][j] = matrix[j][i];
    }
  }
  return transposed;
}

function getDet(matrix){
  if(matrix.length==3){
    let det = 0;
    det += matrix[0][0]*matrix[1][1]*matrix[2][2];
    det += matrix[1][0]*matrix[2][1]*matrix[0][2];
    det += matrix[0][1]*matrix[1][2]*matrix[2][0];
    det -= matrix[2][0]*matrix[1][1]*matrix[0][2];
    det -= matrix[0][0]*matrix[1][2]*matrix[2][1];
    det -= matrix[0][1]*matrix[1][0]*matrix[2][2];
    return det;
  }else if(matrix.length==2){
    let det = 0;
    det += matrix[0][0]*matrix[1][1];
    det -= matrix[0][1]*matrix[1][0];
    return det;
  }
}
