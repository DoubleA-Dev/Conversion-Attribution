````
<script>
(function(){
	var a = document.createElement('script');
  	var m = document.getElementsByTagName('script')[0];
	a.onload = function(){
		mole('setDomain','example.com');
		mole('setDateFormat','Y-m-d H:i:s');
		mole('setNames', {
			'converting_timestamp' : 'converting_timestamp__c',
			'converting_source' : 'converting_source__c',
			'converting_medium' : 'converting_medium__c',
			'converting_content' : 'converting_content__c',
			'converting_campaign' : 'converting_campaign__c',
			'converting_term' : 'converting_term__c',
			'converting_landing_page' : 'converting_landing_page__c',
			'original_timestamp' : 'original_timestamp__c',
			'original_source' : 'original_source__c',
			'original_medium' : 'original_medium__c',
			'original_content' : 'original_content__c',
			'original_campaign' : 'original_campaign__c',
			'original_term' : 'original_term__c',
			'original_landing_page' : 'original_landing_page__c',
		});
		mole('setQueryNames', {
			'converting_timestamp' : 'converting_timestamp__c',
			'converting_source' : 'converting_source__c',
			'converting_medium' : 'converting_medium__c',
			'converting_content' : 'converting_content__c',
			'converting_campaign' : 'converting_campaign__c',
			'converting_term' : 'converting_term__c',
			'converting_landing_page' : 'converting_landing_page__c',
			'original_timestamp' : 'original_timestamp__c',
			'original_source' : 'original_source__c',
			'original_medium' : 'original_medium__c',
			'original_content' : 'original_content__c',
			'original_campaign' : 'original_campaign__c',
			'original_term' : 'original_term__c',
			'original_landing_page' : 'original_landing_page__c',
		});
		mole('saveSession');
	};
	a.src = '//cdn.example.com/mole.min.js?v=2.1';
	a.async = 1;
	m.parentNode.insertBefore(a,m);
})();

//Default
var appendForms = setInterval(function(){
  if(typeof mole != 'undefined' && (document.readyState === "complete" || document.readyState === "loaded")){
	mole('processForms');
	clearInterval(appendForms);
  }
}, 500);


//Hubspot Forms Integration. Does not always work.
window.addEventListener('message', function(event){
   if(event.data.type === 'hsFormCallback' && event.data.eventName === 'onFormReady') {
       var interval = setInterval(function() {
         if(typeof mole != 'undefined'){
           mole('processForms');
           clearInterval(interval);
         }
       }, 500);
   }
});

//Marketo Forms Integration
var interval = setInterval(function(){
  if( typeof MktoForms2 !== 'undefined' && typeof mole != 'undefined' && (document.readyState === "complete" || document.readyState === "loaded") ) {  
      MktoForms2.whenRendered(function(form){ 
        mole('processForms','marketo');
        clearInterval(interval);
      }); 
  }
}, 500);


//Autopilot
window.addEventListener("load", function(){
	mole('processForms','autopilot');
}, false);

//Pardot
function acquire_field_names(){
  	var a_field_names = {
      'converting_timestamp' : 'Attribution_Timestamp',
      'converting_source' : 'UTM_Source',
      'converting_medium' : 'UTM_Medium',
      'converting_content' : 'UTM_Content',
      'converting_campaign' : 'UTM_Campaign',
      'converting_term' : 'UTM_Term',
      'converting_landing_page' : 'Attribution_Landing_Page',
      'original_timestamp' : 'Attribution_Original_Timestamp',
      'original_source' : 'Attribution_Original_Source',
      'original_medium' : 'Attribution_Original_Medium',
      'original_content' : 'Attribution_Original_Content',
      'original_campaign' : 'Attribution_Original_Campaign',
      'original_term' : 'Attribution_Original_Keyword',
      'original_landing_page' : 'Attribution_Original_Landing_Page'
	};
	var fields = document.getElementsByTagName('input');
  
  	for(var i = 0; i < fields.length; i++){
      	var parents_class = fields[i].parentNode.className;
    	for(var prop in a_field_names){
        	if(parents_class.indexOf(a_field_names[prop]) != -1){
            	a_field_names[prop] = fields[i].name;
            }
        }
    }

  	return a_field_names;
}
window.addEventListener("load", function(){
  	mole('setNames', acquire_field_names());
	mole('processForms');
}, false);


//Gravity Forms
function acquire_field_names(){
  	var a_field_names = {
      'converting_timestamp' : 'converting_timestamp',
      'converting_source' : 'converting_source',
      'converting_medium' : 'converting_medium',
      'converting_content' : 'converting_content',
      'converting_campaign' : 'converting_campaign',
      'converting_term' : 'converting_term',
      'converting_landing_page' : 'converting_landing_page',
      'original_timestamp' : 'original_timestamp',
      'original_source' : 'original_source',
      'original_medium' : 'original_medium',
      'original_content' : 'original_content',
      'original_campaign' : 'original_campaign',
      'original_term' : 'original_term',
      'original_landing_page' : 'original_landing_page',
	};
	var fields = document.getElementsByTagName('input');
  
  	for(var i = 0; i < fields.length; i++){  
      	if(fields[i].value != ''){
          for(var prop in a_field_names){
              if(fields[i].value == a_field_names[prop]){
                  a_field_names[prop] = fields[i].name;
              }
          }
        }
    }

  	return a_field_names;
}

window.addEventListener("load", function(){
  	mole('setNames', acquire_field_names());
	mole('processForms');
}, false);

//Set Query String on Elements
//Pass addQueryStrings queue an object. Key is element and value is HTML elements attribute to append query strings to.
window.addEventListener("load", function(){
	var attr = {
		'action' : [jQuery('form'), jQuery('#ele')],
		'href' : jQuery('.cta')
	};
	mole('addQueryStrings', attr);
}, false);


