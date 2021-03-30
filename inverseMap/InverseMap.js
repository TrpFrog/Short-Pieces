const mapConfig = {
    xl: 127.5,
    xr: 147.5,
    yu: 48.3,
    yd: 28.3,

    w: 120,
    h: 120,
}

const LoLa2XY = (lo, la) => {
    const x = (la - mapConfig.xl) / (mapConfig.xr - mapConfig.xl) * mapConfig.w;
    const y = -(lo - mapConfig.yu) / (mapConfig.yu - mapConfig.yd) * mapConfig.h;
    return {
        x: Math.round(x),
        y: Math.round(y),
    }
}

const hubenysFormula = (x1, y1, x2, y2) => {
    const dx = (x2 - x1) / 180.0 * Math.PI;
    const dy = (y2 - y1) / 180.0 * Math.PI;
    const p  = (x1 + x2) / 2.0;
    const rx = 6378137.000; // 赤道半径[m]
    const ry = 6356752.314245; // 極半径[m]
    const e  = Math.sqrt(1 - (ry * ry) / (rx * rx)); // 離心率
    const w  = Math.sqrt(1 - e * e * Math.sin(p));
    const n  = rx / w; // 子午線曲率半径
    const m  = rx * (1 - e * e) / (w * w * w); // 卯酉線曲率半径
    return Math.sqrt(Math.pow(dy * m, 2) + Math.pow(dx * n * Math.cos(p), 2));
}

const XY2LoLa = (X, Y) => {
    const binarySearch = (f) => {
        let l = -500.0, r = 500.0;
        const eps = 0.00001;
        while(r - l > eps) {
            let mid = (l + r) / 2;
            if(f(mid)) {
                r = mid;
            } else {
                l = mid;
            }
        }
        return l;
    }
    
    const x = Math.floor(X);
    const y = Math.floor(Y);
    const isOddX = Math.round(X * 2) % 2 == 1;
    const isOddY = Math.round(Y * 2) % 2 == 1;
    
    const xFirst = binarySearch((mid) => LoLa2XY(mid, 0).y < y + 1 + (isOddY ? 1 : 0));
    const xLast  = binarySearch((mid) => LoLa2XY(mid, 0).y < y);
    const yFirst = binarySearch((mid) => LoLa2XY(0, mid).x >= x);
    const yLast  = binarySearch((mid) => LoLa2XY(0, mid).x >= x + 1 + (isOddX ? 1 : 0));

    console.log(xFirst);
    console.log(yFirst);
    console.log(xLast);
    console.log(yLast);
    return {
        lo: (xFirst + xLast) / 2,
        la: (yFirst + yLast) / 2,
        d: hubenysFormula(xFirst, yFirst, xLast, yLast)
    };
}

function loadingImage(files) {
    let img = new Image();
    let reader = new FileReader();
    reader.onload = e => img.src = e.target.result;
    img.onload = () => {
        document.getElementById('warning').innerHTML = '';
        let width = img.width;
        let height = img.height;
        if(width != 120 || height != 120) {
            document.getElementById('warning').innerHTML 
            = 'この画像には対応していません！' +
            '120*120のJPEG画像を使用してください。';
            return;
        }
        let canvas = document.getElementById('canvas');
        canvas.width = width;
        canvas.height = height;
        let context = canvas.getContext("2d");
        context.drawImage(img, 0, 0);
        view();
    };
    reader.readAsDataURL(files[0]);
}

function getRedPointXY(imageData, context) {
    const width = imageData.width;
    const height = imageData.height;

    let x_first = width,  // INF
        x_last  = 0, 
        y_first = height, // INF
        y_last  = 0;

    for(let y = 0; y < height; y++) {
        for(let x = 0; x < width; x++) {

            let pixel = context.getImageData(x, y, 1, 1).data;

            if(pixel[0] > 100 && pixel[1] < 100) {
                x_first = Math.min(x, x_first);
                x_last  = Math.max(x, x_last);
                y_first = Math.min(y, y_first);
                y_last  = Math.max(y, y_last);
            }
        }
    }
    
    const resX = (x_first + x_last) / 2.0;
    const resY = (y_first + y_last) / 2.0;
    console.log('x = ' +  resX + ', y = ' + resY);

    return {x: resX, y: resY};
}

function calc() {
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
    
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const pointXY = getRedPointXY(imageData, context);
    const x = pointXY.x;
    const y = pointXY.y;

    const res = XY2LoLa(x, y);
    return {
        lo: res.lo,
        la: res.la,
        d: res.d
    };
}

function copyToClipboard(text) {
    let copyFrom = document.createElement("textarea");
    copyFrom.textContent = text;
    let bodyElm = document.getElementsByTagName("body")[0];
    bodyElm.appendChild(copyFrom);
    copyFrom.select();
    document.execCommand('copy');
    bodyElm.removeChild(copyFrom);
}

function view() {
    let res = calc();
    document.getElementById('lo').innerHTML = res.lo.toFixed(4);
    document.getElementById('la').innerHTML = res.la.toFixed(4);
    document.getElementById('distance').innerHTML = '約 ' + Math.round(res.d / 1000) + ' km';
    const copyText = res.lo.toFixed(4) + ', ' + res.la.toFixed(4);
    const button = '<input type="button" onclick="copyToClipboard(\'' + copyText + '\')" value="Copy">'
    document.getElementById('to_search').innerHTML = copyText + ' ' + button;
}
