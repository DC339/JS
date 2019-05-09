window.onload = function () {
/**
 * Created by hansneil on 21/3/16.
 */
/* 数据格式演示
 var aqiSourceData = {
 "北京": {
 "2016-01-01": 10,
 "2016-01-02": 10,
 "2016-01-03": 10,
 "2016-01-04": 10
 }
 };
 */

// 以下两个函数用于随机模拟生成测试数据
function getDateStr(dat) {
    var y = dat.getFullYear();
    var m = dat.getMonth() + 1;
    m = m < 10 ? '0' + m : m;
    var d = dat.getDate();
    d = d < 10 ? '0' + d : d;
    return y + '-' + m + '-' + d;
}
function randomBuildData(seed) {
    var returnData = {};
    var dat = new Date("2016-01-01");
    var datStr = '';
    for (var i = 1; i < 92; i++) {
        datStr = getDateStr(dat);
        returnData[datStr] = Math.ceil(Math.random() * seed);
        dat.setDate(dat.getDate() + 1);
    }
    return returnData;
}

var aqiSourceData = {
    "北京": randomBuildData(500),
    "上海": randomBuildData(300),
    "广州": randomBuildData(200),
    "深圳": randomBuildData(100),
    "成都": randomBuildData(300),
    "西安": randomBuildData(500),
    "福州": randomBuildData(100),
    "厦门": randomBuildData(100),
    "沈阳": randomBuildData(500)
};

var colors = ['#16324a', '#24385e', '#393f65', '#4e4a67', '#5a4563', '#b38e95',
              '#edae9e', '#c1b9c2', '#bec3cb', '#9ea7bb', '#99b4ce', '#d7f0f8'];

// 用于渲染图表的数据
var chartData = {};

// 记录当前页面的表单选项
var pageState = {
    nowSelectCity: -1,
    nowGraTime: "day"
}

//存储obj的宽，left值和offsetLeft值
function getWidth(width, len) {
    var posObj = {};
    posObj.width = Math.floor(width / (len*2));
    posObj.left = Math.floor(width / len);
    posObj.offsetLeft = (width - posObj.left * (len - 1) - posObj.width) / 2;    //posObj.offsetLeft = width / 2;
    return posObj;
}

function getHintLfeft(posObj, i){
    if (posObj.left * i + posObj.offsetLeft + posObj.width / 2 - 60 <= 0) {
        return 5;
    } else if (posObj.left * i + posObj.offsetLeft + posObj.width / 2 + 60 >= 1200) {
        return (posObj.left * i + posObj.offsetLeft + posObj.width / 2 - 110);
    } else  {
        return (posObj.left * i + posObj.offsetLeft + posObj.width / 2 - 60);
    }
}

function getTitle() {
    switch (pageState.nowGraTime) {
        case "day":
            return "每日";
        case "week":
            return "周平均";
        case "month":
            return "月平均";
    }
}

/**
 * addEventHandler方法
 * 跨浏览器实现事件绑定
 */
function addEventHandler(ele, event, hanlder) {
    if (ele.addEventListener) {
        ele.addEventListener(event, hanlder, false);
    } else if (ele.attachEvent) {
        ele.attachEvent("on"+event, hanlder);
    } else  {
        ele["on" + event] = hanlder;
    }
}

/**
 * 渲染图表
 */
function renderChart() {
    var innerHTML = "", i = 0;
    var wrapper = document.getElementById("aqi-chart-wrap");
    var width = wrapper.clientWidth;
    var selectedData = chartData[pageState.nowGraTime][pageState.nowSelectCity];
    // console.log(selectedData);
    var len = Object.keys(selectedData).length;    //日（91） 或者 月（3） 或者 周（一共的周的数据长度）的数据长度    
    var posObj = getWidth(width, len);
    innerHTML += "<div class='title'>" + pageState.nowSelectCity + "市01-03月"+ getTitle() +"空气质量报告</div>"
    for (var key in selectedData) {
        innerHTML += "<div class='aqi-bar " + pageState.nowGraTime + "' style='height:" + selectedData[key] + "px; width: " 
            + posObj.width +"px; left:" + (posObj.left * i + posObj.offsetLeft) + "px; background-color:" + colors[Math.floor(Math.random() * 11)] + "'></div>";

        innerHTML += "<div class='aqi-hint' style='bottom: " + (selectedData[key] + 10) + "px; left:" + getHintLfeft(posObj, i++) + "px'>" 
            + key + "<br/> [AQI]: " + selectedData[key] + "</div>";
    }
    wrapper.innerHTML = innerHTML;
}

/**
 * 日、周、月的radio事件点击时的处理函数
 */
function graTimeChange(radio) {
    // 确定是否选项发生了变化
    var value = radio.value;
    var item = radio.previousElementSibling;
    var items = document.getElementsByTagName('span');
    for (var i = 0; i < items.length; i++) {
        items[i].className = "";
    }
    item.className = "selected";
    if (value !== pageState.nowGraTime) {
        // 设置对应数据
        pageState.nowGraTime = value;
        // 调用图表渲染函数
        renderChart();
    }
}

/**
 * select发生变化时的处理函数
 */
function citySelectChange() {
    // 确定是否选项发生了变化
    var city = this.value;
    if (city !== pageState.nowSelectCity) {
        // 设置对应数据
        pageState.nowSelectCity = city;
        // 调用图表渲染函数
        renderChart();
    }
}

/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */
function initGraTimeForm() {
    var radio = document.getElementsByName('gra-time');
    for (var i = 0; i < radio.length; i++) {
        (function (m) {
            addEventHandler(radio[m], 'click', function () {
                // console.log(radio[m]);
                graTimeChange(radio[m])
            })
        })(i);
    }
    addEventHandler(document, 'mouseover', function(event){
        var ele = event.target;
        ele.className += " show";
    });
    addEventHandler(document, 'mouseout', function(event){
        var ele = event.target;
        ele.className = ele.className.replace(/show/, "");
    });
}

/**
 * 初始化城市Select下拉选择框中的选项
 */
function initCitySelector() {
    // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项
    var select = document.getElementById("city-select");
    var cityArr = Object.getOwnPropertyNames(aqiSourceData);
    var htmlArr = cityArr.map(function(item) {
        return "<option>" + item + "</option>";
    });
    pageState.nowSelectCity = cityArr[0];
    select.innerHTML = htmlArr.join("");
    // 给select设置事件，当选项发生变化时调用函数citySelectChange
    addEventHandler(select, 'change', citySelectChange);

}

/**
 * 初始化图表需要的数据格式
 */
function initAqiChartData() {
    // 将原始的源数据处理成图表需要的数据格式
    var week = {}, count = 0, singleWeek = {},
        month = {}, mcount = 0, singleMonth = {};

    for (var key in aqiSourceData) {

        var tempCity = aqiSourceData[key];  //返回aqiSourceData下每个属性对应的值，即每个城市所对应的数据 形式为： {日期： aqi数值, ...}
        // console.log(tempCity);
        var keyArr = Object.getOwnPropertyNames(tempCity);    //获取每个城市对应的属性值中的每个属性名，即日期，长度为91,形式为： {日期1， 日期2， ...}
        // console.log(keyArr.length);

        var tempMonth = keyArr[0].slice(5, 7);    //获取月份
        // console.log(tempMonth);
        var weekInit = 4, weekCount = 0;
        for (var i = 0; i < keyArr.length; i++, weekInit++) {    //keyArr.length = 91  
            count += tempCity[keyArr[i]];     //keyArr[0]:2016-01-01  tempCity[keyArr[0]]: 对应的aqi数值
            mcount += tempCity[keyArr[i]];
            weekCount++;
            //第一个if：判断： 是否进入下一周||是否遍历完所有数据||是否下一个月
            //若已到周日||已遍历完所有数据||已经进入下一个月，则执行语句
            if ((weekInit+1) % 7 == 0 || i == keyArr.length - 1 || keyArr[i+1].slice(5, 7) !== tempMonth) {
                var tempKey = keyArr[i].slice(0, 7) + "月第" + (Math.floor(weekInit / 7) + 1) + "周";
                singleWeek[tempKey] = Math.floor(count / weekCount);    //取平均数

                //判断 i未遍历完所有数据 及 后一天的月份不为当前月
                //若已进入下月份则，确定每月第1日是星期几
                if (i != keyArr.length - 1 && keyArr[i+1].slice(5, 7) !== tempMonth) {
                    weekInit = weekCount % 7;
                }
                //进入下周时，所需要的处理参数
                count = 0;
                weekCount = 0;
                //当i遍历完或者进入下一个月时，进入语句体   
                if (i == keyArr.length - 1 || keyArr[i+1].slice(5, 7) !== tempMonth) {
                    tempMonth = (i == keyArr.length - 1) ? keyArr[i].slice(5, 7) : keyArr[i+1].slice(5, 7);
                    var tempMKey = keyArr[i].slice(0, 7);
                    var tempDays = keyArr[i].slice(-2);
                    singleMonth[tempMKey] = Math.floor(mcount / tempDays);
                    mcount = 0;
                }
            }
        }
        week[key] = singleWeek;
        month[key] = singleMonth;
        singleWeek = {};
        singleMonth = {};
    }
    // 处理好的数据存到 chartData 中
    chartData.day = aqiSourceData;
    chartData.week = week;
    chartData.month = month;
    renderChart();
}
/**
 * 初始化函数
 */
function init() {
    initGraTimeForm();
    initCitySelector();
    initAqiChartData();
}

init();
}

