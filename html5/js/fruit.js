/**
 * Created by Crystal on 2017/5/31.
 */
var fruitObj=function ()
{
    this.alive=[];
    this.orange=new Image();
    this.blue=new Image();
    this.x=[];
    this.y=[];
    this.l=[];
    this.spd=[];
    this.fruitType=[];
}
fruitObj.prototype.num=30;
fruitObj.prototype.init=function ()
{
    for(var i=0;i<this.num;i++){
        this.alive[i]=false;
        this.x[i]=0;
        this.y[i]=0;
        this.l[i]=0;
        this.spd[i]=Math.random()*0.01+0.005;//[0,005,0,015]
        this.fruitType[i]=" ";
        this.born(i);
    }
    this.orange.src="src/fruit.png";
    this.blue.src="src/blue.png";
};
fruitObj.prototype.born=function(i)
{
    var id=Math.floor(Math.random() * ane.num);
    this.x[i]=ane.x[id];
    this.y[i]=height-ane.y[id];
    this.l[i]=0;
    this.alive[i]=true;
    var ran=Math.random();
    ran<0.3 ? this.fruitType[i]="blue" :this.fruitType[i]="orange";

};
// function Monitor()
// {
//     var num=0;
//     for(var i=0;i<fruit.num;i++)
//     {
//         if(fruit.alive[i])
//             num++;
//     }
//     if(num<15){
//         sendFruit();
//         return;
//     }
// }
// function sendFruit()
// {
//     for(var i=0;i<fruit.num;i++) {
//         if (!fruit.alive[i]) {
//             fruit.born(i);
//             return;
//         }
//     }
// }
fruitObj.prototype.dead=function (i)
{
    this.alive[i]=false;
}
fruitObj.prototype.draw=function ()
{
    for(var i=0;i<this.num;i++)
    {
        if(this.alive[i])
        {
            if(this.fruitType[i]=="blue"){
                var pic=this.blue;
            }else{
                var pic=this.orange;
            }
            if(this.l[i]<=16)
            {
                this.l[i]+=this.spd[i]*deltaTime;
            }else{
                this.y[i]-=this.spd[i]*7*deltaTime;
            }
            ctx2.drawImage(pic,this.x[i]- this.l[i]*0.5,this.y[i]-this.l[i]*0.5,this.l[i],this.l[i]);
            if(this.y[i]<10){
                this.alive[i]=false;
                this.born(i);
            }
        }

    }
};

fruitObj.prototype.update=function ()
{

};
