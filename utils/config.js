var config = 
{
    baseHost: {
      //requestHost: "http://localhost:6234",
      requestHost: "http://192.168.1.4",
      //requestHost: "http://192.168.0.105",
      //requestHost: "http://127.0.0.1"
      //fileServer: "http://localhost:6234",
      fileServer: "http://192.168.1.4",
      //fileServer: "http://192.168.0.105"
      //fileServer: "http://127.0.0.1"
    },
    authCodePurpose:{
      register:1,
      resetPassword:2,
      changePhoneNumber:3,
      other:4
    },
    communityUploadImgLimit:6,
    uploadImgSizeLimit: 1048576,
    qqMapSdkKey:"BLABZ-PQSKK-5OQJ5-ASXKG-M7RET-C4BJZ",
    pageSizeType:{
      centerPageSize:10
    }
};

module.exports = config;