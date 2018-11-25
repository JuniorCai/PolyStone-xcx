class regCheck{
  constructor(){
    this.userNameReg = /^[a-zA-Z][a-zA-Z0-9_]{3,19}$/;
    this.phoneNumbrReg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    this.passwordReg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{5,19}$/;
  }
  
  checkUserNameReg(userName){
    if (!this.userNameReg.test(userName)) {
      wx.showToast({
        title: '用户名长度为4-20位。仅支持英文、数字和下划线,且首位为英文',
        icon: "none",
        duration: 1500
      })
      return false;
    }
    return true;
  }

  checkPasswordReg(password){
    if (!this.passwordReg.test(password)) {
      wx.showToast({
        title: '登录密码仅支持6-20位英文、数字的组合',
        icon: "none",
        duration: 1500
      })
      return false;
    }
    return true;
  }

  checkPhoneNumberReg(phoneNumber){
    if (!this.phoneNumbrReg.test(phoneNumber)) {
      wx.showToast({
        title: '手机号格式不正确！',
        mask: true,
        icon: "none",
        duration: 1500
      })
      return false;
    }
    return true;
  }
}

export default regCheck