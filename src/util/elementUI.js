import Vue from 'vue'
// const Vue = () => import('vue')
import {
  Header,
  Aside,
  Main,
  Container,
  // Autocomplete,
  Button,
  Input,
  // Checkbox,
  // CheckboxButton,
  // CheckboxGroup,
  Select,
  Option,
  Col,
  // Switch,
  // DatePicker,
  // TimePicker,
  Image,
  Upload,
  Message,
  MessageBox,
  Form,
  FormItem,
  Pagination,
  Tag,
  Table,
  TableColumn,
  Menu,
  Submenu,
  MenuItem,
  Breadcrumb,
  BreadcrumbItem,
  Footer
} from 'element-ui';

Message.install = (Vue, options) => {
  Vue.prototype.$message = Message
}

MessageBox.install = (Vue, options) => {
  // Vue.prototype.$MessageBox = Message
  Vue.prototype.$confirm = MessageBox.confirm
}

Vue.use(Header);
Vue.use(Aside);
Vue.use(Main);
Vue.use(Container);
// Vue.use(Autocomplete);
Vue.use(Button);
Vue.use(Input);
// Vue.use(Checkbox);
// Vue.use(CheckboxButton);
// Vue.use(CheckboxGroup);
Vue.use(Select);
Vue.use(Option);
Vue.use(Col);
// Vue.use(Switch);
// Vue.use(DatePicker);
// Vue.use(TimePicker);
Vue.use(Image);
Vue.use(Upload);
Vue.use(Message);
Vue.use(MessageBox);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Pagination);
Vue.use(Tag);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Menu);
Vue.use(Submenu);
Vue.use(MenuItem);
Vue.use(Breadcrumb);
Vue.use(BreadcrumbItem);
Vue.use(Footer);