//Set Query String on iFrame
var appendIframe = setInterval(function(){
  if(typeof mole != 'undefined' && (document.readyState === "complete" || document.readyState === "loaded")){  
     
    // Pass addQueryStrings queue an object. Key is the element, and the value is the HTML element's attribute to append query strings to.
    var iframes = document.querySelectorAll('iframe'); 

    iframes.forEach(function (iframe) {
      var attr = {
        'src' : iframe,
      }; 
      mole('addQueryStrings', attr);
    }); 

    clearInterval(appendIframe);
  }
}, 500); 


//Drift Integration
var interval = setInterval(function() {
  
  if(typeof drift != 'undefined' && typeof mole != 'undefined'){
    drift.on('ready',function(api){
        var conv = session.readCookie('_conv_data');
        var orig = session.readCookie('_orig_data');
        
        insertDataObj = new insertData();
        
        var attr_obj = {
        	'converting_source' : conv.source,
          	'converting_content' : conv.content.toString(),
          	'converting_medium' : conv.medium,
          	'converting_campaign' : conv.campaign.toString(),
          	'converting_term' : conv.term,
          	'converting_timestamp' : insertDataObj.convertTimestamp(conv.timestamp),
          	'converting_landing_page' : conv.landing_page,
          	'original_source' : orig.source,
          	'original_content' : orig.content.toString(),
          	'original_medium' : orig.medium.toString(),
          	'original_campaign' : orig.campaign,
          	'original_term' : orig.term,
          	'original_timestamp' : insertDataObj.convertTimestamp(orig.timestamp),
          	'original_landing_page' :orig.landing_page
        }

        drift.api.setUserAttributes(attr_obj);
     });  
    clearInterval(interval);
  }
}, 500);

  //Ninja Forms 
  //Function to map attribution data fields to Ninja form generated hidden fields
  function acquire_field_names(fields){ 
    var a_field_names = {
      'converting_timestamp' : 'converting_timestamp',
      'converting_source' : 'converting_source',
      'converting_medium' : 'converting_medium',
      'converting_content' : 'converting_content',
      'converting_campaign' : 'converting_campaign',
      'converting_term' : 'converting_term',
      'converting_landing_page' : 'converting_landing_page',
      'original_timestamp' : 'original_timestamp',
      'original_source' : 'original_source',
      'original_medium' : 'original_medium',
      'original_content' : 'original_content',
      'original_campaign' : 'original_campaign',
      'original_term' : 'original_term',
      'original_landing_page' : 'original_landing_page',
    }; 

    var x = 0; //counter
    for(var prop in a_field_names){ 
      a_field_names[prop] = fields[x].name; 
      x++;
    }   
    //console.log(a_field_names);
    return a_field_names;
  }  
  
  var appendForms = setInterval(function(){ 
    if(typeof mole != 'undefined' && (document.readyState === "complete" || document.readyState === "loaded")){ 
      //Selector to find hidden ninja fields. 
      //This has to run late to make sure ninja forms have a chance to load before we look for hidden fields
      var ninjaFields = document.querySelectorAll('.nf-field-container input[type=hidden]');  

      //Check to see if Ninja forms exist on page
      if (ninjaFields.length > 0) {
        console.log('process ninja forms!');
        //Acquire ninja form fields and rempap them to attribution data fields 
        mole('setNames', acquire_field_names(ninjaFields));
        mole('processForms'); //Run attribution data process forms function
        //Loop through Ninja Form hidden fields
        for(var i = 0; i < ninjaFields.length; i++){ 
          //Trigger the change event, which is required by Ninja forms to know the fields value changed.
          jQuery(ninjaFields[i]).trigger( 'change' );
        }         
        clearInterval(appendForms); 
      } else {
        //Process forms with default configuration. Need this for Unbounce landing pages
        console.log('process default or unbounce forms!');
        mole('processForms');
        clearInterval(appendForms);
      }   
    }
  }, 500);  


  //Uberflip Integration
  function set_field_names(){  
    var fields = document.querySelectorAll('.uf-cta-api-fields input[data-mapping]'); 
    var attribution_data_mapping = {
      'converting_timestamp' : 'converting_timestamp',
      'converting_source' : 'converting_source',
      'converting_medium' : 'converting_medium',
      'converting_content' : 'converting_content',
      'converting_campaign' : 'converting_campaign',
      'converting_term' : 'converting_term',
      'converting_landing_page' : 'converting_landing_page',
      'original_timestamp' : 'original_timestamp',
      'original_source' : 'original_source_dra',
      'original_medium' : 'original_medium',
      'original_content' : 'original_content',
      'original_campaign' : 'original_campagin',
      'original_term' : 'original_term',
      'original_landing_page' : 'original_landing_page',  
    };  
    
    //Set Uberflip field names before we run mole name mapping
    for(var i = 0; i < fields.length; i++){   
      if (Object.values(attribution_data_mapping).indexOf( fields[i].dataset.mapping ) > -1) { 
        fields[i].setAttribute("name", fields[i].dataset.mapping); 
      }  
    }  
    
    return attribution_data_mapping;
  }
  
  //Uberflip integration
  var form = document.querySelectorAll('form.uf-cta-panel')[0]; 
  var appendForms = setInterval(function(){
    //Checks for AD base script
    //Also check if Uberflip generated the fields 
    if(typeof mole != "undefined" && (document.readyState === "complete" || document.readyState === "loaded") && ( typeof form != 'undefined' && !form.classList.contains("uf-hidden") ) ){  
      mole('setNames', set_field_names());
      mole('processForms'); 
      clearInterval(appendForms);
    } else if ( typeof form == 'undefined' ){
      clearInterval(appendForms);
    }
  }, 500); 

</script>
````