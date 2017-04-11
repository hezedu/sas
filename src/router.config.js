import * as layout from './cmpt/layout';
//import * as test from './cmpt/test/index';

function docsOnEnter (nextState, replace){
  replace('/docs/sas/tasks');
}
export const navRoutes = [
  {path: 'docs', component: layout.Left, title: 'Docs', firstChildIndex: true,
    childRoutes:[
      {path: 'sas' , firstChildIndex: true,
        indexRoute: {onEnter: docsOnEnter},
        childRoutes:[
          {path: 'tasks', component: layout.Main},
          {path: 'end', component: layout.Main},
          {path: 'options', component: layout.Main}
        ]},
      {path: 'task' , firstChildIndex: true,
        childRoutes:[
          {path: 'this', component: layout.Main},
          {path: 'name', component: layout.Main},
          {path: 'callback', component: layout.Main},
          {path: 'i', component: layout.Main}
        ]}
      // {path: 'callback' , firstChildIndex: true,
      //   childRoutes:[
      //     {path: 'null', component: layout.Main},
      //     {path: '$up', component: layout.Main},
      //     {path: '$reload', component: layout.Main}
      //   ]},
      // {path: 'i' , firstChildIndex: true,
      //   childRoutes:[
      //     {path: 'index', component: layout.Main},
      //     {path: 'indexs', component: layout.Main},
      //     {path: 'upperIndex', component: layout.Main}
      //   ]}
    ]}

];

// function homeOnEnter (nextState, replace){
//   replace('/docs/start');
// }
export default {
  path: '/', component: layout.Root,
  childRoutes: [
    {component: layout.Top,
      indexRoute: {component: layout.Home},
      childRoutes:navRoutes},
    { path: '*', component: layout.Error}
  ]
};
