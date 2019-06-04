
	function render(obj,evt){
		var arr = [];
		var oText = obj.querySelector("#text");
		var oInp = obj.getElementsByTagName("input")[0];
		var oBox = obj.querySelector(".box");
		// var oBtn = obj.getElementsByTagName("input")[0];
		//点击插入按钮，进行相应的增添删除操作
		addEvent(oInp, evt, function(ev){
			var ev = ev || window.event;
			if(evt == "click" || (evt == "keyup" && (ev.keyCode == 13 || ev.keyCode == 32 || ev.keyCode == 229))){
				//按照非字母数字中文的其他符号分割字符串
				var reg = new RegExp('[^A-Za-z0-9\u4e00-\u9fa5]+', 'g');
				var arrWord = oText.value.trim().split(reg);
				console.log(oText);

				oText.value = "";
				// 将分割后的字符串拼接在arr后面
				arr = arr.concat(arrWord);
				if(arr.length > 10) {
					arr.splice(0, arr.length - 10);
				}
				single();
				paint();
			}
			
		});

		function single(){
			//去重
			for(let i = 0;i<arr.length;i++){
				for(let j = i+1; j < arr.length; j++){
					if(arr[i] == arr[j]){
						arr.splice(j, 1);
						j--;
					}
				}
			}
		}
		// 根据arr列表渲染小方块
		function paint(){
			oBox.style.display = 'block';
			oBox.innerHTML = "";
			for(var i = 0; i < arr.length; i++){
				oBox.innerHTML += "<div style='left:"+i*130+"px'>"+arr[i]+"</div>";
			}
			del();
		}
		// //查找arr中的元素是否等于content
		// function find(){
		// 	oBox.innerHTML = "";
		// 	for(let i = 0;i < arr.length; i++){
		// 		// var content = aInputs[2].value;
		// 		if(arr[i].indexOf(content) != -1){
		// 			arr[i] = arr[i].split(content).join('<span>'+content+'</span>');
		// 		}
		// 		oBox.innerHTML += "<div style='left:"+i*130+"px'>"+arr[i]+"</div>";
				
		// 	}
		// 	del();
			
		// }

		//点击小方块添加删除事件
		function del(){
			console.log(oBox.children);
			for(let i = 0; i < oBox.children.length; i++){

				oBox.children[i].index = i;
				addEvent(oBox.children[i], 'mouseover', function (){
					this.style.backgroundColor = "red";
					this.innerHTML = "删除" + arr[this.index];
				});
				addEvent(oBox.children[i], 'mouseout', function (){
					this.style.backgroundColor = "pink";
					this.innerHTML = arr[this.index];
				});
				addEvent(oBox.children[i], 'click', function (){
					delDiv(this.index);
				});

			}
		}
		

		//删除div
		function delDiv(n){
			arr.splice(n, 1);
			paint();
		}

		//添加事件函数
		function addEvent(ele, event, handler){
			if(ele.addEventListener) {
				ele.addEventListener(event, handler, false);
			}else if (ele.attachEvent) {
					ele.attachEvent("on" + event, handler);
			}else {
				ele["on" + event] = handler;
			}
		}
	}
