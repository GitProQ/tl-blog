const Base = require('./base')

// session过期时间 = 记录登录状态?15天:1天
const rememberSessionOpt = {
  maxAge: 15 * 24 * 3600 * 1000
}
const normalSessionOpt = {
  maxAge: 24 * 3600 * 1000
}

module.exports = class extends Base {
  constructor(...arg) {
    super(...arg)
    this.modelInstance = this.model('admin')
  }
  /**
   * login 登录
   * @return {Object} { token: access_token, expires: 令牌有效期 }
   */
  async loginAction() {
    const { username, password, captcha, remember } = this.post()
    const userInfo = await this.modelInstance.where({ username: username }).find()
    // 校验验证码 不区分大小写
    const svgcaptcha = await this.cookie('captcha') || ''
    if (think.isEmpty(captcha) || captcha.toUpperCase() !== svgcaptcha.toUpperCase()) {
      return this.fail('验证码不正确')
    }
    // 校验用户名
    if (think.isEmpty(userInfo)) {
      return this.fail('帐户不存在')
    }
    // 校验密码
    if (!this.modelInstance.checkPassword(userInfo, password)) {
      return this.fail('密码不正确')
    }
    const IP = this.ctx.ip
    userInfo.login_ip = IP.indexOf('::ffff:') !== -1 ? IP.substring(7) : IP
    await this.modelInstance.updateLoginInfo(userInfo)

    delete userInfo.password
    const expires = remember ? rememberSessionOpt : normalSessionOpt
    const token = await this.session('userInfo', {
      id: userInfo.id,
      username: userInfo.username
    }, expires)

    return this.success({ token, expires })
  }

  /**
   * getInfo 获取登录用户的信息
   */
  async getInfoAction() {
    const { id } = await this.session('userInfo') || {}
    let userInfo = {}
    if (id) {
      userInfo = await this.modelInstance.where({ id }).find()
    }
    return this.success(userInfo)
  }

  /**
   * logout 注销
   * @return {}
   */
  async logoutAction() {
    await this.session('userInfo', null)
    return this.success()
  }

  /**
   * 更新管理员账户的信息
   */
  async updateAction() {
    const data = this.post()
    const rows = await this.modelInstance.saveAdmin(data, this.ctx.ip)
    if (rows) {
      await this.session('userInfo', '')
      return this.success(rows)
    } else {
      return this.fail()
    }
  }

  /**
   * 忘记密码发验证邮件
   */
  async forgotAction() {
    const username = this.post('username')
    const email = this.post('email')
    const user = await this.modelInstance.where({
      username: username,
      email: email
    }).find()

    if (think.isEmpty(user)) {
      return this.fail('查无此人')
    }
    if (!user.email) {
      return this.fail('该用户未设置邮箱，不能使用找回密码功能')
    }

    const config = await this.model('config').getConfig()

    const Transporter = think.service('nodemailer', 'common', config)

    const resetTime = Date.now()
    const resetToken = think.md5(user.email + resetTime + Math.random())
    const resetUrl = config.siteurl + `admin/login?reset=1&token=${resetToken}`
    const options = {
      from: config.email_usename, // sender address
      to: user.email, // list of receivers
      subject: `😋【${config.sitename}】密码重置`, // 邮件主题
      html: `你好，${user.username}，点击 ${resetUrl} 进行密码重置，该地址有效期为 1 小时，请及时修改密码。如果您没有申请过密码重置，请忽略该邮件！`
    }

    const info = await Transporter.sendMail(options)
    if (info.messageId) {
      this.success('重置密码邮件发送成功')
    } else {
      this.fail('邮件发送失败')
    }
  }

  /**
   * 重置密码
   */
  async resetAction() {
    const userInfo = await this.session('userInfo') || {}
    if (!think.isEmpty(userInfo)) {
      return this.success()
    }

    if (this.isPost) {
      const { password, token } = this.post()

      const user = await think.cache(token)
      if (think.isEmpty(user)) {
        return this.fail('查无此人')
      }

      const findUser = await this.modelInstance.where({ name: user }).find()
      if (think.isEmpty(findUser)) {
        return this.fail('查无此人')
      }

      const rows = await this.modelInstance.saveAdmin({
        password,
        id: findUser.id
      }, this.ctx.ip)
      await think.cache(token, null)
      return this.success(rows)
    }
    return this.success()
  }

  async captchaAction() {
    const options = this.get()
    const Svg = think.service('captcha', 'common', options)
    const { text, data } = Svg.createCaptcha()
    await this.cookie('captcha', text, { // 设定 cookie 时指定额外的配置
      maxAge: 60 * 60 * 1000 // 1小时超时时间
    })
    this.success(data)
  }
}
