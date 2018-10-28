// importing named exports we use brackets
import { createPostTile, uploadImage, createElement } from './helpers.js';

// when importing 'default' exports, use below syntax
import API from './api.js';

const api  = new API();

// we can use this single api request multiple times
const feed = api.getFeed();

// feed
// .then(posts => {
//     posts.reduce((parent, post) => {

//         parent.appendChild(createPostTile(post));
        
//         return parent;

//     }, document.getElementById('large-feed'))
// });

const url = 'http://localhost:5000';
const logi = document.getElementById("log");
//document.getElementById('r').style.display = 'None';
//all the things doing after login
document.getElementById("login").addEventListener("click", function(){
	const name = document.getElementById("user").value;
	const pass = document.getElementById("pw").value;
	//const mail = document.getElementById("mail").value;
	// var wrapTop =document.getElementById('scrollWrap')
	// console.log(wrapTop.scrollTop + " " + "滚动条当前的位置")
	// console.log(wrapTop.scrollHeight + " " + "获取滚动条的高度")
	fetch(url+"/auth/login",{
		method: 'POST',
		body: JSON.stringify({
			username: name,
			password: pass
		}),
		headers: {
			 'Content-Type': 'application/json'
		}
	})
	.then(response=>response.json())
	.then(function(data){
		//console.log(data.message);
		window.localStorage.setItem('AUTH_KEY',data.token);
		return data;
	})
	.then(function(mes){
		if (mes.message){
			alert(mes.message);
		}else{
			document.getElementById('log').style.display = 'None';
			document.getElementById('in').style.display = 'block';
			document.getElementById('navid').style.display = 'block';
			document.getElementById('change').style.display = 'block';
			//alert('welcome');
			showfile();
			getfeed();
		}
	})
	//show the personal information when login
	function showfile(){
		fetch(url+'/user',{
			method: 'GET',
			headers: {
				Authorization: "token "+window.localStorage.getItem('AUTH_KEY'),
				'Content-Type': 'application/json'
			}
		})
		.then(response=>response.json())
		.then(post => {
			//console.log(post);
			if(post){
				var p = document.getElementById('prof');
				p.style.display='block';
				var username = createElement('li',"Username: "+post.username);
				var email = createElement('li', "Email: "+post.email, {id:"emailnow"});
				var n_post = createElement('li', "Posts: "+ post.posts.length);
				//var s_likes = createElement('li', "like")
				var following = createElement('li', "Following: "+ post.following.length);
				var followed = createElement('li', "Followed by: "+ post.followed_num);

				p.appendChild(username);
				p.appendChild(email);
				p.appendChild(n_post);
				p.appendChild(following);
				p.appendChild(followed);
				//p.appendChild(username1);
				for(var i=0; i<post.posts.length; i++){
					addmine(post.posts[i]);
				}
			}
		})
	}
	// var wrapTop =document.getElementById('scrollWrap')
	// console.log(wrapTop.scrollTop + " " + "滚动条当前的位置")
	// console.log(wrapTop.scrollHeight + " " + "获取滚动条的高度")
	//console.log(window.localStorage.getItem('AUTH_KEY'))
});
//to show my files in the login site
function addmine(id){
	fetch(url+'/post/?id='+id,{
		method: 'GET',
		headers: {
			Authorization: "token "+window.localStorage.getItem('AUTH_KEY'),
			'Content-Type': 'application/json'
		}
	})
	.then(response=>response.json())
	.then(function(data){
		var my_d = document.getElementById('my_file');
		var pic = createPostTile(data);
		var comm = createElement('input','comments',{id:`c${data.id}`,class:"comment"});
		//document.getElementById("c"+data.id).align='center';
		var update = createElement('button','update',{id:`u${data.id}`,class:"btn"});
		var deletec = createElement('button','delete',{id:`d${data.id}`,class:"btn"});
		my_d.appendChild(pic);
		my_d.appendChild(comm);
		my_d.appendChild(update);
		my_d.appendChild(deletec);
	})
}
//console.log(window.localStorage.getItem('AUTH_KEY'));
//show 
document.getElementById('show_my').addEventListener('click',function(){
	document.getElementById('my_file').style.display = 'block';
	document.getElementById('large-feed').style.display = 'none';
})
document.getElementById('hide_my').addEventListener('click',function(){
	document.getElementById('my_file').style.display = 'none';
	document.getElementById('large-feed').style.display = 'block';
})

//edit the profile
document.getElementById('edit').addEventListener('click',function(){
	document.getElementById('large-feed').style.display = 'none';
	document.getElementById('navid').style.display = 'none';
	document.getElementById('log').style.display = 'none';
	document.getElementById('prof').style.display = 'none';
	document.getElementById('changing').style.display = 'block';
})

