$( document ).ready(function() {

// ON-LOAD
//Required Fields
$("#full_name").attr("required", true);
$("#ggu_phone").attr("required", true);
$("#emailaddress1").attr("required", true);
$("#entryterm").attr("required", true);
$("#FOS").attr("required", true);
$("#programofinterest").attr("required", true);

// Fill the optionss
var interestDateList = GetInterestDate();
$('#entryterm').empty();
$('#entryterm').append($('<option  value="">Anticipated Start</option>'));
$.each(interestDateList, function(i, p) {
    $('#entryterm').append($('<option></option>').val(i).html(i));
});

var areaOfInterestList = GetAreaOfInterest();
$('#FOS').empty();
$('#FOS').append($('<option  value="">Field of Study</option>'));
$.each(areaOfInterestList, function(i, p) {
    $('#FOS').append($('<option></option>').val(i).html(i));
});

var programOfInterest = GetProgramOfInterest();
$('#programofinterest').empty();
$('#programofinterest').prepend($('<option hidden value="">Program of Interest</option>'));
$.each(programOfInterest, function(i, p) {
    $('#programofinterest').append($('<option></option>').val(i).html(i));
});

//Load Interest Date Values
$("#entryterm > option").each(function() {
  if(this.text=="Anticipated Start"){}
  else{this.value = GetInterestDate(this.text)}
});

//Load Programs of Interest Values
$("#programofinterest > option").each(function() {
  if(this.text=="Program of Interest"){}
  else{this.value = GetProgramOfInterest(this.text)}
}); 

//Add Classes to the Programs of Interest by Academic Level
GroupByAcademicLevel();

// Set QS Values
SetQueryStream();

//Phone Number to Preferred Phone
document.getElementById("preferredphone").value = "Mobile Phone";

//Veteran Flag
document.getElementById("visaflag").value = 'no';  

//Country
document.getElementById("ggu_ggucountry").value = 'US';  

// ON-CHANGE
// Full Name to First & Last Name
document.getElementById("full_name").addEventListener("blur",function(){ FirstAndLastName(document.getElementById("full_name").value)});
//Phone to Mobile
document.getElementById("ggu_phone").addEventListener("blur", function(){document.getElementById("mobile").value = document.getElementById("ggu_phone").value.replace(/\D/g, ''); });
//Set Programs Values
SetProgramValuesOnChange();

// ON-SUBMIT
$('#lp-pom-button-16').click(function(event){
 if(!Validation()){event.preventDefault();}
});

});

// Valdiate Form
function Validation(){

  if(! ValidateName()){
    $('#full_name').keyup(function (event){ValidateName()});
    return false;
  } 

  if(! ValidateEmail()){
    $('#emailaddress1').keyup(function (event){ValidateEmail()});
    return false;
  } 

  if(! ValidatePhone()){
    $('#ggu_phone').keyup(function (event){ValidatePhone()});
    return false;
  }

return true;
}

