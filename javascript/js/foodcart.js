/**
 * Created by Crystal on 2017/5/10.
 */
//为兼容ie10以前浏览器重新定义document.getElementsByClassName
window.onload=function() {
    if(!document.getElementsByClassName){
        document.getElementsByClassName=function(cls){
            var ret=[];
            var els=document.getElementsByTagName("*");
            for(var i=0;i<els.length;i++){
                if(els[i].className.indexOf(cls+'')>=0
                ||els[i].className.indexOf(''+cls+'')>=0
                ||els[i].className.indexOf(''+cls)>=0){
                    ret.push(els[i]);
                }
            }return ret;
        }
    }
    var table=document.getElementById("carttable");// 购物车表格
    var seletInput=document.getElementsByClassName("check");// 所有勾选框
    var checkAllInputs = document.getElementsByClassName('check-all') // 全选框
    var tr = table.children[1].rows; //行
    var selectedTotal = document.getElementById('selectTotal'); //已选商品数目容器
    var priceTotal = document.getElementById('priceTotal'); //总计
    var seleted = document.getElementById('selected'); //
    var foot = document.getElementById('foot');//页脚部分
    var selectedViewList = document.getElementById('selectedViewList');//悬浮窗
    var deleteAll = document.getElementById('deleteAll')
    // 点击勾选框事件
    for(var i=0;i<seletInput.length;i++){
        seletInput[i].onclick=function () {
            if(this.className=="check-all check"){//如果是全选，则吧所有的选择框选中
                for(var i=0;i<seletInput.length;i++) {
                    seletInput[i].checked=this.checked;
                }
            }
            if(this.checked==false){ //只要有一个未勾选，则取消全选框的选中状态
                for(var j=0;j<checkAllInputs.length;j++){
                    checkAllInputs[j].checked=false;
                }
            }
            getTotal();
        };
    }

    // 更新总数和总价格，已选浮层
    function getTotal() {
        var seleted=0;
        var price=0;
        var htmlstr='';
        for(var i=0;i<tr.length;i++){
            if(tr[i].getElementsByTagName('input')[0].checked){
                tr[i].className='on';
                seleted+=parseInt(tr[i].getElementsByTagName('input')[1].value);
                price+=parseFloat(tr[i].cells[4].innerHTML);
                htmlstr+='<div><img src="'+tr[i].getElementsByTagName('img')[0].src+'"><span index="'+i+'" class="del">取消选择</span></div>';
            }else{
                tr[i].className=' ';
            }
        }
        selectedTotal.innerHTML=seleted;
        priceTotal.innerHTML=price.toFixed(2);
        selectedViewList.innerHTML=htmlstr;
        if(seleted==0){
            foot.className='foot';
        }
    }

    // 点击seleted框，显示悬浮窗
    seleted.onclick=function() {
        if(foot.className=='foot'){
            if(selectedTotal.innerHTML!=0){
                foot.className='foot show';
            }
        }else{
            foot.className='foot';
        }
    }

    //悬浮框图片取消选择时，勾选框勾消失
    selectedViewList.onclick=function (e) {
        console.log(e);
        e=e||window.event;
        var el=e.srcElement;
        if(el.className=='del'){
            var index=el.getAttribute("index");
            var input=tr[index].getElementsByTagName('input')[0];
            input.checked=false;
            getTotal();
        }
    }

    //遍历每一行点击事件(点击事件、键盘事件)
    for(var i=0;i<tr.length;i++){
        tr[i].onclick=function (e) {
           e=e||window.event;
           var el=e.srcElement;
            // console.log(e);
            // console.log(el);
           var cls=el.className;
           var input=this.getElementsByTagName('input')[1];
            var reduce=this.getElementsByTagName('span')[1];
           var val=parseFloat(input.value);
           switch(cls){
               case 'add':
                   input.value=val+1;
                   reduce.innerHTML="-";
                   getSubTotal(this);
                   break;
               case 'reduce':
                   if(val>1){
                       input.value=val-1;
                   }if(input.value<=1){
                       reduce.innerHTML=" ";
                   }
                   getSubTotal(this);
                   break;
               case 'delete':
                   var conf=confirm('确定要删除吗111？');
                   if(conf){
                       this.parentNode.removeChild(this);
                   }
                   break;
               default:break;
           }
           getTotal();
        }
        //遍历每一行输入框的键盘事件并计算单行和和总计和
        tr[i].getElementsByTagName('input')[1].onkeyup=function () {
            var val=parseInt(this.value);
            var tr=this.parentNode.parentNode;
            var reduce=tr.getElementsByTagName('span')[1];
            if(isNaN(val) ||val<1){
                val=1;
            }
            this.value=val;
            if(val<=1){
                reduce.innerHTML=" ";
            }else{
                reduce.innerHTML="-";
            }
            getSubTotal(this.parentNode.parentNode);
            getTotal();
        }
    }

    //计算每行总计之和
    function getSubTotal(tr) {
        var tds=tr.cells;
        var price=parseFloat(tds[2].innerHTML);
        var num=parseInt(tr.getElementsByTagName('input')[1].value);
        var total=parseFloat(price*num);
        tds[4].innerHTML=total.toFixed(2);
    }

    //全部删除功能
    deleteAll.onclick=function () {
        if(selectedTotal.innerHTML!=0){
            var conf=confirm('确定要全部删除吗？');
            if(conf){
                for(var i=0;i<tr.length;i++){
                    var input=tr[i].getElementsByTagName('input')[0];
                    if(input.checked){
                        tr[i].parentNode.removeChild(tr[i]);
                        i--;
                    }
                }
                for(var j=0;j<checkAllInputs.length;j++){
                    checkAllInputs[j].checked=false;
                }
                getTotal();
            }
        }

    }
             checkAllInputs[0].checked=true;
             checkAllInputs[0].onclick();
}