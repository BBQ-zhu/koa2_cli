const fs = require('fs')
const path = require('path')
const control = require('./index')
const {
  Video
} = require('../models/videos')
const {
  scroimgs
} = require('../models/scroImg')

const {
  return200,
  return500
} = require('../config/error')

let dirname = {
  userImgDir: 'userImgs',
  schoolVideoDir: 'schoolVideo',
  scroImgsDir: 'scroImgs'
}

const userImg = async (ctx) => {
  return200('图片假上传', ctx.request.files.file.path, ctx)
}

const findScrollImg = async (ctx) => {
  await scroimgs.find().then(rel => {
    return200('查询轮播图列表成功', rel, ctx)
  })
}
const delateScrollImg = async (ctx) => {
  let {
    _id,
    fileName
  } = ctx.request.body
  const filePath = await path.resolve('public/uploads/' + dirname.scroImgsDir + '/' + fileName);
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
      await scroimgs.findOneAndDelete({
        _id
      }).then(rel => {
        return200('删除成功', rel, ctx)
      })
    } catch (e) {
      return500('删除失败', null, ctx)
    }
  } else {
    return200('给定的路径不存在，请给出正确的路径', null, ctx)
  }
}

const uploadScrollImg = async (ctx) => {
  var dir = dirname.scroImgsDir //定义上传目录
  var typeid = ctx.request.body.typeId
  let {
    name,
    path
  } = ctx.request.files.file
  await control.uploadFile(ctx, dir, name, path).then(async res => {
    console.log(res)
    var data = {
      typeid: typeid,
      scroimg: res
    }
    await scroimgs.create(data).then(rel => {
      return200('上传视频成功', rel, ctx)
    }).catch(err => {
      return500('上传视频失败', err, ctx)
    })
  }).catch(err => {
    return500('上传视频失败', err, ctx)
  })
}

const findVideo = async (ctx) => {
  await Video.find().then(rel => {
    return200('查询视频列表成功', rel, ctx)
  })
}

const delateVideo = async (ctx) => {
  let {
    _id,
    fileName
  } = ctx.request.body
  const filePath = path.resolve('public/uploads/' + dirname.schoolVideoDir + '/' + fileName);
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
      await Video.findOneAndDelete({
        _id
      }).then(rel => {
        console.log(rel)
        return200('删除成功', rel, ctx)
      })
    } catch (e) {
      return500('删除失败', null, ctx)
    }
  } else {
    return200('给定的路径不存在，请给出正确的路径', null, ctx)
  }
}
const uploadVideo = async (ctx) => {
  var dir = dirname.schoolVideoDir //定义上传目录
  var name = ctx.request.body.videoName
  let {
    path
  } = ctx.request.files.file
  name = name + '.' + path.split('.')[1]
  console.log(dir, name, path)
  await control.uploadFile(ctx, dir, name, path).then(async res => {
    console.log(res)
    var data = {
      videoname: name.split('.')[0],
      videourl: res
    }
    await Video.create(data).then(rel => {
      return200('上传视频成功', data, ctx)
    }).catch(err => {
      return500('上传视频失败', err, ctx)
    })
  }).catch(err => {
    return500('上传视频失败', err, ctx)
  })
}

const delateImg = (ctx) => {
  if (!ctx.request.body.fileName) {
    return200('无数据', null, ctx)
  }
  const filePath = path.resolve('public/uploads/' + dirname.userImgDir + '/' + ctx.request.body.fileName);
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
      return200('删除成功', null, ctx)
    } catch (e) {
      return500('删除失败', null, ctx)
    }
  } else {
    return200('给定的路径不存在，请给出正确的路径', null, ctx)
  }
}
const uploadImg = async (ctx) => {
  var dir = dirname.userImgDir //定义上传目录
  let {
    name,
    path
  } = ctx.request.body
  await control.uploadFile(ctx, dir, name, path).then(res => {
    return200('上传图片成功', res, ctx)
  }).catch(err => {
    return500('上传图片失败', err, ctx)
  })
}



module.exports = {
  userImg,
  uploadImg,
  delateImg,
  uploadVideo,
  findVideo,
  delateVideo,
  uploadScrollImg,
  findScrollImg,
  delateScrollImg
}
