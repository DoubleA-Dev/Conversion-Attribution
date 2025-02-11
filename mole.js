/*********************************/
/******INSTANTIATE SESSION********/
/*********************************/

var session = new getSessionData();

/**********************************/
/******QUEUE THE COMMMANDS*********/
/**********************************/

var mole = function(action, value){
	switch(action){
		//Set the domain for cross sub-domain tracking
		//If not set, cross sub-domain tracking will be disabled
		case 'setDomain':
			session.domain = value;
			break;
		//Manually set the names of the input fields.
		//Refer to insertData object for default names.
		case 'setNames':
			insertData.prototype.names = value;
			break;
		//Set the query string's names manually (not value). Overrides the defaults
		case 'setQueryNames':
			insertData.prototype.queryStringNames = value;
		case 'setDateFormat':
			insertData.prototype.dateFormat = value;
		//Save the data to cookies
		case 'saveSession':
			if(session.new_user() || session.new_session()){
				saveData();
			}
			break;
		//Initiate the form processing.
		//Fill values of defined fields if they exists.
		//If they don't exists will auto generate hidden fields with values.
		case 'processForms':
			if(value == 'marketo'){
				insertData.prototype.forms_e = MktoForms2.allForms();
				insertData.prototype.addFields = function(form, inputObj){
					form.addHiddenFields(inputObj);
				}
			}
			var moleForms = new insertData();
			moleForms.init('forms');
			break;
		//Initiate the process of appending utm strings to provided elements
		//Provide an array of element objects to the processButtons method
		//Value variable should be an array of element objects that only include an href HTML attribute.
		//Ex: var elements = [jQuery('a'), document.getElementsByClassName('btn')]; mole('processButtons', elements);
		//If value left blank, query string will be appended to all anchor HTML elements.
		case 'addQueryStrings':
			insertData.prototype.ele = value;
			var moleQuery = new insertData();
			moleQuery.init('queryStrings');
			break;
	}
}

/**********************************/
/******ACQUIRE SESSION DATA********/
/**********************************/

