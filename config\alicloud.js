const RPCClient = require('@alicloud/pop-core');
const params = {
  RegionId: "cn-hangzhou",
  PhoneNumbers: "",
  SignName: "铸力",
  TemplateCode: "SMS_183375098",
} 

const clientConfig = {
  accessKeyId: 'LTAI4Fp4B9R1XcNMnzskqZ7e',
  accessKeySecret: 'UDf2eG6haadrNam3RDeHfA5qvVreZ0',
  endpoint: 'https://dysmsapi.aliyuncs.com',
  apiVersion: '2017-05-25'
}

class MessageClient {
  constructor(PhoneNumbers, code) {
    this.client = new RPCClient(clientConfig)
    this.params = {
      ...params,
      PhoneNumbers,
      TemplateParam: `{"code":${code}}`
    }
  }
  send() {
    return this.client.request('SendSms', this.params, {
      method: 'POST'
    })
  }
}
class code {
  constructor() {
    this.code = false
  }

  sendCode(code){
    this.code = code
  }

  checkCode(code){
    if(this.code == code){
      return true
    }else{
      return false
    }
  }
}
module.exports = {
  MessageClient,
  code
};
