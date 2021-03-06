const Rest = require('../rest');

module.exports = class extends Rest {
  async getAction() {
    if (this.id) {
      const data = await this.modelInstance.where({ id: this.id }).find();

      return this.success(data);
    } else {
      const { page, pageSize } = this.get();
      const field = 'id,parent_id,content,addtime,name,reply_name,type,is_show';

      const list = await this.modelInstance
        .field(field)
        .order('addtime DESC')
        .page(page, pageSize)
        .countSelect();

      return this.success(list);
    }
  }

  // 回复评论
  async postAction() {
    let data = this.post();
    data = {
      ...data,
      ...{
        addtime: new Date(),
        is_admin: 1
      }
    };
    const insertId = await this.modelInstance.add(data);

    if (insertId) {
      return this.success();
    } else {
      return this.fail();
    }
  }

  async putAction() {
    // 列表页更新
    const list = this.post('list');
    if (list) {
      const rows = await this.modelInstance.updateMany(list);

      if (rows) {
        return this.success();
      } else {
        return this.fail();
      }
    }

    if (!this.id) {
      return this.fail('CONTENT_NOT_EXIST');
    }

    const data = this.post();
    const row = await this.modelInstance.where({ id: this.id }).update(data);

    if (row) {
      return this.success('更新成功');
    } else {
      return this.fail('更新失败');
    }
  }

  // 删除评论
  async deleteAction() {
    const list = this.post('list');
    if (!list.length) {
      return this.fail('CONTENT_NOT_EXIST');
    }

    const promises = [];
    list.forEach(async(item) => {
      const id = item.id;
      const exist = await this.modelInstance.where({ id }).count('id');
      let step;
      if (exist) {
        step = this.modelInstance.where({ id }).delete();
      }
      promises.push(step);
    });
    await Promise.all(promises);

    return this.success();
  }
};
