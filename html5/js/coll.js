/**
 * Created by Crystal on 2017/5/31.
 */
function coll()
{
    for(var i=0;i<fruit.num;i++){
        if(fruit.alive[i]){
            var dis=calLength2(fruit.x[i],fruit.y[i],mom.x,mom.y);
            if(dis<900)
            {
                fruit.dead(i);
            }
        }
    }
}