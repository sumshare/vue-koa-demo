import user from '../models/user.js'
// 从koa-jwt的依赖包获取的
import jwt from 'jsonwebtoken'
// 加密模块
import bcrypt from 'bcryptjs'

const getUserInfo = async function(ctx) {
    const id = ctx.params.id // 获取url里传过来的参数里的id
    const result = await user.getUserById(id) // 通过await “同步”地返回查询结果
    console.log(result)
    ctx.body = result // 将请求的结果放到response的body里返回
}

const postUserAuth = async function(ctx) {
    const data = ctx.request.body // post过来的数据存在request.body里

    const userInfo = await user.getUserByName(data.name)
    console.log(ctx.request)
    if (userInfo != null) { // 如果查无此用户会返回null

        // 虽然对同一个密码，每次生成的hash不一样，但是hash中包含了salt（hash产生过程：先随机生成salt，salt跟password进行hash）；
        // 在下次校验时，从hash中取出salt，salt跟password进行hash；
        // 得到的结果跟保存在DB中的hash进行比对，
        // compareSync中已经实现了这一过程：bcrypt.compareSync(password, hashFromDB);
        // 数据库中的密码$2a$10$x3f0Y2SNAmyAfqhKVAV.7uE7RHs3FDGuSYw.LlZhOFoyK7cjfZ.Q6

        /*
          举例说明
          const bcrypt = require('bcryptjs');
          const password = "123";

          // Step1: Generate Hash
          // salt is different everytime, and so is hash

          let salt = bcrypt.genSaltSync(10);// 10 is by default
          console.log(salt);//$2a$10$TnJ1bdJ3JIzGZC/jVS.v3e

          let hash = bcrypt.hashSync(password, salt); // salt is inclued in generated hash 
          console.log(hash);//$2a$10$TnJ1bdJ3JIzGZC/jVS.v3eXlr3ns0hDxeRtlia0CPQfLJVaRCWJVS

          // Step2: Verify Password
          // when verify the password, get the salt from hash, and hashed again with password
          
          let saltFromHash = hash.substr(0, 29);
          console.log(saltFromHash);//$2a$10$TnJ1bdJ3JIzGZC/jVS.v3e
          
          let newHash = bcrypt.hashSync(password, saltFromHash);
          console.log(newHash);//$2a$10$TnJ1bdJ3JIzGZC/jVS.v3eXlr3ns0hDxeRtlia0CPQfLJVaRCWJVS
          console.log(hash === newHash); //true

          // back end compare
          console.log(bcrypt.compareSync(password, hash)); //true



        */
        if (!bcrypt.compareSync(data.password, userInfo.password)) {
            ctx.body = {
                success: false, // success标志位是方便前端判断返回是正确与否
                info: '密码错误！'
            }
        } else {
            const userToken = {
                name: userInfo.user_name,
                id: userInfo.id
            }
            const secret = 'vue-koa-demo' // 指定密钥
            const token = jwt.sign(userToken, secret) // 签发token
            ctx.body = {
                success: true,
                token: token // 返回token
            }
        }
    } else {
        ctx.body = {
            success: false,
            info: '用户不存在！' // 如果用户不存在返回用户不存在
        }
    }
}

export default {
    getUserInfo,
    postUserAuth
}