/**
 * 根据国家地区区号,校验手机号是否符合规则
 * 全局函数名: validatePhone
 * 参数:
 *            areaCode  国家地区区号
 *            phoneNum  手机号码
 */
(function(win){
  var phoneRules = [{
    rule: [
      /^1(3|4|5|7|8)\d{9}$/,
      /^1(98|99)\d{8}$/
    ],
    code: '+86'
  }, {
    rule: /^(66|62|68)\d{6}$/,
    code: '+853'
  }, {
    rule: /^(9|6)\d{7}$/,
    code: '+852'
  }, {
    rule: /^9\d{8}$/,
    code: '+886'
  }, {
    rule: /^(6|8|9)\d{8}$/,
    code: '+66'
  }, {
    rule: /^9\d{9}$/,
    code: '+63'
  }, {
    rule: /^[2-9]\d{9}$/,
    code: '+1'
  }]

  function validatePhoneNum(areaCode, phoneNum) {
    if (!areaCode || !phoneNum)return false;
    areaCode = areaCode.trim();
    phoneNum = phoneNum.trim();
    if (typeof areaCode !== 'string' || typeof phoneNum !== 'string')return false;
    for (let i = 0, len = phoneRules.length; i < len; i++) {
      let {code, rule} = phoneRules[i];
      if (code === areaCode) {
        if (rule instanceof RegExp)return !!rule.test(phoneNum);
        else if (Array.isArray(rule)) {
          for (let sub = 0, subLen = rule.length; sub < subLen; sub++) {
            var hasFind = !!rule[sub].test(phoneNum);
            if (hasFind) return hasFind;
          }
        }
      }
    }
    return false;
  }
  win.$validatePhone = validatePhoneNum;
})(window);