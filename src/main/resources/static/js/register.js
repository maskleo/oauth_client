(function(win){
  var regBtn = null,smsCodeBtn = null,smsCount = 90,countryLists = [],curCountryItem = null,countryWrap = null,areaLabel = null;
  
  function initTogglePwdType() {
    var pwdField = $('.input-pwd-field'),
      repwdField = $('.input-repwd-field');
    var togglePwdBtn = $('.toggle-pwd-btn'),
      toggleRepwdBtn = $('.toggle-repwd-btn');
    var pwdType = 'pwd',
      repwdType = 'pwd';
    togglePwdBtn.on('click', function () {
      pwdType = (pwdType == 'pwd' ? 'txt' : 'pwd');
      togglePwdBtn.find('.input-pwd')[pwdType == 'pwd' ? 'show' : 'hide']();
      togglePwdBtn.find('.input-txt')[pwdType != 'pwd' ? 'show' : 'hide']();
      pwdField.attr('type', pwdType == 'pwd' ? 'password' : 'text');
    });

    toggleRepwdBtn.on('click', function () {
      repwdType = (repwdType == 'pwd' ? 'txt' : 'pwd');
      toggleRepwdBtn.find('.input-repeat-pwd')[repwdType == 'pwd' ? 'show' : 'hide']();
      toggleRepwdBtn.find('.input-repeat-txt')[repwdType != 'pwd' ? 'show' : 'hide']();
      repwdField.attr('type', repwdType == 'pwd' ? 'password' : 'text');
    });
  }
  
  function initFormValidate() {
    $validator.on({
      elSelector: '.user-phone',
      rules: [{
        require: true,
        errMsg: '手机号不能为空'
      }, {
        nospace: true,
        errMsg: '不能有空字符'
      },{
        min: 5,
        max: 14,
        errMsg: '手机号在5-14位'
      }]
    }).on({
      elSelector: '.user-pwd',
      rules: [{
        require: true,
        errMsg: '密码不能为空'
      }, {
        nospace: true,
        errMsg: '密码不能有空字符'
      },{
        min: 6,
        max: 18,
        errMsg: '密码为6-18位'
      },{
        validator: function(rule,value,callback){
          var repwd = '.user-repwd',repwdVal = $('.user-repwd').val();
          if(repwdVal){
            $validator.validate({
              elSelector: repwd,
              value: repwdVal
            })
          }
          callback('');
        }          
      }]
    }).on({
      elSelector: '.user-repwd',
      rules: [{
        require: true,
        errMsg: '重复密码不能为空'
      }, {
        nospace: true,
        errMsg: '重复密码不能有空字符'
      },{
        min: 6,
        max: 18,
        errMsg: '重复密码为6-18位'
      },{
        validator: function(rule,value,callback){
          var ret = (value == $('.user-pwd').val());
          callback(ret?'':'两次密码不一致')
        }
      }]
    }).on({
      elSelector: '.user-smscode',
      rules: [{
        require: true,
        errMsg: '验证码不能为空'
      }, {
        nospace: true,
        errMsg: '验证码不能有空字符'
      },{
        min: 6,
        max: 10,
        errMsg: '验证码为4-10'
      }]
    }).addValidateListener(function(value){
      regBtn[(value?'remove':'add')+'Class']('btn-disabled');
      smsCodeBtn[($validator.has('userphone')?'add':'remove')+'Class']('btn-disabled');
    }.bind(this));
  }
  
  function filterCountryCodes(filter){
    var countyCodes = window.CountryCodes;
    if(!filter)return countyCodes;

    var resultCodes = [];
    for(var i=0,len=countyCodes.length;i<len;i++){
      var item = countyCodes[i];
      var zhName = item.zhName,code = '+' + item.code,enCode = item.enCode;
      if(zhName.indexOf(filter)>-1 || code.indexOf(filter)>-1 || enCode.indexOf(filter)>-1)resultCodes.push(item);
    }

    return resultCodes;
  }

  function countryWrapHide(){
    countryLists.forEach(function(val){$(val).off('click',countryItemEvent);});
    countryLists = [];

    countryWrap.hide();
  }

  function countryItemEvent(){
    var countryItem = $(this);
    curCountryItem = {
      zhName: countryItem.attr('data-zhname'),
      code: countryItem.attr('data-code'),
      enName: countryItem.attr('data-enname'),
    };
    areaLabel.html('+' + curCountryItem.code);
    countryWrapHide();
  }

  function initCountryList(queryInfo){
    var codes = filterCountryCodes(queryInfo);
    var isFilter = !!queryInfo;
    var countryContentDOM = $('.country-content');
    countryLists.forEach(function(val){$(val).off('click',countryItemEvent);});

    var curTitle = (isFilter?'搜索结果':'常用'),preTitle = '',countryContent = '';
    for(var i=0,len=codes.length;i<len;i++){
      var item = codes[i];
      var zhName = item.zhName,code = item.code,enCode = item.enCode;
      var charType = enCode.slice(0,1).toUpperCase();
      if(i>6 && curTitle != charType)curTitle = charType;      
      
      if(preTitle != curTitle){
        preTitle = curTitle;        
        countryContent += (i>0?'</div>':'') + '<p class="country-title" ' + (i==0?'style="margin-top:0px;"':'')+ '>' + curTitle + '</p><div class="contry-list">'
      }      
      countryContent += '<div class="country-item" data-zhname="' + zhName + '" data-enname="' + enCode + '"' + ' data-code="' + code + '"><span>' + zhName + '</span> <span class="right">+' + code + '</span></div>'      
    }
    countryContent += '</div>';
    countryContentDOM.html(countryContent);
    countryLists = countryContentDOM.find('.country-item');
    countryLists.forEach(function(val){$(val).on('click',countryItemEvent);});    
  }

  if(win.$){
    initTogglePwdType();
    initFormValidate();
    
    var searchInput = $('.search-input'),searchTimeout = -1;
    searchInput.on('input',function(){
      if(searchTimeout != -1)clearTimeout(searchTimeout);
      searchTimeout = setTimeout(function(){
        searchTimeout = -1;        
        initCountryList(searchInput.val());
      },500);      
    });
    
    $('.country-close-btn').on('click',function(){
      countryWrapHide();
    });

    countryWrap = $('.country-wrap'),areaLabel = $('.area-label');
    $('.area-code').on('click',function(){
      countryWrap.show();
      initCountryList();
    });
    
    var smsInterval = -1;
    smsCodeBtn = $('.sms-code');
    smsCodeBtn.on('click',function(){ 
      if(smsInterval != -1)return;

      var userPhone = '.user-phone'; 
      if($validator.validate({
        elSelector: userPhone,
        value: $(userPhone).val()
      })){
        smsCodeBtn.addClass('btn-disabled');
        smsCodeBtn.html('(' + smsCount+ 's)' + '获取验证码');
        smsInterval = setInterval(function(){
          smsCount --;
          if(smsCount<=0){
            clearInterval(smsInterval);
            smsInterval = -1;
            smsCount = 0;
            smsCodeBtn.removeClass('btn-disabled');
          }
          smsCodeBtn.html((smsCount<=0?'':'(' + smsCount+ 's)') + '获取验证码');
        },1000)
      }
    });

    regBtn = $('.reg-btn');
    regBtn.on('click',function(){        
      if($validator.validateAll()){
        var phone = $('.user-phone').val(),pwd = $('.user-pwd').val(),repwd = $('.user-repwd').val(),smscode = $('.user-smscode').val();
        console.log(phone,pwd,repwd,smscode)
      }
    });
  }else throw new UserException("Please load zepto.js libary.");  
})(window);