//Session data
function getSessionData(){
	
	this.domain = this.domain || window.location.hostname.replace('www.','');
	
	this.timestamp = new Date().getTime();
	
	this.referrer_url = function(sanitized){
		var ref = document.referrer;
		var ref_hostname = ref.split('/')[2];
		if(ref === undefined || ref === 'undefined' || ref === '' || ref.indexOf(this.domain) != -1){
			return false;
		}else{
			if(!sanitized){
				return ref;
			}else{
				return ref_hostname;
			}
		}
	}
	
	this.timeout = 30 * 60 * 1000; // Minuets - Seconds - Milliseconds
	
	this.cookie_expires =  function(){
		//Cookie expires after 1 year
		var date = new Date();
		date.setTime(date.getTime() + (365 * 24 * 60 * 60 * 1000));
		var expires = "expires="+date.toUTCString();
		return expires;
	}
	
	this.organic_sources = [
		'google',
		'daum',
		'eniro',
		'naver',
		'yahoo',
		'msn',
		'bing',
		'aol',
		'lycos',
		'ask',
		'altavista',
		'netscape',
		'cnn',
		'about',
		'mamma',
		'alltheweb',
		'voila',
		'virgilio',
		'live',
		'baidu',
		'alice',
		'yandex',
		'najdi',
		'mama',
		'seznam',
		'search',               // potential false positive
		'wirtulana polska',
		'onetcenter',
		'szukacz',
		'yam',
		'pchome',
		'kvasir',
		'sesam',
		'ozu',
		'terra',
		'mynet',
		'ekolay',
		'rambler'
	];
	
	this.social_sources = [
		'facebook',
		'pinterest',
		'twitter',
		'buzzfeed',
		'linkedin',
		'blogger',
		'blogspot',
		'reddit',
		'tumblr',
		'stumbleupon',
		'tinyurl',
		'polyvore',
		'youtube',
		'yelp',
		'cafemom',
		'flickr',
		'paper.li',
		'wordpress',
		'getpocket',
		'weebly',
		'delicious',
		'netvibes',
		'plurk',
		'typepad',
		'vk',
		'allvoices',
		'badoo',
		'disqus',
		'livefyre',
		'd.hatena',
		't.co',
		'plus.google.com',
		'plus.url.google.com',
		'bookmarks.yahoo.com',
		'answers.yahoo.com'
	];
	
	this.intersection = function(haystack, needle){
		for(var i = 0; i < needle.length; i++){
			if(haystack.indexOf(needle[i]) != -1){
				return true;
			}
		}
		return false;
	}
	
	this.query_string = function(parameter, url){
		if (url === undefined || url === '' || url === 'undefined' || url === false){
			url = this.landing_page();
		}
		
		if(url.indexOf('?') != -1 && url.indexOf(parameter, url.indexOf('?')) != -1){
			if(url.indexOf('&', url.search(parameter)) != -1){
				return decodeURIComponent(url.substring((url.indexOf(parameter, url.indexOf('?')) + parameter.length + 1), url.indexOf('&', url.search(parameter))));
			}else{
				return decodeURIComponent(url.substring((url.indexOf(parameter, url.indexOf('?')) + parameter.length + 1)));
			}
		}else{
			return false;
		}
	}
	
	this.default_medium = function(){
		if (this.referrer_url() === false) {
			return 'none';
		}else if(this.query_string('gclid') != '' && this.query_string('gclid') != false){
			return 'paid';
		}else{
			if(this.intersection(this.social_sources, this.referrer_url(true).split('.'))){
				return 'social';
			}else if(this.intersection(this.organic_sources, this.referrer_url(true).split('.'))){
				return 'organic';
			}else{
				return 'referral';
			}
		}
	}
	
	this.default_source = function(){
		if(this.default_medium() == 'none'){
			return 'direct';
		}else{
			return this.referrer_url(true);
		}
	}
	
	this.default_term = function(){
		if(!this.query_string('q', this.referrer_url(false))){
			return 'not provided';
		}else{
			return this.query_string('q', this.referrer_url(false));
		}
	}
	
	this.landing_page = function(){
		return window.location.href;
	}
	
	this.new_user = function(){
		return (!this.readCookie('_orig_data')) ? true : false;
	}
	
	this.new_session = function(){
		var conv_data = this.readCookie('_conv_data');
		if(conv_data){
			return ((this.timestamp - conv_data.timestamp) > this.timeout) ? true : false;
		}
		return false;
	}
	
	this.readCookie = function(name){
		var cookies = document.cookie.split(';');
		for(var i = 0; i < cookies.length; i++){
			var cookie;
			//Check for space in front of cookie and remove
			if(cookies[i].indexOf(' ') == 0){
				cookie = cookies[i].substring(1);
			}else{
				cookie = cookies[i];
			}
			
			if(cookie.indexOf(name + '=') == 0){ //Check if name is the first part of the string.
				return JSON.parse(cookie.substring(name.length + 1));
			}
		}
		return false;
	}
}


/******************************/
/******SAVE THE SESSION********/
/******************************/