//change the profile information like name and password and addr
document.getElementById('edit1').addEventListener('click',function(){
	//var mail = document.getElementById("emailnow").value;
	var namec = document.getElementById("userr1").value;
	var passc = document.getElementById("pwr1").value;
	var mailc = document.getElementById("mail1").value;
	fetch(url+"/user/",{
		method: 'PUT',
		body: JSON.stringify({
			username: namec,
			password: passc,
			email: mailc,
			//name: na
		}),
		headers: {
			Authorization: "token "+window.localStorage.getItem('AUTH_KEY'),
			 'Content-Type': 'application/json'
		}
	})
	.then(response=>response.json())
	.then(function(data){
		console.log(data);
		alert('succeed!');
	})
	document.getElementById('large-feed').style.display = 'block';
	document.getElementById('navid').style.display = 'block';
	//document.getElementById('log').style.display = 'block';
	document.getElementById('prof').style.display = 'block';
	document.getElementById('changing').style.display = 'none';
})
//get the feed interface
function getfeed(){
	fetch(url+'/user/feed',{
		method: 'GET',
		headers: {
			Authorization: "token "+window.localStorage.getItem('AUTH_KEY'),
			'Content-Type': 'application/json'
		}
	})
	.then(response=>response.json())
	.then(response=>response.posts)
	//feed//test the local things
	.then(response=>sortdata(response))
	.then(posts => {
		//console.log(posts);
		var a = document.getElementById('large-feed');
		//console.log(posts);
		for(const i of posts){
			var bc = createPostTile(i);
			//console.log(bc);
			//alert(new Date(1273185387).toUTCString());
			var datet = new Date(i.meta.published * 1000);
			var datetime = datet.toGMTString();
			var bb = createElement("p","post time: "+datetime,{id:`${i.id}`});
			//dynamic 
			var bd = createElement("p","likes: "+i.meta.likes.length,{id:`like_${i.id}`,sytle:`display:block`});
			//var bd1 = createElement("p","likes: "+{id:`likes1_${i.id}`,sytle:`display:none`});

			var bdd = createElement("button","show likes", {id:`show_${i.id}`,style:`display:block`});
			var bde = createElement("button","hide likes", {id:`hide_${i.id}`,style:`display:none`});

			var bddw = createElement("p",i.meta.likes,{id:`show${i.id}`, style:`display:none;`});
			//var bdd_id = "show_"+i.id;
			var bddl = createElement("button","like",{id:`like${i.id}`,style:`display:block;`});
			var bddu = createElement("button","unlike",{id:`unlike${i.id}`,style:`display:none;`});
		
			var be = createElement("p","description: "+i.meta.description_txt,{id:`${i.id}`});
			var bf = createElement("p","comments: "+i.comments.length,{id:`"comments"${i.id}`});
			var bff = createElement("button","show comments",{id:`showc_${i.id}`,style:`display:block;`});
			var bfg = createElement("button","hide comments",{id:`hidec_${i.id}`,style:`display:none;`});
			//comments sytle unknown right now

			var bffw = createElement("div","showall",{id:`showc${i.id}`,style:`display:none;`});

			//console.log(i);
			function dealwithcom(data,i){
				for(const ii of data){
					var datet1 = new Date(ii.published * 1000);
					var datetime1 = datet1.toGMTString();
					var j = ii.comment+" by "+ii.author+" at "+datetime1;
					var k = createElement('li', j);
					var l = document.getElementById("showc"+i.id);
					l.appendChild(k);
				}	
			}


			//var bffw = createElement("p",cmts,{id:`showc${i.id}`,style:`display:none;`});
			var b_c = createElement("input","comments",{id:`com_${i.id}`,class:"comment"});
			var b_b = createElement("button","publish",{id:`p${i.id}`,class:"btn"});

			// var com = createElement("input","input comments",{id:`com${i.id}`,type:"text",name:"coms"})
			// var combtn = createElement("button","submit",{id:`coms${i.id}`})
			
			bc.appendChild(bb);
			bc.appendChild(bddl);
			bc.appendChild(bddu);
			bc.appendChild(bd);
			//bc.appendChild(bd1);
			bc.appendChild(bdd);
			bc.appendChild(bde);
			bc.appendChild(bddw);
			// bc.appendChild(bddl);
			bc.appendChild(be);
			bc.appendChild(bf);
			bc.appendChild(bff);
			bc.appendChild(bfg);
			bc.appendChild(bffw);
			bc.appendChild(b_c);
			bc.appendChild(b_b);

			a.appendChild(bc);
			dealwithcom(i.comments,i);

			document.getElementById("show_"+i.id).addEventListener("click", function(){
				document.getElementById("show"+i.id).style.display="block";
				document.getElementById("hide_"+i.id).style.display="block";
				document.getElementById("show_"+i.id).style.display='none';
			})
			document.getElementById("hide_"+i.id).addEventListener("click", function(){
				document.getElementById("show_"+i.id).style.display="block";
				document.getElementById("show"+i.id).style.display='none';
				document.getElementById("hide_"+i.id).style.display="none";
			})
			document.getElementById("like"+i.id).addEventListener("click",function(){
				fetch(url+"/post/like?id="+i.id,{
					method: 'PUT',
					headers: {
						'Authorization': "token "+window.localStorage.getItem('AUTH_KEY'),
						'Content-Type': 'application/json'
					}
				})
				.then(response=>response.status)
				.then(function(status){
					if(status=='200'){
						document.getElementById("like"+i.id).style.display='none';
						document.getElementById("unlike"+i.id).style.display='block';
						var num = document.getElementById('like_'+i.id);
						//console.log(num.innerText);
						var num1 =(num.innerText.split(" "))[1];
						var n = parseInt(num1)+1;
						num.innerText="likes: "+n;
						alert("Awesome, you liked it");
					}
				})
			})

			document.getElementById("unlike"+i.id).addEventListener("click",function(){
				//know it now
				fetch(url+"/post/unlike?id="+i.id,{
					method: 'PUT',
					headers: {
						'Authorization': "token "+window.localStorage.getItem('AUTH_KEY'),
						'Content-Type': 'application/json'
					}
				})
				.then(response=>response.status)
				.then(function(status){
					document.getElementById("like"+i.id).style.display='block';
					document.getElementById("unlike"+i.id).style.display='none';
					var num = document.getElementById('like_'+i.id);
					//console.log(num.innerText);
					var num1 =(num.innerText.split(" "))[1];
					var n = parseInt(num1)-1;
					num.innerText="likes: "+n;

					alert("No longer like it");
				})
			})
			//show comments
			document.getElementById("showc_"+i.id).addEventListener('click',function(){
				document.getElementById("showc"+i.id).style.display = 'block';
				document.getElementById("hidec_"+i.id).style.display = 'block';
				document.getElementById("showc_"+i.id).style.display = 'none';
			})
			document.getElementById("hidec_"+i.id).addEventListener('click',function(){
				document.getElementById("showc"+i.id).style.display = 'none';
				document.getElementById("hidec_"+i.id).style.display = 'none';
				document.getElementById("showc_"+i.id).style.display = 'block';

			})
			//add comments
			document.getElementById("p"+i.id).addEventListener('click',function(){
				var mytime = parseFloat(Date.parse(new Date()))/1000;
				var words = document.getElementById("com_"+i.id).value;
				console.log(mytime);
				console.log(words);

				fetch(url+"/post/comment?id="+i.id,{
					method: 'PUT',
					body: JSON.stringify({
						author: name,
						published: mytime,
						comment: words
					}),
					headers: {
						'Authorization': "token "+window.localStorage.getItem('AUTH_KEY'),
						'Content-Type': 'application/json'
					}
				})
				.then(response=>response.json())
				.then(function(data){
					if(data.message){
						alert(data.message);
					}
				})
			})
		}
		//a.appendChild(b);
	});
	//sort by time
	function sortdata(data){
		//console.log(data);
		data.sort(function(a,b){
			return Date.parse(b.meta.published)-Date.parse(a.meta.published);
		})
		return data;
		//console.log(data);
	}
}
//register
document.getElementById("register").addEventListener("click", function(){
	document.getElementById("log").style.display = 'None';
	document.getElementById('r').style.display = 'block';
	document.getElementById("registerr").addEventListener("click", function(){
		var uname = document.getElementById("userr").value;
		var pass = document.getElementById("pwr").value;
		var mail = document.getElementById("mail").value;
		var na = document.getElementById("na").value;
		fetch(url+"/auth/signup",{
			method: 'POST',
			body: JSON.stringify({
				username: uname,
				password: pass,
				email:mail,
				name: na
			}),
			headers: {
				 'Content-Type': 'application/json'
			}
		})
		.then(response=>{
			return response.status;
		})
		.then(function(status){
			if(status=='409'){
				alert('Username Taken');
			}if(status=='400'){
				alert('Missing Username/Password');
			}if(status=='200'){
				alert('succeed, thanks for registion');
			}
		})
		document.getElementById("log").style.display = 'block';
		document.getElementById('r').style.display = 'None';
	})
});

// Potential example to upload an image
const input = document.querySelector('input[type="file"]');
input.addEventListener('change', uploadImage);

//uploadfile()
//for the Infinite Scroll



