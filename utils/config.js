var config = 
{
    baseHost: {
    requestHost: "http://localhost:6234"
    //requestHost: "http://192.168.7.106"
    //requestHost: "http://127.0.0.1"
    },
    authCodePurpose:{
      register:1,
      resetPassword:2,
      changePhoneNumber:3,
      other:4
    }

};

module.exports = config;