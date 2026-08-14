# Gadgets

这里是个人小工具的公开发行中心，不是源码仓库。

它保存三类可公开访问的文件：

- 桌面应用的安装包和更新清单。
- 可直接访问的网页应用构建产物。
- 发行所需的少量公开元数据。

各个工具的源码、测试、开发文档和密钥仍保留在各自的私有仓库中。网页应用的浏览器端构建文件必须公开，访问者才能使用它，但这不等于公开源码仓库。

## Web apps

- [Spatial Deck Studio](https://yriccch.github.io/gadgets/spatial-deck-studio/)：在空间画布中编排页面，并导出带相机运动的独立 HTML 演示文稿。
- [Travel Map Studio](https://yriccch.github.io/gadgets/travel-map-studio/)：在一张地图里整理旅行地点、路线和备注。

## Layout

```text
gadgets/
├─ TodoFlow_*.exe
├─ todoflow-latest.json
├─ spatial-deck-studio/    # built static files only
└─ travel-map-studio/      # built static files only
```

GitHub Pages should publish the `main` branch from the repository root. New web apps should each use their own top-level folder, so they do not conflict with one another.
