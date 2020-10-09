"use strict";

(() => {
    let regional = document.getElementById('label'),
        img = document.getElementById("canvas"),
        editBox = document.getElementById("cover_box"),
        showEdit = document.getElementById("show_edit"),
        showPic = document.getElementById("show_pic");
    let px = 0,py = 0,imgW = 0,imgH = 0;//图相对label盒子的坐标；图的自适应大小
    let sx = 15,sy = 15,sHeight = 100,sWidth = 100;//裁剪区域左上角坐标和宽高
    let oldMouseX = 0,oldMouseY = 0,old_sx = 0,old_sy = 0;
    let imgData = "";
    
    document.getElementById('post_file').onchange = handleFiles;
    
    document.getElementById("save").onclick = function(){
        let tmpCanvas = document.createElement("canvas");
        let editPic = tmpCanvas.getContext("2d");
        let tmpImg = new Image();
        tmpImg.src = imgData;
        editPic.drawImage(tmpImg,sx,sy,sWidth,sHeight,0,0,sWidth,sHeight);
        document.querySelector("#show_pic img").src = tmpCanvas.toDataURL();
    }
    
    function init(){
        px = 0;py = 0;imgW = 0;imgH = 0;
        sx = 15;sy = 15;sHeight = 100;sWidth = 100;
        oldMouseX = 0;oldMouseY = 0;old_sx = 0;old_sy = 0;
        imgData = "";
    }
    
    function judge_file_type(fp){
        let suff = fp.substring(fp.lastIndexOf(".") + 1);
        return ["gif","jpeg","jpg","png"].indexOf(suff) !== -1;
    }
    
    function handleFiles(){
        if(!judge_file_type(this.value)){
            alert("请选择图片文件！");
            return;
        }
        init();
        let f = this.files[0];
        let oFReader = new FileReader();
        oFReader.readAsDataURL(f);
        oFReader.onload = function(oFREvent){
            //oFREvent.target.result：base64的图片数据
            paintImage(oFREvent.target.result);
        }
    }
    
    function paintImage(url){
        let canvas = img.getContext("2d");
        let new_img = new Image();
        new_img.src = url;
        new_img.onload = function(){
            let totW = regional.offsetWidth,totH = regional.offsetHeight;
            //如果宽高都有剩余
            if(new_img.width <= totW && 
               new_img.height <= totH){
                imgW = new_img.width;
                imgH = new_img.height;
            }
            else{
                //如果width较小，则让height（大的）填满。总是保持原图比例。
                if(new_img.width < new_img.height){
                    imgW = new_img.width / new_img.height * totH;
                    imgH = totH;
                }
                else{
                    imgW = totW;
                    imgH = new_img.height / new_img.width * totW;
                }
            }
            img.width = imgW;
            img.height = imgH;
            px = (totW - imgW) / 2;
            py = (totH - imgH) / 2;
            img.style.left = `${px}px`;
            img.style.top = `${py}px`;
            canvas.drawImage(new_img,0,0,imgW,imgH);
            imgData = img.toDataURL();//从canvas取出自适应后的图片
            getCoverArea();
        };
    }
    
    function getCoverArea(){
        editBox.width = imgW;
        editBox.height = imgH;
        editBox.style.left = `${px}px`;
        editBox.style.top = `${py}px`;
        editBox.style.display = "block";
        let cover_box = editBox.getContext("2d");
        cover_box.fillStyle = "rgba(0,0,0,0.5)";
        cover_box.fillRect(0,0,imgW,imgH);
        cover_box.clearRect(sx,sy,sWidth,sHeight);
        showEdit.style.background = `url(${imgData}) -${sx}px -${sy}px no-repeat`;
        showEdit.style.width = `${sWidth}px`;
        showEdit.style.height = `${sHeight}px`;
    }
    
    editBox.ondrag = function(e){
        let curMouseX = e.pageX - regional.offsetLeft - this.offsetLeft,
            curMouseY = e.pageY - regional.offsetTop - this.offsetTop;
        if(curMouseX < sx || curMouseX > sx + sWidth || 
           curMouseY < sy || curMouseY > sy + sHeight){
            e.dataTransfer.dropEffect = "auto";//无法改变那个”禁止“图标
            return;
        }
        e.dataTransfer.dropEffect = "move";//无法改变那个”禁止“图标
        let new_sx = curMouseX - oldMouseX + old_sx,
            new_sy = curMouseY - oldMouseY + old_sy;
        sx = new_sx < 0 ? 0 : (new_sx + sWidth > imgW ? imgW - sWidth : new_sx);
        sy = new_sy < 0 ? 0 : (new_sy + sHeight > imgH ? imgH - sHeight : new_sy);
        getCoverArea();
    }
    
    editBox.onmousemove = function(e){
        oldMouseX = e.pageX - regional.offsetLeft - this.offsetLeft;
        oldMouseY = e.pageY - regional.offsetTop - this.offsetTop;
        old_sx = sx;old_sy = sy;
        if(oldMouseX > sx && oldMouseX < sx + sWidth && 
           oldMouseY > sy && oldMouseY < sy + sHeight){
            this.style.cursor = "move";
        }
        else this.style.cursor = "auto";
    }
})();