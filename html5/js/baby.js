/**
 * Created by Crystal on 2017/5/31.
 */
var babyObj=function ()
{
    this.x;
    this.y;
    this.angle;
    this.babyEye=new Image();
    this.babyBody=new Image();
    this.babyTail=new Image();
}
babyObj.prototype.init=function ()
{
    this.x=width*0.5-50;
    this.y=height*0.5+50;
    this.angle=0;
    this.babyEye.src="src/babyEye0.png";
    this.babyBody.src="src/babyFade0.png";
    this.babyTail.src="src/babyTail0.png";
}
babyObj.prototype.draw=function ()
{
    //lerpDistance趋向于某一点
    this.x=lerpDistance(mom.x,this.x,0.9);
    this.y=lerpDistance(mom.y,this.y,0.9);
    //角度反转
    var deltaY=mom.y-this.y;
    var deltaX=mom.x-this.x;
    // var beta=Math.atan2(deltaY,deltaX);
    var beta = Math.atan2(deltaY,deltaX)+Math.PI;//-PI PI
    this.angle=lerpAngle(beta,this.angle,0.6);
    ctx1.save();
    ctx1.translate(this.x,this.y);
    ctx1.rotate(this.angle);
    ctx1.drawImage(this.babyTail,-this.babyTail.width*0.5+23,-this.babyTail.height*0.5);
    ctx1.drawImage(this.babyBody,-this.babyBody.width*0.5,-this.babyBody.height*0.5);
    ctx1.drawImage(this.babyEye,-this.babyEye.width*0.5,-this.babyEye.height*0.5);
    ctx1.restore();
}