(function (win) {
  if(!win.$)throw new UserException("Please load zepto.js libary.");  

  var _validators = [],_validateCallBack = null,_errors = {};

  //校验规则
  function _validateByValue(opts){
    opts = Object.assign({},opts);
    var selector = opts.elSelector;    
    var elem = $(selector);
    if(!elem)return false;
    var parentItem = $(elem.parent()),errItem = $(parentItem.parent().find('.err-tip')); 
    var rules = opts.rules;
    rules = rules || []; 

    var value = opts.value || '';
    value = value.trim();

    var errName = selector.split('.').join('').split('-').join('');
    delete _errors[errName];

    if(!opts.mute){
      parentItem.removeClass('err-border');
      errItem.html('');
    }    

    var validated = true;
    for(var i=0,len=rules.length;i<len;i++){
      var rule = rules[i],valited = true,errMsg = rule.errMsg;            
      if(rule.require)valited = ((value+'').length!=0);   
      if(valited && rule.nospace)valited = value.indexOf(' ')==-1;
      if(valited && rule.min && rule.max){
        var max = Math.max(rule.min,rule.max);
        var min = Math.min(rule.min,rule.max);
        var vlen = value.length;
        valited = (vlen>=min && vlen<=max);
      }else if(valited && rule.min)valited = value.length>=rule.min; 
      else if(valited && rule.max)valited = value.length<=rule.max;
      
      if(valited && rule.validator instanceof Function){
        rule.validator(rule,value,function(errTip){
          valited = (errTip=='');
          errMsg = errTip;
        })
      }
      if(!valited)_errors[errName] = errMsg;
      
      if(!opts.mute){
        if(!valited){
          parentItem.addClass('err-border');
          errItem.html(errMsg); 
          if(_validateCallBack)_validateCallBack(Object.keys(_errors)==0);       
          return false;
        }
      }else if(validated)validated = valited;
    }
    if(_validateCallBack)_validateCallBack(Object.keys(_errors)==0);
    return validated;
  }

  //表单验证全局方法导出
  win.$validator = {
    addValidateListener: function(cb){
      _validateCallBack = cb;
    },
    on: function(opts){
      opts = opts || {};
      var selector = opts.elSelector;
      var elem = $(selector);
      if(!elem)return;
      var trigger = [];
      if((typeof opts.trigger) == 'string'){
        trigger.push(opts.trigger);
      }else if(opts.trigger instanceof Array){
        trigger = opts.trigger.concat([]);        
      }else{
        trigger.push('blur');
      }

      if(trigger.length>0){
        function _validateFunc(){
          return _validateByValue(Object.assign(opts,{value:this.value}));
        }
        var errName = selector.split('.').join('').split('-').join('');
        _errors[errName] = '';
        for(var i=0,len=trigger.length;i<len;i++)elem.on(trigger[i], _validateFunc);
        _validators.push(
          {
            elSelector: selector,
            rules:opts.rules,
            triggers: trigger
          }
        );
      }
      return this;
    },
    /**
     * 校验单个字段数据,提示错误信息
     * 函数名: validate
     * 参数: opts 对象
     *        elSelector  元素选择器
     *        value       值
     */
    validate: function(opts){
      if(!opts)return false;
      if(!opts.elSelector)return false;

      var elSelector = opts.elSelector;
      var rules = opts.rules;
      rules = rules || [];
      for(let i=0,len=_validators.length;i<len;i++){
        var validateItem = _validators[i];
        if(validateItem.elSelector === elSelector){
          return _validateByValue(Object.assign(validateItem,{value: opts.value}));
        }
      }
      return false;
    },
    /**
     * 校验所有表单数据,提示错误信息
     * 函数名: validateAll
     * 参数:   空 
     */
    validateAll: function(){
      var resultAll = true;
      for(let i=0,len=_validators.length;i<len;i++){
        var item = _validators[i];
        for(let t=0,tlen=item.triggers.length;t<tlen;t++){
          var result = _validateByValue({
            elSelector: item.elSelector,
            rules: item.rules,
            value: $(item.elSelector).val()
          })
          if(resultAll)resultAll = result;
        }
      }
      return resultAll;
    },
    has: function(errName){
      if(!errName)return false;
      var keys = Object.keys(_errors);
      for(var i=0,len=keys.length;i<len;i++){
        if(errName == keys[i]){
          return true;
        }
      }
      return false;
    },
    errors:function(){
      return Object.assign({},_errors)
    }
  }
})(window);