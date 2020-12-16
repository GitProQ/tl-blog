import Vue from 'vue'
import 'element-ui/lib/theme-chalk/display.css'
// 导入自己需要的组件
import {
  Pagination,
  Dialog,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Scrollbar,
  Slider,
  Menu,
  Submenu,
  MenuItem,
  Input,
  Select,
  Option,
  Button,
  ButtonGroup,
  RadioButton,
  RadioGroup,
  Form,
  FormItem,
  Tag,
  Table,
  TableColumn,
  Progress,
  Tooltip,
  Popover,
  Breadcrumb,
  BreadcrumbItem,
  Row,
  Col,
  Cascader,
  Rate,
  Image,
  Carousel,
  CarouselItem,
  Timeline,
  TimelineItem,
  Card,
  Loading,
  Notification,
  Message,
  Drawer
} from 'element-ui'

Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Dropdown)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)
Vue.use(Scrollbar)
Vue.use(Slider)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Input)
Vue.use(Select)
Vue.use(Option)
Vue.use(Button)
Vue.use(ButtonGroup)
Vue.use(RadioButton)
Vue.use(RadioGroup)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Tag)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Progress)
Vue.use(Tooltip)
Vue.use(Popover)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Row)
Vue.use(Cascader)
Vue.use(Rate)
Vue.use(Col)
Vue.use(Image)
Vue.use(Carousel)
Vue.use(CarouselItem)
Vue.use(Timeline)
Vue.use(TimelineItem)
Vue.use(Card)
Vue.use(Drawer)
Vue.use(Loading)

Vue.prototype.$ELEMENT = {
  size: 'small',
  zIndex: 2000
}

Vue.prototype.$notify = Notification
Vue.prototype.$message = Message
