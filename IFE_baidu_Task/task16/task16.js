window.onload = function () {
	/**
 * aqiData，存储用户输入的空气指数数据
 * 示例格式：
 * aqiData = {
 *    "北京": 90,
 *    "上海": 40
 * };
 */
var aqiData = {}; //aqiData为一个对象，对象添加属性为aqiData["属性名"]=属性值
var oTable = document.getElementById('aqi-table');

/**
 * 从用户输入中获取数据，向aqiData中增加一条数据
 * 然后渲染aqi-list列表，增加新增的数据
 */
function addAqiData() {
	var oStrCity = document.getElementById('aqi-city-input').value.trim();
	var oNum = document.getElementById('aqi-value-input').value.trim();
	// var oStrCity = oStrCity.valuetrim
	if (!oStrCity.match(/^[\u4e00-\u9fa5a-zA-Z]+$/)){
		alert("城市名字必须为中英文字符！");
		return ;
	}
	if(!oNum.match(/^\d+$/)) {
		alert("空气质量指数必须为整数！");
		return ;
	}
	aqiData[oStrCity] = parseInt(oNum);	

	console.log(aqiData);

	
}

/**
 * 渲染aqi-table表格
 */
function renderAqiList() {
	//获取对象的属性名
	var arr = Object.keys(aqiData);
	//获取对象的属性值
	var arr1 = Object.values(aqiData);
	var html = "<tr><td>城市</td><td>空气质量</td><td>操作</td></tr>";
	for(var i = 0; i < arr.length; i++) {
		html += "<tr><td>" +arr[i]+ "</td><td>" + arr1[i] + "</td><td><button>删除</button></td></tr>";
	}
	oTable.innerHTML = html;
}

/**
 * 点击add-btn时的处理逻辑
 * 获取用户输入，更新数据，并进行页面呈现的更新
 */
function addBtnHandle() {
  addAqiData();
  renderAqiList();
}

/**
 * 点击各个删除按钮的时候的处理逻辑
 * 获取哪个城市数据被删，删除数据，更新表格显示
 */
function delBtnHandle(e) {
  var oCity = e.target.parentNode.parentNode.firstChild.innerHTML;
  // console.log(oCity);
  delete aqiData[oCity];
  
  renderAqiList();
}

function init() {
  var oButton = document.getElementsByTagName('button');
  var oBtn = document.getElementById('add-btn');
  // 在这下面给add-btn绑定一个点击事件，点击时触发addBtnHandle函数
  addEvent(oBtn, 'click', addBtnHandle);
  // 想办法给aqi-table中的所有删除按钮绑定事件，触发delBtnHandle函数
  addEvent(oTable, 'click', delBtnHandle);
}

init();

//绑定事件 兼容
function addEvent(elm, type, handler) {
	if(!elm) return ;
	if(elm.addEventListener) {

		return elm.addEventListener(type, handler, false);
	}else if(elm.attackEvent) {
		return elm.attackEvent('on' +type, function () {handler.apply(elm)});
		
	}
}

}