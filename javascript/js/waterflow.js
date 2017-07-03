/**
 * Created by Crystal on 2017/5/12.
 */
window.onload=function () {
    waterflow("main","pin");
    var imgData={"data":[{"src":"w1.jpg"},{"src":"w2.jpg"},{"src":"w3.jpg"},{"src":"w4.jpg"},{"src":"w5.jpg"},{"src":"w1.jpg"},
        {"src":"w6.jpg"},{"src":"w7.jpg"},{"src":"w8.jpg"},{"src":"w9.jpg"},{"src":"w10.jpg"},{"src":"w11.jpg"},{"src":"w1.jpg"},]}
    window.onscroll=function () {
            if(checkFlag){
               var oParent=document.getElementById("main");
               for(var i=0;i<imgData.data.length;i++){
                   var content=document.createElement("div");
                   content.className="pin";
                   oParent.appendChild(content);
                   var div=document.createElement("div");
                   div.className="box";
                   content.appendChild(div);
                   var img=document.createElement("img");
                   img.src="img/"+imgData.data[i].src;
                   div.appendChild(img);
                   waterflow("main","pin");
                }
            }
    }
}
function checkFlag() {
    var oParent=document.getElementById("main");
    var aPin=getClassObj(oParent,"pin");
    var lastContentH=aPin[length-1].offsetTop;
    var scrollTop=document.documentElement.scrollTop||document.body.scrollTop;
    var parentH=document.documentElement.clientHeight||document.body.clientHeight;
    if(lastContentH<scrollTop+parentH){
        return true;
    }
}
function waterflow(parent,pin){
    var oParent=document.getElementById(parent);
    var aPin=getClassObj(oParent,pin);
    var iPinW=aPin[0].offsetWidth;
    var num=Math.floor(document.documentElement.clientWidth/iPinW);
    oParent.style.cssText='width:'+iPinW*num+'px;margin:0 auto;';

    var pinHArr=[];
    for(var i=0;i<aPin.length;i++){
        var pinH=aPin[i].offsetHeight;
        if(i<num){
            pinHArr[i]=pinH;
        }else{
            var minH=Math.min.apply(null,pinHArr);
            var minIndex=getMinHIndex(pinHArr,minH);
            aPin[i].style.position="absolute";
            aPin[i].style.left=aPin[minIndex].offsetLeft+"px";
            aPin[i].style.top=minH+"px";
            pinHArr[minIndex]+= aPin[i].offsetHeight;

        }
    }
}
function getClassObj(parent,className) {
    var obj=parent.getElementsByTagName("*");
    var pinS=[];
    for(var i=0;i<obj.length;i++){
        if(obj[i].className==className){
            pinS.push(obj[i]);
        }
    };
    return pinS;
}
function getMinHIndex(arr,minH) {
    for(var i in arr){
        if(arr[i]==minH){
            return i;
        }
    }
}