//Validate Name
function ValidateName(){
  $('#container_full_name > span').remove();
  var inputVal = $("#full_name").val();
  var nameReg = /^[a-z\u00C0-\u02AB'Â´`]+\.?\s([a-z\u00C0-\u02AB'Â´`]+\.?\s?)+$/i;
  if(!nameReg.test(inputVal)) {
      $("#full_name").before('<span class="validation-error">Invalid Full Name Format.</span>');
      $("body").get(0).scrollIntoView();
      $("#full_name").focus();
      return false;
  }
  return true;
}

//Validate Email
function ValidateEmail(){
  $('#container_emailaddress1 > span').remove();
  var inputVal = $("#emailaddress1").val();
  var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
  if(!emailReg.test(inputVal) || inputVal == "") {
      $("#emailaddress1").after('<span class="validation-error">Invalid Email Format.</span>');
      $("body").get(0).scrollIntoView();
      $("#emailaddress1").focus();
      return false;
  }
  return true;
}

//Validate Phone Number(US)
function ValidatePhone(){
  $('#container_ggu_phone > span').remove();
  var inputVal = $("#ggu_phone").val();
  var phoneReg = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
  if(!phoneReg.test(inputVal)) {
      $("#ggu_phone").after('<span class="validation-error">Invalid Phone Number Format.</span>');
      $("body").get(0).scrollIntoView();
      $("#ggu_phone").focus();
      return false;
  }
  return true;  
}

// Fullname to First & Last Name
function FirstAndLastName(name){
var firstAndLastName = DoSplitName(document.getElementById("full_name").value);
document.getElementById("firstname").value = firstAndLastName["first"];
document.getElementById("lastname").value = firstAndLastName["last"]; 
}

//Convert Fullname to First & Last Name
function DoSplitName(name) {
var results = [];
results["salutation"] = "";
results["first"] = "";
results["last"] = "";
results["suffix"] = "";

if (name.indexOf(" ") == -1) {
results["first"] = name;
return results;
}

var r = name.split(' ');
var size = name.length;

//check first for period, assume salutation if so
if (r[0].indexOf(".") > -1) {
results["salutation"] = r[0] || "";
results["first"] = r[1] || "";
} else {
results["salutation"] = "";
results["first"] = r[0] || "";
}

//check last for period, assume suffix if so
if (typeof r[size - 1] != "undefined" && r[size - 1].indexOf(".") > -1) {
results["suffix"] = r[size - 1];
}

//combine remains into last
var start = (results['salutation']) ? 2 : 1;
var end = (results['suffix']) ? size - 2 : size - 1;

var last = '';
for (var i = start; i <= end; i++) {
last += ' ' + (r[i] || "");
}
results['last'] = last.trim();

return results;
}

//Get Anticipated Start Value
function GetInterestDate(dateLabel){
var interestsValues = {
'Summer 2020 (May 10)': '20/UA',
'Fall 2020 (September 6)': '20/FA',
'Spring 2021 (January 10)': '21/SA',
'Summer 2021 (May 9)': '21/UA',
'Fall 2021': '21/FA',
'Spring 2022': '22/SA',        
};
if(! dateLabel) {  
  return interestsValues;
}   
return interestsValues[dateLabel];
}

//Get Area of Interest
function GetAreaOfInterest(interestLabel){
var areaOfInterest = {
"Accounting":"ACTG.GR",
"Business / Data Analytics":"BA.GR",
"Business & Management":"EMBA.GR",
"Finance":"FIN.GR",
"Financial Planning":"FINP.GR",
"General Studies":"GS.GR",
"Human Resource Management":"HR.GR",
"International Business":"IB.GR",
"IT Management":"ITM.GR",
"Law":"LAW.LLM",
"Leadership":"LDR.GR",
"Marketing":"MKT.GR",
"Project Management":"PM.GR",
"Psychology":"PSY.GR",
"Public Administration":"PA.GR",
"Taxation":"TX.GR",
}
if(! interestLabel) {  
  return areaOfInterest;
}   
return areaOfInterest[interestLabel];
}

//Get Program of Interest
function GetProgramOfInterest(programLabel){      
var programOfInterest = {
'Master of Accountancy': 'MAC.ACCT.FAR',
'MS in Accounting': 'MS.ACCTG.FAR',
'Certificate in Financial Accounting & Reporting': 'CERTG.FAR',
'Certificate in Forensic Accounting':'CERTG.FORAC',
'Certificate in Internal Auditing': 'CERTG.INA',
'BS in Accounting': 'BS.ACCTG',
'Certificate in Accounting': 'CERTU.ACC18',
'MS in Business Analytics': 'MS.BA',
'Certificate in Analytics for Competitive Advantage': 'CERTG.ACA',
'BS in Data Analytics': 'BS.DA',
'MBA': 'MBA.BUSA',
'Executive MBA': 'MBA.EMBA',
'MBA/JD (Joint Degree)': 'MBA.LAW',
'Doctor of Business Administration': 'DBA.BUSA',
'BA in Management': 'BA.MGMT',
'BS in Business': 'BS.BUSN.GEN',
'Certificate in International Business': 'CERTU.INTBS',
'Certificate in Management': 'CERTU.MGT30',
'MS in Finance': 'MS.FIN',
'Certificate in Finance': 'CERTU.FIN',
'MS in Financial Planning': 'MS.FIPL',
'MS in Advanced Financial Planning': 'MS.AFP.ESTATE',
'Certificate in Financial Planning': 'CERTG.FINPL',
'Certificate in Financial Life Planning': 'CERTG.FLP',
'AA in General Studies': 'AA.GENL',
'MS in Human Resource Management': 'MS.HRM',
'Certificate in Human Resource Management': 'CERTG.HRM',
'Certificate in Conflict Resolution': 'CERTG.CNRES',
'Certificate in Developing & Rewarding People at Work': 'CERTG.HRDEV',
'Certificate in Hiring & Keeping the Right Workforce': 'CERTG.HRWK',
'Undergraduate Certificate in Human Resource Management': 'CERTU.HRMGT',
'MS in Information Technology Management': 'MS.ITM',
'Graduate Certificate in Information Technology': 'CERTG.IT',
'Undergraduate Certificate in Information Technology': 'CERTU.IT',
'Certificate in International Taxation': 'CERTG.INTAX',
'LLM in Taxation & Estate Planning': 'LLM.LAW.DUAL.TXESPL',
'LLM in Environmental Legal Studies': 'LLM.LAW.ENVR',
'LLM in Estate Planning': 'LLM.LAW.ESPL',
'LLM in International Legal Studies': 'LLM.LAW.INTL',
'LLM in Intellectual Property Law': 'LLM.LAW.IPLW',
'LLM in Taxation Law': 'LLM.LAW.TAXL',
'LLM in US Legal Studies': 'LLM.LAW.USLS',
'SJD International Legal Studies': 'SJD.LAW.INTL',
'MS in Leadership': 'MS.LEAD',
'Certificate in Essentials of Leadership': 'CERTG.LEAD.ESSEN',
'Credential in Leadership': 'CERTG.LEAD.INDI',
'BA in Organizational Leadership & Human Skills Development': 'BA.OLHS',
'MS in Marketing': 'MS.MKT.IND',
'Certificate in Marketing': 'CERTU.MKTG',
'MS in Project Management': 'MS.PM',
'Certificate in Project Management Fundamentals': 'CERTG.PMGT6',
'Certificate in Project Management Practices': 'CERTG.PMGT12',
'MA in Counseling Psychology': 'MA.COUN.PSY',
'MA in Industrial-Organizational Psychology': 'MA.IOPSY',
'Certificate in Counseling Skills': 'CERTG.COUN',
'Certificate in Industrial-Organizational Psychology': 'CERTG.IOPSY',
'BA in Psychology': 'BA.PSYCH',
'Executive Master of Public Administration (EMPA)': 'MPA.EMPA',
'Graduate Certificate in Public Administration Leadership': 'CERTG.PADL',
'Graduate Certificate in Urban Innovations': 'CERTG.URBAN',
'Undergraduate Certificate in Public Administration Leadership': 'CERTU.PADL',
'MS in Taxation': 'MS.TAX',
'Certificate in Taxation': 'CERTG.TAX',
'Certificate in Advanced Studies in Taxation': 'CERTG.ADTAX',
'Certificate in Estate Planning': 'CERTG.ESTAT',
'Certificate in State & Local Tax': 'CERTG.SALT',
'Certificate in Adaptive Leadership': 'CERTG.ADL',
}
if(! programLabel) {  
  return programOfInterest;
}   
return programOfInterest[programLabel]; 
}

//Set values to Query Stream Inputs
function SetQueryStream(){

var qsValues = GetUrlVars();
console.log(qsValues);

var channel = qsValues["channel"];
var source = qsValues["source"];
var utmSource = qsValues["utm_source"];
var utmMedium = qsValues["utm_medium"]; 
var utmCampaign = qsValues["utm_campaign"];
var utmTerm = qsValues["utm_term"];
var utmContent = qsValues["utm_content"]; 
var utmClientId = qsValues["utm_clientId"]; 
var inquirySource = qsValues["inquiry_source"]; 

//Field of Study
// console.log(decodeURIComponent(qsValues["FOS"]));
$('#FOS').find('option[text="'+decodeURIComponent(qsValues["FOS"])+'"]').attr('selected','selected');
$('#FOS').trigger('change');

$("#ggu_channel").val(channel);
$("#inquirysource").val(inquirySource); 
$("#ggu_source").val(source); 
$("#ggu_utm_source").val(utmSource);
$("#ggu_utm_medium").val(utmMedium);
$("#ggu_utm_campaign").val(utmCampaign);
$("#ggu_utm_term").val(utmTerm);
$("#ggu_utm_content").val(utmContent);
$("#ggu_utm_clientId").val(utmClientId);

return true;
}

// Get Values From the Query Stream
function GetUrlVars() {
var vars = {};
var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
  vars[key] = value;
});
return vars;
}

//Add Classes to group the Programs of Interest by Academic Level.
function GroupByAcademicLevel(){

// Add classes to programs related with Accounting
$('select#programofinterest option[value=""]').addClass('accounting bda bm finance fp gen hr ib it law lead marketing pm psych pa scm tax');
$('select#programofinterest option[value="LAST"], select#programofinterest option[value="CERTG.FAR"], select#programofinterest option[value="CERTG.INA"], select#programofinterest option[value="CERTU.ACC18"], select#programofinterest option[value="BS.ACCTG"], select#programofinterest option[value="MAC.ACCT.FAR"], select#programofinterest option[value="MS.ACCTG.FAR"], select#programofinterest option[value="CERTG.FORAC"]').addClass('accounting');
$('select#programofinterest option[value="MAC.ACCT.FAR"], select#programofinterest option[value="MS.ACCTG.FAR"], select#programofinterest option[value="CERTG.FAR"], select#programofinterest option[value="CERTG.FORAC"], select#programofinterest option[value="CERTG.INA"]').addClass('graduateAcc');
$('select#programofinterest option[value="BS.ACCTG"], select#programofinterest option[value="CERTU.ACC18"]').addClass('undergraduateAcc');

// Add classes to programs related with Business / Data Analytics
$('select#programofinterest option[value="MS.BA"], select#programofinterest option[value="BS.DA"], select#programofinterest option[value="CERTG.ACA"]').addClass('bda');
$('select#programofinterest option[value="MS.BA"], select#programofinterest option[value="CERTG.ACA"]').addClass('graduateBDA');
$('select#programofinterest option[value="BS.DA"]').addClass('undergraduateBDA');

// Add classes to programs related with Business Management
$('select#programofinterest option[value="DBA.BUSA"], select#programofinterest option[value="MBA.EMBA"], select#programofinterest option[value="MBA.BUSA"], select#programofinterest option[value="CERTU.MGT30"], select#programofinterest option[value="BA.MGMT"], select#programofinterest option[value="BS.BUSN.GEN"], select#programofinterest option[value="MBA.LAW"], select#programofinterest option[value="CERTU.INTBS"]').addClass('bm');
$('select#programofinterest option[value="MBA.BUSA"], select#programofinterest option[value="MBA.EMBA"], select#programofinterest option[value="MBA.LAW"], select#programofinterest option[value="DBA.BUSA"]').addClass('graduateBM');
$('select#programofinterest option[value="BA.MGMT"], select#programofinterest option[value="BS.BUSN.GEN"], select#programofinterest option[value="CERTU.INTBS"], select#programofinterest option[value="CERTU.MGT30"]').addClass('undergraduateBM');

// Add classes to programs related with Finance
$('select#programofinterest option[value="CERTU.FIN"], select#programofinterest option[value="MS.FIN"]').addClass('finance');
$('select#programofinterest option[value="MS.FIN"]').addClass('graduateFIN');
$('select#programofinterest option[value="CERTU.FIN"]').addClass('undergraduateFIN');

// Add classes to programs related with Financial Planning
$('select#programofinterest option[value="MS.FIPL"], select#programofinterest option[value="CERTG.FLP"], select#programofinterest option[value="CERTG.FINPL"], select#programofinterest option[value="MS.AFP.ESTATE"]').addClass('fp');
$('select#programofinterest option[value="MS.FIPL"], select#programofinterest option[value="MS.AFP.ESTATE"], select#programofinterest option[value="CERTG.FINPL"], select#programofinterest option[value="CERTG.FLP"]').addClass('graduateFP');

// Add classes to programs related with General Studies
$('select#programofinterest option[value="AA.GENL"]').addClass('gen');
$('select#programofinterest option[value="AA.GENL"]').addClass('undergraduateGEN');

// Add classes to programs related with Human Resource Management
$('select#programofinterest option[value="MS.HRM"], select#programofinterest option[value="CERTG.HRDEV"], select#programofinterest option[value="CERTG.HRM"], select#programofinterest option[value="CERTU.HRMGT"], select#programofinterest option[value="CERTG.HRWK"], select#programofinterest option[value="CERTG.CNRES"]').addClass('hr');
$('select#programofinterest option[value="MS.HRM"], select#programofinterest option[value="CERTG.CNRES"], select#programofinterest option[value="CERTG.HRDEV"], select#programofinterest option[value="CERTG.HRWK"], select#programofinterest option[value="CERTG.HRM"]').addClass('graduateHR');
$('select#programofinterest option[value="CERTU.HRMGT"]').addClass('undergraduateHR');

// Add classes to programs related with International Business
$('select#programofinterest option[value="CERTU.INTBS"], select#programofinterest option[value="CERTG.INTAX"]').addClass('ib');
$('select#programofinterest option[value="CERTG.INTAX"]').addClass('graduateIB');
$('select#programofinterest option[value="CERTU.INTBS"]').addClass('undergraduateIB');

// Add classes to programs related with IT Management
$('select#programofinterest option[value="MS.ITM"], select#programofinterest option[value="CERTG.IT"], select#programofinterest option[value="CERTU.IT"]').addClass('it');
$('select#programofinterest option[value="MS.ITM"], select#programofinterest option[value="CERTG.IT"]').addClass('graduateIT');
$('select#programofinterest option[value="CERTU.IT"]').addClass('undergraduateIT');

// Add classes to programs related with Law
$('select#programofinterest option[value="LLM.LAW.DUAL.TXESPL"], select#programofinterest option[value="LLM.LAW.ENVR"], select#programofinterest option[value="LLM.LAW.ESPL"], select#programofinterest option[value="LLM.LAW.INTL"], select#programofinterest option[value="LLM.LAW.IPLW"], select#programofinterest option[value="LLM.LAW.TAXL"], select#programofinterest option[value="LLM.LAW.USLS"], select#programofinterest option[value="SJD.LAW.INTL"], select#programofinterest option[value="MBA.LAW"]').addClass('law');

// Add classes to programs related with Leadership
$('select#programofinterest option[value="MS.LEAD"], select#programofinterest option[value="CERTG.LEAD.ESSEN"], select#programofinterest option[value="CERTG.LEAD.INDI"], select#programofinterest option[value="BA.OLHS"], select#programofinterest option[value="CERTG.ADL"]').addClass('lead');
$('select#programofinterest option[value="MS.LEAD"], select#programofinterest option[value="CERTG.LEAD.ESSEN"], select#programofinterest option[value="CERTG.LEAD.INDI"], select#programofinterest option[value="CERTG.ADL"]').addClass('graduateLEAD');
$('select#programofinterest option[value="BA.OLHS"]').addClass('undergraduateLEAD');

// Add classes to programs related with Marketing
$('select#programofinterest option[value="CERTU.MKTG"], select#programofinterest option[value="MS.MKT.IND"]').addClass('marketing');
$('select#programofinterest option[value="MS.MKT.IND"]').addClass('graduateMKTG');
$('select#programofinterest option[value="CERTU.MKTG"]').addClass('undergraduateMKTG');

// Add classes to programs related with Project Management
$('select#programofinterest option[value="MS.PM"], select#programofinterest option[value="CERTG.PMGT6"], select#programofinterest option[value="CERTG.PMGT12"]').addClass('pm');
$('select#programofinterest option[value="MS.PM"], select#programofinterest option[value="CERTG.PMGT6"], select#programofinterest option[value="CERTG.PMGT12"]').addClass('graduatePM');

// Add classes to programs related with Psychology
$('select#programofinterest option[value="MA.COUN.PSY"], select#programofinterest option[value="MA.IOPSY"], select#programofinterest option[value="CERTG.CNRES"], select#programofinterest option[value="CERTG.COUN"], select#programofinterest option[value="CERTG.IOPSY"], select#programofinterest option[value="BA.PSYCH"]').addClass('psych');
$('select#programofinterest option[value="MA.COUN.PSY"],select#programofinterest option[value="MA.IOPSY"], select#programofinterest option[value="CERTG.CNRES"], select#programofinterest option[value="CERTG.COUN"], select#programofinterest option[value="CERTG.IOPSY"]').addClass('graduatePSY');
$('select#programofinterest option[value="BA.PSYCH"]').addClass('undergraduatePSY');

// Add classes to programs related with Public Administration
$('select#programofinterest option[value="MPA.EMPA"], select#programofinterest option[value="CERTG.PADL"], select#programofinterest option[value="CERTG.URBAN"], select#programofinterest option[value="CERTU.PADL"]').addClass('pa');
$('select#programofinterest option[value="MPA.EMPA"], select#programofinterest option[value="CERTG.PADL"], select#programofinterest option[value="CERTG.URBAN"]').addClass('graduatePA');
$('select#programofinterest option[value="CERTU.PADL"]').addClass('undergraduatePA');


// Add classes to programs related with Public Taxation
$('select#programofinterest option[value="MS.TAX"], select#programofinterest option[value="CERTG.ADTAX"], select#programofinterest option[value="CERTG.ESTAT"], select#programofinterest option[value="CERTG.INTAX"], select#programofinterest option[value="CERTG.SALT"], select#programofinterest option[value="CERTG.TAX"]').addClass('tax');
$('select#programofinterest option[value="MS.TAX"], select#programofinterest option[value="CERTG.ADTAX"], select#programofinterest option[value="CERTG.ESTAT"], select#programofinterest option[value="CERTG.INTAX"], select#programofinterest option[value="CERTG.SALT"], select#programofinterest option[value="CERTG.TAX"]').addClass('graduateTAX');


document.getElementById("programofinterest").disabled = true;

$('#FOS').change(function() {
document.getElementById("programofinterest").selectedIndex = 0;
if($('#FOS option:first-child').is(':selected')){
  $("#programofinterest").children('optgroup').children().unwrap();
  $("#programofinterest").children('option').wrap('<span>');
  $("#programofinterest").children('option').unwrap();
  $('select#programofinterest option[value=""]').unwrap();
  document.getElementById("programofinterest").disabled = true;
}
else{
  document.getElementById("programofinterest").disabled = false;
  $("#programofinterest").children('optgroup').children().unwrap();
  $("#programofinterest").children('option').wrap('<span>');
  $("#programofinterest").children('span').hide();
  
  if($('#FOS option[value="Accounting"]').is(':selected')){
    $('option.accounting').unwrap();
    $('option.graduateAcc').wrapAll('<optgroup label="Graduate" />');
    $('option.undergraduateAcc').wrapAll('<optgroup label="Undergraduate" />');
  }
  else if($('#FOS option[value="Business / Data Analytics"]').is(':selected')){
    $('option.bda').unwrap();
    $('option.graduateBDA').wrapAll('<optgroup label="Graduate" />');
    $('option.undergraduateBDA').wrapAll('<optgroup label="Undergraduate" />');
  }
  else if($('#FOS option[value="Business & Management"]').is(':selected')){
    $('option.bm').unwrap();
    $('option.graduateBM').wrapAll('<optgroup label="Graduate" />');
    $('option.undergraduateBM').wrapAll('<optgroup label="Undergraduate" />');
  }
  else if($('#FOS option[value="Finance"]').is(':selected')){
    $('option.finance').unwrap();
    $('option.graduateFIN').wrapAll('<optgroup label="Graduate" />');
    $('option.undergraduateFIN').wrapAll('<optgroup label="Undergraduate" />');
  }
  else if($('#FOS option[value="Financial Planning"]').is(':selected')){
    $('option.fp').unwrap();
    $('option.graduateFP').wrapAll('<optgroup label="Graduate" />');
  }
  else if($('#FOS option[value="General Studies"]').is(':selected')){
    $('option.gen').unwrap();
    $('option.undergraduateGEN').wrapAll('<optgroup label="Undergraduate" />');
  }
  else if($('#FOS option[value="Human Resource Management"]').is(':selected')){
    $('option.hr').unwrap();
    $('option.graduateHR').wrapAll('<optgroup label="Graduate" />');
    $('option.undergraduateHR').wrapAll('<optgroup label="Undergraduate" />');
  }
  else if($('#FOS option[value="IT Management"]').is(':selected')){
    $('option.it').unwrap();
    $('option.graduateIT').wrapAll('<optgroup label="Graduate" />');
    $('option.undergraduateIT').wrapAll('<optgroup label="Undergraduate" />');
  }
  else if($('#FOS option[value="International Business"]').is(':selected')){
    $('option.ib').unwrap();
    $('option.graduateIB').wrapAll('<optgroup label="Graduate" />');
    $('option.undergraduateIB').wrapAll('<optgroup label="Undergraduate" />');
  }
  else if($('#FOS option[value="Law"]').is(':selected')){
    $('option.law').unwrap();
  }
  else if($('#FOS option[value="Leadership"]').is(':selected')){
    $('option.lead').unwrap();
    $('option.graduateLEAD').wrapAll('<optgroup label="Graduate" />');
    $('option.undergraduateLEAD').wrapAll('<optgroup label="Undergraduate" />');
  }
  else if($('#FOS option[value="Marketing"]').is(':selected')){
    $('option.marketing').unwrap();
    $('option.graduateMKTG').wrapAll('<optgroup label="Graduate" />');
    $('option.undergraduateMKTG').wrapAll('<optgroup label="Undergraduate" />');
  }
  else if($('#FOS option[value="Project Management"]').is(':selected')){
    $('option.pm').unwrap();
    $('option.graduatePM').wrapAll('<optgroup label="Graduate" />');
  }
  else if($('#FOS option[value="Psychology"]').is(':selected')){
    $('option.psych').unwrap();
    $('option.graduatePSY').wrapAll('<optgroup label="Graduate" />');
    $('option.undergraduatePSY').wrapAll('<optgroup label="Undergraduate" />');
  }
  else if($('#FOS option[value="Public Administration"]').is(':selected')){
    $('option.pa').unwrap();
    $('option.graduatePA').wrapAll('<optgroup label="Graduate" />');
    $('option.undergraduatePA').wrapAll('<optgroup label="Undergraduate" />');
  }
  else if($('#FOS option[value="Taxation"]').is(':selected')){
    $('option.tax').unwrap();
    $('option.graduateTAX').wrapAll('<optgroup label="Graduate" />');
  }

  $("#programofinterest").val($("#programofinterest option:first").val());
}
});
}

//Set values to areaofinterest, academiclevel, programtype. on option change 
function SetProgramValuesOnChange(){
$("#programofinterest").change(function() {
if ($(this).val() == 'CERTG.FAR'){
  $('#ggu_AreaofInterest').val('ACTG.GC');
  $('#academiclevel').val('GR');
  $('#ggu_programtype').val('C-GRAD');
}

else if ($(this).val() == 'CERTG.INA'){
  $('#ggu_AreaofInterest').val('ACTG.GC');
  $('#academiclevel').val('GR');
  $('#ggu_programtype').val('C-GRAD');
}
else if ($(this).val() == 'CERTU.ACC18'){
  $('#ggu_AreaofInterest').val('ACTG.UC');
  $('#academiclevel').val('UG');
  $('#ggu_programtype').val('C-UG');
}
else if ($(this).val() == 'BS.ACCTG'){
  $('#ggu_AreaofInterest').val('ACTG.UD');
  $('#academiclevel').val('UG');
  $('#ggu_programtype').val('DS-UG');
}
else if ($(this).val() == 'MAC.ACCT.FAR'){
  $('#ggu_AreaofInterest').val('ACTG.GR');
  $('#academiclevel').val('GR');
  $('#ggu_programtype').val('DS-GRAD');
}
else if ($(this).val() == 'MS.ACCTG.FAR'){
  $('#ggu_AreaofInterest').val('ACTG.GR');
  $('#academiclevel').val('GR');
  $('#ggu_programtype').val('DS-GRAD');
}
else if ($(this).val() == 'MS.BA'){
  $('#ggu_AreaofInterest').val('BA.GR');
  $('#academiclevel').val('GR');
  $('#ggu_programtype').val('DS-GRAD');
}
else if ($(this).val() == 'CERTG.HRWK'){
  $('#ggu_AreaofInterest').val('HR.GC');
  $('#academiclevel').val('GR');
  $('#ggu_programtype').val('C-GRAD');
}
else if ($(this).val() == 'BS.DA'){
  $('#ggu_AreaofInterest').val('BA.UD');
  $('#academiclevel').val('UG');
  $('#ggu_programtype').val('DS-UG');
}
else if ($(this).val() == 'DBA.BUSA'){
  $('#ggu_AreaofInterest').val('DBA.DR');
  $('#academiclevel').val('DR');
  $('#ggu_programtype').val('DS-DR');
}
else if ($(this).val() == 'MBA.EMBA'){
  $('#ggu_AreaofInterest').val('EMBA.GR');
  $('#academiclevel').val('GR');
  $('#ggu_programtype').val('DS-GRAD');
}
else if ($(this).val() == 'MBA.BUSA'){
  $('#ggu_AreaofInterest').val('MBA.GR');
  $('#academiclevel').val('GR');
  $('#ggu_programtype').val('DS-GRAD');
}
else if ($(this).val() == 'CERTU.MGT30'){
  $('#ggu_AreaofInterest').val('MGMT.UC');
  $('#academiclevel').val('UG');
  $('#ggu_programtype').val('C-UG');
}
else if ($(this).val() == 'BA.MGMT'){
  $('#ggu_AreaofInterest').val('MGMT.UD');
  $('#academiclevel').val('UG');
  $('#ggu_programtype').val('DS-UG');
}
else if ($(this).val() == 'BS.BUSN.GEN'){
  $('#ggu_AreaofInterest').val('MGMT.UD');
  $('#academiclevel').val('UG');
  $('#ggu_programtype').val('DS-UG');
}
else if ($(this).val() == 'CERTU.FIN'){
  $('#ggu_AreaofInterest').val('FIN.UC');
  $('#academiclevel').val('UG');
  $('#ggu_programtype').val('C-UG');
}
else if ($(this).val() == 'MS.FIN'){
  $('#ggu_AreaofInterest').val('FIN.GR');
  $('#academiclevel').val('GR');
  $('#ggu_programtype').val('DS-GRAD');
}
else if ($(this).val() == 'MS.FIPL'){
  $('#ggu_AreaofInterest').val('FINP.GR');
  $('#academiclevel').val('GR');
  $('#ggu_programtype').val('DS-GRAD');
}
else if ($(this).val() == 'CERTG.FLP'){
  $('#ggu_AreaofInterest').val('FINP.GC');
  $('#academiclevel').val('GR');
  $('#ggu_programtype').val('C-GRAD');
}
else if ($(this).val() == 'CERTG.FINPL'){
  $('#ggu_AreaofInterest').val('FINP.GC');
  $('#academiclevel').val('GR');
  $('#ggu_programtype').val('C-GRAD');
}
else if ($(this).val() == 'CERTG.FORAC'){
  $('#ggu_AreaofInterest').val('ACTG.GC');
  $('#academiclevel').val('GR');
  $('#ggu_programtype').val('C-GRAD');
}
else if ($(this).val() == 'MS.AFP.ESTATE'){
  $('#ggu_AreaofInterest').val('FINP.GR');
  $('#academiclevel').val('GR');
  $('#ggu_programtype').val('DS-GRAD');
}
else if ($(this).val() == 'AA.GENL'){
  $('#ggu_AreaofInterest').val('GS.UD');
  $('#academiclevel').val('UG');
  $('#ggu_programtype').val('DS-UG');
}
else if ($(this).val() == 'MS.HRM'){
  $('#ggu_AreaofInterest').val('HR.GR');
  $('#academiclevel').val('GR');
  $('#ggu_programtype').val('DS-GRAD');
}
else if ($(this).val() == 'CERTG.HRDEV'){
  $('#ggu_AreaofInterest').val('HR.GC');
  $('#academiclevel').val('GR');
  $('#ggu_programtype').val('C-GRAD');
}
else if ($(this).val() == 'CERTG.HRM'){
  $('#ggu_AreaofInterest').val('HR.GC');
  $('#academiclevel').val('GR');
  $('#ggu_programtype').val('C-GRAD');
}
else if ($(this).val() == 'CERTU.HRMGT'){
  $('#ggu_AreaofInterest').val('HR.UC');
  $('#academiclevel').val('UG');
  $('#ggu_programtype').val('C-UG');
}
else if ($(this).val() == 'CERTU.INTBS'){
  $('#ggu_AreaofInterest').val('IB.UC');
  $('#academiclevel').val('UG');
  $('#ggu_programtype').val('C-UG');
}
else if ($(this).val() == 'MS.ITM'){
  $('#ggu_AreaofInterest').val('ITM.GR');
  $('#academiclevel').val('GR');
  $('#ggu_programtype').val('DS-GRAD');
}
else if ($(this).val() == 'CERTG.IT'){
  $('#ggu_AreaofInterest').val('ITM.GC');
  $('#academiclevel').val('GR');
  $('#ggu_programtype').val('C-GRAD');
}
else if ($(this).val() == 'CERTU.IT'){
  $('#ggu_AreaofInterest').val('ITM.UC');
  $('#academiclevel').val('UG');
  $('#ggu_programtype').val('C-UG');
}
else if ($(this).val() == 'MBA.LAW'){
  $('#ggu_AreaofInterest').val('LAW.JD');
  $('#academiclevel').val('LAW');
  $('#ggu_programtype').val('DS-JD');
}
else if ($(this).val() == 'LLM.LAW.DUAL.TXESPL'){
  $('#ggu_AreaofInterest').val('LAW.LLM');
  $('#academiclevel').val('LLM');
  $('#ggu_programtype').val('DS-LLM');
}
else if ($(this).val() == 'LLM.LAW.ENVR'){
  $('#ggu_AreaofInterest').val('LAW.LLM');
  $('#academiclevel').val('LLM');
  $('#ggu_programtype').val('DS-LLM');
}
else if ($(this).val() == 'LLM.LAW.ESPL'){
  $('#ggu_AreaofInterest').val('LAW.LLM');
  $('#academiclevel').val('LLM');
  $('#ggu_programtype').val('DS-LLM');
}
else if ($(this).val() == 'LLM.LAW.INTL'){
  $('#ggu_AreaofInterest').val('LAW.LLM');
  $('#academiclevel').val('LLM');
  $('#ggu_programtype').val('DS-LLM');
}
else if ($(this).val() == 'LLM.LAW.IPLW'){
  $('#ggu_AreaofInterest').val('LAW.LLM');
  $('#academiclevel').val('LLM');
  $('#ggu_programtype').val('DS-LLM');
}
else if ($(this).val() == 'LLM.LAW.TAXL'){
  $('#ggu_AreaofInterest').val('LAW.LLM');
  $('#academiclevel').val('LLM');
  $('#ggu_programtype').val('DS-LLM');
}
else if ($(this).val() == 'LLM.LAW.USLS'){
  $('#ggu_AreaofInterest').val('LAW.LLM');
  $('#academiclevel').val('LLM');
  $('#ggu_programtype').val('DS-LLM');
}
else if ($(this).val() == 'SJD.LAW.INTL'){
  $('#ggu_AreaofInterest').val('LAW.SJD');
  $('#academiclevel').val('SJD');
  $('#ggu_programtype').val('DS-SJD');
}
else if ($(this).val() == 'MS.LEAD'){
  $('#ggu_AreaofInterest').val('LDR.GR');
  $('#academiclevel').val('GR');
  $('#ggu_programtype').val('DS-GRAD');
}
else if ($(this).val() == 'CERTG.LEAD.ESSEN'){
  $('#ggu_AreaofInterest').val('LDR.GC');
  $('#academiclevel').val('GR');
  $('#ggu_programtype').val('C-GRAD');
}
else if ($(this).val() == 'CERTG.LEAD.INDI'){
  $('#ggu_AreaofInterest').val('LDR.GC');
  $('#academiclevel').val('GR');
  $('#ggu_programtype').val('C-GRAD');
}
else if ($(this).val() == 'BA.OLHS'){
  $('#ggu_AreaofInterest').val('LDR.UD');
  $('#academiclevel').val('UG');
  $('#ggu_programtype').val('DS-UG');
}
else if ($(this).val() == 'CERTU.MKTG'){
  $('#ggu_AreaofInterest').val('MKT.UC');
  $('#academiclevel').val('UG');
  $('#ggu_programtype').val('C-UG');
}
else if ($(this).val() == 'MS.MKT.IND'){
  $('#ggu_AreaofInterest').val('MKT.GR');
  $('#academiclevel').val('GR');
  $('#ggu_programtype').val('DS-GRAD');
}
else if ($(this).val() == 'MS.PM'){
  $('#ggu_AreaofInterest').val('PM.GR');
  $('#academiclevel').val('GR');
  $('#ggu_programtype').val('DS-GRAD');
}
else if ($(this).val() == 'CERTG.PMGT6'){
  $('#ggu_AreaofInterest').val('PM.GC');
  $('#academiclevel').val('GR');
  $('#ggu_programtype').val('C-GRAD');
}
else if ($(this).val() == 'CERTG.PMGT12'){
  $('#ggu_AreaofInterest').val('PM.GC');
  $('#academiclevel').val('GR');
  $('#ggu_programtype').val('C-GRAD');
}
else if ($(this).val() == 'MA.COUN.PSY'){
  $('#ggu_AreaofInterest').val('PSY.GR');
  $('#academiclevel').val('GR');
  $('#ggu_programtype').val('DS-GRAD');
}
else if ($(this).val() == 'MA.IOPSY'){
  $('#ggu_AreaofInterest').val('PSY.GR');
  $('#academiclevel').val('GR');
  $('#ggu_programtype').val('DS-GRAD');
}
else if ($(this).val() == 'CERTG.CNRES'){
  $('#ggu_AreaofInterest').val('PSY.GC');
  $('#academiclevel').val('GR');
  $('#ggu_programtype').val('C-GRAD');
}
else if ($(this).val() == 'CERTG.COUN'){
  $('#ggu_AreaofInterest').val('PSY.GC');
  $('#academiclevel').val('GR');
  $('#ggu_programtype').val('C-GRAD');
}
else if ($(this).val() == 'CERTG.IOPSY'){
  $('#ggu_AreaofInterest').val('PSY.GC');
  $('#academiclevel').val('GR');
  $('#ggu_programtype').val('C-GRAD');
}
else if ($(this).val() == 'BA.PSYCH'){
  $('#ggu_AreaofInterest').val('PSY.UD');
  $('#academiclevel').val('UG');
  $('#ggu_programtype').val('DS-UG');
}
else if ($(this).val() == 'MPA.EMPA'){
  $('#ggu_AreaofInterest').val('PA.GR');
  $('#academiclevel').val('GR');
  $('#ggu_programtype').val('DS-GRAD');
}
else if ($(this).val() == 'CERTG.PADL'){
  $('#ggu_AreaofInterest').val('PA.GC');
  $('#academiclevel').val('GR');
  $('#ggu_programtype').val('C-GRAD');
}
else if ($(this).val() == 'CERTG.URBAN'){
  $('#ggu_AreaofInterest').val('PA.GC');
  $('#academiclevel').val('GR');
  $('#ggu_programtype').val('C-GRAD');
}
else if ($(this).val() == 'CERTU.PADL'){
  $('#ggu_AreaofInterest').val('PA.UC');
  $('#academiclevel').val('UG');
  $('#ggu_programtype').val('C-UG');
}
else if ($(this).val() == 'CERTG.ACA'){
  $('#ggu_AreaofInterest').val('BA.GC');
  $('#academiclevel').val('GR');
  $('#ggu_programtype').val('C-GRAD');
}

else if ($(this).val() == 'MS.TAX'){
  $('#ggu_AreaofInterest').val('TX.GR');
  $('#academiclevel').val('GR');
  $('#ggu_programtype').val('DS-GRAD');
}
else if ($(this).val() == 'CERTG.ADTAX'){
  $('#ggu_AreaofInterest').val('TX.GC');
  $('#academiclevel').val('GR');
  $('#ggu_programtype').val('C-GRAD');
}
else if ($(this).val() == 'CERTG.ESTAT'){
  $('#ggu_AreaofInterest').val('TX.GC');
  $('#academiclevel').val('GR');
  $('#ggu_programtype').val('C-GRAD');
}
else if ($(this).val() == 'CERTG.INTAX'){
  $('#ggu_AreaofInterest').val('TX.GC');
  $('#academiclevel').val('GR');
  $('#ggu_programtype').val('C-GRAD');
}
else if ($(this).val() == 'CERTG.SALT'){
  $('#ggu_AreaofInterest').val('TX.GC');
  $('#academiclevel').val('GR');
  $('#ggu_programtype').val('C-GRAD');
}
else if ($(this).val() == 'CERTG.TAX'){
  $('#ggu_AreaofInterest').val('TX.GC');
  $('#academiclevel').val('GR');
  $('#ggu_programtype').val('C-GRAD');
}
else if ($(this).val() == 'CERTG.ADL'){
  $('#ggu_AreaofInterest').val('LDR.GC');
  $('#academiclevel').val('GR');
  $('#ggu_programtype').val('C-GRAD');
}
else {
  $('#ggu_AreaofInterest').val('');
  $('#academiclevel').val('');
  $('#ggu_programtype').val('');
}
});

$("#FOS").change(function() {
$('#ggu_AreaofInterest').val('');
$('#academiclevel').val('');
$('#ggu_programtype').val('');
});
}
