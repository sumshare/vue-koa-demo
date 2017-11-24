// 通过babel-register在node中使用es6
// babel依赖
// {  
//   "dependencies": {  
//     "babel": "^6.23.0",  
//     "babel-core": "^6.24.1",  
//     "babel-preset-es2015": "^6.24.1",  
//     "babel-preset-react": "^6.24.1",  
//     "babel-preset-stage-1": "^6.24.1",  
//     "babel-register": "^6.24.1"  
//   }  
// }  
require("babel-core/register")({
    "presets": [
        ["env", {
            "targets": {
                "node": true
            }
        }]
    ]
});
// 启用app
require("./app.js")