function saveData(){
	
	//Current Data
	var cur_data = {
		'timestamp' : session.timestamp,
		'source' : '',
		'medium' : '',
		'content' : session.query_string('utm_content'),
		'campaign' : session.query_string('utm_campaign'),
		'term' : '',
		'landing_page' : session.landing_page()
	}
	
	if(!session.query_string('utm_source')){
		cur_data['source'] = session.default_source();
	}else{
		cur_data['source'] = session.query_string('utm_source');
	}
	
	if(!session.query_string('utm_medium')){
		cur_data['medium'] = session.default_medium();
	}else{
		cur_data['medium'] = session.query_string('utm_medium');
	}
	
	if(!session.query_string('utm_term')){
		cur_data['term'] = session.default_term();
	}else{
		cur_data['term'] = session.query_string('utm_term');
	}
	
	//Original Data
	if(session.new_user()){
		document.cookie = "_conv_data="+ JSON.stringify(cur_data) +";"+ session.cookie_expires() +"; path=/;domain=." + session.domain + "; SameSite=Lax";
		document.cookie = "_orig_data="+ JSON.stringify(cur_data) +";"+ session.cookie_expires() +"; path=/;domain=." + session.domain + "; SameSite=Lax";
	}else if(session.new_session()){
		document.cookie = "_conv_data="+ JSON.stringify(cur_data) +";"+ session.cookie_expires() +"; path=/;domain=." + session.domain + "; SameSite=Lax";
	}
	
	//Allow function to return session data object, so that data does is not only accessible reading the cookie.
	return JSON.stringify(cur_data);
}


/*************************************/
/******INSERT THE DATA********/
/*************************************/

