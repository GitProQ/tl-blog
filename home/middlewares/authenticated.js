export default function ({ store, redirect }) {
  // If the user is not authenticated
  if (!store.state.auth) {
    return redirect('/admin/login')
  }
  const hasGetUserInfo = store.getters.userinfo.username
  if(!hasGetUserInfo) {
    return Promise.all([
      store.dispatch('user/getInfo'),
      store.dispatch('list/getCategory'),
      store.dispatch('config/getConfigs')
    ])
  }
}
