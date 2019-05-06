function ajax (method, url, data, success) {
	var xhr = null;
	try {
		xhr = new XMLHttpRequest();
	} catch (e) {
		xhr = new ActiveXObject('Microsoft.XMLHTTP');
	}
	//open
	if(method == 'get') {
		url += '?' + data;
	}
	xhr.open(method, url, true);
	//send
	if(method == 'post') {
		xhr.setRequestHeader('content-type', 'apllication/x-www-form-urlencoded');
		xhr.send(data);
	}else {
		xhr.send();
	}
	//响应
	xhr.onreadystatechange = function () {
		if(xhr.readyState == 4){
			if(xhr.status == 200) {
				success && success(xhr.responseText);
			}else {
				alert('出错了,Err:' + xhr.status);
			}
		}
	}
}