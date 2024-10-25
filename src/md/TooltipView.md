# Tooltip

在PC端布局中，我们会遇到文案显示不下自适应...，在 css 中设置 `overflow: hidden; text-overflow: ellipsis; white-space: nowrap;` ，我们又想在有滚动条的时候，鼠标悬停在文字上的时候，能显示完整的内容，但使用 Tooltip 组件，没法自适应宽度调整的时候是否需要显示 Tooltip 组件。

这个时候就需要我们自己检测内容宽度是否需要...，然后通过设置 Tooltip 组件的 `disabled` 属性。

## 例子
