import { Component, PropTypes} from 'react';
import { Link } from 'react-router';
import style from '../css/style.scss';
import NavTree from './tree.jsx';
import {navRoutes} from '../router.config';
import find from 'lodash/find';
import virgin from 'virgin';
window.sas = require('sas');
//======================router======================
export class Root extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired
  };
  componentWillMount(){
    virgin.router = this.context.router;
    virgin.location = this.props.location;
  }
  render() {
    return this.props.children;
  }
}


//======================上导航======================
function topNavOnEnter (nextState, replace){
  replace(this.IndexRedirect);
}
export class Top extends Component {
  NavList(){
    const arr = [];
    navRoutes.forEach((v, i) => {
      if(v.path){
        v.path = v.path[0] !== '/' ? `/${v.path}` : v.path;
        if(typeof v.firstChildIndex && v.childRoutes && v.childRoutes[0]){
          v.indexRoute = {
            IndexRedirect : v.path + '/' + (v.childRoutes[0].path || ''),
            onEnter : topNavOnEnter
          };
        }
        arr.push(<Link to={v.path} key={v.path + i} activeClassName={style.active}>{v.title}</Link>);
      }
    });
    return arr;
  }
  render() {
    return (
      <div className='height100'>
        <div className={style.topNavWarp}>
          <Link className={style.title} to="/">Sas</Link>
          <div className={style.topNav}>
            {this.NavList()}
          </div>
          <div className={style.topRightBar}>
            <div className={style.langBar}>
              <span>English</span>
              <a href='https://hezedu.github.io/sas-cn-docs/'>
              中文
              </a>
            </div>

          <a href='https://github.com/hezedu/sas' className={style.githubIcon}>
          <img src={window.SERVER_CONFIG.BASE_STATIC + '/static/pinned-octocat.svg'} />
          </a>
          </div>
        </div>
        <div className={style.bottomWarp}>
          {this.props.children}
        </div>
      </div>
    );
  }
}

//======================左导航======================
export class Left extends Component {
  mountNav(){
    const key = this.props.route.path;
    const prop = {
      rootPath: key,
      list: find(navRoutes, {path: key}).childRoutes
    };
    return <NavTree {...prop} />;
  }
  render() {
    return (
      <div>
        <ul className={style.leftNav}>
          {this.mountNav()}
        </ul>
        <div className={style.mainWarp}>
            {this.props.children}
        </div>
      </div>
    );
  }
}

//======================主展示区======================

// const hljs = {
//   initHighlighting: function(){}
// };
const hljs = require('highlight.js/lib/highlight');
require('github-markdown-css');
require('highlight.js/styles/github.css');
hljs.registerLanguage('js', require('highlight.js/lib/languages/javascript'));
hljs.registerLanguage('css', require('highlight.js/lib/languages/css'));
// hljs.configure({
//   tabReplace: '  '
// })

var homeMd = require('../md/README.md');
//======================默认首页======================
export class Home extends Component {

  render() {
    return (
      <Main html={homeMd} />
    );
  }
}


export class Main extends Component {
  loadHtml(){
    const path = this.props.filePath || (this.props.route && (this.props.route.link || this.props.route.path));
    const html = this.props.html || require(`../md${path}.md`);
    return html;
  }
  componentDidMount(){
    hljs.initHighlighting.called = false;
    hljs.initHighlighting();
  }
  componentDidUpdate(){
    hljs.initHighlighting.called = false;
    hljs.initHighlighting();
  }
  render() {
    if(this.props.children){
      return this.props.children;
    }
    return (
      <div className='markdown-body' dangerouslySetInnerHTML={{__html:this.loadHtml()}}/>
    );
  }
}

//======================错误页（目前仅支持404）======================
export class Error extends Component {//router
  render() {
    return (
      <div className={style.homeTitle}>
        <big>404</big>
        <small>notFound</small>
        <br/>
        <Link to='/'>返回首页</Link>
      </div>
    );
  }
}