function insertData(){
	
	//All Forms on Page
	this.forms_e = this.forms_e || document.getElementsByTagName('form');
	
	//Set the default elements to append query strings to
	this.ele = this.ele || document.getElementsByTagName('a');
	
	//Input name mapping
	this.names = this.names || {
		'converting_timestamp' : 'converting_timestamp',
		'converting_source' : 'converting_source',
		'converting_medium' : 'converting_medium',
		'converting_content' : 'converting_content',
		'converting_campaign' : 'converting_campaign',
		'converting_term' : 'converting_term',
		'converting_landing_page' : 'converting_landing_page',
		'converting_referral' : 'converting_referral',
		'original_timestamp' : 'original_timestamp',
		'original_source' : 'original_source',
		'original_medium' : 'original_medium',
		'original_content' : 'original_content',
		'original_campaign' : 'original_campaign',
		'original_term' : 'original_term',
		'original_landing_page' : 'original_landing_page',
		'original_referral' : 'original_referral'
	};
	
	//Query string name mapping
	this.queryStringNames = this.queryStringNames || {
		'converting_timestamp' : 'converting_timestamp',
		'converting_source' : 'converting_source',
		'converting_medium' : 'converting_medium',
		'converting_content' : 'converting_content',
		'converting_campaign' : 'converting_campaign',
		'converting_term' : 'converting_term',
		'converting_landing_page' : 'converting_landing_page',
		'converting_referral' : 'converting_referral',
		'original_timestamp' : 'original_timestamp',
		'original_source' : 'original_source',
		'original_medium' : 'original_medium',
		'original_content' : 'original_content',
		'original_campaign' : 'original_campaign',
		'original_term' : 'original_term',
		'original_landing_page' : 'original_landing_page',
		'original_referral' : 'original_referral'
	};
	
	//Default format 2021-03-02 14:08:02
	this.dateFormat = this.dateFormat || 'Y-m-d H:i:s';
	
	//Get the conversion cookie data
	this.conv = session.readCookie('_conv_data');
	
	//Get the original cookie data
	this.orig = session.readCookie('_orig_data');
	
	//Initiate Processing
	this.init = function(type){
		if(type == 'forms'){
			
			if(!this.conv || !this.orig){
				//If cookie data does not exists, run the saveData function and acquire the data. Prevents us from having to rely on the cookie being set, while also creating a cookie for later use.
				var cur_data = saveData();
				var conv_data = JSON.parse(cur_data);
				var orig_data = JSON.parse(cur_data);
				var dataToInsert = this.compileObj( conv_data, orig_data, this.names);
			}else{
				var dataToInsert = this.compileObj(this.conv, this.orig, this.names);
			}
			
			for(var i = 0; i < this.forms_e.length; i++){
				this.addFields(this.forms_e[i], dataToInsert);
			}
		}
		
		if(type == 'queryStrings'){
			var dataToInsert = this.compileObj(this.conv, this.orig, this.queryStringNames);
			for(var key in this.ele){
				if(!this.ele[key].nodeType){
					for(var b = 0; b < this.ele[key].length; b++){
						if(!this.ele[key][b].nodeType){
							for(var i = 0; i < this.ele[key][b].length; i++){
								this.queryString(this.ele[key][b][i], key, dataToInsert);
							}
						}else{
							this.queryString(this.ele[key][b], key, dataToInsert);
						}
					}
				}else{
					this.queryString(this.ele[key], key, dataToInsert);
				}
			}
		}
	}
	
	//Compile the Form input objects. Key is input name & value is input value
	//Maps the cookie objects with the input name mapping object
	this.compileObj = function(conv_obj, orig_obj, map){
		var compiled = {};
		
		//Convert Timestamp
		conv_obj['timestamp'] = this.convertTimestamp(conv_obj['timestamp']);
		orig_obj['timestamp'] = this.convertTimestamp(orig_obj['timestamp']);
				
		//Prepare Obj for EZ comparison
		for(var i in conv_obj){
			conv_obj['converting_' + i] = conv_obj[i];
			delete conv_obj[i];
		}
		
		for(var i in orig_obj){
			orig_obj['original_' + i] = orig_obj[i];
			delete orig_obj[i];
		}
		
		//Map to defined input names in this.setNames
		for (var i in conv_obj){
			if(conv_obj[i]){
				for (var b in map){
					if(i == b){
						compiled[map[b]] = conv_obj[i];
					}
				}
			}
		}

		for (var i in orig_obj){
			if(orig_obj[i]){
				for (var b in map){
					if(i == b){
						compiled[map[b]] = orig_obj[i];
					}
				}
			}
		}

		return compiled;
	}
	
	//Convert the timestamp to something readable
	this.convertTimestamp = function(timestamp){
		var date = new Date(timestamp);
		var formatted_date_final = '';
				
		switch(this.dateFormat) {
			case 'unix': 
				//set date to unix format
				formatted_date_final = date.getTime(); 
			break;
			case 'unixM': 
				//set unix date format to include midnight
				date.setUTCHours(0,0,0,0); 
				formatted_date_final = date.getTime(); 
			break;
			case 'iso': 
				//convert date to ISO string format
				formatted_date_final = date.toISOString(); 
			break;
			default:
				var month = date.getMonth() + 1;
				var day = date.getDate();
				var year = date.getFullYear();
				var hours = date.getHours();
				var mins = date.getMinutes();
				var seconds = date.getSeconds(); 
				
				for(var i = 0; i < this.dateFormat.length; i++){			
					switch(this.dateFormat[i]){
						//Day
						case 'd':
							if(day.toString().length == 1){
								day = "0" + day;
							}
							formatted_date_final = formatted_date_final + day;
						break;
						case 'j':
							if(parseInt(day) < 10){
								day = day.toString().replace(/0/g,"");
							}
							formatted_date_final = formatted_date_final + day;
						break;
						//Year
						case 'y':
							formatted_date_final = formatted_date_final + year.toString().slice(-2);
						break;
						case 'Y':
							formatted_date_final = formatted_date_final + year;
						break;
						//Month
						case 'F':
							var monthNamesFull = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
							formatted_date_final = formatted_date_final + monthNamesFull[month];
						break;
						case 'M':
							var monthNamesShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
							formatted_date_final = formatted_date_final + monthNamesShort[month];
						break;
						case 'm':
							if(month.toString().length == 1){
								month = "0" + month;
							}
							formatted_date_final = formatted_date_final + month;
						break;
						case 'n':
							if(parseInt(month) < 10){
								month = month.toString().replace(/0/g,"");
							}
							formatted_date_final = formatted_date_final + month;
						break;
						//Hours
						case 'G':
							if(parseInt(hours) < 10 && parseInt(hours) != 0){
								hours = hours.toString().replace(/0/g,"");
							}
							formatted_date_final = formatted_date_final + hours;
						break;
						case 'g':
							if(parseInt(hours) > 12){
								hours = parseInt(hours) - 12;
							}
							if(parseInt(hours) < 10 && parseInt(hours) != 0){
								hours = hours.toString().replace(/0/g,"");
							}
							formatted_date_final = formatted_date_final + hours;
						break;
						case 'h':
							if(parseInt(hours) > 12){
								hours = parseInt(hours) - 12;
							}
							if(hours.toString().length == 1){
								hours = "0" + hours;
							}
							formatted_date_final = formatted_date_final + hours;
						break;
						case 'H':
							if(hours.toString().length == 1){
								hours = "0" + hours;
							}
							formatted_date_final = formatted_date_final + hours;
						break;
						//Mins
						case 'i':
							if(mins.toString().length == 1){
								mins = "0" + mins;
							}
							formatted_date_final = formatted_date_final + mins;
						break;
						case 'I':
							if(parseInt(mins) < 10 && parseInt(mins) != 0){
								mins = mins.toString().replace(/0/g,"");
							}
							formatted_date_final = formatted_date_final + mins;
						break;
						//Seconds
						case 's':
							if(seconds.toString().length == 1){
								seconds = "0" + seconds;
							}
							formatted_date_final = formatted_date_final + seconds;
						break;
						case 'S':
							if(parseInt(seconds) < 10 && parseInt(seconds) != 0){
								seconds = seconds.toString().replace(/0/g,"");
							}
							formatted_date_final = formatted_date_final + seconds;
						break;
						//Meridiem
						case 'a':
							if(hours > 12){
								var meridiem = 'pm';
							}else{
								var meridiem = 'am';
							}
							formatted_date_final = formatted_date_final + meridiem;
						break;
						case 'A':
							if(hours > 12){
								var meridiem = 'PM';
							}else{
								var meridiem = 'AM';
							}
							formatted_date_final = formatted_date_final + meridiem;
						break;
						default:
							formatted_date_final = formatted_date_final + this.dateFormat[i];
					}
				} 
		} 
		
		return formatted_date_final;
	}
	
	//Add the fields to the form
	this.addFields = this.addFields || function(form_e, inputObj){
		//If Form input field does not exists add new input field
		for(var key in inputObj){
			if(!form_e.elements.namedItem(key)){
				var input = document.createElement("input");
				input.type = "hidden";
				input.name = key;
				input.value = inputObj[key];
				form_e.appendChild(input);
			}else{
				form_e.elements.namedItem(key).value = inputObj[key];
			}
		}
	}
	
	this.queryString = this.queryString || function(ele, attr, queryObj){
		if(typeof ele != 'undefined' && ele.getAttribute(attr) != null){
			var query = '';
			var eleAttr = ele.getAttribute(attr);
			
			//Check if Query String already Exists
			if(eleAttr.indexOf('?') == -1){
				eleAttr += '?';
			}else{
				if(eleAttr.indexOf('?') != eleAttr.length - 1){
					eleAttr += '&';
				}
			}
			
			for(var keys = Object.keys(queryObj), i = 0, end = keys.length; i < end; i++){
				var key = encodeURIComponent(keys[i]);
				var value = encodeURIComponent(queryObj[key]);
				//Check if Query String Variable Already Exists and replace it's value
				if(session.query_string(key, eleAttr) != false){
					var startCur = eleAttr.indexOf(key);
					if(eleAttr.indexOf('&', startCur) > -1){
						var endCur = eleAttr.indexOf('&', startCur);
					}else{
						var endCur = null;
					}
					var cur = eleAttr.substring(startCur, endCur);
					var rep = query + key + '=' + value;
					eleAttr = eleAttr.replace(cur,rep);
				}else{
					query = query + encodeURIComponent(key) + '=' + encodeURIComponent(value);
					if(i != end - 1){
						query += '&';
					}
				}
			}
			
			ele.setAttribute(attr, eleAttr + query);
		}
	}
}