module.exports = class extends think.Controller {
  indexAction() {
    return this.display('admin/index');
  }
};
