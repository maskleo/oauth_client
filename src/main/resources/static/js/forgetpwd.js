(function(win){
  var submitBtn = null,smsCodeBtn = null,smsCount = 90;

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
        errMsg: '账号名称不能为空'
      }, {
        nospace: true,
        errMsg: '账号名称不能有空字符'
      },{
        min: 5,
        max: 14,
        errMsg: '账号名称为5-14个字符'
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
      submitBtn[(value?'remove':'add')+'Class']('btn-disabled');
      smsCodeBtn[($validator.has('userphone')?'add':'remove')+'Class']('btn-disabled');
    }.bind(this));
  }

  if(win.$){
    initTogglePwdType();
    initFormValidate();

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

    submitBtn = $('.submit-btn');
    submitBtn.on('click',function(){
      if($validator.validateAll()){
        var phone = $('.user-phone').val()+'@qeveworld.com',pwd = $('.user-pwd').val(),repwd = $('.user-repwd').val(),smscode = $('.user-smscode').val();
        console.log(phone,pwd,repwd,smscode)
      }
    })
  }else throw new UserException("Please load zepto.js libary.");  
})(window);