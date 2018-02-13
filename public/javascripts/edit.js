//实例化编辑器
// var BaseURL = "/umeditor/";
var editCfg=JSON.parse($('#config').val());
var config = {
    // //工具栏上的所有的功能按钮和下拉框，可以在new编辑器的实例时选择自己需要的从新定义
    toolbar:[
    'source | undo redo | bold italic underline strikethrough | superscript subscript | forecolor backcolor | removeformat |',
    'insertorderedlist insertunorderedlist | selectall cleardoc paragraph | fontfamily fontsize' ,
    '| justifyleft justifycenter justifyright justifyjustify |',
    'link unlink | image',
    '| fullscreen', 'drafts'
    ]
};
config=Object.assign({},config,editCfg)
var um = UM.getEditor('myEditor', config);

