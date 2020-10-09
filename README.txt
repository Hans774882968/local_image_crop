大致实现的是类似用户主页那种”编辑头像“。
1-handleFiles()做了些常规的文件拓展名检查，然后调用init()重置全局变量……
2-paintImage(url)传入的url是原始图片数据，这不是我们想要的。我们要的是自适应大小以后的图片数据，即canvas里的图片数据。因此我们先调好new_img的宽高，然后把canvas的宽高调成new_img的。调整方法：
如果两侧至少1侧大于300px，则总是让更宽的那侧恰好为300px，而宽高比保持不变。然后有比例式：imgW / imgH = new_img.width / new_img.height。如此即可轻松写出调宽高的代码~
3-生成覆盖层。先生成一片黑(cover_box.fillStyle = "rgba(0,0,0,0.5)";)，然后挖掉一部分，那部分用sx,sy,sWidth,sHeight表示，后面实时调节。而预览区用完整的图片，并控制左上角坐标(sx,sy)来达到展示部分的效果。
4-拖拽。v1使用了以mousemove为主体，mousedown为记录数据中心的方法来实现拖拽。实现起来效果不错。
而v2用的是h5的ondrag，首先不能去掉那个残影，然后cursor是禁止而非期望的move是因为canvas填满了父元素，暂时没有想到补救办法。