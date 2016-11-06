// let bitcoins transactions paint a picture
getCurrentBlock();
function getCurrentBlock() {
    $.getJSON('http://btc.blockr.io/api/v1/block/info/last').done(determineDisplayedBlock);
}

var currentBlock;
var displayedBlock = 0;

function determineDisplayedBlock(block) {
    currentBlock = block.data.hash;
    if (currentBlock != displayedBlock) {
        displayedBlock = currentBlock;
        prepareCanvas();
        getCurrentTransactions();
    }
    setTimeout(getCurrentBlock, 60000);
}

function getCurrentTransactions () {
    $.getJSON('https://btc.blockr.io/api/v1/block/txs/last').done(runTransactions);
}

var context;
function prepareCanvas() {
    context = document.getElementById('canvas').getContext('2d');
    context.canvas.width  = window.innerWidth;
    context.canvas.height = window.innerHeight;
    var backgroundColor = '#' + currentBlock.slice(-6);
    $('#canvas').css({'background-color': backgroundColor});
}

function runTransactions(block) {
    var i = 0;
    currentBlock = block.data.hash;
    sendTransactions();
    function sendTransactions() {
        i += 1;
        prepare(block.data.txs[i]);
        setTimeout(sendTransactions, 500);
    }
}

function prepare(transaction) {
    var sender = transaction.trade.vins[0].address.replace(/\D/g,'');
    var receiver = transaction.trade.vouts[0].address.replace(/\D/g,'');
    var x = sender % window.innerWidth;
    var y = receiver % window.innerHeight;
    var fee = transaction.fee.replace(/[0]|[.]/g, ''); // fee determines where to start on tx hash
    var dif = fee % 21; // since 21 million characters in numerous will determine initial digit
    var difPlus = dif + 6;
    var code = transaction.tx.slice(dif, difPlus); //get six digits from hex for color coude
    var color = '#' + code;
    var amount = Math.abs(transaction.trade.vins[0].amount);
    if (amount < 1) {
        amount = amount * 100;
    }
    if (amount > 80) {
        amount = amount / 10;
    }
    draw();

    function draw () {
        context.fillStyle = color;
        context.beginPath();
        context.arc(x, y, amount, 0, 2*Math.PI);
        context.fill();
    }
    //console.log('x: ' + x +' y: ' + y + ' amount: ' + amount + ' color: '+ color + ' fee: ' + fee);
}
