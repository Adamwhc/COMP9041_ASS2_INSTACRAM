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

document.getElementById("login").addEventListener("click", function(){
	var name = document.getElementById("user").value;
	var pass = document.getElementById("pw").value;

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
			alert("mes.message");
		}else{
			document.getElementById('log').style.display = 'None';
			document.getElementById('in').style.display = 'block';
			document.getElementById('navid').style.display = 'block';
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
			var p = document.getElementById('prof');
			p.style.display='block';
			var username = createElement('li',"Username: "+post.username);
			var email = createElement('li', "Email: "+post.email);
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
		})
	}
	//console.log(window.localStorage.getItem('AUTH_KEY'))
});

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
document.getElementById('show_my').addEventListener('click',function(){
	document.getElementById('my_file').style.display = 'block';
	document.getElementById('large-feed').style.display = 'none';
})
document.getElementById('hide_my').addEventListener('click',function(){
	document.getElementById('my_file').style.display = 'none';
	document.getElementById('large-feed').style.display = 'block';
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
			var bd = createElement("p","likes: "+i.meta.likes.length,{id:`like_${i.id}`});
			var bdd = createElement("button","show likes", {id:`show_${i.id}`});

			var bddw = createElement("p",i.meta.likes,{id:`show${i.id}`, style:`display:none;`});
			//var bdd_id = "show_"+i.id;
			var bddl = createElement("button","like",{id:`like${i.id}`,style:`display:block;`});
			var bddu = createElement("button","unlike",{id:`unlike${i.id}`,style:`display:none;`});
		
			var be = createElement("p","description: "+i.meta.description_txt,{id:`${i.id}`});
			var bf = createElement("p","comments: "+i.comments.length,{id:`"comments"${i.id}`});
			var bff = createElement("button","show comments",{id:`showc_${i.id}`});
			//comments sytle unknown right now
			var bffw = createElement("p",i.meta.comments,{id:`showc${i.id}`,style:`display:none;`});


			// var com = createElement("input","input comments",{id:`com${i.id}`,type:"text",name:"coms"})
			// var combtn = createElement("button","submit",{id:`coms${i.id}`})
			
			bc.appendChild(bb);
			bc.appendChild(bddl);
			bc.appendChild(bddu);
			bc.appendChild(bd);
			bc.appendChild(bdd);
			bc.appendChild(bddw);
			// bc.appendChild(bddl);
			bc.appendChild(be);
			bc.appendChild(bf);
			bc.appendChild(bff);
			bc.appendChild(bffw);

			a.appendChild(bc);

			document.getElementById("show_"+i.id).addEventListener("click", function(){
				document.getElementById("show"+i.id).style.display="block";
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
						alert("Awesome, you liked it");
					}
				})
			})
			document.getElementById("unlike"+i.id).addEventListener("click",function(){
				//dont know how to deal with the dislike button in the api background
				document.getElementById("like"+i.id).style.display='block';
				document.getElementById("unlike"+i.id).style.display='none';
				alert("No longer like it");
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


