// let bitcoins transactions paint a picture
getCurrentBlock();
function getCurrentBlock() {
    $.getJSON('http://btc.blockr.io/api/v1/block/info/last').done(determineDisplayedBlock);
}

var currentBlock;
var displayedBlock = 0;
var backgroundColor;
function determineDisplayedBlock(block) {
    currentBlock = block.data.hash;
    backgroundColor = '#' + currentBlock.slice(-6);
    if (currentBlock != displayedBlock) {
        displayedBlock = currentBlock;
        getCurrentTransactions();
    }
    setTimeout(getCurrentBlock, 60000);
}

function getCurrentTransactions () {
    $.getJSON('https://btc.blockr.io/api/v1/block/txs/last').done(runTransactions);
}



var circles;
var svg = d3.select("body")
        .append("svg")
        .attr("width", window.innerWidth)
        .attr("height", window.innerHeight)
        .style("background-color", backgroundColor);

var allTrans = [];
var z = 0;
function prepare(transaction) {
    var obj = {};
    obj.count = z;
    z +=1;
    var sender = transaction.trade.vins[0].address.replace(/\D/g,'');
    var receiver = transaction.trade.vouts[0].address.replace(/\D/g,'');
    obj.x = sender % window.innerWidth;
    obj.y = receiver % window.innerHeight;
    var fee = transaction.fee.replace(/[0]|[.]/g, ''); // fee determines where to start on tx hash
    var dif = fee % 21; // since 21 million characters in numerous will determine initial digit
    var difPlus = dif + 6;
    var code = transaction.tx.slice(dif, difPlus); //get six digits from hex for color coude
    obj.color = '#' + code;
    var amount = Math.abs(transaction.trade.vins[0].amount);
    if (amount < 1) {
        amount = amount * 100;
    }
    if (amount > 80) {
        amount = amount / 10;
    }
    obj.amount = amount;
    // draw();
    allTrans.push(obj);
    // console.log(circles);

    function draw () {
        // context.fillStyle = color;
        // context.beginPath();
        // context.arc(x, y, amount, 0, 2*Math.PI);
        // context.fill();

    }
    //console.log('x: ' + x +' y: ' + y + ' amount: ' + amount + ' color: '+ color + ' fee: ' + fee);
}

// var transactionsArray;
function runTransactions(block) {
    console.log(block);
    // transactionsArray = block.data.txs;
    currentBlock = block.data.hash;
    // prepare(transactionsArray)
    for (var i = 1; i <block.data.txs.length; i++) {
        prepare(block.data.txs[i]);
    }
    prepareArea();

}

function prepareArea() {
    // context = document.getElementById('canvas').getContext('2d');
    // context.canvas.width  = window.innerWidth;
    // context.canvas.height = window.innerHeight;

    console.log(allTrans);
    // var test = [1,2,3,4,5];
    circles = d3.select("svg").selectAll("circle")
                .data(allTrans)
                .enter()
                .append("circle");

    svg.style("background-color", backgroundColor);

    circles.attr('cx', function(d) {
                return d.x;
            })
            .attr('cy', function(d){
                return d.y;
            })
            .attr('r', function(d){
                return d.amount;
            })
            .attr('fill', function(d){
                return d.color;
            });
    console.log(allTrans[1].x);
    console.log(circles);

    // $('#canvas').css({'background-color': backgroundColor});
}
