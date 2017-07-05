	$(document).ready(function(){
		$(".main>a").click(function(){
			var nextNode1=$(this).next("ul");
			nextNode1.toggle(3000);
		})
})