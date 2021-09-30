const fs = require('fs')
const Path = require('path')
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
  schoolVideoImgDir:'schoolVideoImg',
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
  const filePath = await Path.resolve('public/uploads/' + dirname.scroImgsDir + '/' + fileName);
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
  var {typeid,link} = ctx.request.body
  let {
    name,
    path
  } = ctx.request.files.file
  await control.uploadFile(ctx, dir, name, path).then(async res => {
    var data = {
      typeid,
      link,
      scroimg: res
    }
    await scroimgs.create(data).then(rel => {
      return200('上传轮播图成功', rel, ctx)
    }).catch(err => {
      return500('上传轮播图失败', err, ctx)
    })
  }).catch(err => {
    return500('上传轮播图失败', err, ctx)
  })
}

const findVideo = async (ctx) => {
  await Video.find().then(rel => {
    return200('查询视频列表成功', rel, ctx)
  })
}

//上传视频封面
const uploadVideoImg = async (ctx) => {
  let oldname = ctx.request.body.videoImg
  let {
    name,
    path
  } = ctx.request.files.file
  if (oldname) {
    var nameArr = oldname.split('/')
    const filePath = Path.resolve('public/uploads/' + dirname.schoolVideoImgDir + '/' + nameArr[nameArr.length - 1]);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
  await control.uploadFile(ctx, dirname.schoolVideoImgDir, name, path).then(res => {
    return200('上传图片成功', res, ctx)
  }).catch(err => {
    return500('上传图片失败', err, ctx)
  })
}
const delateVideoImg = async (ctx) => {
  let {
    videoImg
  } = ctx.request.body
  var nameArr = videoImg.split('/')
  const filePath = Path.resolve('public/uploads/' + dirname.schoolVideoImgDir + '/' + nameArr[nameArr.length - 1]);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    return200('删除图片成功', null, ctx)
  } else {
    return500('删除图片失败', null, ctx)
  }
}

const delateVideo = async (ctx) => {
  let {
    _id,
    fileName
  } = ctx.request.body
  const filePath = Path.resolve('public/uploads/' + dirname.schoolVideoDir + '/' + fileName);
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
      await Video.findOneAndDelete({
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
const uploadVideo = async (ctx) => {
  var dir = dirname.schoolVideoDir //定义上传目录
  var {videoName,videoImg} = ctx.request.body
  let {
    name,
    path
  } = ctx.request.files.file
  name = name + '.' + path.split('.')[1]
  await control.uploadFile(ctx, dir, name, path).then(async res => {
    var data = {
      videoname: videoName,
      videourl: res,
      videoimg:videoImg
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

const delateUserImg = (ctx) => {
  if (!ctx.request.body.fileName) {
    return200('无数据', null, ctx)
  }
  const filePath = Path.resolve('public/uploads/' + dirname.userImgDir + '/' + ctx.request.body.fileName);
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
const uploadUserImg = async (ctx) => {
  // var dir = dirname.userImgDir //定义上传目录
  // let {
  //   name,
  //   path
  // } = ctx.request.files.file
  // await control.uploadFile(ctx, dir, name, path).then(res => {
  //   return200('上传图片成功', res, ctx)
  // }).catch(err => {
  //   return500('上传图片失败', err, ctx)
  // })
  let oldname = ctx.request.body.imgurl
    let {
        name,
        path
    } = ctx.request.files.file
    if (oldname) {
        var nameArr = oldname.split('/')
        const filePath = Path.resolve('public/uploads/' + dirname.userImgDir + '/' + nameArr[nameArr.length - 1]);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath)
        }
    }
    await control.uploadFile(ctx, dirname.userImgDir, name, path).then(res => {
        return200('上传图片成功', res, ctx)
    }).catch(err => {
        return500('上传图片失败', err, ctx)
    })
}



module.exports = {
  userImg,
  uploadUserImg,
  delateUserImg,
  uploadVideo,
  findVideo,
  delateVideo,
  uploadScrollImg,
  findScrollImg,
  delateScrollImg,
  uploadVideoImg,
  delateVideoImg
}
