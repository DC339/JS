window.onload = function () {
	
	
	//获取元素	
	var oUser = document.getElementById('user');
	var oReg = document.getElementById('reg');
	var oLogin = document.getElementById('login');
	var oSp = document.getElementById('userinfo');
	var oUsername1 = document.getElementById('username1');
	var oMsg = document.getElementById('verifyUserNameMsg');

	var oShowMore = document.getElementById('showMore');

	var oList = document.getElementById('list');
	var iPage = 1;

	//初始化
	updateUserStatus();
	function updateUserStatus () {
		var uid = getCookies('uid');
		var username = getCookies('username');
		if(uid){
			//如果是登录状态
			oUser.style.display = 'block';
			oReg.style.display = 'none';
			oLogin.style.display = 'none';
			oSp.innerHTML = username;
		}else {
			// alert(1);
			oUser.style.display = 'none';
			oReg.style.display = 'block';
			oLogin.style.display = 'block';
			oSp.innerHTML = '';
		}
	}  


	

	/*用户验证
	get
		guestbook/index.php
		api需要提供的参数:
			m: index
			a: verifyUserName
			username: 用户名
		返回：{
			code: 返回信息代码 0：无错  1：有错
			message: 返回的信息
		}
	*/
	//当用户名窗口失去焦点时，触发提示事件
	oUsername1.onblur = function () {
		ajax('get', 'guestbook/index.php', 'm=index&a=verifyUserName&username=' + this.value, function (data) {
			var d = JSON.parse(data);

			oMsg.innerHTML = d.message;

			if(d.code) {
				oMsg.style.color = 'red';
			}else {
				oMsg.style.color = 'green';
			}
		})
	}

	/*用户注册
	get/post
		guestbook/index.php
		api需要提供的参数:
			m: index
			a: reg
			username: 用户名
			password：密码
		返回：{
			code: 返回信息代码 0：无错  1：有错
			message: 返回的信息
		}
	*/
	var oBtnReg = document.getElementById('btnReg');
	var oPsw1 = document.getElementById('password1');
	oBtnReg.onclick = function () {
		ajax('get', 'guestbook/index.php', 'm=index&a=reg&username=' + encodeURI(oUsername1.value) + '&password=' + oPsw1.value, function(data){
			var d = JSON.parse(data);
			alert(d.message);
		});

	}

	/*用户登录
	get/post
		guestbook/index.php
		api需要提供的参数:
			m: index
			a: login
			username: 用户名
			password：密码
		返回：{
			code: 返回信息代码 0：无错  1：有错
			message: 返回的信息
		}
	*/

	var oUsername2 = document.getElementById('username2');
	var oPsw2 = document.getElementById('password2');
	var oBtnLogin = document.getElementById('btnLogin');
	oBtnLogin.onclick = function () {
		ajax('get', 'guestbook/index.php', 'm=index&a=login&username=' + encodeURI(oUsername2.value) + '&password=' + oPsw2.value, function (data) {
			var d = JSON.parse(data);
			alert(d.message);
			if(!d.code) {
				updateUserStatus();
			}
		});
	}

	/*用户退出
	get/post
		guestbook/index.php
		api需要提供的参数:
			m: index
			a: logout
		返回：{
			code: 返回信息代码 0：无错  1：有错
			message: 返回的信息
		}
	*/
	var oLogout = document.getElementById('logout');
	oLogout.onclick = function () {
		ajax ('get', 'guestbook/index.php', 'm=index&a=logout', function (data) {
			var d = JSON.parse(data);
			alert(d.message);

			if(!d.code) {
				updateUserStatus();
			}
		});
		return false;
	}
	//初始化留言列表
	showList();
	
	/*留言
	post
		guestbook/index.php
		api需要提供的参数:
			m: index
			a: send
			content: 留言内容
		返回：{
			code: 返回信息代码 0：无错  1：有错
			data: 成功留言的详细信息
				{
					cid: 留言id
					content: 留言内容
					uid: 留言人的id
					username: 留言人的名称
					dateline：留言的时间
					support: 当前这条留言的订的数量
					oppose： 当前这条留言的踩的数量
				}
			message: 返回的信息
		}
	*/
	var oContent = document.getElementById('content');
	var oBtnPost = document.getElementById('btnPost');
	oBtnPost.onclick = function () {
		ajax ('post', 'guestbook/index.php', 'm=index&a=send&content=' + encodeURI(oContent.value), function (data) {
			var d = JSON.parse(data);
			alert(d.message);

			if(!d.code) {
				createList(d.data, true);
			}

		});
	}


	function createList(data, insert) {
		//创建一个dl存放留言内容
		var oDl = document.createElement('dl');

		//创建一个dt存放用户名
		var oDt = document.createElement('dt');
		var oStrong = document.createElement('strong');
		oStrong.innerHTML = data.username;
		oDt.appendChild(oStrong);

		//创建dd存放留言内容
		var oDd1 = document.createElement('dd');
		oDd1.innerHTML = data.content;

		//创建另一个dd存放两个a标签，分别为顶和踩
		var oDd2 = document.createElement('dd');
		oDd2.className = 't';
		var oA1 = document.createElement('a');
		oA1.href = '#';
		oA1.innerHTML = '顶(<span>' + data.support + '</span>)';
		var oA2 = document.createElement('a');
		oA2.href = '#';
		oA2.innerHTML = '踩(<span>' + data.oppose + '</span>)';
		oDd2.appendChild(oA1);
		oDd2.appendChild(oA2);

		oDl.appendChild(oDt);
		oDl.appendChild(oDd1);
		oDl.appendChild(oDd2);

		if( insert && oList.children[0]) {
			oList.insertBefore(oDl, oList.children[0]);
		}else {
			oList.appendChild(oDl);
		}

	}
	//showMore
	oShowMore.onclick = function () {
		iPage++;
		showList();
		return false;
	}
	function showList() {
		/*初始化留言列表
		get
			guestbook/index.php
			api需要提供的参数:
				m: index
				a: getList
				page: 获取留言的页码，默认为1
				n: 每页显示的条数。默认为10
			返回：{
				code: 返回信息代码 0：无错  1：有错
				data: 成功留言的详细信息
					{
						cid: 留言id
						content: 留言内容
						uid: 留言人的id
						username: 留言人的名称
						dateline：留言的时间
						support: 当前这条留言的订的数量
						oppose： 当前这条留言的踩的数量
					}
				message: 返回的信息
			}
		*/
		ajax ('get', 'guestbook/index.php', 'm=index&n=10&a=getList&page=' +iPage, function (data) {
			var d = JSON.parse(data);
			var data = d.data;

			if(data) {
				for(var i=0;i<data.list.length;i++) {
					createList(data.list[i]);
				}
			}else {
				if(iPage == 1) {
					oList.innerHTML = '现在还没有留言，快来抢沙发...';
				}
				oShowMore.style.display = 'none';
			}

		});
	}


}

function getCookies (key) {
	// alert(document.cookie);
	var arr1 = document.cookie.split('; ');//注意;后面的空格
	for (var i = 0; i < arr1.length; i++) {
		var arr2 = arr1[i].split('=');
		if(arr2[0] == key) {
			return arr2[1];
		}
	}
}