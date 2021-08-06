
const return200 = (msg,data,ctx)=>{
  ctx.body={
    code:200,
    msg:msg || '操作成功!',
    data:data || []
  }
}

const return500 = (msg,data,ctx)=>{
   ctx.body={
    code:500,
    msg:msg || '操作失败!',
    data:data || []
  }
}

module.exports = {
  return200,
  return500
}
