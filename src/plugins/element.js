import {
    Aside,
    Breadcrumb,
    BreadcrumbItem,
    Button,
    Container,
    Form,
    FormItem,
    Header,
    Input,
    Main,
    Menu,
    MenuItem,
    Message,
    Submenu,
    Card,
    Select,
    Option,
    Row,
    Col,
    Table,
    TableColumn,
    Switch,
    Tooltip,
    Pagination,
    Dialog,
    MessageBox,
    Tag,
    Tree,
    Cascader,
    Alert,
    Image,
    Checkbox,
    CheckboxGroup
} from 'element-ui'
import Vue from 'vue'
Vue.use(Button)
Vue.use(Image)
Vue.use(CheckboxGroup)
Vue.use(Checkbox)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Select)
Vue.use(Option)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Cascader)
Vue.use(Alert)
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm