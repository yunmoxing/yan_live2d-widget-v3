# Live2D Widget v3

一个基于 Live2D Cubism SDK for Web 的网页看板娘项目，当前仓库已调整为 **单模型版本**，默认加载 `魔女` 模型。

这个项目的目标不是做完整的 Live2D 编辑器，而是提供一套可以直接挂到博客或普通网页里的 `moc3` 看板娘方案。

## 特性

- 支持 `moc3` 模型
- 默认内置单模型 `魔女`
- 支持表情切换
- 支持点击动作
- 支持拖拽
- 支持截图
- 支持提示语和工具栏
- 默认停靠在页面右下角

## 当前默认配置

- 模型目录：`Resources/model/魔女/`
- 模型清单：`Resources/model_list.json`
- 工具栏按钮：
  - `hitokoto`
  - `asteroids`
  - `express`
  - `photo`
  - `info`
  - `quit`

这是一个单模型仓库，因此默认不再保留：

- `switch-model`
- `switch-texture`

## 目录结构

```text
live2d-widget-v3-main/
├─ Core/                         # Live2D Cubism Core
├─ Framework/                    # Cubism Framework 源码
├─ Demo/                         # 示例工程
├─ Resources/
│  ├─ model/
│  │  └─ 魔女/                   # 当前默认模型
│  └─ model_list.json            # 模型清单
├─ live2d-sdk.js                 # 打包后的运行入口
├─ waifu.css                     # 看板娘样式
├─ waifu-tips.js                 # 提示语与工具栏逻辑
└─ waifu-tips.json               # 提示语配置
```

## 快速使用

### 方式一：全部本地加载

适合本地调试，或者把整个目录部署到自己网站的静态资源目录。

```html
<script>
  const basePath = "/live2d-widget-v3-main";

  const config = {
    path: {
      homePath: "/",
      modelPath: basePath + "/Resources/",
      cssPath: basePath + "/waifu.css",
      tipsJsonPath: basePath + "/waifu-tips.json",
      tipsJsPath: basePath + "/waifu-tips.js",
      live2dCorePath: basePath + "/Core/live2dcubismcore.js",
      live2dSdkPath: basePath + "/live2d-sdk.js"
    },
    tools: ["hitokoto", "asteroids", "express", "photo", "info", "quit"],
    drag: {
      enable: true,
      direction: ["x", "y"]
    },
    switchType: "order"
  };

  if (screen.width >= 768) {
    Promise.all([
      loadExternalResource(config.path.cssPath, "css"),
      loadExternalResource(config.path.live2dCorePath, "js"),
      loadExternalResource(config.path.live2dSdkPath, "js"),
      loadExternalResource(config.path.tipsJsPath, "js")
    ]).then(() => {
      initWidget({
        homePath: config.path.homePath,
        waifuPath: config.path.tipsJsonPath,
        cdnPath: config.path.modelPath,
        tools: config.tools,
        dragEnable: config.drag.enable,
        dragDirection: config.drag.direction,
        switchType: config.switchType
      });
    });
  }

  function loadExternalResource(url, type) {
    return new Promise((resolve, reject) => {
      let tag;
      if (type === "css") {
        tag = document.createElement("link");
        tag.rel = "stylesheet";
        tag.href = url;
      } else if (type === "js") {
        tag = document.createElement("script");
        tag.src = url;
      }

      if (tag) {
        tag.onload = () => resolve(url);
        tag.onerror = () => reject(url);
        document.head.appendChild(tag);
      }
    });
  }
</script>
```

### 方式二：引擎走 CDN，模型走本地

如果你想减小本地静态资源体积，可以把引擎脚本和样式放 CDN，把模型资源保留在自己站点本地。

```html
<script>
  const engineCdn = "https://your-cdn.example/live2d";
  const localModelPath = "/live2d/Resources/";

  const config = {
    path: {
      homePath: "/",
      modelPath: localModelPath,
      cssPath: engineCdn + "/waifu.css",
      tipsJsonPath: engineCdn + "/waifu-tips.json",
      tipsJsPath: engineCdn + "/waifu-tips.js",
      live2dCorePath: engineCdn + "/Core/live2dcubismcore.js",
      live2dSdkPath: engineCdn + "/live2d-sdk.js"
    }
  };
</script>
```

## 模型配置

### 1. 模型清单

`Resources/model_list.json`

当前默认写法：

```json
{
  "models": [
    ["魔女"]
  ],
  "messages": [
    ["你好，我是魔女"]
  ]
}
```

### 2. 模型位置与缩放

`Resources/model/魔女/config.json`

```json
{
  "scale": 1.8,
  "translate": {
    "x": 0,
    "y": -0.8
  }
}
```

参数说明：

- `scale`：模型缩放
- `translate.x`：水平偏移
- `translate.y`：垂直偏移

### 3. 表情与动作

`Resources/model/魔女/魔女.model3.json`

当前已经配置了：

- `Expressions`
- `Motions.Idle`
- `Motions.TapBody`
- `HitAreas`

因此默认支持：

- 随机表情
- 待机动作
- 点击播放动作

## 常用修改点

### 改模型大小和位置

修改：

```text
Resources/model/魔女/config.json
```

### 改模型动作和表情

修改：

```text
Resources/model/魔女/魔女.model3.json
```

### 改挂件位置和样式

修改：

```text
waifu.css
```

### 改提示语

修改：

```text
waifu-tips.json
```

## 开发说明

`Demo/` 目录提供了示例工程，可以用于本地调试和重新打包资源。

常用命令：

```bash
cd Demo
npm install
npm run start
```

构建：

```bash
cd Demo
npm install
npm run build
```

## 适用场景

- Hugo 博客
- Hexo 博客
- 普通静态网站
- 个人主页

## 注意事项

- 当前仓库只面向 `moc3` 模型
- 不兼容旧版 `moc` 模型
- 单模型场景下，不建议启用模型切换按钮
- 如果模型显示过大或过低，优先调整 `config.json`

## 致谢

- [Live2D Cubism SDK for Web](https://www.live2d.com/)
- [stevenjoezhang/live2d-widget](https://github.com/stevenjoezhang/live2d-widget)
