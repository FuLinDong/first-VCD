//3.通用函数

// 随机生成一个值   取值范围 min max 
//6.计算左右分区的范围

//4.输出所有的海报
//模板字符串：利用编写好的视图了，隐藏起来，然后使用innerHTML及其源码字符串
//关键字替换：遍历数据，从源码字符串中的数据部分替换为真是的数据
//拼接好最终的内容HTML字符串回写 ,写到.wrap
function get(docu){
	var method = (docu.substr(0,1) == '.')? 'getElementsByClassName':'getElementById';
	
	return document[method](docu.substr(1));
}
//radom 返回[min,max]中间的值、、0-data.length
function radom1(range){
	return Math.ceil(Math.random()*range);	
}
function radom2(range){
	var min = Math.min(range[0],range[1]);
	var max = Math.max(range[0],range[1]);
	var number = Math.ceil((Math.random()*(max - min) + min));
	return number;
}
//遍历数组的三个方法
function addPhotos(){
	var template = get('#wrap').innerHTML;
	var html = [];
	var nav = [];
	data.forEach(function(item,index){
		var _html = template.replace('{{index}}',index)
		                    .replace('{{img}}',item.img)
		                    .replace('{{caption}}',item.caption)
		                    .replace('{{desc}}',item.desc);
		html.unshift( _html );
		nav.push('<span class="i" id="nav_'+index+'" onclick="turn( get(\'#photo_'+index+'\') )" >&nbsp;</span>');
		          
	});
	html.push('<div class="nav">'+nav.join('')+'</div>');
	get('#wrap').innerHTML = html.join('');
	
    rsort(radom2([0,data.length]));
}
addPhotos();
//排序海报，根据一个值N，取得第N个海报，（#photo_N） 添加样式 .photo-center
// 极限位置计算，分区范围计算
//6. 左右分区范围
function range(){
	var range = { left:{ x:[], y:[] },right:{ x:[], y:[] }};
	
	var wrap_w = get("#wrap").clientWidth;
	var wrap_h = get("#wrap").clientHeight;
	var photo_w = get(".photo")[0].clientWidth;
	var photo_h = get(".photo")[0].clientHeight;
	
	range.left.x = [ 0 - photo_w, wrap_w/2 - photo_w/2];
	range.left.y = [ 0 - photo_h, wrap_h];
	range.right.x = [ wrap_w/2 + photo_w/2, wrap_w + photo_w];
	range.right.y = [0-photo_h, wrap_h];
//  var wrap = {
//  	w:get("#wrap").clientWidth,
//  	h:get("#wrap").clientHeight
//  }
//  
//  var photo = {
//  	w:get(".photo")[0].clientWidth,
//  	h:get(".photo")[0].clientHeight
//  }
//  range.wrap = wrap;
//  range.photo = photo;
//  
//  range.left.x = [ 0-photo.w, wrap.w/2-photo.w/2];
//  range.left.y = [ 0-photo.h, wrap.h];
//  
//  range.right.x = [ wrap.w/2 + photo.w/2, wrap.w + photo.w];
//  range.right.y = range.left.y;
    Object.freeze(range);
    return range;
}
//5. 海报排序
    function rsort( n ){
    	console.log(n);
    	var _photos = get(".photo");//_photos 是类数组，有length,但是不能使用forEach等Array 的方法
    	var photos = [];
    	for(var i = 0; i < _photos.length;i++){
    		_photos[i].className= _photos[i].className.replace(/\s*photo_center\s*/,' ');
    		_photos[i].className= _photos[i].className.replace(/\s*photo_front\s*/,' ');
    		_photos[i].className= _photos[i].className.replace(/\s*photo_back\s*/,' ');
    		
//  		_photos[i].className += ' photo_front';
    		_photos[i].style.left = '';
    		_photos[i].style.top = '';
      	    _photos[i].style['-webkit-transform'] = 'rotate(270deg)';
    		photos.push(_photos[i]);
    		
    	}
        var photo_center = get('#photo_'+n);
         photo_center.className += ' photo_center';
       
    	
    	// 把 photo_center 分出去，，接下来分左右
    	photos.splice(n,1);//splice改变数组，分出去photo_center
    	
    	var photo_left = photos.splice(0,Math.ceil(photos.length/2));//剩下的左边一半，
    	var photo_right = photos;//数组被分的剩下的
    	 var ranges = range();
    	 photo_left.forEach(function(item,index){
    	 	item.style['-webkit-transform'] = 'rotate('+radom2([-150,150])+'deg)';
    	 	item.style.left = radom2(ranges.left.x)+'px';
    	 	item.style.top = radom2(ranges.left.y)+'px';
    	 });
    	 photo_right.forEach(function(item,index){
    	 	item.style['-webkit-transform'] = 'rotate('+radom2([-150,150])+'deg)';
    	 	item.style.left = radom2(ranges.right.x)+'px';
    	 	item.style.top = radom2(ranges.right.y)+'px';
    	 });
    	 
    	//控制按钮排序
    	var navs = get('.i');
    	for(var s = 0; s < navs.length; s++){
    		navs[s].className = navs[s].className.replace(/\s*i_current\s*/,' ');
    		navs[s].className = navs[s].className.replace(/\s*i_back\s*/,' ');
    	}
    	get('#nav_'+n).className +=' i_current'; 
    }
//1.翻面控制
function turn(elem){
	var cla = elem.className;
	var n = elem.id.split('_')[1];
	if(!/photo_center/.test(cla)){
		return rsort(n);
	}
	if(/photo-front/.test(cla)){
		cla = cla.replace('photo-front','photo-back');
		get('#nav_'+n).className += ' i_back ';
	}else{
		cla = cla.replace('photo-back','photo-front');
		get('#nav_'+n).className = get('#nav_'+n).className.replace(/\s*i_back\s*/,' ');
	}
	
	return elem.className = cla;
}

