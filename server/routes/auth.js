import auth from '../controllers/user.js'
// 这里用require也可以，考虑到import以后兼容用import
import koa_router from 'koa-router'
const router = koa_router()

router.get('/user/:id', auth.getUserInfo) // 定义url的参数是id
router.post('/user', auth.postUserAuth)
    // jwt认证模式
    /*

    {
      "success": true,
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiYWRtaW4iLCJpZCI6MjksImlhdCI6MTUxMjAwNzQ4NX0.uKo5mYjVO3eQcHeooU8G0HuWgKajOMm3fGuIRorUtgw"
    }

    cookie:
    SID s%3AQNgBoA4grK_npMtyQHfsV4SAGwliD92s.sCxHie2G%2BlWr%2BOUXS7gIOwPIV%2FWddP%2FNYKLMinGXw8w
    _ga GA1.1.468678161.1503883489
    sessionStore:
    demo-token   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiYWRtaW4iLCJpZCI6MjksImlhdCI6MTUxMjAwNzQ4NX0.uKo5mYjVO3eQcHeooU8G0HuWgKajOMm3fGuIRorUtgw
    */

export default router