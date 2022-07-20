/*صلي على محمد*/
/*اذا اردت ان تنسخ العمل فلا تنسي السؤال للمطور الأساسي بالدعاء والرحمة*/
var apploaded=0;
var offline=true;
var packageName='com.citydesert.zakat';
var Maindb = {person:20,gold18:674,gold21:786,gold24:898,lastUpdate:"11/11/2021"};
var db = Maindb;
var desert = {
	init: function() {
		if(window.addEventListener && document.addEventListener){
		document.addEventListener("deviceready",desert.loading,false);
		window.addEventListener("resize",desert.resized,false);
		window.addEventListener("hashchange",desert.hashed,false);
		}else{
		desert.loading();
		}
	},
	loading:function(){
		var ce=document.createElement("script");
		desert.request({
		url:'js/idoms.js', //الأدعية المأثورة
		method:'get',
		onsuccess:function(r){ce.innerHTML=r;document.body.appendChild(ce);desert.loaded();}
		});
	
	},
	loaded: function(){
		if(typeof AndroidFullScreen!=='undefined'){function errorFunction(error){console.error(error)}AndroidFullScreen.isSupported(AndroidFullScreen.immersiveMode,errorFunction)};
		setTimeout(function(){document.getElementById("loading").style.display="none";},300);
		
		if(window.screenLocker){
		window.screenLocker.unlock(function(){}, function onError(e){
							
					});
		}
		if(!navigator.notification){
			navigator.notification=function(){};
			navigator.notification.confirm = function(x){confirm(x);}
			navigator.notification.alert = function(x){alert(x);}
		}
		
		desert.DB2HTML();
		if(window.location.toString().split("#")[1]==undefined){
			setTimeout(function(){
				window.location="#home";
				desert.hashed();
			},30);
			
		}else{
		desert.hashed();
		}
		document.querySelector("body").style.height=(document.documentElement.clientHeight)+"px";
		document.body.onclick=function(){
			if(apploaded==1){
				desert.hashed();
			}	
		};
		var date=new Date();
		navigator.notification.alert(idoms[date.getDay()],function(b){},"السلام عليكم",["شكراً"]);
			desert.permissions();
			desert.push();
	},
	resized: function(){
			document.querySelector("body").style.height=(document.documentElement.clientHeight)+"px";
	},
	hashed: function(){
		if(window.location.hash==""){desert.confirmExit();}
			desert.openLink();
			apploaded=1;
	},
	openLink: function(){
		document.querySelector("#popup").style.display="block";
		forEach(document.querySelectorAll(".page"),function(x){x.style.display="block";if(x.classList.contains("fadein")){x.classList.add("fadeout");x.classList.remove("fadein");}});
		document.querySelector("#"+window.location.toString().split("#")[1]+"").classList.remove("fadeout");
		document.querySelector("#"+window.location.toString().split("#")[1]+"").classList.add("fadein");	
	},
	fromURL: function(){
		if(window.location.hash.split("#")[1].length>3 & window.location.hash.split("#")[1]!="imagesList" & window.location.hash.split("#")[1]!="login" & window.location.hash.split("#")[1]!="register"){
			window.localStorage.setItem("fromURL",window.location);
		}
	},
	confirmExit: function(){
			event.preventDefault;
			navigator.notification.confirm("Are you sure you want to exit App?\nهل تود اغلاق البرنامج؟",function(b){
			if(b===1){
			navigator.app.exitApp();
			}else{window.location="#home";}},"Exit إغلاق",["yes نعم","no لا"]);
			window.location="#home";
	},
	goBack: function(){
		history.go(-1);
		desert.hashed();
	},
	popup: function(title,text){
		document.querySelector("#popup header").innerHTML=(title);
		document.querySelector("#popup content").innerHTML=text;
			document.querySelector("#popup").classList.remove("fadeout");
			document.querySelector("#popup").style.display=("block");
			document.querySelector("#popup").classList.add("fadein");
			
			setTimeout(function(){
				forEach(document.querySelectorAll(".page"),function(x){
					x.addEventListener("click",desert.popupHide,false);
					});
					},1000);
	},
	popupHide: function(){
					document.querySelector("#popup").classList.remove("fadein");
					document.querySelector("#popup").classList.add("fadeout");
					document.querySelector("#popup header").innerHTML="";
					document.querySelector("#popup content").innerHTML="";
					forEach(document.querySelectorAll(".page"),function(x){
					x.removeEventListener("click",desert.popupHide,false);
					});
					
	},
	request: function(opts){
		values = opts.data;
		v='';
		if(typeof(values)==="object"){
			for(x in values){
				v+='&'+x+'='+values[x];
			}
		v=v.replace("&","");	
		}
		var xml=new XMLHttpRequest() || new ActiveXObject("Microsoft.XMLHTTP");
		xml.onreadystatechange = function(){
			if(xml.readyState==4 && xml.status==200){
				opts.onsuccess(xml.responseText);
			}
		};
		tof=opts.async===false?false:true;
		xml.open(opts.method,opts.url,tof);
		if((opts.method).toLowerCase() == "post"){
			xml.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		}
		xml=Object.assign(xml,opts);
		xml.send(v);
	},
	permissions: function(){
				if(typeof cordova!=='undefined'){
				cordova.plugins.notification.local.hasPermission(function(granted){
						cordova.plugins.notification.local.requestPermission(function(granted){
						});
				});
				cordova.plugins.notification.local.setDefaults({
					smallIcon:"res://logo",
					icon:"file://img/logo.png"
				});
				}
	},
	push: function(){
		if(typeof cordova!=='undefined'){
			var idomsNotify = {title:["حساب الزكاة","سرالصحراء"],text:idoms};
			idomid = window.localStorage.getItem("idomid")?Math.ceil(window.localStorage.getItem("idomid")):0;
			idomtid=idomid%2===0?0:1;
			cordova.plugins.notification.local.cancel(1,function(){});
			cordova.plugins.notification.local.schedule({
				id: 1,
				title: idomsNotify.title[idomtid],
				text: (idomsNotify.text[idomid]).toString(),
				trigger: { every: 1,unit:'day'}
			});
			idomid = (Object.keys(idomsNotify.text).length)<=(idomid+1)?0:idomid+1;
			window.localStorage.setItem("idomid",(idomid).toString());
		}
	},
	calculateFitr: function(){
		event.preventDefault();
		var persons = Number(document.getElementById("zakatFitrinput").value);
		var person = db.person;
		if(persons<1){navigator.notification.alert("قد بادخال عدد الأفراد",function(){},"خطأ","شكراً");return false;}
		var resultF="يجب إخراج عدد "+persons+" صاع\nاو ما يزن "+(persons*3)+" كجم \n أو قيمتهما نقداً وهي \n"+persons+"×"+person+"="+persons*person+" جنيهاً";
		navigator.notification.alert(resultF,function(){},"مقدار الذكاة","شكراً");
		document.getElementById("fitrResult").innerHTML='<fieldset style="background:#eee;border-radius:10px;"><legend>مقدار الزكاة</legend>'+resultF.replace(/\n/img,"<br>")+'</fieldset>';
	},
	calculateZar3: function(){
		event.preventDefault();
		var frm = document.getElementById("zakatzar3Form");
		var kgs = frm["zakatzar3inputkg"].value;
		var mkna = frm["zakatzar3inputrai"].value;
		var mkind = frm["zakatzar3inputkind"].value;
			if(kgs<653){
				navigator.notification.alert("لم يبلغ محصولك الحد الأدنى لنصاب الزكاة \nلذا لا يتوجب عليك اخراج زكاة الزروع",function(){},"عفواً","شكراً");
				return false;
			}
			if(mkna=="mtr"){
			var resultF="يجب إخراج ما يزن "+Math.ceil(kgs/10)+" كجم من ما اخرجت الأرض من محصول \nتم احتساب عشر ما اخرجت الأرض لكونك تروى الأرض بدون تكاليف اضافية او ميكنة ";
			}
			if(mkna=="mkna"){
			var resultF="يجب إخراج ما يزن "+Math.ceil(kgs/20)+" كجم من ما اخرجت الأرض من محصول \nتم احتساب نصف العشر لكونك تستخدم ميكنة ذات تكلفة اضافية لري الأرض ";
			}
			if(mkind=="unstoreable"){
				resultF+="\t\nوهناك رأي فقهى اخر يبيح لك عدم إخراج زكاة الزروع وذلك لكون محصولك غير معد للتخزين او لا يقبل التخزين";
			}
		navigator.notification.alert(resultF,function(){},"مقدار الذكاة","شكراً");
		document.getElementById("zar3Result").innerHTML='<fieldset style="background:#eee;border-radius:10px;"><legend>مقدار الزكاة</legend>'+resultF.replace(/\t\n/img,"<hr>").replace(/\n/img,"<br>")+'<img onclick="document.getElementById(\'zakatZar3page\').scrollTo(0,0)"  src="img/up.png"></fieldset>';
		document.getElementById("zakatZar3page").scrollTo(0,(window.innerHeight));
	},
	calculateMal: function(){
		event.preventDefault();
		var frm = document.getElementById("zakatmalForm");
		var moneyInHand = Number(frm["zakatmalinputmoney"].value);
		var accounts = Number(frm["zakatmalinputgary"].value);
		var gold18 = Number(frm["zakatmalinputgold18"].value);
		var gold21 = Number(frm["zakatmalinputgold21"].value);
		var gold24 = Number(frm["zakatmalinputgold24"].value);
		var savings = Number(frm["zakatmalinputstores"].value);
		var useable = (frm["zakatmalinputenfaq"].value);
		var benfits = Number(frm["zakatmalinputyearlysav"].value);
		
			if((moneyInHand+accounts+(savings+benfits)+((gold21*db.gold21)+(gold18*db.gold18)+(gold24*db.gold24))<(db.gold21*85))){
				navigator.notification.alert("لم تبلغ مدخراتك الحد الأدنى لنصاب الزكاة \nلذا لا يتوجب عليك اخراج زكاة المال",function(){},"عفواً","شكراً");
				return false;
			}
			
			var resultF="زكاة مالك هي:"+Math.ceil((moneyInHand+accounts+(savings+benfits)+((gold21*db.gold21)+(gold18*db.gold18)+(gold24*db.gold24)))*2.5/100)+" جنيه،  باحتساب 2.5% من اجمالى مدخراتك";
		if(savings>1){	
			if(useable=="unfiq"){
			 resultF +="\t\nوهناك اجتهاد للتيسير ويعتبر زكاة مالك هي:"+Math.ceil(((moneyInHand+accounts+((gold21*db.gold21)+(gold18*db.gold18)+(gold24*db.gold24)))*2.5/100)+(benfits/10))+" جنيه،  باحتساب 2.5% من اجمالى مدخراتك \"باستثناء الودائع\"  واعتبار العائد من الشهادات او الودائع كقطعة ارض تدر دخل فيتم احتساب 10% او عشر ما تجنيه من عائد وهذا هو أيسر الآراء الفقهية";			
			}	
		}
		
		navigator.notification.alert(resultF,function(c){},"مقدار الذكاة","شكراً");
		document.getElementById("MalResult").innerHTML='<fieldset style="background:#eee;border-radius:10px;"><legend>مقدار الزكاة</legend>'+resultF.replace(/\t\n/img,"<hr>").replace(/\n/img,"<br>")+'<img onclick="document.getElementById(\'zakatMalpage\').scrollTo(0,0)"  src="img/up.png"></fieldset>';
		document.getElementById("zakatMalpage").scrollTo(0,(window.innerHeight));
	},
	calculateTgara: function(){
		event.preventDefault();
		var frm = document.getElementById("zakattgaraForm");
		var amountofprod = Number(frm["zakattgarainputmoney"].value);
		var landforsale = Number(frm["zakattgarainputaradi"].value);
		var landleligar = Number(frm["zakattgarainputaradiigar"].value);
		
			if((amountofprod+landforsale+landleligar)<(db.gold21*85)){
				navigator.notification.alert("لم تبلغ تجارتك الحد الأدنى لنصاب الزكاة \nلذا لا يتوجب عليك اخراج زكاة التجارة",function(){},"عفواً","شكراً");
				return false;
			}
			
			var resultF="زكاة تجارتك هي:"+Math.ceil((amountofprod+landforsale+landleligar)*2.5/100)+" جنيه،  باحتساب 2.5% من اجمالى السلع التى تدرى عائد";
		
		navigator.notification.alert(resultF,function(){},"مقدار الذكاة","شكراً");
		document.getElementById("TgaraResult").innerHTML='<fieldset style="background:#eee;border-radius:10px;"><legend>مقدار الزكاة</legend>'+resultF.replace(/\t\n/img,"<hr>").replace(/\n/img,"<br>")+'<img onclick="document.getElementById(\'zakatTgarapage\').scrollTo(0,0)"  src="img/up.png"></fieldset>';
		document.getElementById("zakatTgarapage").scrollTo(0,(window.innerHeight));
	},
	settingsSet: function(x){
		event.preventDefault();
		var frm = x;
		var zhb18 = Number(x["zhb18"].value);
		var zhb21 = Number(x["zhb21"].value);
		var zhb24 = Number(x["zhb24"].value);
		var nsab = Number(x["nsab"].value);
		
		var today = new Date();
		var dd = String(today.getDate()).padStart(2, '0');
		var mm = String(today.getMonth() + 1).padStart(2, '0');
		var yyyy = today.getFullYear();

		today = dd + '/' + mm + '/' + yyyy;
		var newDB = {"person":nsab,"gold18":zhb18,"gold21":zhb21,"gold24":zhb24,"lastUpdate":today};
			navigator.notification.confirm("هل أنت متأكد من حفظ القيم الجديدة وحذف القديمة؟",function(b){
			if(b===1){
				window.localStorage.setItem("db",JSON.stringify(newDB));
				navigator.notification.alert("تم حفظ التغييرات التى ادخلتها",function(){},"تم بنجاح","شكراً");
				document.getElementById("setResult").innerHTML='<fieldset style="background:#eee;font-size:14px;border-radius:10px;"><legend>تأكيد حفظ التغييرات!</legend>تم حفظ التغييرات بنجاح!</fieldset>';
				desert.DB2HTML();
			}else{
				navigator.notification.alert("لم يتم حفظ أي تغييرات قمت بادخالها",function(){},"لم يتم الحفظ","شكراً");
				document.getElementById("setResult").innerHTML='';
				desert.DB2HTML();
			}
			},"تأكيد التحديث",["نعم","لا"]);
		
	},
	DB2HTML: function(){
		if(!window.localStorage){
			navigator.notification.alert("يرجي العلم ان التطبيق لن يعمل مع جهازك بشكل سليم!\nما يعنى ان ميزة تحديث اسعار الذهب يدوياً لن تكون نشطة\nوالسبب هو ان اصدار الهاتف قديم!",function(){},"تم بنجاح","شكراً");
			var df=document.getElementById("settingsForm");
			for(var i=0;i<df.length;i++){
				if(df[i].type=="number"){df[i].setAttribute("disabled","disabled")}
			}
		}else{
			if(!window.localStorage.getItem("db")){window.localStorage.setItem("db",JSON.stringify(Maindb))}
			db = window.localStorage.getItem("db").length>10?JSON.parse(window.localStorage.getItem("db")):Maindb;
		}
		var sform=document.getElementById("settingsForm");
		sform["zhb18"].value=db.gold18;
		sform["zhb21"].value=db.gold21;
		sform["zhb24"].value=db.gold24;
		sform["nsab"].value=db.person;
		
		document.querySelectorAll("currency").innerText="جنيه";
		document.getElementById("fitrOne").innerText=db.person;
		document.getElementById("lastUpdate").innerText="تاريخ اخر تحديث للأسعار: "+(db.lastUpdate);
		var y = new Date();
		var year = Math.ceil(((Number(y.getFullYear())-622)/0.97))+"هـ";
		document.getElementById("year").innerText=year;
		
	}
	
};
		function forEach(Obj,callback){
			for(i in Obj){
				if(typeof(Obj[i])!=="object"){continue;}
				callback(Obj[i]);
			}
		}
		function forEachArray(Obj,callback){
			for(i in Obj){
				if(typeof(Obj[i])!=="array"){continue;}
				callback(Obj[i]);
			}
		}

		
		function loadREMOTEscript(){
					var d = new Date();
					var nsce=document.createElement("script");
					nsce.src='https://egypt.do.am/APK/lists.js?'+d.getTime(); //REPLACE WITH YOUR URL IN WITCH VAR newGoldprices={prices object to update db remotelly}
					nsce.onload=function(){offline=false;updatePrices(newGoldprices);};
					nsce.onerror=function(){offline=true;setTimeout(function(){loadREMOTEscript();},2000);};	
					document.body.appendChild(nsce);
		}
		
		function updatePrices(newGoldprices){
			if(window.localStorage){
				if(window.localStorage.getItem("db")!=JSON.stringify(newGoldprices)){
					navigator.notification.confirm("هناك تحديث لأسعار الذهب\nتطبيق التحديث؟",function(b){
					if(b===1){
					window.localStorage.setItem("db",JSON.stringify(newGoldprices));
					db = newGoldprices;
					desert.DB2HTML();
					}else{window.location="#settings";}},"تحديث مهم",["نعم","لا"]);
				}

			}else{
				db = newGoldprices;
			}
		}
		
desert.init();
setTimeout(function(){loadREMOTEscript();},800);
/*سر الصحراء - تصويرات*/