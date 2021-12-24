const return200 = (msg, data, ctx) => {
    ctx.body = {
        code: 200,
        msg: msg || '操作成功!',
        data: data || []
    }
}

const return500 = (msg, data, ctx) => {
    ctx.body = {
        code: 500,
        msg: msg || '操作失败!',
        data: data || []
    }
}

const dateTime =()=>{
    let date = new Date() 
    let Year = date.getFullYear()
    let Month = date.getMonth()+1>=10 ? date.getMonth()+1 : '0' + (date.getMonth()+1)
    let Day = date.getDate()>=10 ? date.getDate() : '0' + date.getDate()
    let Hours = date.getHours()>=10 ? date.getHours() : '0' + date.getHours()
    let Minutes = date.getMinutes()>=10 ? date.getMinutes() : '0' + date.getMinutes()
    let Seconds = date.getSeconds()>=10 ? date.getSeconds() : '0' + date.getSeconds()
    let time = `${Year}/${Month}/${Day} ${Hours}:${Minutes}:${Seconds}`
    return time
}

module.exports = {
    return200,
    return500,
    dateTime
}
