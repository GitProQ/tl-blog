<template>
  <div class="footer">
    <p class="footer-info">
      Power by NodeJs + NuxtJs,&nbsp;
      由<img class="footer__icon" src="/static/tencent-cloud.png" alt="腾讯云">腾讯云 提供云计算服务,&nbsp;
      本站已经稳稳地存活了 {{ configs.timeless }} 天
    </p>
    <p class="footer-copyright">
      <span>Copyright © 2018 - {{ configs.currentYear }} Timeless. All rights reserved. </span>
      <template v-if="configs.icp_beian">
        <a class="footer-copyright__link" href="http://www.beian.miit.gov.cn" rel="noopener noreferrer" target="_blank" title="工信部">{{ configs.icp_beian }}</a>
      </template>
      <template v-if="configs.police_beian">
        <a
          class="footer-copyright__link"
          :href="'http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=' + configs.police_beian_code"
          rel="noopener noreferrer"
          target="_blank"
          title="公网安备"
        >
          <img class="footer__icon" src="/static/icp-beian.png" alt="公网安备">{{ configs.police_beian }}
        </a>
      </template>
    </p>
  </div>
</template>

<script>
export default {
  props: {
    configs: {
      type: Object,
      default: () => {}
    }
  }
}
</script>
