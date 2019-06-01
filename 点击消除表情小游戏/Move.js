// JavaScript Document

function $( v ){
	if( typeof v === 'function' ){
		window.onload = v;
	} else if ( typeof v === 'string' ) {
		return document.getElementById(v);
	} else if ( typeof v === 'object' ) {
		return v;
	}
}

function getStyle( obj, attr ){
	return obj.currentStyle ? obj.currentStyle[attr] : getComputedStyle( obj )[attr];
}

function doMove (obj, attr, dir, target, endFn) {
	// console.log(obj);
	dir = parseInt(getStyle(obj, attr)) > target ? -dir : dir;//当前位置比目标点小的话 dir为正，否则为负
	clearInterval(obj.timer);
	obj.timer = setInterval(function(){
		var speed = parseInt(getStyle(obj, attr)) + dir;
		
		if(speed > target && dir > 0  || speed < target && dir < 0) {
			speed = target;
		}
		obj.style[attr] = speed + "px";
		if(speed == target) {
			clearInterval(obj.timer);
			endFn && endFn();
		}
	},100);
}

function opacity(obj, dir, target, endFn){
	dir = parseInt(getStyle(obj, 'opacity'))<target ? dir : -dir;
	clearInterval(obj.op);
	
	obj.op = setInterval(function(){
		var speed = parseFloat(getStyle(obj,'opacity')) + dir;
		if(speed > target&&dir>0||speed<target&&dir<0){
			speed = target;
		}
		obj.style.opacity = speed;
		onOff=true;

		if(speed == target){
			clearInterval(obj.op);
			endFn && endFn();
		}

	}, 30);

}
//抖函数
function shake(obj,attr,endFn1){
	var pos = parseInt(getStyle(obj,attr));
	var arr = [],num=0;
	for(let i = 20; i > 0; ){
		arr.push(i,-i);
		i -=2;
	}
	arr.push(0);
	if(obj.onOff){
		clearInterval(obj.shake);
		obj.shake = setInterval(function(){
			obj.onOff = false;
			obj.style[attr] = pos + arr[num] + 'px';
			num++;
			if(num === arr.length){
				clearInterval(obj.shake);
				obj.onOff = true;
				endFn1 && endFn1();
			}
		},50);
	}
	
}